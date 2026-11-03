#!/usr/bin/env node
/*
 * Generates src/word-timing.js: per-word karaoke timing for every song, in the
 * song VIDEO's clock (seconds), aligned onto the rows of src/song-lyrics.js.
 *
 * Provenance
 * ----------
 * - Word timing comes from one provider payload per song, chosen by the
 *   karaoke inventory (2026-11, reports/karaoke-inventory/providers.md; the
 *   second batch of 32 songs, SONGS index 39-70, in its last section):
 *   KuGou KRC for most songs, NetEase YRC for SonnaBitternaHanashi,
 *   Hitomibore and mabataki. Each payload is the provider's own timeline
 *   ("provider clock"). pained only has line-level LRCLIB timing and is
 *   left out. Raw payloads are not committed; the normalised candidates
 *   (`<candidatesDir>/<songId>.json`, format timed-lyrics-v1) are the input.
 * - The studio-to-video offset of each song comes from audio
 *   cross-correlation of the YouTube Music Art Track against the song video
 *   (`<offsetsFile>`, reports/karaoke-inventory/av-offsets.md):
 *   videoTime = studioTime + offset.
 * - The provider clock was then checked per song against the video audio:
 *   vocal onsets and vocal energy in a demucs-separated vocal track, plus
 *   second providers' line starts (reports/karaoke-inventory/word-timing.md).
 *   PROVIDER_CLOCK below records the outcome: which Art Track the provider's
 *   clock follows and the extra correction `delta` (applied only when the
 *   measured shift exceeds 0.1 s). Songs whose clock could not be
 *   established within about 0.1 s are in EXCLUDED.
 * - An independent audit (reports/karaoke-inventory/audit-shifts.md) then
 *   compared line starts with the vocal onset after silence. LINE_ONSET_SHIFT
 *   adds a whole-song shift where that bias exceeds 0.1 s, so
 *   offset = studio offset + delta + shift.
 * - Rows where the separated vocal is silent at the provider's first word
 *   (local provider errors) are listed in AUDIO_REJECTED and get no words;
 *   ROW_OVERRIDES holds the audited per-row fixes.
 *
 * Per-song clock (offset = studio offset + delta + line-start shift, seconds;
 * provider ids in the output):
 *  Tokimeki +0.376, KaijuNoHanauta +8.010 (+8.0000+0.12-0.11),
 *  CHAINSAWBLOOD +4.043 (+4.1932-0.15), KoikazeniNosete +16.162,
 *  Odoriko +6.736, HadakaNoYusha -0.112, Fukakouryoku -0.750 (-0.5500-0.20),
 *  Reunion +21.064, hanaurana +0.576, Yobigoe +0.110 (+0.0000+0.11),
 *  HowdoIknow +0.021, Shiwaawase +22.679 (+22.8788-0.20), Homunculus +2.334,
 *  soramimi -0.117 (+0.0334-0.15), NakiJizo -0.139 (+0.0214-0.16),
 *  napori -0.110 (+0.0000-0.11), Backlight -0.210 (+0.0000-0.21),
 *  NEOJAPAN -0.230 (+0.0000-0.23), ZuttoLoveSong +0.041, Iseijin +1.808,
 *  ZERO +1.766 (+0.4761+1.29), SonnaBitternaHanashi +7.047,
 *  Fujin +8.673 (+8.1828+0.49), Jonetsu -0.270 (+0.0000-0.10-0.17),
 *  Kagero -0.119 (+0.0405-0.16), IdeagaAfureteNemurenai +9.510,
 *  flyaway -0.110 (+0.0000-0.11), mabuta -0.140 (+0.0404-0.18),
 *  Hitomibore +0.334, SekainoHimitsu +13.640,
 *  Wasuremono +1.641 (+1.7912-0.15), Timeparadox +0.631 (+0.7507-0.12),
 *  TodomenoIchigeki +5.212, Kimagure +0.000,
 *  KokyuNoYouni +0.260 (+0.5000-0.24), mabataki +0.124,
 *  TokyoFlash -0.277 (+0.0333-0.31),
 *  Tobouyo -0.290 (+0.0000-0.29), TheSILENCE +46.025 (+46.1550-0.13),
 *  Singularity +0.000, MixedNuts +0.000,
 *  HashireSAKAMOTO -0.450 (-0.0001-0.45),
 *  SomebodyHelpUs +0.580 (+0.0000+0.58), GORILLAShibai +0.310, Gift +5.963,
 *  KokoroArigatou +0.000, Bidenkyu -0.120 (+0.0000-0.12),
 *  Carnival +0.469 (+0.6395-0.17), OneLiter +0.391 (+0.5213-0.13),
 *  Miyako -0.140 (+0.0000-0.14), Hokuro -0.170 (+0.0000-0.17),
 *  replica +10.198, YukaiSink +28.518, benefits +35.418 (+35.5580-0.14),
 *  Somato +18.116 (+18.2061-0.23+0.14), Okitegami +9.030,
 *  Futaribanashi +0.000, HERO +5.051 (+5.2605-0.21), Omokage +0.000,
 *  Chikyugi +0.363, lifehack +0.086 (+0.2860-0.20),
 *  BokuwaKyomo -0.207 (+0.0333-0.24), Byebyme +1.034,
 *  Zenzenzense -0.150 (+0.0000-0.15)
 * SekainoHimitsu follows the "replica" Art Track c1x9eS-nIkI (+13.6398).
 * Excluded: pained (line-level only), Tomoshibi (live video), KonnaToki and
 * pain (no provider; 15 pain rows take their vocal onset from
 * ONSET_ROW_TIMES), WasureruMaeni and MajideSayonaraBaby (NetEase LRC line-
 * level only; their rows follow LINE_LEVEL_CLOCK). Missing is bundled at
 * -0.120 (line-start shift); TokyoFlash at -0.277 (clock anchored by ear, see
 * PROVIDER_CLOCK). pained keeps no words, but its 46 row times come from
 * LINE_LEVEL_CLOCK: round(LRCLIB 22935081 line start + 45.3175, 0.1), the Art
 * Track offset, verified by a vocal-onset scan of the LRCLIB line starts
 * (+0.085 s, within 0.1 s) and NetEase LRC 2714023589 (same line starts).
 *
 * Row times and words
 * -------------------
 * With --retime the script also rewrites the `time:` numbers of
 * src/song-lyrics.js (and moves chantTimes / chantSegments[].time in
 * src/chant-guide.js with their rows): a row with words gets its first word's
 * start rounded to 0.1 s, or the ROW_OVERRIDES start; LINE_LEVEL_CLOCK songs
 * get their line clock; other rows keep their time. Without --retime it fails
 * if any row time differs from that plan, so a plain run checks the files.
 * Every word ends by min(next row's time, start + 3 s); a word the provider
 * starts after the next row's time is pinned there with zero length.
 *
 * Alignment
 * ---------
 * The provider character stream (whole song) is aligned to the stream of our
 * row characters (icon tokens and whitespace removed, punctuation not used
 * for matching) with one monotonic weighted LCS, so repeated choruses map to
 * the right take; a match far from the row's own time is down-weighted.
 * Characters compare after NFKC, lower-casing, katakana -> hiragana and
 * digit -> kanji numeral. Each matched character inherits its provider
 * character's time (a provider word's span split evenly over its
 * characters); unmatched characters inside a matched run take the times of
 * the provider characters they replace, or share a neighbour's. A row's words
 * follow the provider word boundaries and our whitespace. A row gets an entry
 * only when at least 70% of its sung characters matched directly and its
 * first word lies within 8 s of the row's own time.
 *
 * Rerun
 * -----
 *   node scripts/word-timing/build-word-timing.mjs <candidatesDir> <offsetsFile> \
 *     [--retime] [--out src/word-timing.js] [--report <report.json>]
 *
 * The candidates and offsets were produced under /tmp/karaoke-inventory and
 * /tmp/av-offset by the inventory scripts (not committed); the same files
 * reproduce the committed output byte for byte. Entries are keyed by the row
 * times, so rerun with --retime after any lyric text edit. Repeated-take
 * choice uses the row times as a prior, so a full regeneration starts from
 * the authored times (src/song-lyrics.js and src/chant-guide.js as on main)
 * and runs --retime once; a second plain run must then succeed unchanged.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/* Which Art Track the provider clock follows (null = the primary one in the
   offsets file) and the remaining correction in seconds. Filled from the
   clock check; see the report for the evidence per song. */
