/* The runtime interface, served by the song-catalogue Vite plugin. */
import { expect, test } from "vitest";
import { get, list, load, UnknownSongError } from "../src/catalogue/index";

test("list returns every summary in metadata order without lyrics", () => {
  const songs = list();
  expect(songs).toHaveLength(71);
  expect(songs.map(song => song.number)).toEqual(songs.map((_, index) => index + 1));
  expect(songs[0]).not.toHaveProperty("lyrics");
  expect(songs[0].id).toBe("Tokimeki");
});

test("get finds clean ids", () => {
  expect(get("Kimagure")?.title).toBe("気まぐれ (任性)");
  expect(get("SonnaBitternaHanashi")?.bpm).toBe(178);
  expect(get("Kimagure ")).toBeUndefined();
});

test("load resolves a full song with readings on its lines", async () => {
  const song = await load("Kimagure");
  expect(song.id).toBe("Kimagure");
  expect(song.translationCreditUrl).toBeNull();
  expect(song.lyrics.length).toBeGreaterThan(0);
  expect(song.lyrics.some(line => line.reading?.includes("<ruby>"))).toBe(true);
  expect(await load("Kimagure")).toBe(song);
});

test("load rejects an unknown id with UnknownSongError", async () => {
  await expect(load("NoSuchSong")).rejects.toBeInstanceOf(UnknownSongError);
  await expect(load("NoSuchSong")).rejects.toMatchObject({ songId: "NoSuchSong" });
});
