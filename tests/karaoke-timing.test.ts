/* The page's karaoke timing choice: bundled word timing from the catalogue
   needs no network; songs without it keep the live karaoke-sources.js chain. */
import { afterEach, describe, expect, test, vi } from "vitest";
import { assembleCatalogue, type Song } from "../src/catalogue/assemble";
import {
  activeVideoId,
  bundledKaraokeTiming,
  isLiveActive,
  pickLiveVideo,
  liveKaraokeTiming,
  loadSongKaraokeTiming,
  resolveVideoSource,
  type KaraokeTimingApi,
  type KaraokeStatus,
} from "../src/services/karaoke-timing";
import { karaoke, makeSources } from "./fixtures";
import { loadRealSongs } from "./lyric-view.fixtures";

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

describe("live video", () => {
  function liveSongs(): Song[] {
    const sources = makeSources();
    sources.liveTiming = {
      Alpha: [
        { chantVersion: "kr", youtubeId: "seoulSEOUL1", label: "Seoul", times: [5, 15, 26], singAlong: [1] },
        { chantVersion: "jp", youtubeId: "abcDEF_-123", label: "Dome Tour", times: [3, 13, 24] },
      ],
    };
    sources.wordTiming = {
      Alpha: { source: "KuGou KRC", sourceId: "1", offset: 0, lines: { "0": [["夜", 0.1, 0.3], ["の", 0.3, 0.4], ["歌", 0.4, 0.9]] } },
    };
    return assembleCatalogue(sources).songs;
  }

  test("activeVideoId falls back to the MV unless live is selected and exists", () => {
    const [alpha, beta] = liveSongs();
    expect(activeVideoId(alpha, "mv")).toBe("yt-alpha");
    expect(activeVideoId(alpha, "live", "jp")).toBe("abcDEF_-123");
    expect(activeVideoId(alpha, "live", "kr")).toBe("seoulSEOUL1");
    expect(activeVideoId(alpha, "mv", "kr")).toBe("yt-alpha");
    expect(activeVideoId(beta, "live")).toBe("yt-beta");
    expect(activeVideoId(alpha, "anything")).toBe("yt-alpha");
    expect(activeVideoId(null, "live")).toBe("");
    expect(isLiveActive(alpha, "live")).toBe(true);
    expect(isLiveActive(beta, "live")).toBe(false);
    expect(isLiveActive(alpha, "mv")).toBe(false);
  });

  test("pickLiveVideo takes the chant version's video, else falls back to the other one", () => {
    const [alpha, beta] = liveSongs();
    expect(pickLiveVideo(alpha, "jp")!.label).toBe("Dome Tour");
    expect(pickLiveVideo(alpha, "kr")!.label).toBe("Seoul");
    expect(pickLiveVideo(beta, "kr")).toBeNull();
    const krOnly = { live: [alpha.live![0]] };
    const fallback = pickLiveVideo(krOnly, "jp")!;
    expect(fallback.youtubeId).toBe("seoulSEOUL1");
    expect(fallback.singAlong).toEqual([1]);
    expect(pickLiveVideo(alpha, "jp")!.singAlong).toEqual([]);
    expect(activeVideoId({ youtubeId: "mv", ...krOnly }, "live", "jp")).toBe("seoulSEOUL1");
  });

  test("resolveVideoSource applies the setting, the per-song override and the live guard", () => {
    const [alpha, beta] = liveSongs();
    expect(resolveVideoSource(alpha, true)).toBe("live");
    expect(resolveVideoSource(alpha, false)).toBe("mv");
    expect(resolveVideoSource(alpha, true, "mv")).toBe("mv");
    expect(resolveVideoSource(alpha, false, "live")).toBe("live");
    expect(resolveVideoSource(alpha, true, null)).toBe("live");
    expect(resolveVideoSource(beta, true)).toBe("mv");
    expect(resolveVideoSource(beta, false, "live")).toBe("mv");
    expect(resolveVideoSource(null, true, "live")).toBe("mv");
  });

  test("converts live times to line rows that end at the next row, with no words", () => {
    const [alpha] = liveSongs();
    const timing = liveKaraokeTiming(alpha, "jp")!;
    expect(timing).toMatchObject({ format: "timed-lyrics-v1-aligned", songId: "Alpha", matchedLines: 3, totalLines: 3 });
    expect(timing.lines).toEqual([
      { start: 3, end: 13, granularity: "line" },
      { start: 13, end: 24, granularity: "line" },
      { start: 24, end: 28, granularity: "line" },
    ]);
  });

  test("ignores the studio word timing and returns null for a song without live", () => {
    const [alpha, beta] = liveSongs();
    expect(bundledKaraokeTiming(alpha)).not.toBeNull();
    expect(liveKaraokeTiming(alpha)!.lines.every(line => !line || !("words" in line))).toBe(true);
    expect(liveKaraokeTiming(beta)).toBeNull();
  });
});

describe("live video by chant version on the real catalogue", () => {
  test("怪獣の花唄 uses the Dome live for jp and the Seoul live for kr, each with its own sing-along", async () => {
    const songs = await loadRealSongs();
    const kaiju = songs.find(song => song.id === "KaijuNoHanauta")!;
    const jp = pickLiveVideo(kaiju, "jp")!;
    const kr = pickLiveVideo(kaiju, "kr")!;
    expect([jp.youtubeId, jp.times[0], jp.times.length, jp.singAlong]).toEqual(["ci2lGX16f7Y", 2.13, 61, [20, 21, 30, 31, 32, 34, 35, 43, 45, 47, 49, 51, 53, 59]]);
    expect([kr.youtubeId, kr.times[0]]).toEqual(["I3_jV2zO0l0", 5.04]);
    expect(kr.singAlong).toContain(33);
    expect(liveKaraokeTiming(kaiju, "jp")!.lines[0]!.start).toBe(2.13);
    expect(liveKaraokeTiming(kaiju, "kr")!.lines[0]!.start).toBe(5.04);
  });

  test("しわあわせ only has the Seoul live: jp plays it with its sing-along rows", async () => {
    const shiwaawase = (await loadRealSongs()).find(song => song.id === "Shiwaawase")!;
    const video = pickLiveVideo(shiwaawase, "jp")!;
    expect([video.chantVersion, video.youtubeId]).toEqual(["kr", "NuPVr1BxqU8"]);
    expect(activeVideoId(shiwaawase, "live", "jp")).toBe("NuPVr1BxqU8");
    expect(video.singAlong).toEqual([15, 16, 17, 27, 28, 29, 30]);
  });
});
