/*
 * Lyric view: DOM passes the mount runs on its own rows after inserting the
 * rendered markup.
 *
 * 1. Chant segment colouring: wraps the chant parts of a line's own
 *    jpSegments / trSegments in `.seg-chant`.
 * 2. Karaoke units: splits `.lyric-jp` / `.lyric-romaji` text into
 *    `.karaoke-unit` spans and gives each unit its start and end time.
 *
 * Every node is created with the row's own document, so the same code
 * works in the page and in the Document PiP window.
 */
import type { LyricLine, LyricSegment } from "../catalogue/assemble";
import { ICON_TOKEN_RE } from "../ui/text";
import { hasChantSegment, lineHasChantSegments, type ReadingMode } from "./rows";
import { karaokeUnitWeight, ROMAJI_WORD_CHAR_RE, ROMAJI_WORD_CONTINUATION_RE, type TimedLine } from "./timing";

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;
const JAPANESE_RE = /[ぁ-ゖ゠-ヿ一-鿿]/u;

/* ---------- 分段合唱標色 ----------
   jpSegments／trSegments 把一行切成分段。畫面照常用整行字串渲染，渲染後
   再依分段把合唱段包成 .seg-chant。比對時略過空白與動作圖示，因為中日英
   之間的空白是顯示層另外補上的。 */

const isLyricSpace = (ch: string) => /\s/u.test(ch);

/* 依分段原文逐字標記：每個非空白字元對應 true（合唱）或 false。 */
function segmentChantMask(segments: LyricSegment[]): boolean[] {
  const mask: boolean[] = [];
  segments.forEach(seg => {
    const text = String((seg && seg.text) || "").replace(ICON_TOKEN_RE, "");
    Array.from(text).forEach(ch => {
      if (!isLyricSpace(ch)) mask.push(seg.tag === "chant");
    });
  });
  return mask;
}

/* 羅馬字沒有沿用日文分段：用分段的羅馬字（沒有時用原文）比對顯示文字。 */
function romajiChantMask(compactText: string, segments: LyricSegment[]): boolean[] {
  const mask = Array.from(compactText).map(() => false);
  let cursor = 0;
  segments.forEach(seg => {
    if (!seg || seg.tag !== "chant") return;
    const source = String(seg.text || "");
    const mapped = seg.romaji;
    const romaji = typeof mapped === "string" ? mapped : source;
    if (typeof mapped !== "string" && JAPANESE_RE.test(source.replace(ICON_TOKEN_RE, ""))) return;
    const needle = Array.from(romaji.replace(ICON_TOKEN_RE, "")).filter(ch => !isLyricSpace(ch)).join("");
    if (!needle || JAPANESE_RE.test(needle)) return;
    const at = compactText.indexOf(needle, cursor);
    if (at < 0) return;
    const start = Array.from(compactText.slice(0, at)).length;
    Array.from(needle).forEach((_, i) => { mask[start + i] = true; });
    cursor = at + needle.length;
  });
  return mask;
}

type TextPiece = { node: Node; text: string; atomic?: boolean };

/* 收集可見文字的片段。ruby 整個當成一個片段，避免把 rt 算進去。 */
function chantTextPieces(target: Element): TextPiece[] {
  const pieces: TextPiece[] = [];
  const visit = (parent: Node) => {
    [...parent.childNodes].forEach(node => {
      if (node.nodeType === TEXT_NODE) {
        pieces.push({ node, text: node.nodeValue || "" });
        return;
      }
      if (node.nodeType !== ELEMENT_NODE) return;
      const element = node as Element;
      if (element.classList.contains("ico") || element.tagName === "RT" || element.tagName === "RP") return;
      if (element.tagName === "RUBY") {
        const base = [...element.childNodes]
          .filter(child => child.nodeType === TEXT_NODE)
          .map(child => child.nodeValue || "")
          .join("");
        pieces.push({ node, text: base, atomic: true });
        return;
      }
      visit(element);
    });
  };
  visit(target);
  return pieces;
}

