/* Build-time helpers for the service worker. Pure functions: the Vite
   plugin in vite.config.ts reads and writes the files, these only turn
   text and a description of the bundle into text and paths. */

/** The two lines in the root `sw.js` that every build replaces. */
export const SERVICE_WORKER_PLACEHOLDERS = {
  version: 'const CACHE_VERSION = "__CACHE_VERSION__";',
  assets: "const VITE_BUILD_ASSETS = [];",
} as const;

export class ServiceWorkerInjectionError extends Error {}

/**
 * Returns the service worker source with the build version and the precache
 * asset list written in. Throws, naming the placeholder, when either
 * placeholder line is missing or appears more than once, so a build can never
 * ship a stale version or an empty precache list.
 */
export function injectServiceWorker(source: string, { version, assets }: { version: string; assets: readonly string[] }): string {
  const lines = source.split("\n");
  const replacements: Record<keyof typeof SERVICE_WORKER_PLACEHOLDERS, string> = {
    version: `const CACHE_VERSION = ${JSON.stringify(version)};`,
    assets: `const VITE_BUILD_ASSETS = ${JSON.stringify(assets)};`,
  };
  for (const key of Object.keys(SERVICE_WORKER_PLACEHOLDERS) as (keyof typeof SERVICE_WORKER_PLACEHOLDERS)[]) {
    const placeholder = SERVICE_WORKER_PLACEHOLDERS[key];
    const matches = lines.flatMap((line, index) => line.trim() === placeholder ? [index] : []);
    if (matches.length !== 1) {
      const problem = matches.length ? `appears ${matches.length} times` : "not found";
      throw new ServiceWorkerInjectionError(`service worker: ${key} placeholder ${problem}: ${placeholder}`);
    }
    lines[matches[0]] = replacements[key];
  }
  return lines.join("\n");
}

/** The parts of a Vite/Rollup output bundle the precache list depends on. */
export type BuildGraph = {
  /** The emitted `index.html`. */
  html: string;
  /** Every JS chunk by output file name (`assets/index-abc.js`). */
  chunks: Record<string, { imports: readonly string[]; dynamicImports: readonly string[] }>;
  /** Every emitted CSS file by output file name, with its text. */
  css: Record<string, string>;
  /** Every other emitted file name (images, icons). */
  assets: readonly string[];
};

const HTML_ASSET_REF = /(?:src|href)="\.\/(assets\/[^"]+)"|url\(\.\/(assets\/[^)]+)\)/g;
const CSS_URL = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;

function resolveRelative(fromFile: string, ref: string): string | null {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(ref)) return null;
  const parts = fromFile.split("/").slice(0, -1);
  for (const part of ref.split(/[?#]/)[0].split("/")) {
    if (part === "..") parts.pop();
    else if (part && part !== ".") parts.push(part);
  }
  return parts.join("/");
}

/**
 * Lists the build output a first offline visit needs: the files `index.html`
 * references from `assets/` (entry chunk, entry CSS, icons), every JS chunk
 * reachable from those by static or dynamic import (so each song chunk), and
 * the files those CSS files reference with `url()`. Only files present in the
 * bundle are listed, so anything copied from `public/` is never included.
 * HTML references keep their document order; the rest is sorted.
 */
export function precacheAssets(graph: BuildGraph): string[] {
  const emitted = new Set([...Object.keys(graph.chunks), ...Object.keys(graph.css), ...graph.assets]);
  const fromHtml: string[] = [];
  for (const [, attr, url] of graph.html.matchAll(HTML_ASSET_REF)) {
    const file = (attr ?? url).split(/[?#]/)[0];
    if (emitted.has(file) && !fromHtml.includes(file)) fromHtml.push(file);
  }

  const reached = new Set<string>();
  const pending = [...fromHtml];
  while (pending.length) {
    const file = pending.pop()!;
    if (reached.has(file)) continue;
    reached.add(file);
    const chunk = graph.chunks[file];
    if (chunk) pending.push(...chunk.imports, ...chunk.dynamicImports);
    const css = graph.css[file];
    if (css !== undefined) {
      for (const [, , ref] of css.matchAll(CSS_URL)) {
        const target = resolveRelative(file, ref);
        if (target && emitted.has(target)) pending.push(target);
      }
    }
  }

  const rest = [...reached].filter(file => emitted.has(file) && !fromHtml.includes(file)).sort();
  return [...fromHtml, ...rest].map(file => `./${file}`);
}
