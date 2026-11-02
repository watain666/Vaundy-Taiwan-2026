/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import { cpSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { homeHtml } from "./src/ui/home.js";
import { assembleCatalogue, CatalogueError, formatIssue, type AssembledCatalogue, type Song } from "./src/catalogue/assemble";
import { AUTHORING_FILES, loadCatalogueSources } from "./src/catalogue/sources";
import { injectServiceWorker, ServiceWorkerInjectionError } from "./src/build/service-worker";

/* The build version ("v" + package.json version) is read here once and
   used for the prerendered footer, the page's BUILD constant and the
   service worker's CACHE_VERSION, so the three always agree. */
function readBuildVersion(): string {
  const { version } = JSON.parse(readFileSync(resolve("package.json"), "utf8"));
  if (typeof version !== "string" || !version) throw new Error("package.json has no version");
  return `v${version}`;
}

const BUILD_VERSION = readBuildVersion();

function prerenderHome(): Plugin {
  return {
    name: "prerender-home",
    transformIndexHtml: {
      order: "pre",
      handler(html: string){
        return html.replace('<main id="app"></main>', `<main id="app">${homeHtml(BUILD_VERSION)}</main>`);
      }
    }
  };
}

function copyRootStaticAssets(): Plugin {
  return {
    name: "copy-root-static-assets",
    apply: "build",
    closeBundle(error){
      // Rollup still calls closeBundle after a failed build; copying then
      // would throw ENOENT and hide the original error.
      if (error) return;
      const outputDir = resolve("dist");
      ["CNAME", "sw.js", "manifest.json", "robots.txt", "sitemap.xml", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"]
        .forEach(file => cpSync(resolve(file), resolve(outputDir, file)));
      cpSync(resolve("images"), resolve(outputDir, "images"), { recursive: true });

      const indexPath = resolve(outputDir, "index.html");
      const indexHtml = readFileSync(indexPath, "utf8");
      const assetUrls = [...new Set([
        ...[...indexHtml.matchAll(/(?:src|href)="(\.\/assets\/[^\"]+)"/g)].map(([, url]) => url),
        ...[...indexHtml.matchAll(/url\((\.\/assets\/[^)]+)\)/g)].map(([, url]) => url),
        // The homepage poster lives in the external CSS, not the HTML.
        ...readdirSync(resolve(outputDir, "assets"))
          .filter(file => /^poster-.*\.webp$/.test(file))
          .map(file => `./assets/${file}`),
        // Split lyrics and readings must also work on a first offline visit.
        ...readdirSync(resolve(outputDir, "assets")).filter(file => file.endsWith(".js"))
          .map(file => `./assets/${file}`)
      ])];
      const serviceWorkerPath = resolve(outputDir, "sw.js");
      let serviceWorker: string;
      try {
        serviceWorker = injectServiceWorker(readFileSync(serviceWorkerPath, "utf8"), {
          version: BUILD_VERSION,
          assets: assetUrls
        });
      } catch (error) {
        if (error instanceof ServiceWorkerInjectionError) this.error(error.message);
        throw error;
      }
      writeFileSync(serviceWorkerPath, serviceWorker);
    }
  };
}

/* Serves the song catalogue as virtual modules: one summary module that
   ships with the page, plus one module (and so one chunk) per song. Songs
   are assembled and validated from the authoring files; a violated
   invariant fails the build. Nothing is written to disk. */
function songCatalogue(): Plugin {
  const SUMMARY_ID = "virtual:song-catalogue";
  const SONG_PREFIX = "virtual:song-catalogue/song/";
  const authoringPaths = Object.values(AUTHORING_FILES).map(file => resolve(file));
  type State = { catalogue: AssembledCatalogue; songByModule: Map<string, Song>; moduleById: Map<string, string> };
  let state: Promise<State> | null = null;
  let generation = 0;
  let warned = -1;

  /* Chunk-safe module names; ids keep their spaces and punctuation. */
  function moduleNames(songs: Song[]): Map<string, string> {
    const used = new Set<string>();
    return new Map(songs.map(song => {
      let name = `song-${song.id.replace(/[^A-Za-z0-9_-]+/g, "") || song.number}`;
      if (used.has(name)) name = `${name}-${song.number}`;
      used.add(name);
      return [song.id, `${SONG_PREFIX}${name}.js`];
    }));
  }

  function assemble(): Promise<State> {
    if (!state) {
      const stamp = ++generation;
      state = loadCatalogueSources(path => import(`${pathToFileURL(resolve(path)).href}?catalogue=${stamp}`))
        .then(sources => {
          const catalogue = assembleCatalogue(sources);
          const moduleById = moduleNames(catalogue.songs);
          const songByModule = new Map(catalogue.songs.map(song => [moduleById.get(song.id)!, song]));
          return { catalogue, songByModule, moduleById };
        });
      state.catch(() => { state = null; });
    }
    return state;
  }

  return {
    name: "song-catalogue",
    resolveId(id) {
      if (id === SUMMARY_ID || id.startsWith(SONG_PREFIX)) return `\0${id}`;
      return null;
    },
    async load(id) {
      if (id !== `\0${SUMMARY_ID}` && !id.startsWith(`\0${SONG_PREFIX}`)) return null;
      authoringPaths.forEach(file => this.addWatchFile(file));
      let current: State;
      try {
        current = await assemble();
      } catch (error) {
        if (error instanceof CatalogueError) this.error(error.message);
        throw error;
      }
      if (id === `\0${SUMMARY_ID}`) {
        const { warnings } = current.catalogue;
        if (warnings.length && warned !== generation) {
          warned = generation;
          this.warn(`song catalogue: ${warnings.length} warning(s)\n${warnings.map(formatIssue).join("\n")}`);
        }
        const loaders = current.catalogue.songs
          .map(song => `  ${JSON.stringify(song.id)}: () => import(${JSON.stringify(current.moduleById.get(song.id))}),`)
          .join("\n");
        return `export const SUMMARIES = ${JSON.stringify(current.catalogue.summaries)};\n`
          + `export const LOADERS = {\n${loaders}\n};\n`;
      }
      const song = current.songByModule.get(id.slice(1));
      if (!song) this.error(`song catalogue: no song for module ${id.slice(1)}`);
      return `export default ${JSON.stringify(song)};\n`;
    },
    handleHotUpdate(ctx) {
      if (!authoringPaths.includes(resolve(ctx.file))) return;
      state = null;
      const graph = ctx.server.moduleGraph;
      [...graph.idToModuleMap.keys()]
        .filter(id => id === `\0${SUMMARY_ID}` || id.startsWith(`\0${SONG_PREFIX}`))
        .forEach(id => graph.invalidateModule(graph.getModuleById(id)!));
      ctx.server.ws.send({ type: "full-reload" });
      return [];
    }
  };
}

export default defineConfig({
  base: "./",
  define: {
    __BUILD_VERSION__: JSON.stringify(BUILD_VERSION)
  },
  plugins: [songCatalogue(), prerenderHome(), copyRootStaticAssets()],
  server: {
    // A leading dot allows every device on this tailnet.
    allowedHosts: [".tail12ac60.ts.net"]
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsInlineLimit: 0
  },
  test: {
    include: ["tests/**/*.test.ts"]
  }
});
