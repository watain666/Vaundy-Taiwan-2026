/*
 * Video PiP: the subtitle window for browsers without Document
 * Picture-in-Picture (phones). A canvas painted like the desktop PiP window
 * is the source of a muted <video>, and that video goes into the system PiP
 * window, which stays on screen over other apps.
 *
 * The window is a picture: it has no buttons of its own. Play/pause in the
 * system PiP controls and the Media Session previous/next actions are passed
 * to the page through the callbacks.
 *
 * Like the desktop window it gets values only (the same view model as
 * src/document-pip.js) and mounts its own lyric view, on a container that is
 * never shown; src/video-pip-frame.ts paints that mount's current and next
 * rows.
 */
import { applyLyricContainerClasses, createLyricMount, hasDisplayedLyricText } from "./lyric-view/index.ts";
import { paintFrame, readFrameRow } from "./video-pip-frame.ts";

const FRAME_WIDTH = 960;
const FRAME_HEIGHT = 480;
/* The page repaints on every sync tick while playing; this keeps the frame
   fresh while paused or between ticks. */
const IDLE_REPAINT_MS = 1000;

function isVideoPipSupported(){
  try {
    if (typeof document === "undefined" || typeof HTMLVideoElement === "undefined") return false;
    const video = HTMLVideoElement.prototype;
    const standard = typeof video.requestPictureInPicture === "function" && document.pictureInPictureEnabled !== false;
    const webkit = typeof video.webkitSetPresentationMode === "function";
    const capture = typeof HTMLCanvasElement !== "undefined"
      && typeof HTMLCanvasElement.prototype.captureStream === "function";
    return (standard || webkit) && capture;
  } catch(e){
    return false;
  }
}

function cssVar(style, name, fallback){
  const value = style.getPropertyValue(name).trim();
  return value || fallback;
}