const PROVIDER_CLOCK = {
  Fujin: { studio: null, delta: 0.49 },
  Fukakouryoku: { studio: null, delta: -0.2 },
  Jonetsu: { studio: null, delta: -0.1 },
  KaijuNoHanauta: { studio: null, delta: 0.12 },
  KokyuNoYouni: { studio: null, delta: -0.24 },
  SekainoHimitsu: { studio: "c1x9eS-nIkI", delta: 0 },
  Shiwaawase: { studio: null, delta: -0.2 },
  Timeparadox: { studio: null, delta: -0.12 },
  Yobigoe: { studio: null, delta: 0.11 },
  ZERO: { studio: null, delta: 1.29 },
  mabuta: { studio: null, delta: -0.18 },
  /* second batch (2026-11, songs 40-71) */
  Tobouyo: { studio: null, delta: -0.29 },
  TheSILENCE: { studio: null, delta: -0.13 },
  HashireSAKAMOTO: { studio: null, delta: -0.45 },
  SomebodyHelpUs: { studio: null, delta: 0.58 },
  Bidenkyu: { studio: null, delta: -0.12 },
  Carnival: { studio: null, delta: -0.17 },
  OneLiter: { studio: null, delta: -0.13 },
  Miyako: { studio: null, delta: -0.14 },
  Hokuro: { studio: null, delta: -0.17 },
  benefits: { studio: null, delta: -0.14 },
  Somato: { studio: null, delta: -0.23 },
  BokuwaKyomo: { studio: null, delta: -0.24 },
  Zenzenzense: { studio: null, delta: -0.15 },
  /* ambiguous ±1.3 s (two beats) resolved by a human listening anchor: first
     line ≈22.6 s in the video (user, 2026-11-03). Within ±0.1 s of that peak
     the word-onset scan peaks at -0.305 (z 4.1) and the line-start scan at
     -0.31; the first line then starts at 22.56 s, line-start bias +0.09 (n 7). */
  TokyoFlash: { studio: null, delta: -0.31 },
};

/* Line-start bias: median of (provider line start in the video clock - the
   vocal onset after silence) over the lines with exactly one clear onset in
   the separated vocal track (bias2.py in the report). Applied as an extra
   whole-song shift where |median| > 0.1 s with n >= 6 and MAD <= 0.12 s, so
   row times land on the first sung sound. offset = studio + delta + shift. */
const LINE_ONSET_SHIFT = {
  NEOJAPAN: { shift: -0.23, median: 0.227, n: 28, mad: 0.113 },
  Backlight: { shift: -0.21, median: 0.205, n: 13, mad: 0.105 },
  Jonetsu: { shift: -0.17, median: 0.172, n: 13, mad: 0.054 },
  Kagero: { shift: -0.16, median: 0.155, n: 11, mad: 0.025 },
  NakiJizo: { shift: -0.16, median: 0.156, n: 6, mad: 0.063 },
  CHAINSAWBLOOD: { shift: -0.15, median: 0.149, n: 6, mad: 0.093 },
  Wasuremono: { shift: -0.15, median: 0.147, n: 8, mad: 0.098 },
  soramimi: { shift: -0.15, median: 0.152, n: 7, mad: 0.045 },
  KaijuNoHanauta: { shift: -0.11, median: 0.113, n: 14, mad: 0.096 },
  napori: { shift: -0.11, median: 0.113, n: 11, mad: 0.087 },
  flyaway: { shift: -0.11, median: 0.112, n: 6, mad: 0.035 },
  /* second batch */
  HERO: { shift: -0.21, median: 0.214, n: 6, mad: 0.044 },
  lifehack: { shift: -0.2, median: 0.203, n: 9, mad: 0.048 },
  Somato: { shift: 0.14, median: -0.138, n: 16, mad: 0.068 },
  Missing: { shift: -0.12, median: 0.115, n: 14, mad: 0.096 },
};

/* Per-row fixes from the independent audit (reports/karaoke-inventory/
   audit-shifts.md), each confirmed against the separated vocal track. Keyed
   by row index in src/song-lyrics.js; `text` guards against a moved row.
   - start: move the row's words so the first word starts here; row time = start.
   - lead: the provider lacks the row's first sung chars; give them their own
     word from `start` to the next provider word.
   - drop: no words for the row; row time = `time`. */
