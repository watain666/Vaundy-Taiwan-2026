/* Small synthetic authoring data for the catalogue core tests. */
import "../karaoke-sources.js";
import type { CatalogueSources, KaraokeAlignment } from "../src/catalogue/assemble";

export const karaoke = (globalThis as unknown as { KARAOKE_SOURCES: KaraokeAlignment }).KARAOKE_SOURCES;

export const DEFAULT_URL = "https://example.test/default-credit";

/** Two songs, five lines, one chant guide with a segment and a backing chant. */
export function makeSources(): CatalogueSources {
  return {
    metadata: [
      {
        id: "Alpha",
        title: "阿爾法 (アルファ)",
        translationCredit: "Translator A",
        youtubeId: "yt-alpha",
        spotifyTrackId: "AAAAAAAAAAAAAAAAAAAAA1",
      },
      {
        id: "Beta",
        title: "貝塔 (ベータ)",
        translationCredit: "AI",
        translationCreditUrl: null,
        youtubeId: "yt-beta",
        spotifyTrackId: "BBBBBBBBBBBBBBBBBBBBB2",
      },
    ],
    lyrics: [
      {
        id: "Alpha",
        title: "阿爾法 (アルファ)",
        translationCredit: "Translator A",
        youtubeId: "yt-alpha",
        lyrics: [
          { time: 0, jp: "[clap]夜の歌", tr: "夜之歌" },
          {
            time: 10,
            jp: "Hey そうだ",
            tr: "Hey 對",
            jpSegments: [{ text: "Hey " }, { text: "そうだ", tag: "chant" }],
          },
          { time: 20.5, jp: "[wave]Na Na Na", tr: "Na Na Na" },
        ],
      },
      {
        id: "Beta",
        title: "貝塔 (ベータ)",
        translationCredit: "AI",
        translationCreditUrl: null,
        youtubeId: "yt-beta",
        lyrics: [
          { time: 5, jp: "[mic]ラララ", tr: "啦啦啦" },
          { time: 9, jp: "[jump]Go", tr: "Go" },
        ],
      },
    ],
    bpm: { Alpha: 120, Beta: 90 },
    chantGuides: {
      Alpha: {
        notes: ["note"],
        chantTimes: [20.5],
        chantSegments: [{ time: 10, text: "そうだ", romaji: "sō da" }],
        backingChants: [{ start: 1, end: 12, text: "ラララ" }],
      },
    },
    chantReferenceUrl: "https://example.test/chant",
    setlist: { items: [{ songs: [{ id: "Beta" }] }] },
    readings: {
      furigana: {
        "[clap]夜の歌": "[clap]<ruby>夜<rt>よ</rt></ruby>の<ruby>歌<rt>うた</rt></ruby>",
      },
      romaji: {
        "[clap]夜の歌": "[clap]yo no uta",
        "Hey そうだ": "Hey sō da",
        "そうだ": "sō da",
        "[mic]ラララ": "[mic]rarara",
        "ラララ": "rarara",
      },
      furiganaCorrections: {
        "[clap]夜の歌": "[clap]<ruby>夜<rt>よる</rt></ruby>の<ruby>歌<rt>うた</rt></ruby>",
      },
      romajiCorrections: {
        "[clap]夜の歌": "[clap]yoru no uta",
      },
    },
    karaoke,
    defaultTranslationCreditUrl: DEFAULT_URL,
  };
}
