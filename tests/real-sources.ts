/* Loads the real authoring files for golden and integration tests. */
/* A classic script: importing it assigns globalThis.KARAOKE_SOURCES. */
import "../karaoke-sources.js";
import { loadCatalogueSources } from "../src/catalogue/sources";
import type { CatalogueSources } from "../src/catalogue/assemble";

const MODULES: Record<string, () => Promise<unknown>> = {
  "src/song-metadata.js": () => import("../src/song-metadata.js"),
  "src/song-lyrics.js": () => import("../src/song-lyrics.js"),
  "src/chant-guide.js": () => import("../src/chant-guide.js"),
  "furigana.js": () => import("../furigana.js"),
  "src/furigana-corrections.js": () => import("../src/furigana-corrections.js"),
  "src/data.js": () => import("../src/data.js"),
  "src/word-timing.js": () => import("../src/word-timing.js"),
  "karaoke-sources.js": async () => undefined,
};

export function loadRealSources(): Promise<CatalogueSources> {
  return loadCatalogueSources(path => {
    const load = MODULES[path];
    if (!load) throw new Error(`no test importer for ${path}`);
    return load();
  });
}
