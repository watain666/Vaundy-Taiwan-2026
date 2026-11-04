import pipStyles from "./document-pip.css?inline";
import {
  BACK_SVG,
  PAUSE_SVG,
  PLAY_SVG,
  TRACK_NEXT_SVG,
  TRACK_PREV_SVG
} from "./ui/icons.js";
import { applyLyricContainerClasses, createLyricMount } from "./lyric-view/index.ts";

const PIP_WIDTH = 450;
const PIP_HEIGHT = 225;
// The active line sits near the top of the lyrics area so the space below
// goes to the upcoming line (PiP is often too short to show both centered).
const ACTIVE_LINE_TOP_OFFSET = 4;

function isDocumentPipSupported(){
  try {
    return typeof window !== "undefined"
      && typeof window.documentPictureInPicture?.requestWindow === "function";
  } catch(e){
    return false;
  }
}

function copyStyles(sourceDocument, targetDocument){
  sourceDocument.querySelectorAll('link[rel="stylesheet"]').forEach(source => {
    const link = targetDocument.createElement("link");
    link.rel = "stylesheet";
    link.href = source.href;
    targetDocument.head.appendChild(link);
  });

  sourceDocument.querySelectorAll("style").forEach(source => {
    targetDocument.head.appendChild(source.cloneNode(true));
  });

  const style = targetDocument.createElement("style");
  style.textContent = pipStyles;
  targetDocument.head.appendChild(style);
}

function copyIconSprite(sourceDocument, targetDocument){
  const sprite = sourceDocument.querySelector(".icon-sprite");
  if (sprite) targetDocument.body.appendChild(sprite.cloneNode(true));
}

function actionButton(documentRef, className, label, icon, handler){
  const button = documentRef.createElement("button");
  button.type = "button";
  button.className = `pip-action ${className}`;
  button.innerHTML = `<span class="pip-action-icon" aria-hidden="true"></span><span class="pip-action-label"></span>`;
  button.querySelector(".pip-action-icon").innerHTML = icon || "";
  button.querySelector(".pip-action-label").textContent = label;
  button.setAttribute("aria-label", label);
  button.title = label;
  button.addEventListener("click", event => {
    event.preventDefault();
    try { handler(); } catch(e) { /* keep the PiP window usable if the opener is busy */ }
  });
  return button;
}

