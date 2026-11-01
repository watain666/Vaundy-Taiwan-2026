---
name: publish-guide-release
description: Use when the user asks to publish, release, or deploy a new guide version (vX.Y.Z) after feature PRs are merged into main.
---

# Publish a guide release

The rules live in `AGENTS.md` ("Commits and versioning" and "Explicit release
requests"). This skill is the concrete command sequence for those rules.

1. Merge the feature PR and sync main.
   ```sh
   gh pr merge <N> --merge
   git switch main && git pull --ff-only origin main
   git status --short --branch
   ```
   Collect the release scope with `git log --oneline <last release commit>..HEAD`.
   Only user-visible PRs get CHANGELOG bullets.

2. Pick the SemVer bump from the whole scope (content, timing, and style fixes
   are a patch; a new capability is a minor). Set the same version in all of these:
   - `package.json` `"version"`
   - `package-lock.json` root `"version"` (line 3) and `packages[""].version` (line 9)
   - `src/main.js` `const BUILD = "vX.Y.Z"`
   - `sw.js` `CACHE_VERSION`

3. Add the newest section at the top of `CHANGELOG.md`. Use Traditional Chinese,
   with Japanese song titles from `src/data.js` (e.g. `〈東京フラッシュ〉`), and a
   linked `[PR #N](https://github.com/watain666/Vaundy-Taiwan-2026/pull/N)` on every bullet.
   Write the heading as `## **vX.Y.Z**` for now; the commit link is added in step 6.

4. Verify the release.
   ```sh
   npm run build
   git diff --check
   ```
   For lyric changes, also run `npm run check:lyrics` and `npm run check:karaoke`.

5. Make the release commit (no Co-Authored-By trailer).
   ```sh
   git add CHANGELOG.md package.json package-lock.json src/main.js sw.js
   git commit -m "chore(release): publish guide vX.Y.Z"
   git rev-parse HEAD
   ```

6. Link the heading to that full SHA, `## [**vX.Y.Z**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/<full SHA>)`,
   and commit it as `docs(changelog): link vX.Y.Z release commit`. Never amend the
   release commit.

7. Push and read back.
   ```sh
   git push origin main
   git fetch origin
   git merge-base --is-ancestor <release SHA> origin/main && echo RELEASE_IN_ORIGIN_MAIN
   git show origin/main:CHANGELOG.md | grep -m1 "vX.Y.Z"
   ```
   Only after the readback matches, report the version, the release subject, and the commit URL.
   Push only to `origin`, never to `upstream`.

## Known pitfalls

- `.git/index.lock` errors: other tools (Orca, gitstatusd) create the lock briefly,
  so retry first. Before deleting a lock that won't go away, run
  `lsof .git/index.lock` to make sure no process holds it, then delete it with
  `command rm -f .git/index.lock` (`rm` is aliased to `rm -i`).
- When a commit fails, don't run the next push command. Check the result of
  `git log -1` before going on.