const ROW_OVERRIDES = {
  KaijuNoHanauta: {
    36: { text: "ねぇ、もっと", start: 148.4, why: "silence 148.0-148.25, onset 148.3-148.35 (provider 148.67)" },
    48: { text: "そんな日々でいたいのにな 懲りずに", start: 183.6, why: "unvoiced s 183.6-183.75 before the vowel at 183.8" },
    54: { text: "そんな夜に歌う 怪獣の歌", start: 196.45, why: "unvoiced s 196.4-196.55 before the vowel at 196.6" },
  },
  Backlight: {
    13: { text: "焼き付ける光を背に受ける 「赤」に気を取られている", start: 107.0, why: "own silence check after the line-start shift: vocal silent 106.3-106.96, onset 106.99" },
  },
  CHAINSAWBLOOD: {
    47: { text: "CHAINSAW BLOOD", start: 162.65, why: "silence to 162.35, ch 162.4-162.75, vowel 162.8; LRCLIB 162.74-162.77, NetEase 162.59" },
  },
  hanaurana: {
    19: { text: "しよう", start: 72.85, why: "unvoiced sh 72.85-72.95 after the previous vowel, vowel 73.0; NetEase 73.09" },
  },
  NEOJAPAN: {
    11: { text: "Ohふらりふらり 僕らは集うNEO JAPAN", lead: { text: "Oh", start: 83.91 }, why: "KRC has no \"Oh\"; silence to 83.86, voiced Oh from 83.91 (LRCLIB 83.91)" },
  },
  TodomenoIchigeki: {
    27: { text: "だから", drop: "vocal silent 157.9-158.3 after the provider's first word (157.94); onset 158.4", time: 158.4 },
  },
  Miyako: {
    6: { text: "運べてたのだろうか", drop: "the provider squeezes these words into the silence 50.6-53.1 s", time: 53.1, why: "silence 50.62-53.05, onset 53.10; NetEase has the line at 52.92" },
  },
  Missing: {
    1: { text: "夜の合図が", start: 20.1, why: "silence 19.45-20.05 after the provider's first word, onset 20.10" },
    4: { text: "僕らの唄 口ずさめば", start: 34.88, why: "silence 34.2-34.8 after the provider's first word, onset 34.88" },
    13: { text: "誠実なら", start: 64.45, why: "silence 63.7-64.4 after the provider's first word, onset 64.45" },
    16: { text: "僕らの唄 口ずさめば", start: 78.94, why: "silence 78.3-78.85 after the provider's first word, onset 78.94" },
  },
  /* audit of the 32 new songs (reports/karaoke-inventory/audit-new-songs.md), each confirmed on the vocal track */
  Hokuro: { 16: { text: "みたいにしようよ", start: 71.7, why: "dip 71.50-71.65, voiced 71.70; the provider's み (72.28) sits on the た closure 72.20-72.30" } },
  Okitegami: {
    8: { text: "別になかったさ", start: 45.83, why: "silence 45.5-45.8 after the provider's first word, onset 45.83" },
    40: { text: "明日までに唱えきるよ", start: 183.95, why: "the provider's 明 is zero-length at 184.40 (the た of 唱えきる); voiced あ from about 183.9 (NetEase 183.82)" },
  },
  Chikyugi: { 28: { text: "回る未来の地図を蹴り飛ばして", start: 184.0, why: "YRC compresses 回る into 185.12-186.14; voiced, louder from 184.05 (LRCLIB 183.97/184.03)" } },
  GORILLAShibai: { 43: { text: "GORILLA芝居", start: 142.65, why: "g closure 142.60-142.65, burst 142.70; sh of 芝 at 143.20 (provider 芝 143.67 is late)" } },
  HashireSAKAMOTO: {
    18: { text: "SAKAMOTO DAYS", start: 100.45, why: "unvoiced s 100.45-100.60, k 100.70-100.80 (provider 100.88)" },
    48: { text: "SAKAMOTO DAYS", start: 200.9, why: "unvoiced s 200.90-201.00, k 201.10-201.15 (provider 201.3)" },
  },
  replica: { 29: { text: "ここは", start: 143.55, why: "first k after the dip 143.40-143.55, second k 143.95-144.15 (YRC こ 144.08 is the second)" } },
  benefits: { 32: { text: "Hey Throw it away and break it all up", start: 226.8, why: "silence 226.55-226.75, h at 226.80 (KRC Hey 227.05)" } },
  Bidenkyu: { 26: { text: "その欠けた未来の 先埋める常夜灯", start: 140.8, why: "unvoiced s 140.80-140.90, voiced 141.00" } },
  Iseijin: {
    36: { text: "もう、笑っていこうぜ", drop: "no other source has this line; the provider squeezes \"もう、笑\" into 0.2 s", time: 186.5 },
  },
};

/* First words the strict check found in silence (the first 0.15 s below
   -25 dB of the vocal track's loud level, voice >= 0.2 s later): the row
   starts where the voice arrives. Applied like ROW_OVERRIDES `start`. */
const START_NUDGE = {
  Tobouyo: {
    3: { text: "僕が泣きださないように", start: 29.15, why: "provider 28.87, voice from 29.15" },
  },
  GORILLAShibai: {
    39: { text: "文句垂らして", start: 122.97, why: "provider 122.77, voice from 122.97" },
    57: { text: "合わせて", start: 171.93, why: "provider 171.73, voice from 171.93" },
  },
  replica: {
    9: { text: "それを作っただけだ", start: 60.18, why: "provider 59.97, voice from 60.18" },
  },
  benefits: {
    7: { text: "2人を繋ぐのは", start: 88.88, why: "provider 88.68, voice from 88.88" },
  },
  Somato: {
    16: { text: "思いやる", start: 136.24, why: "provider 136.01, voice from 136.24" },
  },
  Okitegami: {
    2: { text: "ずいぶん", start: 16.69, why: "provider 16.41, voice from 16.69" },
    10: { text: "天気がいいみたいだ", start: 53.11, why: "provider 52.9, voice from 53.11" },
    25: { text: "もしも私が不死の病にかかったら』", start: 122.33, why: "provider 122.09, voice from 122.33" },
    49: { text: "僕たちが僕たちを思い合えるような", start: 221.95, why: "provider 221.73, voice from 221.95" },
  },
  lifehack: {
    41: { text: "自分のことを", start: 157.53, why: "provider 157.31, voice from 157.53" },
  },
  Byebyme: {
    19: { text: "さーすでぃ今日は", start: 95.81, why: "provider 95.56, voice from 95.81" },
  },
  Missing: {
    17: { text: "重なって", start: 88.18, why: "provider 87.92, voice from 88.18" },
  },
};

