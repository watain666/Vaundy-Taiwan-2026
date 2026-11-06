/*
 * Lyric view: mount.
 *
 * A mount owns one lyric list container. It renders the rows from a song and
 * the view options, and applies the playhead (active line, karaoke progress)
 * and the scroll policy. Nothing else should query or change the rows: the
 * song page and the Document PiP window each create their own mount and feed
 * it the same values.
 */
import type { Song } from "../catalogue/assemble";
import {
  assignKaraokeLineTiming,
  decorateKaraokeLine,
  markLyricChantSegments,
  type KaraokeSources,
  type KaraokeUnit,
} from "./decorate";
import { renderKanaReference, renderLyricRows, type LyricViewOptions } from "./rows";
import { karaokeLineTiming, karaokeRange, playbackTimeForLine, type KaraokeTiming } from "./timing";

export type LyricMountOptions = {
  /** Rows are buttons (click to seek) when true, divs otherwise. */
  interactive: boolean;
  /** "center": the current line is centred (song page); "top": pinned near the top (PiP). */
  scrollAnchor: "center" | "top";
  /** Whether the playhead scrolls the list. */
  autoScroll?: boolean | (() => boolean);
  /** The scrolling element around the container. */
  scroller?: HTMLElement | null;
  /** The document that holds the container; defaults to its owner document. */
  document?: Document;
  /** Centre anchor scroll animation length. */
  scrollDurationMs?: number;
  /** Top anchor offset of the current line. */
  topOffset?: number;
  /**
   * When the playback time is unknown, keep the last active row (the song
   * page's behaviour) or clear it (the PiP window's). Default true. A known
   * time before the first line (a replay or a seek back into the intro)
   * always clears it.
   */
  keepLastActive?: boolean;
};

export type LyricRenderInput = LyricViewOptions & {
  karaokeTiming?: KaraokeTiming | null;
  karaokeSources?: KaraokeSources | null;
};

/** Where playback is: the current line, the playback time and whether karaoke is on. */
export type Playhead = { activeIdx: number; time: number | null; karaokeEnabled: boolean };

/** The icon animation clock: one beat per BPM, counted from `startedAt` (performance.now()).
    `startedAt` is the cycle start, so a cycle's 50% point is half a period later; `rate` is the
    playback speed (the CSS beat duration is divided by it too; default 1). */
export type Beat = { bpm: number; startedAt: number; rate?: number };

export type LyricMount = {
  render(song: Song, input: LyricRenderInput): void;
  setPlayhead(playhead: Playhead, options?: { force?: boolean }): void;
  setBeat(beat: Beat | null): void;
  scrollToActive(options?: { smooth?: boolean }): void;
  /** Re-measures the list padding that lets the first and last line reach the centre. */
  layout(): void;
  activeCount(): number;
  destroy(): void;
};

const ACTIVE_GUARD_MS = 300;
const IN_VIEW_MARGIN = "120px 0px";
const ICON_SELECTOR = ".ico-wave svg, .ico-mic svg, .ico-jump svg, .ico-spin .arm, .ico-clap .hand, .ico-clap .spark";

