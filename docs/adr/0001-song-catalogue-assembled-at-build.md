# Songs are assembled and validated at build time by a pure catalogue core

A song is joined from six authoring files by four different keys (song id, lyric line time, full line text, line index); that join used to happen in the browser in `src/main.js`, with two hand-run scripts checking only a few of its invariants. We moved the join into one pure function, `assembleCatalogue` in `src/catalogue/assemble.ts`, which the Vite plugin runs at build time and the tests run on fixtures and real data, so the page reads songs only through `list()`, `get(id)` and `load(id)` and gets lines with readings, romaji and chant cues already attached. A violated invariant fails `npm run build` and names the song, line and rule; the authoring files keep their formats, and only the derived marks table was removed.

## Considered Options

- **Keep the runtime join in the browser and add tests around it.** Rejected: the join logic would stay spread across `main.js`, the lazy loader and the check scripts, every page load would keep downloading all 36 songs' readings, and errors would still surface only when someone opened the affected song.
- **Generate the assembled songs into committed files.** Rejected: committed generated files drift from their sources and double every data diff in review. The plugin serves them as virtual modules instead, and the golden snapshot (`tests/__snapshots__/song-catalogue.golden.txt`) is the only committed derived file, kept small enough to read in a PR diff.

## Consequences

- Each song is its own chunk, so the service worker precache (which lists every built JS asset) covers songs automatically.
- Chant times match lyric times by hundredth-second buckets (`Math.round(seconds * 100)`); retiming a lyric line without its chant times is a build error rather than a silently lost chant mark.
- The page no longer derives chant cues itself: whether a line is a chant line or has a chant cue, its backing chants, the chant blocks for chant-only playback and the song list marks all come from `line.chant` and `marks` through `src/chant/`, which the lyric view uses too. Before the page moved onto it, its old rules were checked against this module on every song and chant version with no difference.
