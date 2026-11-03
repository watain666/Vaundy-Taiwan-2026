/*
 * Video PiP frame: reads the rows of a lyric view mount and paints one frame
 * of the subtitle window onto a canvas.
 *
 * The phone browsers have no Document Picture-in-Picture, but they can put a
 * <video> into PiP. The video's source is this canvas, so the PiP window
 * shows the same layout as the desktop PiP window: the song label, the
 * playback progress, the current line and the next one.
 *
 * Nothing here decides what a row says or how it is coloured. The rows come
 * from a lyric view mount (src/lyric-view/), and the text, ruby, chant colour,
 * karaoke state and row opacity are read from that mount's DOM and computed
 * styles, so the frame follows the same row renderer and theme as the song
 * page and the desktop PiP window.
 */

export type StyleOf = (element: Element) => CSSStyleDeclaration;

/** One piece of text in one colour; a ruby pair is one unbreakable run. */
export type FrameRun = {
  text: string;
  color: string;
  ruby: string | null;
  rubyColor: string | null;
  /** Karaoke progress of the word this run belongs to, when it is the word being sung. */
  progress: number | null;
};

export type FramePartKind = "jp" | "romaji" | "zh" | "bg";

export type FramePart = {
  kind: FramePartKind;
  runs: FrameRun[];
  fontFamily: string;
  fontWeight: string;
  /** The colour a lit karaoke word has in this part, for the partly sung word. */
  litColor: string | null;
};

export type FrameRow = {
  parts: FramePart[];
  opacity: number;
  active: boolean;
  background: string | null;
};

export type FrameTheme = {
  background: string;
  text: string;
  muted: string;
  accent: string;
  track: string;
  pill: string;
  lit: string;
};

export type FrameModel = {
  width: number;
  height: number;
  theme: FrameTheme;
  songNumber: string;
  title: string;
  progress: number;
  /** Shown instead of the lyrics: player status, hidden lyrics or loading. */
  message: string;
  current: FrameRow | null;
  next: FrameRow | null;
  lyricScale: number;
};

/* ---------- reading the mount's rows ---------- */

const SKIPPED_SELECTOR = "svg, rp, .lyric-icons, .lyric-bg, .lyric-bg-label, .karaoke-reference";

function karaokeProgressOf(element: Element | null): number | null {
  const unit = element ? element.closest(".karaoke-unit") : null;
  if (!unit || !unit.classList.contains("karaoke-current")) return null;
  const value = Number.parseFloat((unit as HTMLElement).style.getPropertyValue("--karaoke-word-progress"));
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : null;
}

function textWithout(element: Element, skipped: string): string {
  let text = "";
  element.childNodes.forEach(node => {
    if (node.nodeType === 3) text += node.nodeValue || "";
    else if (node.nodeType === 1 && !(node as Element).matches(skipped)) text += textWithout(node as Element, skipped);
  });
  return text;
}

function firstBaseTextParent(ruby: Element): Element | null {
  for (const node of Array.from(ruby.childNodes)) {
    if (node.nodeType === 3 && (node.nodeValue || "").trim()) return ruby;
    if (node.nodeType === 1 && !(node as Element).matches("rt, rp, svg")) {
      const element = node as Element;
      if ((element.textContent || "").trim()) return firstBaseTextParent(element) || element;
    }
  }
  return null;
}

/** The runs of one lyric part element (.lyric-jp, .lyric-romaji, .lyric-zh or .lyric-bg). */
export function collectRuns(element: Element, styleOf: StyleOf): FrameRun[] {
  const runs: FrameRun[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === 3) {
      const text = node.nodeValue || "";
      const parent = node.parentElement;
      if (!text || !parent) return;
      runs.push({ text, color: styleOf(parent).color, ruby: null, rubyColor: null, progress: karaokeProgressOf(parent) });
      return;
    }
    if (node.nodeType !== 1) return;
    const element = node as Element;
    if (element.matches(SKIPPED_SELECTOR)) return;
    if (element.tagName.toLowerCase() === "ruby") {
      const base = textWithout(element, "rt, rp, svg");
      const rt = element.querySelector("rt");
      if (!base) return;
      // The karaoke unit may wrap the ruby or sit inside its base text;
      // the colour and progress come from the element around the base text.
      const baseElement = firstBaseTextParent(element) || element;
      runs.push({
        text: base,
        color: styleOf(baseElement).color,
        ruby: rt ? (rt.textContent || "").trim() || null : null,
        rubyColor: rt ? styleOf(rt).color : null,
        progress: karaokeProgressOf(baseElement)
      });
      return;
    }
    element.childNodes.forEach(walk);
  };
  element.childNodes.forEach(walk);
  return runs;
}

