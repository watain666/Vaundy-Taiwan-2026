import { describe, expect, test } from "vitest";
import {
  assembleCatalogue,
  assembleSong,
  CatalogueError,
  type CatalogueSources,
  type RuleName,
} from "../src/catalogue/assemble";
import { DEFAULT_URL, makeSources } from "./fixtures";

function catalogueError(sources: CatalogueSources): CatalogueError {
  try {
    assembleCatalogue(sources);
  } catch (error) {
    if (error instanceof CatalogueError) return error;
    throw error;
  }
  throw new Error("expected assembleCatalogue to throw a CatalogueError");
}

/** Asserts the catalogue is rejected for `rule`, naming the song and line. */
function expectRejected(sources: CatalogueSources, rule: RuleName, songId: string, lineIndex?: number) {
  const error = catalogueError(sources);
  const issue = error.issues.find(item => item.rule === rule && item.songId === songId
    && (lineIndex === undefined || item.lineIndex === lineIndex));
  expect(issue, `expected a ${rule} issue for ${songId}#${lineIndex}; got:\n${error.message}`).toBeDefined();
  expect(error.message).toContain(`[${rule}]`);
  expect(error.message).toContain(JSON.stringify(songId));
  if (lineIndex !== undefined) expect(error.message).toContain(`line ${lineIndex}`);
  return error;
}

function alpha(sources: CatalogueSources) {
  return sources.lyrics.find(entry => entry.id === "Alpha")!;
}

describe("assembleCatalogue on valid sources", () => {
  const catalogue = assembleCatalogue(makeSources());
  const [a, b] = catalogue.songs;

  test("numbers songs by metadata order and keeps the lyrics field", () => {
    expect(catalogue.songs.map(song => [song.id, song.number])).toEqual([["Alpha", 1], ["Beta", 2]]);
    expect(a.lyrics.map(line => line.index)).toEqual([0, 1, 2]);
    expect(a.titleJa).toBe("アルファ");
    expect(a.bpm).toBe(120);
    expect(catalogue.summaries[0]).not.toHaveProperty("lyrics");
  });

  test("corrections take precedence over the base reading tables", () => {
    expect(a.lyrics[0].reading).toBe("[clap]<ruby>夜<rt>よる</rt></ruby>の<ruby>歌<rt>うた</rt></ruby>");
    expect(a.lyrics[0].romaji).toBe("[clap]yoru no uta");
  });

  test("kana-only and Latin lines carry romaji but no reading", () => {
    expect(a.lyrics[1].reading).toBeUndefined();
    expect(a.lyrics[1].romaji).toBe("Hey sō da");
    expect(a.lyrics[2].reading).toBeUndefined();
    expect(a.lyrics[2].romaji).toBeUndefined();
  });

  test("chant-tagged lyric segments carry their romaji", () => {
    expect(a.lyrics[1].jpSegments).toEqual([{ text: "Hey " }, { text: "そうだ", tag: "chant", romaji: "sō da" }]);
  });

  test("chant guide times resolve onto lines", () => {
    expect(a.lyrics[1].chant?.jp).toEqual({ full: false, segments: [{ time: 10, text: "そうだ", romaji: "sō da" }] });
    expect(a.lyrics[2].chant?.jp).toEqual({ full: true, segments: [] });
    expect(b.lyrics[0].chant).toEqual({ kr: true });
    expect(b.lyrics[1].chant).toBeUndefined();
  });

  test("backing chants attach to every line whose interval overlaps", () => {
    const backing = { start: 1, end: 12, text: "ラララ", romaji: "rarara" };
    expect(a.lyrics[0].chant?.backing).toEqual([backing]);
    expect(a.lyrics[1].chant?.backing).toEqual([backing]);
    expect(a.lyrics[2].chant?.backing).toBeUndefined();
  });

  test("translation credit URL tri-state is resolved", () => {
    const sources = makeSources();
    sources.metadata = [
      ...sources.metadata,
      { id: "Gamma", title: "Gamma", translationCredit: "C", translationCreditUrl: "https://example.test/c", youtubeId: "g", spotifyTrackId: "CCCCCCCCCCCCCCCCCCCCC3" },
    ];
    sources.lyrics = [...sources.lyrics, { id: "Gamma", title: "Gamma", translationCredit: "C", translationCreditUrl: "https://example.test/c", youtubeId: "g", lyrics: [{ time: 0, jp: "Go" }] }];
    sources.bpm = { ...sources.bpm, Gamma: 100 };
    const urls = assembleCatalogue(sources).summaries.map(song => song.translationCreditUrl);
    expect(urls).toEqual([DEFAULT_URL, null, "https://example.test/c"]);
  });

  test("marks are derived from the lyrics and the chant guide", () => {
    expect(a.marks).toEqual({ chant: { jp: 3, kr: 1 }, clap: true, wave: true, jump: false, spin: false });
    expect(b.marks).toEqual({ chant: { jp: 1, kr: 1 }, clap: false, wave: false, jump: true, spin: false });
  });

  test("chant notes, reference URL and the guide flag come from the guide", () => {
    expect(a.chant).toEqual({ notes: ["note"], referenceUrl: "https://example.test/chant", hasGuide: true });
    expect(b.chant).toEqual({ notes: [], referenceUrl: null, hasGuide: false });
  });

  test("assembleSong returns the same song as the catalogue", () => {
    expect(assembleSong("Beta", makeSources())).toEqual(b);
  });

  test("no warnings for clean sources", () => {
    expect(catalogue.warnings).toEqual([]);
    expect(catalogue.deadReadingKeys).toEqual([]);
  });
});

