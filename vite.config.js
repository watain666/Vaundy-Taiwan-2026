import { defineConfig } from "vite";
import { cpSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import Beasties from "beasties";
import { homeHtml } from "./src/ui/home.js";

function prerenderHome(){
  return {
    name: "prerender-home",
    transformIndexHtml: {
      order: "pre",
      handler(html){
        const { version } = JSON.parse(readFileSync(resolve("package.json"), "utf8"));
        return html.replace('<main id="app"></main>', `<main id="app">${homeHtml(`v${version}`)}</main>`);
      }
    }
  };
}

function copyRootStaticAssets(){
  return {
    name: "copy-root-static-assets",
    apply: "build",
    async closeBundle(){
      const outputDir = resolve("dist");
      ["CNAME", "sw.js", "manifest.json", "robots.txt", "sitemap.xml", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"]
        .forEach(file => cpSync(resolve(file), resolve(outputDir, file)));
      cpSync(resolve("images"), resolve(outputDir, "images"), { recursive: true });

      const indexPath = resolve(outputDir, "index.html");
      // The prerendered homepage can paint from its inlined styles while the
      // remaining route styles load in the background.
      const criticalHtml = await new Beasties({
        path: outputDir,
        publicPath: "./",
        preload: "media",
        allowRules: [/^:root\[data-theme=(?:light|dark)\](?:$| \.hero:after$)/],
        reduceInlineStyles: false
      }).process(readFileSync(indexPath, "utf8"));
      // Keep the full stylesheet downloaded but inactive on the homepage.
      // src/main.js enables it before showing another route or handling input.
      const deferredLink = /(<link rel="stylesheet"[^>]* media="print") onload="this\.media='all'"/;
      if (!deferredLink.test(criticalHtml)) throw new Error("Missing deferred app stylesheet");
      const indexHtml = criticalHtml.replace(deferredLink, "$1");
      writeFileSync(indexPath, indexHtml);
      const assetUrls = [...new Set([
        ...[...indexHtml.matchAll(/(?:src|href)="(\.\/assets\/[^\"]+)"/g)].map(([, url]) => url),
        ...[...indexHtml.matchAll(/url\(((?:\.\/)?assets\/[^)]+)\)/g)]
          .map(([, url]) => url.startsWith("./") ? url : `./${url}`),
        // Split lyrics and readings must also work on a first offline visit.
        ...readdirSync(resolve(outputDir, "assets")).filter(file => file.endsWith(".js"))
          .map(file => `./assets/${file}`)
      ])];
      const serviceWorkerPath = resolve(outputDir, "sw.js");
      const serviceWorker = readFileSync(serviceWorkerPath, "utf8")
        .replace("const VITE_BUILD_ASSETS = [];", `const VITE_BUILD_ASSETS = ${JSON.stringify(assetUrls)};`);
      writeFileSync(serviceWorkerPath, serviceWorker);
    }
  };
}

export default defineConfig({
  base: "./",
  plugins: [prerenderHome(), copyRootStaticAssets()],
  server: {
    allowedHosts: ["vn7591g.tail12ac60.ts.net"]
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsInlineLimit: 0
  }
});
