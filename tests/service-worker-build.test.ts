import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import {
  injectServiceWorker,
  SERVICE_WORKER_PLACEHOLDERS,
  ServiceWorkerInjectionError,
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
