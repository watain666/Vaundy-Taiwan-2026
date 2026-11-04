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
export const LIVE_TIMING = {
  // Vaundy Dome Tour 2026 (official upload). Aligned to the MV row times with
  // chroma + MFCC DTW and per-row onset cross-correlation: the live take keeps
  // the studio arrangement and tempo, a constant shift of -6.47 s.
  KaijuNoHanauta: {
    youtubeId: "ci2lGX16f7Y",
    label: "Dome Tour 2026",
    times: [2.13, 5.23, 8.43, 14.83, 18.03, 21.23, 27.83, 30.93, 34.03, 36.03, 40.03, 41.03, 45.43, 52.53, 53.83, 58.13, 65.93, 69.23, 72.43, 75.53, 78.83, 82.03, 85.23, 87.03, 91.33, 92.23, 96.43, 103.83, 105.03, 109.33, 117.13, 120.33, 123.63, 130.23, 133.23, 136.43, 141.93, 143.43, 147.73, 154.83, 156.23, 160.53, 167.93, 169.13, 171.03, 172.23, 174.03, 175.43, 177.13, 181.83, 183.73, 185.03, 186.73, 188.23, 189.98, 194.03, 197.23, 200.43, 206.83, 210.03, 213.13],
  },
};
