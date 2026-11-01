/* Transitional: compares the derived marks with the hand-copied SONG_MARKS
   table before that table is deleted. The table's Korean-version chant
   counts for two songs went stale after later lyric edits; the derived
   value is what the song page highlights as chant lines in that version. */
import { expect, test } from "vitest";
import { assembleCatalogue } from "../src/catalogue/assemble";
import { SONG_MARKS } from "../src/song-mark-metadata.js";
import { loadRealSources } from "./real-sources";

const STALE_KR_COUNTS: Record<string, { table: number; derived: number }> = {
  Fukakouryoku: { table: 21, derived: 24 },
  hanaurana: { table: 11, derived: 18 },
};

test("derived marks equal the SONG_MARKS table except two stale Korean counts", async () => {
  const { summaries } = assembleCatalogue(await loadRealSources());
  const derived = Object.fromEntries(summaries.map(song => [song.id, song.marks]));
  const expected = structuredClone(SONG_MARKS) as Record<string, { chant: { kr: number } }>;
  Object.entries(STALE_KR_COUNTS).forEach(([id, { table, derived: count }]) => {
    expect(expected[id].chant.kr).toBe(table);
    expected[id].chant.kr = count;
  });
  expect(derived).toEqual(expected);
});
