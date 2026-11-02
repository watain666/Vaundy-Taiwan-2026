/*
 * Lyric view: container settings. The display settings that never enter the
 * row markup become classes on the element that holds the lyric list (the
 * song page, or the PiP root). One mapping, used by both.
 */
import type { ReadingMode } from "./rows";

export type LyricContainerSettings = {
  readingMode: ReadingMode;
  showJapanese: boolean;
  showChinese: boolean;
  karaokeEnabled: boolean;
  /** Chant-only practice is on and the song has chant blocks. */
  chantOnly: boolean;
};

export const LYRIC_CONTAINER_CLASSES = [
  "reading-both",
  "hide-japanese",
  "hide-chinese",
  "lyrics-hidden",
  "karaoke-off",
  "chant-only",
] as const;

export type LyricContainerClass = (typeof LYRIC_CONTAINER_CLASSES)[number];

export function lyricContainerClasses(settings: LyricContainerSettings): Record<LyricContainerClass, boolean> {
  return {
    "reading-both": settings.readingMode === "both",
    "hide-japanese": !settings.showJapanese,
    "hide-chinese": !settings.showChinese,
    "lyrics-hidden": !settings.showJapanese && !settings.showChinese,
    "karaoke-off": !settings.karaokeEnabled,
    "chant-only": settings.chantOnly,
  };
}

export function applyLyricContainerClasses(element: Element, settings: LyricContainerSettings): void {
  const classes = lyricContainerClasses(settings);
  LYRIC_CONTAINER_CLASSES.forEach(name => element.classList.toggle(name, classes[name]));
}