/* Songs without word timing whose row times still follow a verified line-level
   clock: time = round(line start + offset, 0.1). */
const LINE_LEVEL_CLOCK = {
  WasureruMaeni: { offset: 0.11, why: "NetEase LRC 2749284145 line starts + 0.11 (Art Track = video, offset 0); vocal-onset scan of the line starts +0.11 s, then line-start bias +0.021 s (n 20)" },
  MajideSayonaraBaby: { offset: 0.17, why: "NetEase LRC 2704175940 line starts + 0.17 (Art Track = video, offset 0); vocal-onset scan +0.175 s, then line-start bias +0.026 s (n 21)" },
  pained: { offset: 45.3175, why: "LRCLIB 22935081 line starts + Art Track offset 45.3175; vocal-onset scan of the LRCLIB line starts +0.085 s, NetEase LRC 2714023589 line starts equal LRCLIB (scan +0.025 s)" },
};

/* Songs with no timing source: row times taken from the vocal onset after
   silence measured per row on the separated vocal track (onset-derived, not a
   provider). Only rows with exactly one clear onset 0.3-0.8 s after the
   authored time are moved; the others keep their authored time. */
const ONSET_ROW_TIMES = {
  pain: {
    0: { text: "人は子をなぜ産むのか", time: 19.15 },
    1: { text: "一世一代の博打のつもりか", time: 23.06 },
    2: { text: "ならば子を育てるのが親の務めか", time: 26.81 },
    4: { text: "誰かのために生きている人と", time: 36.44 },
    7: { text: "背負われてる君が僕に言う", time: 47.96 },
    8: { text: "今日の夜は２人で割り勘", time: 51.7 },
    9: { text: "でもいつかの痛みは１人で割って", time: 55.28 },
    11: { text: "君のことをまた探している", time: 63.24 },
    18: { text: "売れないアーティストが口から吐き出す", time: 118.75 },
    19: { text: "「これは芸術だ」「文句を言うな」", time: 122.61 },
    21: { text: "過信した自我が彼を包む", time: 130.25 },
    22: { text: "夢は大きく 目標はない", time: 134.12 },
    23: { text: "口は大きいが 器はちいさい", time: 137.91 },
    24: { text: "もうどうしたらいいんだ と口から吐き出す", time: 141.74 },
    32: { text: "間違っていたんだよ 思い違っていたんだよ", time: 235.43 },
  },
};

/* Rows whose provider timing the audio check rejected (the separated vocal
   track is silent where the provider puts the first word), keyed by the
   row's time; they keep their hand-set time and get no words. */
const AUDIO_REJECTED = {
  Fukakouryoku: { "19": "vocal silent for 0.3 s after the provider's first word (padded song-opening word)" },
  Homunculus: { "155": "vocal silent 0.1-0.5 s after the provider's first word (provider words 0.02 s long)" },
  Timeparadox: {
    "156": "vocal silent for 2 s after the provider's first word",
    "182.5": "vocal silent after the provider's first word",
  },
};

/* Songs left out of the bundle, with the reason. */
const EXCLUDED = {
  pained: "LRCLIB line-level timing only; no word-level provider",
  Tomoshibi: "the song video is a live performance; the studio word timing does not follow its vocal (weak onset agreement)",
  KonnaToki: "no provider has this song (KuGou, NetEase, LRCLIB) and no Art Track",
  pain: "no provider has this song (searches return the different song pained) and no Art Track",
};

const ICON_TOKEN_RE = /[\[(](wave|clap|mic|chant|jump|spin|turn)[\])]/gi;
const PUNCT_RE = /[\p{P}\p{S}\p{Cf}]/u;
const META_LINE_RE = /作词|作曲|编曲|制作|混音|词：|曲：|^\s*vaundy\s*-/i;
const KANJI_DIGITS = "〇一二三四五六七八九";
const MIN_DIRECT_RATIO = 0.7;
const MAX_ROW_DRIFT = 8;
const MAX_WORD_SEC = 3;

function parseArgs(argv) {
  const args = { positional: [], out: path.join(REPO, "src/word-timing.js"), report: null, retime: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--out") args.out = path.resolve(argv[++i]);
    else if (argv[i] === "--retime") args.retime = true;
    else if (argv[i] === "--report") args.report = path.resolve(argv[++i]);
    else args.positional.push(argv[i]);
  }
  if (args.positional.length !== 2) {
    console.error("usage: build-word-timing.mjs <candidatesDir> <offsetsFile> [--retime] [--out file] [--report file]");
    process.exit(2);
  }
  return args;
}

/* One comparable character, or "" for whitespace and punctuation. */
function normChar(char) {
  let c = char.normalize("NFKC").toLowerCase();
  if (!c.trim() || PUNCT_RE.test(c)) return "";
  c = Array.from(c).map(ch => {
    const code = ch.codePointAt(0);
    if (code >= 0x30a1 && code <= 0x30f6) return String.fromCodePoint(code - 0x60);
    if (ch >= "0" && ch <= "9") return KANJI_DIGITS[Number(ch)];
    return ch;
  }).join("");
  return c;
}

const round2 = value => Math.round(value * 100) / 100;
const round3 = value => Math.round(value * 1000) / 1000;

function rowText(row) {
  const jp = Array.isArray(row.jp) ? row.jp.map(segment => segment.text ?? "").join("") : String(row.jp ?? "");
  return jp.replace(ICON_TOKEN_RE, "");
}

/* Provider characters with their own time span. `raw` keeps the NFKC,
   lower-cased character (for Latin tokens); `cut` marks a token boundary
   before the character (space, punctuation or a new line). */
