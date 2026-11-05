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
      singAlong: [30, 31, 32, 33, 34, 43, 45, 47, 49, 51, 53, 58, 59],
    },
    // Vaundy DOME TOUR 2026 "SILENCE" at TOKYO DOME (official upload). Aligned
    // to the MV row times with chroma + MFCC DTW and per-row onset
    // cross-correlation: the live take keeps the studio arrangement and tempo,
    // a constant shift of -6.47 s, except row 33, which the crowd starts after
    // Vaundy's spoken call-out. Sing-along rows use the same two-sign rule
    // as the Seoul entry.
    {
      chantVersion: "jp",
      youtubeId: "ci2lGX16f7Y",
      label: "SILENCE 東京巨蛋",
      times: [2.13, 5.23, 8.43, 14.83, 18.03, 21.23, 27.83, 30.93, 34.03, 36.03, 40.03, 41.03, 45.43, 52.53, 53.83, 58.13, 65.93, 69.23, 72.43, 75.53, 78.83, 82.03, 85.23, 87.03, 91.33, 92.23, 96.43, 103.83, 105.03, 109.33, 117.13, 120.33, 123.63, 131.38, 133.23, 136.43, 141.93, 143.43, 147.73, 154.83, 156.23, 160.53, 167.93, 169.13, 171.03, 172.23, 174.03, 175.43, 177.13, 181.83, 183.73, 185.03, 186.73, 188.23, 189.98, 194.03, 197.23, 200.43, 206.83, 210.03, 213.13],
      singAlong: [20, 21, 24, 30, 31, 32, 33, 34, 35, 43, 45, 47, 49, 51, 53, 58, 59],
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
      singAlong: [14, 15, 16, 17, 27, 28, 29, 30],
    },
  ],
  // 橫濱 Arena, 2023-12-01 (official upload): constant shift of +0.79 s against the MV.
  Backlight: [
    {
      chantVersion: "jp",
      youtubeId: "Cb451mDRWp4",
      label: "橫濱 Arena",
      times: [28.39, 34.89, 41.59, 43.09, 47.29, 54.09, 57.39, 60.09, 67.29, 70.69, 87.89, 94.69, 101.09, 107.79, 115.39, 121.99, 126.89, 133.59, 136.79, 139.59, 146.79, 150.19, 167.19, 173.39, 184.19, 194.19, 201.39, 204.69, 207.49, 214.69, 217.99],
    },
  ],
  // SILENCE 東京巨蛋 (official upload): constant shift of -2.21 s against the MV,
  // except rows 7 and 33, the crowd Hu-Hu-Hu-Hu, which start after the line before ends.
  CHAINSAWBLOOD: [
    {
      chantVersion: "jp",
      youtubeId: "ZtxQ3rxatzw",
      label: "SILENCE 東京巨蛋",
      times: [0, 16.99, 20.19, 23.49, 26.79, 30.29, 33.29, 36.9, 38.19, 41.39, 43.19, 46.29, 49.19, 52.59, 55.19, 55.99, 59.39, 62.29, 65.59, 66.79, 81.79, 86.19, 87.29, 88.09, 90.29, 92.19, 94.29, 95.29, 98.59, 101.79, 105.09, 108.79, 111.69, 115, 116.59, 119.69, 121.49, 124.69, 127.59, 130.89, 133.39, 134.49, 137.79, 140.59, 143.89, 147.59, 154.29, 160.44, 162.29, 165.49, 168.39, 171.69, 174.49, 175.39, 178.49, 181.49, 184.69],
    },
  ],
  // FUSION 埼玉 (official upload): constant shift of -8.63 s against the MV.
  Fujin: [
    {
      chantVersion: "jp",
      youtubeId: "4jkPGGRwvuc",
      label: "FUSION 埼玉",
      times: [4.67, 14.27, 21.27, 23.77, 27.67, 33.37, 37.67, 41.97, 46.87, 51.87, 57.07, 61.77, 83.17, 87.37, 92.97, 97.37, 102.17, 107.07, 112.47, 116.87, 121.17, 126.07, 131.07, 136.27, 140.97, 151.77, 156.77, 161.77, 166.57, 171.27, 175.57, 180.57, 185.67, 190.57, 195.37, 200.37, 205.47, 210.17],
    },
  ],
  // Museum Live (official upload): constant shift of +1.37 s against the MV.
  HadakaNoYusha: [
    {
      chantVersion: "jp",
      youtubeId: "YWXKuZ0Oy2M",
      label: "Museum Live",
      times: [1.97, 12.47, 18.47, 24.37, 35.77, 47.27, 60.87, 72.47, 83.27, 90.07, 95.07, 101.07, 106.37, 118.07, 130.37, 142.27, 153.57, 165.07, 177.07, 186.27, 195.17],
    },
  ],
  // HEADSHOT 幕張 (official upload): constant shift of -1.49 s against the MV.
  Homunculus: [
    {
      chantVersion: "jp",
      youtubeId: "Zo0LfdRwzjk",
      label: "HEADSHOT 幕張",
      times: [6.51, 25.51, 44.61, 50.51, 57.71, 60.81, 64.01, 67.01, 69.41, 70.01, 71.31, 76.31, 77.41, 83.51, 94.71, 97.81, 100.11, 103.91, 107.91, 111.01, 113.71, 117.21, 119.61, 120.21, 121.41, 126.61, 127.81, 145.21, 153.51, 159.51, 168.41, 177.81, 182.71, 185.11, 186.11, 188.31, 189.11, 191.21, 194.91, 197.61, 198.51, 200.81, 207.51, 226.01],
      singAlong: [1, 9, 11, 23, 25, 32, 34, 36, 38, 40, 43],
    },
  ],
  // little punk 東京 (official upload): constant shift of +0.53 s against the MV.
  HowdoIknow: [
    {
      chantVersion: "jp",
      youtubeId: "FFXSoSl_lGg",
      label: "little punk 東京",
      times: [28.33, 34.43, 43.23, 48.23, 59.03, 65.03, 75.53, 80.43, 87.33, 92.33, 102.43, 108.33, 114.23, 118.33, 123.03, 127.53, 136.23, 141.93, 149.53, 154.43, 161.43, 166.43, 186.23, 195.43, 200.03, 208.93, 213.83, 220.63, 225.73, 232.43, 237.53, 244.33, 249.43],
      singAlong: [29, 31],
    },
  ],
  // HEADSHOT 幕張 (official upload): constant shift of +1.69 s against the MV.
  Jonetsu: [
    {
      chantVersion: "jp",
      youtubeId: "9UnIdLcfeAw",
      label: "HEADSHOT 幕張",
      times: [1.69, 30.89, 38.19, 43.29, 50.69, 54.29, 57.99, 66.69, 70.39, 79.09, 81.99, 85.29, 91.29, 94.49, 97.59, 105.29, 112.49, 117.59, 121.99, 128.59, 133.99, 140.49, 144.79, 153.29, 157.09, 165.59, 168.79, 172.09, 177.89, 181.19, 184.29, 190.59, 195.89, 202.89, 205.99, 209.19, 215.09, 218.29, 221.49, 227.69],
    },
  ],
  // STUDIO LIVE (official upload): constant shift of -0.33 s against the MV.
  Kagero: [
    {
      chantVersion: "jp",
      youtubeId: "hS0lTGFKXpc",
      label: "STUDIO LIVE",
      times: [9.87, 16.67, 31.47, 38.37, 41.97, 49.77, 53.07, 60.57, 66.57, 72.27, 79.77, 85.77, 93.87, 100.77, 115.47, 122.37, 125.97, 133.77, 137.07, 144.57, 150.57, 156.27, 163.77, 169.77, 184.07, 188.97, 192.57, 196.17, 200.07, 204.27, 211.77, 217.77, 223.47, 230.97, 236.97],
    },
  ],
  // FUSION 埼玉 (official upload): constant shift of -16.16 s against the MV.
  KoikazeniNosete: [
    {
      chantVersion: "jp",
      youtubeId: "KwqzixPGDtg",
      label: "FUSION 埼玉",
      times: [2.84, 21.44, 26.34, 32.44, 37.74, 44.54, 52.74, 61.14, 69.04, 77.44, 90.84, 102.54, 107.54, 113.64, 118.94, 126.14, 134.14, 142.54, 150.24, 158.74, 167.54, 173.74, 177.74, 183.14, 193.14, 201.24, 209.64, 217.34, 225.84],
    },
  ],
  // FUSION 埼玉 (official upload): constant shift of -0.31 s against the MV.
  NakiJizo: [
    {
      chantVersion: "jp",
      youtubeId: "hJaEZb9nk08",
      label: "FUSION 埼玉",
      times: [0, 15.49, 19.39, 21.29, 23.39, 27.49, 29.39, 39.09, 42.39, 44.29, 48.29, 50.29, 52.39, 57.89, 59.99, 62.09, 64.09, 66.39, 70.29, 81.09, 84.29, 86.39, 90.39, 92.29, 94.49, 107.09, 114.99, 124.29, 126.39, 128.29, 132.29, 134.39, 136.39],
      singAlong: [28, 30, 31],
    },
  ],
  // London (official upload): constant shift of -4.18 s against the MV.
  Odoriko: [
    {
      chantVersion: "jp",
      youtubeId: "zqwk1ionxcA",
      label: "London",
      times: [0, 14.62, 20.52, 26.82, 32.52, 39.42, 45.42, 51.52, 57.72, 63.82, 75.82, 81.52, 87.92, 93.62, 100.42, 103.42, 107.92, 112.62, 118.72, 124.82, 131.02, 137.32, 164.82, 170.72, 176.82, 183.02, 189.02, 195.12, 201.42, 207.42, 213.92],
    },
  ],
  // London (official upload): constant shift of -7.01 s against the MV.
  replica: [
    {
      chantVersion: "jp",
      youtubeId: "IuNKUgRDTto",
      label: "London",
      times: [23.69, 25.79, 28.49, 33.89, 41.09, 42.89, 45.09, 49.79, 51.19, 53.17, 56.69, 57.89, 59.19, 64.39, 69.19, 70.59, 74.09, 83.59, 88.39, 89.89, 93.29, 96.99, 119.09, 121.19, 123.99, 128.69, 130.89, 132.89, 135.29, 136.54, 138.39, 140.29, 143.09, 147.79, 150.19, 152.09, 157.19, 162.09, 166.69, 172.29, 174.29, 179.69, 184.49, 185.79, 189.29, 198.79, 203.59, 205.09, 208.49, 212.19, 234.29, 236.49, 239.09, 246.19, 251.09, 256.49, 261.29, 262.59, 266.09, 275.69, 280.39, 281.89, 285.29, 288.99],
    },
  ],
  // London (official upload): constant shift of -5.69 s against the MV.
  SonnaBitternaHanashi: [
    {
      chantVersion: "jp",
      youtubeId: "-whYClibMks",
      label: "London",
      times: [13.91, 16.61, 19.41, 21.51, 27.31, 30.21, 35.31, 40.61, 45.91, 52.21, 56.91, 68.01, 73.41, 78.51, 89.51, 94.91, 100.51, 112.31, 114.41, 121.81, 124.51, 127.21, 132.41, 137.71, 142.91, 149.31, 154.01, 165.01, 170.41, 175.61, 199.51, 203.41, 210.21, 214.31, 218.71, 229.81, 235.11, 240.31, 251.31, 256.71, 262.21],
    },
  ],
  // 東京, replica tour 2023-03-26 (official upload): constant shift of -1.04 s against the MV.
  soramimi: [
    {
      chantVersion: "jp",
      youtubeId: "Q8AnlRrhQSE",
      label: "東京 2023",
      times: [0, 15.96, 19.66, 23.46, 24.86, 27.06, 38.16, 41.76, 45.56, 47.06, 49.16, 52.86, 56.66, 60.26, 64.06, 69.26, 93.56, 97.16, 100.96, 102.36, 104.56, 115.66, 119.36, 123.06, 126.96, 130.46, 134.16, 137.76, 141.56, 146.76],
    },
  ],
  // HEADSHOT 幕張 (official upload): constant shift of -0.47 s against the MV.
  Timeparadox: [
    {
      chantVersion: "jp",
      youtubeId: "81yR76QH4zI",
      label: "HEADSHOT 幕張",
      times: [11.03, 24.53, 31.23, 35.73, 43.13, 47.93, 56.43, 59.23, 66.53, 70.83, 78.13, 83.03, 88.63, 94.83, 103.03, 105.63, 113.33, 117.63, 125.03, 130.03, 135.73, 141.33, 147.33, 155.53, 158.23, 166.03, 170.33, 177.93, 182.03, 188.43],
    },
  ],
  // little punk 東京 (official upload): constant shift of -0.73 s against the MV.
  Tokimeki: [
    {
      chantVersion: "jp",
      youtubeId: "mZMJyNyWRk0",
      label: "little punk 東京",
      times: [0.27, 8.57, 16.47, 21.47, 24.37, 28.47, 32.17, 34.27, 37.27, 38.87, 42.97, 48.07, 50.57, 53.27, 54.87, 58.97, 61.97, 72.47, 80.37, 88.37, 93.67, 96.37, 100.27, 104.07, 106.57, 109.27, 110.97, 114.87, 120.07, 122.57, 125.27, 126.77, 130.97, 133.87, 136.57, 144.37, 152.27, 156.37, 158.77, 160.37, 162.37, 165.27, 166.87, 170.97, 175.97, 178.37, 181.27, 182.87, 186.87, 189.87],
      singAlong: [8, 13, 33, 41],
    },
  ],
  // SILENCE 東京巨蛋 (official upload): constant shift of -0.82 s against the MV,
  // except the unaccompanied opening line, sung from 0.4 s, and row 48, which the
  // crowd starts about 1.3 s later.
  Yobigoe: [
    {
      chantVersion: "jp",
      youtubeId: "wfMv9s7BGm4",
      label: "SILENCE 東京巨蛋",
      times: [0.4, 7.88, 11.98, 16.08, 23.88, 27.98, 31.98, 35.48, 39.88, 43.78, 48.48, 49.58, 51.88, 57.68, 62.88, 63.68, 65.88, 71.68, 76.88, 84.18, 90.38, 97.98, 101.88, 106.18, 113.88, 117.98, 122.38, 126.68, 130.38, 132.18, 135.48, 138.38, 139.68, 141.88, 147.68, 152.88, 165.98, 169.88, 174.18, 177.88, 179.38, 183.68, 185.88, 191.68, 196.48, 199.98, 205.68, 210.88, 212.5, 217.68],
      singAlong: [6, 18, 36, 41, 42],
    },
  ],
};
