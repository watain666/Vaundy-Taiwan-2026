/*
 * Official live videos, keyed by song id (see docs/adr/0006-live-video-timing.md).
 * Hand-written; joined to the song at build time by assembleCatalogue.
 *
 *   SongId: {
 *     youtubeId: "11charVidId",   // the live video: 11 characters of A-Z a-z 0-9 _ -
 *     label: "Dome Tour 2026",    // short name shown on the switch
 *     times: [0, 12.4, ...],      // seconds in the LIVE video; one start time per lyric row
 *   }
 *
 * `times` is parallel to the song's lyric rows in src/song-lyrics.js: same
 * length (cue-only rows included), strictly increasing, no negatives. A live
 * arrangement differs from the studio one, so these times replace the row
 * times in live mode; the studio per-word timing is never applied to a live
 * video. A mismatch fails the build (live-timing-* rules).
 */
export const LIVE_TIMING = {};
