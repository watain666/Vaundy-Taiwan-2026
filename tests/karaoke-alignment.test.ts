/* Fixtures ported from scripts/check-karaoke-alignment.mjs: romaji units
   must map onto kana reference units with the expected timing spans. */
import { describe, expect, test } from "vitest";
import { karaoke } from "./fixtures";

type Expected = { unitIndex: number; start: number; end: number };

const FIXTURES: [string, string[], string[], Expected][] = [
  ["satotte",
    ["dōkou", "yori", "mo", "hitotsu", "omoi", ",", "satotte", "kure"],
    ["do", "u", "ko", "u", "yo", "ri", "mo", "hito", "tsu", "omo", "i", ",", "sato", "っ", "て", "ku", "re"],
    { unitIndex: 6, start: 112, end: 115 }],
  ["koko / hanasō",
    ["kimi", "ni", "deaeru", "kara", "mata", "koko", "de", "hanasō"],
    ["きみ", "に", "であ", "え", "る", "から", "また", "ここ", "で", "はな", "そ", "う"],
    { unitIndex: 5, start: 107, end: 108 }],
  ["long vowel", ["kōsu"], ["コ", "ー", "ス"], { unitIndex: 0, start: 100, end: 103 }],
  ["yōon", ["kya", "ku"], ["き", "ゃ", "く"], { unitIndex: 0, start: 100, end: 102 }],
  ["mixed punctuation and English",
    ["kon'ya", "CHAINSAW", "40000", "km", "!"],
    ["こ", "ん", "や", "CHAINSAW", "40000", "km", "!"],
    { unitIndex: 0, start: 100, end: 103 }],
];

describe("karaoke romaji-to-reading mapping", () => {
  test.each(FIXTURES)("%s", (_label, units, references, expected) => {
    const timings = references.map((_, index) => ({ start: index + 100, end: index + 101 }));
    const mapped = karaoke.mapUnitsToReferenceTimings(units, references, timings);
    expect(mapped.complete).toBe(true);
    units.forEach((unit, index) => {
      if (!karaoke.normaliseRomajiText(unit)) return;
      expect(Number.isFinite(Number(mapped.timings[index]?.start)), unit).toBe(true);
    });
    const timing = mapped.timings[expected.unitIndex];
    expect({ start: timing?.start, end: timing?.end }).toEqual({ start: expected.start, end: expected.end });
  });
});
