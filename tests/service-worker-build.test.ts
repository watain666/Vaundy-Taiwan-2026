import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import {
  injectServiceWorker,
  precacheAssets,
  SERVICE_WORKER_PLACEHOLDERS,
  ServiceWorkerInjectionError,
  type BuildGraph,
} from "../src/build/service-worker";

const SOURCE = [
  "/* header mentioning CACHE_VERSION */",
  SERVICE_WORKER_PLACEHOLDERS.version,
  "const CACHE_NAME = `horo-guide-${CACHE_VERSION}`;",
  SERVICE_WORKER_PLACEHOLDERS.assets,
  "const PRECACHE = [\"./\", ...VITE_BUILD_ASSETS];",
].join("\n");

describe("injectServiceWorker", () => {
  test("writes the version as one plain const line and the asset list", () => {
    const output = injectServiceWorker(SOURCE, { version: "v1.2.3", assets: ["./assets/a.js", "./assets/b.css"] });
    expect(output.split("\n").filter(line => /^const CACHE_VERSION/.test(line))).toEqual(['const CACHE_VERSION = "v1.2.3";']);
    expect(output).toContain('const VITE_BUILD_ASSETS = ["./assets/a.js","./assets/b.css"];');
    expect(output).not.toContain("__CACHE_VERSION__");
    expect(output.split("\n")).toHaveLength(SOURCE.split("\n").length);
  });

  test("fails naming the version placeholder when it is missing", () => {
    const source = SOURCE.replace(SERVICE_WORKER_PLACEHOLDERS.version, 'const CACHE_VERSION = "v1.0.0";');
    expect(() => injectServiceWorker(source, { version: "v1.2.3", assets: [] }))
      .toThrow(new ServiceWorkerInjectionError(`service worker: version placeholder not found: ${SERVICE_WORKER_PLACEHOLDERS.version}`));
  });

  test("fails naming the asset list placeholder when it is missing", () => {
    const source = SOURCE.replace(SERVICE_WORKER_PLACEHOLDERS.assets, "const VITE_BUILD_ASSETS = [\"./x.js\"];");
    expect(() => injectServiceWorker(source, { version: "v1.2.3", assets: [] }))
      .toThrow(`service worker: assets placeholder not found: ${SERVICE_WORKER_PLACEHOLDERS.assets}`);
  });

  test("fails when a placeholder appears twice", () => {
    const source = `${SOURCE}\n${SERVICE_WORKER_PLACEHOLDERS.version}`;
    expect(() => injectServiceWorker(source, { version: "v1.2.3", assets: [] }))
      .toThrow("service worker: version placeholder appears 2 times");
  });

  test("the root sw.js carries both placeholders and no version", () => {
    const source = readFileSync("sw.js", "utf8");
    expect(() => injectServiceWorker(source, { version: "v0.0.0", assets: [] })).not.toThrow();
    expect(source).not.toMatch(/^const CACHE_VERSION = "v\d/m);
  });
});

function graph(overrides: Partial<BuildGraph> = {}): BuildGraph {
  return {
    html: [
      '<link rel="apple-touch-icon" href="./assets/touch-1.png">',
      '<meta property="og:image" content="./assets/og-1.png">',
      '<script type="module" crossorigin src="./assets/index-1.js"></script>',
      '<link rel="stylesheet" crossorigin href="./assets/index-1.css">',
    ].join("\n"),
    chunks: {
      "assets/index-1.js": { imports: ["assets/shared-1.js"], dynamicImports: ["assets/song-B-1.js", "assets/song-A-1.js", "assets/lazy-1.js"] },
      "assets/shared-1.js": { imports: [], dynamicImports: [] },
      "assets/song-A-1.js": { imports: ["assets/shared-1.js"], dynamicImports: [] },
      "assets/song-B-1.js": { imports: [], dynamicImports: [] },
      "assets/lazy-1.js": { imports: [], dynamicImports: ["assets/deep-1.js", "assets/index-1.js"] },
      "assets/deep-1.js": { imports: [], dynamicImports: [] },
      "assets/orphan-1.js": { imports: [], dynamicImports: [] },
    },
    css: {
      "assets/index-1.css": '.a{background:url(./poster-1.webp)} .b{background:url("data:image/svg+xml,%3Csvg%3E")} .c{background:url(https://example.com/x.png)}',
      "assets/widget-1.css": ".w{background:url(./widget-1.png)}",
    },
    assets: ["assets/touch-1.png", "assets/og-1.png", "assets/poster-1.webp", "assets/widget-1.png", "assets/unused-1.png"],
    ...overrides,
  };
}

describe("precacheAssets", () => {
  test("lists the HTML references in order, then everything reachable, sorted", () => {
    expect(precacheAssets(graph())).toEqual([
      "./assets/touch-1.png",
      "./assets/index-1.js",
      "./assets/index-1.css",
      "./assets/deep-1.js",
      "./assets/lazy-1.js",
      "./assets/poster-1.webp",
      "./assets/shared-1.js",
      "./assets/song-A-1.js",
      "./assets/song-B-1.js",
    ]);
  });

  test("includes every dynamically imported song chunk", () => {
    const songs = Array.from({ length: 36 }, (_, index) => `assets/song-${index}-1.js`);
    const base = graph();
    const result = precacheAssets({
      ...base,
      chunks: {
        ...base.chunks,
        "assets/index-1.js": { imports: [], dynamicImports: songs },
        ...Object.fromEntries(songs.map(song => [song, { imports: [], dynamicImports: [] }])),
      },
    });
    expect(result).toEqual(expect.arrayContaining(songs.map(song => `./${song}`)));
  });

  test("leaves out unreferenced chunks, CSS, images, non-src attributes and files outside the bundle", () => {
    const result = precacheAssets(graph({
      html: `${graph().html}\n<script src="./assets/from-public-1.js"></script>`,
    }));
    for (const file of ["orphan-1.js", "widget-1.css", "widget-1.png", "unused-1.png", "og-1.png", "from-public-1.js"]) {
      expect(result).not.toContain(`./assets/${file}`);
    }
    expect(result.some(path => path.includes("data:") || path.includes("example.com"))).toBe(false);
  });

  test("gives the same list whatever order the bundle lists its files in", () => {
    const base = graph();
    const reversed: BuildGraph = {
      ...base,
      chunks: Object.fromEntries(Object.entries(base.chunks).reverse()),
      css: Object.fromEntries(Object.entries(base.css).reverse()),
      assets: [...base.assets].reverse(),
    };
    expect(precacheAssets(reversed)).toEqual(precacheAssets(base));
  });
});