export function createLyricMount(container: HTMLElement, options: LyricMountOptions): LyricMount {
  const documentRef = options.document || container.ownerDocument;
  const view = documentRef.defaultView;
  const scroller = options.scroller || container.parentElement;
  const autoScroll = typeof options.autoScroll === "function"
    ? options.autoScroll
    : () => options.autoScroll !== false;
  const scrollDuration = options.scrollDurationMs ?? 260;
  const topOffset = options.topOffset ?? 4;

  let rows: HTMLElement[] = [];
  let units = new WeakMap<Element, KaraokeUnit[]>();
  let karaokeRow: HTMLElement | null = null;
  let lastPlayhead: Playhead | null = null;
  let lastScrollIdx = -1;
  let needsAnchor = false;
  let beat: Beat | null = null;
  let observer: IntersectionObserver | null = null;
  let scrollFrame: number | null = null;
  let destroyed = false;

  /* ★ 目前句在任何時刻只能有一行。播放同步卡住時也由守衛清掉多餘的行。 */
  const guard = setInterval(() => { try { pruneActive(null); } catch { /* keep guarding */ } }, ACTIVE_GUARD_MS);

  const unitsOf = (target: Element) => units.get(target) || [];
  const nextFrame = (callback: () => void) => {
    if (view && typeof view.requestAnimationFrame === "function") view.requestAnimationFrame(callback);
    else setTimeout(callback, 16);
  };

  function render(song: Song, input: LyricRenderInput): void {
    if (destroyed) return;
    const { readingMode, chantVersion } = input;
    const timing = input.karaokeTiming || null;
    const sources = input.karaokeSources || null;
    container.innerHTML = renderLyricRows(song, { readingMode, chantVersion, interactive: options.interactive });
    rows = [...container.querySelectorAll<HTMLElement>(".lyric-line")];
    units = new WeakMap();
    karaokeRow = null;

    rows.forEach((row, index) => markLyricChantSegments(row, song.lyrics[index], readingMode));
    const timed = Boolean(timing && timing.songId === song.id);
    rows.forEach((row, index) => {
      const timedLine = karaokeLineTiming(song, index, timing);
      const range = karaokeRange(song, index, timedLine);
      if (timed) row.dataset.time = String(playbackTimeForLine(song, index, timing));
      if (range) {
        row.dataset.karaokeStart = String(range.start);
        row.dataset.karaokeEnd = String(range.end);
      }
      row.querySelectorAll(".lyric-jp, .lyric-romaji").forEach(target => units.set(target, decorateKaraokeLine(target)));
      assignKaraokeLineTiming(row, timedLine, sources, kanaReference(row, song, index, input), unitsOf);
    });

    observeInView();
    needsAnchor = true;
    if (lastPlayhead) applyPlayhead(lastPlayhead);
  }

  /* 羅馬字模式下 .lyric-jp 已不是日文，但每個字的時間仍以日文為準：
     另建一個不掛進畫面的假名參考行，只用來取得單元與讀音。 */
  function kanaReference(row: HTMLElement, song: Song, index: number, input: LyricRenderInput) {
    if (input.readingMode !== "romaji") {
      const target = row.querySelector(".lyric-jp");
      return target ? { target, units: unitsOf(target) } : null;
    }
    const lyric = song.lyrics[index];
    if (!lyric) return null;
    const target = documentRef.createElement("span");
    target.className = "lyric-jp karaoke-reference";
    target.lang = "ja";
    target.innerHTML = renderKanaReference(lyric, input.chantVersion);
    return { target, units: decorateKaraokeLine(target) };
  }

  /* ---------- playhead ---------- */

  function pruneActive(keep: HTMLElement | null): number {
    const lit = container.querySelectorAll<HTMLElement>(".lyric-line.active");
    if (!lit.length) return 0;
    const target = keep || lit[lit.length - 1];
    let removed = 0;
    lit.forEach(row => {
      if (row === target) return;
      row.classList.remove("active");
      // iOS 有時會殘留已移除的樣式：只對這一行強制重繪。
      row.style.opacity = "0.999";
      nextFrame(() => { row.style.opacity = ""; });
      removed++;
    });
    return removed;
  }

  function clearKaraoke(row: HTMLElement | null): void {
    if (!row) return;
    row.querySelectorAll(".lyric-jp, .lyric-romaji").forEach(target => {
      unitsOf(target).forEach(unit => {
        unit.el.classList.remove("karaoke-lit", "karaoke-current");
        unit.el.style.removeProperty("--karaoke-word-progress");
      });
    });
  }

  function updateKaraoke(row: HTMLElement | null, time: number | null, enabled: boolean): void {
    if (!enabled) {
      clearKaraoke(karaokeRow);
      karaokeRow = null;
      return;
    }
    if (karaokeRow && karaokeRow !== row) clearKaraoke(karaokeRow);
    karaokeRow = row || null;
    if (!row || time === null || !Number.isFinite(time)) return;

    const start = Number(row.dataset.karaokeStart);
    const end = Number(row.dataset.karaokeEnd);
    if (!Number.isFinite(start) || !Number.isFinite(end)) return;

    row.querySelectorAll(".lyric-jp, .lyric-romaji").forEach(target => {
      const targetUnits = unitsOf(target);
      if (!targetUnits.length) return;

      const hasRealWordTiming = targetUnits.some(unit =>
        (Number.isFinite(unit.start) && Number.isFinite(unit.end))
        || (Number.isFinite(Number(unit.el.dataset.karaokeStart)) && Number.isFinite(Number(unit.el.dataset.karaokeEnd)))
      );
      if (hasRealWordTiming) {
        targetUnits.forEach(unit => {
          const unitStart = Number.isFinite(unit.start) ? Number(unit.start) : Number(unit.el.dataset.karaokeStart);
          const unitEnd = Number.isFinite(unit.end) ? Number(unit.end) : Number(unit.el.dataset.karaokeEnd);
          if (!Number.isFinite(unitStart) || !Number.isFinite(unitEnd)) {
            unit.el.classList.remove("karaoke-lit", "karaoke-current");
            unit.el.style.removeProperty("--karaoke-word-progress");
            return;
          }
          const progress = Math.max(0, Math.min(1, (time - unitStart) / Math.max(0.02, unitEnd - unitStart)));
          unit.el.classList.toggle("karaoke-lit", progress >= 1);
          unit.el.classList.toggle("karaoke-current", progress > 0 && progress < 1);
          unit.el.style.setProperty("--karaoke-word-progress", progress.toFixed(3));
        });
        return;
      }

      const progress = Math.max(0, Math.min(1, (time - start) / Math.max(0.01, end - start)));
      const total = targetUnits.reduce((sum, unit) => sum + unit.weight, 0) || targetUnits.length;
      const reached = progress * total;
      let passed = 0;
      targetUnits.forEach(unit => {
        const was = passed;
        passed += unit.weight;
        const lit = reached >= passed;
        const current = !lit && reached > was;
        unit.el.classList.toggle("karaoke-lit", lit);
        unit.el.classList.toggle("karaoke-current", current);
      });
    });
  }

  function rowAt(index: number): HTMLElement | null {
    return index >= 0 ? rows[index] || null : null;
  }

  function applyPlayhead(playhead: Playhead): HTMLElement | null {
    const target = rowAt(playhead.activeIdx);
    // 目前句與逐字 Karaoke 同時更新；後者不能等到目前句改變才刷新。
    updateKaraoke(target, playhead.time, playhead.karaokeEnabled);
    // 讀不到播放位置時，多餘的目前句也一定要清掉。
    // 播放位置已知但還沒到第一句（重播、拉回前奏）時，上一首的最後一句不能留著。
    const keepLast = options.keepLastActive !== false && playhead.time === null;
    if (target || keepLast) pruneActive(target);
    else container.querySelectorAll(".lyric-line.active").forEach(row => row.classList.remove("active"));
    if (target && !target.classList.contains("active")) {
      target.classList.add("active");
      /* The song page animates only the current line's icons (theme.css), so the
         animation restarts when a row becomes current; re-apply the beat phase now
         instead of the delay written when the row scrolled into view. */
      syncIconAnimationPhase(target, performance.now());
    }
    return target;
  }

  function setPlayhead(playhead: Playhead, setOptions: { force?: boolean } = {}): void {
    if (destroyed) return;
    lastPlayhead = { ...playhead };
    const target = applyPlayhead(playhead);

    if (options.scrollAnchor === "top") {
      /* 釘頂：目前句改變就捲動；剛重新 render 時直接跳到位。 */
      if (needsAnchor) {
        needsAnchor = false;
        lastScrollIdx = playhead.activeIdx;
        if (autoScroll()) scrollToActive({ smooth: false });
      } else if (playhead.activeIdx !== lastScrollIdx) {
        lastScrollIdx = playhead.activeIdx;
        if (autoScroll()) scrollToActive({ smooth: true });
      }
      return;
    }

    /* 置中：不知道播放位置時不捲動；目前句沒變就不重新捲動
       （每個 tick 重新開始 smooth 捲動會造成卡頓），除非 force。 */
    needsAnchor = false;
    if (playhead.time === null) return;
    const changed = playhead.activeIdx !== lastScrollIdx;
    if (!changed && !setOptions.force) return;
    lastScrollIdx = playhead.activeIdx;
    if (!autoScroll()) return;
    if (target) scrollCentered(target);
    // 回到第一句之前（重播、拉回前奏）：捲回開頭，和剛進歌曲時一樣。
    // 只在剛回到開頭時捲一次，前奏中使用者自己捲動不會被拉回。
    else if (changed && scroller) animateScrollTo(scroller, 0);
  }

  /* ---------- scrolling ---------- */

  function cancelScrollAnimation(): void {
    if (scrollFrame !== null && view) view.cancelAnimationFrame(scrollFrame);
    scrollFrame = null;
  }

  // 自己做動畫，讓捲動只花 scrollDuration 毫秒（瀏覽器的 smooth 無法調速）。
  function animateScrollTo(element: HTMLElement, to: number): void {
    cancelScrollAnimation();
    const from = element.scrollTop;
    const diff = to - from;
    if (scrollDuration <= 0 || !view || typeof view.requestAnimationFrame !== "function") { element.scrollTop = to; return; }
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / scrollDuration);
      const eased = 1 - Math.pow(1 - p, 3);   // easeOutCubic
      element.scrollTop = from + diff * eased;
      scrollFrame = p < 1 ? view.requestAnimationFrame(step) : null;
    };
    scrollFrame = view.requestAnimationFrame(step);
  }

  // 只捲動歌詞容器：scrollIntoView 會連外層一起捲，大螢幕兩欄時畫面會晃。
  function scrollCentered(row: HTMLElement, smooth = true): void {
    if (!scroller) return;
    const cRect = scroller.getBoundingClientRect();
    const eRect = row.getBoundingClientRect();
    const delta = (eRect.top - cRect.top) - (scroller.clientHeight / 2 - eRect.height / 2);
    const maxTop = scroller.scrollHeight - scroller.clientHeight;
    const top = Math.max(0, Math.min(maxTop, scroller.scrollTop + delta));
    if (Math.abs(top - scroller.scrollTop) < 4) return;
    if (smooth) animateScrollTo(scroller, top);
    else { cancelScrollAnimation(); scroller.scrollTop = top; }
  }

  // 目前句釘在頂端附近，下方留給下一句（PiP 常常矮到放不下兩句置中）。
  function scrollPinned(smooth: boolean): void {
    if (!scroller) return;
    const row = container.querySelector<HTMLElement>(".lyric-line.active");
    if (!row) {
      scroller.scrollTo({ top: 0 });
      return;
    }
    const lineRect = row.getBoundingClientRect();
    const boxRect = scroller.getBoundingClientRect();
    const top = scroller.scrollTop + (lineRect.top - boxRect.top) - topOffset;
    const reduceMotion = view?.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduceMotion ? "smooth" : "auto" });
  }

  function scrollToActive(scrollOptions: { smooth?: boolean } = {}): void {
    if (destroyed) return;
    const smooth = scrollOptions.smooth !== false;
    if (options.scrollAnchor === "top") { scrollPinned(smooth); return; }
    const row = lastPlayhead ? rowAt(lastPlayhead.activeIdx) : null;
    if (row) scrollCentered(row, smooth);
  }

  /* 第一句與最後一句也要能捲到正中央：上下留出容器一半高的空白。 */
  function layout(): void {
    if (destroyed || options.scrollAnchor !== "center" || !scroller) return;
    const first = container.querySelector(".lyric-line");
    const h = scroller.clientHeight;
    if (!first || !h) return;
    const half = h / 2 - first.getBoundingClientRect().height / 2;
    container.style.paddingTop = Math.max(8, half) + "px";
    container.style.paddingBottom = Math.max(140, h / 2) + "px";
  }

  /* ---------- in-view and icon animation phase ---------- */

  /* 看得到的行才播放圖示動畫；重新進入畫面時接回同一個全域拍點，
     否則每一行會從自己的第 0 拍開始，同一種圖示看起來各自不同步。 */
  function syncIconAnimationPhase(row: Element, now: number): void {
    const bpm = Number(beat && beat.bpm);
    if (!row || !beat || !Number.isFinite(bpm) || bpm <= 0) return;
    const rate = Number(beat.rate);
    const periodMs = 60000 / bpm / (Number.isFinite(rate) && rate > 0 ? rate : 1);
    const elapsedMs = Math.max(0, now - beat.startedAt);
    const delay = Number(-((elapsedMs % periodMs) / 1000).toFixed(3));
    /* beat.startedAt is on this module's performance clock; the icons may live in
       another document (the Document PiP window) whose timeline has its own origin. */
    const perf = view && view.performance;
    const originShift = perf && Number.isFinite(perf.timeOrigin) ? performance.timeOrigin - perf.timeOrigin : 0;
    row.querySelectorAll<HTMLElement | SVGElement>(ICON_SELECTOR).forEach(icon => {
      icon.style.animationDelay = `${delay}s`;
      if (typeof icon.getAnimations !== "function") return;
      icon.getAnimations().forEach(animation => {
        if (animation.playState === "running") {
          /* Pin the start time: setting only the delay or currentTime leaves a pending
             play that starts on the next frame, so the icon would trail the beat by a
             frame or two. With delay d, active time = timeline - startTime - d, so a start of
             startedAt - d puts the cycle start at startedAt. */
          animation.startTime = beat!.startedAt + originShift - delay * 1000;
        } else {
          /* A paused animation (held while the video is paused) keeps its old current
             time; restart it at 0 so the negative delay is exactly the phase on resume.
             Setting startTime here would resume it. */
          animation.currentTime = 0;
        }
      });
    });
  }

  function observeInView(): void {
    if (observer) { observer.disconnect(); observer = null; }
    if (!rows.length || !scroller) return;
    const Observer = (view && (view as unknown as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver)
      || (typeof IntersectionObserver === "function" ? IntersectionObserver : undefined);
    if (!Observer) {
      const now = performance.now();
      rows.forEach(row => {
        row.classList.add("in-view");
        syncIconAnimationPhase(row, now);
      });
      return;
    }
    observer = new Observer(entries => {
      const now = performance.now();
      entries.forEach(entry => {
        entry.target.classList.toggle("in-view", entry.isIntersecting);
        if (entry.isIntersecting) syncIconAnimationPhase(entry.target, now);
      });
    }, { root: scroller, rootMargin: IN_VIEW_MARGIN });
    rows.forEach(row => observer!.observe(row));
  }

  /* A changed clock re-applies the phase to the rows in view right away (the
     Document PiP passes the same beat on every update, so an equal one is a no-op). */
  function setBeat(next: Beat | null): void {
    const rate = next && Number.isFinite(Number(next.rate)) && Number(next.rate) > 0 ? Number(next.rate) : 1;
    const normalised = next ? { bpm: Number(next.bpm), startedAt: Number(next.startedAt), rate } : null;
    const same = normalised && beat
      ? normalised.bpm === beat.bpm && normalised.startedAt === beat.startedAt && normalised.rate === beat.rate
      : normalised === beat;
    beat = normalised;
    if (same || !beat) return;
    const now = performance.now();
    rows.forEach(row => { if (row.classList.contains("in-view")) syncIconAnimationPhase(row, now); });
  }

  function destroy(): void {
    if (destroyed) return;
    destroyed = true;
    clearInterval(guard);
    if (observer) { observer.disconnect(); observer = null; }
    cancelScrollAnimation();
    karaokeRow = null;
    lastPlayhead = null;
  }

  return Object.freeze({
    render,
    setPlayhead,
    setBeat,
    scrollToActive,
    layout,
    activeCount: () => container.querySelectorAll(".lyric-line.active").length,
    destroy,
  });
}