describe("chant time buckets", () => {
  test("a time within the same hundredth matches", () => {
    const sources = makeSources();
    sources.chantGuides.Alpha.chantTimes = [20.504];
    expect(assembleCatalogue(sources).songs[0].lyrics[2].chant?.jp?.full).toBe(true);
  });

  test("a time one hundredth away does not match and is rejected", () => {
    const sources = makeSources();
    sources.chantGuides.Alpha.chantTimes = [20.51];
    expectRejected(sources, "chant-time-unmatched", "Alpha");
  });
});

describe("build errors", () => {
  test("missing romaji for a Japanese line", () => {
    const sources = makeSources();
    alpha(sources).lyrics[0] = { time: 0, jp: "[clap]夜の雨", tr: "x" };
    sources.readings.furigana = { ...sources.readings.furigana, "[clap]夜の雨": "[clap]<ruby>夜<rt>よる</rt></ruby>の<ruby>雨<rt>あめ</rt></ruby>" };
    expectRejected(sources, "romaji-missing", "Alpha", 0);
  });

  test("romaji that still contains Japanese", () => {
    const sources = makeSources();
    sources.readings.romajiCorrections = { "[clap]夜の歌": "[clap]yoru no 歌" };
    expectRejected(sources, "romaji-japanese", "Alpha", 0);
  });

  test("missing romaji for a chant segment", () => {
    const sources = makeSources();
    const { "そうだ": _removed, ...romaji } = sources.readings.romaji;
    sources.readings.romaji = romaji;
    expectRejected(sources, "segment-romaji-missing", "Alpha", 1);
  });

  test("missing romaji for a backing chant", () => {
    const sources = makeSources();
    sources.chantGuides.Alpha.backingChants = [{ start: 1, end: 12, text: "ルルル" }];
    expectRejected(sources, "segment-romaji-missing", "Alpha");
  });

  test("chant guide romaji that contains Japanese", () => {
    const sources = makeSources();
    sources.chantGuides.Alpha.chantSegments = [{ time: 10, text: "そうだ", romaji: "そう da" }];
    expectRejected(sources, "segment-romaji-japanese", "Alpha");
  });

  test("romaji units that do not align with the reading units", () => {
    const sources = makeSources();
    sources.readings.romajiCorrections = { "[clap]夜の歌": "[clap]yoru no uta extra words here" };
    expectRejected(sources, "karaoke-alignment", "Alpha", 0);
  });

  test("a kanji line without a kana reading", () => {
    const sources = makeSources();
    sources.readings.furigana = {};
    sources.readings.furiganaCorrections = {};
    expectRejected(sources, "reading-missing", "Alpha", 0);
  });

  test("identity fields that differ between metadata and lyrics", () => {
    const sources = makeSources();
    alpha(sources).title = "阿爾法 (アルファ) typo";
    expectRejected(sources, "identity-mismatch", "Alpha");
  });

  test("a song with metadata but no lyrics entry", () => {
    const sources = makeSources();
    sources.lyrics = sources.lyrics.filter(entry => entry.id !== "Beta");
    expectRejected(sources, "id-set", "Beta");
  });

  test("a lyrics, BPM, chant guide or setlist id without metadata", () => {
    const sources = makeSources();
    sources.lyrics = [...sources.lyrics, { id: "Orphan", title: "O", translationCredit: "", youtubeId: "o", lyrics: [] }];
    sources.bpm = { ...sources.bpm, OrphanBpm: 100 };
    sources.chantGuides = { ...sources.chantGuides, OrphanGuide: {} };
    sources.setlist = { items: [{ songs: [{ id: "OrphanSet" }] }] };
    const error = catalogueError(sources);
    const ids = error.issues.filter(issue => issue.rule === "id-set").map(issue => issue.songId);
    expect(ids).toEqual(["Orphan", "OrphanBpm", "OrphanGuide", "OrphanSet"]);
  });

  test("a missing BPM no longer falls back to 120", () => {
    const sources = makeSources();
    sources.bpm = { Alpha: 120 };
    expectRejected(sources, "bpm-missing", "Beta");
  });

  test("a chant segment time that matches no line", () => {
    const sources = makeSources();
    sources.chantGuides.Alpha.chantSegments = [{ time: 11, text: "そうだ", romaji: "sō da" }];
    expectRejected(sources, "chant-time-unmatched", "Alpha");
  });

  test("a backing chant that overlaps no line", () => {
    const sources = makeSources();
    sources.chantGuides.Alpha.backingChants = [{ start: -5, end: -1, text: "ラララ" }];
    expectRejected(sources, "backing-chant-unmatched", "Alpha");
  });

  test("lyric times that do not strictly increase", () => {
    const sources = makeSources();
    alpha(sources).lyrics[2] = { ...alpha(sources).lyrics[2], time: 10 };
    sources.chantGuides.Alpha.chantTimes = [10];
    expectRejected(sources, "time-order", "Alpha", 2);
  });

  test("a Spotify track ID that is not 22 alphanumerics", () => {
    const sources = makeSources();
    sources.metadata = sources.metadata.map(entry => entry.id === "Beta" ? { ...entry, spotifyTrackId: "horo-beta" } : entry);
    expectRejected(sources, "spotify-track-id", "Beta");
  });

  test("a null Spotify track ID marks a song that is not on Spotify", () => {
    const sources = makeSources();
    sources.metadata = sources.metadata.map(entry => entry.id === "Beta" ? { ...entry, spotifyTrackId: null } : entry);
    expect(assembleSong("Beta", sources).spotifyTrackId).toBeNull();
  });

  test("a missing Spotify track ID is still rejected", () => {
    const sources = makeSources();
    sources.metadata = sources.metadata.map(entry => entry.id === "Beta" ? { ...entry, spotifyTrackId: undefined as unknown as string } : entry);
    expectRejected(sources, "spotify-track-id", "Beta");
  });

  test("assembleSong rejects an unknown id", () => {
    expect(() => assembleSong("Nope", makeSources())).toThrow(CatalogueError);
    expect(() => assembleSong("Nope", makeSources())).toThrow(/\[unknown-song\] song "Nope"/);
  });

  test("every violation is reported, not only the first", () => {
    const sources = makeSources();
    sources.bpm = { Alpha: 120 };
    sources.metadata = sources.metadata.map(entry => entry.id === "Alpha" ? { ...entry, spotifyTrackId: "x" } : entry);
    const rules = catalogueError(sources).issues.map(issue => `${issue.rule}:${issue.songId}`);
    expect(rules).toEqual(expect.arrayContaining(["spotify-track-id:Alpha", "bpm-missing:Beta"]));
  });
});