export function createDocumentPip({
  onPlayPause = ()=>{},
  onFocusOpener = ()=>{},
  onPreviousSong = ()=>{},
  onNextSong = ()=>{},
  onClosed = ()=>{}
} = {}){
  const supported = isDocumentPipSupported();
  let pipWindow = null;
  let root = null;
  let openingPromise = null;
  let closeWhenReady = false;
  /* The PiP window's own lyric view mount, and the inputs it last rendered. */
  let lyricMount = null;
  let renderedLyrics = null;
  let renderedPlaying = null;

  function resetRenderCache(){
    if (lyricMount) lyricMount.destroy();
    lyricMount = null;
    renderedLyrics = null;
    renderedPlaying = null;
  }

  function clearWindow(windowRef, notify = true){
    if (pipWindow !== windowRef) return;
    pipWindow = null;
    root = null;
    resetRenderCache();
    if (notify) onClosed();
  }

  function isOpen(){
    if (!pipWindow) return false;
    if (pipWindow.closed){
      clearWindow(pipWindow);
      return false;
    }
    return true;
  }

  // Keep the active line pinned near the top after the window or the list resizes.
  function scrollToActive(){
    if (lyricMount) lyricMount.scrollToActive({ smooth: false });
  }

  /* Re-renders the PiP lyrics only when an input that changes the rows changed. */
  function renderLyrics(list, model){
    const song = model.song || null;
    const view = model.view || {};
    const inputs = {
      song,
      readingMode: view.readingMode,
      chantVersion: view.chantVersion,
      karaokeTiming: view.karaokeTiming || null,
      karaokeSources: view.karaokeSources || null,
      singAlong: view.singAlong || null
    };
    const changed = !renderedLyrics
      || Object.keys(inputs).some(key => inputs[key] !== renderedLyrics[key]);
    if (changed){
      if (song) lyricMount.render(song, inputs);
      else list.replaceChildren();
      renderedLyrics = inputs;
    }
    lyricMount.setBeat(model.beat || null);
    if (song && model.playhead) lyricMount.setPlayhead(model.playhead);
  }

  function render(model = {}){
    if (!root) return;

    const documentRef = root.ownerDocument;
    // Container classes come from the setting values, through the same
    // mapping as the song page. Simple mode is not one of them on purpose:
    // PiP has no video and sizes lyrics by its own window.
    const settings = model.container || {};
    const lyricsHidden = settings.showJapanese === false && settings.showChinese === false;

    const theme = model.theme === "light" ? "light" : "dark";
    documentRef.documentElement.dataset.theme = theme;
    root.dataset.theme = theme;
    applyLyricContainerClasses(root, {
      readingMode: settings.readingMode,
      showJapanese: settings.showJapanese !== false,
      showChinese: settings.showChinese !== false,
      karaokeEnabled: settings.karaokeEnabled === true,
      chantOnly: settings.chantOnly === true
    });
    const lyricScale = Number(model.lyricScale);
    if (Number.isFinite(lyricScale) && lyricScale > 0){
      root.style.setProperty("--lyric-scale", String(lyricScale));
    } else root.style.removeProperty("--lyric-scale");
    if (model.iconBeatDuration){
      root.style.setProperty("--icon-beat-duration", model.iconBeatDuration);
    } else root.style.removeProperty("--icon-beat-duration");

    const songNumber = root.querySelector(".pip-song-number");
    if (songNumber) songNumber.textContent = model.songNumber || "";

    const title = root.querySelector(".pip-title");
    if (title) title.textContent = model.title || "同步字幕";

    const progress = root.querySelector(".pip-progress");
    const progressFill = root.querySelector(".pip-progress-fill");
    if (progress && progressFill){
      const fraction = Math.max(0, Math.min(1, Number(model.progress) || 0));
      progress.setAttribute("aria-valuenow", String(Math.round(fraction * 100)));
      progress.setAttribute("aria-valuetext", model.progressText || "正在載入播放進度");
      progressFill.style.transform = `scaleX(${fraction})`;
    }

    const status = root.querySelector(".pip-status");
    if (status){
      status.textContent = model.status || "";
      status.hidden = !model.status;
    }

    const list = root.querySelector(".pip-lyrics-list");
    const empty = root.querySelector(".pip-empty");
    if (list && empty && lyricMount){
      const message = lyricsHidden ? "歌詞已隱藏" : (model.song ? "" : "等待歌詞載入…");
      empty.textContent = message;
      empty.hidden = !message;
      list.hidden = Boolean(message);
      renderLyrics(list, model);
    }

    const play = root.querySelector(".pip-play");
    if (play){
      const playing = model.isPlaying === true;
      play.disabled = model.canPlayPause !== true;
      // render() runs on every sync tick (~100ms). Swapping the icon each time
      // can remove the element a press started on, and the click gets lost,
      // so only touch the button when the play state actually changes.
      if (playing !== renderedPlaying){
        play.classList.toggle("is-playing", playing);
        play.querySelector(".pip-action-icon").innerHTML = playing ? PAUSE_SVG : PLAY_SVG;
        play.querySelector(".pip-action-label").textContent = playing ? "暫停" : "播放";
        play.setAttribute("aria-label", playing ? "暫停主頁影片" : "播放主頁影片");
        renderedPlaying = playing;
      }
    }

    const focus = root.querySelector(".pip-return");
    if (focus) focus.setAttribute("aria-label", "返回主頁");
    const previous = root.querySelector(".pip-prev");
    const nextControl = root.querySelector(".pip-next");
    if (previous) previous.disabled = model.canNavigate !== true;
    if (nextControl) nextControl.disabled = model.canNavigate !== true;

    documentRef.documentElement.lang = "zh-Hant-TW";
  }

  function buildWindow(nextWindow){
    const documentRef = nextWindow.document;
    documentRef.documentElement.lang = "zh-Hant-TW";
    documentRef.title = "同步字幕";
    documentRef.head.replaceChildren();
    documentRef.body.replaceChildren();
    copyStyles(document, documentRef);
    copyIconSprite(document, documentRef);

    const nextRoot = documentRef.createElement("main");
    nextRoot.className = "document-pip song-page";
    nextRoot.innerHTML = `
      <header class="pip-controls" aria-label="字幕窗控制">
        <div class="pip-progress" role="progressbar" aria-label="播放進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="正在載入播放進度">
          <span class="pip-progress-fill"></span>
        </div>
      </header>
      <p class="pip-status" role="status" aria-live="polite" hidden></p>
      <section class="pip-lyrics" aria-label="同步歌詞">
        <p class="pip-empty" hidden></p>
        <ul class="lyrics-list pip-lyrics-list"></ul>
      </section>
    `;

    const controls = nextRoot.querySelector(".pip-controls");
    controls.appendChild(actionButton(documentRef, "pip-return", "返回主頁", BACK_SVG, onFocusOpener));

    const trackControls = documentRef.createElement("div");
    trackControls.className = "pip-track-controls";
    trackControls.setAttribute("role", "group");
    trackControls.setAttribute("aria-label", "切換歌曲");
    trackControls.appendChild(actionButton(documentRef, "pip-prev", "上一首", TRACK_PREV_SVG, onPreviousSong));

    const songLabel = documentRef.createElement("div");
    songLabel.className = "pip-song-label";
    songLabel.setAttribute("aria-live", "polite");
    songLabel.innerHTML = `<span class="pip-song-number"></span><span class="pip-title"></span>`;
    trackControls.appendChild(songLabel);
    trackControls.appendChild(actionButton(documentRef, "pip-next", "下一首", TRACK_NEXT_SVG, onNextSong));
    controls.appendChild(trackControls);
    controls.appendChild(actionButton(documentRef, "pip-play", "播放", PLAY_SVG, onPlayPause));

    documentRef.body.appendChild(nextRoot);
    root = nextRoot;
    resetRenderCache();
    // PiP's own lyric view mount: rows are not clickable, the list always
    // follows playback and the current line is pinned near the top.
    const list = nextRoot.querySelector(".pip-lyrics-list");
    lyricMount = createLyricMount(list, {
      interactive: false,
      scrollAnchor: "top",
      autoScroll: true,
      scroller: nextRoot.querySelector(".pip-lyrics"),
      document: documentRef,
      topOffset: ACTIVE_LINE_TOP_OFFSET,
      keepLastActive: false
    });
    nextWindow.addEventListener("resize", scrollToActive);
    // The copied <link> stylesheets and web fonts load after the first render,
    // which changes every line's height and leaves the first scroll pointing at
    // empty space. Re-anchor whenever the list's size changes.
    const Observer = nextWindow.ResizeObserver;
    if (Observer && list) new Observer(scrollToActive).observe(list);
  }

  async function open(model = {}){
    if (!supported) return false;

    if (pipWindow && pipWindow.closed) clearWindow(pipWindow);
    if (pipWindow){
      render(model);
      try { pipWindow.focus(); } catch(e){}
      return true;
    }

    if (openingPromise){
      closeWhenReady = false;
      const opened = await openingPromise;
      if (opened && pipWindow){
        render(model);
        try { pipWindow.focus(); } catch(e){}
      }
      return opened;
    }

    closeWhenReady = false;
    openingPromise = (async ()=>{
      try {
        const nextWindow = await window.documentPictureInPicture.requestWindow({
          width: PIP_WIDTH,
          height: PIP_HEIGHT
        });
        if (closeWhenReady){
          try { nextWindow.close(); } catch(e){}
          return false;
        }
        pipWindow = nextWindow;
        buildWindow(nextWindow);
        nextWindow.addEventListener("pagehide", ()=>clearWindow(nextWindow), { once:true });
        render(model);
        return true;
      } catch(e){
        pipWindow = null;
        root = null;
        resetRenderCache();
        return false;
      }
    })();

    const opened = await openingPromise;
    openingPromise = null;
    return opened;
  }

  function update(model){
    if (isOpen()) render(model);
  }

  function close(){
    if (openingPromise){
      closeWhenReady = true;
      return;
    }
    const windowRef = pipWindow;
    if (!windowRef) return;
    clearWindow(windowRef);
    try { windowRef.close(); } catch(e){}
  }

  return Object.freeze({ supported, open, update, close, isOpen });
}
