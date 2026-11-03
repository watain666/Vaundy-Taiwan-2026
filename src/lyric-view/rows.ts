/*
 * Lyric view: pure row renderer.
 *
 * Renders the lyric rows of one song for a reading mode and a chant
 * version as an HTML string. Chant cues come from `line.chant` (resolved by
 * the song catalogue) and the line's segments; nothing here reads the chant
 * guide, the reading tables, the page script, the DOM or globals.
 *
 * The seg-chant marking and the karaoke units are added afterwards by the
 * mount, on its own container (decorate.ts).
 */
import type { ChantSegment, LyricLine, LyricSegment, Song } from "../catalogue/assemble";
import { backingChants, lineHasChantCue, lineIsChant, type ChantVersion } from "../chant/index";
import { INLINE_ICONS } from "../ui/icons.js";
import { escapeHtml, ICON_TOKEN_RE, iconTokensToMarkup, spaceCjkLatinMarkup, spaceCjkLatinText, withIcons } from "../ui/text";
import { wrapChantMarkup } from "./chant-markup";

export type ReadingMode = "kana" | "romaji" | "both";
export type { ChantVersion };

/** The view options that change the row markup. */
export type LyricViewOptions = { readingMode: ReadingMode; chantVersion: ChantVersion };

export type RowRenderOptions = LyricViewOptions & {
  /** Interactive rows are buttons (click to seek); others are divs. */
  interactive: boolean;
};

type ReadingEntry = { reading?: string; romaji?: string } | null | undefined;

const MIC_ICON = (INLINE_ICONS as Record<string, string>).mic;

/* ---------- readings ---------- */

/* entry is the catalogue line (or backing chant) whose text is str; it
   carries the kana reading and romaji resolved at build time. */
export function renderKanaLine(str: string, entry: ReadingEntry): string {
  const source = String(str ?? "");
  const ruby = entry && entry.reading;
  if (!ruby) return withIcons(source);
  return iconTokensToMarkup(spaceCjkLatinMarkup(ruby));
}

export function renderRomajiLine(str: string, entry: ReadingEntry, includeIcons = true): string {
  const source = String(str ?? "");
  const romaji = entry && entry.romaji;
  const value = typeof romaji === "string" ? romaji : source;
  return includeIcons
    ? withIcons(value)
    : escapeHtml(spaceCjkLatinText(value)).replace(ICON_TOKEN_RE, "");
}

function renderJapaneseLine(str: string, entry: ReadingEntry, readingMode: ReadingMode): string {
  return readingMode === "romaji" ? renderRomajiLine(str, entry) : renderKanaLine(str, entry);
}

/* ---------- chant cues (from line.chant) ---------- */

/* 日本版有些應援只落在一句歌詞中的幾個字（例如「愛して」），不能
   直接把整列套上 .is-chant：先把完整歌詞轉成假名／羅馬字 HTML，再在
   對應的可見文字外包一層 .chant-segment，這樣不會丟掉 ruby 讀音。 */
function jpChantSegments(line: LyricLine, chantVersion: ChantVersion): ChantSegment[] {
  if (chantVersion !== "jp" || !line) return [];
  return (line.chant?.jp?.segments || []).filter(segment => segment && segment.text);
}

function chantSegmentText(segment: ChantSegment, mode: "jp" | "romaji"): string {
  if (!segment) return "";
  return String(mode === "romaji" ? (segment.romaji || segment.text) : segment.text || "");
}

function renderChantAwareLine(
  str: string, line: LyricLine, chantVersion: ChantVersion, render: (text: string) => string, mode: "jp" | "romaji"
): string {
  let markup = render(str);
  jpChantSegments(line, chantVersion).forEach(segment => {
    markup = wrapChantMarkup(markup, chantSegmentText(segment, mode), segment);
  });
  return markup;
}

export function hasChantSegment(segments: LyricSegment[] | undefined): boolean {
  return Array.isArray(segments) && segments.some(seg => seg && seg.tag === "chant");
}