function providerChars(candidate) {
  const chars = [];
  let wordId = 0;
  candidate.lines.forEach((line, lineIndex) => {
    const lineText = line.words.map(word => word.text).join("");
    if (META_LINE_RE.test(lineText)) { wordId += line.words.length; return; }
    let cut = true;
    for (const word of line.words) {
      const all = Array.from(word.text);
      const sungCount = all.filter(ch => normChar(ch)).length;
      let k = 0;
      all.forEach(ch => {
        const c = normChar(ch);
        if (!c) { cut = true; return; }
        const span = word.end - word.start;
        chars.push({ c, raw: ch.normalize("NFKC").toLowerCase(), cut, line: lineIndex, word: wordId,
          start: word.start + span * k / sungCount, end: word.start + span * (k + 1) / sungCount });
        cut = false;
        k += 1;
      });
      wordId += 1;
    }
  });
  return chars;
}

/* Our units: every non-whitespace character of every row. */
function ourUnits(rows) {
  const units = [];
  rows.forEach((row, rowIndex) => {
    let cut = true;
    Array.from(rowText(row)).forEach(char => {
      if (!char.trim()) { units.push({ row: rowIndex, space: true }); cut = true; return; }
      const c = normChar(char);
      units.push({ row: rowIndex, char, c, raw: char.normalize("NFKC").toLowerCase(), cut, sung: Boolean(c) });
      cut = !c;
    });
  });
  return units;
}

/* Matching tokens: a Latin word (letters and digits with no space or
   punctuation inside, across provider word boundaries) is one token, so it
   is never matched letter by letter into other words; every other sung
   character is a token of its own. Returns [{ key, from, to }] over list. */
const LATIN_RE = /^[a-z0-9]$/;
const REPEAT_MARK_RE = /(?:^|\s)[x×]\s*\d+(?:\s|$)/i;
function tokens(list) {
  const out = [];
  for (let i = 0; i < list.length;) {
    if (LATIN_RE.test(list[i].raw)) {
      let j = i + 1;
      while (j < list.length && !list[j].cut && LATIN_RE.test(list[j].raw)
        && (list[j].row === undefined || list[j].row === list[i].row)) j += 1;
      const text = list.slice(i, j).map(x => x.raw).join("");
      if (/[a-z]/.test(text)) { out.push({ key: text, from: i, to: j }); i = j; continue; }
    }
    out.push({ key: list[i].c, from: i, to: i + 1 });
    i += 1;
  }
  return out;
}

/* Monotonic weighted LCS over tokens between provider chars A and our sung
   chars B; returns a char-level match (B index -> A index or -1). A token
   match scores its length, less a penalty when the provider time is far from
   the row's window, less a tiny cost per second outside the row's own span
   (0.3 s before its time to the next row's time):
   when the provider repeats a phrase more often than our row ("Hey hey hey"
   vs "Hey"), the row takes the take nearest its own time, except a row
   marked "x 2" (it covers every take) which takes the first; exact ties go
   to the earlier take. The row times this runs on should be the authored
   ones: start from src/song-lyrics.js as authored and --retime once. */
function align(A, B, rows, offset) {
  const TA = tokens(A), TB = tokens(B);
  const n = TA.length, m = TB.length;
  const W = m + 1;
  const score = new Float64Array((n + 1) * W);
  const dir = new Uint8Array((n + 1) * W);
  const windows = rows.map((row, index) => {
    const next = rows[index + 1] ? Number(rows[index + 1].time) : Number(row.time) + 12;
    return [Number(row.time) - 2, next + 1];
  });
  /* a row marked "x 3" stands for every take, so it starts at the first */
  const nearCost = rows.map(row => (REPEAT_MARK_RE.test(rowText(row)) ? 0 : 0.01));
  const spans = rows.map((row, index) => [Number(row.time) - 0.3, rows[index + 1] ? Number(rows[index + 1].time) : Infinity]);
  for (let i = 1; i <= n; i += 1) {
    const ta = TA[i - 1];
    const t = A[ta.from].start + offset;
    for (let j = 1; j <= m; j += 1) {
      const up = score[(i - 1) * W + j], left = score[i * W + j - 1];
      let best = up, d = 1;
      if (left > best) { best = left; d = 2; }
      const tb = TB[j - 1];
      if (ta.key === tb.key) {
        const row = B[tb.from].row;
        const [lo, hi] = windows[row];
        const dist = t < lo ? lo - t : t > hi ? t - hi : 0;
        const len = tb.to - tb.from;
        const [from, to] = spans[row];
        const away = t < from ? from - t : t > to ? t - to : 0;
        const diag = score[(i - 1) * W + j - 1] + len * (1 - Math.min(0.9, dist / 4)) - nearCost[row] * len * away;
        if (diag > best) { best = diag; d = 0; }
      }
      score[i * W + j] = best;
      dir[i * W + j] = d;
    }
  }
  const match = new Int32Array(B.length).fill(-1);
  for (let i = n, j = m; i > 0 && j > 0;) {
    const d = dir[i * W + j];
    if (d === 0) {
      const ta = TA[i - 1], tb = TB[j - 1];
      for (let k = 0; k < tb.to - tb.from; k += 1) match[tb.from + k] = ta.from + k;
      i -= 1; j -= 1;
    } else if (d === 1) i -= 1;
    else j -= 1;
  }
  return match;
}

/* Times for every sung unit: { start, end, key, direct }.
   Unmatched characters between two matches are split by row: the part in the
   previous match's row takes the provider characters left in that provider
   line, the part in the next match's row those of the next match's line, and
   characters in rows in between stay untimed (those rows have no match). */