function wrapChantNode(node: Node): void {
  const span = node.ownerDocument!.createElement("span");
  span.className = "seg-chant";
  (node as ChildNode).replaceWith(span);
  span.appendChild(node);
}

function splitTextNodeByMask(node: Node, mask: boolean[], index: number): number {
  const documentRef = node.ownerDocument!;
  const fragment = documentRef.createDocumentFragment();
  let run = "";
  let runChant = false;
  const flush = () => {
    if (!run) return;
    const textNode = documentRef.createTextNode(run);
    if (runChant) {
      const span = documentRef.createElement("span");
      span.className = "seg-chant";
      span.appendChild(textNode);
      fragment.appendChild(span);
    } else {
      fragment.appendChild(textNode);
    }
    run = "";
  };
  Array.from(node.nodeValue || "").forEach(ch => {
    if (!isLyricSpace(ch)) {
      const chant = mask[index++];
      if (chant !== runChant) { flush(); runChant = chant; }
    }
    run += ch;
  });
  flush();
  (node as ChildNode).replaceWith(fragment);
  return index;
}

function applyChantMask(target: Element, mask: boolean[]): void {
  if (target.querySelector(".seg-chant")) return;
  const pieces = chantTextPieces(target);
  const compactLength = pieces.reduce((sum, piece) =>
    sum + Array.from(piece.text).filter(ch => !isLyricSpace(ch)).length, 0);
  // 查表結果與分段原文對不上時不標色，避免標錯位置。
  if (compactLength !== mask.length || !mask.includes(true)) return;
  let index = 0;
  pieces.forEach(piece => {
    if (piece.atomic) {
      const count = Array.from(piece.text).filter(ch => !isLyricSpace(ch)).length;
      if (mask.slice(index, index + count).some(Boolean)) wrapChantNode(piece.node);
      index += count;
      return;
    }
    index = splitTextNodeByMask(piece.node, mask, index);
  });
}

function markRomajiChant(target: Element, segments: LyricSegment[]): void {
  const compact = chantTextPieces(target)
    .map(piece => Array.from(piece.text).filter(ch => !isLyricSpace(ch)).join(""))
    .join("");
  applyChantMask(target, romajiChantMask(compact, segments));
}

/** Marks the chant parts of one row's Japanese, romaji and translation. Runs before the karaoke units. */
export function markLyricChantSegments(row: Element, lyric: LyricLine, readingMode: ReadingMode): void {
  if (!row || !lineHasChantSegments(lyric)) return;
  const jpSegments = lyric.jpSegments || [];
  if (hasChantSegment(jpSegments)) {
    const jpEl = row.querySelector(".lyric-jp");
    if (jpEl) {
      if (readingMode === "romaji") markRomajiChant(jpEl, jpSegments);
      else applyChantMask(jpEl, segmentChantMask(jpSegments));
    }
    const romajiEl = row.querySelector(".lyric-romaji");
    if (romajiEl) markRomajiChant(romajiEl, jpSegments);
  }
  const zhEl = row.querySelector(".lyric-zh");
  if (zhEl && hasChantSegment(lyric.trSegments)) {
    applyChantMask(zhEl, segmentChantMask(lyric.trSegments || []));
  }
}

/* ---------- Karaoke 單元 ----------
   每句歌詞有人工填入的影片起始秒數。「本句起點」到「下一句起點」（或依
   BPM 估出的收尾）是本句的時間窗，再依日文詞／假名／羅馬字的可見單位
   分配進度；載入逐字時間後改用逐字時間。播放中只更新目前這一句。 */

export type KaraokeUnit = { el: HTMLElement; weight: number; start: number | null; end: number | null };

type Timing = { start: number; end: number } | null | undefined;

