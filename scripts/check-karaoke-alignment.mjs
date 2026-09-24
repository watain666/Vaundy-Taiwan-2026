import fs from "node:fs";
import vm from "node:vm";
import { SONG_LYRICS as SONGS } from "../src/song-lyrics.js";
import { FURIGANA_CORRECTIONS, ROMAJI_CORRECTIONS } from "../src/furigana-corrections.js";

const source = fs.readFileSync(new URL("../karaoke-sources.js", import.meta.url), "utf8");
const sourceContext = { window: {} };
vm.runInNewContext(source, sourceContext, { filename: "karaoke-sources.js" });
const karaoke = sourceContext.window.KARAOKE_SOURCES;

const furiganaSource = fs.readFileSync(new URL("../furigana.js", import.meta.url), "utf8");
const furiganaContext = { window: {} };
vm.runInNewContext(furiganaSource, furiganaContext, { filename: "furigana.js" });
const furiganaByLine = {
  ...(furiganaContext.window.JP_FURIGANA || {}),
  ...FURIGANA_CORRECTIONS,
};
const romajiByLine = {
  ...(furiganaContext.window.JP_ROMAJI || {}),
  ...ROMAJI_CORRECTIONS,
};

const textOf = value => Array.isArray(value)
  ? value.map(part => typeof part === "string" ? part : part?.text || "").join("")
  : String(value ?? "");

