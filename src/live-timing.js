/*
 * Official live videos, keyed by song id (see docs/adr/0006-live-video-timing.md).
 * Hand-written; joined to the song at build time by assembleCatalogue.
 *
 *   SongId: {
 *     youtubeId: "11charVidId",   // the live video: 11 characters of A-Z a-z 0-9 _ -
 *     label: "HORO 首爾",         // short name shown on the switch
 *     times: [0, 12.4, ...],      // seconds in the LIVE video; one start time per lyric row
 *     singAlong: [20, 21, 22],    // optional: lyric row indices (0-based) where Vaundy hands the line
 *                                 // to the crowd in this live video; shown as 現場大合唱 in live mode only
 *   }
 *
 * `times` is parallel to the song's lyric rows in src/song-lyrics.js: same
 * length (cue-only rows included), strictly increasing, no negatives. A live
 * arrangement differs from the studio one, so these times replace the row
 * times in live mode; the studio per-word timing is never applied to a live
 * video. A mismatch fails the build (live-timing-* rules).
 *
 * `singAlong` lists row indices, each an integer in
 * [0, row count), strictly increasing (no duplicates). It records what happened
 * in this video, so it is independent of the chant-guide fan guidance. A bad
 * index fails the build (live-timing-sing-along).
 *
 * Choosing the video: this guide serves the ASIA ARENA TOUR 2026 "HORO", so
 * use an official full single-song upload from a HORO show when one exists;
 * otherwise use the most recent official full single-song live. Replace the
 * entry (and re-time it) when a HORO upload appears later. No Shorts, medleys
 * or digests.
 */
export const LIVE_TIMING = {
  // Vaundy ASIA ARENA TOUR 2026 "HORO" @ INSPIRE ARENA in SEOUL (official
  // upload). Aligned to the MV row times with chroma + MFCC DTW and per-row
  // onset cross-correlation: the live take keeps the studio arrangement and
  // tempo, a constant shift of -3.557 s. Sing-along rows need at least two
  // independent signs (weaker, wider lead vocal in the separated stem, and
  // video frames of the mic turned to the crowd).
  KaijuNoHanauta: {
    youtubeId: "I3_jV2zO0l0",
    label: "HORO 首爾",
    times: [5.04, 8.14, 11.34, 17.74, 20.94, 24.14, 30.74, 33.84, 36.94, 38.94, 42.94, 43.94, 48.34, 55.44, 56.74, 61.04, 68.84, 72.14, 75.34, 78.44, 81.74, 84.94, 88.14, 89.94, 94.24, 95.14, 99.34, 106.74, 107.94, 112.24, 120.04, 123.24, 126.54, 133.14, 136.14, 139.34, 144.84, 146.34, 150.64, 157.74, 159.14, 163.44, 170.84, 172.04, 173.94, 175.14, 176.94, 178.34, 180.04, 184.74, 186.64, 187.94, 189.64, 191.14, 192.89, 196.94, 200.14, 203.34, 209.74, 212.94, 216.04],
    singAlong: [30, 31, 33, 34, 43, 45, 47, 49, 51, 53, 59],
  },
};