export function createVideoPip({
  onPlay = ()=>{},
  onPause = ()=>{},
  onPreviousSong = ()=>{},
  onNextSong = ()=>{},
  onChange = ()=>{}
} = {}){
  const supported = isVideoPipSupported();
  let canvas = null;
  let context = null;
  let video = null;
  let open = false;
  let lastModel = null;
  let repaintTimer = null;
  /* Set while this module itself plays the video, so its play event is not
     mistaken for the visitor pressing play in the PiP window. */
  let selfPlaying = false;
  let selfPausing = false;

  /* The hidden lyric view mount and the inputs it last rendered. */
  let host = null;
  let list = null;
  let lyricMount = null;
  let renderedLyrics = null;

  function inPip(){
    if (!video) return false;
    if (document.pictureInPictureElement === video) return true;
    return video.webkitPresentationMode === "picture-in-picture";
  }

  function playVideoElement(){
    if (!video || !video.paused) return;
    selfPlaying = true;
    const done = ()=>{ selfPlaying = false; };
    try {
      const result = video.play();
      if (result && typeof result.then === "function") result.then(done, done);
      else done();
    } catch(e){ done(); }
  }

  function pauseVideoElement(){
    if (!video || video.paused) return;
    // The pause event is queued; its handler clears the guard (the timer
    // only covers a browser that fires no event).
    selfPausing = true;
    try { video.pause(); } catch(e){}
    setTimeout(()=>{ selfPausing = false; }, 1000);
  }

  /* Creates the canvas and the video ahead of the first press: Safari opens
     PiP only for a video that already has frames, and only inside the
     click, so nothing may be awaited between the press and the request. */
  function prepare(){
    if (!supported || video) return;
    canvas = document.createElement("canvas");
    canvas.width = FRAME_WIDTH;
    canvas.height = FRAME_HEIGHT;
    context = canvas.getContext("2d");

    video = document.createElement("video");
    video.className = "video-pip-source";
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    video.setAttribute("aria-hidden", "true");
    video.tabIndex = -1;
    // Kept in the document (Safari wants the element attached) but out of sight.
    Object.assign(video.style, {
      position: "fixed",
      right: "0",
      bottom: "0",
      width: "2px",
      height: "1px",
      opacity: "0",
      pointerEvents: "none",
      zIndex: "-1"
    });
    paint(lastModel || {});
    video.srcObject = canvas.captureStream();
    document.body.appendChild(video);

    video.addEventListener("enterpictureinpicture", handleEnter);
    video.addEventListener("leavepictureinpicture", handleLeave);
    video.addEventListener("webkitpresentationmodechanged", ()=>{
      if (inPip()) handleEnter();
      else handleLeave();
    });
    video.addEventListener("pause", ()=>{
      if (selfPausing){ selfPausing = false; return; }
      if (!open || selfPlaying) return;
      // The visitor pressed pause in the system PiP window. Closing the
      // window can pause the video just before it leaves PiP, so wait a
      // task and check the window is still open.
      setTimeout(()=>{ if (open && inPip()) onPause(); }, 0);
    });
    video.addEventListener("play", ()=>{
      if (open && inPip() && !selfPlaying) onPlay();
    });
    playVideoElement();
  }

  function ensureSource(){
    if (host) return;
    host = document.createElement("div");
    host.className = "song-page video-pip-lyrics";
    host.setAttribute("aria-hidden", "true");
    host.inert = true;
    // Rendered for its computed styles only: never visible, never in the way.
    Object.assign(host.style, {
      position: "fixed",
      left: "-10000px",
      top: "0",
      width: "480px",
      height: "auto",
      padding: "0",
      visibility: "hidden",
      pointerEvents: "none",
      overflow: "hidden"
    });
    list = document.createElement("ul");
    list.className = "lyrics-list video-pip-lyrics-list";
    host.appendChild(list);
    document.body.appendChild(host);
    lyricMount = createLyricMount(list, {
      interactive: false,
      scrollAnchor: "top",
      autoScroll: false,
      scroller: host,
      keepLastActive: false
    });
    renderedLyrics = null;
  }

  function destroySource(){
    if (lyricMount) lyricMount.destroy();
    if (host) host.remove();
    host = null;
    list = null;
    lyricMount = null;
    renderedLyrics = null;
  }

  function renderLyrics(model){
    const song = model.song || null;
    const view = model.view || {};
    const inputs = {
      song,
      readingMode: view.readingMode,
      chantVersion: view.chantVersion,
      karaokeTiming: view.karaokeTiming || null,
      karaokeSources: view.karaokeSources || null
    };
    const changed = !renderedLyrics
      || Object.keys(inputs).some(key => inputs[key] !== renderedLyrics[key]);
    if (changed){
      if (song) lyricMount.render(song, inputs);
      else list.replaceChildren();
      renderedLyrics = inputs;
    }
    if (song && model.playhead) lyricMount.setPlayhead(model.playhead);
  }

  /* The row after the current one that has text to show; before the first
     line, the first such row. */
  function nextRowIndex(song, activeIdx){
    const lines = song && Array.isArray(song.lyrics) ? song.lyrics : [];
    for (let i = Math.max(-1, activeIdx) + 1; i < lines.length; i++){
      if (hasDisplayedLyricText(lines[i])) return i;
    }
    return -1;
  }

  function theme(){
    const style = getComputedStyle(document.documentElement);
    const dark = document.documentElement.dataset.theme !== "light";
    return {
      background: cssVar(style, "--ui-bg", dark ? "#151619" : "#f5f5f7"),
      text: cssVar(style, "--ui-text", dark ? "#f5f5f7" : "#1d1d1f"),
      muted: cssVar(style, "--ui-muted", dark ? "#a9a9af" : "#64646b"),
      accent: cssVar(style, "--ui-accent", dark ? "#e9d9a3" : "#755724"),
      track: cssVar(style, "--ui-raised", dark ? "#2b2c30" : "#eaeaed"),
      pill: cssVar(style, "--ui-hover", dark ? "rgba(255,255,255,.07)" : "rgba(29,29,31,.055)"),
      lit: cssVar(style, "--clap", "#4fa8e0")
    };
  }

  function paint(model){
    if (!context) return;
    let current = null;
    let next = null;
    const settings = model.container || {};
    const lyricsHidden = settings.showJapanese === false && settings.showChinese === false;
    let message = lyricsHidden ? "歌詞已隱藏" : (model.song ? "" : "等待歌詞載入…");
    if (model.status) message = model.status;

    if (host && lyricMount){
      applyLyricContainerClasses(host, {
        readingMode: settings.readingMode,
        showJapanese: settings.showJapanese !== false,
        showChinese: settings.showChinese !== false,
        karaokeEnabled: settings.karaokeEnabled === true,
        chantOnly: settings.chantOnly === true
      });
      if (model.song){
        renderLyrics(model);
        const rows = list.querySelectorAll(".lyric-line");
        const activeIdx = model.playhead ? model.playhead.activeIdx : -1;
        const styleOf = element => getComputedStyle(element);
        current = activeIdx >= 0 ? readFrameRow(rows[activeIdx], styleOf) : null;
        const nextIdx = nextRowIndex(model.song, activeIdx);
        next = nextIdx >= 0 ? readFrameRow(rows[nextIdx], styleOf) : null;
      }
    }

    paintFrame(context, {
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
      theme: theme(),
      songNumber: model.songNumber || "",
      title: model.title || "同步字幕",
      progress: Number(model.progress) || 0,
      message,
      current,
      next,
      lyricScale: Number(model.lyricScale) || 1
    });
  }

  function setMediaSession(active){
    const session = typeof navigator !== "undefined" ? navigator.mediaSession : null;
    if (!session || typeof session.setActionHandler !== "function") return;
    const handlers = {
      play: onPlay,
      pause: onPause,
      previoustrack: onPreviousSong,
      nexttrack: onNextSong
    };
    Object.entries(handlers).forEach(([action, handler]) => {
      try { session.setActionHandler(action, active ? ()=>{ try { handler(); } catch(e){} } : null); } catch(e){}
    });
  }

  function updateMediaSession(model){
    const session = typeof navigator !== "undefined" ? navigator.mediaSession : null;
    if (!session) return;
    try {
      if (typeof MediaMetadata === "function" && model.title){
        const current = session.metadata;
        if (!current || current.title !== model.title){
          session.metadata = new MediaMetadata({ title: model.title, artist: "Vaundy" });
        }
      }
      session.playbackState = model.isPlaying ? "playing" : "paused";
    } catch(e){}
  }

  function handleEnter(){
    if (open) return;
    open = true;
    setMediaSession(true);
    if (lastModel) updateMediaSession(lastModel);
    if (!repaintTimer) repaintTimer = setInterval(()=>{ if (open && lastModel) paint(lastModel); }, IDLE_REPAINT_MS);
    onChange();
  }

  function handleLeave(){
    if (!open) return;
    open = false;
    setMediaSession(false);
    if (repaintTimer){ clearInterval(repaintTimer); repaintTimer = null; }
    destroySource();
    onChange();
  }

  function isOpen(){
    return open && inPip();
  }

  /* The window was not opened: undo the preparation for it and say why
     (the reason is shown to the visitor, so a failure on a device can be
     reported). */
  function failOpen(reason){
    if (!open) destroySource();
    return { opened: false, reason };
  }

  function waitFor(target, eventName, timeoutMs){
    return new Promise(resolve => {
      let timer = null;
      const done = value => {
        clearTimeout(timer);
        target.removeEventListener(eventName, onEvent);
        resolve(value);
      };
      const onEvent = ()=>done(true);
      target.addEventListener(eventName, onEvent);
      timer = setTimeout(()=>done(false), timeoutMs);
    });
  }

  /* webkitSetPresentationMode returns nothing and may be ignored (for
     example in a home-screen web app), so success is the mode changing. */
  function requestWebkitPip(){
    if (typeof video.webkitSetPresentationMode !== "function") return Promise.resolve("no-pip-api");
    if (typeof video.webkitSupportsPresentationMode === "function"
      && !video.webkitSupportsPresentationMode("picture-in-picture")) return Promise.resolve("webkit-unsupported");
    try { video.webkitSetPresentationMode("picture-in-picture"); }
    catch(e){ return Promise.resolve(`webkit-${e && e.name || "error"}`); }
    if (inPip()) return Promise.resolve(null);
    return waitFor(video, "webkitpresentationmodechanged", 1500)
      .then(()=> inPip() ? null : "webkit-ignored");
  }

  function requestPip(){
    const standard = typeof video.requestPictureInPicture === "function" && document.pictureInPictureEnabled !== false;
    if (!standard) return requestWebkitPip();
    return video.requestPictureInPicture().then(()=>null, error => {
      const name = (error && error.name) || "error";
      // Safari also has the older API; try it before giving up.
      return requestWebkitPip().then(webkitReason => webkitReason ? `${name}/${webkitReason}` : null);
    });
  }

  /* Must be called from the click itself: it requests PiP before returning.
     Resolves to { opened, reason }. */
  function openWindow(model = {}){
    if (!supported) return Promise.resolve({ opened: false, reason: "unsupported" });
    prepare();
    lastModel = model;
    ensureSource();
    paint(model);
    playVideoElement();
    const attempt = ()=> requestPip().then(reason => {
      if (reason) return failOpen(`${reason} · readyState ${video.readyState}`);
      handleEnter();
      return { opened: true, reason: null };
    }, error => failOpen(`${(error && error.name) || "error"} · readyState ${video.readyState}`));
    try {
      // A video without frames cannot enter PiP. Request at once when it has
      // them; otherwise wait briefly for the first frame (the click's user
      // activation usually still holds).
      if (video.readyState >= 1) return attempt();
      return waitFor(video, "loadedmetadata", 1000).then(attempt);
    } catch(e){
      return Promise.resolve(failOpen(`${(e && e.name) || "error"} · readyState ${video ? video.readyState : -1}`));
    }
  }

  function update(model){
    lastModel = model;
    if (!isOpen()) return;
    paint(model);
    updateMediaSession(model);
    // Keep the system PiP play/pause in step with the player. A pause the
    // visitor asked for is shown at once (the player's own state follows a
    // moment later); a pause the page will undo is not, so the window keeps
    // showing new frames.
    if (!video) return;
    if (model.pausedByVisitor){
      if (!video.paused) pauseVideoElement();
    } else if (model.isPlaying && video.paused){
      playVideoElement();
    }
  }

  function close(){
    if (!video || !inPip()){
      handleLeave();
      return;
    }
    try {
      if (document.pictureInPictureElement === video) document.exitPictureInPicture();
      else if (typeof video.webkitSetPresentationMode === "function") video.webkitSetPresentationMode("inline");
    } catch(e){}
    handleLeave();
  }

  return Object.freeze({ supported, prepare, open: openWindow, update, close, isOpen });
}
