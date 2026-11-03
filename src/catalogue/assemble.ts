/*
 * Song catalogue: pure core.
 *
 * Joins the authoring files (metadata, lyrics, chant guides, readings, BPM,
 * setlist) into fully resolved songs and checks every data invariant. It runs
 * at build time inside the Vite plugin and in tests; the browser only sees
 * its output. Nothing here touches the file system, the DOM or globals.
 */

export type SongId = string & { readonly __brand: "SongId" };

export type SongMarks = {
  chant: { jp: number; kr: number };
  clap: boolean;
  wave: boolean;
  jump: boolean;
  spin: boolean;
};

export type SongSummary = {
  id: SongId;
  /** 1-based position in the metadata file. */
  number: number;
  title: string;
  /** The Japanese original title: the last parenthesised part of `title`. */
  titleJa: string;
  youtubeId: string;
  /** null for a song that is not on Spotify (no word-level karaoke timing). */
  spotifyTrackId: string | null;
  translationCredit: string;
  /** Resolved: a URL to link to, or null for a text-only credit. */
  translationCreditUrl: string | null;
  translationSourceUrl?: string;
  translationLicense?: string;
  translationLicenseUrl?: string;
  bpm: number;
  marks: SongMarks;
};

/** A part of a split lyric line, as written in the lyrics file. */
export type LyricSegment = {
  text: string;
  tag?: string;
  /** Romaji for a chant-tagged segment, when the reading tables have one. */
  romaji?: string;
};

export type ChantSegment = {
  time: number;
  text: string;
  romaji?: string;
  /** Starts the segment on a new line when the lyric view marks it. */
  breakBefore?: boolean;
};

export type BackingChant = {
  start: number;
  end: number;
  text: string;
  reading?: string;
  romaji?: string;
};

export type LyricLineChant = {
  /** Japanese-version cue from the chant guide (`full` = the whole line). */
  jp?: { full: boolean; segments: ChantSegment[] };
  /** Korean-version cue from the lyric markers ([mic], [chant], tag "chant"). */
  kr?: true;
  /** Japanese-version backing chants that overlap this line. */
  backing?: BackingChant[];
};

export type LyricLine = {
  index: number;
  time: number;
  jp: string;
  tr?: string;
  jpSegments?: LyricSegment[];
  trSegments?: LyricSegment[];
  pic?: string;
  /** Kana ruby HTML with corrections applied. */
  reading?: string;
  /** Romaji with corrections applied. */
  romaji?: string;
  chant?: LyricLineChant;
};

export type Song = SongSummary & {
  /** Named `lyrics` because the karaoke adapter reads `song.lyrics`. */
  lyrics: LyricLine[];
  chant: {
    notes: string[];
    referenceUrl: string | null;
    /** True when the song has a chant guide; the Japanese version then follows
        the guide's cues, otherwise it falls back to the Korean-version markers. */
    hasGuide: boolean;
  };
};

/* ---------- authoring input shapes ---------- */

export type MetadataEntry = {
  id: string;
  title: string;
  translationCredit: string;
  youtubeId: string;
  /** A 22-character Spotify track ID, or null when the song is not on Spotify. */
  spotifyTrackId: string | null;
  translationCreditUrl?: string | null;
  translationSourceUrl?: string;
  translationLicense?: string;
  translationLicenseUrl?: string;
};

export type AuthoredLine = {
  time: number;
  jp: string;
  tr?: string;
  jpSegments?: LyricSegment[];
  trSegments?: LyricSegment[];
  pic?: string;
};

export type LyricsEntry = Omit<MetadataEntry, "spotifyTrackId"> & { lyrics: AuthoredLine[] };

export type ChantGuide = {
  notes?: string[];
  chantTimes?: number[];
  chantSegments?: ChantSegment[];
  backingChants?: { start: number; end: number; text: string }[];
};

export type ReadingTable = Readonly<Record<string, string>>;