describe("dead reading keys", () => {
  test("a reading key that matches no lyric text is a build error", () => {
    const sources = makeSources();
    sources.readings.romaji = { ...sources.readings.romaji, "[clap]古い歌詞": "[clap]furui kashi" };
    const error = catalogueError(sources);
    expect(error.issues).toEqual([expect.objectContaining({ rule: "dead-reading-key", severity: "error" })]);
    expect(error.message).toContain('[dead-reading-key]: romaji key "[clap]古い歌詞"');
  });
});

describe("song ids", () => {
  test("an id with whitespace or punctuation is a build error", () => {
    const sources = makeSources();
    sources.metadata = sources.metadata.map(entry => entry.id === "Beta" ? { ...entry, id: " Beta'" } : entry);
    sources.lyrics = sources.lyrics.map(entry => entry.id === "Beta" ? { ...entry, id: " Beta'" } : entry);
    sources.bpm = { Alpha: 120, " Beta'": 90 };
    sources.setlist = { items: [] };
    const error = catalogueError(sources);
    expect(error.issues).toEqual([expect.objectContaining({ rule: "id-punctuation", severity: "error", songId: " Beta'" })]);
    expect(error.message).toContain("id must contain only ASCII letters and digits");
  });

  test("an id of ASCII letters and digits is accepted", () => {
    const sources = makeSources();
    sources.metadata = sources.metadata.map(entry => entry.id === "Beta" ? { ...entry, id: "Beta2" } : entry);
    sources.lyrics = sources.lyrics.map(entry => entry.id === "Beta" ? { ...entry, id: "Beta2" } : entry);
    sources.bpm = { Alpha: 120, Beta2: 90 };
    sources.setlist = { items: [] };
    expect(assembleCatalogue(sources).songs[1].id).toBe("Beta2");
  });
});

