// @vitest-environment jsdom
/* Lyric view mount: DOM golden for every song and option (with the allocator), and playhead behaviour. */
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import type { Song } from "../src/catalogue/assemble";
import { applyLyricContainerClasses, createLyricMount, lyricContainerClasses, type LyricMount } from "../src/lyric-view/index";
import { liveKaraokeTiming } from "../src/services/karaoke-timing";
import type { KaraokeSources } from "../src/lyric-view/decorate";
import type { KaraokeTiming } from "../src/lyric-view/timing";
import { karaokeSources, loadRealSongs, matrix, REPRESENTATIVE_OPTIONS, REPRESENTATIVE_SONGS, shortHash } from "./lyric-view.fixtures";

/* jsdom has no IntersectionObserver; a fake one lets the tests drive "in view". */
class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  observed: Element[] = [];
  disconnected = false;
  constructor(readonly callback: IntersectionObserverCallback, readonly options?: IntersectionObserverInit) {
    FakeIntersectionObserver.instances.push(this);
  }
  observe(target: Element) { this.observed.push(target); }
  unobserve() {}
  disconnect() { this.disconnected = true; }
  takeRecords() { return []; }
  enter(target: Element) {
    this.callback([{ target, isIntersecting: true } as unknown as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}
(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = FakeIntersectionObserver;

/* Canonical DOM dump: tag, sorted attributes, text; the same rules as the
   browser equivalence dumps. Playback state is left out. */
const TICK_CLASSES = new Set(["active", "in-view", "karaoke-lit", "karaoke-current"]);
const TICK_STYLES = new Set(["opacity", "--karaoke-word-progress", "animation-delay"]);
function canonical(root: Node): string {
  const out: string[] = [];
  const walk = (node: Node, depth: number) => {
    const pad = "  ".repeat(depth);
    if (node.nodeType === 3) { out.push(`${pad}#text ${JSON.stringify(node.nodeValue)}`); return; }
    if (node.nodeType !== 1) return;
    const element = node as Element;
    const attrs: [string, string][] = [];
    for (const attr of [...element.attributes]) {
      let value = attr.value;
      if (attr.name === "class") value = value.split(/\s+/).filter(token => token && !TICK_CLASSES.has(token)).join(" ");
      if (attr.name === "style") {
        const decls = value.split(";").map(decl => decl.trim()).filter(Boolean)
          .filter(decl => !TICK_STYLES.has(decl.slice(0, decl.indexOf(":")).trim().toLowerCase()));
        if (!decls.length) continue;
        value = decls.join("; ");
      }
      attrs.push([attr.name, value]);
    }
    attrs.sort((x, y) => (x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0));
    out.push(`${pad}<${element.tagName.toLowerCase()}${attrs.map(([key, value]) => ` ${key}=${JSON.stringify(value)}`).join("")}>`);
    element.childNodes.forEach(child => walk(child, depth + 1));
  };
  root.childNodes.forEach(child => walk(child, 0));
  return out.join("\n") + "\n";
}

let songs: Song[];
let sources: KaraokeSources;

beforeAll(async () => {
  songs = await loadRealSongs();
  sources = karaokeSources() as KaraokeSources;
});

function setup(interactive = true, scrollAnchor: "center" | "top" = "center") {
  document.body.innerHTML = '<div class="lyrics-scroll"><ul id="lyrics-list"></ul></div>';
  const list = document.getElementById("lyrics-list")!;
  const scroller = list.parentElement!;
  const mount = createLyricMount(list, { interactive, scrollAnchor, scroller });
  return { list, scroller, mount };
}

describe("DOM golden after render", () => {
  let mount: LyricMount;
  let list: HTMLElement;
  beforeEach(() => ({ mount, list } = setup()));
  afterEach(() => mount.destroy());

  test("hashes for 71 songs × 3 reading modes × 2 chant versions with the allocator", async () => {
    const lines: string[] = [];
    for (const { song, readingMode, chantVersion } of matrix(songs)) {
      mount.render(song, { readingMode, chantVersion, karaokeTiming: null, karaokeSources: sources });
      lines.push(`${JSON.stringify(song.id)} ${readingMode} ${chantVersion} sources-present ${shortHash(canonical(list))}`);
    }
    expect(lines).toHaveLength(426);
    await expect(lines.join("\n") + "\n").toMatchFileSnapshot("./__snapshots__/lyric-mount.hashes.txt");
  }, 120_000);

  test.each(REPRESENTATIVE_SONGS)("full rows of %s with the allocator", async id => {
    const song = songs.find(item => item.id === id)!;
    const { readingMode, chantVersion } = REPRESENTATIVE_OPTIONS[0];
    mount.render(song, { readingMode, chantVersion, karaokeTiming: null, karaokeSources: sources });
    await expect(`===== ${readingMode} ${chantVersion} sources-present =====\n${list.innerHTML}\n`)
      .toMatchFileSnapshot(`./__snapshots__/lyric-mount.${id}.html`);
  });

  test("loaded karaoke timing moves the row start and marks word timing", () => {
    const song = songs.find(item => item.id === "Tokimeki")!;
    mount.render(song, { readingMode: "kana", chantVersion: "jp", karaokeTiming: null, karaokeSources: sources });
    const texts = [...list.querySelectorAll<HTMLElement>(".lyric-line .lyric-jp")][0]
      .querySelectorAll<HTMLElement>(".karaoke-unit");
    const words = [...texts].map((unit, index) => ({ text: unit.dataset.karaokeText!, start: 1.1 + index * 0.1, end: 1.2 + index * 0.1 }));
    const timing = { songId: song.id, lines: [{ start: 1.1, end: 4.2, words }] };
    mount.render(song, { readingMode: "kana", chantVersion: "jp", karaokeTiming: timing, karaokeSources: sources });
    const row = list.querySelector<HTMLElement>(".lyric-line")!;
    expect(row.dataset.time).toBe("1.1");
    expect([row.dataset.karaokeStart, row.dataset.karaokeEnd]).toEqual(["1.1", "4.2"]);
    expect(row.dataset.karaokeSource).toBe("word");
    expect(list.querySelectorAll<HTMLElement>(".lyric-line")[1].dataset.time).toBe(String(song.lyrics[1].time));
    mount.render(song, { readingMode: "kana", chantVersion: "jp", karaokeTiming: { ...timing, songId: "Other" }, karaokeSources: sources });
    expect(list.querySelector<HTMLElement>(".lyric-line")!.dataset.time).toBe(String(song.lyrics[0].time));
  });
});

describe("live timing override", () => {
  test("rows take the live time for data-time and carry no word timing", () => {
    const song = songs.find(item => item.id === "Tokimeki")!;
    const times = song.lyrics.map(line => line.time + 3);
    const live = { ...song, live: { youtubeId: "abcDEF_-123", label: "Live", times } } as Song;
    const timing = liveKaraokeTiming(live)! as KaraokeTiming;
    const { list, mount } = setup();
    mount.render(live, { readingMode: "both", chantVersion: "jp", karaokeTiming: timing, karaokeSources: sources });
    const rowTimes = [...list.querySelectorAll<HTMLElement>(".lyric-line")].map(row => Number(row.dataset.time));
    expect(rowTimes).toEqual(times);
    const kinds = [...list.querySelectorAll<HTMLElement>(".lyric-line")].map(row => row.dataset.karaokeSource);
    expect(kinds.every(kind => kind === "line-proportional")).toBe(true);
    expect(list.querySelector<HTMLElement>(".lyric-line")!.dataset.karaokeStart).toBe(String(times[0]));
    mount.destroy();
  });
});

describe("playhead", () => {
  let ctx: ReturnType<typeof setup>;
  let song: Song;
  beforeEach(() => {
    ctx = setup();
    song = songs.find(item => item.id === "Tokimeki")!;
    ctx.mount.render(song, { readingMode: "kana", chantVersion: "jp", karaokeTiming: null, karaokeSources: sources });
  });
  afterEach(() => ctx.mount.destroy());

  const rows = () => [...ctx.list.querySelectorAll<HTMLElement>(".lyric-line")];
  const unitsOf = (row: HTMLElement) => [...row.querySelectorAll<HTMLElement>(".lyric-jp .karaoke-unit")];
  const midTime = (row: HTMLElement) => (Number(row.dataset.karaokeStart) + Number(row.dataset.karaokeEnd)) / 2;

  test("marks exactly one active row and lights its units up to the time", () => {
    const row = rows()[2];
    const time = midTime(row);
    ctx.mount.setPlayhead({ activeIdx: 2, time, karaokeEnabled: true });
    expect(ctx.list.querySelectorAll(".lyric-line.active")).toHaveLength(1);
    expect(row.classList.contains("active")).toBe(true);
    const units = unitsOf(row);
    expect(units.length).toBeGreaterThan(2);
    units.forEach(unit => {
      const start = Number(unit.dataset.karaokeStart);
      const end = Number(unit.dataset.karaokeEnd);
      const progress = Math.max(0, Math.min(1, (time - start) / Math.max(0.02, end - start)));
      expect(unit.classList.contains("karaoke-lit"), unit.dataset.karaokeText).toBe(progress >= 1);
      expect(unit.classList.contains("karaoke-current"), unit.dataset.karaokeText).toBe(progress > 0 && progress < 1);
      expect(unit.style.getPropertyValue("--karaoke-word-progress")).toBe(progress.toFixed(3));
    });
    expect(units.some(unit => unit.classList.contains("karaoke-lit"))).toBe(true);
    expect(ctx.mount.activeCount()).toBe(1);
  });

  test("weight-proportional progress when the allocator is absent", () => {
    ctx.mount.render(song, { readingMode: "kana", chantVersion: "jp", karaokeTiming: null, karaokeSources: null });
    const row = rows()[2];
    ctx.mount.setPlayhead({ activeIdx: 2, time: midTime(row), karaokeEnabled: true });
    const units = unitsOf(row);
    expect(units.every(unit => unit.dataset.karaokeStart === undefined)).toBe(true);
    expect(units.filter(unit => unit.classList.contains("karaoke-current"))).toHaveLength(1);
    expect(units[0].classList.contains("karaoke-lit")).toBe(true);
    expect(units[units.length - 1].classList.contains("karaoke-lit")).toBe(false);
  });

  test("a new current line clears the previous row's karaoke state", () => {
    const [, , previous, next] = rows();
    ctx.mount.setPlayhead({ activeIdx: 2, time: midTime(previous), karaokeEnabled: true });
    ctx.mount.setPlayhead({ activeIdx: 3, time: Number(next.dataset.karaokeStart) + 0.01, karaokeEnabled: true });
    expect(previous.classList.contains("active")).toBe(false);
    expect(next.classList.contains("active")).toBe(true);
    unitsOf(previous).forEach(unit => {
      expect(unit.classList.contains("karaoke-lit")).toBe(false);
      expect(unit.classList.contains("karaoke-current")).toBe(false);
      expect(unit.style.getPropertyValue("--karaoke-word-progress")).toBe("");
    });
  });

  test("karaoke off clears the units but keeps the active row", () => {
    const row = rows()[2];
    ctx.mount.setPlayhead({ activeIdx: 2, time: midTime(row), karaokeEnabled: true });
    ctx.mount.setPlayhead({ activeIdx: 2, time: midTime(row), karaokeEnabled: false });
    expect(row.classList.contains("active")).toBe(true);
    expect(row.querySelectorAll(".karaoke-lit, .karaoke-current")).toHaveLength(0);
  });

  test("re-rendering with new view options keeps the current line and its progress", () => {
    const row = rows()[4];
    ctx.mount.setPlayhead({ activeIdx: 4, time: midTime(row), karaokeEnabled: true });
    ctx.mount.render(song, { readingMode: "both", chantVersion: "kr", karaokeTiming: null, karaokeSources: sources });
    const fresh = rows()[4];
    expect(fresh).not.toBe(row);
    expect(fresh.classList.contains("active")).toBe(true);
    expect(ctx.list.querySelectorAll(".lyric-line.active")).toHaveLength(1);
    expect(fresh.querySelectorAll(".lyric-romaji .karaoke-lit").length).toBeGreaterThan(0);
  });

  test("an unknown playback time keeps the last active row by default, and clears it when asked", () => {
    ctx.mount.setPlayhead({ activeIdx: 2, time: 0, karaokeEnabled: true });
    ctx.mount.setPlayhead({ activeIdx: -1, time: null, karaokeEnabled: true });
    expect(rows()[2].classList.contains("active")).toBe(true);
    const pip = setup(false, "top");
    const pipMount = createLyricMount(pip.list, { interactive: false, scrollAnchor: "top", scroller: pip.scroller, keepLastActive: false });
    pip.mount.destroy();
    pip.scroller.scrollTo = (() => {}) as typeof pip.scroller.scrollTo;
    pipMount.render(song, { readingMode: "kana", chantVersion: "jp", karaokeTiming: null, karaokeSources: null });
    pipMount.setPlayhead({ activeIdx: 2, time: 0, karaokeEnabled: true });
    pipMount.setPlayhead({ activeIdx: -1, time: 0, karaokeEnabled: true });
    expect(pipMount.activeCount()).toBe(0);
    pipMount.destroy();
  });
});

describe("rows, guard, observers and scrolling", () => {
  afterEach(() => vi.useRealTimers());

  test("interactive rows are buttons, others divs, with the same markup otherwise", () => {
    const song = songs[0];
    const options = { readingMode: "both", chantVersion: "jp", karaokeTiming: null, karaokeSources: sources } as const;
    const page = setup(true);
    page.mount.render(song, options);
    const pageHtml = page.list.innerHTML;
    page.mount.destroy();
    const pip = setup(false, "top");
    pip.mount.render(song, options);
    expect(page.list.querySelectorAll("button.lyric-line")).toHaveLength(song.lyrics.length);
    expect(pip.list.querySelectorAll("div.lyric-line")).toHaveLength(song.lyrics.length);
    expect(pip.list.querySelectorAll("button")).toHaveLength(0);
    expect(pip.list.innerHTML).toBe(pageHtml
      .replace(/<button class="lyric-line/g, '<div class="lyric-line').replace(/<\/button>/g, "</div>"));
    pip.mount.destroy();
  });

  test("the guard keeps one active row until the mount is destroyed", () => {
    vi.useFakeTimers();
    const { list, mount } = setup();
    mount.render(songs[0], { readingMode: "kana", chantVersion: "jp", karaokeTiming: null, karaokeSources: null });
    const all = [...list.querySelectorAll(".lyric-line")];
    all[1].classList.add("active");
    all[5].classList.add("active");
    vi.advanceTimersByTime(350);
    expect([...list.querySelectorAll(".lyric-line.active")]).toEqual([all[5]]);
    mount.destroy();
    all[1].classList.add("active");
    vi.advanceTimersByTime(1000);
    expect(list.querySelectorAll(".lyric-line.active")).toHaveLength(2);
  });

  test("rows entering the view get in-view and the beat phase; destroy disconnects", () => {
    const { list, scroller, mount } = setup();
    mount.setBeat({ bpm: 120, startedAt: performance.now() - 250 });
    mount.render(songs[0], { readingMode: "kana", chantVersion: "jp", karaokeTiming: null, karaokeSources: null });
    const observer = FakeIntersectionObserver.instances[FakeIntersectionObserver.instances.length - 1];
    expect(observer.options).toEqual({ root: scroller, rootMargin: "120px 0px" });
    expect(observer.observed).toHaveLength(songs[0].lyrics.length);
    const row = [...list.querySelectorAll(".lyric-line")].find(item => item.querySelector(".ico-clap"))!;
    observer.enter(row);
    expect(row.classList.contains("in-view")).toBe(true);
    const hand = row.querySelector<HTMLElement>(".ico-clap .hand")!;
    expect(hand.style.animationDelay).toMatch(/^-0\.\d+s$/);
    mount.destroy();
    expect(observer.disconnected).toBe(true);
  });

  test("playback back before the first line clears the current line and scrolls to the start", () => {
    document.body.innerHTML = '<div class="lyrics-scroll"><ul id="lyrics-list"></ul></div>';
    const list = document.getElementById("lyrics-list")!;
    const scroller = list.parentElement!;
    let top = 0;
    Object.defineProperty(scroller, "scrollTop", { configurable: true, get: () => top, set: value => { top = value; } });
    const mount = createLyricMount(list, { interactive: true, scrollAnchor: "center", scroller, scrollDurationMs: 0 });
    mount.render(songs[0], { readingMode: "kana", chantVersion: "jp", karaokeTiming: null, karaokeSources: sources });
    const row = list.querySelectorAll<HTMLElement>(".lyric-line")[5];
    mount.setPlayhead({ activeIdx: 5, time: (Number(row.dataset.karaokeStart) + Number(row.dataset.karaokeEnd)) / 2, karaokeEnabled: true });
    expect(row.querySelectorAll(".karaoke-lit, .karaoke-current").length).toBeGreaterThan(0);
    top = 900;   // the song played on: the list is scrolled far down
    mount.setPlayhead({ activeIdx: -1, time: 0.2, karaokeEnabled: true });   // replayed from the start
    expect(list.querySelectorAll(".lyric-line.active")).toHaveLength(0);
    expect(row.querySelectorAll(".karaoke-lit, .karaoke-current")).toHaveLength(0);
    expect(top).toBe(0);
    top = 300;   // the visitor scrolls during the intro: later ticks leave it alone
    mount.setPlayhead({ activeIdx: -1, time: 0.4, karaokeEnabled: true });
    expect(top).toBe(300);
    mount.destroy();
  });

  test("the top anchor jumps after a render and scrolls smoothly on a new line", () => {
    const { scroller, mount } = setup(false, "top");
    const scrollTo = vi.fn();
    scroller.scrollTo = scrollTo as unknown as typeof scroller.scrollTo;
    mount.render(songs[0], { readingMode: "kana", chantVersion: "jp", karaokeTiming: null, karaokeSources: null });
    mount.setPlayhead({ activeIdx: 3, time: null, karaokeEnabled: false });
    mount.setPlayhead({ activeIdx: 3, time: null, karaokeEnabled: false });
    mount.setPlayhead({ activeIdx: 4, time: null, karaokeEnabled: false });
    expect(scrollTo.mock.calls.map(([arg]) => arg.behavior)).toEqual(["auto", "smooth"]);
    mount.destroy();
  });
});

test("container classes come from the settings in one place", () => {
  expect(lyricContainerClasses({ readingMode: "both", showJapanese: false, showChinese: false, karaokeEnabled: false, chantOnly: true }))
    .toEqual({ "reading-both": true, "hide-japanese": true, "hide-chinese": true, "lyrics-hidden": true, "karaoke-off": true, "chant-only": true });
  const element = document.createElement("main");
  element.className = "song-page venue reading-both";
  applyLyricContainerClasses(element, { readingMode: "kana", showJapanese: true, showChinese: false, karaokeEnabled: true, chantOnly: false });
  expect(element.className).toBe("song-page venue hide-chinese");
});
