# An official live video carries its own lyric row times

Fans asked to watch official live performances instead of the MV. A live arrangement does not follow the studio timing: rows start earlier or later, and the per-word timing of ADR 0005 (converted to the MV's clock) would drift against it. We now keep an optional `src/live-timing.js`, keyed by song id, with `{ youtubeId, label, times }` where `times[i]` is lyric row `i`'s start in the live video. `assembleCatalogue` attaches it as `song.live` (the summary keeps only `youtubeId` and `label`, so the list and the switch know a live video exists without loading the song) and five build rules, `live-timing-unknown-song`, `live-timing-youtube-id`, `live-timing-label`, `live-timing-row-count` and `live-timing-order`, fail the build and name the song and row. The page stores the viewer's choice globally as `horo-video-source` (`mv` or `live`) and picks the video through `activeVideoId`, which falls back to the MV for a song without a live video. In live mode `liveKaraokeTiming` builds the aligned timing the page already understands: each row starts at its live time and ends at the next row's start, with `granularity: "line"` and no words. The lyric view, tap-to-seek, chant-only practice and the Document PiP therefore use live times without changing, and karaoke falls back to its line-proportional allocation inside each row.

## Addendum: crowd sing-along marks

A live entry may carry `singAlong: number[]`, the lyric row indices where Vaundy hands the line to the audience in that video. `assembleCatalogue` copies it to `song.live.singAlong` (default `[]`, not in the summary) and the build rule `live-timing-sing-along` fails on a non-integer, an out-of-range row, or a duplicate or unsorted index, naming the song and the offending position. The page passes the rows to the lyric view only while live mode is active (`LyricViewOptions.singAlong`), so the song page and the Document PiP mount render a `現場大合唱` text label and a thin left rule on those rows; MV mode and songs without marks produce the same markup as before. It is deliberately not the chant-guide visual: the 日本版/韓國版 marks are fan guidance in orange, while this records what happened in that video and uses the neutral accent colour and a text label.

## Considered Options

- **Shift the studio row times by one offset per video.** Rejected: a live arrangement changes row order gaps, not just the start, so a single offset is wrong for most rows.
- **Add live word timing too.** Deferred: there is no vetted source, and the studio word timing must never be applied to the live clock. Line timing is enough to keep the current line and chant cues correct.

## Consequences

- `times` is parallel to the lyric rows, cue-only rows included; adding or removing a lyric row without updating the live times is a build error (`live-timing-row-count`).
- Chant cues stay attached to rows, so chant blocks follow the live times automatically.
- MV mode, and every song without a live entry, renders exactly as before; the lyric-view golden hashes do not change.
- `src/live-timing.js` is hand-written. The song catalogue golden snapshot does not record live entries; the `live-timing-*` build rules and `tests/assemble.test.ts` guard them instead.