function timeUnits(A, B, match) {
  const m = B.length;
  const ref = new Array(m).fill(null);   // provider char index per sung unit
  const extra = new Array(m).fill(null); // explicit [start, end, key] for trailing inserts
  for (let j = 0; j < m; j += 1) if (match[j] >= 0) ref[j] = match[j];
  const spread = (units, chars) => units.forEach((q, index) => { ref[q] = chars[Math.floor(index * chars.length / units.length)]; });
  for (let j = 0; j < m;) {
    if (match[j] >= 0) { j += 1; continue; }
    let k = j;
    while (k < m && match[k] < 0) k += 1;
    const prev = j > 0 ? j - 1 : -1;
    const next = k < m ? k : -1;
    const ip = prev >= 0 ? match[prev] : -1;
    const iNext = next >= 0 ? match[next] : A.length;
    const gap = [];
    for (let i = ip + 1; i < iNext; i += 1) gap.push(i);
    const block = [];
    for (let q = j; q < k; q += 1) block.push(q);
    const prevRow = prev >= 0 ? B[prev].row : -1;
    const nextRow = next >= 0 ? B[next].row : -1;
    if (prevRow >= 0 && prevRow === nextRow) {
      if (gap.length) spread(block, gap);
      else block.forEach(q => { ref[q] = ip; });
    } else {
      const trailing = block.filter(q => B[q].row === prevRow);
      const leading = block.filter(q => B[q].row === nextRow);
      if (trailing.length) {
        const own = gap.filter(i => A[i].line === A[ip].line);
        if (own.length) spread(trailing, own);
        else {
          const from = A[ip].end;
          const limit = next >= 0 ? A[iNext].start : from + 0.3 * trailing.length;
          const to = Math.max(from, Math.min(limit, from + 0.3 * trailing.length));
          trailing.forEach((q, index) => {
            extra[q] = [from + (to - from) * index / trailing.length, from + (to - from) * (index + 1) / trailing.length, `x${B[q].row}`];
          });
        }
      }
      if (leading.length) {
        const own = gap.filter(i => A[i].line === A[iNext].line);
        if (own.length) spread(leading, own);
        else leading.forEach(q => { ref[q] = iNext; });
      }
    }
    j = k;
  }
  /* split each provider char's span over the sung units that use it */
  const groups = new Map();
  for (let j = 0; j < m; j += 1) {
    if (ref[j] == null || extra[j] || ref[j] < 0 || ref[j] >= A.length) continue;
    if (!groups.has(ref[j])) groups.set(ref[j], []);
    groups.get(ref[j]).push(j);
  }
  const times = new Array(m).fill(null);
  for (const [i, members] of groups) {
    const a = A[i];
    members.forEach((j, index) => {
      times[j] = {
        start: a.start + (a.end - a.start) * index / members.length,
        end: a.start + (a.end - a.start) * (index + 1) / members.length,
        key: `p${a.word}`,
        direct: match[j] >= 0,
      };
    });
  }
  for (let j = 0; j < m; j += 1) {
    if (extra[j]) times[j] = { start: extra[j][0], end: extra[j][1], key: extra[j][2], direct: false };
  }
  return times;
}

function buildSong(song, candidate, offset) {
  const rows = song.lyrics;
  const units = ourUnits(rows);
  const B = units.filter(unit => unit.sung);
  const A = providerChars(candidate);
  const match = align(A, B, rows, offset);
  const times = timeUnits(A, B, match);
  B.forEach((unit, index) => { unit.timing = times[index]; });

  const lines = [];
  const rowReports = [];
  rows.forEach((row, rowIndex) => {
    const rowUnits = units.filter(unit => unit.row === rowIndex);
    const sung = rowUnits.filter(unit => unit.sung);
    const direct = sung.filter(unit => unit.timing && unit.timing.direct).length;
    const report = { index: rowIndex, time: row.time, text: rowText(row).trim(), sung: sung.length, direct, words: null, reason: null };
    rowReports.push(report);
    if (!sung.length) { report.reason = "no sung characters"; return; }
    const rejected = Object.entries(AUDIO_REJECTED[song.id] || {})
      .find(([time]) => Math.round(Number(time) * 100) === Math.round(Number(row.time) * 100));
    if (rejected) { report.reason = `audio check: ${rejected[1]}`; return; }
    if (direct / sung.length < MIN_DIRECT_RATIO) { report.reason = `only ${direct}/${sung.length} characters matched`; return; }
    if (sung.some(unit => !unit.timing)) { report.reason = "untimed characters"; return; }

    const words = [];
    let current = null;
    let prefix = "";
    let broken = true;
    for (const unit of rowUnits) {
      if (unit.space) { broken = true; continue; }
      if (!unit.sung) {
        if (current && !broken) current.text += unit.char;
        else prefix += unit.char;
        continue;
      }
      const t = unit.timing;
      if (!current || broken || current.key !== t.key) {
        current = { text: prefix + unit.char, start: t.start + offset, end: t.end + offset, key: t.key };
        words.push(current);
        prefix = "";
      } else {
        current.text += unit.char;
        current.end = Math.max(current.end, t.end + offset);
      }
      broken = false;
    }
    if (prefix && words.length) words[words.length - 1].text += prefix;
    const out = words.map(word => [word.text, round2(word.start), round2(Math.max(word.start, word.end))]);
    const first = out[0][1];
    if (Math.abs(first - Number(row.time)) > MAX_ROW_DRIFT) {
      report.reason = `first word ${first} is ${round2(first - Number(row.time))} s from the row time`;
      return;
    }
    report.words = out;
    report.firstStart = first;
    lines.push([String(row.time), out]);
  });
  return { lines, rowReports };
}

function formatModule(entries) {
  const out = [];
  out.push("/* Per-word karaoke timing in each song's video clock (seconds).");
  out.push("   Generated by scripts/word-timing/build-word-timing.mjs — do not hand-edit; see that script's header. */");
  out.push("export const WORD_TIMING = Object.freeze({");
  for (const [id, entry] of entries) {
    out.push(`  ${id}: {`);
    out.push(`    source: ${JSON.stringify(entry.source)},`);
    out.push(`    sourceId: ${JSON.stringify(entry.sourceId)},`);
    out.push(`    offset: ${entry.offset},`);
    out.push("    lines: {");
    for (const [key, words] of entry.lines) {
      const list = words.map(([text, start, end]) => `[${JSON.stringify(text)}, ${start}, ${end}]`).join(", ");
      out.push(`      ${JSON.stringify(key)}: [${list}],`);
    }
    out.push("    },");
    out.push("  },");
  }
  out.push("});");
  return out.join("\n") + "\n";
}

const round1 = value => Math.round(value * 10) / 10;
const bucket = value => Math.round(Number(value) * 100);
const formatTime = value => String(Number(Number(value).toFixed(2)));
const normLine = value => String(value).normalize("NFKC").replace(/[\s\p{P}\p{S}]/gu, "");

