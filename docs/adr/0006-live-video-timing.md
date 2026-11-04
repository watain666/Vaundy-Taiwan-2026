# An official live video carries its own lyric row times

Fans asked to watch official live performances instead of the MV. A live arrangement does not follow the studio timing: rows start earlier or later, and the per-word timing of ADR 0005 (converted to the MV's clock) would drift against it. We now keep an optional `src/live-timing.js`, keyed by song id, with `{ youtubeId, label, times }` where `times[i]` is lyric row `i`'s start in the live video. `assembleCatalogue` attaches it as `song.live` (the summary keeps only `youtubeId` and `label`, so the list and the switch know a live video exists without loading the song) and five build rules, `live-timing-unknown-song`, `live-timing-youtube-id`, `live-timing-label`, `live-timing-row-count` and `live-timing-order`, fail the build and name the song and row. A settings switch, `horo-prefer-live` (default on), makes songs with a live video open in live mode; an inline MV / live toggle under the video overrides it for the current song only and is not persisted. `resolveVideoSource` combines the setting, that per-song override and whether the song has a live video, and `activeVideoId` picks the video, falling back to the MV for a song without one. In live mode `liveKaraokeTiming` builds the aligned timing the page already understands: each row starts at its live time and ends at the next row's start, with `granularity: "line"` and no words. The lyric view, tap-to-seek, chant-only practice and the Document PiP therefore use live times without changing, and karaoke falls back to its line-proportional allocation inside each row.

## Addendum: crowd sing-along marks

A live entry may carry `singAlong: number[]`, the lyric row indices where Vaundy hands the line to the audience in that video. `assembleCatalogue` copies it to `song.live.singAlong` (default `[]`, not in the summary) and the build rule `live-timing-sing-along` fails on a non-integer, an out-of-range row, or a duplicate or unsorted index, naming the song and the offending position. In live mode the page hands the lyric view, chant-only practice and the Document PiP a song whose listed rows also carry a chant cue (`withSingAlongChant` in `src/chant/`, applied by `viewSong` in `src/main.js`), so those rows render as 大合唱 應援 rows (orange styling, mic icon) and join the chant blocks like any chant-guide row. A row the current chant version already marks keeps its own cue, segments included. The derived song is memoized per song, and MV mode and songs without marks get the original song object, so their markup is unchanged. An earlier version of this addendum drew a separate `現場大合唱` pill and a left rule; the owner preferred one visual language, so that markup and its CSS were removed.

## Considered Options

- **Shift the studio row times by one offset per video.** Rejected: a live arrangement changes row order gaps, not just the start, so a single offset is wrong for most rows.
- **Add live word timing too.** Deferred: there is no vetted source, and the studio word timing must never be applied to the live clock. Line timing is enough to keep the current line and chant cues correct.

## Consequences

- `times` is parallel to the lyric rows, cue-only rows included; adding or removing a lyric row without updating the live times is a build error (`live-timing-row-count`).
- Chant cues stay attached to rows, so chant blocks follow the live times automatically.
- MV mode, and every song without a live entry, renders exactly as before; the lyric-view golden hashes do not change.
- `src/live-timing.js` is hand-written. The song catalogue golden snapshot does not record live entries; the `live-timing-*` build rules and `tests/assemble.test.ts` guard them instead.
