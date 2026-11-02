/* Pure row renderer: golden output for every song, reading mode and chant version (node, no DOM). */
import { beforeAll, describe, expect, test } from "vitest";
import type { Song } from "../src/catalogue/assemble";
import { wrapChantMarkup } from "../src/lyric-view/chant-markup";
import { renderLyricRows } from "../src/lyric-view/rows";
import { loadRealSongs, matrix, REPRESENTATIVE_OPTIONS, REPRESENTATIVE_SONGS, shortHash } from "./lyric-view.fixtures";

let songs: Song[];

beforeAll(async () => {
  songs = await loadRealSongs();
});

test("golden hashes of the rendered rows, 38 songs × 3 reading modes × 2 chant versions", async () => {
  const lines = matrix(songs).map(({ song, readingMode, chantVersion }) =>
    `${JSON.stringify(song.id)} ${readingMode} ${chantVersion} ${shortHash(renderLyricRows(song, { readingMode, chantVersion, interactive: true }))}`);
  expect(lines).toHaveLength(228);
  await expect(lines.join("\n") + "\n").toMatchFileSnapshot("./__snapshots__/lyric-rows.hashes.txt");
});

describe("golden rows of the representative songs", () => {
  test.each(REPRESENTATIVE_SONGS)("%s", async id => {
    const song = songs.find(item => item.id === id)!;
    const blocks = REPRESENTATIVE_OPTIONS.map(({ readingMode, chantVersion }) =>
      `===== ${readingMode} ${chantVersion} =====\n${renderLyricRows(song, { readingMode, chantVersion, interactive: true })}\n`);
    await expect(blocks.join("\n")).toMatchFileSnapshot(`./__snapshots__/lyric-rows.${id}.html`);
  });
});

test("non-interactive rows differ only in the row element", () => {
  for (const { song, readingMode, chantVersion } of matrix(songs.slice(0, 6))) {
    const buttons = renderLyricRows(song, { readingMode, chantVersion, interactive: true });
    const divs = renderLyricRows(song, { readingMode, chantVersion, interactive: false });
    expect(divs).toBe(buttons.replace(/<button class="lyric-line/g, '<div class="lyric-line').replace(/<\/button>/g, "</div>"));
  }
});

test("rendering reads only the song: the same input gives the same rows", () => {
  const song = songs[0];
  const options = { readingMode: "both", chantVersion: "jp", interactive: true } as const;
  expect(renderLyricRows(song, options)).toBe(renderLyricRows(structuredClone(song), options));
});

describe("chant segment wrapping without a DOM", () => {
  test("wraps the visible text inside a text node", () => {
    expect(wrapChantMarkup("ねえ愛してるよ", "愛して")).toBe('ねえ<span class="chant-segment">愛して</span>るよ');
  });
  test("wraps a whole ruby instead of its base text", () => {
    expect(wrapChantMarkup("<ruby>愛<rt>あい</rt></ruby>して", "愛して"))
      .toBe('<span class="chant-segment"><ruby>愛<rt>あい</rt></ruby></span><span class="chant-segment">して</span>');
  });
  test("skips readings, icons and earlier segments when matching", () => {
    const icon = '<span class="ico ico-mic" title="大合唱"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-mic"/></svg></span>';
    expect(wrapChantMarkup(`${icon}ララ<span class="chant-segment">ラ</span>ラ`, "ララ"))
      .toBe(`${icon}<span class="chant-segment">ララ</span><span class="chant-segment">ラ</span>ラ`);
    expect(wrapChantMarkup("<ruby>空<rt>そら</rt></ruby>", "そら")).toBe("<ruby>空<rt>そら</rt></ruby>");
  });
  test("leaves the markup unchanged when the text is not found", () => {
    const markup = "it&#39;s &amp; more";
    expect(wrapChantMarkup(markup, "nothing")).toBe(markup);
    /* A split text node is re-escaped; the parsed DOM is the same. */
    expect(wrapChantMarkup(markup, "s & m")).toBe('it\'<span class="chant-segment">s &amp; m</span>ore');
  });
  test("marks a segment that starts a new line", () => {
    expect(wrapChantMarkup("abc", "b", { breakBefore: true })).toBe('a<span class="chant-segment break-before">b</span>c');
  });
});
