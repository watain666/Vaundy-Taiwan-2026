import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

/* package.json is the one source of the build version; the lock file is kept
   in step by `npm version`, and the newest CHANGELOG heading is written by
   hand. A release commit that misses one of them fails here. */
test("package.json, both package-lock.json root versions and the newest CHANGELOG heading agree", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
  const heading = readFileSync("CHANGELOG.md", "utf8").split("\n").find(line => line.startsWith("## "));
  const changelog = heading?.match(/v(\d+\.\d+\.\d+)/)?.[1];

  const markers: Record<string, unknown> = {
    'package-lock.json "version"': lock.version,
    'package-lock.json packages[""].version': lock.packages?.[""]?.version,
    "CHANGELOG.md newest heading": changelog ?? `no vX.Y.Z in ${JSON.stringify(heading)}`,
  };
  const mismatches = Object.entries(markers)
    .filter(([, value]) => value !== pkg.version)
    .map(([name, value]) => `${name} is ${JSON.stringify(value)}, package.json "version" is ${JSON.stringify(pkg.version)}`);
  expect(mismatches).toEqual([]);
});
