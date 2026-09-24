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
const KARAOKE_DYNAMIC_CLASSES = new Set(["karaoke-lit", "karaoke-current"]);

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

function stableMarkup(markup){
  return String(markup || "")
    .replace(/\s+class="([^"]*)"/gu, (_match, value)=>{
      const classes = value
        .split(/\s+/u)
        .filter(name => name && !KARAOKE_DYNAMIC_CLASSES.has(name));
      return classes.length ? ` class="${classes.join(" ")}"` : "";
    })
    .replace(/\s+style="[^"]*"/gu, "");
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
  let currentMarkupKey = null;
  let nextMarkupKey = null;

  function resetRenderCache(){
    currentMarkupKey = null;
    nextMarkupKey = null;
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

  function replaceMarkup(target, markup, emptyMessage){
    target.replaceChildren();
    if (!markup){
      const empty = target.ownerDocument.createElement("p");
      empty.className = "pip-empty";
      empty.textContent = emptyMessage || "等待同步…";
      target.appendChild(empty);
      return;
    }

    const template = target.ownerDocument.createElement("template");
    template.innerHTML = markup;
    target.appendChild(template.content.cloneNode(true));
  }

  function render(model = {}){
    if (!root) return;

    const documentRef = root.ownerDocument;
    const showJapanese = model.showJapanese !== false;
    const showChinese = model.showChinese !== false;
    const lyricsHidden = !showJapanese && !showChinese;
    const currentMarkup = lyricsHidden ? "" : String(model.currentMarkup || "");
    const nextMarkup = lyricsHidden ? "" : String(model.nextMarkup || "");
    const currentEmptyMessage = lyricsHidden
      ? "歌詞已隱藏"
      : (currentMarkup ? "" : "等待第一句…");

    const theme = model.theme === "light" ? "light" : "dark";
    documentRef.documentElement.dataset.theme = theme;
    root.dataset.theme = theme;
    root.classList.toggle("reading-both", model.readingMode === "both");
    root.classList.toggle("hide-japanese", !showJapanese);
    root.classList.toggle("hide-chinese", !showChinese);
    root.classList.toggle("karaoke-off", model.karaokeEnabled === false);
    root.classList.toggle("lyrics-hidden", lyricsHidden);
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

    const current = root.querySelector(".pip-current-line");
    if (current){
      const key = `${stableMarkup(currentMarkup)}\u0000${currentEmptyMessage}`;
      if (key !== currentMarkupKey || !syncKaraokeState(current, currentMarkup)){
        replaceMarkup(current, currentMarkup, currentEmptyMessage);
        currentMarkupKey = key;
      }
    }

    const nextGroup = root.querySelector(".pip-next-group");
    const next = root.querySelector(".pip-next-line");
    if (nextGroup && next){
      nextGroup.hidden = !nextMarkup;
      const key = stableMarkup(nextMarkup);
      if (key !== nextMarkupKey || !syncKaraokeState(next, nextMarkup)){
        replaceMarkup(next, nextMarkup, "");
        nextMarkupKey = key;
      }
    }

    const play = root.querySelector(".pip-play");
    if (play){
      const playing = model.isPlaying === true;
      play.disabled = model.canPlayPause !== true;
      play.querySelector(".pip-action-icon").innerHTML = playing ? PAUSE_SVG : PLAY_SVG;
      play.querySelector(".pip-action-label").textContent = playing ? "暫停" : "播放";
      play.setAttribute("aria-label", playing ? "暫停主頁影片" : "播放主頁影片");
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
      <div class="pip-progress" role="progressbar" aria-label="播放進度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="正在載入播放進度">
        <span class="pip-progress-fill"></span>
      </div>
      <header class="pip-controls" aria-label="字幕窗控制"></header>
      <p class="pip-status" role="status" aria-live="polite" hidden></p>
      <section class="pip-lyrics" aria-label="同步歌詞">
        <div class="pip-line-group pip-current-group">
          <div class="pip-line-label">目前</div>
          <div class="pip-current-line"></div>
        </div>
        <div class="pip-line-group pip-next-group">
          <div class="pip-line-label">下一句</div>
          <div class="pip-next-line"></div>
        </div>
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
