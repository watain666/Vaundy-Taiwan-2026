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
