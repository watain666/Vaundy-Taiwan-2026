/* Song page links: `#/song/<id>` with optional query parameters after the id,
   for example `#/song/Backlight?t=113&src=live`.
   - `t`: where the video starts, in seconds (`113`, `113.5`), YouTube style
     (`1m53s`, `2h1m`), or a clock (`1:53`, `1:02:03`).
   - `src`: `live` or `mv`, which video the link means; it overrides the
     "優先播放 Live 版" setting for that song only.
   Invalid values are ignored, so a bad parameter still opens the song. */

export type VideoSource = "mv" | "live";

export type SongRoute = {
  id: string;
  startSeconds: number | null;
  source: VideoSource | null;
};

export function parseStartSeconds(value: string | null | undefined): number | null {
  if (value == null) return null;
  const text = value.trim().toLowerCase();
  if (!text) return null;
  let seconds: number;
  if (/^\d+(\.\d+)?s?$/.test(text)) {
    seconds = Number.parseFloat(text);
  } else if (/^(\d+h)?(\d+m)?(\d+(\.\d+)?s)?$/.test(text)) {
    const part = (unit: string) => Number.parseFloat(text.match(new RegExp(`(\\d+(?:\\.\\d+)?)${unit}`))?.[1] ?? "0");
    seconds = part("h") * 3600 + part("m") * 60 + part("s");
  } else if (/^\d+(:[0-5]\d){1,2}(\.\d+)?$/.test(text)) {
    seconds = text.split(":").reduce((total, piece) => total * 60 + Number.parseFloat(piece), 0);
  } else {
    return null;
  }
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
}

export function parseSource(value: string | null | undefined): VideoSource | null {
  const text = value?.trim().toLowerCase();
  return text === "live" || text === "mv" ? text : null;
}

/* `path` is the route after `#/song/`, e.g. `Backlight?t=113`. */
export function parseSongRoute(path: string): SongRoute {
  const mark = path.indexOf("?");
  const rawId = mark < 0 ? path : path.slice(0, mark);
  let id = rawId;
  try { id = decodeURIComponent(rawId); } catch { /* keep the raw text */ }
  const params = new URLSearchParams(mark < 0 ? "" : path.slice(mark + 1));
  return {
    id,
    startSeconds: parseStartSeconds(params.get("t")),
    source: parseSource(params.get("src")),
  };
}
