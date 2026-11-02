---
name: publish-guide-release
description: Use when the user asks to publish, release, or deploy a new guide version (vX.Y.Z) after feature PRs are merged into main.
---

# Publish a guide release

The rules live in `AGENTS.md` ("Commits and versioning" and "Explicit release
requests"). This skill is the concrete command sequence for those rules.

Two layouts are possible. Decide once in step 1 and keep to it:

- **Plain layout**: this checkout can switch to `main`. Run every step here.
- **Worktree layout**: another worktree already holds `main` (`git switch main`
  fails with "already used by worktree"). Create a temporary release worktree in
  step 1, run steps 2 to 7 inside it, and remove it in step 8. Shell `cd` does
  not persist between tool calls, so either `cd` into the worktree in the same
  call as the command, or prefix git commands with `git -C <scratch dir>/release-wt`.

Angle-bracket placeholders such as `<RELEASE_SHA>` stand for a value read in an
earlier step; substitute the value before running the command. Shell variables do
not survive between tool calls, so do not carry them across steps.

1. Merge the feature PR (if it is not merged yet) and get a checkout at `origin/main`.
   Run in the original checkout:
   ```sh
   gh pr merge <N> --merge
   git fetch origin
   git worktree list
   ```
   Plain layout:
   ```sh
   git switch main && git pull --ff-only origin main
   ```
   Worktree layout (still in the original checkout; the symlink shares the
   installed dependencies):
   ```sh
   git worktree add -b chore/release-vX.Y.Z <scratch dir>/release-wt origin/main
   ln -s "$(pwd)/node_modules" <scratch dir>/release-wt/node_modules
   ```
   Inside the worktree `git status` lists `node_modules` as untracked, because the
   ignore rule matches directories, not symlinks. That is expected; never `git add` it.
   Collect the release scope with `git log --oneline <previous release>..origin/main`,
   where `<previous release>` is the last `chore(release): publish guide v…` commit
   on `origin/main` (`git log origin/main --grep '^chore(release)' -1 --format=%H`).
   Only user-visible PRs get CHANGELOG bullets.

2. Pick the SemVer bump from the whole scope (content, timing, style fixes,
   refactors and docs are a patch; a new capability is a minor). Set the same
   version in all of these:
   - `package.json` `"version"`
   - `package-lock.json` root `"version"` (line 3) and `packages[""].version` (line 9)
   - `src/main.js` `const BUILD = "vX.Y.Z"`
   - `sw.js` `CACHE_VERSION`

3. Add the newest section at the top of `CHANGELOG.md`, following AGENTS.md
   "Explicit release requests" item 2:
   - Traditional Chinese; every bullet starts with the linked PR and a full-width
     colon, `- [PR #N](https://github.com/watain666/Vaundy-Taiwan-2026/pull/N)：`, then the change.
   - Song names use the Japanese original title: the parenthesised part of the
     song `title` in `src/song-metadata.js` (for example `東京 Flash (東京フラッシュ)`
     becomes `〈東京フラッシュ〉`).
   - An external contributor gets one extra thank-you bullet with a linked handle
     and PR. The owner's own PRs (`@watain666`) need only the change and PR link.
   - A PR already covered by an older version gets its link added to that older
     section, not a new entry.
   Write the heading as `## **vX.Y.Z**` for now; the commit link is added in step 6.

4. Verify the release.
   ```sh
   npm run typecheck
   npm test
   npm run build
   git diff --check
   ```
   `npm test` covers the lyric and karaoke checks (the old `check:lyrics` and
   `check:karaoke` scripts no longer exist), and `npm run build` fails on a
   violated song data rule and names the song, line and rule.

5. Make the release commit (no Co-Authored-By trailer) and record its SHA; the
   later steps call it `RELEASE_SHA`.
   ```sh
   git add CHANGELOG.md package.json package-lock.json src/main.js sw.js
   git commit -m "chore(release): publish guide vX.Y.Z"
   git rev-parse HEAD   # RELEASE_SHA
   ```

6. Link the heading to `RELEASE_SHA` (the release commit, not the HEAD you are
   about to create): `## [**vX.Y.Z**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/<RELEASE_SHA>)`,
   and commit it as `docs(changelog): link vX.Y.Z release commit`. Never amend the
   release commit.

7. Push and read back. `HEAD:main` works in both layouts.
   ```sh
   git push origin HEAD:main
   git fetch origin
   git merge-base --is-ancestor <RELEASE_SHA> origin/main && echo RELEASE_IN_ORIGIN_MAIN
   git show origin/main:CHANGELOG.md | grep -m1 "vX.Y.Z" | grep -F "<RELEASE_SHA>"
   ```
   The last line must print the heading; an empty result means the changelog on
   `origin/main` does not point at the release commit. Then wait for the Pages run
   of the pushed commit and check the live service worker:
   ```sh
   git rev-parse HEAD   # <PUSHED_SHA>, the changelog-link commit
   gh run list --workflow pages.yml --limit 3 --json databaseId,status,conclusion,headSha
   gh run watch <databaseId of the run whose headSha is PUSHED_SHA> --exit-status
   curl -s "https://vaundy.tiaui.co/sw.js?$(date +%s)" -H 'Cache-Control: no-cache' | grep '^const CACHE_VERSION'
   ```
   If no run has `headSha` equal to `PUSHED_SHA` yet, wait a few seconds and list
   again; never watch an older run. If the live `CACHE_VERSION` still shows the
   previous version right after the run finishes, retry the `curl` a few times.
   Only after the readback matches and the live `CACHE_VERSION` is `vX.Y.Z`,
   report the version, the release subject, and the commit URL.
   Push only to `origin`, never to `upstream`.

8. Worktree layout only. Run in the original checkout (`git worktree remove`
   fails from inside the worktree it removes):
   ```sh
   git worktree remove --force <scratch dir>/release-wt
   git branch -D chore/release-vX.Y.Z
   ```

## Known pitfalls

- `.git/index.lock` errors: other tools (Orca, gitstatusd) create the lock briefly,
  so retry first. Before deleting a lock that won't go away, run
  `lsof .git/index.lock` to make sure no process holds it, then delete it with
  `command rm -f .git/index.lock` (`rm` is aliased to `rm -i`).
- When a commit fails, don't run the next push command. Check the result of
  `git log -1` before going on.
- `grep CACHE_VERSION sw.js` without the `^const` anchor first matches a Korean
  comment line, not the constant.
- The git stash is shared across worktrees. Never run a bare `git stash` /
  `git stash pop` during a release; set work aside with a WIP commit instead.