describe("bundled word timing", () => {
  /* Alpha line 1 is "Hey そうだ" at 10; line 0 is "[clap]夜の歌" at 0. */
  function withWordTiming(lines: Record<string, [string, number, number][]>) {
    const sources = makeSources();
    sources.wordTiming = { Alpha: { source: "KuGou KRC", sourceId: 123, offset: 0.4, lines } };
    return sources;
  }

  test("joins words to the row with the same time bucket", () => {
    const sources = withWordTiming({ "10.001": [["Hey", 10.05, 10.4], ["そう", 10.4, 10.8], ["だ", 10.8, 11]] });
    const catalogue = assembleCatalogue(sources);
    const [a, b] = catalogue.songs;
    expect(a.lyrics[1].words).toEqual([
      { text: "Hey", start: 10.05, end: 10.4 },
      { text: "そう", start: 10.4, end: 10.8 },
      { text: "だ", start: 10.8, end: 11 },
    ]);
    expect(a.lyrics[0].words).toBeUndefined();
    expect(a.wordTiming).toEqual({ source: "KuGou KRC", sourceId: "123", offset: 0.4 });
    expect(b.wordTiming).toBeUndefined();
    expect(catalogue.summaries[0]).not.toHaveProperty("wordTiming");
  });

  test("icon tokens and whitespace in the row do not count as text", () => {
    const sources = withWordTiming({ "0": [["夜", 0.1, 0.3], ["の", 0.3, 0.4], ["歌", 0.4, 0.9]] });
    expect(assembleCatalogue(sources).songs[0].lyrics[0].words).toHaveLength(3);
  });

  test("bundled timing for a song without metadata", () => {
    const sources = makeSources();
    sources.wordTiming = { Ghost: { source: "KuGou KRC", sourceId: "1", offset: 0, lines: {} } };
    expectRejected(sources, "word-timing-unknown-song", "Ghost");
  });

  test("a key that matches no lyric line time", () => {
    const sources = withWordTiming({ "10.01": [["Hey", 10.05, 10.4], ["そうだ", 10.4, 11]] });
    const error = expectRejected(sources, "word-timing-dead-key", "Alpha");
    expect(error.message).toContain('key "10.01"');
  });

  test("words that do not spell the row text", () => {
    const sources = withWordTiming({ "10": [["Hey", 10, 10.4], ["そうか", 10.4, 11]] });
    const error = expectRejected(sources, "word-timing-text-mismatch", "Alpha", 1);
    expect(error.message).toContain('"Heyそうか"');
  });

  test("word starts that go backwards", () => {
    const sources = withWordTiming({ "10": [["Hey", 10.2, 10.4], ["そうだ", 10.1, 11]] });
    expectRejected(sources, "word-timing-order", "Alpha", 1);
  });

  test("a word that ends before it starts", () => {
    const sources = withWordTiming({ "10": [["Hey", 10, 10.4], ["そうだ", 10.4, 10.3]] });
    expectRejected(sources, "word-timing-order", "Alpha", 1);
  });

  test("a malformed word", () => {
    const sources = withWordTiming({ "10": [["Hey", 10, 10.4], ["そうだ", Number.NaN, 11]] });
    expectRejected(sources, "word-timing-order", "Alpha", 1);
  });

  test("a first word more than 0.3s from the row time", () => {
    expect(() => assembleCatalogue(withWordTiming({ "10": [["Hey", 10.3, 10.4], ["そうだ", 10.4, 11]] }))).not.toThrow();
    expect(() => assembleCatalogue(withWordTiming({ "10": [["Hey", 9.7, 10.4], ["そうだ", 10.4, 11]] }))).not.toThrow();
    expectRejected(withWordTiming({ "10": [["Hey", 10.31, 10.4], ["そうだ", 10.4, 11]] }), "word-timing-start-offset", "Alpha", 1);
  });

  test("assembleSong checks word timing too", () => {
    const sources = withWordTiming({ "10": [["Hey", 10, 10.4], ["そうか", 10.4, 11]] });
    expect(() => assembleSong("Alpha", sources)).toThrow(/\[word-timing-text-mismatch\] song "Alpha" line 1/);
  });
});

