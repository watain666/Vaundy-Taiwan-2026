/*
 * Reads the authoring files into CatalogueSources. The caller supplies the
 * module importer, so the Vite plugin can bypass Node's module cache when a
 * file changes in dev while tests use a plain dynamic import.
 */
import type { CatalogueSources, KaraokeAlignment } from "./assemble";

/** Authoring files, relative to the repository root. */
export const AUTHORING_FILES = {
  metadata: "src/song-metadata.js",
  lyrics: "src/song-lyrics.js",
  chantGuide: "src/chant-guide.js",
  furigana: "furigana.js",
  corrections: "src/furigana-corrections.js",
  data: "src/data.js",
} as const;

/** The karaoke adapter; its alignment helpers back one invariant. */
export const KARAOKE_SOURCES_FILE = "karaoke-sources.js";

/** Default link for a translation credit that leaves translationCreditUrl unset. */
export const DEFAULT_TRANSLATION_CREDIT_URL = "https://home.gamer.com.tw/profile/index.php?owner=tsukilsao319";

export type ModuleImporter = (repoRelativePath: string) => Promise<any>;

export async function loadCatalogueSources(importModule: ModuleImporter): Promise<CatalogueSources> {
  const [metadata, lyrics, chantGuide, furigana, corrections, data] = await Promise.all([
    importModule(AUTHORING_FILES.metadata),
    importModule(AUTHORING_FILES.lyrics),
    importModule(AUTHORING_FILES.chantGuide),
    importModule(AUTHORING_FILES.furigana),
    importModule(AUTHORING_FILES.corrections),
    importModule(AUTHORING_FILES.data),
  ]);
  /* karaoke-sources.js is a classic script that assigns KARAOKE_SOURCES to
     window, or to globalThis outside a browser. */
  await importModule(KARAOKE_SOURCES_FILE);
  const karaoke = (globalThis as { KARAOKE_SOURCES?: KaraokeAlignment }).KARAOKE_SOURCES;
  if (!karaoke || typeof karaoke.mapUnitsToReferenceTimings !== "function") {
    throw new Error(`${KARAOKE_SOURCES_FILE} did not define KARAOKE_SOURCES.mapUnitsToReferenceTimings`);
  }
  return {
    metadata: metadata.SONGS,
    lyrics: lyrics.SONG_LYRICS,
    bpm: data.SONG_BPM,
    chantGuides: chantGuide.JP_CHANT_GUIDES,
    chantReferenceUrl: chantGuide.CHANT_REFERENCE_URL ?? null,
    setlist: data.SETLIST_TOKYO,
    readings: {
      furigana: furigana.JP_FURIGANA,
      romaji: furigana.JP_ROMAJI,
      furiganaCorrections: corrections.FURIGANA_CORRECTIONS,
      romajiCorrections: corrections.ROMAJI_CORRECTIONS,
    },
    karaoke,
    defaultTranslationCreditUrl: DEFAULT_TRANSLATION_CREDIT_URL,
  };
}
