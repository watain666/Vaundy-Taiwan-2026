/* Chant cues: one rule per fact, read from the catalogue's line.chant and marks. */
import { beforeAll, describe, expect, test } from "vitest";
import { assembleCatalogue, type Song } from "../src/catalogue/assemble";
import { list } from "../src/catalogue/index";
import { backingChants, chantBlocks, lineHasChantCue, lineIsChant, songMarks } from "../src/chant/index";
import { makeSources } from "./fixtures";
import { loadRealSongs } from "./lyric-view.fixtures";

describe("on the fixture catalogue", () => {
  const [alpha, beta] = assembleCatalogue(makeSources()).songs;
  const cues = (song: Song, version: "jp" | "kr") => song.lyrics.map(line => [
    lineIsChant(line, song, version), backingChants(line, version).length, lineHasChantCue(line, song, version),
  ]);

  test("the chant version switches the answers without any cache clearing", () => {
    expect(cues(alpha, "jp")).toEqual([[false, 1, true], [true, 1, true], [true, 0, true]]);
    expect(cues(alpha, "kr")).toEqual([[false, 0, false], [true, 0, true], [false, 0, false]]);
    expect(cues(alpha, "jp")).toEqual([[false, 1, true], [true, 1, true], [true, 0, true]]);
    expect(chantBlocks(alpha, "jp")).toEqual([{ from: 0, to: 2, start: 0, end: 29.1 }]);
    expect(chantBlocks(alpha, "kr")).toEqual([{ from: 1, to: 1, start: 8.8, end: 21.1 }]);
    expect(chantBlocks(alpha, "jp")).toEqual([{ from: 0, to: 2, start: 0, end: 29.1 }]);
    expect(songMarks(alpha, "jp").chant).toBe(3);
    expect(songMarks(alpha, "kr").chant).toBe(1);
  });

  test("a song without a chant guide falls back to the lyric markers in the Japanese version", () => {
    expect(cues(beta, "jp")).toEqual(cues(beta, "kr"));
    expect(cues(beta, "jp")).toEqual([[true, 0, true], [false, 0, false]]);
  });

  test("chant blocks recompute when the line timing changes, and are reused when it does not", () => {
    const fromLines = chantBlocks(alpha, "kr", index => alpha.lyrics[index].time);
    expect(chantBlocks(alpha, "kr", index => alpha.lyrics[index].time)).toBe(fromLines);
    const shifted = chantBlocks(alpha, "kr", index => alpha.lyrics[index].time + 1);
    expect(shifted).toEqual([{ from: 1, to: 1, start: 9.8, end: 22.1 }]);
    expect(chantBlocks(alpha, "kr")).toEqual(fromLines);
  });

  test("nearby chant runs merge into one block", () => {
    const song = { ...beta, lyrics: [beta.lyrics[0], beta.lyrics[1], { ...beta.lyrics[0], index: 2, time: 11 }] };
    expect(chantBlocks(song, "kr")).toEqual([{ from: 0, to: 2, start: 3.8, end: 19.6 }]);
    expect(chantBlocks(song, "kr", index => [5, 9, 30][index])).toHaveLength(2);
  });

  test("no song, no blocks", () => {
    expect(chantBlocks(null, "jp")).toEqual([]);
  });
});

describe("on the real catalogue", () => {
  let songs: Song[];
  beforeAll(async () => {
    songs = await loadRealSongs();
  });

  test("song marks are the catalogue marks, for a loaded song and its summary alike", () => {
    const summaries = list();
    expect(songs.map(song => song.id)).toEqual(summaries.map(song => song.id));
    songs.forEach((song, index) => (["jp", "kr"] as const).forEach(version => {
      const { chant, ...actions } = song.marks;
      expect(songMarks(song, version)).toEqual({ chant: chant[version], ...actions });
      expect(songMarks(summaries[index], version)).toEqual(songMarks(song, version));
    }));
  });

  test("the badge count is the number of lines with a chant cue, and blocks cover only those lines", () => {
    songs.forEach(song => (["jp", "kr"] as const).forEach(version => {
      const cued = song.lyrics.filter(line => lineHasChantCue(line, song, version)).length;
      expect(songMarks(song, version).chant, `${song.id} ${version}`).toBe(cued);
      const covered = chantBlocks(song, version).flatMap(block =>
        song.lyrics.slice(block.from, block.to + 1).filter(line => lineHasChantCue(line, song, version)));
      expect(covered.length, `${song.id} ${version}`).toBe(cued);
    }));
  });
});