describe("live timing", () => {
  /* Alpha has three rows (0, 10, 20.5). */
  function withLive(entry: Partial<{ youtubeId: string; label: string; times: number[] }>) {
    const sources = makeSources();
    sources.liveTiming = { Alpha: { youtubeId: "abcDEF_-123", label: "Dome Tour", times: [1, 11, 22], ...entry } };
    return sources;
  }

  test("attaches the live video and times to the song, and its video only to the summary", () => {
    const catalogue = assembleCatalogue(withLive({}));
    const [a, b] = catalogue.songs;
    expect(a.live).toEqual({ youtubeId: "abcDEF_-123", label: "Dome Tour", times: [1, 11, 22] });
    expect(a.youtubeId).toBe("yt-alpha");
    expect(b.live).toBeUndefined();
    expect(catalogue.summaries[0].live).toEqual({ youtubeId: "abcDEF_-123", label: "Dome Tour" });
    expect(catalogue.summaries[1]).not.toHaveProperty("live");
  });

  test("studio row times stay untouched", () => {
    const [a] = assembleCatalogue(withLive({})).songs;
    expect(a.lyrics.map(line => line.time)).toEqual([0, 10, 20.5]);
  });

  test("live-timing-unknown-song", () => {
    const sources = makeSources();
    sources.liveTiming = { Ghost: { youtubeId: "abcDEF_-123", label: "x", times: [] } };
    expectRejected(sources, "live-timing-unknown-song", "Ghost");
  });

  test.each(["short", "abcDEF_-1234", "abcDEF!-123", ""])("live-timing-youtube-id rejects %j", youtubeId => {
    expectRejected(withLive({ youtubeId }), "live-timing-youtube-id", "Alpha");
  });

  test("live-timing-youtube-id rejects an empty label", () => {
    expectRejected(withLive({ label: " " }), "live-timing-youtube-id", "Alpha");
  });

  test.each([[[1, 11]], [[1, 11, 22, 30]], [[]]])("live-timing-row-count rejects %j", times => {
    expectRejected(withLive({ times }), "live-timing-row-count", "Alpha");
  });

  test("live-timing-order rejects a repeated time and names the row", () => {
    expectRejected(withLive({ times: [1, 11, 11] }), "live-timing-order", "Alpha", 2);
  });

  test("live-timing-order rejects a decreasing time", () => {
    expectRejected(withLive({ times: [5, 4, 6] }), "live-timing-order", "Alpha", 1);
  });

  test("live-timing-order rejects a negative or non-finite time", () => {
    expectRejected(withLive({ times: [-1, 11, 22] }), "live-timing-order", "Alpha", 0);
    expectRejected(withLive({ times: [1, Number.NaN, 22] }), "live-timing-order", "Alpha", 1);
  });
});