function litColorOf(element: Element, styleOf: StyleOf): string | null {
  const lit = element.querySelector(".karaoke-unit.karaoke-lit");
  return lit ? styleOf(lit).color : null;
}

function readPart(element: Element | null, kind: FramePartKind, styleOf: StyleOf): FramePart | null {
  if (!element) return null;
  const style = styleOf(element);
  if (style.display === "none") return null;
  const runs = collectRuns(element, styleOf).filter(run => run.text.length > 0);
  if (!runs.some(run => run.text.trim().length > 0)) return null;
  return { kind, runs, fontFamily: style.fontFamily, fontWeight: style.fontWeight, litColor: litColorOf(element, styleOf) };
}

/** The visible parts of one `.lyric-line` row, in display order. */
export function readFrameRow(row: Element | null, styleOf: StyleOf): FrameRow | null {
  if (!row) return null;
  const body = row.querySelector(".lyric-body") || row;
  const parts: FramePart[] = [];
  const add = (part: FramePart | null) => { if (part) parts.push(part); };
  add(readPart(body.querySelector(".lyric-jp"), "jp", styleOf));
  add(readPart(body.querySelector(".lyric-romaji"), "romaji", styleOf));
  add(readPart(body.querySelector(".lyric-zh"), "zh", styleOf));
  body.querySelectorAll(".lyric-bg").forEach(backing => add(readPart(backing, "bg", styleOf)));
  if (!parts.length) return null;
  const style = styleOf(row);
  const opacity = Number.parseFloat(style.opacity);
  const background = style.backgroundColor;
  return {
    parts,
    opacity: Number.isFinite(opacity) ? opacity : 1,
    active: row.classList.contains("active"),
    background: background && background !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(background) ? background : null
  };
}

/* ---------- line breaking ---------- */

export type FrameToken = {
  run: FrameRun;
  text: string;
  width: number;
  rubyWidth: number;
  space: boolean;
};

export type MeasureText = (text: string, ruby: boolean) => number;

/* A Latin word with its trailing punctuation, a run of spaces, or one
   character with its combining marks. CJK breaks between characters. */
const TOKEN_RE = /[\p{Script=Latin}\p{N}'’_\-]+[,.!?:;]*|\s+|\P{M}\p{M}*/gu;
/* These never start a line; they stay with the character before them. */
const NO_LINE_START = /^[、。，．,.！？!?）)」』】〉》…ー〜~：:；;]+$/u;

export function tokenizeRuns(runs: FrameRun[], measure: MeasureText): FrameToken[] {
  const tokens: FrameToken[] = [];
  runs.forEach(run => {
    if (run.ruby) {
      tokens.push({ run, text: run.text, width: measure(run.text, false), rubyWidth: measure(run.ruby, true), space: false });
      return;
    }
    (run.text.match(TOKEN_RE) || []).forEach(piece => {
      const space = /^\s+$/u.test(piece);
      const text = space ? " " : piece;
      const previous = tokens[tokens.length - 1];
      if (!space && previous && !previous.space && previous.run === run && !previous.run.ruby && NO_LINE_START.test(piece)) {
        previous.text += piece;
        previous.width = measure(previous.text, false);
        return;
      }
      tokens.push({ run, text, width: measure(text, false), rubyWidth: 0, space });
    });
  });
  return tokens;
}

/** Greedy line breaking; spaces at the start and end of a line are dropped. */
export function breakLines(tokens: FrameToken[], maxWidth: number): FrameToken[][] {
  const lines: FrameToken[][] = [];
  let line: FrameToken[] = [];
  let width = 0;
  const advance = (token: FrameToken) => Math.max(token.width, token.rubyWidth);
  const flush = () => {
    while (line.length && line[line.length - 1].space) line.pop();
    if (line.length) lines.push(line);
    line = [];
    width = 0;
  };
  tokens.forEach(token => {
    if (token.space && !line.length) return;
    const size = advance(token);
    if (line.length && width + size > maxWidth && !token.space) flush();
    line.push(token);
    width += size;
  });
  flush();
  return lines;
}

/* ---------- painting ---------- */

type PartLayout = {
  part: FramePart;
  font: string;
  rubyFont: string;
  size: number;
  rubySize: number;
  lines: { tokens: FrameToken[]; hasRuby: boolean }[];
  height: number;
};

type RowLayout = { row: FrameRow; parts: PartLayout[]; height: number };

/* Spacing sits on a 4px grid at roughly twice the desktop PiP's CSS pixels.
   FRAME_PAD keeps the title pill clear of the rounded corners of the
   system PiP window (iOS clips the frame's corners). */