const ICON_TOKEN_RE = /[\[(](?:wave|clap|mic|chant|jump|spin|turn)[\])]/giu;
const ROMAJI_WORD_CHAR_RE = /[\p{Script=Latin}\p{N}]/u;
const ROMAJI_WORD_CONTINUATION_RE = /[\p{Script=Latin}\p{N}'’_-]/u;

function stripMarkup(value){
  return String(value || "").replace(/<[^>]*>/g, "");
}

/* Mirror the karaoke decorator: a ruby is one visible unit, plain text is
   split by character, and whitespace/icons do not become timed units. */
function referenceReadings(markup){
  const value = String(markup || "").replace(ICON_TOKEN_RE, "");
  const units = [];
  const rubyRe = /<ruby(?:\s[^>]*)?>([\s\S]*?)<\/ruby>/giu;
  let cursor = 0;
  let match;

  const appendPlain = plain => {
    Array.from(stripMarkup(plain)).forEach(char => {
      if (!/\s/u.test(char)) units.push(char);
    });
  };

  while ((match = rubyRe.exec(value))) {
    appendPlain(value.slice(cursor, match.index));
    const inner = match[1];
    const reading = inner.match(/<rt(?:\s[^>]*)?>([\s\S]*?)<\/rt>/iu);
    const base = stripMarkup(reading ? inner.slice(0, reading.index) : inner);
    if (base && !/^\s*$/u.test(base)) {
      units.push(reading ? stripMarkup(reading[1]) : base);
    }
    cursor = rubyRe.lastIndex;
  }
  appendPlain(value.slice(cursor));
  return units;
}

function romajiUnits(value){
  const chars = Array.from(String(value || "").replace(ICON_TOKEN_RE, ""));
  const units = [];
  for (let index = 0; index < chars.length;) {
    const char = chars[index];
    if (/\s/u.test(char)) {
      index += 1;
      continue;
    }
    if (ROMAJI_WORD_CHAR_RE.test(char)) {
      let end = index + 1;
      while (end < chars.length && ROMAJI_WORD_CONTINUATION_RE.test(chars[end])) end += 1;
      units.push(chars.slice(index, end).join(""));
      index = end;
      continue;
    }
    units.push(char);
    index += 1;
  }
  return units;
}

function isTimed(value){
  return value && Number.isFinite(Number(value.start)) && Number.isFinite(Number(value.end));
}

function assert(condition, message){
  if (!condition) throw new Error(message);
}

function checkFixture(label, unitTexts, referenceTexts, expected){
  const referenceTimings = referenceTexts.map((_, index) => ({
    start: index + 100,
    end: index + 101,
  }));
  const mapped = karaoke.mapUnitsToReferenceTimings(unitTexts, referenceTexts, referenceTimings);
  assert(mapped.complete, `${label}: unmatched romaji units ${JSON.stringify(mapped.unmatched)}`);
  unitTexts.forEach((unit, index) => {
    if (!karaoke.normaliseRomajiText(unit)) return;
    assert(isTimed(mapped.timings[index]), `${label}: missing timing for ${unit}`);
  });
  if (expected) {
    const timing = mapped.timings[expected.unitIndex];
    assert(timing.start === expected.start && timing.end === expected.end,
      `${label}: expected ${expected.start}-${expected.end}, got ${timing.start}-${timing.end}`);
  }
  return mapped;
}

assert(karaoke && typeof karaoke.mapUnitsToReferenceTimings === "function",
  "KARAOKE_SOURCES.mapUnitsToReferenceTimings is unavailable");
const reunionLine = "[wave]君に出会えるからまた夏で話そう";
assert(/<ruby>夏<rt>ここ<\/rt><\/ruby>/u.test(furiganaByLine[reunionLine] || ""),
  "Reunion: 夏 must keep the user-confirmed ここ reading");

checkFixture(
  "satotte",
  ["dōkou", "yori", "mo", "hitotsu", "omoi", ",", "satotte", "kure"],
  ["do", "u", "ko", "u", "yo", "ri", "mo", "hito", "tsu", "omo", "i", ",", "sato", "っ", "て", "ku", "re"],
  { unitIndex: 6, start: 112, end: 115 }
);
checkFixture(
  "koko / hanasō",
  ["kimi", "ni", "deaeru", "kara", "mata", "koko", "de", "hanasō"],
  ["きみ", "に", "であ", "え", "る", "から", "また", "ここ", "で", "はな", "そ", "う"],
  { unitIndex: 5, start: 107, end: 108 }
);
checkFixture(
  "long vowel",
  ["kōsu"],
  ["コ", "ー", "ス"],
  { unitIndex: 0, start: 100, end: 103 }
);
checkFixture(
  "yōon",
  ["kya", "ku"],
  ["き", "ゃ", "く"],
  { unitIndex: 0, start: 100, end: 102 }
);
checkFixture(
  "mixed punctuation and English",
  ["kon'ya", "CHAINSAW", "40000", "km", "!"],
  ["こ", "ん", "や", "CHAINSAW", "40000", "km", "!"],
  { unitIndex: 0, start: 100, end: 103 }
);

const failures = [];
let lineCount = 0;
for (const song of SONGS) {
  for (const [index, line] of (song.lyrics || []).entries()) {
    lineCount += 1;
    const sourceText = textOf(line.jp);
    const markup = furiganaByLine[sourceText] || sourceText;
    const romaji = typeof romajiByLine[sourceText] === "string"
      ? romajiByLine[sourceText]
      : sourceText;
    const referenceTexts = referenceReadings(markup);
    const unitTexts = romajiUnits(romaji);
    const referenceTimings = referenceTexts.map((_, unitIndex) => ({
      start: unitIndex + 1,
      end: unitIndex + 2,
    }));
    const mapped = karaoke.mapUnitsToReferenceTimings(unitTexts, referenceTexts, referenceTimings);
    const missing = unitTexts.filter((unit, unitIndex) =>
      karaoke.normaliseRomajiText(unit) && !isTimed(mapped.timings[unitIndex])
    );
    if (!mapped.complete || missing.length) {
      failures.push({
        song: song.id,
        index,
        source: sourceText,
        romaji,
        reference: referenceTexts.join("|"),
        unmatched: mapped.unmatched,
        missing,
      });
    }
  }
}

console.log(`Checked ${SONGS.length} songs / ${lineCount} lyric lines.`);
if (lineCount !== 1427) failures.push({ kind: "line-count", lineCount });

if (failures.length) {
  console.error(`Karaoke alignment failures: ${failures.length}`);
  failures.slice(0, 80).forEach(failure => console.error(JSON.stringify(failure)));
  process.exitCode = 1;
} else {
  console.log("All romaji units map to Japanese reference timing spans.");
}
