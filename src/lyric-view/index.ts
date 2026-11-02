/*
 * Lyric view: one implementation of the lyric list, mounted on the song page
 * and in the Document PiP window. See docs/adr/0002-lyric-view-rendered-once-mounted-twice.md.
 */
export { renderLyricRows, type ChantVersion, type LyricViewOptions, type ReadingMode, type RowRenderOptions } from "./rows";
export { createLyricMount, type Beat, type LyricMount, type LyricMountOptions, type LyricRenderInput, type Playhead } from "./mount";
export {
  applyLyricContainerClasses,
  LYRIC_CONTAINER_CLASSES,
  lyricContainerClasses,
  type LyricContainerSettings,
} from "./container";
export { hasDisplayedLyricText, type KaraokeTiming, type TimedLine } from "./timing";
export type { KaraokeSources } from "./decorate";
