// @vitest-environment jsdom
/* Video PiP frame: reading a lyric view row into runs, and line breaking. */
import { describe, expect, test } from "vitest";
import { breakLines, collectRuns, readFrameRow, tokenizeRuns, type FrameRun, type StyleOf } from "../src/video-pip-frame";

/* jsdom computes no cascade colours; give each element a colour from its classes. */
const styleOf: StyleOf = element => {
  const color = element.tagName.toLowerCase() === "rt" ? "rt"
    : element.closest(".karaoke-lit") ? "lit"
    : element.closest(".seg-chant") ? "chant"
    : "base";
  return {
    color,
    display: element.classList.contains("gone") ? "none" : "block",
    fontFamily: "Noto Sans JP",
    fontWeight: "500",
    opacity: element.classList.contains("dim") ? "0.5" : "1",
    backgroundColor: element.classList.contains("active") ? "rgba(255, 255, 255, 0.075)" : "rgba(0, 0, 0, 0)"
  } as unknown as CSSStyleDeclaration;
};

function element(html: string): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = html.trim();
  return host.firstElementChild as HTMLElement;
}

const run = (text: string, extra: Partial<FrameRun> = {}): FrameRun =>
  ({ text, color: "base", ruby: null, rubyColor: null, progress: null, ...extra });

/* Every character is 10 wide, ruby characters 5. */
const measure = (text: string, ruby: boolean) => Array.from(text).length * (ruby ? 5 : 10);

describe("collectRuns", () => {
  test("ruby is one run with its reading; icons and readings are not base text", () => {
    const runs = collectRuns(element(`
      <span class="lyric-jp"><span class="karaoke-unit karaoke-lit"><ruby>花<rt>はな</rt></ruby></span><span class="karaoke-unit">が</span><svg><text>x</text></svg></span>
    `), styleOf);
    expect(runs.filter(r => r.text.trim())).toEqual([
      { text: "花", color: "lit", ruby: "はな", rubyColor: "rt", progress: null },
      { text: "が", color: "base", ruby: null, rubyColor: null, progress: null }
    ]);
  });

  test("the word being sung carries its karaoke progress", () => {
    const runs = collectRuns(element(`
      <span class="lyric-jp"><span class="karaoke-unit karaoke-current" style="--karaoke-word-progress:0.400">咲</span></span>
    `), styleOf);
    expect(runs).toEqual([{ text: "咲", color: "base", ruby: null, rubyColor: null, progress: 0.4 }]);
  });

  test("a karaoke unit inside the ruby base gives the run its colour", () => {
    const runs = collectRuns(element(`
      <span class="lyric-jp"><ruby><span class="karaoke-unit karaoke-lit">空</span><rt>そら</rt></ruby></span>
    `), styleOf);
    expect(runs).toEqual([{ text: "空", color: "lit", ruby: "そら", rubyColor: "rt", progress: null }]);
  });
});

describe("readFrameRow", () => {
  test("reads the shown parts in order with the row's opacity and background", () => {
    const row = readFrameRow(element(`
      <div class="lyric-line active">
        <span class="lyric-icons"><svg></svg></span>
        <span class="lyric-body">
          <span class="lyric-jp">歌</span>
          <span class="lyric-romaji"></span>
          <span class="lyric-zh">歌曲</span>
          <span class="lyric-bg"><span class="lyric-bg-label">背景合唱</span>ラララ</span>
        </span>
      </div>
    `), styleOf);
    expect(row?.parts.map(part => [part.kind, part.runs.map(r => r.text).join("")])).toEqual([
      ["jp", "歌"], ["zh", "歌曲"], ["bg", "ラララ"]
    ]);
    expect(row?.active).toBe(true);
    expect(row?.opacity).toBe(1);
    expect(row?.background).toBe("rgba(255, 255, 255, 0.075)");
  });

  test("a hidden part is left out and an inactive row keeps its opacity", () => {
    const row = readFrameRow(element(`
      <div class="lyric-line dim"><span class="lyric-body">
        <span class="lyric-jp gone">歌</span><span class="lyric-zh">歌曲</span>
      </span></div>
    `), styleOf);
    expect(row?.parts.map(part => part.kind)).toEqual(["zh"]);
    expect(row?.opacity).toBe(0.5);
    expect(row?.background).toBeNull();
  });

  test("a row with nothing to show is null", () => {
    expect(readFrameRow(element(`<div class="lyric-line"><span class="lyric-body"><span class="lyric-zh"> </span></span></div>`), styleOf)).toBeNull();
  });
});

describe("line breaking", () => {
  test("Latin words stay whole, CJK breaks between characters", () => {
    const tokens = tokenizeRuns([run("STAGE 4 の花")], measure);
    expect(tokens.map(t => t.text)).toEqual(["STAGE", " ", "4", " ", "の", "花"]);
  });

  test("closing punctuation stays on the line before it", () => {
    const tokens = tokenizeRuns([run("花、")], measure);
    expect(tokens.map(t => t.text)).toEqual(["花、"]);
    const lines = breakLines(tokenizeRuns([run("あいう、え")], measure), 30);
    expect(lines.map(line => line.map(t => t.text).join(""))).toEqual(["あい", "う、え"]);
  });

  test("a ruby run is as wide as its wider half and never splits", () => {
    const [token] = tokenizeRuns([run("花", { ruby: "はなびら" })], measure);
    expect(token.width).toBe(10);
    expect(token.rubyWidth).toBe(20);
    const lines = breakLines(tokenizeRuns([run("あ"), run("花", { ruby: "はなびら" })], measure), 25);
    expect(lines.map(line => line.map(t => t.text))).toEqual([["あ"], ["花"]]);
  });

  test("spaces at a line break are dropped", () => {
    const lines = breakLines(tokenizeRuns([run("ab cd")], measure), 25);
    expect(lines.map(line => line.map(t => t.text).join(""))).toEqual(["ab", "cd"]);
  });
});