/* Row overrides: validated against the row text, applied to built words. */
function applyOverride(id, row, report, override) {
  if (override.text !== report.text) throw new Error(`${id}#${report.index}: override expects ${JSON.stringify(override.text)}, row is ${JSON.stringify(report.text)}`);
  if (override.drop) {
    report.words = null;
    report.reason = `audit override: ${override.drop}`;
    return { time: override.time };
  }
  if (!report.words) throw new Error(`${id}#${report.index}: override on a row without words`);
  if (override.start != null) {
    const delta = override.start - report.words[0][1];
    report.words = report.words.map(([text, start, end]) => [text, round2(start + delta), round2(end + delta)]);
    report.override = `start ${override.start} (${delta >= 0 ? "+" : ""}${round2(delta)} s)`;
    return { time: round2(override.start) };
  }
  if (override.lead) {
    const [first, ...rest] = report.words;
    if (!first[0].startsWith(override.lead.text)) throw new Error(`${id}#${report.index}: first word ${first[0]} lacks ${override.lead.text}`);
    report.words = [[override.lead.text, round2(override.lead.start), first[1]], [first[0].slice(override.lead.text.length), first[1], first[2]], ...rest];
    report.override = `lead word ${override.lead.text} at ${override.lead.start}`;
    return { time: round1(override.lead.start) };
  }
  throw new Error(`${id}#${report.index}: empty override`);
}

/* New row times: first word start (0.1 s) for rows with words, the override
   time, the line-level clock, else unchanged; then keep them increasing. */
function plannedTimes(id, rows, rowReports, fixed, lineTimes) {
  const out = rows.map((row, index) => {
    const report = rowReports && rowReports[index];
    let time = Number(row.time);
    let words = false;
    if (fixed.has(index)) { time = fixed.get(index); words = Boolean(report && report.words); }
    else if (report && report.words) { time = round1(report.words[0][1]); words = true; }
    else if (lineTimes && lineTimes.has(index)) { time = lineTimes.get(index); words = true; }
    return { index, old: Number(row.time), time, words, note: null };
  });
  for (let k = 1; k < out.length; k += 1) {
    const prev = out[k - 1], cur = out[k];
    if (cur.time > prev.time + 1e-9) continue;
    if (!cur.words) { cur.time = round1(prev.time + 0.1); cur.note = `kept order after row ${k - 1}`; }
    else if (!prev.words) { prev.time = round1(cur.time - 0.1); prev.note = `kept order before row ${k}`; }
    else { cur.time = round1(prev.time + 0.1); cur.note = `first word rounds onto row ${k - 1}`; }
    if (k > 1 && !(out[k - 1].time > out[k - 2].time)) throw new Error(`${id}: cannot keep row ${k - 1} in order`);
  }
  return out;
}

/* Cap every word at min(next row time, start + MAX_WORD_SEC). A word the
   provider starts after the next row's time (the next row takes over the
   display there) is pinned to that time with zero length. */
function capWords(words, nextTime) {
  let capped = 0;
  const next = Number.isFinite(nextTime) ? nextTime : Infinity;
  const out = words.map(([text, start, end]) => {
    const from = Math.min(start, next);
    const limit = Math.min(next, from + MAX_WORD_SEC);
    if (end > limit + 1e-9 || from !== start) { capped += 1; return [text, round2(from), round2(Math.max(from, limit))]; }
    return [text, start, end];
  });
  return { words: out, capped };
}

/* A zero-length word (the provider gave it no time, or capping pinned it to
   the next row) joins the word before it, or the one after it when it is the
   first; the merged word keeps the real word's span. */
function mergeZeroWords(words) {
  const out = [];
  let carry = "";
  for (const [text, start, end] of words) {
    if (end > start) { out.push([carry + text, start, end]); carry = ""; continue; }
    if (out.length) out[out.length - 1][0] += text;
    else carry += text;
  }
  if (carry) {
    if (out.length) out[0][0] = carry + out[0][0];
    else return words;
  }
  return out;
}

/* Rewrite only the `time:` numbers of src/song-lyrics.js. */
function writeLyrics(file, plans) {
  const src = fs.readFileSync(file, "utf8");
  const starts = Object.keys(plans).map(id => {
    const m = new RegExp(`\\bid:\\s*"${id}"`).exec(src);
    if (!m) throw new Error(`no block for ${id} in ${file}`);
    return [id, m.index];
  }).sort((a, b) => a[1] - b[1]);
  let result = src.slice(0, starts[0][1]);
  starts.forEach(([id, start], k) => {
    const end = k + 1 < starts.length ? starts[k + 1][1] : src.length;
    const rows = plans[id];
    let n = 0;
    result += src.slice(start, end).replace(/(\btime:\s*)(-?\d+(?:\.\d+)?)/g, (all, pre, num) => {
      const row = rows[n++];
      if (!row || bucket(num) !== bucket(row.old)) throw new Error(`${id}: time field ${n - 1} is ${num}, expected ${row && row.old}`);
      return bucket(row.time) === bucket(row.old) ? all : pre + formatTime(row.time);
    });
    if (n !== rows.length) throw new Error(`${id}: ${n} time fields for ${rows.length} rows`);
  });
  fs.writeFileSync(file, result);
}

