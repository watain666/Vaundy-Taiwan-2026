import pipStyles from "./document-pip.css?inline";
import {
  BACK_SVG,
  PAUSE_SVG,
  PLAY_SVG,
  TRACK_NEXT_SVG,
  TRACK_PREV_SVG
} from "./ui/icons.js";

const PIP_WIDTH = 450;
const PIP_HEIGHT = 225;
// The active line sits near the top of the lyrics area so the space below
// goes to the upcoming line (PiP is often too short to show both centered).
const ACTIVE_LINE_TOP_OFFSET = 4;
// Song page classes that change how lyrics look; mirrored onto the PiP root.
// Simple mode is left out on purpose: PiP sizes lyrics by its own window.
const MIRRORED_PAGE_CLASSES = ["reading-both", "hide-japanese", "hide-chinese", "karaoke-off", "chant-only"];

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

function syncKaraokeState(target, markup){
  if (!target || !markup) return true;

  const template = target.ownerDocument.createElement("template");
  template.innerHTML = markup;
  const currentUnits = [...target.querySelectorAll(".karaoke-unit")];
  const nextUnits = [...template.content.querySelectorAll(".karaoke-unit")];
  if (currentUnits.length !== nextUnits.length) return false;

  currentUnits.forEach((unit, index)=>{
    const next = nextUnits[index];
    unit.classList.toggle("karaoke-lit", next.classList.contains("karaoke-lit"));
    unit.classList.toggle("karaoke-current", next.classList.contains("karaoke-current"));
    const progress = next.style.getPropertyValue("--karaoke-word-progress");
    if (progress) unit.style.setProperty("--karaoke-word-progress", progress);
    else unit.style.removeProperty("--karaoke-word-progress");
  });
  return true;
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
  let listKey = null;
  let renderedActiveIdx = null;
  let renderedPlaying = null;

  function resetRenderCache(){
    listKey = null;
    renderedActiveIdx = null;
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

  // Keep the active line pinned near the top of the lyrics area.
  function scrollToActive(smooth){
    if (!root) return;
    const scroller = root.querySelector(".pip-lyrics");
    const list = root.querySelector(".pip-lyrics-list");
    if (!scroller || !list) return;
    const line = list.querySelector(".lyric-line.active");
    if (!line){
      scroller.scrollTo({ top: 0 });
      return;
    }
    const lineRect = line.getBoundingClientRect();
    const boxRect = scroller.getBoundingClientRect();
    const top = scroller.scrollTop + (lineRect.top - boxRect.top) - ACTIVE_LINE_TOP_OFFSET;
    const reduceMotion = root.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduceMotion ? "smooth" : "auto" });
  }

  function render(model = {}){
    if (!root) return;

    const documentRef = root.ownerDocument;
    const showJapanese = model.showJapanese !== false;
    const showChinese = model.showChinese !== false;
    const lyricsHidden = !showJapanese && !showChinese;

    const theme = model.theme === "light" ? "light" : "dark";
    documentRef.documentElement.dataset.theme = theme;
    root.dataset.theme = theme;
    const pageClasses = new Set(Array.isArray(model.pageClasses) ? model.pageClasses : []);
    MIRRORED_PAGE_CLASSES.forEach(name => root.classList.toggle(name, pageClasses.has(name)));
    root.classList.toggle("lyrics-hidden", lyricsHidden);
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
    if (list && empty){
      const message = lyricsHidden ? "歌詞已隱藏" : (model.listMarkup ? "" : "等待歌詞載入…");
      empty.textContent = message;
      empty.hidden = !message;
      list.hidden = Boolean(message);

      let rebuilt = false;
      if (model.listKey !== listKey){
        list.innerHTML = String(model.listMarkup || "");
        listKey = model.listKey;
        renderedActiveIdx = null;
        rebuilt = true;
      }

      const activeIdx = Number.isInteger(model.activeIdx) ? model.activeIdx : -1;
      const lines = list.querySelectorAll(".lyric-line");
      const activeLine = activeIdx >= 0 ? lines[activeIdx] || null : null;
      if (activeIdx !== renderedActiveIdx){
        list.querySelectorAll(".lyric-line.active").forEach(line => line.classList.remove("active"));
        if (activeLine) activeLine.classList.add("active");
        renderedActiveIdx = activeIdx;
        scrollToActive(!rebuilt);
      } else if (rebuilt){
        scrollToActive(false);
      }
      if (activeLine && model.currentMarkup) syncKaraokeState(activeLine, model.currentMarkup);
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
    nextWindow.addEventListener("resize", ()=>scrollToActive(false));
    // The copied <link> stylesheets and web fonts load after the first render,
    // which changes every line's height and leaves the first scroll pointing at
    // empty space. Re-anchor whenever the list's size changes.
    const Observer = nextWindow.ResizeObserver;
    const list = nextRoot.querySelector(".pip-lyrics-list");
    if (Observer && list) new Observer(()=>scrollToActive(false)).observe(list);
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
