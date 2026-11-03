# The lyric list is rendered by one lyric view and mounted twice

The Document PiP window used to show lyrics by cloning the song page's `#lyrics-list` DOM and keeping the copy in sync with a MutationObserver, a version counter, a list cache and the current row's HTML serialized on every tick, so PiP showed whatever the song page DOM happened to be at clone time, and eight of its thirteen commits were fixes for that copy. We moved every piece of lyric-row DOM knowledge into one module, `src/lyric-view/`: a pure `renderLyricRows(song, { readingMode, chantVersion, interactive })` that runs in node, and `createLyricMount(container, options)` whose `render`, `setPlayhead`, `setBeat` and `destroy` are the only way to change the rows. The song page and the PiP window each create a mount on their own container and get the same values (song, view options, playhead, container settings); a reading mode or chant version switch, karaoke timing and the karaoke allocator all call `render` again instead of patching the rows.

## Considered Options

- **Keep the clone and also sync attribute changes into PiP.** Rejected: PiP would still depend on the song page DOM rather than on the song and the settings, the observer, version counter and per-tick HTML would stay, and the partial repaint paths would keep producing rows that differ from a fresh render.
- **Give PiP its own independent renderer.** Rejected: two renderers of the same rows drift apart, which is the problem the clone was meant to avoid; a pure core with two mounts gives one implementation and lets each window keep its own scrolling, sizing and in-view state.

## Consequences

- The rows can be rendered and golden-tested in node for every song, reading mode and chant version (`tests/lyric-view.render.test.ts`), and the mounted DOM and playhead behaviour are tested under jsdom (`tests/lyric-view.mount.test.ts`).
- The view reads chant cues only from `line.chant` and the line's segments, through the shared chant rules in `src/chant/` that the page also uses; `Song.chant.hasGuide` tells it whether the Japanese version follows the chant guide. The chant guide, the reading tables and the page script are never imported by the view.
- The differences between the two windows are mount options: song page rows are buttons (click to seek stays a delegated listener in `src/main.js`), the current line is centred and auto-scroll can be turned off; PiP rows are divs, the current line is pinned near the top and the list always follows playback.
- The only intended behaviour changes: a switched reading mode or chant version now equals a fresh render on both windows, PiP clears the previous line's karaoke highlight, PiP plays icon animations by its own visible range, and PiP no longer opens with the song page's transient row classes.
- Removing the post-load re-patch of backing-chant rows moves two whitespace-only text nodes around `.lyric-bg` for one song (`IdeagaAfureteNemurenai`) in the Japanese chant version; this was verified to have no visual effect.
