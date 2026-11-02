/*
 * Lyric view: line timing helpers shared by the row renderer, the karaoke
 * decoration and the page's active-line scan. Pure; no DOM.
 */
import type { LyricLine, LyricSegment, Song } from "../catalogue/assemble";
import { ICON_TOKEN_RE } from "../ui/text";

/** A line of word timing aligned to the local lyrics (karaoke-sources.js). */
export type TimedLine = {
  start: number;
  end: number;
  granularity?: string;
  words?: { text: string; start: number; end: number }[];
};

/** Aligned karaoke timing for one song, as loaded by the page. */
export type KaraokeTiming = { songId: string; lines?: (TimedLine | null | undefined)[] };

/* 歌詞錨點之間常常包含前奏／間奏：以 BPM 與字數估出唱完本句的上限。 */
export const KARAOKE_TAIL_SEC = 0.08;
export const KARAOKE_UNIT_BEATS = 0.65;

export const ROMAJI_WORD_CHAR_RE = /[\p{Script=Latin}\p{N}]/u;
export const ROMAJI_WORD_CONTINUATION_RE = /[\p{Script=Latin}\p{N}'’_-]/u;

export function karaokeLineTiming(song: Song, index: number, timing: KaraokeTiming | null | undefined): TimedLine | null {
  if (!song || !timing || timing.songId !== song.id) return null;
  return (timing.lines && timing.lines[index]) || null;
}

export function karaokeUnitWeight(text: string): number {
  const value = String(text || "");
  const visible = Array.from(value).filter(ch => !/\s/u.test(ch));
  if (!visible.length) return 0;
  if (visible.every(ch => ROMAJI_WORD_CHAR_RE.test(ch))) return Math.max(1, visible.length * 0.75);
  if (visible.every(ch => /[、。！？!?.,，。]/u.test(ch))) return 0.45;
  return Math.max(1, visible.length);
}

function lyricPartText(value: string | LyricSegment[] | undefined): string {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";
  return value.map(part => (typeof part === "string" ? part : (part && part.text) || "")).join("");
}

/* 有些歌曲會在兩句歌詞中間放一筆只有拍手／揮手提示的資料。
   這些資料沒有實際會顯示的日文、翻譯或背景合唱文字，不能把前一句
   的 Karaoke 時間窗截短，也不能搶走目前正在演唱的那一行。 */
export function hasDisplayedLyricText(line: LyricLine | null | undefined): boolean {
  if (!line) return false;
  return [line.jp, line.tr].some(value =>
    lyricPartText(value).replace(ICON_TOKEN_RE, "").replace(/\s/gu, "").length > 0
  );
}

function nextDisplayedLyricTime(song: Song, index: number): number | null {
  const lines = song && Array.isArray(song.lyrics) ? song.lyrics : [];
  const current = Number(lines[index] && lines[index].time);
  for (let i = index + 1; i < lines.length; i++) {
    if (!hasDisplayedLyricText(lines[i])) continue;
    const time = Number(lines[i] && lines[i].time);
    if (Number.isFinite(time) && (!Number.isFinite(current) || time > current)) return time;
  }
  return null;
}

/** The karaoke window of one line: word timing when loaded, else a BPM estimate. */
export function karaokeRange(song: Song, index: number, timed: TimedLine | null): { start: number; end: number } | null {
  const lines = song && Array.isArray(song.lyrics) ? song.lyrics : [];
  const line = lines[index];
  const start = Number(line && line.time);
  if (!Number.isFinite(start)) return null;

  if (timed) {
    return {
      start: Number(timed.start),
      end: Math.max(Number(timed.start) + 0.04, Number(timed.end)),
    };
  }

  // 以歌曲 BPM 與本句字數估出「唱完本句」的上限；若下一句更早，
  // 仍以現有人工錨點為準。這只決定句內高亮的收尾，不會改動原始 time。
  const source = String(line.jp || "").replace(ICON_TOKEN_RE, "");
  const weight = karaokeUnitWeight(source) || 1;
  const bpm = Number(song.bpm) || 120;
  const estimatedDuration = Math.max(0.8, Math.min(12, weight * (60 / bpm) * KARAOKE_UNIT_BEATS));

  const next = nextDisplayedLyricTime(song, index);
  // 最後一句沒有下一個錨點，留一個依句長估出的收尾時間。
  const end = next === null
    ? start + estimatedDuration
    : Math.min(start + estimatedDuration, Math.max(start + 0.25, next - KARAOKE_TAIL_SEC));
  return { start, end };
}

/** The time a line starts in the video: its word timing start when loaded. */
export function playbackTimeForLine(song: Song, index: number, timing: KaraokeTiming | null | undefined): number {
  const timed = karaokeLineTiming(song, index, timing);
  const local = song && song.lyrics && song.lyrics[index];
  return timed && Number.isFinite(Number(timed.start)) ? Number(timed.start) : Number(local && local.time) || 0;
}