const FRAME_PAD = 40;
const HEADER_HEIGHT = 88;
const HEADER_PILL_HEIGHT = 48;
const PROGRESS_HEIGHT = 6;
const ROW_PAD_X = 24;
const ROW_PAD_Y = 12;
const ROW_GAP = 12;
const ROW_RADIUS = 24;
const ACTIVE_MARK_WIDTH = 6;
const PART_GAP = 4;
/* Desktop PiP sizes (24px Japanese, 29px Chinese at 450px wide), scaled to the frame. */
const BASE_SIZE: Record<FramePartKind, number> = { jp: 46, romaji: 30, zh: 50, bg: 30 };
const LINE_HEIGHT: Record<FramePartKind, number> = { jp: 1.3, romaji: 1.25, zh: 1.3, bg: 1.25 };
const RUBY_RATIO = 0.45;
const MIN_FIT_SCALE = 0.5;

function fontOf(part: FramePart, size: number): string {
  const weight = part.fontWeight || "400";
  const family = part.fontFamily || "sans-serif";
  return `${weight} ${Math.round(size)}px ${family}`;
}

function layoutRow(ctx: CanvasRenderingContext2D, row: FrameRow, scale: number, maxWidth: number): RowLayout {
  const parts = row.parts.map(part => {
    const size = BASE_SIZE[part.kind] * scale;
    const rubySize = size * RUBY_RATIO;
    const font = fontOf(part, size);
    const rubyFont = fontOf(part, rubySize);
    const measure: MeasureText = (text, ruby) => {
      ctx.font = ruby ? rubyFont : font;
      return ctx.measureText(text).width;
    };
    const lines = breakLines(tokenizeRuns(part.runs, measure), maxWidth)
      .map(tokens => ({ tokens, hasRuby: tokens.some(token => Boolean(token.run.ruby)) }));
    const height = lines.reduce((sum, line) => sum + size * LINE_HEIGHT[part.kind] + (line.hasRuby ? rubySize * 1.15 : 0), 0);
    return { part, font, rubyFont, size, rubySize, lines, height };
  });
  const height = parts.reduce((sum, part) => sum + part.height, 0)
    + Math.max(0, parts.length - 1) * PART_GAP * scale + ROW_PAD_Y * 2;
  return { row, parts, height };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function paintRow(ctx: CanvasRenderingContext2D, layout: RowLayout, x: number, y: number, width: number, lit: string, mark: string): void {
  ctx.save();
  ctx.globalAlpha = layout.row.opacity;
  if (layout.row.background) {
    ctx.fillStyle = layout.row.background;
    roundRect(ctx, x, y, width, layout.height, ROW_RADIUS);
    ctx.fill();
  }
  // The current line carries the same gold edge as on the song page and the desktop PiP.
  if (layout.row.active) {
    ctx.save();
    roundRect(ctx, x, y, width, layout.height, ROW_RADIUS);
    ctx.clip();
    ctx.fillStyle = mark;
    ctx.fillRect(x, y, ACTIVE_MARK_WIDTH, layout.height);
    ctx.restore();
  }
  let cursorY = y + ROW_PAD_Y;
  layout.parts.forEach((part, index) => {
    if (index > 0) cursorY += PART_GAP;
    // A karaoke word can be several tokens (one per CJK character, maybe on
    // two lines); its progress lights the word's total width in order.
    const runWidth = new Map<FrameRun, number>();
    part.lines.forEach(line => line.tokens.forEach(token => {
      runWidth.set(token.run, (runWidth.get(token.run) || 0) + token.width);
    }));
    const runDone = new Map<FrameRun, number>();
    part.lines.forEach(line => {
      const rubyBand = line.hasRuby ? part.rubySize * 1.15 : 0;
      const lineHeight = part.size * LINE_HEIGHT[part.part.kind];
      const baseline = cursorY + rubyBand + lineHeight / 2;
      let cursorX = x + ROW_PAD_X;
      ctx.textBaseline = "middle";
      line.tokens.forEach(token => {
        const advance = Math.max(token.width, token.rubyWidth);
        const textX = cursorX + (advance - token.width) / 2;
        ctx.font = part.font;
        ctx.fillStyle = token.run.color;
        ctx.fillText(token.text, textX, baseline);
        const progress = token.run.progress;
        const before = runDone.get(token.run) || 0;
        runDone.set(token.run, before + token.width);
        const litWidth = progress && progress > 0
          ? Math.max(0, Math.min(token.width, progress * (runWidth.get(token.run) || token.width) - before))
          : 0;
        if (litWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(textX, baseline - lineHeight / 2, litWidth, lineHeight);
          ctx.clip();
          ctx.fillStyle = part.part.litColor || lit;
          ctx.fillText(token.text, textX, baseline);
          ctx.restore();
        }
        if (token.run.ruby) {
          ctx.font = part.rubyFont;
          ctx.fillStyle = token.run.rubyColor || token.run.color;
          const rubyX = cursorX + (advance - token.rubyWidth) / 2;
          ctx.fillText(token.run.ruby, rubyX, cursorY + rubyBand / 2);
        }
        cursorX += advance;
      });
      cursorY += rubyBand + lineHeight;
    });
  });
  ctx.restore();
}

function paintHeader(ctx: CanvasRenderingContext2D, model: FrameModel): void {
  const { width, theme } = model;
  const pillHeight = HEADER_PILL_HEIGHT;
  const pillY = (HEADER_HEIGHT - pillHeight) / 2;
  ctx.fillStyle = theme.pill;
  roundRect(ctx, FRAME_PAD, pillY, width - FRAME_PAD * 2, pillHeight, pillHeight / 2);
  ctx.fill();

  const titleFont = `600 30px "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif`;
  const numberFont = `400 24px "PingFang TC", "Noto Sans TC", system-ui, sans-serif`;
  const gap = 12;
  const maxText = width - FRAME_PAD * 2 - 48;
  ctx.font = numberFont;
  const numberWidth = model.songNumber ? ctx.measureText(model.songNumber).width : 0;
  ctx.font = titleFont;
  let title = model.title;
  const titleRoom = Math.max(0, maxText - numberWidth - (numberWidth ? gap : 0));
  if (ctx.measureText(title).width > titleRoom) {
    while (title.length > 1 && ctx.measureText(`${title}…`).width > titleRoom) title = title.slice(0, -1);
    title = `${title}…`;
  }
  const titleWidth = ctx.measureText(title).width;
  const total = numberWidth + (numberWidth ? gap : 0) + titleWidth;
  let x = (width - total) / 2;
  const middle = HEADER_HEIGHT / 2;
  ctx.textBaseline = "middle";
  if (numberWidth) {
    ctx.font = numberFont;
    ctx.fillStyle = theme.muted;
    ctx.fillText(model.songNumber, x, middle);
    x += numberWidth + gap;
  }
  ctx.font = titleFont;
  ctx.fillStyle = theme.text;
  ctx.fillText(title, x, middle);

  ctx.fillStyle = theme.track;
  ctx.fillRect(0, HEADER_HEIGHT, width, PROGRESS_HEIGHT);
  ctx.fillStyle = theme.accent;
  ctx.fillRect(0, HEADER_HEIGHT, width * Math.max(0, Math.min(1, model.progress || 0)), PROGRESS_HEIGHT);
}

/** Paints one frame: header, progress, then the current line pinned at the top and the next line below. */
export function paintFrame(ctx: CanvasRenderingContext2D, model: FrameModel): void {
  const { width, height, theme } = model;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, width, height);
  paintHeader(ctx, model);

  const top = HEADER_HEIGHT + PROGRESS_HEIGHT + 16;
  const rowWidth = width - FRAME_PAD * 2;
  const available = height - top - 16;

  if (model.message || (!model.current && !model.next)) {
    ctx.fillStyle = theme.muted;
    ctx.font = `400 30px "PingFang TC", "Noto Sans TC", system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(model.message || "等待歌詞載入…", width / 2, top + available / 2);
    ctx.restore();
    return;
  }

  const maxText = rowWidth - ROW_PAD_X * 2;
  const userScale = Number.isFinite(model.lyricScale) && model.lyricScale > 0 ? model.lyricScale : 1;
  let scale = userScale;
  let current = model.current ? layoutRow(ctx, model.current, scale, maxText) : null;
  // Like the desktop window, the current line has to fit; shrink it rather than cut it.
  while (current && current.height > available && scale > MIN_FIT_SCALE * userScale) {
    scale *= 0.9;
    current = layoutRow(ctx, model.current as FrameRow, scale, maxText);
  }

  ctx.beginPath();
  ctx.rect(0, top, width, height - top);
  ctx.clip();
  let y = top;
  if (current) {
    paintRow(ctx, current, FRAME_PAD, y, rowWidth, theme.lit, theme.accent);
    y += current.height + ROW_GAP;
  }
  if (model.next && y < height) {
    paintRow(ctx, layoutRow(ctx, model.next, scale, maxText), FRAME_PAD, y, rowWidth, theme.lit, theme.accent);
  }
  ctx.restore();
}
