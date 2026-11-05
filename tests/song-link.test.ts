/* Song page links: `#/song/<id>?t=…&src=…` parsing. */
import { describe, expect, test } from "vitest";
import { parseSongRoute, parseSource, parseStartSeconds } from "../src/services/song-link";

describe("parseStartSeconds", () => {
  test.each([
    ["113", 113],
    ["113.5", 113.5],
    ["113s", 113],
    ["1m53s", 113],
    ["2m", 120],
    ["1h2m3s", 3723],
    ["1:53", 113],
    ["1:02:03", 3723],
    ["0", 0],
  ])("%s -> %d", (text, seconds) => {
    expect(parseStartSeconds(text)).toBe(seconds);
  });

  test.each([null, "", "abc", "-5", "1:75", "1m-3s", "Infinity"])("rejects %j", text => {
    expect(parseStartSeconds(text)).toBeNull();
  });
});

describe("parseSource", () => {
  test("accepts live and mv in any case", () => {
    expect(parseSource("live")).toBe("live");
    expect(parseSource("MV")).toBe("mv");
    expect(parseSource("studio")).toBeNull();
    expect(parseSource(null)).toBeNull();
  });
});

describe("parseSongRoute", () => {
  test("plain id has no start or source", () => {
    expect(parseSongRoute("Backlight")).toEqual({ id: "Backlight", startSeconds: null, source: null });
  });

  test("reads t and src after the id", () => {
    expect(parseSongRoute("Backlight?t=113&src=live")).toEqual({ id: "Backlight", startSeconds: 113, source: "live" });
  });

  test("decodes an encoded id and ignores bad parameters", () => {
    expect(parseSongRoute("Song%27s?t=soon&src=x")).toEqual({ id: "Song's", startSeconds: null, source: null });
  });

  test("keeps a malformed encoding as raw text", () => {
    expect(parseSongRoute("Bad%E0?t=5").id).toBe("Bad%E0");
  });
});
