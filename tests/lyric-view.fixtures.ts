/* Shared inputs for the lyric view tests: the real catalogue and the 39 × 3 × 2 matrix. */
import "../karaoke-sources.js";
import { createHash } from "node:crypto";
import { assembleCatalogue, type Song } from "../src/catalogue/assemble";
import type { ChantVersion, ReadingMode } from "../src/lyric-view/rows";
import { loadRealSources } from "./real-sources";

export const READING_MODES: ReadingMode[] = ["kana", "romaji", "both"];
export const CHANT_VERSIONS: ChantVersion[] = ["jp", "kr"];

/** Japanese guide with jpSegments and backing chants; and a song with Korean-version markers only. */
export const REPRESENTATIVE_SONGS = ["IdeagaAfureteNemurenai", "Reunion"];
/* Full markup is kept for two combinations; every combination is covered by the hashes. */
export const REPRESENTATIVE_OPTIONS: { readingMode: ReadingMode; chantVersion: ChantVersion }[] = [
  { readingMode: "both", chantVersion: "jp" },
  { readingMode: "romaji", chantVersion: "kr" },
];

export async function loadRealSongs(): Promise<Song[]> {
  return assembleCatalogue(await loadRealSources()).songs;
}

/** The karaoke adapter's allocator, loaded as a classic script by real-sources. */
export function karaokeSources(): object {
  return (globalThis as { KARAOKE_SOURCES?: object }).KARAOKE_SOURCES!;
}

export function shortHash(text: string): string {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

export function matrix(songs: Song[]): { song: Song; readingMode: ReadingMode; chantVersion: ChantVersion }[] {
  return songs.flatMap(song => READING_MODES.flatMap(readingMode =>
    CHANT_VERSIONS.map(chantVersion => ({ song, readingMode, chantVersion }))));
}
