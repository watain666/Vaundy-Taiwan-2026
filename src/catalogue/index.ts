/*
 * Song catalogue: runtime interface for the page.
 *
 * Songs are assembled and validated at build time (see assemble.ts and the
 * song-catalogue plugin in vite.config.ts). The summary list ships with the
 * page; each full song is its own chunk, loaded on demand.
 */
import { LOADERS, SUMMARIES } from "virtual:song-catalogue";
import type { Song, SongSummary } from "./assemble";

export type { LyricLine, Song, SongId, SongMarks, SongSummary } from "./assemble";

export class UnknownSongError extends Error {
  readonly songId: string;
  constructor(songId: string) {
    super(`Unknown song id ${JSON.stringify(songId)}`);
    this.name = "UnknownSongError";
    this.songId = songId;
  }
}

const summaryById = new Map<string, SongSummary>(SUMMARIES.map(song => [song.id, song]));
const pending = new Map<string, Promise<Song>>();

/** Every song summary, in list order. */
export function list(): readonly SongSummary[] {
  return SUMMARIES;
}

/** One song summary, or undefined for an unknown id. */
export function get(id: string): SongSummary | undefined {
  return summaryById.get(id);
}

/** Loads a full song; rejects with UnknownSongError for an unknown id. A failed load can be retried. */
export function load(id: string): Promise<Song> {
  const loader = Object.prototype.hasOwnProperty.call(LOADERS, id) ? LOADERS[id] : undefined;
  if (!loader) return Promise.reject(new UnknownSongError(id));
  let promise = pending.get(id);
  if (!promise) {
    promise = loader().then(module => module.default).catch(error => {
      pending.delete(id);
      throw error;
    });
    pending.set(id, promise);
  }
  return promise;
}
