/*
 * Chooses a song's karaoke word timing: bundled timing from the song
 * catalogue when the song has it (no network, works offline), otherwise the
 * live chain in karaoke-sources.js (load, then alignToLocalLyrics). See
 * docs/adr/0005-bundled-word-timing.md.
 */
import type { Song } from "../catalogue/assemble";
import type { TimedLine } from "../lyric-view/timing";
import { ICON_TOKEN_RE } from "../ui/text";

/** Word timing aligned to a song's lyric rows; the shape alignToLocalLyrics returns. */
export type AlignedKaraokeTiming = {
  format: "timed-lyrics-v1-aligned";
  songId: string | null;
  source: string;
  providerOrder: string[];
  offset: number;
  matchedLines: number;
  totalLines: number;
  lines: (TimedLine | null)[];
  /** True when the timing ships with the song instead of coming from the network. */
  bundled?: boolean;
};

export type KaraokeStatus = { state: "loading" | "fallback" | "miss" | "ready"; text: string };

/** The parts of karaoke-sources.js the live chain uses. */
export type KaraokeTimingApi = {
  load(song: Song, options: { duration: number | null; onStatus(event: { state?: string; source?: string } | null): void }): Promise<any>;
  alignToLocalLyrics(timed: any, lyrics: Song["lyrics"]): AlignedKaraokeTiming | null;
};

export type KaraokeTimingDeps = {
  /** Loads karaoke-sources.js; resolves null when it cannot be loaded. */
  loadSources(): Promise<KaraokeTimingApi | null>;
  /** The video duration, read once the adapter is loaded. */
  duration(): number | null;
  /** Progress while the live chain runs; the caller drops stale updates. */
  onStatus(status: KaraokeStatus): void;
};

export type KaraokeTimingResult = { timing: AlignedKaraokeTiming | null; status: KaraokeStatus };

/* Same rule as the catalogue's word-timing text check: a row whose Japanese
   is empty without icon tokens and whitespace is not a karaoke row. */
function isKaraokeRow(jp: unknown): boolean {
  return String(jp ?? "").replace(ICON_TOKEN_RE, "").replace(/\s/gu, "").length > 0;
}

/** Bundled timing for a song whose lines carry `words`, or null. */
export function bundledKaraokeTiming(song: Song | null | undefined): AlignedKaraokeTiming | null {
  if (!song || !song.wordTiming || !Array.isArray(song.lyrics)) return null;
  const lines = song.lyrics.map((line): TimedLine | null => {
    const words = Array.isArray(line.words) ? line.words : [];
    if (!words.length) return null;
    const start = Number(line.time);
    const last = words[words.length - 1].end;
    return {
      start,
      end: Math.max(start + 0.04, last),
      granularity: "word",
      words: words.map(word => ({ text: word.text, start: word.start, end: word.end })),
    };
  });
  const matchedLines = lines.filter(Boolean).length;
  if (!matchedLines) return null;
  const { source, offset } = song.wordTiming;
  return {
    format: "timed-lyrics-v1-aligned",
    songId: song.id,
    source,
    providerOrder: [source],
    offset,
    matchedLines,
    totalLines: song.lyrics.filter(line => isKaraokeRow(line.jp)).length,
    lines,
    bundled: true,
  };
}

/** Seconds a live row is assumed to run when no later row bounds it. */
const LIVE_LAST_ROW_SEC = 4;

/** The preferred video of a song: its live video when `source` is "live" and the song has one, else the MV. */
export function activeVideoId(song: { youtubeId: string; live?: { youtubeId: string } } | null | undefined, source: string): string {
  if (!song) return "";
  return source === "live" && song.live ? song.live.youtubeId : song.youtubeId;
}

/** True when `source` selects the song's live video and the song has one. */
export function isLiveActive(song: { live?: unknown } | null | undefined, source: string): boolean {
  return source === "live" && Boolean(song && song.live);
}

/**
 * Row timing for a song's live video, in the aligned shape the lyric view and
 * the page read: each row starts at its live time and ends at the next row's
 * start. Rows are `granularity: "line"` with no words, so the studio word
 * timing is never applied; karaoke falls back to the line-proportional
 * allocation inside each live row. Null when the song has no live video.
 */
export function liveKaraokeTiming(song: Song | null | undefined): AlignedKaraokeTiming | null {
  const live = song && song.live;
  if (!song || !live || !Array.isArray(live.times) || live.times.length !== song.lyrics.length) return null;
  const lines = live.times.map((start, index): TimedLine => ({
    start,
    end: index + 1 < live.times.length ? live.times[index + 1] : start + LIVE_LAST_ROW_SEC,
    granularity: "line",
  }));
  return {
    format: "timed-lyrics-v1-aligned",
    songId: song.id,
    source: live.label,
    providerOrder: [live.label],
    offset: 0,
    matchedLines: lines.length,
    totalLines: song.lyrics.length,
    lines,
    bundled: true,
  };
}

export function liveStatusText(label: string): string {
  return `現場版（${label}）：使用現場逐行時間，不套用逐字時間`;
}

export function bundledStatusText(timing: AlignedKaraokeTiming): string {
  return `歌詞逐字時間：內建 ${timing.source}（已對齊 ${timing.matchedLines}/${timing.totalLines} 行）`;
}

/** Bundled timing when the song has it; otherwise the live karaoke-sources.js chain. */
export async function loadSongKaraokeTiming(song: Song, deps: KaraokeTimingDeps): Promise<KaraokeTimingResult> {
  const bundled = bundledKaraokeTiming(song);
  if (bundled) return { timing: bundled, status: { state: "ready", text: bundledStatusText(bundled) } };

  deps.onStatus({ state: "loading", text: "歌詞逐字時間：正在尋找開源時間碼…" });
  const api = await deps.loadSources();
  if (!api || typeof api.load !== "function" || typeof api.alignToLocalLyrics !== "function") {
    return { timing: null, status: { state: "miss", text: "歌詞逐字時間：目前使用本地估算同步" } };
  }

  let timed = null;
  try {
    timed = await api.load(song, {
      duration: deps.duration(),
      onStatus: event => {
        if (!event) return;
        if (event.state === "cache") deps.onStatus({ state: "loading", text: "歌詞逐字時間：已讀取本機快取，正在校正影片偏移…" });
        else if (event.state === "fallback") deps.onStatus({ state: "fallback", text: `歌詞逐字時間：前順位來源沒有結果，改查${event.source || "下一順位來源"}…` });
        else if (event.state === "offline") deps.onStatus({ state: "miss", text: "歌詞逐字時間：離線且沒有快取，使用本地估算同步" });
      },
    });
  } catch {
    timed = null;
  }
  if (!timed) return { timing: null, status: { state: "miss", text: "歌詞逐字時間：找不到可用來源，使用本地估算同步" } };

  const aligned = api.alignToLocalLyrics(timed, song.lyrics);
  if (!aligned) return { timing: null, status: { state: "miss", text: "歌詞逐字時間：來源歌詞與本頁不相符，使用本地估算同步" } };
  aligned.songId = song.id;
  const cachedHint = timed.source || "開源來源";
  const timingLabel = timed.granularity === "line" ? "歌詞逐行時間" : "歌詞逐字時間";
  return {
    timing: aligned,
    status: {
      state: "ready",
      text: `${timingLabel}：${cachedHint}（已對齊 ${aligned.matchedLines}/${aligned.totalLines}行，偏移${aligned.offset.toFixed(2)}秒）`,
    },
  };
}