/** The line's own segments tag a chant part (Japanese-version partial chant). */
export function lineHasChantSegments(line: LyricLine | null | undefined): boolean {
  return !!line && (hasChantSegment(line.jpSegments) || hasChantSegment(line.trSegments));
}

/* Whether a line is a chant line, has a chant cue or has backing chants is
   decided once in src/chant/ (日本版：有應援指南的歌曲依指南的時間點；
   沒有指南的歌曲沿用歌詞標記。韓國版：歌詞內的 [mic]、[chant]、tag "chant"). */

function chantLineClass(line: LyricLine, song: Song, chantVersion: ChantVersion): string {
  if (!lineIsChant(line, song, chantVersion)) return "";
  /* 分段是依日本版應援整理的，只在日本版生效；韓國版維持整行標色。 */
  if (chantVersion === "jp" && lineHasChantSegments(line)) return "is-chant chant-partial";
  const partial = chantVersion === "jp" && jpChantSegments(line, chantVersion).length > 0;
  const full = song.chant.hasGuide && Boolean(line.chant?.jp?.full);
  return partial && !full ? "has-chant-segment" : "is-chant";
}

/* 合唱行與背景合唱行都算「這裡要唱」：左側麥克風。
   拍手、揮手只用歌詞內的圖示表示。 */
function lyricIconsHtml(line: LyricLine, song: Song, chantVersion: ChantVersion): string {
  return lineHasChantCue(line, song, chantVersion) ? `<span class="lyric-type-icon chant" title="大合唱">${MIC_ICON}</span>` : "";
}

/* 日本版的背景合唱：主唱照常唱主歌詞，台下同時唱另一句。主歌詞不標成
   合唱，只在和區間重疊的每一行下方加一列 .lyric-bg。 */
function backingChantHtml(line: LyricLine, options: LyricViewOptions): string {
  return backingChants(line, options.chantVersion).map(item => {
    const romaji = options.readingMode === "both"
      ? `<span class="lyric-bg-romaji" lang="ja-Latn">${renderRomajiLine(item.text, item, false)}</span>`
      : "";
    return `<span class="lyric-bg" lang="ja"><span class="lyric-bg-label">背景合唱</span>${renderJapaneseLine(item.text, item, options.readingMode)}${romaji}</span>`;
  }).join("");
}

/* ---------- lines ---------- */

function renderJapaneseLyricLine(line: LyricLine, options: LyricViewOptions): string {
  const source = (line && line.jp) || "";
  const mode = options.readingMode === "romaji" ? "romaji" : "jp";
  return renderChantAwareLine(source, line, options.chantVersion,
    text => renderJapaneseLine(text, line, options.readingMode), mode);
}

function renderRomajiLyricLine(line: LyricLine, chantVersion: ChantVersion): string {
  const source = (line && line.jp) || "";
  return renderChantAwareLine(source, line, chantVersion, text => renderRomajiLine(text, line, false), "romaji");
}

/** Kana markup of a line, used as the timing reference for romaji karaoke units. */
export function renderKanaReference(line: LyricLine, chantVersion: ChantVersion): string {
  return renderChantAwareLine((line && line.jp) || "", line, chantVersion, text => renderKanaLine(text, line), "jp");
}

/** The `<li>` rows of a song's lyrics, before seg-chant marking and karaoke units. */
export function renderLyricRows(song: Song, options: RowRenderOptions): string {
  const tag = options.interactive ? "button" : "div";
  return song.lyrics.map((l, i) => `
    <li>
      <${tag} class="lyric-line ${chantLineClass(l, song, options.chantVersion)}" data-time="${l.time}" data-idx="${i}">
        <span class="lyric-icons">${lyricIconsHtml(l, song, options.chantVersion)}</span>
        <span class="lyric-body">
          <span class="lyric-jp" lang="ja">${renderJapaneseLyricLine(l, options)}</span>
          <span class="lyric-romaji" lang="ja-Latn">${options.readingMode === "both" ? renderRomajiLyricLine(l, options.chantVersion) : ""}</span>
          <span class="lyric-zh">${withIcons(l.tr || "")}</span>
          ${backingChantHtml(l, options)}
        </span>
      </${tag}>
    </li>`).join("");
}