/** Allocator functions of the karaoke adapter (karaoke-sources.js). */
export type KaraokeSources = {
  allocateUnitTimings?: (texts: string[], start: number, end: number) => Timing[];
  mapUnitsToWords?: (texts: string[], words: { text: string; start: number; end: number }[]) => {
    total: number; matched: number; timings: Timing[];
  };
  mapUnitsToReferenceTimings?: (texts: string[], references: string[], timings: Timing[]) => {
    complete: boolean; timings: Timing[];
  };
};

function appendKaraokeUnit(fragment: DocumentFragment, units: KaraokeUnit[], text: string, weight: number): void {
  const span = fragment.ownerDocument.createElement("span");
  span.className = "karaoke-unit";
  span.textContent = text;
  span.dataset.karaokeText = text;
  span.dataset.karaokeWeight = String(weight);
  fragment.appendChild(span);
  units.push({ el: span, weight, start: null, end: null });
}

function decorateKaraokeTextNode(node: Node, units: KaraokeUnit[]): void {
  const text = node.nodeValue || "";
  if (!text.trim()) return;
  const documentRef = node.ownerDocument!;
  const fragment = documentRef.createDocumentFragment();
  const chars = Array.from(text);
  for (let i = 0; i < chars.length;) {
    const ch = chars[i];
    if (/\s/u.test(ch)) {
      fragment.appendChild(documentRef.createTextNode(ch));
      i++;
      continue;
    }
    // 羅馬字／英文以單字為一個單位，避免英文被拆得太碎。
    if (ROMAJI_WORD_CHAR_RE.test(ch)) {
      let j = i + 1;
      while (j < chars.length && ROMAJI_WORD_CONTINUATION_RE.test(chars[j])) j++;
      const word = chars.slice(i, j).join("");
      appendKaraokeUnit(fragment, units, word, karaokeUnitWeight(word));
      i = j;
      continue;
    }
    appendKaraokeUnit(fragment, units, ch, karaokeUnitWeight(ch));
    i++;
  }
  if (fragment.childNodes.length) (node as ChildNode).replaceWith(fragment);
}

/** Splits one target's visible text into karaoke units; a ruby is one unit. */
export function decorateKaraokeLine(target: Element): KaraokeUnit[] {
  const units: KaraokeUnit[] = [];
  const documentRef = target.ownerDocument;
  const visit = (parent: Node) => {
    [...parent.childNodes].forEach(node => {
      if (node.nodeType === TEXT_NODE) {
        decorateKaraokeTextNode(node, units);
        return;
      }
      if (node.nodeType !== ELEMENT_NODE) return;
      const element = node as Element;
      if (element.classList.contains("ico")) return;
      // ruby 整體作為一個可讀詞單位，避免把 rt 假名也當成第二次歌詞進度。
      if (element.tagName === "RUBY") {
        const base = [...element.childNodes]
          .filter(child => child.nodeType === TEXT_NODE)
          .map(child => child.nodeValue || "")
          .join("");
        const wrapper = documentRef.createElement("span");
        wrapper.className = "karaoke-unit";
        wrapper.dataset.karaokeText = base;
        wrapper.dataset.karaokeWeight = String(karaokeUnitWeight(base));
        element.parentNode!.insertBefore(wrapper, element);
        wrapper.appendChild(element);
        units.push({ el: wrapper, weight: karaokeUnitWeight(base), start: null, end: null });
        return;
      }
      if (element.tagName === "RT" || element.tagName === "RP") return;
      visit(element);
    });
  };
  visit(target);
  return units;
}

function karaokeUnitSourceText(unit: KaraokeUnit): string {
  return unit && unit.el ? unit.el.dataset.karaokeText || unit.el.textContent || "" : "";
}

function karaokeUnitReadingText(unit: KaraokeUnit): string {
  if (!unit || !unit.el) return "";
  const ruby = unit.el.querySelector("ruby");
  if (ruby) {
    const reading = ruby.querySelector("rt");
    return reading ? reading.textContent || "" : ruby.textContent || "";
  }
  return unit.el.textContent || "";
}

