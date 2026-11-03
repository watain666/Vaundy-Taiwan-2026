/* The page's karaoke timing choice: bundled word timing from the catalogue
   needs no network; songs without it keep the live karaoke-sources.js chain. */
import { afterEach, describe, expect, test, vi } from "vitest";
import { assembleCatalogue, type Song } from "../src/catalogue/assemble";
import {
  bundledKaraokeTiming,
  loadSongKaraokeTiming,
  type KaraokeTimingApi,
  type KaraokeStatus,
} from "../src/services/karaoke-timing";
import { karaoke, makeSources } from "./fixtures";

const live = karaoke as unknown as KaraokeTimingApi;

function songs(): Song[] {
  const sources = makeSources();
  sources.wordTiming = {
    Alpha: {
      source: "KuGou KRC",
      sourceId: "57496391",
      offset: 0.376,
      lines: {
        "0": [["夜", 0.1, 0.3], ["の", 0.3, 0.4], ["歌", 0.4, 0.9]],
        "10": [["Hey", 10.05, 10.4], ["そう", 10.4, 10.8], ["だ", 10.8, 11.2]],
      },
    },
  };
  return assembleCatalogue(sources).songs;
}

function stubDeps() {
  const statuses: KaraokeStatus[] = [];
  const api = { load: vi.fn(async () => null), alignToLocalLyrics: vi.fn(() => null) };
  const deps = {
    loadSources: vi.fn(async () => api as unknown as KaraokeTimingApi),
    duration: vi.fn(() => 200),
    onStatus: (status: KaraokeStatus) => { statuses.push(status); },
  };
  return { api, deps, statuses };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("bundled word timing", () => {
  test("builds the aligned shape alignToLocalLyrics returns", () => {
    const [alpha] = songs();
    const timing = bundledKaraokeTiming(alpha)!;
    expect(timing).toMatchObject({
      format: "timed-lyrics-v1-aligned",
      songId: "Alpha",
      source: "KuGou KRC",
      providerOrder: ["KuGou KRC"],
      offset: 0.376,
      matchedLines: 2,
      totalLines: 3,
      bundled: true,
    });
    expect(timing.lines).toEqual([
      {
        start: 0,
        end: 0.9,
        granularity: "word",
        words: [{ text: "夜", start: 0.1, end: 0.3 }, { text: "の", start: 0.3, end: 0.4 }, { text: "歌", start: 0.4, end: 0.9 }],
      },
      {
        start: 10,
        end: 11.2,
        granularity: "word",
        words: [{ text: "Hey", start: 10.05, end: 10.4 }, { text: "そう", start: 10.4, end: 10.8 }, { text: "だ", start: 10.8, end: 11.2 }],
      },
      null,
    ]);
  });

  test("has the same fields as live alignment", () => {
    const [alpha] = songs();
    const providerLines = alpha.lyrics.map(line => ({
      start: line.time,
      end: line.time + 1,
      words: [{ text: line.jp.replace(/\[\w+\]/g, ""), start: line.time, end: line.time + 1 }],
    }));
    const aligned = live.alignToLocalLyrics({ source: "X", lines: providerLines }, alpha.lyrics)!;
    const { bundled: _bundled, ...bundled } = bundledKaraokeTiming(alpha)!;
    expect(Object.keys(bundled).sort()).toEqual(Object.keys(aligned).sort());
  });

  test("a song without bundled words has none", () => {
    const [, beta] = songs();
    expect(bundledKaraokeTiming(beta)).toBeNull();
  });
});

describe("loadSongKaraokeTiming", () => {
  test("a song with bundled words never loads karaoke-sources.js or fetches", async () => {
    const fetch = vi.fn(() => Promise.reject(new Error("network used")));
    vi.stubGlobal("fetch", fetch);
    const { api, deps, statuses } = stubDeps();
    const [alpha] = songs();

    const result = await loadSongKaraokeTiming(alpha, deps);

    expect(deps.loadSources).not.toHaveBeenCalled();
    expect(api.load).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expect(statuses).toEqual([]);
    expect(result.timing?.bundled).toBe(true);
    expect(result.status).toEqual({ state: "ready", text: "歌詞逐字時間：內建 KuGou KRC（已對齊 2/3 行）" });
  });

  test("a song without bundled words keeps the live chain", async () => {
    const { api, deps, statuses } = stubDeps();
    const [, beta] = songs();

    const result = await loadSongKaraokeTiming(beta, deps);

    expect(deps.loadSources).toHaveBeenCalledOnce();
    expect(api.load).toHaveBeenCalledWith(beta, expect.objectContaining({ duration: 200 }));
    expect(statuses[0]).toEqual({ state: "loading", text: "歌詞逐字時間：正在尋找開源時間碼…" });
    expect(result).toEqual({ timing: null, status: { state: "miss", text: "歌詞逐字時間：找不到可用來源，使用本地估算同步" } });
  });

  test("live timing is aligned and tagged with the song id", async () => {
    const { api, deps } = stubDeps();
    const [, beta] = songs();
    const timed = {
      source: "LRCLIB",
      lines: [
        { start: 4, end: 6, words: [{ text: "ラララ", start: 4, end: 6 }] },
        { start: 8, end: 9, words: [{ text: "Go", start: 8, end: 9 }] },
        { start: 9, end: 10, words: [{ text: "Go", start: 9, end: 10 }] },
      ],
    };
    api.load.mockResolvedValueOnce(timed as never);
    api.alignToLocalLyrics.mockImplementationOnce(((value: unknown, lyrics: Song["lyrics"]) => live.alignToLocalLyrics(value, lyrics)) as never);

    const result = await loadSongKaraokeTiming(beta, deps);

    expect(api.alignToLocalLyrics).toHaveBeenCalledWith(timed, beta.lyrics);
    expect(result.timing?.songId).toBe("Beta");
    expect(result.timing?.bundled).toBeUndefined();
    expect(result.status.state).toBe("ready");
    expect(result.status.text).toMatch(/^歌詞逐字時間：LRCLIB（已對齊 /);
  });
});
