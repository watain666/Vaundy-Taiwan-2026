/*
 * Wraps the visible text of a Japanese-version chant segment in
 * `<span class="chant-segment">` inside already rendered line markup
 * (kana ruby, romaji, inline icons), without a DOM.
 *
 * The page used to do this on a <template> element; this is the same
 * algorithm on a minimal tree of the markup, so it runs in node. The markup
 * comes from the lyric renderer only: escaped text, <ruby>/<rt> readings and
 * the inline icon spans. Text skipped for matching: inside <rt>, <rp>, an
 * icon (`.ico`) or an earlier chant segment.
 */

type MiniParent = MiniElement | MiniRoot;
type MiniRoot = { kind: "root"; children: MiniNode[] };
type MiniElement = {
  kind: "element";
  name: string;
  open: string;
  close: string;
  classes: string[];
  children: MiniNode[];
  parent: MiniParent;
};
/** `raw` keeps the source spelling until the node is split. */
type MiniText = { kind: "text"; data: string; raw: string | null; parent: MiniParent };
type MiniNode = MiniElement | MiniText;

const VOID_ELEMENTS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const NAMED_ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(raw: string): string {
  return raw.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match: string, body: string) => {
    if (body[0] === "#") {
      const code = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    const named = NAMED_ENTITIES[body.toLowerCase()];
    return named === undefined ? match : named;
  });
}

function escapeText(data: string): string {
  return data.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;");
}

function parse(markup: string): MiniRoot {
  const root: MiniRoot = { kind: "root", children: [] };
  const stack: MiniParent[] = [root];
  const top = () => stack[stack.length - 1];
  const tokens = markup.match(/<[^>]*>|[^<]+|</g) || [];
  for (const token of tokens) {
    if (token.length > 1 && token[0] === "<" && token[token.length - 1] === ">") {
      const closing = /^<\/\s*([^\s>]+)/.exec(token);
      if (closing) {
        const name = closing[1].toLowerCase();
        const at = stack.map(node => (node.kind === "element" ? node.name : "")).lastIndexOf(name);
        if (at > 0) stack.length = at;
        continue;
      }
      const opening = /^<([A-Za-z][^\s/>]*)/.exec(token);
      if (!opening) continue;
      const name = opening[1].toLowerCase();
      const classMatch = /\sclass\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(token);
      const selfClosing = /\/\s*>$/.test(token) || VOID_ELEMENTS.has(name);
      const element: MiniElement = {
        kind: "element",
        name,
        open: token,
        close: selfClosing ? "" : `</${opening[1]}>`,
        classes: classMatch ? (classMatch[1] ?? classMatch[2] ?? "").split(/\s+/).filter(Boolean) : [],
        children: [],
        parent: top(),
      };
      top().children.push(element);
      if (!selfClosing) stack.push(element);
      continue;
    }
    top().children.push({ kind: "text", data: decodeEntities(token), raw: token, parent: top() });
  }
  return root;
}

function serialize(nodes: MiniNode[]): string {
  return nodes.map(node => node.kind === "text"
    ? (node.raw ?? escapeText(node.data))
    : node.open + serialize(node.children) + node.close).join("");
}

function insertBefore(parent: MiniParent, node: MiniNode, reference: MiniNode): void {
  const at = parent.children.indexOf(reference);
  parent.children.splice(at < 0 ? parent.children.length : at, 0, node);
  node.parent = parent;
}

function detach(node: MiniNode): void {
  const at = node.parent.children.indexOf(node);
  if (at >= 0) node.parent.children.splice(at, 1);
}

/** Text.splitText with the DOM's UTF-16 offsets. */
function splitText(node: MiniText, offset: number): MiniText {
  const rest: MiniText = { kind: "text", data: node.data.slice(offset), raw: null, parent: node.parent };
  node.data = node.data.slice(0, offset);
  node.raw = null;
  const at = node.parent.children.indexOf(node);
  node.parent.children.splice(at + 1, 0, rest);
  return rest;
}

export function wrapChantMarkup(markup: string, target: string, options: { breakBefore?: boolean } = {}): string {
  const value = String(markup || "");
  const needle = String(target || "");
  if (!needle || !value) return value;

  const root = parse(value);
  const entries: { node: MiniText; char: string; offset: number }[] = [];
  const visit = (node: MiniNode | MiniRoot, hidden: boolean) => {
    if (node.kind === "text") {
      if (!hidden) Array.from(node.data).forEach((char, offset) => entries.push({ node, char, offset }));
      return;
    }
    const nextHidden = hidden || (node.kind === "element" && (
      node.name === "rt" || node.name === "rp"
      || node.classes.includes("ico") || node.classes.includes("chant-segment")
    ));
    node.children.slice().forEach(child => visit(child, nextHidden));
  };
  visit(root, false);

  const visible = entries.map(entry => entry.char).join("");
  /* Same index arithmetic as the DOM version: a UTF-16 index into the
     joined text used as an index into the per-character entries. */
  const start = visible.indexOf(needle);
  if (start < 0) return value;
  const length = Array.from(needle).length;
  const selected = entries.slice(start, start + length);
  if (selected.length !== length) return value;

  const grouped = new Map<MiniText, number[]>();
  selected.forEach(entry => {
    if (!grouped.has(entry.node)) grouped.set(entry.node, []);
    grouped.get(entry.node)!.push(entry.offset);
  });

  [...grouped.entries()].reverse().forEach(([node, offsets]) => {
    const first = Math.min(...offsets);
    const last = Math.max(...offsets) + 1;
    const parent = node.parent;
    const ruby = parent.kind === "element" && parent.name === "ruby" && first === 0 && last === node.data.length
      ? parent
      : null;
    const className = `chant-segment${options.breakBefore ? " break-before" : ""}`;
    const span: MiniElement = {
      kind: "element",
      name: "span",
      open: `<span class="${className}">`,
      close: "</span>",
      classes: className.split(" "),
      children: [],
      parent,
    };
    if (ruby) {
      insertBefore(ruby.parent, span, ruby);
      detach(ruby);
      span.children.push(ruby);
      ruby.parent = span;
      return;
    }
    let selectedNode = node;
    if (first > 0) selectedNode = splitText(node, first);
    if (last - first < selectedNode.data.length) splitText(selectedNode, last - first);
    insertBefore(selectedNode.parent, span, selectedNode);
    detach(selectedNode);
    span.children.push(selectedNode);
    selectedNode.parent = span;
  });

  return serialize(root.children);
}