/** The two karaoke helpers the alignment invariant needs (karaoke-sources.js). */
export type KaraokeAlignment = {
  mapUnitsToReferenceTimings(
    units: string[],
    references: string[],
    timings: { start: number; end: number }[]
  ): { complete: boolean; unmatched?: unknown; timings: ({ start: number; end: number } | null | undefined)[] };
  normaliseRomajiText(value: string): string;
};

export type CatalogueSources = {
  metadata: readonly MetadataEntry[];
  lyrics: readonly LyricsEntry[];
  bpm: Readonly<Record<string, number>>;
  chantGuides: Readonly<Record<string, ChantGuide>>;
  chantReferenceUrl: string | null;
  setlist: { items: readonly { songs: readonly { id: string }[] }[] };
  readings: {
    furigana: ReadingTable;
    romaji: ReadingTable;
    furiganaCorrections: ReadingTable;
    romajiCorrections: ReadingTable;
  };
  karaoke: KaraokeAlignment;
  /** Used when a metadata entry leaves `translationCreditUrl` unset. */
  defaultTranslationCreditUrl: string;
};

/* ---------- issues ---------- */

export const RULE_SEVERITY = {
  "romaji-missing": "error",
  "romaji-japanese": "error",
  "segment-romaji-missing": "error",
  "segment-romaji-japanese": "error",
  "karaoke-alignment": "error",
  "reading-missing": "error",
  "identity-mismatch": "error",
  "id-set": "error",
  "bpm-missing": "error",
  "chant-time-unmatched": "error",
  "backing-chant-unmatched": "error",
  "time-order": "error",
  "spotify-track-id": "error",
  "unknown-song": "error",
  "dead-reading-key": "error",
  "id-punctuation": "error",
} as const;

export type RuleName = keyof typeof RULE_SEVERITY;

export type CatalogueIssue = {
  rule: RuleName;
  severity: "error" | "warning";
  songId?: string;
  lineIndex?: number;
  message: string;
};

export function formatIssue(issue: CatalogueIssue): string {
  const where = issue.songId === undefined
    ? ""
    : ` song ${JSON.stringify(issue.songId)}${issue.lineIndex === undefined ? "" : ` line ${issue.lineIndex}`}`;
  return `[${issue.rule}]${where}: ${issue.message}`;
}

export class CatalogueError extends Error {
  readonly issues: CatalogueIssue[];
  constructor(issues: CatalogueIssue[]) {
    super(`Song catalogue has ${issues.length} error(s):\n${issues.map(formatIssue).join("\n")}`);
    this.name = "CatalogueError";
    this.issues = issues;
  }
}

class IssueLog {
  readonly issues: CatalogueIssue[] = [];
  add(rule: RuleName, message: string, songId?: string, lineIndex?: number): void {
    this.issues.push({ rule, severity: RULE_SEVERITY[rule], songId, lineIndex, message });
  }
  get errors(): CatalogueIssue[] {
    return this.issues.filter(issue => issue.severity === "error");
  }
  get warnings(): CatalogueIssue[] {
    return this.issues.filter(issue => issue.severity === "warning");
  }
}

/* ---------- text helpers ---------- */

