/*
 * Chant cues: one rule per fact.
 *
 * Answers, for a song and a chant version, which lines are chant lines,
 * which lines carry a chant cue (a chant line or a backing chant), the
 * song's chant blocks for "只練合唱" playback, and its song list marks.
 * Every answer is read from what the song catalogue resolved at build time
 * (`line.chant`, `song.chant.hasGuide`, `song.marks`); nothing here reads
 * the chant guide, the DOM, the page's globals or the clock.
 *
 * The only state is the chant-block memo, keyed by song object. It compares
 * line times only, so it relies on the catalogue's songs never having their
 * lyric lines or `line.chant` mutated in place.
 */
import type { BackingChant, LyricLine, Song, SongSummary } from "../catalogue/assemble";

export type ChantVersion = "jp" | "kr";

/** The song list badges of one song in one chant version. */
export type SongMarkCounts = {
  /** Number of lines with a chant cue in this chant version. */
  chant: number;
  clap: boolean;
  wave: boolean;
  jump: boolean;
  spin: boolean;
};

/** A run of chant-cue lines to play, in line indices and video seconds. */
export type ChantBlock = { from: number; to: number; start: number; end: number };

/** Playback start of the line at `index`, in video seconds. */
export type LineTime = (index: number) => number;

type ChantSong = Pick<Song, "lyrics" | "chant">;

/* Japanese version: songs with a chant guide follow the guide's cue times;
   songs without one fall back to the lyric markers. Korean version: the
   lyric markers ([mic], [chant], tag "chant"). The song list badges, the
   chant-only playback and the lyric rows all use this one rule, so a badge
   never promises a chant that playback skips. */
export function lineIsChant(line: LyricLine | null | undefined, song: ChantSong, version: ChantVersion): boolean {
  if (!line) return false;
  if (version === "jp" && song.chant.hasGuide) return Boolean(line.chant?.jp);
  return Boolean(line.chant?.kr);
}

/* Japanese-version backing chants: the singer keeps the main lyric while the
   crowd sings another phrase (e.g. the children's voices in
   〈イデアが溢れて眠れない〉 1:25–1:42). They attach to every line whose
   playing interval overlaps them; the main lyric is not a chant line. */
export function backingChants(line: LyricLine | null | undefined, version: ChantVersion): BackingChant[] {
  return version === "jp" ? line?.chant?.backing || [] : [];
}

/* A chant line and a backing-chant line both mean "sing here": the mic icon,
   chant-only playback and the song badges share this test. */
export function lineHasChantCue(line: LyricLine | null | undefined, song: ChantSong, version: ChantVersion): boolean {
  return lineIsChant(line, song, version) || backingChants(line, version).length > 0;
}

/* The song list badges, derived by the catalogue with the same rule as
   lineHasChantCue; a loaded song and its summary carry the same marks. */
export function songMarks(song: Pick<SongSummary, "marks">, version: ChantVersion): SongMarkCounts {
  const { marks } = song;
  return {
    chant: marks.chant[version] || 0,
    clap: Boolean(marks.clap),
    wave: Boolean(marks.wave),
    jump: Boolean(marks.jump),
    spin: Boolean(marks.spin),
  };
}

const CHANT_LEAD_SEC = 1.2;   // enter one beat before the chant to get ready
const CHANT_TAIL_SEC = 0.6;   // keep a little after so the last syllable is not cut
const CHANT_GAP_MERGE = 2.5;  // only join gaps short enough to belong together
const LAST_LINE_SEC = 8;      // assumed length of the song's last line, which has no next line to end it

type BlockMemo = { times: number[]; blocks: ChantBlock[] };
const blockMemo = new WeakMap<ChantSong, Map<ChantVersion, BlockMemo>>();

function sameTimes(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
}

/* Scans the song into chant blocks [{from, to, start, end}, …]: from/to are
   line indices, start/end are video seconds. Line times come from `lineTime`
   (karaoke timing can move them at runtime); the result is memoized per song
   and version and recomputed whenever any line time differs from the last
   call, so callers never clear a cache. Blocks are shared; do not mutate. */
export function chantBlocks(song: ChantSong | null | undefined, version: ChantVersion, lineTime?: LineTime): ChantBlock[] {
  if (!song) return [];
  const lines = song.lyrics || [];
  const timeAt: LineTime = lineTime || (index => Number(lines[index]?.time) || 0);
  const times = lines.map((_, index) => timeAt(index));

  let byVersion = blockMemo.get(song);
  if (!byVersion) blockMemo.set(song, byVersion = new Map());
  const memo = byVersion.get(version);
  if (memo && sameTimes(memo.times, times)) return memo.blocks;

  const lineEnd = (i: number) => lines[i + 1] ? times[i + 1] : times[i] + LAST_LINE_SEC;
  const raw: ChantBlock[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lineHasChantCue(lines[i], song, version)) continue;
    let e = i;
    while (e + 1 < lines.length && lineHasChantCue(lines[e + 1], song, version)) e++;
    raw.push({
      from: i, to: e,
      start: Math.max(0, times[i] - CHANT_LEAD_SEC),
      end: lineEnd(e) + CHANT_TAIL_SEC,
    });
    i = e;
  }
  // Cutting out a few seconds at a time feels choppy, so join nearby blocks.
  const blocks: ChantBlock[] = [];
  raw.forEach(b => {
    const last = blocks[blocks.length - 1];
    if (last && b.start - last.end < CHANT_GAP_MERGE) { last.end = b.end; last.to = b.to; }
    else blocks.push({ from: b.from, to: b.to, start: b.start, end: b.end });
  });
  byVersion.set(version, { times, blocks });
  return blocks;
}
