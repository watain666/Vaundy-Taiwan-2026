/* Runs the catalogue core on the real authoring files. */
import { beforeAll, describe, expect, test } from "vitest";
import { assembleCatalogue, timeBucket, type AssembledCatalogue, type Song } from "../src/catalogue/assemble";
import { JP_CHANT_GUIDES } from "../src/chant-guide.js";
import { loadRealSources } from "./real-sources";

let catalogue: AssembledCatalogue;

beforeAll(async () => {
  catalogue = assembleCatalogue(await loadRealSources());
});

function indices(song: Song, predicate: (line: Song["lyrics"][number]) => boolean): string {
  return song.lyrics.filter(predicate).map(line => line.index).join(",") || "-";
}

/** Per-song facts that must change only when the authoring data changes. */
function golden(songs: Song[]): string {
  const total = songs.reduce((count, song) => count + song.lyrics.length, 0);
  const blocks = songs.map(song => {
    const { chant, clap, wave, jump, spin } = song.marks;
    const actions = Object.entries({ clap, wave, jump, spin }).filter(([, on]) => on).map(([name]) => name);
    return [
      `#${String(song.number).padStart(2, "0")} ${JSON.stringify(song.id)}`,
      `  lines: ${song.lyrics.length}`,
      `  linesWithReading: ${song.lyrics.filter(line => line.reading).length}`,
      `  linesWithRomaji: ${song.lyrics.filter(line => line.romaji !== undefined).length}`,
      `  marks: chant jp=${chant.jp} kr=${chant.kr}; ${actions.join(" ") || "-"}`,
      `  chantLines.jp: ${indices(song, line => Boolean(line.chant?.jp))}`,
      `  chantLines.jpSegments: ${indices(song, line => Boolean(line.chant?.jp?.segments.length))}`,
      `  chantLines.kr: ${indices(song, line => Boolean(line.chant?.kr))}`,
      `  backingChantLines: ${indices(song, line => Boolean(line.chant?.backing))}`,
      `  translationCreditUrl: ${song.translationCreditUrl ?? "null (text only)"}`,
    ].join("\n");
  });
  return `${songs.length} songs, ${total} lyric lines\n\n${blocks.join("\n\n")}\n`;
}

test("golden snapshot of the assembled catalogue", async () => {
  await expect(golden(catalogue.songs)).toMatchFileSnapshot("./__snapshots__/song-catalogue.golden.txt");
});

test("real data has no build errors or warnings", () => {
  expect(catalogue.songs).toHaveLength(36);
  expect(catalogue.warnings).toEqual([]);
});

test("Reunion keeps the user-confirmed 夏=ここ reading", () => {
  const reunion = catalogue.songs.find(song => song.id === "Reunion")!;
  const line = reunion.lyrics.find(item => item.jp === "[wave]君に出会えるからまた夏で話そう");
  expect(line?.reading).toMatch(/<ruby>夏<rt>ここ<\/rt><\/ruby>/u);
});

/* The page's chant functions still read JP_CHANT_GUIDES directly with their
   own matching (±1 hundredth for whole lines, |Δ| < 0.01 for segments).
   line.chant must agree with them until those functions move onto it. */
describe("line.chant agrees with the page's legacy chant matching", () => {
  test.each(Object.keys(JP_CHANT_GUIDES))("%s", id => {
    const song = catalogue.songs.find(item => item.id === id)!;
    const guide = (JP_CHANT_GUIDES as Record<string, { chantTimes?: number[]; chantSegments?: { time: number; text: string }[] }>)[id];
    const any = new Set([...(guide.chantTimes || []), ...(guide.chantSegments || []).map(segment => segment.time)].map(timeBucket));
    song.lyrics.forEach(line => {
      const bucket = timeBucket(line.time);
      const legacyCue = any.has(bucket - 1) || any.has(bucket) || any.has(bucket + 1);
      expect(Boolean(line.chant?.jp), `${id}#${line.index}`).toBe(legacyCue);
      const legacySegments = (guide.chantSegments || []).filter(segment =>
        segment && Math.abs(Number(segment.time) - line.time) < 0.01 && segment.text);
      expect(line.chant?.jp?.segments ?? [], `${id}#${line.index}`).toEqual(legacySegments);
    });
  });
});