const JAPANESE_RE = /[ぁ-ゖ゠-ヿ一-鿿]/u;
const KANJI_RE = /\p{Script=Han}/u;
const ICON_TOKEN_RE = /[\[(](?:wave|clap|mic|chant|jump|spin|turn)[\])]/giu;
const ICON_TOKEN_PATTERNS = {
  wave: /[\[(]wave[\])]/i,
  clap: /[\[(]clap[\])]/i,
  jump: /[\[(]jump[\])]/i,
  spin: /[\[(]spin[\])]/i,
  turn: /[\[(]turn[\])]/i,
  mic: /[\[(]mic[\])]/i,
  chant: /[\[(]chant[\])]/i,
} as const;
const ROMAJI_WORD_CHAR_RE = /[\p{Script=Latin}\p{N}]/u;
const ROMAJI_WORD_CONTINUATION_RE = /[\p{Script=Latin}\p{N}'’_-]/u;
const SPOTIFY_TRACK_ID_RE = /^[A-Za-z0-9]{22}$/;
const PLAIN_ID_RE = /^[A-Za-z0-9]+$/;

const IDENTITY_FIELDS = [
  "title",
  "translationCredit",
  "translationCreditUrl",
  "translationSourceUrl",
  "translationLicense",
  "translationLicenseUrl",
  "youtubeId",
] as const;

function hasIconToken(value: unknown, name: keyof typeof ICON_TOKEN_PATTERNS): boolean {
  return typeof value === "string" && ICON_TOKEN_PATTERNS[name].test(value);
}

/** Chant times match lyric times by hundredths of a second. */
export function timeBucket(seconds: number): number {
  return Math.round(Number(seconds) * 100);
}

function japaneseTitle(title: string): string {
  const matches = [...String(title).matchAll(/\(([^()]*)\)/g)];
  return matches.length ? matches[matches.length - 1][1] : String(title);
}

function stripMarkup(value: string): string {
  return String(value || "").replace(/<[^>]*>/g, "");
}

/* A ruby is one visible unit, plain text splits by character, and
   whitespace and icons are not timed units (the karaoke decorator's rule). */
function referenceReadings(markup: string): string[] {
  const value = String(markup || "").replace(ICON_TOKEN_RE, "");
  const units: string[] = [];
  const rubyRe = /<ruby(?:\s[^>]*)?>([\s\S]*?)<\/ruby>/giu;
  let cursor = 0;
  let match: RegExpExecArray | null;
  const appendPlain = (plain: string) => {
    Array.from(stripMarkup(plain)).forEach(char => {
      if (!/\s/u.test(char)) units.push(char);
    });
  };
  while ((match = rubyRe.exec(value))) {
    appendPlain(value.slice(cursor, match.index));
    const inner = match[1];
    const reading = inner.match(/<rt(?:\s[^>]*)?>([\s\S]*?)<\/rt>/iu);
    const base = stripMarkup(reading ? inner.slice(0, reading.index) : inner);
    if (base && !/^\s*$/u.test(base)) units.push(reading ? stripMarkup(reading[1]) : base);
    cursor = rubyRe.lastIndex;
  }
  appendPlain(value.slice(cursor));
  return units;
}

function romajiUnits(value: string): string[] {
  const chars = Array.from(String(value || "").replace(ICON_TOKEN_RE, ""));
  const units: string[] = [];
  for (let index = 0; index < chars.length;) {
    const char = chars[index];
    if (/\s/u.test(char)) {
      index += 1;
      continue;
    }
    if (ROMAJI_WORD_CHAR_RE.test(char)) {
      let end = index + 1;
      while (end < chars.length && ROMAJI_WORD_CONTINUATION_RE.test(chars[end])) end += 1;
      units.push(chars.slice(index, end).join(""));
      index = end;
      continue;
    }
    units.push(char);
    index += 1;
  }
  return units;
}

function isTimed(value: { start: number; end: number } | null | undefined): boolean {
  return Boolean(value) && Number.isFinite(Number(value!.start)) && Number.isFinite(Number(value!.end));
}

/* ---------- assembly ---------- */

type MergedReadings = { furigana: ReadingTable; romaji: ReadingTable };

function mergeReadings(sources: CatalogueSources): MergedReadings {
  const { furigana, romaji, furiganaCorrections, romajiCorrections } = sources.readings;
  return {
    furigana: { ...furigana, ...furiganaCorrections },
    romaji: { ...romaji, ...romajiCorrections },
  };
}

function lookup(table: ReadingTable, key: string): string | undefined {
  return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : undefined;
}

function isKrChantLine(line: AuthoredLine): boolean {
  const hit = (part: unknown): boolean => {
    if (typeof part === "string") return hasIconToken(part, "mic") || hasIconToken(part, "chant");
    if (!Array.isArray(part)) return false;
    return part.some((seg: LyricSegment) => seg && (seg.tag === "chant"
      || hasIconToken(seg.text, "mic") || hasIconToken(seg.text, "chant")));
  };
  return hit(line.jpSegments || line.jp) || hit(line.trSegments || line.tr);
}

function checkKaraokeAlignment(
  line: AuthoredLine, readings: MergedReadings, karaoke: KaraokeAlignment
): string | null {
  const source = String(line.jp ?? "");
  const markup = lookup(readings.furigana, source) || source;
  const mapped = lookup(readings.romaji, source);
  const romaji = typeof mapped === "string" ? mapped : source;
  const references = referenceReadings(markup);
  const units = romajiUnits(romaji);
  const timings = references.map((_, unitIndex) => ({ start: unitIndex + 1, end: unitIndex + 2 }));
  const result = karaoke.mapUnitsToReferenceTimings(units, references, timings);
  const missing = units.filter((unit, unitIndex) =>
    karaoke.normaliseRomajiText(unit) && !isTimed(result.timings[unitIndex]));
  if (result.complete && !missing.length) return null;
  return `romaji units do not map onto the reading units (romaji ${JSON.stringify(romaji)}, `
    + `reading ${JSON.stringify(references.join("|"))}, unmatched ${JSON.stringify(result.unmatched ?? missing)})`;
}

function buildSong(
  meta: MetadataEntry,
  number: number,
  sources: CatalogueSources,
  readings: MergedReadings,
  log: IssueLog
): Song {
  const id = meta.id;
  const authored = sources.lyrics.find(entry => entry.id === id);
  if (!authored) log.add("id-set", "has metadata but no lyrics entry", id);

  for (const field of IDENTITY_FIELDS) {
    if (authored && authored[field] !== meta[field]) {
      log.add("identity-mismatch",
        `${field} differs: metadata ${JSON.stringify(meta[field])}, lyrics ${JSON.stringify(authored[field])}`, id);
    }
  }
  if (meta.spotifyTrackId !== null && !SPOTIFY_TRACK_ID_RE.test(String(meta.spotifyTrackId ?? ""))) {
    log.add("spotify-track-id", `spotifyTrackId ${JSON.stringify(meta.spotifyTrackId)} is neither a 22-character Spotify ID nor null`, id);
  }
  const bpm = Number(sources.bpm[id]);
  if (!Object.prototype.hasOwnProperty.call(sources.bpm, id) || !Number.isFinite(bpm) || bpm <= 0) {
    log.add("bpm-missing", `no valid BPM (got ${JSON.stringify(sources.bpm[id])})`, id);
  }

  const authoredLines: AuthoredLine[] = authored ? authored.lyrics || [] : [];
  const guide = Object.prototype.hasOwnProperty.call(sources.chantGuides, id) ? sources.chantGuides[id] : undefined;
  const fullBuckets = new Set((guide?.chantTimes || []).map(Number).filter(Number.isFinite).map(timeBucket));
  const anyBuckets = new Set(fullBuckets);
  (guide?.chantSegments || []).forEach(segment => {
    const time = Number(segment && segment.time);
    if (Number.isFinite(time)) anyBuckets.add(timeBucket(time));
  });

  const lines: LyricLine[] = authoredLines.map((authoredLine, index) => {
    const jp = String(authoredLine.jp ?? "");
    const line: LyricLine = { index, time: authoredLine.time, jp };
    if (authoredLine.tr !== undefined) line.tr = authoredLine.tr;
    if (authoredLine.jpSegments) {
      line.jpSegments = authoredLine.jpSegments.map(segment => {
        const copy: LyricSegment = { ...segment };
        if (segment && segment.tag === "chant") {
          const romaji = lookup(readings.romaji, String(segment.text ?? ""));
          if (typeof romaji === "string") copy.romaji = romaji;
        }
        return copy;
      });
    }
    if (authoredLine.trSegments) line.trSegments = authoredLine.trSegments.map(segment => ({ ...segment }));
    if (authoredLine.pic !== undefined) line.pic = authoredLine.pic;

    const reading = lookup(readings.furigana, jp);
    if (reading) line.reading = reading;
    const romaji = lookup(readings.romaji, jp);
    if (typeof romaji === "string") line.romaji = romaji;

    /* invariants on readings */
    if (JAPANESE_RE.test(jp)) {
      if (typeof romaji !== "string") log.add("romaji-missing", `no romaji for ${JSON.stringify(jp)}`, id, index);
      else if (JAPANESE_RE.test(romaji)) log.add("romaji-japanese", `romaji ${JSON.stringify(romaji)} contains Japanese`, id, index);
    }
    if (KANJI_RE.test(jp) && !reading) log.add("reading-missing", `no kana reading for ${JSON.stringify(jp)}`, id, index);
    for (const segment of authoredLine.jpSegments || []) {
      if (!segment || segment.tag !== "chant" || !JAPANESE_RE.test(String(segment.text || ""))) continue;
      const segmentRomaji = lookup(readings.romaji, segment.text);
      if (typeof segmentRomaji !== "string") {
        log.add("segment-romaji-missing", `no romaji for chant segment ${JSON.stringify(segment.text)}`, id, index);
      } else if (JAPANESE_RE.test(segmentRomaji)) {
        log.add("segment-romaji-japanese", `chant segment romaji ${JSON.stringify(segmentRomaji)} contains Japanese`, id, index);
      }
    }
    const alignment = checkKaraokeAlignment(authoredLine, readings, sources.karaoke);
    if (alignment) log.add("karaoke-alignment", alignment, id, index);

    if (index > 0 && !(Number(authoredLine.time) > Number(authoredLines[index - 1].time))) {
      log.add("time-order", `time ${authoredLine.time} does not follow ${authoredLines[index - 1].time}`, id, index);
    }
    return line;
  });

  /* chant cues resolved onto lines */
  const lineBuckets = new Set(lines.map(line => timeBucket(line.time)));
  lines.forEach((line, index) => {
    const chant: LyricLineChant = {};
    const bucket = timeBucket(line.time);
    if (guide && Number.isFinite(Number(line.time)) && anyBuckets.has(bucket)) {
      chant.jp = {
        full: fullBuckets.has(bucket),
        segments: (guide.chantSegments || [])
          .filter(segment => segment && segment.text && timeBucket(segment.time) === bucket)
          .map(segment => ({ ...segment })),
      };
    }
    if (isKrChantLine(authoredLines[index])) chant.kr = true;
    if (guide && Array.isArray(guide.backingChants) && Number.isFinite(Number(line.time))) {
      const next = Number(lines[index + 1]?.time);
      const lineEnd = Number.isFinite(next) ? next : Infinity;
      const backing = guide.backingChants
        .filter(item => item && item.text && line.time < Number(item.end) && lineEnd > Number(item.start))
        .map(item => {
          const copy: BackingChant = { ...item };
          const reading = lookup(readings.furigana, item.text);
          if (reading) copy.reading = reading;
          const romaji = lookup(readings.romaji, item.text);
          if (typeof romaji === "string") copy.romaji = romaji;
          return copy;
        });
      if (backing.length) chant.backing = backing;
    }
    if (chant.jp || chant.kr || chant.backing) line.chant = chant;
  });

  if (guide) {
    (guide.chantTimes || []).forEach((time, timeIndex) => {
      if (!Number.isFinite(Number(time)) || !lineBuckets.has(timeBucket(time))) {
        log.add("chant-time-unmatched", `chantTimes[${timeIndex}] = ${time} matches no lyric line time`, id);
      }
    });
    (guide.chantSegments || []).forEach((segment, segmentIndex) => {
      const time = Number(segment && segment.time);
      if (!Number.isFinite(time) || !lineBuckets.has(timeBucket(time))) {
        log.add("chant-time-unmatched", `chantSegments[${segmentIndex}] at ${segment && segment.time} matches no lyric line time`, id);
      }
      if (segment && typeof segment.romaji === "string" && JAPANESE_RE.test(segment.romaji)) {
        log.add("segment-romaji-japanese", `chantSegments[${segmentIndex}] romaji ${JSON.stringify(segment.romaji)} contains Japanese`, id);
      }
    });
    (guide.backingChants || []).forEach((item, itemIndex) => {
      if (!lines.some(line => line.chant?.backing?.some(backing => backing.start === item.start
        && backing.end === item.end && backing.text === item.text))) {
        log.add("backing-chant-unmatched", `backingChants[${itemIndex}] (${item.start}-${item.end}) overlaps no lyric line`, id);
      }
      const text = String(item?.text || "");
      if (!JAPANESE_RE.test(text)) return;
      const romaji = lookup(readings.romaji, text);
      if (typeof romaji !== "string") {
        log.add("segment-romaji-missing", `no romaji for backingChants[${itemIndex}] ${JSON.stringify(text)}`, id);
      } else if (JAPANESE_RE.test(romaji)) {
        log.add("segment-romaji-japanese", `backingChants[${itemIndex}] romaji ${JSON.stringify(romaji)} contains Japanese`, id);
      }
    });
  }

  const summary: SongSummary = {
    id: id as SongId,
    number,
    title: meta.title,
    titleJa: japaneseTitle(meta.title),
    youtubeId: meta.youtubeId,
    spotifyTrackId: meta.spotifyTrackId,
    translationCredit: meta.translationCredit,
    translationCreditUrl: meta.translationCreditUrl === undefined
      ? sources.defaultTranslationCreditUrl
      : meta.translationCreditUrl,
    bpm,
    marks: deriveMarks(authoredLines, lines, Boolean(guide)),
  };
  if (meta.translationSourceUrl !== undefined) summary.translationSourceUrl = meta.translationSourceUrl;
  if (meta.translationLicense !== undefined) summary.translationLicense = meta.translationLicense;
  if (meta.translationLicenseUrl !== undefined) summary.translationLicenseUrl = meta.translationLicenseUrl;

  return {
    ...summary,
    lyrics: lines,
    chant: {
      notes: guide ? [...(guide.notes || [])] : [],
      referenceUrl: guide ? sources.chantReferenceUrl : null,
      hasGuide: Boolean(guide),
    },
  };
}

/* Same counting rule as the song list badges: a Japanese-version chant line
   is a guide cue or a backing chant; unguided songs fall back to the
   Korean-version markers. Action marks come from the icon tokens. */
function deriveMarks(authoredLines: AuthoredLine[], lines: LyricLine[], guided: boolean): SongMarks {
  const marks: SongMarks = { chant: { jp: 0, kr: 0 }, clap: false, wave: false, jump: false, spin: false };
  authoredLines.forEach(line => {
    const scanText = (text: unknown) => {
      if (typeof text !== "string") return;
      if (hasIconToken(text, "wave")) marks.wave = true;
      if (hasIconToken(text, "clap")) marks.clap = true;
      if (hasIconToken(text, "jump")) marks.jump = true;
      if (hasIconToken(text, "spin") || hasIconToken(text, "turn")) marks.spin = true;
    };
    const scanPart = (part: unknown) => {
      if (typeof part === "string") {
        scanText(part);
        return;
      }
      if (!Array.isArray(part)) return;
      part.forEach((segment: LyricSegment) => {
        if (segment.tag === "clap") marks.clap = true;
        scanText(segment.text);
      });
    };
    scanPart(line.jpSegments || line.jp);
    scanPart(line.trSegments || line.tr);
  });
  lines.forEach(line => {
    const chant = line.chant;
    if (chant?.kr) marks.chant.kr += 1;
    if (guided ? Boolean(chant?.jp || chant?.backing) : Boolean(chant?.kr)) marks.chant.jp += 1;
  });
  return marks;
}

function throwIfErrors(log: IssueLog): void {
  if (log.errors.length) throw new CatalogueError(log.errors);
}

/** Assembles one song; throws a CatalogueError listing every violated rule. */
export function assembleSong(id: string, sources: CatalogueSources): Song {
  const log = new IssueLog();
  const index = sources.metadata.findIndex(entry => entry.id === id);
  if (index < 0) {
    log.add("unknown-song", "no metadata entry with this id", id);
    throw new CatalogueError(log.errors);
  }
  const song = buildSong(sources.metadata[index], index + 1, sources, mergeReadings(sources), log);
  throwIfErrors(log);
  return song;
}

export type AssembledCatalogue = {
  songs: Song[];
  summaries: SongSummary[];
  warnings: CatalogueIssue[];
  /** Reading-table keys that match no lyric line, segment or backing chant text. */
  deadReadingKeys: { table: keyof CatalogueSources["readings"]; key: string }[];
};

/** Assembles every song and checks cross-song invariants; throws a CatalogueError with all errors. */
export function assembleCatalogue(sources: CatalogueSources): AssembledCatalogue {
  const log = new IssueLog();
  const readings = mergeReadings(sources);
  const metadataIds = new Set<string>();
  sources.metadata.forEach(entry => {
    if (metadataIds.has(entry.id)) log.add("id-set", "appears more than once in the metadata", entry.id);
    metadataIds.add(entry.id);
    if (!PLAIN_ID_RE.test(entry.id)) {
      log.add("id-punctuation", "id must contain only ASCII letters and digits", entry.id);
    }
  });

  const songs = sources.metadata.map((meta, index) => buildSong(meta, index + 1, sources, readings, log));

  sources.lyrics.forEach(entry => {
    if (!metadataIds.has(entry.id)) log.add("id-set", "has a lyrics entry but no metadata", entry.id);
  });
  Object.keys(sources.bpm).forEach(id => {
    if (!metadataIds.has(id)) log.add("id-set", "has a BPM entry but no metadata", id);
  });
  Object.keys(sources.chantGuides).forEach(id => {
    if (!metadataIds.has(id)) log.add("id-set", "has a chant guide but no metadata", id);
  });
  sources.setlist.items.forEach(item => item.songs.forEach(entry => {
    if (!metadataIds.has(entry.id)) log.add("id-set", "is in the setlist but has no metadata", entry.id);
  }));

  const liveTexts = new Set<string>();
  sources.lyrics.forEach(entry => (entry.lyrics || []).forEach(line => {
    liveTexts.add(String(line.jp ?? ""));
    (line.jpSegments || []).forEach(segment => liveTexts.add(String(segment?.text ?? "")));
  }));
  Object.values(sources.chantGuides).forEach(guide => {
    (guide.chantSegments || []).forEach(segment => liveTexts.add(String(segment?.text ?? "")));
    (guide.backingChants || []).forEach(item => liveTexts.add(String(item?.text ?? "")));
  });
  const deadReadingKeys: AssembledCatalogue["deadReadingKeys"] = [];
  (Object.keys(sources.readings) as (keyof CatalogueSources["readings"])[]).forEach(table => {
    Object.keys(sources.readings[table]).forEach(key => {
      if (!liveTexts.has(key)) deadReadingKeys.push({ table, key });
    });
  });
  deadReadingKeys.forEach(({ table, key }) => {
    log.add("dead-reading-key", `${table} key ${JSON.stringify(key)} matches no lyric line, segment or backing chant`);
  });

  throwIfErrors(log);
  return {
    songs,
    summaries: songs.map(({ lyrics: _lyrics, chant: _chant, ...summary }) => summary),
    warnings: log.warnings,
    deadReadingKeys,
  };
}