/**
 * Gives every unit of one row its start and end. Japanese stays the source
 * of every word clock: the kana reference target is timed first, and the
 * displayed romaji is mapped onto it.
 */
export function assignKaraokeLineTiming(
  row: HTMLElement,
  timedLine: TimedLine | null,
  sources: KaraokeSources | null,
  reference: { target: Element; units: KaraokeUnit[] } | null,
  unitsOf: (target: Element) => KaraokeUnit[]
): void {
  const displayTargets = [...row.querySelectorAll(".lyric-jp, .lyric-romaji")]
    .filter(target => (target.textContent || "").trim());
  const referenceTarget = reference ? reference.target : null;
  const targets = [...new Set([referenceTarget, ...displayTargets].filter((target): target is Element => Boolean(target)))];
  const referenceUnits = reference ? reference.units : [];
  const referenceSourceTexts = referenceUnits.map(karaokeUnitSourceText);
  const referenceTexts = referenceUnits.map(karaokeUnitReadingText);
  const sourceApi: KaraokeSources = sources || {};
  const timedStart = timedLine ? Number(timedLine.start) : NaN;
  const timedEnd = timedLine ? Number(timedLine.end) : NaN;
  const lineStart = Number.isFinite(timedStart) ? timedStart : Number(row.dataset.karaokeStart);
  const lineEndValue = Number.isFinite(timedEnd) ? timedEnd : Number(row.dataset.karaokeEnd);
  const start = Number.isFinite(lineStart) ? lineStart : 0;
  const end = Number.isFinite(lineEndValue) && lineEndValue > start ? lineEndValue : start + 0.04;
  const allocate: Timing[] = typeof sourceApi.allocateUnitTimings === "function"
    ? sourceApi.allocateUnitTimings(referenceSourceTexts, start, end)
    : [];
  let referenceTimings: Timing[] = allocate;
  let hasWordTiming = false;

  if (timedLine && timedLine.granularity !== "line"
    && Array.isArray(timedLine.words) && timedLine.words.length
    && typeof sourceApi.mapUnitsToWords === "function") {
    const mappedReference = sourceApi.mapUnitsToWords(referenceSourceTexts, timedLine.words);
    const enoughTextMatches = mappedReference.total > 0 && mappedReference.matched / mappedReference.total >= 0.6;
    if (enoughTextMatches) {
      referenceTimings = mappedReference.timings.map((timing, index) => timing || allocate[index] || null);
      hasWordTiming = true;
    }
  }

  let sourceKind = hasWordTiming ? "word" : "line-proportional";
  targets.forEach(target => {
    const isReference = target === referenceTarget;
    const units = isReference ? referenceUnits : unitsOf(target);
    units.forEach(unit => {
      unit.start = null;
      unit.end = null;
      delete unit.el.dataset.karaokeStart;
      delete unit.el.dataset.karaokeEnd;
    });
    const texts = units.map(karaokeUnitSourceText);
    let timings: Timing[] = isReference ? referenceTimings : [];
    if (!isReference && typeof sourceApi.mapUnitsToReferenceTimings === "function") {
      const mapped = sourceApi.mapUnitsToReferenceTimings(texts, referenceTexts, referenceTimings);
      timings = mapped.timings;
      if (!mapped.complete && hasWordTiming) sourceKind = "word-reference-fallback";
    } else if (!isReference && typeof sourceApi.allocateUnitTimings === "function") {
      /* Compatibility fallback for an older cached adapter script. */
      timings = sourceApi.allocateUnitTimings(texts, start, end);
    }

    units.forEach((unit, index) => {
      const timing = timings[index];
      if (!timing || !Number.isFinite(Number(timing.start)) || !Number.isFinite(Number(timing.end))) return;
      unit.start = Number(timing.start);
      unit.end = Math.max(unit.start + 0.02, Number(timing.end));
      unit.el.dataset.karaokeStart = String(unit.start);
      unit.el.dataset.karaokeEnd = String(unit.end);
    });
  });
  row.dataset.karaokeSource = sourceKind;
}