/* Move chantTimes and chantSegments[].time of src/chant-guide.js with their rows. */
function writeChantGuide(file, plans) {
  const src = fs.readFileSync(file, "utf8");
  const begin = src.indexOf("export const JP_CHANT_GUIDES");
  const finish = src.indexOf("\n};", begin);
  const body = src.slice(begin, finish);
  const marks = [...body.matchAll(/\n {2}"?([A-Za-z0-9]+)"?: \{/g)].map(m => [m[1], m.index]);
  const moved = [];
  let out = body.slice(0, marks.length ? marks[0][1] : body.length);
  marks.forEach(([id, start], k) => {
    const end = k + 1 < marks.length ? marks[k + 1][1] : body.length;
    const map = new Map((plans[id] || []).map(row => [bucket(row.old), row.time]));
    const move = (num, where) => {
      if (!plans[id]) return num;
      const time = map.get(bucket(num));
      if (time === undefined) throw new Error(`${id}: ${where} ${num} matches no row`);
      if (bucket(time) === bucket(num)) return num;
      moved.push(`${id} ${where}: ${num} -> ${formatTime(time)}`);
      return formatTime(time);
    };
    out += body.slice(start, end)
      .replace(/(chantTimes:\s*\[)([^\]]*)(\])/, (all, a, list, b) => a + list.replace(/-?\d+(?:\.\d+)?/g, num => move(num, "chantTimes")) + b)
      .replace(/(chantSegments:\s*\[)([\s\S]*?)(\n {4}\])/, (all, a, list, b) =>
        a + list.replace(/(\btime:\s*)(-?\d+(?:\.\d+)?)/g, (x, pre, num) => pre + move(num, "chantSegments")) + b);
  });
  fs.writeFileSync(file, src.slice(0, begin) + out + src.slice(finish));
  return moved;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const [candidatesDir, offsetsFile] = args.positional;
  const offsets = JSON.parse(fs.readFileSync(offsetsFile, "utf8"));
  const lyricsFile = path.join(REPO, "src/song-lyrics.js");
  const { SONGS } = await import(pathToFileURL(lyricsFile).href + `?t=${Date.now()}`);
  const built = [];
  const report = {};
  const plans = {};
  let capped = 0;
  for (const song of SONGS) {
    const id = song.id;
    const file = path.join(candidatesDir, `${id}.json`);
    const lineClock = LINE_LEVEL_CLOCK[id];
    if (lineClock) {
      /* line-level clock: map rows to provider lines by text near their time */
      const candidate = JSON.parse(fs.readFileSync(file, "utf8"));
      const lines = candidate.lines.map(line => ({ time: line.start + lineClock.offset, text: normLine(line.words.map(w => w.text).join("")) }));
      const lineTimes = new Map();
      song.lyrics.forEach((row, index) => {
        const text = normLine(rowText(row));
        const hit = lines.filter(line => line.text === text && Math.abs(line.time - row.time) < 0.5)
          .sort((a, b) => Math.abs(a.time - row.time) - Math.abs(b.time - row.time))[0];
        if (hit) lineTimes.set(index, round1(hit.time));
      });
      plans[id] = plannedTimes(id, song.lyrics, null, new Map(), lineTimes);
      report[id] = { excluded: EXCLUDED[id] || "line-level clock", lineLevel: { ...lineClock, rows: lineTimes.size } };
      continue;
    }
    if (EXCLUDED[id]) {
      const onsetTimes = new Map();
      for (const [index, entry] of Object.entries(ONSET_ROW_TIMES[id] || {})) {
        if (rowText(song.lyrics[index]).trim() !== entry.text) throw new Error(`${id}#${index}: onset time expects ${JSON.stringify(entry.text)}`);
        onsetTimes.set(Number(index), entry.time);
      }
      report[id] = { excluded: EXCLUDED[id], onsetRows: onsetTimes.size };
      plans[id] = plannedTimes(id, song.lyrics, null, new Map(), onsetTimes);
      continue;
    }
    if (!fs.existsSync(file)) throw new Error(`${id}: no candidate file`);
    const candidate = JSON.parse(fs.readFileSync(file, "utf8"));
    const clock = PROVIDER_CLOCK[id] || { studio: null, delta: 0 };
    const av = offsets[id];
    let studioOffset = av.offset;
    if (clock.studio) {
      const alt = (av.alternativeStudioVersions || []).find(version => version.studioVideoId === clock.studio);
      if (!alt) throw new Error(`${id}: no studio version ${clock.studio} in ${offsetsFile}`);
      studioOffset = alt.offset;
    }
    const shift = LINE_ONSET_SHIFT[id] ? LINE_ONSET_SHIFT[id].shift : 0;
    const offset = round3(studioOffset + clock.delta + shift);
    const { rowReports } = buildSong(song, candidate, offset);
    const fixed = new Map();
    const overrides = { ...(START_NUDGE[id] || {}), ...(ROW_OVERRIDES[id] || {}) };
    for (const [index, override] of Object.entries(overrides)) {
      const result = applyOverride(id, song.lyrics[index], rowReports[index], override);
      fixed.set(Number(index), result.time);
    }
    const plan = plannedTimes(id, song.lyrics, rowReports, fixed, null);
    plans[id] = plan;
    const lines = [];
    rowReports.forEach((row, index) => {
      if (!row.words) return;
      const next = plan[index + 1] ? plan[index + 1].time : Infinity;
      const result = capWords(row.words, next);
      capped += result.capped;
      row.words = mergeZeroWords(result.words);
      row.cappedWords = result.capped;
      row.firstStart = row.words[0][1];
      row.newTime = plan[index].time;
      lines.push([formatTime(plan[index].time), row.words]);
    });
    built.push([id, { source: candidate.provider.name, sourceId: String(candidate.provider.id), offset, lines }]);
    report[id] = { source: candidate.provider.name, sourceId: String(candidate.provider.id), offset, studioOffset, delta: clock.delta, shift, rows: rowReports };
  }
  const changed = Object.entries(plans).flatMap(([id, rows]) => rows.filter(row => bucket(row.time) !== bucket(row.old)).map(row => `${id}#${row.index} ${row.old} -> ${formatTime(row.time)}${row.note ? ` (${row.note})` : ""}`));
  if (changed.length && !args.retime) {
    console.error(`${changed.length} row times differ from their first word; rerun with --retime:\n${changed.slice(0, 20).join("\n")}`);
    process.exit(1);
  }
  if (args.retime) {
    writeLyrics(lyricsFile, plans);
    const moved = writeChantGuide(path.join(REPO, "src/chant-guide.js"), plans);
    console.log(`retimed ${changed.length} rows; moved ${moved.length} chant times`);
    if (args.report) fs.writeFileSync(args.report.replace(/\.json$/, ".retime.json"), JSON.stringify({ changed, moved }, null, 1));
  }
  fs.writeFileSync(args.out, formatModule(built));
  if (args.report) fs.writeFileSync(args.report, JSON.stringify({ capped, songs: report }, null, 1));
  for (const [id, entry] of Object.entries(report)) {
    if (entry.excluded) { console.log(`${id.padEnd(24)} excluded: ${entry.excluded}`); continue; }
    const withWords = entry.rows.filter(row => row.words).length;
    const sung = entry.rows.filter(row => row.sung > 0).length;
    console.log(`${id.padEnd(24)} ${entry.source} ${entry.sourceId} offset ${entry.offset} rows ${withWords}/${sung}`);
  }
  console.log(`capped ${capped} word ends at min(next row time, start + ${MAX_WORD_SEC} s)`);
}

main().catch(error => { console.error(error); process.exit(1); });
