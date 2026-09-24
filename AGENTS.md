# Project instructions

This is a Vite static PWA for a Vaundy fan guide. Work from source files; `dist/` is generated output. Preserve existing user changes and keep each patch limited to the requested scope.

## Commits and versioning

- Use Conventional Commits for every commit: `<type>(<scope>): <summary>`, with an optional scope. Use `feat` for user-visible functionality, `fix` for bug fixes, and `docs`, `refactor`, `style`, `perf`, `test`, `build`, `ci`, or `chore` for the corresponding work. Keep release commits exactly `chore(release): publish guide vX.Y.Z`; use `docs(changelog): link vX.Y.Z release commit` for the follow-up changelog link commit.
- Select the SemVer bump from the complete release scope before editing version markers. Use a `MAJOR` bump for breaking or incompatible changes, a `MINOR` bump for a new backward-compatible user-visible capability or substantial feature, and a `PATCH` bump for fixes, content or timing corrections, documentation, styling, refactors, and maintenance without a new capability. A large feature such as a new desktop mode must advance the minor version, for example `1.8.x` to `1.9.0`.
- Keep the selected version consistent across the changelog heading, `package.json`, both root version fields in `package-lock.json`, `src/main.js` (`BUILD`), and `sw.js` (`CACHE_VERSION`). Done when the commit subjects and version bump match the release scope.

## Workflow

1. Inspect `git status --short --branch`, the relevant files, and `package.json` before editing. Read `DESIGN.md` for visual or accessibility work and the relevant `README.md` section for user-facing behavior. Done when the affected files and verification command are clear.
2. Edit the source of truth: content and timing in `src/data.js` or `src/chant-guide.js`; readings in `src/furigana-corrections.js` and `furigana.js`; karaoke timing in `karaoke-sources.js`; app behavior in `src/main.js`; styles and icons in `src/*.css` and `src/ui/icons.js`; caching and packaging in `sw.js` and `vite.config.js`. Preserve the spoiler gate and the non-official status of reference setlist data. Done when the intended source files express the complete change.
3. Verify the result: run `npm run check:lyrics` for lyric or romaji changes, `npm run build` for application changes, and `git diff --check` for every text change. Inspect the final diff and status. Done when all applicable checks pass and only intentional files changed.

## Explicit release requests

When the user asks to publish, release, or deploy:

1. Inspect status, remotes, and the intended release branch; resolve release scope before staging. Done when unrelated work is excluded.
2. Update `CHANGELOG.md` from the complete release scope. Use Traditional Chinese, follow its existing version-commit boundary and link format, put the newest section at the top, and cover every user-visible change in the release. Resolve every song name through the Japanese original title in `src/data.js` (for example, `〈不可幸力〉` and `〈恋風邪にのせて〉`) before writing it. Attribute every user-visible bullet to its responsible PR with a linked `[PR #N]`. Add a separate thank-you bullet only for external contributors, linking their handle and PR; the owner's own PRs (`@watain666`) need only the change description and PR link. When an older PR is already covered by an existing version, add its linked attribution to that version section instead of creating a duplicate release entry. Done when every bullet is traceable to a linked PR, external contributor thanks use linked handles and PRs, the new section is complete, uses Japanese song titles, and contains no placeholder commit links.
3. Apply the SemVer bump selected above. Synchronize `package.json`, both root version fields in `package-lock.json`, `src/main.js` (`BUILD`), and `sw.js` (`CACHE_VERSION`). Done when every shipped version marker matches the selected release version.
4. Run `npm run build` and `git diff --check`. Done when both succeed.
5. Stage only the approved release files, create `chore(release): publish guide vX.Y.Z`, push to `origin/main`, and verify that branch contains the new full commit SHA. In this checkout, `origin` (`watain666/Vaundy-Taiwan-2026`) is the release repository; `upstream` (`limskyy123456-sudo/Vaundy-Seoul-2026`) is the source guide and is not a release target. If the changelog heading links to the release commit, fill in the final full SHA and amend the release commit before pushing. Done when the remote readback matches and the changelog has the final commit link; report the version, subject, and commit URL only then.
