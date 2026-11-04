/*
 * Official live videos, keyed by song id (see docs/adr/0006-live-video-timing.md).
 * Hand-written; joined to the song at build time by assembleCatalogue.
 *
 *   SongId: [
 *     {
 *       chantVersion: "jp",         // the chant version whose crowd this video shows: "jp" (日本版) or "kr" (韓國版)
 *       youtubeId: "11charVidId",   // the live video: 11 characters of A-Z a-z 0-9 _ -
 *       label: "HORO 首爾",         // short name shown on the switch
 *       times: [0, 12.4, ...],      // seconds in the LIVE video; one start time per lyric row
 *       singAlong: [20, 21, 22],    // optional: lyric row indices (0-based) where Vaundy hands the line
 *                                   // to the crowd in this live video; shown as 大合唱 應援 rows in live mode only
 *     },
 *   ]
 *
 * A song lists at most one video per chant version (build rule
 * live-timing-chant-version). A live video belongs to the chant version whose
 * crowd it shows: the HORO Seoul live is "kr" (the Korean crowd sings along a
 * lot), a Japanese show is "jp". In live mode the video of the current chant
 * version is used; a song with no video for that version plays another
 * version's video, and that video's times and singAlong apply as they are.
 *
 * `times` is parallel to the song's lyric rows in src/song-lyrics.js: same
 * length (cue-only rows included), strictly increasing, no negatives. A live
 * arrangement differs from the studio one, so these times replace the row
 * times in live mode; the studio per-word timing is never applied to a live
 * video. A mismatch fails the build (live-timing-* rules).
 *
 * `singAlong` lists row indices, each an integer in
 * [0, row count), strictly increasing (no duplicates). In live mode those rows
 * are treated as chant rows (the 大合唱 mic cue, chant-only practice), on top of
 * whatever the chant guide already marks; MV mode ignores them. A bad index
 * fails the build (live-timing-sing-along).
 *
 * Choosing the video: this guide serves the ASIA ARENA TOUR 2026 "HORO", so
 * within each chant version use an official full single-song upload from a
 * HORO show when one exists; otherwise use the most recent official full
 * single-song live. Replace the entry (and re-time it) when a HORO upload
 * appears later. No Shorts, medleys or digests.
 */
export const LIVE_TIMING = {
  // Vaundy ASIA ARENA TOUR 2026 "HORO" @ INSPIRE ARENA in SEOUL (official
  // upload). Aligned to the MV row times with chroma + MFCC DTW and per-row
  // onset cross-correlation: the live take keeps the studio arrangement and
  // tempo, a constant shift of -3.557 s. Sing-along rows need at least two
  // independent signs (weaker, wider lead vocal in the separated stem, and
  // video frames of the mic turned to the crowd).
  KaijuNoHanauta: [
    {
      chantVersion: "kr",
      youtubeId: "I3_jV2zO0l0",
      label: "HORO 首爾",
      times: [5.04, 8.14, 11.34, 17.74, 20.94, 24.14, 30.74, 33.84, 36.94, 38.94, 42.94, 43.94, 48.34, 55.44, 56.74, 61.04, 68.84, 72.14, 75.34, 78.44, 81.74, 84.94, 88.14, 89.94, 94.24, 95.14, 99.34, 106.74, 107.94, 112.24, 120.04, 123.24, 126.54, 133.14, 136.14, 139.34, 144.84, 146.34, 150.64, 157.74, 159.14, 163.44, 170.84, 172.04, 173.94, 175.14, 176.94, 178.34, 180.04, 184.74, 186.64, 187.94, 189.64, 191.14, 192.89, 196.94, 200.14, 203.34, 209.74, 212.94, 216.04],
      singAlong: [30, 31, 33, 34, 43, 45, 47, 49, 51, 53, 59],
    },
    // Vaundy DOME TOUR 2026 "SILENCE" at TOKYO DOME (official upload). Aligned
    // to the MV row times with chroma + MFCC DTW and per-row onset
    // cross-correlation: the live take keeps the studio arrangement and tempo,
    // a constant shift of -6.47 s. Sing-along rows use the same two-sign rule
    // as the Seoul entry.
    {
      chantVersion: "jp",
      youtubeId: "ci2lGX16f7Y",
      label: "SILENCE 東京巨蛋",
      times: [2.13, 5.23, 8.43, 14.83, 18.03, 21.23, 27.83, 30.93, 34.03, 36.03, 40.03, 41.03, 45.43, 52.53, 53.83, 58.13, 65.93, 69.23, 72.43, 75.53, 78.83, 82.03, 85.23, 87.03, 91.33, 92.23, 96.43, 103.83, 105.03, 109.33, 117.13, 120.33, 123.63, 130.23, 133.23, 136.43, 141.93, 143.43, 147.73, 154.83, 156.23, 160.53, 167.93, 169.13, 171.03, 172.23, 174.03, 175.43, 177.13, 181.83, 183.73, 185.03, 186.73, 188.23, 189.98, 194.03, 197.23, 200.43, 206.83, 210.03, 213.13],
      singAlong: [20, 21, 30, 31, 32, 34, 35, 43, 45, 47, 49, 51, 53, 59],
    },
  ],
  // Vaundy ASIA ARENA TOUR 2026 "HORO" @ INSPIRE ARENA in SEOUL (official
  // upload). Same method as above: studio arrangement and tempo, a constant
  // shift of -21.775 s against the MV; no drift.
  Shiwaawase: [
    {
      chantVersion: "kr",
      youtubeId: "NuPVr1BxqU8",
      label: "HORO 首爾",
      times: [14.03, 19.82, 26.02, 37.23, 40.62, 49.42, 61.42, 86.03, 92.03, 98.03, 109.33, 112.72, 121.53, 133.43, 145.82, 151.53, 154.53, 157.72, 163.53, 170.72, 182.82, 195.43, 201.32, 206.93, 214.12, 219.53, 225.03, 231.12, 236.93, 242.93, 248.82],
      singAlong: [15, 16, 17, 27, 28, 29, 30],
    },
  ],
};
