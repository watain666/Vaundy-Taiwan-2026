import { homeHtml } from "./ui/home.js";
import { siteFooterHtml } from "./ui/footer.js";
import {
  INFO_SVG,
  PLAY_SVG,
  PAUSE_SVG,
  MD_SVG,
  CHEVRON_SVG,
  WARN_SVG,
  useSvg,
  INLINE_ICONS,
  STATIC_MIC_SVG,
  CHEV_LEFT_SVG,
  CHEV_RIGHT_SVG,
  BACK_SVG,
  TRACK_PREV_SVG,
  TRACK_NEXT_SVG,
  PIP_SVG,
  CLOSE_SVG,
  SUN_SVG,
  MOON_SVG,
  CHANT_VERSION_ICONS
} from "./ui/icons.js";

import {
  SHOW_TIMELINE,
  SHOW_SCHEDULE,
  NOTICES,
  VAWS_PICS,
  PICS,
  SONGS,
  SONG_BPM,
  SETLIST_TOKYO,
  SEAT_VIEW,
  SEAT_BLOCKS,
  SEAT_GRADE,
  SEAT_HINT,
  SEAT_DIRS,
  FLOOR_WAIT
} from "./data.js";
import {
  CHANT_VERSIONS,
  CHANT_DIFFERENCES,
  DEFAULT_CHANT_VERSION,
  JP_CHANT_GUIDES,
  CHANT_REFERENCE_URL
} from "./chant-guide.js";
import { SONG_MARKS } from "./song-mark-metadata.js";
import { loadFurigana, loadKaraokeSources, loadSongLyrics } from "./services/lazy-modules.js";
import { loadJapaneseFontSubset } from "./services/japanese-font.js";
import { store } from "./services/storage.js";
import { createDocumentPip } from "./document-pip.js";

const appBaseUrl = import.meta.env?.BASE_URL || "./";

const app = document.getElementById("app");
const songView = document.getElementById("song-view");
let canReuseHome = true;
let countdownTimer = null;
let player = null;
let syncTimer = null;
let autoScrollEnabled = true;
let venueMode = false;          // 단축모드 (첫 실행 때 저장값을 읽어 옴)
const READING_MODES = ["kana", "romaji", "both"];
const storedReadingMode = store("horo-reading");
let readingMode = READING_MODES.includes(storedReadingMode) ? storedReadingMode : "kana";
let showJapanese = store("horo-show-japanese") !== "0";
let showChinese = store("horo-show-chinese") !== "0";
const storedChantVersion = store("horo-chant-version");
let chantVersion = storedChantVersion === "kr" ? "kr" : DEFAULT_CHANT_VERSION;
let chantNotesExpanded = false;
// 卡拉OK 預設關閉；若使用者曾手動選擇，則沿用保存的設定。
let karaokeEnabled = store("horo-karaoke") === "1";
let lastActiveIdx = -1;
let karaokeActiveLine = null;
let karaokeTiming = null;       // 對齊到目前 YouTube 影片的真實逐字時間
let karaokeLoadSeq = 0;         // 換歌時忽略上一首尚未完成的網路回應
let syncTicks = 0;      // 동기화가 몇 번 돌았는지 (진단용)
let syncErr   = "";     // 재생 위치 읽기 실패 메시지 (진단용)
let iconClockStartedAt = performance.now();

function attachManifest(){
  if (document.head.querySelector('link[rel="manifest"]')) return;
  const manifestLink = document.createElement("link");
  manifestLink.rel = "manifest";
  manifestLink.href = `${appBaseUrl}manifest.json`;
  document.head.appendChild(manifestLink);
}

window.addEventListener("load", ()=> window.setTimeout(attachManifest, 8000), { once: true });

/* ── 가사 넘어가는 속도 조절값 (이 세 값만 바꾸면 됨) ──────────────
   SYNC_INTERVAL_MS : 재생 위치를 확인하는 주기(ms). 작을수록 빨리 반응.
   LYRIC_LEAD_SEC   : 가사를 실제 타이밍보다 몇 초 먼저 넘길지.
                      떼창은 미리 보여야 따라 부르기 쉬우므로 살짝 앞당김.
   SCROLL_DURATION_MS : 스크롤 애니메이션 길이(ms). 작을수록 빠르게 이동. */
const SYNC_INTERVAL_MS   = 100;

/* 지금 폰에 깔려 있는 화면이 몇 번째 판인지 알려 주는 표시.
   새로 올렸는데 화면이 그대로일 때, 옛 판이 남아 있는지 바로 확인할 수 있다.
   sw.js 의 CACHE_VERSION 과 같이 올려 주세요. */
const BUILD = "v1.10.3";

const TRANSLATION_CREDIT_URL = "https://home.gamer.com.tw/profile/index.php?owner=tsukilsao319";
const CC_BY_NC_SA_URL = "https://creativecommons.org/licenses/by-nc-sa/4.0/";


function renderInlineMarkdown(value){
  let html = escapeHtml(value);
  const tokens = [];
  const stash = markup => {
    const token = `\u0000${tokens.length}\u0000`;
    tokens.push(markup);
    return token;
  };

  html = html.replace(/`([^`]+)`/g, (_, code) => stash(`<code>${code}</code>`));
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_, label, url) =>
    stash(`<a href="${url}" target="_blank" rel="noopener">${renderInlineMarkdown(label)}</a>`)
  );
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  return html.replace(/\u0000(\d+)\u0000/g, (_, index) => tokens[Number(index)] || "");
}

function renderChangelogMarkdown(markdown){
  const output = [];
  let listOpen = false;
  const closeList = ()=>{
    if (!listOpen) return;
    output.push("</ul>");
    listOpen = false;
  };

  String(markdown || "").replace(/\r\n?/g, "\n").split("\n").forEach(rawLine=>{
    const line = rawLine.trim();
    if (!line){
      closeList();
      return;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading){
      closeList();
      const level = heading[1].length;
      output.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      return;
    }

    if (line.startsWith("- ")){
      if (!listOpen){
        output.push("<ul>");
        listOpen = true;
      }
      output.push(`<li>${renderInlineMarkdown(line.slice(2))}</li>`);
      return;
    }

    closeList();
    output.push(`<p>${renderInlineMarkdown(line)}</p>`);
  });

  closeList();
  return output.join("");
}

/* 주소 뒤에 ?debug=1 을 붙이면 화면 위에 상태가 뜬다.
   "재생 중인 줄이 여러 개" 같은 문제가 폰에서만 날 때 원인을 보기 위한 것. */
const DEBUG = /[?&]debug=1/.test(location.search);
function setupDebugBadge(){
  if (!DEBUG) return;
  const el = document.createElement("div");
  el.id = "dbg";
  el.style.cssText = "position:fixed;left:6px;top:6px;z-index:9999;padding:5px 8px;"
    + "background:rgba(0,0,0,.82);color:#7CFF9B;font:11px/1.45 ui-monospace,monospace;"
    + "border-radius:7px;white-space:pre;pointer-events:none;max-width:92vw;";
  document.body.appendChild(el);
  setInterval(()=>{
    const lit = document.querySelectorAll(".lyric-line.active").length;
    const lists = document.querySelectorAll("#lyrics-list, .lyrics-list").length;
    let t = "-";
    try { if (player && player.getCurrentTime) t = player.getCurrentTime().toFixed(1); }
    catch(e){ t = "ERR"; }
    el.textContent =
      BUILD + "  틱 " + syncTicks + "\n"
      + "켜진 줄 " + lit + " (하나여야 정상)\n"
      + "idx " + lastActiveIdx + "  시간 " + t + "  목록 " + lists + "\n"
      + "타이머 " + (syncTimer ? "O" : "X") + "  감시 " + (activeGuardTimer ? "O" : "X")
      + (syncErr ? "\n오류 " + syncErr.slice(0,40) : "");
  }, 400);
}
const LYRIC_LEAD_SEC     = 0.35;
const SCROLL_DURATION_MS = 260;
const KARAOKE_TAIL_SEC   = 0.08;
const KARAOKE_UNIT_BEATS  = 0.65;
const PLAYBACK_RATE_OPTIONS = Object.freeze([0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]);
const PLAYBACK_RATE_STORAGE_KEY = "horo-playback-rate";
const storedPlaybackRate = Number(store(PLAYBACK_RATE_STORAGE_KEY));
let playbackRate = PLAYBACK_RATE_OPTIONS.includes(storedPlaybackRate)
  ? storedPlaybackRate
  : 1;
let availablePlaybackRates = [];

let scrollRafId = null;
let currentSong = null;
let songRenderToken = 0;
let songKeyHandler = null;   // 곡 화면 키보드 단축키(← → Esc) 핸들러

const themePreference = window.matchMedia("(prefers-color-scheme: dark)");
const storedTheme = store("horo-theme");
let currentTheme = storedTheme === "dark" ? "dark"
  : storedTheme === "light" ? "light"
  : themePreference.matches ? "dark" : "light";

const documentPip = createDocumentPip({
  onPlayPause: togglePlayback,
  onFocusOpener: ()=>{ try { window.focus(); } catch(e){} },
  onClosed: updateDocumentPipButton
});

function themeToggleHtml(extraClass = ""){
  return `<button class="theme-toggle ${extraClass}" type="button" data-theme-toggle></button>`;
}
function applyTheme(theme, save = false){
  currentTheme = theme;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#151619" : "#f5f5f7";
  if (save) store("horo-theme", theme);
  document.querySelectorAll("[data-theme-toggle]").forEach(button => {
    const label = theme === "dark" ? "淺色模式" : "深色模式";
    button.innerHTML = theme === "dark" ? SUN_SVG : MOON_SVG;
    button.setAttribute("aria-label", `切換至${label}`);
    button.setAttribute("title", `切換至${label}`);
  });
  updateDocumentPip();
}
document.addEventListener("click", event => {
  if (!event.target.closest("[data-theme-toggle]")) return;
  applyTheme(currentTheme === "dark" ? "light" : "dark", true);
});
if (themePreference.addEventListener){
  themePreference.addEventListener("change", event => {
    if (!store("horo-theme")) applyTheme(event.matches ? "dark" : "light");
  });
}

function chantVersionControlHtml(scope = "guide"){
  const label = scope === "song" ? "這首歌的應援版" : "應援版";
  return `
    <div class="chant-version-control" data-chant-version-control="${scope}">
      <span class="chant-version-control-label">${label}</span>
      <div class="chant-version-segment" role="group" aria-label="${label}">
        <button type="button" class="chant-version-option" data-chant-version="jp" aria-pressed="false">
          <span>${CHANT_VERSIONS.jp.label}</span>
        </button>
        <button type="button" class="chant-version-option" data-chant-version="kr" aria-pressed="false">
          <span>${CHANT_VERSIONS.kr.label}</span>
        </button>
      </div>
    </div>`;
}

function chantGuideFor(song = currentSong, version = chantVersion){
  if (!song) return null;
  return version === "jp" ? (JP_CHANT_GUIDES[song.id] || null) : null;
}

function chantVersionLabel(version = chantVersion){
  return CHANT_VERSIONS[version]?.label || CHANT_VERSIONS.jp.label;
}

function chantVersionIcon(version = chantVersion){
  return CHANT_VERSION_ICONS[version] || CHANT_VERSION_ICONS.jp;
}

function chantSourceInfoHtml(){
  return `<span class="chant-source-info">
    <b>應援版本說明</b>：預設為日本版，可用應援版本按鈕切換日本版／韓國版；切換後大合唱標記會同步更新。<br>
    <a href="${CHANT_REFERENCE_URL}" target="_blank" rel="noopener">日本版參考：Canva《VAUNDY 應援教學》↗</a>
  </span>`;
}

function applyChantVersionUi(){
  document.querySelectorAll("[data-chant-version]").forEach(button => {
    const active = button.dataset.chantVersion === chantVersion;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  document.querySelectorAll("[data-chant-version-flag]").forEach(el => {
    el.innerHTML = chantVersionIcon();
  });
  document.querySelectorAll("[data-chant-version-toggle]").forEach(button => {
    const isKorea = chantVersion === "kr";
    button.classList.toggle("active", isKorea);
    button.setAttribute("aria-pressed", isKorea ? "true" : "false");
    button.setAttribute("aria-label", `切換應援版本：目前${chantVersionLabel()}，點擊切換`);
    button.title = "點擊切換日本版／韓國版";
    const value = button.querySelector(".chant-version-value");
    if (value) value.innerHTML = chantVersionIcon();
  });
}

function renderChantVersionNote(song = currentSong){
  const el = document.getElementById("chant-version-note");
  if (!el) return;

  if (chantVersion === "kr"){
    el.innerHTML = `<b>${CHANT_VERSIONS.kr.label}</b>：使用韓國場應援標記。`;
    return;
  }

  const guide = chantGuideFor(song, "jp");
  if (!guide){
    el.innerHTML = `<b>${CHANT_VERSIONS.jp.label}</b>：這首歌目前沒有獨立的日本版提示，暫沿用現有標記。`;
    return;
  }

  el.innerHTML = `<b>${CHANT_VERSIONS.jp.label}</b>：歌詞旁的麥克風圖示就是日本版大合唱段落。`;
}

function renderChantNotes(song = currentSong){
  const button = document.getElementById("chant-notes-toggle");
  const panel = document.getElementById("chant-notes");
  const list = document.getElementById("chant-notes-list");
  if (!button || !panel || !list) return;

  const guide = chantVersion === "jp" ? chantGuideFor(song, "jp") : null;
  const notes = guide && Array.isArray(guide.notes)
    ? guide.notes.filter(note => typeof note === "string" && note.trim())
    : [];

  const hasNotes = notes.length > 0;
  const expanded = hasNotes && chantNotesExpanded;
  button.hidden = !hasNotes;
  button.classList.toggle("active", expanded);
  button.setAttribute("aria-expanded", expanded ? "true" : "false");
  panel.hidden = !expanded;
  list.innerHTML = notes.map(note => `<li>${escapeHtml(note)}</li>`).join("");
}

document.addEventListener("click", event => {
  const button = event.target.closest("[data-chant-version]");
  if (!button) return;
  const next = button.dataset.chantVersion;
  if (next !== "jp" && next !== "kr") return;
  setChantVersion(next);
});

document.addEventListener("click", event => {
  const button = event.target.closest("[data-chant-version-toggle]");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  if (button.id === "guide-chant-version-btn") {
    pendingVideoId = null;
    if (player && typeof player.pauseVideo === "function") {
      try { player.pauseVideo(); } catch(e){}
    }
  }
  setChantVersion(chantVersion === "jp" ? "kr" : "jp");
});

document.addEventListener("click", event => {
  const button = event.target.closest("#chant-notes-toggle");
  if (!button || button.hidden) return;
  const panel = document.getElementById(button.getAttribute("aria-controls") || "chant-notes");
  if (!panel) return;
  const open = button.getAttribute("aria-expanded") !== "true";
  chantNotesExpanded = open;
  button.classList.toggle("active", open);
  button.setAttribute("aria-expanded", open ? "true" : "false");
  panel.hidden = !open;
});

function pad(n){ return String(n).padStart(2,"0"); }

function router({ resetScroll = true } = {}){
  cancelJapaneseFontLoad();
  songListComplete = null;
  stopCountdown();
  teardownSetlistReveal();
  const hash = location.hash.replace(/^#\/?/, "");
  let song = null;
  if (hash.startsWith("song/")) {
    const raw = hash.slice(5);
    // 곡 id에 따옴표 등이 들어가면 브라우저가 %27 처럼 인코딩할 수 있으므로 되돌려서 비교
    let id = raw;
    try { id = decodeURIComponent(raw); } catch(e) { /* 잘못된 인코딩이면 원문 그대로 */ }
    song = SONGS.find(s => s.id === id) || SONGS.find(s => s.id === raw) || null;
  }

  if (song) {
    renderSong(song);
  } else if (hash === "guide") {
    leaveSongView();
    setSongFrom("guide");
    renderGuide();
  } else if (hash === "setlist") {
    leaveSongView();
    renderSetlist();
  } else {
    leaveSongView();
    setSongFrom("guide");
    resetSetlistSpoiler();   // 홈에 나온 순간 셋리스트는 처음 상태로
    renderHome();
  }
  if (resetScroll) window.scrollTo(0,0);
  applyTheme(currentTheme);
}

/* ---------------- HOME ---------------- */

function seatBlockSvg(b){
  if (b.grade === "w")     return `<polygon class="seat-wheel" points="${b.pts}"></polygon>`;
  if (b.grade === "stage") return `<polygon class="seat-stage" points="${b.pts}"></polygon>`
                                + `<text class="seat-stage-t" x="${b.x}" y="${b.y}">STAGE</text>`;
  const fs = b.grade === "floor" ? 30 : 16;
  return `<g class="seat-blk ${b.grade}" data-id="${b.id}" role="button" tabindex="0" aria-label="${b.id}區">`
       + `<polygon points="${b.pts}"></polygon>`
       + `<text x="${b.x}" y="${b.y}" font-size="${fs}">${b.id}</text>`
       + `</g>`;
}

function seatMapSvg(){
  // 휠체어석·무대는 구역 위에 겹쳐 그린다
  const order = (g) => g === "w" || g === "stage" ? 1 : 0;
  const list = SEAT_BLOCKS.slice().sort((a, b) => order(a.grade) - order(b.grade));
  return `<svg class="seat-map" viewBox="-5 -5 ${SEAT_VIEW.w + 10} ${SEAT_VIEW.h + 10}"`
       + ` role="img" aria-label="台北小巨蛋座位配置圖">`
       + list.map(seatBlockSvg).join("")
       + `</svg>`;
}

/* 고른 구역이 배치도에서 어디쯤인지 말로 알려 준다 —
   무대가 한가운데라 '앞뒤'가 없으므로, 배치도 기준 여덟 방향으로 알려 준다. */
function seatWhere(b){
  const dx = b.x - SEAT_VIEW.cx, dy = b.y - SEAT_VIEW.cy;
  const deg = (Math.atan2(dy, dx) * 180 / Math.PI + 450) % 360;   // 0 = 위쪽, 시계 방향
  return "配置圖的" + SEAT_DIRS[Math.round(deg / 45) % 8];
}


function seatReadoutHtml(b){
  const g = SEAT_GRADE[b.grade];
  const wait = FLOOR_WAIT[b.id];
  const tail = b.grade === "floor"
    ? (wait
        ? `入場前請依現場公告前往 <span class="hi">${wait}側站席等候區</span>。詳細位置請查看「公告・指南」中的場館地圖。`
        : "這是環繞舞台的站席區域。入場順序請依演出當天現場指示。")
    : `<span class="warn">A 排・B 排可能因安全欄杆而有些許視線遮擋。</span>`;
  return `<span class="grade ${g.cls}">${g.label}</span><b>${escapeHtml(b.id)}區</b>・${seatWhere(b)}`
       + `<br>${tail} <button type="button" class="seat-clear">取消選取</button>`;
}

/* 카드 안 내용이 바뀌면 펼쳐진 높이를 다시 잡아 준다.
   (이걸 안 하면 구역을 눌렀을 때 늘어난 글이 카드 아래로 잘린다) */
function refreshAccordion(el){
  const card = el && el.closest ? el.closest(".info-card") : null;
  if (!card || !card.classList.contains("open")) return;
  const panel = card.querySelector(".info-panel");
  if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
}

/* ─────────────────────────────────────────────────────────────
   공지 · 안내 이미지
   · images/notice/ 에 실제로 들어 있는 파일만 화면에 나옵니다.
     (파일이 없으면 그 칸은 조용히 사라집니다)
   · 탭하면 전체화면으로 크게 볼 수 있어요.
   ───────────────────────────────────────────────────────────── */
let noticeReady = [];   // 실제로 불러와진 공지들 (공지 · 안내 카드)
let vawsReady   = [];   // VAWS 카드 안에 들어가는 사진들
let viewList    = [];   // 크게 보기가 지금 넘기고 있는 목록
let viewIdx     = 0;
let noticeTrigger = null;
let changelogTrigger = null;
let changelogOwner = null;
let changelogSourcePromise = null;
let japaneseFontScheduleToken = 0;
let japaneseFontInteractionCleanup = null;

function scheduleJapaneseFontLoad(text, weights, { idle = false } = {}){
  const token = ++japaneseFontScheduleToken;
  const load = ()=>{
    if (token !== japaneseFontScheduleToken) return;
    loadJapaneseFontSubset(text, weights);
  };
  if (idle){
    const scheduleIdle = ()=>{
      if (typeof window.requestIdleCallback === "function"){
        window.requestIdleCallback(load, { timeout: 1500 });
      } else {
        window.setTimeout(load, 1500);
      }
    };
    if (typeof window.requestAnimationFrame === "function"){
      window.requestAnimationFrame(scheduleIdle);
    } else {
      scheduleIdle();
    }
    return;
  }
  if (typeof window.requestAnimationFrame === "function"){
    window.requestAnimationFrame(()=> window.setTimeout(load, 0));
  } else {
    window.setTimeout(load, 0);
  }
}

function cancelJapaneseFontLoad(){
  japaneseFontScheduleToken++;
  japaneseFontInteractionCleanup?.();
  japaneseFontInteractionCleanup = null;
}

function scheduleJapaneseFontAfterInteraction(text, weights, routeHash){
  japaneseFontInteractionCleanup?.();
  // Ignore programmatic route scrolling; load only after a real user interaction.
  const events = ["pointerdown", "keydown", "touchstart"];
  const onInteraction = ()=>{
    if (location.hash !== routeHash){
      japaneseFontInteractionCleanup?.();
      japaneseFontInteractionCleanup = null;
      return;
    }
    japaneseFontInteractionCleanup?.();
    japaneseFontInteractionCleanup = null;
    scheduleJapaneseFontLoad(text, weights, { idle: true });
  };
  const cleanup = ()=>{
    events.forEach(type => window.removeEventListener(type, onInteraction));
  };
  japaneseFontInteractionCleanup = cleanup;
  events.forEach(type => window.addEventListener(type, onInteraction, { passive: true }));
}

function guideJapaneseFontText(){
  return SONGS.map(song => japaneseTitleText(song.title)).join("");
}

function japaneseTitleText(title){
  const value = String(title ?? "");
  const match = value.match(/\(([^()]*)\)/);
  return match ? match[1] : value;
}

function songJapaneseFontText(song){
  const guide = chantGuideFor(song, "jp");
  return [
    japaneseTitleText(song.title),
    ...(song.lyrics || []).map(line => line.jp || ""),
    ...(guide?.chantSegments || []).map(segment => segment.text || "")
  ];
}

/* 사진 목록을 받아 눌러서 크게 볼 수 있는 격자를 만든다.
   · 파일이 없는 칸은 조용히 사라진다 (깨지지 않음)
   · 다 불러오면 카드 높이를 다시 재고, 오프라인용으로도 저장해 둔다
   같은 코드를 '공지 · 안내' 와 'VAWS 회원 티켓 카드' 두 곳에서 같이 쓴다. */
function buildPicGrid(grid, list, ready, emptyEl){
  if (!grid || grid.dataset.loaded === "1") return;
  grid.dataset.loaded = "1";
  grid.innerHTML = "";
  ready.length = 0;

  let pending = list.length;
  const done = ()=>{
    if (--pending > 0) return;
    if (emptyEl) emptyEl.hidden = ready.length > 0;
    refreshAccordion(grid);
    cachePicsForOffline(ready);
  };
  if (!pending){ if (emptyEl) emptyEl.hidden = false; return; }

  list.forEach((n)=>{
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "notice-item";
    btn.hidden = true;
    btn.innerHTML = `<img alt="${escapeHtml(n.title)}" decoding="async">`
                  + `<span class="cap">${escapeHtml(n.title)}</span>`;
    const img = btn.querySelector("img");
    img.loading = "lazy";
    if (Number.isFinite(Number(n.width)) && Number.isFinite(Number(n.height))){
      img.width = Number(n.width);
      img.height = Number(n.height);
    }

    img.addEventListener("load", ()=>{
      btn.hidden = false;
      // 가로로 긴 사진이면 한 줄을 통째로 쓴다 (잘리지 않도록)
      if (img.naturalWidth > img.naturalHeight * 1.05) btn.classList.add("wide");
      ready.push(n);
      // 등록한 순서대로 보이도록 정렬
      ready.sort((a,b)=> list.indexOf(a) - list.indexOf(b));
      btn.addEventListener("click", ()=> openViewer(ready, ready.indexOf(n)));
      refreshAccordion(grid);
      done();
    }, { once:true });

    img.addEventListener("error", ()=>{ btn.remove(); done(); }, { once:true });
    img.src = n.src;
    grid.appendChild(btn);
  });
}

function setupNotices(){
  const grid = document.getElementById("notice-grid");
  if (!grid || grid.dataset.loaded === "1") return;
  buildPicGrid(grid, NOTICES, noticeReady,
               document.getElementById("notice-empty"));
}

function setupVawsPics(){
  const grid = document.getElementById("vaws-grid");
  if (!grid || grid.dataset.loaded === "1") return;
  buildPicGrid(grid, VAWS_PICS, vawsReady, null);
}

/* 공지 이미지도 오프라인용으로 저장해 둔다 (공연장에서 데이터가 안 터져도 보이도록) */
function cachePicsForOffline(ready){
  if (!("serviceWorker" in navigator) || !ready.length) return;
  const urls = ready.map(n => n.src);
  navigator.serviceWorker.ready
    .then(reg => reg.active && reg.active.postMessage({ type:"CACHE_URLS", urls }))
    .catch(()=>{});
}

function openViewer(list, i){
  if (!list || !list.length) return;
  const view = document.getElementById("notice-view");
  if (!view) return;
  viewList = list;
  viewIdx  = Math.max(0, Math.min(list.length - 1, i));
  noticeTrigger = document.activeElement;
  paintNotice();
  view.inert = false;
  view.classList.add("open");
  view.setAttribute("aria-hidden", "false");
  app.inert = true;
  document.body.classList.add("no-scroll");
  const close = document.getElementById("nv-close");
  if (close) close.focus();
}

function closeNotice(){
  const view = document.getElementById("notice-view");
  if (!view) return;
  view.classList.remove("open", "zoom");
  view.setAttribute("aria-hidden", "true");
  view.inert = true;
  app.inert = false;
  document.body.classList.remove("no-scroll");
  if (noticeTrigger && noticeTrigger.isConnected) noticeTrigger.focus();
  noticeTrigger = null;
}

function paintNotice(){
  const n = viewList[viewIdx];
  if (!n) return;
  const view  = document.getElementById("notice-view");
  const img   = document.getElementById("nv-img");
  const title = document.getElementById("nv-title");
  const count = document.getElementById("nv-count");
  const prev  = document.getElementById("nv-prev");
  const next  = document.getElementById("nv-next");
  const zoom  = document.getElementById("nv-zoom");
  const scr   = document.getElementById("nv-scroll");

  if (img){
    img.src = n.src;
    img.alt = n.title;
    if (Number.isFinite(Number(n.width)) && Number.isFinite(Number(n.height))){
      img.width = Number(n.width);
      img.height = Number(n.height);
    }
  }
  if (title) title.textContent = n.title;
  if (count) count.textContent = (viewIdx + 1) + " / " + viewList.length;
  if (prev) prev.disabled = viewIdx === 0;
  if (next) next.disabled = viewIdx === viewList.length - 1;
  if (view) view.classList.remove("zoom");
  if (zoom) zoom.textContent = "放大";
  if (scr){ scr.scrollTop = 0; scr.scrollLeft = 0; }
}

function noticeStep(d){
  const i = viewIdx + d;
  if (i < 0 || i >= viewList.length) return;
  viewIdx = i;
  paintNotice();
}

function setupNoticeViewer(){
  const view = document.getElementById("notice-view");
  if (!view || view.dataset.wired) return;
  view.dataset.wired = "1";

  const zoom = document.getElementById("nv-zoom");
  const scr  = document.getElementById("nv-scroll");

  const toggleZoom = ()=>{
    const on = view.classList.toggle("zoom");
    if (zoom) zoom.textContent = on ? "縮小" : "放大";
    if (scr && on){
      // 확대하면 가운데가 보이도록
      scr.scrollLeft = (scr.scrollWidth - scr.clientWidth) / 2;
    }
  };

  const close = document.getElementById("nv-close");
  const prev  = document.getElementById("nv-prev");
  const next  = document.getElementById("nv-next");
  if (close) close.addEventListener("click", closeNotice);
  if (prev)  prev.addEventListener("click", ()=> noticeStep(-1));
  if (next)  next.addEventListener("click", ()=> noticeStep(1));
  if (zoom)  zoom.addEventListener("click", toggleZoom);
  const nvImg = document.getElementById("nv-img");
  if (nvImg) nvImg.addEventListener("click", toggleZoom);

  // 사진 바깥(빈 곳)을 누르면 닫힌다
  if (scr) scr.addEventListener("click", (e)=>{ if (e.target === scr) closeNotice(); });

  document.addEventListener("keydown", (e)=>{
    if (!view.classList.contains("open")) return;
    if (e.key === "Escape"){ e.preventDefault(); closeNotice(); }
    else if (e.key === "ArrowLeft")  { e.preventDefault(); noticeStep(-1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); noticeStep(1); }
    else if (e.key === "Tab"){
      const focusable = [...view.querySelectorAll("button")].filter(el => !el.disabled && el.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });

  // 좌우로 밀어서 넘기기
  let sx = 0, sy = 0, moved = false;
  view.addEventListener("touchstart", (e)=>{
    if (view.classList.contains("zoom")) return;
    const t = e.touches[0]; sx = t.clientX; sy = t.clientY; moved = false;
  }, { passive:true });
  view.addEventListener("touchend", (e)=>{
    if (view.classList.contains("zoom") || moved) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) noticeStep(dx < 0 ? 1 : -1);
  }, { passive:true });
}

function loadChangelogSource(){
  if (!changelogSourcePromise){
    changelogSourcePromise = import("../CHANGELOG.md?raw")
      .then(module => module.default || "")
      .catch(() => "");
  }
  return changelogSourcePromise;
}

function openChangelog(){
  const view = document.getElementById("changelog-view");
  const content = document.getElementById("changelog-content");
  if (!view || !content) return;

  if (content.dataset.rendered !== "1"){
    if (content.dataset.loading !== "1"){
      content.dataset.loading = "1";
      content.textContent = "載入版本記錄…";
      loadChangelogSource().then(source => {
        if (content.dataset.rendered === "1") return;
        content.innerHTML = source
          ? renderChangelogMarkdown(source)
          : "<p>版本記錄暫時無法載入。</p>";
        content.dataset.rendered = "1";
      });
    }
  }

  changelogTrigger = document.activeElement;
  changelogOwner = isSongViewActive() ? songView : app;
  changelogOwner.inert = true;
  view.inert = false;
  view.classList.add("open");
  view.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  const scroll = document.getElementById("changelog-scroll");
  if (scroll) scroll.scrollTop = 0;
  const close = document.getElementById("changelog-close");
  if (close) close.focus();
}

function closeChangelog(){
  const view = document.getElementById("changelog-view");
  if (!view) return;
  view.classList.remove("open");
  view.setAttribute("aria-hidden", "true");
  view.inert = true;
  if (changelogOwner) changelogOwner.inert = false;
  changelogOwner = null;
  document.body.classList.remove("no-scroll");
  if (changelogTrigger && changelogTrigger.isConnected) changelogTrigger.focus();
  changelogTrigger = null;
}

function setupChangelogModal(){
  const view = document.getElementById("changelog-view");
  if (!view || view.dataset.wired) return;
  view.dataset.wired = "1";

  const close = document.getElementById("changelog-close");
  const scroll = document.getElementById("changelog-scroll");
  if (close) close.addEventListener("click", closeChangelog);
  if (view) view.addEventListener("click", event=>{
    if (event.target === view || event.target === scroll) closeChangelog();
  });

  document.addEventListener("click", event=>{
    const trigger = event.target.closest && event.target.closest("[data-open-changelog]");
    if (!trigger) return;
    event.preventDefault();
    openChangelog();
  });

  document.addEventListener("keydown", event=>{
    if (!view.classList.contains("open")) return;
    if (event.key === "Escape"){
      event.preventDefault();
      closeChangelog();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [...view.querySelectorAll("button, a[href]")]
      .filter(el => !el.disabled && el.offsetParent !== null);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first){
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last){
      event.preventDefault();
      first.focus();
    }
  });
}

function setupSeatMap(){
  const svg = document.querySelector(".seat-map");
  const out = document.getElementById("seat-readout");
  if (!svg || !out) return;

  const blocks = [...svg.querySelectorAll(".seat-blk")];

  const show = (id, save) => {
    blocks.forEach(el => el.classList.remove("selected"));
    const b = id ? SEAT_BLOCKS.find(x => x.id === id) : null;
    if (!b){
      out.textContent = SEAT_HINT;
      if (save) store("horo-seat", "");
      refreshAccordion(out);
      return;
    }
    const g = blocks.find(el => el.dataset.id === id);
    if (g) g.classList.add("selected");
    out.innerHTML = seatReadoutHtml(b);
    if (save) store("horo-seat", id);
    refreshAccordion(out);
  };

  svg.addEventListener("click", (e)=>{
    const g = e.target.closest && e.target.closest(".seat-blk");
    if (!g) return;
    // 같은 구역을 다시 누르면 선택이 풀린다
    show(g.classList.contains("selected") ? null : g.dataset.id, true);
  });
  svg.addEventListener("keydown", (e)=>{
    if (e.key !== "Enter" && e.key !== " ") return;
    const g = e.target.closest && e.target.closest(".seat-blk");
    if (!g) return;
    e.preventDefault();
    show(g.classList.contains("selected") ? null : g.dataset.id, true);
  });
  out.addEventListener("click", (e)=>{
    if (e.target.closest(".seat-clear")) show(null, true);
  });

  const saved = store("horo-seat");
  if (saved && SEAT_BLOCKS.some(b => b.id === saved)) show(saved, false);
  else out.textContent = SEAT_HINT;
}

function renderHome(){
  // Keep the built homepage in place while attaching its behavior.
  if (!canReuseHome || !app.querySelector(".hero")){
    app.innerHTML = homeHtml(BUILD, themeToggleHtml("home-theme"));
  }
  canReuseHome = false;

  document.getElementById("guide-btn").addEventListener("click", ()=>{ location.hash = "#/guide"; });
  document.getElementById("setlist-btn").addEventListener("click", ()=>{ location.hash = "#/setlist"; });
  setupAccordions();
  setupNoticeViewer();
  setupSeatMap();
  setupHomeExtras();
  startCountdown();
}

// CSS centers the closed homepage without a synchronous startup layout.
// Freeze that space when a card opens so the heading stays in place.
function freezeHeroSpacing(card){
  const inner = card.closest(".hero-inner");
  if (!inner || inner.style.marginTop) return;
  inner.style.marginTop = getComputedStyle(inner).marginTop;
  inner.style.marginBottom = "0px";
}
let lastHeroWidth = null;
window.addEventListener("resize", ()=>{
  if (window.innerWidth === lastHeroWidth) return;
  lastHeroWidth = window.innerWidth;
  const inner = document.querySelector(".hero-inner");
  if (inner && !inner.querySelector(".info-card.open")){
    inner.style.marginTop = "";
    inner.style.marginBottom = "";
  }
});

/* 홈 화면 "공연 정보" 아코디언 — 클릭 시 관객 입장안내가 아래로 펼쳐짐 */
/* 공연 정보 · 준비물 · 가는 길 — 접었다 펴는 카드 전부에 동일하게 적용 */
function setupAccordions(){
  document.querySelectorAll(".info-card").forEach(card => setupOneAccordion(card));
}
function setupOneAccordion(card){
  const btn   = card.querySelector(".info-toggle");
  const panel = card.querySelector(".info-panel");
  if (!card || !btn || !panel) return;

  btn.addEventListener("click", ()=>{
    const isOpen = card.classList.contains("open");
    if (isOpen){
      panel.inert = true;
      panel.setAttribute("aria-hidden", "true");
      // 닫기: 현재 높이에서 0으로 애니메이션
      panel.style.maxHeight = panel.scrollHeight + "px";
      requestAnimationFrame(()=>{
        card.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = "0px";
      });
    } else {
      freezeHeroSpacing(card);
      const template = panel.querySelector(":scope > .info-panel-template");
      if (template) panel.replaceChild(template.content.cloneNode(true), template);
      panel.inert = false;
      panel.setAttribute("aria-hidden", "false");
      card.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      panel.querySelectorAll("img[data-src]").forEach(img => {
        img.src = img.dataset.src;
        delete img.dataset.src;
      });
      if (card.id === "notice-card") setupNotices();
      if (card.id === "vaws-card") setupVawsPics();
      if (card.id === "way-card") setupAddressCopy();
      panel.style.maxHeight = panel.scrollHeight + "px";
      // 이후 내부 콘텐츠 크기 변화(폰트 로딩 등)에도 대응해 살짝 여유를 둠
      // (스크롤은 건드리지 않음 — 화면은 사용자가 직접 내리도록 둠)
      setTimeout(()=>{
        if (!card.classList.contains("open")) return;
        panel.style.maxHeight = panel.scrollHeight + "px";
      }, 300);
    }
  });
}

/* ---------------- CHANT GUIDE (song list) ---------------- */
function renderGuide(){
  app.innerHTML = `
    <div class="guide-page">
      <div class="song-topbar">
        <button class="back-btn" id="back-btn" aria-label="返回首頁" title="返回首頁">${BACK_SVG}</button>
        ${themeToggleHtml()}
      </div>

      <section class="songs-section">
        <div class="songs-head">
          <h1>應援指南 無劇透</h1>
          <p>選擇歌曲，搭配影片查看歌詞與大合唱重點</p>
          <div class="song-legend">
            <span class="legend-item"><span class="legend-icon chant">${INLINE_ICONS.mic}</span>大合唱 <b class="legend-num">12</b> 行</span>
            <span class="legend-item"><span class="legend-icon clap">${INLINE_ICONS.clap}</span>拍手</span>
            <span class="legend-item"><span class="legend-icon wave">${INLINE_ICONS.wave}</span>揮手</span>
            <span class="legend-item"><span class="legend-icon jump">${INLINE_ICONS.jump}</span>跳躍</span>
            <span class="legend-item"><span class="legend-icon spin">${INLINE_ICONS.spin}</span>轉臂</span>
          </div>
          <p class="song-legend-note">數字代表目前應援版本的大合唱歌詞行數。<br>切換歌曲時會依目前排序移動。<br>拍手・揮手提示會顯示在歌曲頁面。</p>
        </div>
        <details class="chant-source-details" id="guide-chant-source">
          <summary>應援版本說明</summary>
          <div id="guide-chant-source-content"></div>
        </details>
        <div class="song-search-sentinel" id="song-search-sentinel"></div>
        <div class="song-search">
          <label class="search-label" for="song-search-input">搜尋歌曲</label>
          <div class="song-search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>
            <input id="song-search-input" type="search" inputmode="search" autocomplete="off"
                   placeholder="搜尋歌曲名稱・編號">
            <button type="button" class="song-search-clear" id="song-search-clear" aria-label="清除">✕</button>
          </div>
        </div>
        <div class="song-sorts" role="group" aria-label="歌曲清單排序">
          <button class="song-sort" type="button" data-sort="default">預設</button>
          <button class="song-sort" type="button" data-sort="title" id="sort-title">名稱</button>
          <button class="song-sort" type="button" data-sort="chant" id="sort-chant">大合唱</button>
        </div>
        <div class="song-search-meta"><span id="song-count">共 ${SONGS.length} 首</span></div>
        <p class="song-empty" id="song-empty" hidden><b>找不到歌曲</b>請輸入部分歌曲名稱或歌曲編號</p>
        <ul class="song-list" id="song-list"></ul>
      </section>

      ${siteFooterHtml(BUILD)}
    </div>
  `;

  document.getElementById("back-btn").addEventListener("click", ()=>{ location.hash = "#/"; });
  const sourceDetails = document.getElementById("guide-chant-source");
  const sourceContent = document.getElementById("guide-chant-source-content");
  sourceDetails?.addEventListener("toggle", ()=>{
    if (!sourceDetails.open || !sourceContent || sourceContent.dataset.loaded === "1") return;
    sourceContent.innerHTML = `${chantSourceInfoHtml()}
      <section class="chant-differences" aria-labelledby="chant-differences-title">
        <div class="chant-differences-head">
          <h2 id="chant-differences-title">日本版／韓國版差異</h2>
          <button type="button" class="chant-differences-current chant-version-current" id="guide-chant-version-btn" data-chant-version-toggle aria-pressed="false" aria-label="切換應援版本：目前${chantVersionLabel()}，點擊切換">
            目前 <span data-chant-version-flag aria-hidden="true">${chantVersionIcon()}</span>
          </button>
        </div>
        <ul>${CHANT_DIFFERENCES.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <p class="chant-differences-footnote">未列入日本版歌單的歌曲會暫沿用現有標記，現場仍以 Vaundy 與觀眾的即時引導為準。</p>
      </section>`;
    sourceContent.dataset.loaded = "1";
    applyChantVersionUi();
  });
  applyChantVersionUi();

  // 정렬 칩 — '떼창'은 다시 누르면 많은 순 ↔ 적은 순이 바뀐다
  app.querySelectorAll(".song-sort").forEach(b=>{
    b.addEventListener("click", ()=>{
      const kind = b.dataset.sort;
      // 같은 칩을 다시 누르면 순서가 뒤집힌다
      if (kind === "chant")      songSort = (songSort === "chant-desc") ? "chant-asc" : "chant-desc";
      else if (kind === "title") songSort = (songSort === "title")      ? "title-desc" : "title";
      else                       songSort = kind;
      store("horo-song-sort", songSort);
      paintSongList({ eager: true });
    });
  });

  setupSongSearch();
  paintSongList();
  scheduleJapaneseFontAfterInteraction(guideJapaneseFontText(), [500], "#/guide");
}

/* ---------------- SETLIST (스포일러) ----------------
   보기 방식을 직접 고르기 전까지 목록 데이터를 화면에 넣지 않는다. */
let setlistScrollHandler = null;

/* ── 곡 화면에서 '뒤로'를 눌렀을 때 돌아갈 곳 ──────────────────
   새로고침 뒤에는 셋리스트 맥락을 복원하지 않아 순서가 노출되지 않는다. */
let songFrom = "guide";
function setSongFrom(v){
  songFrom = (v === "setlist") ? "setlist" : "guide";
}
function songBackHash(){ return songFrom === "setlist" ? "#/setlist" : "#/guide"; }

function teardownSetlistReveal(){
  if (setlistScrollHandler){
    window.removeEventListener("scroll", setlistScrollHandler);
    setlistScrollHandler = null;
  }
}

function setlistTitle(entry){
  const s = SONGS.find(x => x.id === entry.id);
  return s ? s.title : (entry.title || entry.id);
}

/* 歌名通常是「中文譯名 (日文原題)」；只把括號內原題標成日文，
   日文與中文歌詞都沿用台灣系統字體堆疊顯示。 */
function renderSongTitle(title){
  return escapeHtml(String(title ?? "")).replace(/\(([^()]*)\)/g,
    (_, original) => `(<span lang="ja">${original}</span>)`);
}

/* ── 셋리스트 보기 상태 ──────────────────────────────────────
   mode "order"  : 실제 공연 순서 (번호 있음, 토·일로 갈린 자리도 그대로)
   mode "random" : 순서를 감추고 곡을 하나씩 섞어서 보여 줌
                   (번호 없음, 토·일 구분도 없음 — 둘 다 순서 단서가 되므로)

   보기 방식은 가림막을 걷기 '전에' 고른다. 스크롤만 내려도 목록이 드러나면
   랜덤을 고르기 전에 실제 순서를 보게 되어 스포가 되기 때문이다.

   섞은 순서는 저장해 둔다. 곡을 보고 뒤로 돌아와도 같은 화면이 다시 나오므로
   실제 순서가 드러나지 않는다. */
let setlistMode     = "random";
let setlistShuffle  = null;   // 섞은 순서 (곡 키 배열)
let setlistRevealed = false;  // 가림막을 이미 걷었는지 (이번 방문 동안)
let setlistScrollY  = 0;      // 곡을 보러 가기 전 스크롤 위치

/* 홈으로 나가면 셋리스트를 처음 상태로 되돌린다.
   · 곡을 보러 갔다 '뒤로' 오는 건 보던 화면 그대로 (중간에 끊기면 불편하므로)
   · 홈까지 나갔다가 다시 들어오면 → 스포주의 화면부터 다시
   옆 사람에게 폰을 건네줬을 때 실수로 순서가 보이는 일을 막아 준다. */
function resetSetlistSpoiler(){
  setlistRevealed = false;
  setlistScrollY  = 0;
  setlistMode     = "random";
}
/* 셋리스트에서 곡을 눌러 들어갔을 때, 그 곡이 셋리스트의 몇 번째였는지.
   이전/다음 곡이 셋리스트 순서를 그대로 따라가게 하려고 기억해 둔다. */
let setlistPos = (()=>{
  const n = parseInt(store("horo-set-pos"), 10);
  return Number.isFinite(n) && n >= 0 ? n : -1;
})();
function setSetlistPos(i){
  setlistPos = i;
  store("horo-set-pos", String(i));
}

/* 토·일로 갈린 자리까지 풀어서 곡 하나하나를 낱개로 만든다.
   랜덤에서는 이 낱개들을 통째로 섞기 때문에 "몇 번째 자리에서 곡이 갈렸는지"가
   드러나지 않는다. */
function setlistFlat(){
  const out = [];
  SETLIST_TOKYO.items.forEach(it =>
    it.songs.forEach((e, i) => out.push({ key: it.n + ":" + i, id: e.id }))
  );
  return out;
}

function makeSetlistShuffle(){
  const keys = setlistFlat().map(x => x.key);
  for (let i = keys.length - 1; i > 0; i--){          // 피셔–예이츠 섞기
    const j = Math.floor(Math.random() * (i + 1));
    const t = keys[i]; keys[i] = keys[j]; keys[j] = t;
  }
  setlistShuffle = keys;
  store("horo-set-shuffle2", JSON.stringify(keys));
}

function ensureSetlistShuffle(){
  const flat = setlistFlat();
  if (setlistShuffle && setlistShuffle.length === flat.length) return;
  const saved = store("horo-set-shuffle2");
  if (saved){
    try {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr) && arr.length === flat.length){
        setlistShuffle = arr;
        return;
      }
    } catch(e){ /* 저장값이 깨졌으면 새로 섞는다 */ }
  }
  makeSetlistShuffle();
}

function setlistRandomSongs(){
  ensureSetlistShuffle();
  const byKey = new Map(setlistFlat().map(x => [x.key, x]));
  return setlistShuffle.map(k => byKey.get(k)).filter(Boolean);
}

/* 셋리스트 화면에 보이는 그대로의 곡 순서.
   · 공연 순서 모드 → 실제 공연 순서 (토·일로 갈린 자리는 낱개로 풀어서)
   · 랜덤 모드      → 그때 섞어 둔 바로 그 순서
   가이드가 없는 곡은 눌러도 안 열리므로 빼 둔다. */
function setlistNavList(){
  const list = (setlistMode === "random") ? setlistRandomSongs() : setlistFlat();
  return list.filter(x => SONGS.some(s => s.id === x.id));
}

/* 공연 순서 한 줄 — 번호 + 제목. 토·일로 갈린 자리는 둘을 묶어서 보여 준다. */
function setlistRowHtml(item){
  if (item.songs.length === 1){
    const e = item.songs[0];
    const exists = SONGS.some(s => s.id === e.id);
    return `
      <li class="set-item">
        <button class="set-row" data-id="${escapeHtml(e.id)}" ${exists ? "" : "disabled"}>
          <span class="set-num">${pad(item.n)}</span>
          <span class="set-title">${renderSongTitle(setlistTitle(e))}</span>
          <span class="set-go">${exists ? "›" : ""}</span>
        </button>
      </li>`;
  }
  return `
    <li class="set-item">
      <div class="set-split">
        <div class="set-split-head">
          <span class="set-num">${pad(item.n)}</span>
          <span class="set-split-note">日期不同的歌曲</span>
        </div>
        ${item.songs.map(e=>{
          const exists = SONGS.some(s => s.id === e.id);
          return `
          <button class="set-row sub" data-id="${escapeHtml(e.id)}" ${exists ? "" : "disabled"}>
            <span class="day-chip ${e.day === "日" ? "sun" : ""}">${e.day}</span>
            <span class="set-title">${renderSongTitle(setlistTitle(e))}</span>
            <span class="set-go">${exists ? "›" : ""}</span>
          </button>`;
        }).join("")}
      </div>
    </li>`;
}

/* 랜덤 한 줄 — 번호도 날짜 표시도 없이 곡 제목만 */
function setlistRandomRowHtml(x){
  const exists = SONGS.some(s => s.id === x.id);
  return `
    <li class="set-item">
      <button class="set-row" data-id="${escapeHtml(x.id)}" ${exists ? "" : "disabled"}>
        <span class="set-num rand">♪</span>
        <span class="set-title">${renderSongTitle(setlistTitle(x))}</span>
        <span class="set-go">${exists ? "›" : ""}</span>
      </button>
    </li>`;
}

/* 목록만 다시 그린다 (보기 방식을 바꿀 때 화면 전체를 새로 그리지 않도록) */
function paintSetlist(){
  const listEl = document.getElementById("set-list");
  if (!listEl) return;
  const isOrder = setlistMode === "order";
  const total = setlistFlat().length;

  listEl.innerHTML = isOrder
    ? SETLIST_TOKYO.items.map(setlistRowHtml).join("")
    : setlistRandomSongs().map(setlistRandomRowHtml).join("");

  const countEl = document.getElementById("setlist-count");
  if (countEl) countEl.textContent = isOrder
    ? `東京/首爾 ${SETLIST_TOKYO.items.length} 首・共 ${total} 首`
    : `共 ${total} 首`;

  const metaEl = document.getElementById("setlist-mode-meta");
  if (metaEl) metaEl.textContent = isOrder ? "劇透" : "隨機";

  const shufEl = document.getElementById("set-shuffle");
  if (shufEl) shufEl.hidden = isOrder;

  const desc = document.getElementById("setlist-desc");
  if (desc) desc.innerHTML = isOrder
    ? `${escapeHtml(SETLIST_TOKYO.dates)}<br>點選歌曲即可前往應援指南`
    : `${escapeHtml(SETLIST_TOKYO.dates)}<br>目前將歌曲<b>打亂顯示，不公開演出順序</b>`;

  const note = document.getElementById("setlist-note");
  if (note) note.innerHTML = isOrder
    ? `※ 這是整理自粉絲紀錄的非官方東京/首爾歌單，首爾場順序與東京場相同；台北場實際演出順序仍以官方公告為準。<br>
       ※ 日期不同而有變化的曲目，已分為<b>六</b>・<b>日</b>。`
    : `※ 這是整理自粉絲紀錄的非官方東京/首爾歌單，首爾場順序與東京場相同；台北場實際演出順序仍以官方公告為準。<br>
       ※ 演出順序與日期差異曲目皆已隱藏。想查看完整內容，請在上方點選<b>演出順序</b>。`;

  app.querySelectorAll(".set-mode").forEach(b=>{
    const on = b.dataset.mode === setlistMode;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });

  // 눌린 줄이 셋리스트의 몇 번째인지 같이 기억해 둔다 (이전/다음 곡용)
  let pos = 0;
  listEl.querySelectorAll(".set-row").forEach(btn=>{
    if (btn.disabled) return;          // 가이드 없는 곡은 순서에서 뺀다
    const myPos = pos++;
    btn.addEventListener("click", ()=>{
      const target = SONGS.find(s => s.id === btn.dataset.id);
      if (!target) return;
      setlistScrollY = window.scrollY;   // 돌아왔을 때 보던 자리로
      setSongFrom("setlist");
      setSetlistPos(myPos);
      gotoSong(target);
    });
  });
  scheduleJapaneseFontAfterInteraction(SETLIST_TOKYO.items
    .map(entry => japaneseTitleText(setlistTitle(entry)))
    .join(""), [500], "#/setlist");
}

function renderSetlist(){
  app.innerHTML = `
    <div class="setlist-page">
      <div class="song-topbar">
        <button class="back-btn" id="setlist-back-btn" aria-label="返回首頁" title="返回首頁">${BACK_SVG}</button>
        <h1>歌單</h1>
        ${themeToggleHtml()}
      </div>

      <section class="spoiler-hero">
        <div class="spoiler-mark">${WARN_SVG}</div>
        <h2 class="spoiler-title">劇透注意</h2>
        <p class="spoiler-desc">
          這個頁面包含<b>${SETLIST_TOKYO.label}的歌曲名稱與順序</b>。<br>
          選擇查看方式前，不會顯示內容。
        </p>
        <button class="spoiler-safe" type="button" id="spoiler-safe">不看劇透，返回首頁</button>

        <div class="spoiler-choice">
          <button class="spoiler-open soft" type="button" data-mode="random">
            <b>只看歌曲名稱<span class="tag">歌曲劇透</span></b>
            <span>打亂顯示演出順序</span>
          </button>
          <button class="spoiler-open" type="button" data-mode="order">
            <b>依演出順序查看<span class="tag">完整劇透</span></b>
            <span>公開歌曲名稱與完整順序</span>
          </button>
        </div>
      </section>

      <section class="setlist-body" id="setlist-body" hidden inert>
        <div class="setlist-head">
          <h2>${escapeHtml(SETLIST_TOKYO.label)}歌單</h2>
          <p id="setlist-desc"></p>
        </div>

        <div class="set-modes" role="group" aria-label="歌單查看方式">
          <button class="set-mode" type="button" data-mode="order">演出順序<span class="set-mode-badge">劇透</span></button>
          <button class="set-mode" type="button" data-mode="random">隨機順序</button>
        </div>
        <div class="set-order-confirm" id="set-order-confirm" role="group" aria-label="確認公開演出順序" hidden>
          <p>演出順序將完整公開。</p>
          <button type="button" id="set-order-cancel">取消</button>
          <button type="button" id="set-order-reveal">公開順序</button>
        </div>

        <div class="set-shuffle" id="set-shuffle" hidden>
          <span><b>已將順序打亂。</b>先看看有哪些歌曲，把順序留到演出當天揭曉吧。</span>
          <button type="button" id="set-reshuffle">重新打亂</button>
        </div>

        <div class="setlist-meta">
          <span id="setlist-count"></span>
          <span id="setlist-mode-meta">劇透</span>
        </div>

        <ul class="set-list" id="set-list"></ul>

        <p class="setlist-note" id="setlist-note"></p>
      </section>
    </div>
  `;

  document.getElementById("setlist-back-btn").addEventListener("click", ()=>{ location.hash = "#/"; });
  document.getElementById("spoiler-safe").addEventListener("click", ()=>{ location.hash = "#/"; });

  const body = document.getElementById("setlist-body");
  const orderConfirm = document.getElementById("set-order-confirm");

  /* 보기 방식을 고른 순간에만 목록 데이터를 만들고 표시한다. */
  const reveal = (mode, smooth)=>{
    setlistMode = (mode === "order") ? "order" : "random";
    setlistRevealed = true;
    paintSetlist();
    body.hidden = false;
    body.inert = false;
    if (smooth !== false) body.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  app.querySelectorAll(".spoiler-choice .spoiler-open").forEach(b=>{
    b.addEventListener("click", ()=> reveal(b.dataset.mode));
  });

  // 이미 펼친 뒤 보기 방식을 바꿀 때
  app.querySelectorAll(".set-mode").forEach(b=>{
    b.addEventListener("click", ()=>{
      if (b.dataset.mode === "order" && setlistMode !== "order"){
        orderConfirm.hidden = false;
        document.getElementById("set-order-cancel").focus();
        return;
      }
      orderConfirm.hidden = true;
      if (setlistMode === b.dataset.mode) return;
      setlistMode = b.dataset.mode === "random" ? "random" : "order";
      paintSetlist();
    });
  });
  document.getElementById("set-order-cancel").addEventListener("click", ()=>{
    orderConfirm.hidden = true;
    app.querySelector('.set-mode[data-mode="order"]').focus();
  });
  document.getElementById("set-order-reveal").addEventListener("click", ()=>{
    orderConfirm.hidden = true;
    setlistMode = "order";
    paintSetlist();
    app.querySelector('.set-mode[data-mode="order"]').focus();
  });
  document.getElementById("set-reshuffle").addEventListener("click", ()=>{
    makeSetlistShuffle();
    paintSetlist();
  });

  /* 곱을 보고 '뒤로' 돌아온 경우 — 가림막과 스크롤 위치를 그대로 되살린다.
     (보기 방식도 그대로라 실제 순서가 잠깐이라도 비치지 않는다)
     홈까지 나갔다 온 경우에는 resetSetlistSpoiler() 가 이미 초기화해 둔다. */
  if (setlistRevealed){
    reveal(setlistMode, false);
    if (setlistScrollY > 0){
      const y = setlistScrollY;
      // 글꼴·레이아웃이 늦게 잡히면 페이지가 짧아 위치가 잘리므로 몇 번 더 맞춘다
      const restore = ()=>{
        const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo(0, Math.min(y, max));
      };
      requestAnimationFrame(restore);
      setTimeout(restore, 80);
      setTimeout(restore, 260);
    }
  }
}

/* 알약 안의 두 글자를 바꿔 준다. clock 을 비우면 왼쪽 글자만 크게 보인다. */
function setPill(dday, clock, mode){
  const pill  = document.querySelector(".cd-pill");
  const dEl   = document.getElementById("cd-dday");
  const cEl   = document.getElementById("cd-clock");
  if (!pill || !dEl || !cEl) return;
  dEl.textContent = dday;
  cEl.textContent = clock || "";
  pill.classList.toggle("is-live", mode === "live");
  pill.classList.toggle("is-end",  mode === "end");
}

/* 끝난 공연은 흐리게, 진행 중인 공연은 주황으로 —
   지금 어느 공연을 세고 있는지 한눈에 보이도록 */
function markShowRows(liveIdx, nextIdx){
  const rows = document.querySelectorAll(".show-meta .show-row");
  rows.forEach((row, i)=>{
    const live   = (i === liveIdx);
    const passed = !live && ((nextIdx === -1) || (i < nextIdx));
    row.classList.toggle("live", live);
    row.classList.toggle("past", passed);
  });
}


/* ── 今日的行程 ─────────────────────────────────────────────
   台北時間 기준으로 오늘이 공연날이면 카드가 나타나고,
   지금 어느 단계인지와 다음 단계까지 남은 시간을 1초마다 갱신한다. */
function taipeiDateKey(d){
  return new Intl.DateTimeFormat("en-CA", {
    timeZone:"Asia/Taipei", year:"numeric", month:"2-digit", day:"2-digit"
  }).format(d);
}
/* 台北日期 기준으로 두 시점이 며칠 차이인지 (오늘=0, 내일=1) */
function taipeiDayGap(from, to){
  const ymd = (t)=>{
    const k = taipeiDateKey(new Date(t));
    return Date.UTC(+k.slice(0,4), +k.slice(5,7) - 1, +k.slice(8,10));
  };
  return Math.max(0, Math.round((ymd(to) - ymd(from)) / 86400000));
}

let todayBuiltKey = null;
function updateTodayCard(now){
  const card = document.getElementById("today-card");
  if (!card) return;
  const key   = taipeiDateKey(new Date(now));
  const steps = SHOW_TIMELINE[key];
  if (!steps){ card.hidden = true; todayBuiltKey = null; return; }
  card.hidden = false;

  const times   = steps.map(v => new Date(`${key}T${v.t}:00+09:00`).getTime());
  const nextIdx = times.findIndex(t => t > now);
  const curIdx  = nextIdx === -1 ? steps.length - 1 : nextIdx - 1;

  if (todayBuiltKey !== key){
    todayBuiltKey = key;
    const d = new Date(`${key}T12:00:00+09:00`);
    const dow = ["日","一","二","三","四","五","六"][d.getDay()];
    document.getElementById("today-title").textContent =
      `今日演出・${Number(key.slice(5,7))}/${Number(key.slice(8,10))}（${dow}）`;
  }
  document.getElementById("today-list").innerHTML = steps.map((v,i)=>{
    const cls = i < curIdx ? "past" : (i === curIdx ? "now" : "");
    return `<li class="${cls}"><span class="t">${v.t}</span><span class="l">${escapeHtml(v.label)}</span></li>`;
  }).join("");

  const nowEl = document.getElementById("today-now");
  if (nextIdx === -1){
    nowEl.innerHTML = `<b>今天的演出已全部結束。</b>辛苦了！`;
    return;
  }
  const diff = times[nextIdx] - now;
  const h = Math.floor(diff/3600000), m = Math.floor(diff%3600000/60000), sec = Math.floor(diff%60000/1000);
  const left = h > 0 ? `${h} 小時 ${pad(m)} 分 ${pad(sec)} 秒` : `${m} 分 ${pad(sec)} 秒`;
  const cur  = curIdx >= 0 ? `<b>${escapeHtml(steps[curIdx].label)}</b>進行中<br>` : "";
  nowEl.innerHTML = `${cur}距離${escapeHtml(steps[nextIdx].label)}還有 <span class="left">${left}</span>`;
}

/* ── 준비물 체크 · 주소 복사 · 공유 · 오프라인 상태 ───────────── */
function setupHomeExtras(){
  // 分享按鈕位於首頁常駐內容，直接在初始化時接線。
  const shareBtn = document.getElementById("share-btn");
  if (shareBtn){
    shareBtn.addEventListener("click", async ()=>{
      const data = {
        title: "VAUNDY \"HORO\" TAIPEI 應援指南",
        text: "搭配影片查看各曲歌詞與大合唱、拍手、揮手重點",
        url: location.href.split("#")[0]
      };
      try {
        if (navigator.share){ await navigator.share(data); return; }
        await navigator.clipboard.writeText(data.url);
        showBanner("已<b>複製</b>連結，請貼上分享。", "確定", hideBanner);
      } catch(e){ /* 사용자가 취소한 경우 등 — 아무것도 하지 않음 */ }
    });
  }

}

function setupAddressCopy(){
  // 交通卡片內容在第一次展開時才建立。
  const copyBtn = document.getElementById("copy-addr");
  if (!copyBtn || copyBtn.dataset.wired === "1") return;
  copyBtn.dataset.wired = "1";
  copyBtn.addEventListener("click", async ()=>{
    const addr = "105037 臺北市松山區南京東路4段2號 台北小巨蛋 Taipei Arena";
    try { await navigator.clipboard.writeText(addr); copyBtn.textContent = "已複製 ✓"; }
    catch(e){ copyBtn.textContent = addr; }
    setTimeout(()=>{ copyBtn.textContent = "複製地址"; }, 1600);
  });
}


/* ── 곡 목록 검색 ─────────────────────────────────────────────
   한글 제목, 괄호 안 원제(일본어·영문), 그리고 초성(ㅁㅎ → 무희)까지 찾습니다. */
const CHO_TABLE = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
function toCho(str){
  return [...String(str)].map(ch=>{
    const c = ch.charCodeAt(0);
    return (c >= 0xAC00 && c <= 0xD7A3) ? CHO_TABLE[Math.floor((c - 0xAC00) / 588)] : ch;
  }).join("");
}
const squash = (str) => String(str).toLowerCase().replace(/\s+/g, "");
let songListRenderToken = 0;
let songListComplete = null;
let songListScrollHandler = null;
let songListSentinel = null;

/* 고른 순서대로 목록을 다시 그린다 (검색어는 그대로 유지) */
function paintSongList({ eager = false } = {}){
  const ul = document.getElementById("song-list");
  if (!ul) return;

  if (songListScrollHandler){
    window.removeEventListener("scroll", songListScrollHandler);
    songListScrollHandler = null;
  }
  songListSentinel?.remove();
  songListSentinel = null;

  const songs = sortedSongs();
  const renderToken = ++songListRenderToken;
  songListComplete = null;
  ul.dataset.total = String(songs.length);
  ul.innerHTML = "";

  // The list is rebuilt on sorting, so one delegated listener avoids 36 handlers per pass.
  if (ul.dataset.clickBound !== "1"){
    ul.dataset.clickBound = "1";
    ul.addEventListener("click", event=>{
      const btn = event.target.closest(".song-row");
      if (!btn || !ul.contains(btn)) return;
      const target = SONGS.find(x => x.id === btn.dataset.id);
      if (!target) return;
      setSongFrom("guide");     // 여기서 들어왔으니 '뒤로'는 곡 목록으로
      gotoSong(target);
    });
    ul.addEventListener("focusin", ()=>songListComplete?.());
  }

  let nextIndex = 0;
  const renderChunk = ({ filter = true, includeMarks = true } = {}) => {
    if (renderToken !== songListRenderToken || !ul.isConnected) return;
    const end = Math.min(nextIndex + 4, songs.length);
    const markup = songs.slice(nextIndex, end).map(s=>`
      <li data-no="${songNo(s)}">
        <button class="song-row" data-id="${escapeHtml(s.id)}">
          <span class="song-num">${pad(songNo(s))}</span>
          <span class="song-title">${renderSongTitle(s.title)}</span>
          ${includeMarks ? songMarksHtml(s) : '<span class="song-marks song-marks-placeholder" aria-hidden="true"></span>'}
        </button>
      </li>`).join("");
    if (songListSentinel?.isConnected) songListSentinel.insertAdjacentHTML("beforebegin", markup);
    else ul.insertAdjacentHTML("beforeend", markup);
    nextIndex = end;
    if (filter) applyGuideFilter();
  };
  const complete = ()=>{
    if (renderToken !== songListRenderToken || !ul.isConnected) return;
    if (songListScrollHandler){
      window.removeEventListener("scroll", songListScrollHandler);
      songListScrollHandler = null;
    }
    songListSentinel?.remove();
    songListSentinel = null;
    while (nextIndex < songs.length) renderChunk({ filter: false, includeMarks: true });
    const byNo = new Map(songs.map(song => [String(songNo(song)), song]));
    ul.querySelectorAll(".song-marks-placeholder").forEach(placeholder=>{
      const row = placeholder.closest("li");
      const song = row && byNo.get(row.dataset.no);
      placeholder.outerHTML = song ? songMarksHtml(song) : "";
    });
    songListComplete = null;
    applyGuideFilter();
  };
  songListComplete = complete;
  renderChunk({ includeMarks: true });
  if (eager) complete();
  else if (nextIndex < songs.length){
    songListSentinel = document.createElement("li");
    songListSentinel.className = "song-list-sentinel";
    songListSentinel.setAttribute("aria-hidden", "true");
    ul.appendChild(songListSentinel);
    let scrollFrame = null;
    const loadRowsNearViewport = ()=>{
      scrollFrame = null;
      if (renderToken !== songListRenderToken || !ul.isConnected || !songListSentinel?.isConnected) return;
      if (songListSentinel.getBoundingClientRect().top > window.innerHeight + 480) return;
      renderChunk({ includeMarks: true });
      if (nextIndex < songs.length) renderChunk({ includeMarks: true });
      if (nextIndex >= songs.length) complete();
    };
    songListScrollHandler = ()=>{
      if (scrollFrame === null) scrollFrame = window.requestAnimationFrame(loadRowsNearViewport);
    };
    window.addEventListener("scroll", songListScrollHandler, { passive: true });
  }

  // 어느 칩이 켜져 있는지 + 떼창 방향 표시
  app.querySelectorAll(".song-sort").forEach(b=>{
    const on = (b.dataset.sort === "chant" || b.dataset.sort === "title")
      ? songSort.startsWith(b.dataset.sort)
      : b.dataset.sort === songSort;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  const chantBtn = document.getElementById("sort-chant");
  if (chantBtn){
    const dir = songSort === "chant-asc" ? "少→多" : "多→少";
    chantBtn.innerHTML = songSort.startsWith("chant")
      ? `大合唱 <span class="dir">${dir}</span>`
      : "大合唱";
  }
  const titleBtn = document.getElementById("sort-title");
  if (titleBtn){
    const dir = songSort === "title-desc" ? "Z→A" : "A→Z";
    titleBtn.innerHTML = songSort.startsWith("title")
      ? `名稱 <span class="dir">${dir}</span>`
      : "名稱";
  }

  applyGuideFilter();
}

/* 검색어에 맞춰 보이고 숨긴다 (목록을 다시 그린 뒤에도 그대로 적용된다) */
function applyGuideFilter(){
  const input = document.getElementById("song-search-input");
  const clear = document.getElementById("song-search-clear");
  const count = document.getElementById("song-count");
  const empty = document.getElementById("song-empty");
  const items = document.querySelectorAll("#song-list > li[data-no]");
  if (!input || !items.length) return;
  const total = Number(document.getElementById("song-list")?.dataset.total) || items.length;

  // "5", "05", "5번" 모두 5번 곡으로 인식
  const q = squash(input.value).replace(/번$/, "");
  const isNum = /^\d{1,2}$/.test(q);
  let hit = 0;

  items.forEach(li=>{
    const title = li.querySelector(".song-title").textContent;
    const no = li.dataset.no;
    const ok = !q || (isNum
      ? (no === String(Number(q)) || pad(Number(no)) === q)      // 번호 검색
      : (squash(title).includes(q) || squash(toCho(title)).includes(q)));  // 제목 · 초성
    li.hidden = !ok;
    if (ok) hit++;
  });

  if (count) count.textContent = q ? `搜尋結果 ${hit} 首` : `共 ${total} 首`;
  if (empty) empty.hidden = hit !== 0;
  if (clear) clear.classList.toggle("show", !!input.value);
}

function setupSongSearch(){
  const input = document.getElementById("song-search-input");
  const clear = document.getElementById("song-search-clear");
  if (!input) return;

  const apply = applyGuideFilter;

  // 검색창이 화면 맨 위에 붙었을 때만 뒤 배경을 흐리게 (붙기 전에는 그대로 둠)
  const bar = document.querySelector(".song-search");
  const sentinel = document.getElementById("song-search-sentinel");
  if (bar && sentinel && "IntersectionObserver" in window){
    new IntersectionObserver(([e])=>{
      bar.classList.toggle("stuck", !e.isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  }

  input.addEventListener("input", ()=>{ songListComplete?.(); apply(); });
  clear.addEventListener("click", ()=>{ songListComplete?.(); input.value = ""; apply(); input.focus(); });
  apply();
}

function startCountdown(){
  const shows = SHOW_SCHEDULE.map(v => ({
    start: new Date(v.start).getTime(),
    end:   new Date(v.end).getTime()
  }));
  const finalEnd = shows[shows.length - 1].end;

  function tick(){
    const box = document.getElementById("countdown");
    if (!box) { stopCountdown(); return; }

    const now     = Date.now();
    updateTodayCard(now);                                                  // 공연 당일이면 오늘 일정 갱신
    const liveIdx = shows.findIndex(v => now >= v.start && now < v.end);   // 진행 중인 공연
    const nextIdx = shows.findIndex(v => v.start > now);                   // 아직 시작 전인 첫 공연
    markShowRows(liveIdx, nextIdx);

    if (liveIdx !== -1){                 // 공연 진행 중 (토·일 모두)
      setPill("現在", "直播中", "live");
      return;
    }
    if (nextIdx === -1){                 // 남은 공연 없음
      if (now >= finalEnd){
        setPill("結束", "", "end");
        stopCountdown();
      }
      return;
    }

    const diff = shows[nextIdx].start - now;
    // D-day 以台北日期計算剩餘天數。
    // 남은 시간을 24로 나누면, 공연이 내일이어도 20시간 남았을 때 D-00 이 되어
    // '오늘이 공연날'로 잘못 읽힌다. 날짜끼리 빼야 내일은 D-01 이 된다.
    const d = taipeiDayGap(now, shows[nextIdx].start);
    // 시:분:초는 시작까지 남은 전체 시간 (D-01 이면 24시간을 넘을 수 있다)
    const h = Math.floor(diff/3600000);
    const m = Math.floor(diff%3600000/60000);
    const s = Math.floor(diff%60000/1000);
    setPill(`D-${pad(d)}`, `${pad(h)}:${pad(m)}:${pad(s)}`, "count");
  }

  tick();
  countdownTimer = setInterval(tick, 1000);
}
function stopCountdown(){ if(countdownTimer){ clearInterval(countdownTimer); countdownTimer=null; } }

/* ---------------- SONG DETAIL ---------------- */

/* 손 흔들기 아이콘 (좌우로 흔들리는 애니메이션은 CSS의 handWave 가 담당) */
/* 박수 아이콘용 — 손 한 짝 (두 개를 마주 보게 놓고 CSS로 마주치게 함) */

/* 곡 목록 시트 안 검색 — 곡 목록 화면과 동일한 규칙 */
function applySheetFilter(){
  const input = document.getElementById("sheet-search-input");
  const clear = document.getElementById("sheet-search-clear");
  const count = songView.querySelector(".song-sheet-count");
  const empty = document.getElementById("sheet-empty");
  const items = songView.querySelectorAll("#song-sheet-list > li");
  if (!input || !items.length) return;

  const q = squash(input.value).replace(/번$/, "");
  const isNum = /^\d{1,2}$/.test(q);
  let hit = 0;

  items.forEach((li)=>{
    const name = li.querySelector(".song-sheet-name").textContent;
    const no = li.dataset.no;
    const ok = !q || (isNum
      ? (no === String(Number(q)) || pad(Number(no)) === q)
      : (squash(name).includes(q) || squash(toCho(name)).includes(q)));
    li.hidden = !ok;
    if (ok) hit++;
  });

  if (count) count.textContent = q ? `${hit} 首` : `${items.length} 首`;
  if (empty) empty.hidden = hit !== 0;
  if (clear) clear.classList.toggle("show", !!input.value);
}

/* 시트를 닫을 때 검색어를 비워 다음에 열면 전체가 보이게 한다 */
function resetSheetFilter(){
  const input = document.getElementById("sheet-search-input");
  if (!input) return;
  input.value = "";
  applySheetFilter();
}

/* 곡 목록 시트 열기/닫기 (셸을 만들 때 한 번만 연결) */
function openSongSheet(){
  const sheet = document.getElementById("song-sheet");
  const btn   = document.getElementById("song-picker-btn");
  const list  = document.getElementById("song-sheet-list");
  if (!sheet) return;
  sheet.inert = false;
  sheet.classList.add("open");
  sheet.setAttribute("aria-hidden", "false");
  if (btn) btn.setAttribute("aria-expanded", "true");
  songView.querySelectorAll("#song-page > .song-topbar, #song-page > .song-body, #song-page > .player-controls, #song-page > .song-dock").forEach(el => { el.inert = true; });
  const cur = list && list.querySelector(".song-sheet-item.current");
  if (cur) list.scrollTop = Math.max(0, cur.offsetTop - list.clientHeight / 2 + cur.offsetHeight / 2);
  sheet.querySelector(".song-sheet-close").focus();
}
function closeSongSheet(){
  const sheet = document.getElementById("song-sheet");
  const btn   = document.getElementById("song-picker-btn");
  if (!sheet) return;
  const wasOpen = sheet.classList.contains("open");
  resetSheetFilter();
  songView.querySelectorAll("#song-page > .song-topbar, #song-page > .song-body, #song-page > .player-controls, #song-page > .song-dock").forEach(el => { el.inert = false; });
  sheet.classList.remove("open");
  sheet.setAttribute("aria-hidden", "true");
  sheet.inert = true;
  if (btn) btn.setAttribute("aria-expanded", "false");
  if (wasOpen && btn) btn.focus();
}

/* ── 곡 화면 셸 ───────────────────────────────────────────────
   유튜브 플레이어(iframe)를 곡마다 새로 만들면 모바일에서 "사용자가 직접 누른
   재생"으로 인정받지 못해 소리가 막힌다. 그래서 곡 화면(과 그 안의 iframe)은
   페이지에 딱 한 번만 만들어 두고, 곡이 바뀌면 내용만 갈아끼운다. */
let songShellBuilt = false;

/* 곡 선택 목록에 보여 줄 곡들.
   셋리스트에서 들어왔으면 전체 곡이 아니라 셋리스트에 있는 곡만,
   셋리스트 화면에서 보던 그 순서 그대로 보여 준다.
   (랜덤 모드면 섞여 있던 그 순서) */
function sheetSongs(){
  if (songFrom === "setlist"){
    const list = setlistNavList();
    if (list.length){
      const out = list.map(x => SONGS.find(s => s.id === x.id)).filter(Boolean);
      if (out.length) return out;
    }
  }
  return sortedSongs();
}

/* 이전/다음 곡의 순서는 "어디서 들어왔는지"에 따라 달라진다.
   · 셋리스트에서 들어왔으면 → 셋리스트에서 보던 그 순서 그대로
     (공연 순서 모드면 공연 순서, 랜덤 모드면 섞여 있던 그 순서)
   · 곡 목록에서 들어왔으면  → 곡 목록에서 고른 정렬 순서 */
function songNeighbors(song){
  if (songFrom === "setlist"){
    const list = setlistNavList();
    if (list.length){
      let pos = setlistPos;
      // 기억해 둔 자리가 어긋났으면(모드를 바꿨다거나) 곡으로 다시 찾는다
      if (!(pos >= 0 && pos < list.length && list[pos].id === song.id))
        pos = list.findIndex(x => x.id === song.id);
      if (pos >= 0){
        const pi = (pos - 1 + list.length) % list.length;
        const ni = (pos + 1) % list.length;
        const at = (i)=> SONGS.find(s => s.id === list[i].id) || song;
        return { idx: pos, prev: at(pi), next: at(ni), pos, prevPos: pi, nextPos: ni };
      }
    }
  }
  const list = sortedSongs();
  const idx = list.findIndex(s => s.id === song.id);
  if (idx < 0) return { idx: -1, prev: song, next: song };
  return {
    idx,
    prev: list[(idx - 1 + list.length) % list.length],
    next: list[(idx + 1) % list.length]
  };
}

/* 이전(-1) · 다음(+1) 곡으로 넘어간다.
   셋리스트에서 들어온 경우에는 "지금 몇 번째인지"도 같이 옮겨 준다. */
function goNeighbor(dir){
  if (!currentSong) return;
  const n = songNeighbors(currentSong);
  const target = dir < 0 ? n.prev : n.next;
  const nextPos = dir < 0 ? n.prevPos : n.nextPos;
  if (nextPos !== undefined) setSetlistPos(nextPos);
  gotoSong(target);
}

function buildSongShell(){
  if (songShellBuilt) return;
  songShellBuilt = true;
  venueMode = store("horo-venue") === "1";   // 지난번 설정 그대로

  songView.innerHTML = `
    <div class="song-page" id="song-page">
      <div class="song-topbar">
        <button class="back-btn" id="song-back-btn" aria-label="返回歌曲清單" title="返回歌曲清單">${BACK_SVG}</button>
        <h1 class="visually-hidden" id="song-page-heading"></h1>
        <nav class="song-dock" aria-label="切換歌曲">
        <div class="song-nav">
          <button class="song-nav-btn" id="prev-song" aria-label="上一首">${TRACK_PREV_SVG}</button>
          <div class="song-picker-h">
            <button class="song-picker-btn" id="song-picker-btn" aria-expanded="false" aria-haspopup="dialog" title="開啟歌曲清單">
              <span class="song-picker-title" id="song-picker-title"></span>
              <span class="song-picker-caret">${CHEVRON_SVG}</span>
            </button>
          </div>
          <button class="song-nav-btn" id="next-song" aria-label="下一首">${TRACK_NEXT_SVG}</button>
        </div>
        </nav>
        ${themeToggleHtml()}
      </div>

      <div class="song-body">
        <div class="song-fixed-top">
          <div class="video-wrap">
            <div class="video-frame">
              <div id="yt-player"></div>
              <details class="karaoke-source-popover" id="karaoke-source-popover">
                <summary aria-label="查看同步資訊與中譯歌詞作者" title="同步資訊與中譯歌詞作者">${INFO_SVG}</summary>
                <span class="karaoke-source-status" id="karaoke-source-status" role="status" aria-live="polite">
                  <span id="karaoke-source-status-text"></span>
                  <span class="lyrics-credit" id="lyrics-credit" hidden></span>
                  ${chantSourceInfoHtml()}
                </span>
              </details>
              <div class="video-status" id="video-status" role="status">正在載入影片…</div>
            </div>
          </div>

          <div class="lyrics-note">
            <span class="dot">●</span>
            <span class="lyrics-note-copy">點選歌詞跳至影片位置，歌詞隨影片同步。</span>
            <a class="watch-on-yt" id="watch-on-yt" href="#" target="_blank" rel="noopener">在 YouTube 觀看 ↗</a>
          </div>

          <div class="lyrics-legend">
            <span class="legend-item"><span class="legend-icon chant">${INLINE_ICONS.mic}</span>大合唱</span>
            <span class="legend-item"><span class="legend-icon clap">${INLINE_ICONS.clap}</span>拍手</span>
            <span class="legend-item"><span class="legend-icon wave">${INLINE_ICONS.wave}</span>揮手</span>
            <button type="button" class="chant-notes-toggle" id="chant-notes-toggle" aria-expanded="false" aria-controls="chant-notes" title="查看這首歌的日本版應援提示" hidden>
              <span class="chant-notes-label">應援說明</span><span class="chant-notes-chevron" aria-hidden="true">${CHEVRON_SVG}</span>
            </button>
          </div>
          <div class="chant-notes-panel" id="chant-notes" hidden>
            <ul class="chant-notes-list" id="chant-notes-list"></ul>
            <a href="${CHANT_REFERENCE_URL}" target="_blank" rel="noopener">Canva《VAUNDY 應援教學》↗</a>
          </div>
        </div>

        <div class="lyrics-pane">
          <!-- 떼창만 듣기 — 켜져 있을 때만 보이는 띠 -->
          <div class="chant-bar" id="chant-bar" hidden role="status">
            <span class="chant-ico">${STATIC_MIC_SVG}</span>
            <span class="chant-bar-label">只聽大合唱</span>
            <span class="chant-bar-msg" id="chant-msg"></span>
            <span class="chant-bar-count" id="chant-count"></span>
            <button class="chant-step" id="chant-prev" aria-label="上一段大合唱">${CHEV_LEFT_SVG}</button>
            <button class="chant-step" id="chant-next" aria-label="下一段大合唱">${CHEV_RIGHT_SVG}</button>
            <button class="chant-bar-off" id="chant-off" aria-label="關閉只聽大合唱">${CLOSE_SVG}</button>
          </div>

          <!-- 짤방(동작 사진) — 지정한 가사에서만 떴다가 사라집니다 -->
          <div class="tip-pic at-below-video" id="tip-pic" aria-live="polite">
            <figure class="tip-pic-card" id="tip-pic-card" title="點選即可放大">
              <video id="tip-pic-video" muted loop playsinline preload="none" aria-hidden="true" hidden></video>
              <img id="tip-pic-img" alt="" decoding="async" hidden>
              <figcaption class="tip-pic-cap" id="tip-pic-cap"></figcaption>
            </figure>
          </div>

          <div class="lyrics-scroll">
            <ul class="lyrics-list" id="lyrics-list"></ul>
          </div>
        </div>
      </div>

      <div class="player-controls">
        <button class="play-toggle" id="play-toggle" aria-label="播放／暫停">${PLAY_SVG}</button>
        <label class="playback-rate-control" for="playback-rate">
          <select class="playback-rate-select" id="playback-rate" aria-label="目前倍速x1">
            ${PLAYBACK_RATE_OPTIONS.map(rate => "<option value=\"" + rate + "\">" + formatPlaybackRate(rate) + "</option>").join("")}
          </select>
        </label>
        <button class="venue-toggle pip-toggle" id="pip-btn" type="button" aria-pressed="false" aria-label="開啟或聚焦同步字幕小窗" title="開啟或聚焦同步字幕小窗"${documentPip.supported ? "" : " hidden"}>
          ${PIP_SVG}
          <span class="venue-label venue-label-desktop">PiP</span>
          <span class="venue-label venue-label-mobile" aria-hidden="true">PiP</span>
        </button>
        <button class="venue-toggle chant-toggle" id="chant-btn" aria-pressed="false" aria-label="開啟／關閉只聽大合唱">
          <span class="chant-ico">${STATIC_MIC_SVG}</span>
          <span class="venue-label">只聽大合唱</span>
        </button>
        <button class="venue-toggle chant-version-toggle" id="chant-version-btn" data-chant-version-toggle aria-pressed="false" aria-label="切換應援版本">
          <span class="venue-label venue-label-desktop">應援版</span>
          <span class="venue-label venue-label-mobile" aria-hidden="true">應援</span>
          <span class="chant-version-value">${chantVersionIcon()}</span>
        </button>
        <button class="venue-toggle" id="venue-btn" aria-label="開啟／關閉簡潔模式">
          <span class="venue-label">簡潔</span>
          <span class="venue-switch"><span class="venue-knob"></span></span>
        </button>
        <button class="venue-toggle reading-toggle" id="reading-btn" aria-pressed="${readingMode !== "kana" ? "true" : "false"}" aria-label="切換日文讀音：目前顯示${readingModeLabel()}">
          <span class="venue-label">讀音</span>
          <span class="reading-value reading-value-desktop" id="reading-value">${readingModeLabel()}</span>
          <span class="reading-value reading-value-mobile" id="reading-value-mobile" aria-hidden="true">${readingModeShortLabel()}</span>
        </button>
        <button class="venue-toggle display-toggle${showJapanese ? " active" : ""}" id="japanese-toggle" aria-pressed="${showJapanese ? "true" : "false"}" aria-label="切換日文歌詞：目前${showJapanese ? "顯示" : "隱藏"}">
          <span class="venue-label venue-label-desktop">日文</span>
          <span class="venue-label venue-label-mobile" aria-hidden="true">日</span>
          <span class="venue-switch"><span class="venue-knob"></span></span>
        </button>
        <button class="venue-toggle display-toggle${showChinese ? " active" : ""}" id="chinese-toggle" aria-pressed="${showChinese ? "true" : "false"}" aria-label="切換繁中翻譯：目前${showChinese ? "顯示" : "隱藏"}">
          <span class="venue-label venue-label-desktop">中文</span>
          <span class="venue-label venue-label-mobile" aria-hidden="true">中</span>
          <span class="venue-switch"><span class="venue-knob"></span></span>
        </button>
        <button class="venue-toggle display-toggle karaoke-toggle${karaokeEnabled ? " active" : ""}" id="karaoke-btn" aria-pressed="${karaokeEnabled ? "true" : "false"}" aria-label="切換逐字卡拉OK高亮：目前${karaokeEnabled ? "開啟" : "關閉"}">
          <span class="venue-label venue-label-desktop">卡拉OK</span>
          <span class="venue-label venue-label-mobile" aria-hidden="true">卡拉</span>
          <span class="venue-switch"><span class="venue-knob"></span></span>
        </button>
        <button class="venue-toggle autoscroll-toggle${autoScrollEnabled ? " active" : ""}" id="autoscroll-btn" aria-label="開啟／關閉自動捲動">
          <span class="venue-label venue-label-desktop">自動捲動</span>
          <span class="venue-label venue-label-mobile" aria-hidden="true">同步</span>
          <span class="venue-switch"><span class="venue-knob"></span></span>
        </button>
      </div>

      <div class="song-sheet" id="song-sheet" aria-hidden="true" inert>
        <div class="song-sheet-backdrop" data-close-sheet></div>
        <div class="song-sheet-panel" role="dialog" aria-modal="true" aria-label="選擇歌曲">
          <span class="song-sheet-grip"></span>
          <div class="song-sheet-head">
            <span class="song-sheet-title" id="song-sheet-title">選擇歌曲</span>
            <span class="song-sheet-count">${SONGS.length} 首</span>
            <button class="song-sheet-close" data-close-sheet aria-label="關閉">${CLOSE_SVG}</button>
          </div>
          <div class="sheet-search">
            <label class="search-label" for="sheet-search-input">搜尋歌曲</label>
            <div class="song-search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>
              <input id="sheet-search-input" type="search" inputmode="search" autocomplete="off"
                     placeholder="搜尋歌曲名稱・編號">
              <button type="button" class="song-search-clear" id="sheet-search-clear" aria-label="清除">✕</button>
            </div>
          </div>
          <p class="sheet-empty" id="sheet-empty" hidden>找不到歌曲</p>
          <ul class="song-sheet-list" id="song-sheet-list"></ul>
        </div>
      </div>
    </div>
  `;

  const karaokeSourcePopover = document.getElementById("karaoke-source-popover");
  let karaokeSourceCloseTimer = null;
  if (karaokeSourcePopover){
    karaokeSourcePopover.addEventListener("toggle", ()=>{
      if (karaokeSourceCloseTimer) clearTimeout(karaokeSourceCloseTimer);
      if (!karaokeSourcePopover.open) return;
      karaokeSourceCloseTimer = setTimeout(()=>{
        karaokeSourcePopover.removeAttribute("open");
        karaokeSourceCloseTimer = null;
      }, 2000);
    });
  }

  document.getElementById("song-back-btn").addEventListener("click", ()=>{ location.hash = songBackHash(); });

  // 이전/다음 곡 — 탭한 그 순간(사용자 제스처 안에서) 바로 재생을 시작시킨다
  document.getElementById("prev-song").addEventListener("click", ()=>{ goNeighbor(-1); });
  document.getElementById("next-song").addEventListener("click", ()=>{ goNeighbor(1); });

  // 곡 목록 시트
  document.getElementById("song-picker-btn").addEventListener("click", ()=>{
    const sheet = document.getElementById("song-sheet");
    sheet.classList.contains("open") ? closeSongSheet() : openSongSheet();
  });
  document.getElementById("song-sheet").querySelectorAll("[data-close-sheet]").forEach(el=>{
    el.addEventListener("click", closeSongSheet);
  });
  document.getElementById("song-sheet-list").addEventListener("click", (e)=>{
    const item = e.target.closest(".song-sheet-item");
    if (!item) return;
    const target = SONGS.find(s => s.id === item.dataset.id);
    closeSongSheet();
    if (!target || (currentSong && target.id === currentSong.id)) return;
    // 셋리스트에서 들어온 경우, 목록 순서가 곧 셋리스트 순서이므로
    // 지금 몇 번째인지도 같이 옮겨 둔다 (이전/다음 곡이 이어지도록)
    if (songFrom === "setlist"){
      const pos = parseInt(item.dataset.pos, 10);
      if (Number.isFinite(pos)) setSetlistPos(pos);
    }
    gotoSong(target);
  });

  // 곡 목록 시트 안 검색 — 곡 목록 화면과 같은 방식(제목·초성·원제·번호)
  const sheetInput = document.getElementById("sheet-search-input");
  const sheetClear = document.getElementById("sheet-search-clear");
  if (sheetInput){
    sheetInput.addEventListener("input", applySheetFilter);
    sheetClear.addEventListener("click", ()=>{
      sheetInput.value = "";
      applySheetFilter();
      sheetInput.focus();
    });
  }

  // 짤방 탭 → 크게 보기 / 원래대로
  const tipCard = document.getElementById("tip-pic-card");
  if (tipCard){
    tipCard.addEventListener("click", ()=>{
      document.getElementById("tip-pic").classList.toggle("big");
    });
  }

  /* 떼창만 듣기 중에는 가사를 옆으로 밀어 구간을 옮길 수 있다.
     작은 ‹ › 단추를 정확히 누르지 않아도 되도록 — 화면을 덜 보고도 넘긴다.
     · 세로로 넘기는 손짓과 헷갈리지 않게 가로로 충분히(70px), 그리고
       세로 움직임보다 두 배 이상 많이 움직였을 때만 인정한다
     · 왼쪽 가장자리에서 시작한 손짓은 브라우저 '뒤로 가기' 라 건드리지 않는다
     · 떼창만 듣기가 꺼져 있을 때는 동작하지 않는다 (실수로 곡이 넘어가지 않도록) */
  (function setupChantSwipe(){
    const pane = songView.querySelector(".lyrics-pane");
    if (!pane) return;
    let x0 = 0, y0 = 0, on = false;
    pane.addEventListener("touchstart", (e)=>{
      if (!chantOnly || e.touches.length !== 1){ on = false; return; }
      const t = e.touches[0];
      if (t.clientX < 24 || t.clientX > window.innerWidth - 24){ on = false; return; }
      x0 = t.clientX; y0 = t.clientY; on = true;
    }, { passive:true });
    pane.addEventListener("touchend", (e)=>{
      if (!on) return;
      on = false;
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 2) return;
      skipPart(dx < 0 ? 1 : -1);       // 왼쪽으로 밀면 다음, 오른쪽으로 밀면 이전
    }, { passive:true });
  })();

  // 가사 줄 탭 → 해당 위치로 이동 (목록이 바뀌어도 되도록 위임 방식)
  document.getElementById("lyrics-list").addEventListener("click", (e)=>{
    const btn = e.target.closest(".lyric-line");
    if (!btn) return;
    seekTo(Number(btn.dataset.time));
    // 떼창만 듣기 중에는 탭한 자리에서 판단을 다시 하도록 잠깐 여유를 준다
    if (chantOnly){ chantDone = false; chantExpect(Number(btn.dataset.time)); }
  });

  /* 단축모드 — 영상을 감추고 발음 가사만 크게.
     온라인이면 소리와 가사 동기화는 그대로 유지된다. */
  /* 재생 / 일시정지 — 단축모드에서 영상이 안 보일 때 소리를 멈추는 수단 */
  document.getElementById("play-toggle").addEventListener("click", togglePlayback);

  const pipButton = document.getElementById("pip-btn");
  if (pipButton && documentPip.supported){
    pipButton.addEventListener("click", async ()=>{
      const opened = await documentPip.open(buildDocumentPipViewModel());
      if (opened) updateDocumentPipButton();
    });
    updateDocumentPipButton();
  }

  document.getElementById("playback-rate").addEventListener("change", event=>{
    setPlaybackRate(Number(event.currentTarget.value));
  });
  updatePlaybackRateUi();

  document.getElementById("chant-btn").addEventListener("click", ()=>{
    setChantOnly(!chantOnly);
  });
  document.getElementById("chant-off").addEventListener("click", ()=>{ setChantOnly(false); });
  document.getElementById("chant-prev").addEventListener("click", ()=>{ chantStep(-1); });
  document.getElementById("chant-next").addEventListener("click", ()=>{ chantStep(1);  });

  document.getElementById("venue-btn").addEventListener("click", (e)=>{
    venueMode = !venueMode;
    store("horo-venue", venueMode ? "1" : "");
    applyVenueMode();
  });

  document.getElementById("reading-btn").addEventListener("click", ()=>{
    const current = READING_MODES.indexOf(readingMode);
    readingMode = READING_MODES[(current + 1) % READING_MODES.length];
    store("horo-reading", readingMode);
    updateReadingUi();
    repaintJapaneseReadings();
  });

  document.getElementById("japanese-toggle").addEventListener("click", ()=>{
    showJapanese = !showJapanese;
    store("horo-show-japanese", showJapanese ? "1" : "0");
    updateLyricDisplayUi();
  });

  document.getElementById("chinese-toggle").addEventListener("click", ()=>{
    showChinese = !showChinese;
    store("horo-show-chinese", showChinese ? "1" : "0");
    updateLyricDisplayUi();
  });

  document.getElementById("karaoke-btn").addEventListener("click", ()=>{
    karaokeEnabled = !karaokeEnabled;
    store("horo-karaoke", karaokeEnabled ? "1" : "0");
    updateKaraokeUi();
  });

  document.getElementById("autoscroll-btn").addEventListener("click", (e)=>{
    autoScrollEnabled = !autoScrollEnabled;
    e.currentTarget.classList.toggle("active", autoScrollEnabled);
    if (autoScrollEnabled) updateLyricsSync(true);   // 켜는 즉시 현재 위치로 이동
  });

  // ESC 로 시트 닫기 / ← → 로 이전·다음 곡 (PC 키보드)
  if (songKeyHandler) document.removeEventListener("keydown", songKeyHandler);
  songKeyHandler = (e)=>{
    if (!isSongViewActive()) return;                      // 다른 화면이면 무시
    const sheet = document.getElementById("song-sheet");
    if (e.key === "Escape" && sheet.classList.contains("open")){ e.preventDefault(); closeSongSheet(); return; }
    if (sheet.classList.contains("open")){
      if (e.key === "Tab"){
        const focusable = [...sheet.querySelectorAll("button, input")].filter(el => !el.disabled && el.offsetParent !== null);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
      return;
    }
    const tag = (e.target && e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    // 떼창만 듣기 중에는 구간 이동으로 (화면의 ‹ › 와 같은 동작)
    if (e.key === "ArrowLeft"){  e.preventDefault(); chantOnly ? skipPart(-1) : document.getElementById("prev-song").click(); }
    if (e.key === "ArrowRight"){ e.preventDefault(); chantOnly ? skipPart(1)  : document.getElementById("next-song").click(); }
  };
  document.addEventListener("keydown", songKeyHandler);
}

/* ── 떼창만 듣기 ─────────────────────────────────────────────
   켜 두면 떼창 구간만 이어서 들려준다. 구간이 끝나면 다음 떼창으로
   건너뛰고, 마지막까지 들으면 멈춘다(재생을 누르면 처음 구간부터 다시).
   곡을 옮겨도 켜진 상태는 그대로 — 여러 곡의 떼창만 연습할 수 있게.
   새로 고치면 꺼진다(모르고 켜 둔 채 공연장에서 헤매지 않도록). */
let chantOnly       = false;
let chantIdx        = -1;      // 지금 듣고 있는 구간 번호
let chantDone       = false;   // 마지막 구간까지 다 들었는지
/* 구간을 옮기라고 시킨 뒤, 실제로 그 자리에 도착할 때까지는 판단을 멈춘다.
   유튜브는 seekTo 를 시켜도 잠깐 동안 옛 위치를 알려 주기 때문에,
   시간만 재고 넘어가면 회선이 느릴 때 구간을 연달아 건너뛰게 된다. */
let chantWantSec    = null;    // 지금 도착하려는 위치(초)
let chantWaitUntil  = 0;       // 여기까지도 못 가면 포기하고 그냥 진행

function currentChantBlocks(){ return chantBlocks(currentSong); }

function repaintChantVersionLines(song = currentSong){
  const list = document.getElementById("lyrics-list");
  if (!list || !song || !Array.isArray(song.lyrics)) return;
  list.querySelectorAll(".lyric-line").forEach(line => {
    const index = Number(line.dataset.idx);
    const lyric = song.lyrics[index];
    if (!lyric) return;
    const chantClass = chantLineClass(lyric, song);
    line.classList.toggle("is-chant", chantClass.split(" ").includes("is-chant"));
    line.classList.toggle("chant-partial", chantClass.split(" ").includes("chant-partial"));
    line.classList.toggle("has-chant-segment", chantClass.split(" ").includes("has-chant-segment"));
    const icons = line.querySelector(".lyric-icons");
    if (icons) icons.innerHTML = lyricIconsHtml(lyric, song);
  });
}

function setChantVersion(next){
  if (next !== "jp" && next !== "kr" || next === chantVersion) {
    applyChantVersionUi();
    return;
  }

  chantVersion = next;
  store("horo-chant-version", chantVersion);
  songMarksCache.clear();
  jpChantTimeCache.clear();
  chantBlockCache.clear();
  chantIdx = -1;
  chantDone = false;
  chantWantSec = null;
  chantWaitUntil = 0;
  applyChantVersionUi();

  if (currentSong) {
    repaintChantVersionLines(currentSong);
    renderChantVersionNote(currentSong);
    renderChantNotes(currentSong);
    syncChantUi();
    paintChantBar();
    if (chantOnly && currentChantBlocks().length) jumpToChant(0);
    else if (isSongViewActive()) updateLyricsSync(true);
  }

  if (document.getElementById("song-list")) paintSongList();
}

/* 화면(버튼·흐리게 처리)을 지금 상태에 맞춘다.
   떼창이 아예 없는 곡에서는 흐리게 처리를 하지 않는다 — 안 그러면
   가사 전체가 흐려져서 읽을 수가 없다. */
function syncChantUi(){
  const page = document.getElementById("song-page");
  if (page) page.classList.toggle("chant-only", chantOnly && currentChantBlocks().length > 0);
  const btn = document.getElementById("chant-btn");
  if (btn){
    btn.classList.toggle("active", chantOnly);
    btn.setAttribute("aria-pressed", chantOnly ? "true" : "false");
  }
}

/* 띠의 글자와 버튼 상태를 지금 상황에 맞춘다 */
function paintChantBar(){
  const bar = document.getElementById("chant-bar");
  if (!bar) return;
  bar.hidden = !chantOnly;
  if (!chantOnly) return;

  const blocks = currentChantBlocks();
  const msg    = document.getElementById("chant-msg");
  const count  = document.getElementById("chant-count");
  const prev   = document.getElementById("chant-prev");
  const next   = document.getElementById("chant-next");

  if (!blocks.length){
    if (msg)   msg.textContent = "這首歌沒有大合唱段落";
    if (count) count.textContent = "";
    if (prev)  prev.disabled = true;
    if (next)  next.disabled = true;
    return;
  }
  // 손가락으로 쓰는 기기에는 밀기 안내를, 키보드가 있는 기기에는 방향키 안내를
  const touch = window.matchMedia && window.matchMedia("(hover: none)").matches;
  if (msg) msg.textContent = chantDone ? "結束・按播放即可從頭開始"
                           : (touch ? "左右滑動切換段落" : "用 ← → 切換段落");
  if (count) count.textContent = `第 ${Math.max(1, chantIdx + 1)} / ${blocks.length} 段`;
  if (prev) prev.disabled = chantIdx <= 0;
  if (next) next.disabled = chantIdx >= blocks.length - 1;
}

/* i 번째 떼창 구간의 시작으로 옮겨 재생한다 */
function jumpToChant(i){
  const blocks = currentChantBlocks();
  if (!blocks.length) return;
  chantIdx  = Math.max(0, Math.min(blocks.length - 1, i));
  chantDone = false;
  chantExpect(blocks[chantIdx].start);     // 도착할 때까지 판단 보류
  paintChantBar();
  if (player && typeof player.seekTo === "function"){
    try { player.seekTo(blocks[chantIdx].start, true); player.playVideo(); } catch(e){}
  }
}

/* "이 위치로 갈 거야" 라고 적어 둔다 — 도착하면 판단을 다시 시작한다 */
function chantExpect(sec){
  chantWantSec   = sec;
  chantWaitUntil = Date.now() + 4000;      // 4초까지 기다려 보고 포기
}

function chantStep(d){
  const blocks = currentChantBlocks();
  if (!blocks.length) return;
  if (chantDone && d < 0) { jumpToChant(blocks.length - 1); return; }
  jumpToChant(chantIdx + d);
}

/* 재생 위치를 보고 구간을 벗어났으면 다음 떼창으로 옮긴다.
   (updateLyricsSync 가 0.1초마다 불러 준다)
   옮겼으면 true 를 돌려준다. */
function chantOnlyTick(cur){
  if (!chantOnly || cur === null || !isFinite(cur)) return false;
  const blocks = currentChantBlocks();
  if (!blocks.length) return false;

  const t = cur - LYRIC_LEAD_SEC;                 // 실제 재생 위치

  // 옮겨 달라고 한 자리에 아직 도착하지 않았으면 기다린다
  if (chantWantSec !== null){
    if (Math.abs(t - chantWantSec) < 1.6 || Date.now() > chantWaitUntil) chantWantSec = null;
    else return false;
  }
  const inside = blocks.findIndex(b => t >= b.start - 0.35 && t <= b.end);
  if (inside >= 0){
    if (inside !== chantIdx || chantDone){ chantIdx = inside; chantDone = false; paintChantBar(); }
    return false;
  }
  const next = blocks.findIndex(b => b.start > t);
  if (next >= 0){ jumpToChant(next); return true; }

  // 마지막 떼창까지 다 들었다 — 여기서 멈춘다
  chantDone = true;
  chantIdx  = blocks.length - 1;
  paintChantBar();
  if (player && typeof player.pauseVideo === "function"){ try { player.pauseVideo(); } catch(e){} }
  return true;
}

/* 스위치를 켜고 끌 때 */
function setChantOnly(on){
  chantOnly = !!on;
  chantDone = false;
  chantIdx  = -1;
  syncChantUi();
  paintChantBar();
  if (chantOnly){
    const blocks = currentChantBlocks();
    if (blocks.length) jumpToChant(0);
  } else {
    updateLyricsSync(true);
  }
}

/* 구간·곡 넘기기 — 가사를 옆으로 밀거나 ← → 를 눌렀을 때.
   떼창만 듣기가 켜져 있으면 화면의 ‹ › 와 똑같이 떼창 구간을 옮기고,
   그 끝에서 한 번 더 하면 앞뒤 곡으로 넘어간다. */
function skipPart(d){
  if (!isSongViewActive()) return;
  const blocks = currentChantBlocks();
  if (chantOnly && blocks.length){
    const at = chantIdx + d;
    if (d > 0 && !chantDone && at <= blocks.length - 1){ jumpToChant(at); return; }
    if (d < 0 && chantDone){ jumpToChant(blocks.length - 1); return; }
    if (d < 0 && at >= 0){ jumpToChant(at); return; }
  }
  goNeighbor(d);
}

/* 사용자가 곡을 고른 "그 탭" 안에서 재생을 먼저 걸고 화면을 이동한다.
   (모바일은 사용자 제스처 안에서 시작한 재생만 소리를 허용하기 때문) */
function gotoSong(song){
  if (!song) return;
  playVideoFor(song.youtubeId);
  location.hash = `#/song/${song.id}`;
}

function isSongViewActive(){
  return !songView.classList.contains("offstage");
}

function applySongTempo(song){
  const page = document.getElementById("song-page");
  if (!page) return;

  const bpm = Number(SONG_BPM[song?.id]);
  if (!Number.isFinite(bpm) || bpm <= 0) return;

  const beatSeconds = 60 / bpm / Math.max(0.01, playbackRate);
  page.style.setProperty("--song-bpm", String(bpm));
  page.style.setProperty("--icon-beat-duration", `${beatSeconds.toFixed(3)}s`);
  page.dataset.bpm = String(bpm);
  iconClockStartedAt = performance.now();
  updateDocumentPip();
}

function renderSong(song){
  const renderToken = ++songRenderToken;
  buildSongShell();

  if (!Array.isArray(song.lyrics)){
    currentSong = song;
    const { prev, next } = songNeighbors(song);
    const page = document.getElementById("song-page");
    document.getElementById("song-page-heading").textContent = song.title;
    document.getElementById("song-picker-title").innerHTML = renderSongTitle(song.title);
    document.getElementById("prev-song").title = `上一首：${prev.title}`;
    document.getElementById("next-song").title = `下一首：${next.title}`;
    document.getElementById("lyrics-list").innerHTML = "";
    document.getElementById("video-status").textContent = "正在載入歌詞…";
    page?.classList.remove("song-ready");
    songView.classList.remove("offstage");
    songView.inert = false;
    app.style.display = "none";

    loadSongLyrics().then(songMap => {
      if (renderToken !== songRenderToken || !location.hash.startsWith("#/song/")) return;
      const fullSong = songMap.get(song.id);
      if (fullSong) renderSong({ ...song, ...fullSong });
    });
    return;
  }

  loadFurigana().then(()=>{
    if (currentSong === song) repaintJapaneseReadings();
  });

  currentSong = song;
  lastActiveIdx = -1;
  karaokeActiveLine = null;
  karaokeTiming = null;
  // 떼창만 듣기는 곡을 옮겨도 켜진 채로 — 구간 번호만 새 곡 기준으로 다시
  chantIdx = -1; chantDone = false; chantWantSec = null; chantWaitUntil = 0;
  startActiveGuard();          // 여러 줄이 켜지는 일이 없도록 지켜본다
  hideTipPic();                 // 곡을 바꾸면 짤방도 초기화
  if (scrollRafId !== null) { cancelAnimationFrame(scrollRafId); scrollRafId = null; }

  const { prev, next } = songNeighbors(song);
  const page = document.getElementById("song-page");
  applySongTempo(song);
  if (song.cover) page.style.setProperty("--song-cover", `url('${song.cover}')`);
  else            page.style.removeProperty("--song-cover");

  document.getElementById("song-picker-title").innerHTML = renderSongTitle(song.title);
  document.getElementById("song-page-heading").textContent = song.title;
  const lyricsCredit = document.getElementById("lyrics-credit");
  if (lyricsCredit) {
    const hasCredit = Boolean(song.translationCredit);
    if (hasCredit) {
      const creditUrl = song.translationCreditUrl || TRANSLATION_CREDIT_URL;
      const creditLink = `<a href="${creditUrl}" target="_blank" rel="noopener">${escapeHtml(song.translationCredit)}</a>`;
      const sourceLink = song.translationSourceUrl
        ? ` · <a href="${song.translationSourceUrl}" target="_blank" rel="noopener">出處</a>`
        : "";
      const licenseLink = song.translationLicenseUrl
        ? ` · <a href="${song.translationLicenseUrl}" target="_blank" rel="noopener">${escapeHtml(song.translationLicense || "授權")}</a>`
        : "";
      lyricsCredit.innerHTML = `中譯歌詞作者：${creditLink}${sourceLink}${licenseLink}`;
    } else {
      lyricsCredit.innerHTML = "";
    }
    lyricsCredit.hidden = !hasCredit;
  }
  // 어디서 들어왔는지에 따라 '뒤로' 버튼의 안내 글을 바꾼다
  const backBtn = document.getElementById("song-back-btn");
  if (backBtn){
    const label = songFrom === "setlist" ? "返回歌單" : "返回歌曲清單";
    backBtn.title = label;
    backBtn.setAttribute("aria-label", label);
  }
  document.getElementById("prev-song").title = `上一首：${prev.title}`;
  document.getElementById("next-song").title = `下一首：${next.title}`;
  document.getElementById("watch-on-yt").href =
    `https://www.youtube.com/watch?v=${encodeURIComponent(song.youtubeId)}`;

  document.getElementById("lyrics-list").innerHTML = song.lyrics.map((l,i)=>`
    <li>
      <button class="lyric-line ${chantLineClass(l, song)}" data-time="${l.time}" data-idx="${i}">
        <span class="lyric-icons">${lyricIconsHtml(l, song)}</span>
        <span class="lyric-body">
          <span class="lyric-jp" lang="ja">${renderJapaneseLyricLine(l, song)}</span>
          <span class="lyric-romaji" lang="ja-Latn">${readingMode === "both" ? renderRomajiLyricLine(l, song) : ""}</span>
          <span class="lyric-zh">${withIcons(l.tr || "")}</span>
        </span>
      </button>
    </li>`).join("");
  document.querySelectorAll("#lyrics-list .lyric-line").forEach(line => {
    markLyricChantSegments(line, song.lyrics[Number(line.dataset.idx)]);
  });
  decorateKaraokeLines(song);
  setKaraokeSourceStatus("loading", "歌詞逐字時間：正在尋找開源時間碼…");

  document.getElementById("song-sheet-list").innerHTML = sheetSongs().map((s, i)=>`
    <li data-no="${songNo(s)}">
      <button class="song-sheet-item${s.id === song.id ? " current" : ""}" data-id="${s.id}" data-pos="${i}"${s.id === song.id ? ' aria-current="true"' : ""}>
        <span class="song-sheet-num">${pad(songNo(s))}</span>
        <span class="song-sheet-name">${renderSongTitle(s.title)}</span>
        ${s.id === song.id ? `<span class="song-sheet-now">目前播放</span>` : ""}
      </button>
    </li>`).join("");

  const sheetTitle = document.getElementById("song-sheet-title");
  if (sheetTitle) sheetTitle.textContent =
    songFrom === "setlist" ? "歌單歌曲" : "選擇歌曲";

  closeSongSheet();
  applySheetFilter();

  // 곡 화면 보이기 (먼저 보여야 컨테이너 높이를 정확히 잴 수 있음)
  songView.classList.remove("offstage");
  songView.inert = false;
  app.style.display = "none";

  applyChantVersionUi();
  renderChantVersionNote(song);
  renderChantNotes(song);
  syncChantUi();                         // 떼창만 듣기 상태 반영
  paintChantBar();
  applyVenueMode();                      // 단축모드 상태 반영 (글자 크기 등)
  updateReadingUi();                      // 假名／羅馬拼音顯示狀態
  updateLyricDisplayUi();                 // 日文／繁中顯示狀態
  updateKaraokeUi();                      // 逐字 Karaoke 高亮狀態
  updateLyricsPadding();                 // 첫 소절도 가운데 오도록 여백 계산
  observeLyricLines();                   // 보이는 줄의 아이콘만 움직이게
  requestWakeLock();                     // 가사 보는 동안 화면이 꺼지지 않게
  const scroller = songView.querySelector(".lyrics-scroll");
  if (scroller) scroller.scrollTop = 0;

  showVideoStatus();
  loadYouTubeApi();
  ensurePlayer();
  ensurePlaying(song.youtubeId);
  loadKaraokeTiming(song);
  scheduleJapaneseFontLoad(songJapaneseFontText(song), [400, 500, 700]);
}

/* 보이는 가사 줄에만 .in-view 를 붙여, 화면 밖 아이콘 애니메이션은 멈춰 둔다.
   (IntersectionObserver 를 못 쓰는 아주 오래된 브라우저에서는 전부 움직이게 둠) */
let lyricObserver = null;
function observeLyricLines(){
  if (lyricObserver){ lyricObserver.disconnect(); lyricObserver = null; }
  const container = songView.querySelector(".lyrics-scroll");
  const lines = songView.querySelectorAll(".lyric-line");
  if (!container || !lines.length) return;
  if (!("IntersectionObserver" in window)){
    const now = performance.now();
    lines.forEach(el => {
      el.classList.add("in-view");
      syncIconAnimationPhase(el, now);
    });
    return;
  }
  lyricObserver = new IntersectionObserver((entries)=>{
    const now = performance.now();
    entries.forEach(e => {
      e.target.classList.toggle("in-view", e.isIntersecting);
      if (e.isIntersecting) syncIconAnimationPhase(e.target, now);
    });
  }, { root: container, rootMargin: "120px 0px" });
  lines.forEach(el => lyricObserver.observe(el));
}

/*
 * 可視區外的圖示仍會暫停以節省電量，但重新進入畫面時要接回同一個全域拍點。
 * 否則每一列會從自己的第 0 拍開始，看起來就像同一種符號各自不同步。
 */
function syncIconAnimationPhase(line, now){
  const page = document.getElementById("song-page");
  const bpm = Number(page && page.dataset.bpm);
  if (!line || !page || !Number.isFinite(bpm) || bpm <= 0) return;

  const periodMs = 60000 / bpm;
  const elapsedMs = Math.max(0, (now || performance.now()) - iconClockStartedAt);
  const delay = -((elapsedMs % periodMs) / 1000);
  const icons = line.querySelectorAll(
    ".ico-wave svg, .ico-mic svg, .ico-jump svg, "
    + ".ico-spin .arm, .ico-clap .hand, .ico-clap .spark"
  );
  icons.forEach(icon => {
    icon.style.animationDelay = `${delay.toFixed(3)}s`;
  });
}

/* 단축모드 화면 적용 — 곡을 바꿔도 유지된다 */
function applyVenueMode(){
  const page = document.getElementById("song-page");
  const btn  = document.getElementById("venue-btn");
  if (!page) return;
  page.classList.toggle("venue", venueMode);
  page.classList.toggle("offline", !navigator.onLine);
  if (btn) btn.classList.toggle("active", venueMode);
  if (venueMode){
    const notesButton = document.getElementById("chant-notes-toggle");
    const notesPanel = document.getElementById("chant-notes");
    if (notesButton) {
      notesButton.classList.remove("active");
      notesButton.setAttribute("aria-expanded", "false");
    }
    if (notesPanel) notesPanel.hidden = true;
  }
  updatePlayButton();
  placeTipPic();                 // 짤방 자리도 모드에 맞게 옮긴다
  // 글자 크기가 달라지므로 가운데 기준을 다시 잡고 현재 소절로 맞춘다
  updateLyricsPadding();
  updateLyricsSync(true);
}

function updateReadingUi(){
  const btn = document.getElementById("reading-btn");
  const value = document.getElementById("reading-value");
  const shortValue = document.getElementById("reading-value-mobile");
  const label = readingModeLabel();
  const shortLabel = readingModeShortLabel();
  const page = document.getElementById("song-page");
  if (page) page.classList.toggle("reading-both", readingMode === "both");
  if (value) value.textContent = label;
  if (shortValue) shortValue.textContent = shortLabel;
  if (btn){
    btn.classList.toggle("active", readingMode !== "kana");
    btn.setAttribute("aria-pressed", readingMode !== "kana" ? "true" : "false");
    btn.setAttribute("aria-label", `切換日文讀音：目前顯示${label}`);
  }
  updateDocumentPip();
}

function updateLyricDisplayUi(){
  const page = document.getElementById("song-page");
  if (!page) return;
  page.classList.toggle("hide-japanese", !showJapanese);
  page.classList.toggle("hide-chinese", !showChinese);

  const japaneseBtn = document.getElementById("japanese-toggle");
  if (japaneseBtn){
    japaneseBtn.classList.toggle("active", showJapanese);
    japaneseBtn.setAttribute("aria-pressed", showJapanese ? "true" : "false");
    japaneseBtn.setAttribute("aria-label", `切換日文歌詞：目前${showJapanese ? "顯示" : "隱藏"}`);
  }
  const chineseBtn = document.getElementById("chinese-toggle");
  if (chineseBtn){
    chineseBtn.classList.toggle("active", showChinese);
    chineseBtn.setAttribute("aria-pressed", showChinese ? "true" : "false");
    chineseBtn.setAttribute("aria-label", `切換繁中翻譯：目前${showChinese ? "顯示" : "隱藏"}`);
  }
  updateLyricsPadding();
  updateDocumentPip();
}

function updateKaraokeUi(){
  const page = document.getElementById("song-page");
  if (!page) return;
  page.classList.toggle("karaoke-off", !karaokeEnabled);

  const btn = document.getElementById("karaoke-btn");
  if (btn){
    btn.classList.toggle("active", karaokeEnabled);
    btn.setAttribute("aria-pressed", karaokeEnabled ? "true" : "false");
    btn.setAttribute("aria-label", `切換逐字卡拉OK高亮：目前${karaokeEnabled ? "開啟" : "關閉"}`);
  }

  if (!karaokeEnabled){
    clearKaraokeLine(karaokeActiveLine);
    karaokeActiveLine = null;
  }
  updateLyricsSync(true);
}

/* 切換讀音時只重畫日文列，保留目前歌曲、播放進度與繁中字幕。 */
function repaintJapaneseReadings(){
  if (!currentSong) return;
  const list = document.getElementById("lyrics-list");
  if (!list) return;
  const now = performance.now();
  list.querySelectorAll(".lyric-line").forEach(line => {
    const idx = Number(line.dataset.idx);
    const lyric = currentSong.lyrics && currentSong.lyrics[idx];
    const target = line.querySelector(".lyric-jp");
    const romajiTarget = line.querySelector(".lyric-romaji");
    if (!lyric || !target) return;
    target.innerHTML = renderJapaneseLyricLine(lyric, currentSong);
    if (romajiTarget){
      romajiTarget.innerHTML = readingMode === "both"
        ? renderRomajiLyricLine(lyric, currentSong)
        : "";
    }
    markLyricChantSegments(line, lyric);
    decorateKaraokeLine(target);
    if (romajiTarget) decorateKaraokeLine(romajiTarget);
    assignKaraokeLineTiming(line, karaokeLineTiming(currentSong, idx));
    syncIconAnimationPhase(line, now);
  });
  /* The reading toggle replaces the lyric DOM. Re-run the normal sync path
     so the active line and the newly allocated romaji timings are painted
     against the current video position immediately. */
  updateLyricsSync(true);
}
window.addEventListener("online",  ()=>{ if (songShellBuilt) applyVenueMode(); });
window.addEventListener("offline", ()=>{ if (songShellBuilt) applyVenueMode(); });

/* 곡 화면을 벗어날 때 — 플레이어는 부수지 않고 일시정지만 한다
   (iframe 을 없앴다 다시 만들면 모바일에서 소리 권한이 초기화됨) */
function leaveSongView(){
  stopSyncTimer();
  stopActiveGuard();
  pendingVideoId = null;
  closeSongSheet();
  hideTipPic();
  if (lyricObserver){ lyricObserver.disconnect(); lyricObserver = null; }
  releaseWakeLock();
  documentPip.close();
  if (player && typeof player.pauseVideo === 'function') {
    try { player.pauseVideo(); } catch(e){}
  }
  if (songShellBuilt) songView.classList.add("offstage");
  songView.inert = true;
  app.style.display = "";
}

/* ── 짤방(동작 사진) ─────────────────────────────────────────
   가사 줄의 pic:"이름" 을 보고, 그 줄이 나올 때만 가사 위에 사진을 띄운다.
   같은 사진이 이어지는 줄에서는 다시 뜨지 않고 그대로 유지된다.
   파일이 없거나 못 불러오면 조용히 넘어간다(화면이 깨지지 않도록). */
let currentPicKey = null;                 // 지금 떠 있는 짤방 이름
const picBroken   = new Set();            // 불러오기 실패한 주소 — 다시 시도하지 않음

function resolvePic(id){
  if (!id || typeof id !== "string") return null;
  const entry = PICS[id];
  // 등록표에 없으면 경로를 직접 적은 것으로 본다 ("./images/tips/a.gif")
  const src = entry ? entry.src : (/[\/.]/.test(id) ? id : null);
  if (!src || picBroken.has(src)) return null;
  const video = entry?.video || (/\.gif$/i.test(src) ? src.replace(/\.gif$/i, ".webm") : "");
  const fallback = entry?.fallback || (/\.webp$/i.test(src) ? src.replace(/\.webp$/i, ".gif") : "");
  return { key: id, src, video, fallback, caption: (entry && entry.caption) || "" };
}

function hideTipPic(){
  const box = document.getElementById("tip-pic");
  if (!box) return;
  const video = document.getElementById("tip-pic-video");
  const img = document.getElementById("tip-pic-img");
  if (video){
    video.pause();
    video.hidden = true;
    video.setAttribute("aria-hidden", "true");
  }
  if (img) img.hidden = true;
  box.classList.remove("show", "big");
  currentPicKey = null;
}

/* 짤방을 화면 크기·모드에 맞는 자리로 옮겨 놓는다.
     · 휴대폰   → 유튜브 영상 바로 아래 오른쪽 (영상·가사 둘 다 안 가림)
     · PC 2단   → 가사 칸 오른쪽 위 모서리
     · 단축모드 → 가사 위 가운데 (영상이 없는 화면)               */
function placeTipPic(){
  const box = document.getElementById("tip-pic");
  if (!box) return;
  const lyricsHost = songView.querySelector(".lyrics-pane");
  const topHost    = songView.querySelector(".song-fixed-top");
  if (!lyricsHost || !topHost) return;
  const wide = window.matchMedia(
    "(min-width:900px), (orientation: landscape) and (max-height:600px)"
  ).matches;

  const mode = venueMode ? "at-lyrics"          // 단축모드 — 가사 위 가운데
             : wide      ? "at-lyrics-right"    // PC 2단 — 가사 칸 오른쪽 위
                         : "at-below-video";    // 휴대폰 — 영상 바로 아래 오른쪽
  const host = (mode === "at-below-video") ? topHost : lyricsHost;

  if (!box.classList.contains(mode)){
    box.classList.remove("at-below-video", "at-lyrics", "at-lyrics-right", "big");
    box.classList.add(mode);
  }
  if (box.parentElement !== host) host.appendChild(box);
}

function showTipPic(pic){
  const box = document.getElementById("tip-pic");
  const video = document.getElementById("tip-pic-video");
  const img = document.getElementById("tip-pic-img");
  const cap = document.getElementById("tip-pic-cap");
  if (!box || !img) return;

  const showImageFallback = ()=>{
    if (video){
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.hidden = true;
      video.setAttribute("aria-hidden", "true");
    }
    img.hidden = false;
    img.alt = pic.caption || "應援動作";
    img.dataset.fallbackTried = "0";
    img.onerror = ()=>{
      if (img.dataset.fallbackTried !== "1" && pic.fallback && pic.fallback !== pic.src){
        img.dataset.fallbackTried = "1";
        img.src = pic.fallback;
        return;
      }
      picBroken.add(pic.src);
      hideTipPic();
    };
    img.src = pic.src;
  };

  if (video && pic.video && video.canPlayType("video/webm")){
    video.onerror = showImageFallback;
    video.onloadeddata = ()=>{
      video.hidden = false;
      video.setAttribute("aria-hidden", "false");
      img.hidden = true;
      video.play().catch(()=>{});
    };
    video.muted = true;
    video.hidden = true;
    video.setAttribute("aria-hidden", "true");
    video.src = pic.video;
    video.load();
  } else {
    showImageFallback();
  }
  if (cap) cap.textContent = pic.caption || "";
  box.classList.remove("big");
  box.classList.add("show");
  currentPicKey = pic.key;
}

/* 지금 활성화된 가사 줄에 맞춰 짤방을 갈아 끼운다 */
function updateTipPic(activeIdx){
  if (!currentSong) return hideTipPic();
  const line = activeIdx >= 0 ? currentSong.lyrics[activeIdx] : null;
  const pic  = line ? resolvePic(line.pic) : null;

  if (!pic) return hideTipPic();
  if (pic.key === currentPicKey) return;   // 같은 사진이 이어지는 줄 — 그대로 둔다
  showTipPic(pic);
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/*
 * 歌詞排版原則：中文／日文與相鄰的半形英數字之間保留一個半形空白。
 * 這是顯示層的處理，原始歌詞仍維持不變，避免影響假名索引與卡拉 OK 對齊。
 */
const CJK_CHAR_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;
const LATIN_OR_DIGIT_CHAR_RE = /[A-Za-z0-9]/;
const ROMAJI_WORD_CHAR_RE = /[\p{Script=Latin}\p{N}]/u;
const ROMAJI_WORD_CONTINUATION_RE = /[\p{Script=Latin}\p{N}'’_-]/u;
const CJK_TO_LATIN_RE = /([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])(?=[A-Za-z0-9])/gu;
const LATIN_TO_CJK_RE = /([A-Za-z0-9])(?=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])/gu;

function spaceCjkLatinText(value){
  return String(value ?? "")
    .replace(CJK_TO_LATIN_RE, "$1 ")
    .replace(LATIN_TO_CJK_RE, "$1 ");
}

function edgeNonSpaceChar(value, fromEnd){
  const chars = Array.from(String(value || ""));
  while (chars.length && /\s/u.test(fromEnd ? chars.at(-1) : chars[0])){
    if (fromEnd) chars.pop();
    else chars.shift();
  }
  return fromEnd ? chars.at(-1) || "" : chars[0] || "";
}

/* furigana 會產生帶有 <ruby>/<rt> 的 HTML；只處理文字片段，保留標記本身。 */
function spaceCjkLatinMarkup(markup){
  const parts = String(markup || "").split(/(<[^>]*>)/g);
  const textIndexes = [];

  parts.forEach((part, index) => {
    if (/^<[^>]*>$/.test(part)) return;
    parts[index] = spaceCjkLatinText(part);
    textIndexes.push(index);
  });

  for (let i = 1; i < textIndexes.length; i++){
    const previousIndex = textIndexes[i - 1];
    const currentIndex = textIndexes[i];
    const previous = parts[previousIndex];
    const current = parts[currentIndex];
    const previousChar = edgeNonSpaceChar(previous, true);
    const currentChar = edgeNonSpaceChar(current, false);
    const hasTrailingSpace = /\s$/u.test(previous);
    const hasLeadingSpace = /^\s/u.test(current);

    if (!hasTrailingSpace && !hasLeadingSpace
      && CJK_CHAR_RE.test(previousChar) && LATIN_OR_DIGIT_CHAR_RE.test(currentChar)){
      parts[currentIndex] = " " + current;
    } else if (!hasTrailingSpace && !hasLeadingSpace
      && LATIN_OR_DIGIT_CHAR_RE.test(previousChar) && CJK_CHAR_RE.test(currentChar)){
      parts[previousIndex] = previous + " ";
    }
  }

  return parts.join("");
}

/* 가사 글자를 안전하게 처리하면서, [wave] [clap] [mic] 같은 표시를
   그 자리에서 움직이는 아이콘으로 바꿔 준다. 가사 어느 위치에나 넣을 수 있다. */
/* [wave] 처럼 대괄호로도, (wave) 처럼 소괄호로도 쓸 수 있게 둘 다 인식 */
const ICON_TOKEN_RE = /[\[(](wave|clap|mic|chant|jump|spin|turn)[\])]/gi;
function withIcons(str){
  if (str === undefined || str === null) return "";
  return escapeHtml(spaceCjkLatinText(str)).replace(ICON_TOKEN_RE, (m, key)=> INLINE_ICONS[key.toLowerCase()] || m);
}
function renderKanaLine(str){
  const source = String(str ?? "");
  const ruby = window.JP_FURIGANA && window.JP_FURIGANA[source];
  if (!ruby) return withIcons(source);
  return spaceCjkLatinMarkup(ruby).replace(ICON_TOKEN_RE, (m, key)=> INLINE_ICONS[key.toLowerCase()] || m);
}

function renderRomajiLine(str, includeIcons = true){
  const source = String(str ?? "");
  const romaji = window.JP_ROMAJI && window.JP_ROMAJI[source];
  const value = typeof romaji === "string" ? romaji : source;
  return includeIcons
    ? withIcons(value)
    : escapeHtml(spaceCjkLatinText(value)).replace(ICON_TOKEN_RE, "");
}

function readingModeLabel(mode = readingMode){
  if (mode === "romaji") return "羅馬字";
  if (mode === "both") return "假名+羅馬字";
  return "假名";
}

function readingModeShortLabel(mode = readingMode){
  if (mode === "romaji") return "羅";
  if (mode === "both") return "假+羅";
  return "假";
}

function renderJapaneseLine(str){
  return readingMode === "romaji" ? renderRomajiLine(str) : renderKanaLine(str);
}

/* 日本版有些應援只落在一句歌詞中的幾個字（例如「愛して」），不能
   直接把整列套上 .is-chant。先把完整歌詞轉成既有的假名／羅馬字
   HTML，再在對應的可見文字節點外包一層標記，這樣不會丟掉 ruby 讀音。 */
function jpChantSegmentsForLine(line, song = currentSong){
  if (chantVersion !== "jp" || !line || !song) return [];
  const guide = JP_CHANT_GUIDES[song.id];
  if (!guide || !Array.isArray(guide.chantSegments)) return [];
  const time = Number(line.time);
  if (!Number.isFinite(time)) return [];
  return guide.chantSegments.filter(segment =>
    segment && Math.abs(Number(segment.time) - time) < 0.01 && segment.text
  );
}

function chantSegmentText(segment, mode = "jp"){
  if (!segment) return "";
  return String(mode === "romaji" ? (segment.romaji || segment.text) : segment.text || "");
}

function wrapChantMarkup(markup, target, options = {}){
  const value = String(markup || "");
  const needle = String(target || "");
  if (!needle || !value || typeof document === "undefined") return value;

  const template = document.createElement("template");
  template.innerHTML = value;
  const entries = [];
  const visit = (node, hidden = false) => {
    if (node.nodeType === Node.TEXT_NODE){
      if (!hidden){
        Array.from(node.nodeValue || "").forEach((char, offset) => {
          entries.push({ node, char, offset });
        });
      }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    const element = node.nodeType === Node.ELEMENT_NODE ? node : null;
    const nextHidden = hidden || Boolean(element && (
      element.tagName === "RT" || element.tagName === "RP"
      || element.classList.contains("ico") || element.classList.contains("chant-segment")
    ));
    [...node.childNodes].forEach(child => visit(child, nextHidden));
  };
  visit(template.content);

  const visible = entries.map(entry => entry.char).join("");
  const start = visible.indexOf(needle);
  if (start < 0) return value;

  const selected = entries.slice(start, start + Array.from(needle).length);
  if (selected.length !== Array.from(needle).length) return value;

  const grouped = new Map();
  selected.forEach(entry => {
    if (!grouped.has(entry.node)) grouped.set(entry.node, []);
    grouped.get(entry.node).push(entry.offset);
  });

  [...grouped.entries()].reverse().forEach(([node, offsets]) => {
    if (!node.parentNode) return;
    const first = Math.min(...offsets);
    const last = Math.max(...offsets) + 1;
    const parent = node.parentNode;
    const ruby = parent.nodeType === Node.ELEMENT_NODE && parent.tagName === "RUBY"
      && first === 0 && last === (node.nodeValue || "").length
      ? parent
      : null;
    const span = document.createElement("span");
    span.className = `chant-segment${options.breakBefore ? " break-before" : ""}`;

    if (ruby){
      ruby.parentNode.insertBefore(span, ruby);
      span.appendChild(ruby);
      return;
    }

    let selectedNode = node;
    if (first > 0) selectedNode = node.splitText(first);
    if (last - first < (selectedNode.nodeValue || "").length){
      selectedNode.splitText(last - first);
    }
    selectedNode.parentNode.insertBefore(span, selectedNode);
    span.appendChild(selectedNode);
  });

  return template.innerHTML;
}

function renderChantAwareLine(str, line, song, render, mode){
  let markup = render(str);
  jpChantSegmentsForLine(line, song).forEach(segment => {
    markup = wrapChantMarkup(markup, chantSegmentText(segment, mode), segment);
  });
  return markup;
}

function renderJapaneseLyricLine(line, song = currentSong){
  const source = line && line.jp || "";
  const mode = readingMode === "romaji" ? "romaji" : "jp";
  return renderChantAwareLine(source, line, song, text => renderJapaneseLine(text), mode);
}

function renderRomajiLyricLine(line, song = currentSong){
  const source = line && line.jp || "";
  return renderChantAwareLine(source, line, song, text => renderRomajiLine(text, false), "romaji");
}

/*
 * 分段合唱標色
 *
 * data.js 把 jp／tr 的分段另存在 jpSegments／trSegments。畫面照常用整行
 * 字串渲染，渲染後再依分段把合唱段包成 .seg-chant。比對時略過空白與
 * 動作圖示，因為中日英之間的空白是顯示層另外補上的。
 */
const isLyricSpace = (ch)=> /\s/u.test(ch);

function hasChantSegment(segments){
  return Array.isArray(segments) && segments.some(seg => seg && seg.tag === "chant");
}

function lineHasChantSegments(line){
  return !!line && (hasChantSegment(line.jpSegments) || hasChantSegment(line.trSegments));
}

/* 分段是依日本版應援整理的，只在日本版生效；韓國版維持整行標色。 */
function lineUsesChantSegments(line){
  return chantVersion === "jp" && lineHasChantSegments(line);
}

/* 依分段原文逐字標記：每個非空白字元對應 true（合唱）或 false。 */
function segmentChantMask(segments){
  const mask = [];
  segments.forEach(seg => {
    const text = String(seg && seg.text || "").replace(ICON_TOKEN_RE, "");
    Array.from(text).forEach(ch => {
      if (!isLyricSpace(ch)) mask.push(seg.tag === "chant");
    });
  });
  return mask;
}

/* 羅馬拼音沒有分段，只能在整行拼音裡找原文相同的英文合唱段。
   假名合唱段的拼音對應之後再處理，找不到時就不標色。 */
function romajiChantMask(compactText, segments){
  const mask = Array.from(compactText).map(() => false);
  let cursor = 0;
  segments.forEach(seg => {
    if (!seg || seg.tag !== "chant") return;
    const needle = Array.from(String(seg.text || "").replace(ICON_TOKEN_RE, ""))
      .filter(ch => !isLyricSpace(ch)).join("");
    if (!needle || !/^[\x21-\x7e]+$/.test(needle)) return;
    const at = compactText.indexOf(needle, cursor);
    if (at < 0) return;
    const start = Array.from(compactText.slice(0, at)).length;
    Array.from(needle).forEach((_, i) => { mask[start + i] = true; });
    cursor = at + needle.length;
  });
  return mask;
}

/* 收集可見文字的片段。ruby 整個當成一個片段，避免把 rt 算進去，
   也讓逐字高亮仍能讀到 ruby 的本文。 */
function chantTextPieces(target){
  const pieces = [];
  const visit = (parent)=>{
    [...parent.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE){
        pieces.push({ node, text: node.nodeValue || "" });
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.classList.contains("ico") || node.tagName === "RT" || node.tagName === "RP") return;
      if (node.tagName === "RUBY"){
        const base = [...node.childNodes]
          .filter(child => child.nodeType === Node.TEXT_NODE)
          .map(child => child.nodeValue || "")
          .join("");
        pieces.push({ node, text: base, atomic: true });
        return;
      }
      visit(node);
    });
  };
  visit(target);
  return pieces;
}

function wrapChantNode(node){
  const span = document.createElement("span");
  span.className = "seg-chant";
  node.replaceWith(span);
  span.appendChild(node);
}

function splitTextNodeByMask(node, mask, index){
  const fragment = document.createDocumentFragment();
  let run = "", runChant = false;
  const flush = ()=>{
    if (!run) return;
    const textNode = document.createTextNode(run);
    if (runChant){
      const span = document.createElement("span");
      span.className = "seg-chant";
      span.appendChild(textNode);
      fragment.appendChild(span);
    } else {
      fragment.appendChild(textNode);
    }
    run = "";
  };
  Array.from(node.nodeValue || "").forEach(ch => {
    if (!isLyricSpace(ch)){
      const chant = mask[index++];
      if (chant !== runChant){ flush(); runChant = chant; }
    }
    run += ch;
  });
  flush();
  node.replaceWith(fragment);
  return index;
}

function applyChantMask(target, mask){
  // 切換讀音只重畫日文列，繁中列已經標過就不要再包一次。
  if (target.querySelector(".seg-chant")) return;
  const pieces = chantTextPieces(target);
  const compactLength = pieces.reduce((sum, piece) =>
    sum + Array.from(piece.text).filter(ch => !isLyricSpace(ch)).length, 0);
  // 查表結果與分段原文對不上時不標色，避免標錯位置。
  if (compactLength !== mask.length || !mask.includes(true)) return;
  let index = 0;
  pieces.forEach(piece => {
    if (piece.atomic){
      const count = Array.from(piece.text).filter(ch => !isLyricSpace(ch)).length;
      if (mask.slice(index, index + count).some(Boolean)) wrapChantNode(piece.node);
      index += count;
      return;
    }
    index = splitTextNodeByMask(piece.node, mask, index);
  });
}

function markRomajiChant(target, segments){
  const compact = chantTextPieces(target)
    .map(piece => Array.from(piece.text).filter(ch => !isLyricSpace(ch)).join(""))
    .join("");
  applyChantMask(target, romajiChantMask(compact, segments));
}

/* 在一行歌詞的日文、羅馬拼音、繁中列標出合唱段。
   必須在逐字高亮（decorateKaraokeLine）之前呼叫。 */
function markLyricChantSegments(lineEl, lyric){
  if (!lineEl || !lineHasChantSegments(lyric)) return;
  const jpSegments = lyric.jpSegments;
  if (hasChantSegment(jpSegments)){
    const jpEl = lineEl.querySelector(".lyric-jp");
    if (jpEl){
      if (readingMode === "romaji") markRomajiChant(jpEl, jpSegments);
      else applyChantMask(jpEl, segmentChantMask(jpSegments));
    }
    const romajiEl = lineEl.querySelector(".lyric-romaji");
    if (romajiEl) markRomajiChant(romajiEl, jpSegments);
  }
  const zhEl = lineEl.querySelector(".lyric-zh");
  if (zhEl && hasChantSegment(lyric.trSegments)){
    applyChantMask(zhEl, segmentChantMask(lyric.trSegments));
  }
}

/*
 * Karaoke 逐字高亮
 *
 * 每句歌詞原本就有人工填入的影片起始秒數。這裡把「本句起點」到
 * 「下一句起點」視為本句的人工校正時間窗，再依照日文詞／假名／
 * 羅馬拼音的可見單位分配進度。這樣不靠 BPM 猜整句速度，也不會讓
 * 每個圖示各自從第 0 拍開始；播放中的每 100ms 只更新目前這一句。
 */
function getPlayerTime(){
  try {
    if (player && typeof player.getCurrentTime === "function"){
      const t = Number(player.getCurrentTime());
      return Number.isFinite(t) ? t : null;
    }
  } catch(e){}
  return null;
}

function getPlayerDuration(){
  try {
    if (player && typeof player.getDuration === "function"){
      const duration = Number(player.getDuration());
      return Number.isFinite(duration) && duration > 0 ? duration : null;
    }
  } catch(e){}
  return null;
}

function playerIsPlaying(){
  try {
    const state = player && typeof player.getPlayerState === "function"
      ? player.getPlayerState()
      : -1;
    return state === 1 || state === 3; // PLAYING / BUFFERING
  } catch(e){
    return false;
  }
}

function updateDocumentPipButton(){
  const button = document.getElementById("pip-btn");
  if (!button || !documentPip.supported) return;
  const open = documentPip.isOpen();
  button.classList.toggle("active", open);
  button.setAttribute("aria-pressed", open ? "true" : "false");
  button.setAttribute("aria-label", open ? "聚焦同步字幕小窗" : "開啟或聚焦同步字幕小窗");
  button.setAttribute("title", open ? "聚焦同步字幕小窗" : "開啟或聚焦同步字幕小窗");
}

function togglePlayback(){
  if (!player || !playerReady) return;
  // 떼창을 마지막까지 들은 뒤라면 처음 구간부터 다시
  if (chantOnly && chantDone){ jumpToChant(0); return; }
  const state = (()=>{
    try { return player.getPlayerState(); } catch(e){ return -1; }
  })();
  try {
    if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) player.pauseVideo();
    else player.playVideo();
  } catch(e){}
  updateDocumentPip();
}

function documentPipLineMarkup(line, active){
  if (!line) return "";
  const clone = line.cloneNode(true);
  clone.classList.toggle("active", !!active);
  clone.classList.add("in-view");
  const output = document.createElement("div");
  output.className = clone.className;
  output.innerHTML = clone.innerHTML;
  return output.outerHTML;
}

function nextDocumentPipLineIndex(song, index){
  const lines = song && Array.isArray(song.lyrics) ? song.lyrics : [];
  const start = Number.isInteger(index) ? index + 1 : 0;
  for (let i = start; i < lines.length; i++){
    if (hasDisplayedLyricText(lines[i])) return i;
  }
  return -1;
}

function buildDocumentPipViewModel(activeIdx = lastActiveIdx){
  const page = document.getElementById("song-page");
  const list = document.getElementById("lyrics-list");
  const lines = list ? [...list.querySelectorAll(".lyric-line")] : [];
  const currentIndex = Number.isInteger(activeIdx) ? activeIdx : -1;
  const currentLine = currentIndex >= 0 ? lines[currentIndex] : null;
  const nextIndex = nextDocumentPipLineIndex(currentSong, currentIndex);
  const nextLine = nextIndex >= 0 ? lines[nextIndex] : null;
  const beatDuration = page
    ? getComputedStyle(page).getPropertyValue("--icon-beat-duration").trim()
    : "";

  return {
    title: currentSong ? currentSong.title : "同步字幕",
    currentMarkup: documentPipLineMarkup(currentLine, true),
    nextMarkup: documentPipLineMarkup(nextLine, false),
    isPlaying: playerIsPlaying(),
    canPlayPause: Boolean(player && playerReady
      && typeof player.playVideo === "function"
      && typeof player.pauseVideo === "function"),
    theme: currentTheme,
    showJapanese,
    showChinese,
    readingMode,
    karaokeEnabled,
    iconBeatDuration: beatDuration,
    status: playerReady ? "" : "正在等待影片播放器…"
  };
}

function updateDocumentPip(activeIdx = lastActiveIdx){
  if (!documentPip.isOpen()) return;
  documentPip.update(buildDocumentPipViewModel(activeIdx));
}

function setKaraokeSourceStatus(state, text){
  const el = document.getElementById("karaoke-source-status");
  const textEl = document.getElementById("karaoke-source-status-text");
  if (!el || !textEl) return;
  el.dataset.state = state || "";
  const popover = el.closest(".karaoke-source-popover");
  if (popover) popover.dataset.state = state || "";
  textEl.textContent = text || "";
}

function karaokeLineTiming(song, index){
  if (!song || !karaokeTiming || karaokeTiming.songId !== song.id) return null;
  return karaokeTiming.lines && karaokeTiming.lines[index] || null;
}

function playbackTimeForLine(song, index){
  const timed = karaokeLineTiming(song, index);
  const local = song && song.lyrics && song.lyrics[index];
  return timed && Number.isFinite(Number(timed.start)) ? Number(timed.start) : Number(local && local.time) || 0;
}

function applyKaraokeTimingToDom(song){
  const list = document.getElementById("lyrics-list");
  if (!list || !song || !Array.isArray(song.lyrics)) return;
  list.querySelectorAll(".lyric-line").forEach(line => {
    const index = Number(line.dataset.idx);
    const timed = karaokeLineTiming(song, index);
    const range = karaokeRange(song, index);
    line.dataset.time = String(playbackTimeForLine(song, index));
    if (range){
      line.dataset.karaokeStart = String(range.start);
      line.dataset.karaokeEnd = String(range.end);
    }
    assignKaraokeLineTiming(line, timed);
  });
  chantBlockCache.clear();
  syncChantUi();
  paintChantBar();
}

/* 有些歌曲會在兩句歌詞中間放一筆只有拍手／揮手提示的資料。
   這些資料沒有實際會顯示的日文、翻譯或背景合唱文字，不能把前一句
   的 Karaoke 時間窗截短，也不能搶走目前正在演唱的那一行。 */
function lyricPartText(value){
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";
  return value.map(part => typeof part === "string" ? part : (part && part.text) || "").join("");
}

function hasDisplayedLyricText(line){
  if (!line) return false;
  return [line.jp, line.tr].some(value =>
    lyricPartText(value).replace(ICON_TOKEN_RE, "").replace(/\s/gu, "").length > 0
  );
}

function nextDisplayedLyricTime(song, index){
  const lines = song && Array.isArray(song.lyrics) ? song.lyrics : [];
  const current = Number(lines[index] && lines[index].time);
  for (let i = index + 1; i < lines.length; i++){
    if (!hasDisplayedLyricText(lines[i])) continue;
    const time = Number(lines[i] && lines[i].time);
    if (Number.isFinite(time) && (!Number.isFinite(current) || time > current)) return time;
  }
  return null;
}

async function loadKaraokeTiming(song){
  const seq = ++karaokeLoadSeq;
  karaokeTiming = null;
  setKaraokeSourceStatus("loading", "歌詞逐字時間：正在尋找開源時間碼…");

  const api = await loadKaraokeSources();
  if (!api || typeof api.load !== "function" || typeof api.alignToLocalLyrics !== "function"){
    setKaraokeSourceStatus("miss", "歌詞逐字時間：目前使用本地估算同步");
    return;
  }

  let duration = getPlayerDuration();
  let timed = null;
  try {
    timed = await api.load(song, {
      duration,
      onStatus: event => {
        if (seq !== karaokeLoadSeq || !event) return;
        if (event.state === "cache") setKaraokeSourceStatus("loading", "歌詞逐字時間：已讀取本機快取，正在校正影片偏移…");
        else if (event.state === "fallback") setKaraokeSourceStatus("fallback", `歌詞逐字時間：前順位來源沒有結果，改查${event.source || "下一順位來源"}…`);
        else if (event.state === "offline") setKaraokeSourceStatus("miss", "歌詞逐字時間：離線且沒有快取，使用本地估算同步");
      }
    });
  } catch (error) {
    timed = null;
  }
  if (seq !== karaokeLoadSeq || !song || currentSong !== song) return;

  if (!timed){
    setKaraokeSourceStatus("miss", "歌詞逐字時間：找不到可用來源，使用本地估算同步");
    return;
  }
  const aligned = api.alignToLocalLyrics(timed, song.lyrics);
  if (!aligned){
    setKaraokeSourceStatus("miss", "歌詞逐字時間：來源歌詞與本頁不相符，使用本地估算同步");
    return;
  }
  aligned.songId = song.id;
  karaokeTiming = aligned;
  applyKaraokeTimingToDom(song);
  const cachedHint = timed.source && timed.source.indexOf("開源多來源") >= 0 ? "開源多來源" : (timed.source || "開源來源");
  const timingLabel = timed.granularity === "line" ? "歌詞逐行時間" : "歌詞逐字時間";
  setKaraokeSourceStatus("ready", `${timingLabel}：${cachedHint}（已對齊 ${aligned.matchedLines}/${aligned.totalLines}行，偏移${aligned.offset.toFixed(2)}秒）`);
  updateLyricsSync(true);
}

function karaokeRange(song, index){
  const lines = song && Array.isArray(song.lyrics) ? song.lyrics : [];
  const line = lines[index];
  const start = Number(line && line.time);
  if (!Number.isFinite(start)) return null;

  const timed = karaokeLineTiming(song, index);
  if (timed){
    return {
      start: Number(timed.start),
      end: Math.max(Number(timed.start) + 0.04, Number(timed.end))
    };
  }

  // 歌詞錨點之間常常包含前奏／間奏，不能把整段空白也平均塗成歌詞。
  // 以歌曲 BPM 與本句字數估出「唱完本句」的上限；若下一句更早，
  // 仍以現有人工錨點為準。這只決定句內高亮的收尾，不會改動原始 time。
  const source = String(line.jp || "").replace(ICON_TOKEN_RE, "");
  const weight = karaokeUnitWeight(source) || 1;
  const bpm = Number(SONG_BPM[song.id]) || 120;
  const estimatedDuration = Math.max(0.8, Math.min(12, weight * (60 / bpm) * KARAOKE_UNIT_BEATS));

  const next = nextDisplayedLyricTime(song, index);
  // 最後一句沒有下一個錨點，留一個依句長估出的收尾時間。
  const end = next === null
    ? start + estimatedDuration
    : Math.min(start + estimatedDuration,
        Math.max(start + 0.25, next - KARAOKE_TAIL_SEC));
  return { start, end };
}

function karaokeUnitWeight(text){
  const value = String(text || "");
  const visible = Array.from(value).filter(ch => !/\s/u.test(ch));
  if (!visible.length) return 0;
  if (visible.every(ch => ROMAJI_WORD_CHAR_RE.test(ch))) return Math.max(1, visible.length * 0.75);
  if (visible.every(ch => /[、。！？!?.,，。]/u.test(ch))) return 0.45;
  return Math.max(1, visible.length);
}

function appendKaraokeUnit(fragment, units, text, weight){
  const span = document.createElement("span");
  span.className = "karaoke-unit";
  span.textContent = text;
  span.dataset.karaokeText = text;
  span.dataset.karaokeWeight = String(weight);
  fragment.appendChild(span);
  units.push({ el: span, weight });
}

function decorateKaraokeTextNode(node, units){
  const text = node.nodeValue || "";
  if (!text.trim()) return;
  const fragment = document.createDocumentFragment();
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; ){
    const ch = chars[i];
    if (/\s/u.test(ch)){
      fragment.appendChild(document.createTextNode(ch));
      i++;
      continue;
    }
    // 羅馬拼音／英文以單字為一個單位，避免加上 span 後英文被拆得太碎。
    if (ROMAJI_WORD_CHAR_RE.test(ch)){
      let j = i + 1;
      while (j < chars.length && ROMAJI_WORD_CONTINUATION_RE.test(chars[j])) j++;
      const word = chars.slice(i, j).join("");
      appendKaraokeUnit(fragment, units, word, karaokeUnitWeight(word));
      i = j;
      continue;
    }
    appendKaraokeUnit(fragment, units, ch, karaokeUnitWeight(ch));
    i++;
  }
  if (fragment.childNodes.length) node.replaceWith(fragment);
}

function decorateKaraokeLine(target){
  if (!target) return;
  const units = [];
  const visit = (parent)=>{
    [...parent.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE){
        decorateKaraokeTextNode(node, units);
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.classList.contains("ico")) return;
      // ruby 整體作為一個可讀詞單位，避免把 rt 假名也當成第二次歌詞進度。
      if (node.tagName === "RUBY"){
        const base = [...node.childNodes]
          .filter(child => child.nodeType === Node.TEXT_NODE)
          .map(child => child.nodeValue || "")
          .join("");
        const wrapper = document.createElement("span");
        wrapper.className = "karaoke-unit";
        wrapper.dataset.karaokeText = base;
        wrapper.dataset.karaokeWeight = String(karaokeUnitWeight(base));
        node.parentNode.insertBefore(wrapper, node);
        wrapper.appendChild(node);
        units.push({ el: wrapper, weight: karaokeUnitWeight(base) });
        return;
      }
      if (node.tagName === "RT" || node.tagName === "RP") return;
      visit(node);
    });
  };
  visit(target);
  target._karaokeUnits = units;
}

function karaokeUnitSourceText(unit){
  return unit && unit.el
    ? unit.el.dataset.karaokeText || unit.el.textContent || ""
    : "";
}

function karaokeUnitReadingText(unit){
  if (!unit || !unit.el) return "";
  const ruby = unit.el.querySelector("ruby");
  if (ruby){
    const reading = ruby.querySelector("rt");
    return reading ? reading.textContent || "" : ruby.textContent || "";
  }
  return unit.el.textContent || "";
}

/* In romaji-only mode the visible `.lyric-jp` target is no longer Japanese,
   but Japanese remains the source of truth for every word clock.  Build one
   detached kana target solely to recover its source units and readings. */
function kanaReferenceForLine(line){
  if (!line) return null;
  if (readingMode !== "romaji") return line.querySelector(".lyric-jp");

  const index = Number(line.dataset.idx);
  const lyric = currentSong && currentSong.lyrics && currentSong.lyrics[index];
  if (!lyric) return null;
  const target = document.createElement("span");
  target.className = "lyric-jp karaoke-reference";
  target.lang = "ja";
  target.innerHTML = renderChantAwareLine(
    lyric.jp || "",
    lyric,
    currentSong,
    text => renderKanaLine(text),
    "jp"
  );
  decorateKaraokeLine(target);
  return target;
}

function assignKaraokeLineTiming(line, timedLine){
  if (!line) return;
  const displayTargets = [...line.querySelectorAll(".lyric-jp, .lyric-romaji")]
    .filter(target => (target.textContent || "").trim());
  const referenceTarget = kanaReferenceForLine(line);
  const targets = [...new Set([
    referenceTarget,
    ...displayTargets,
  ].filter(Boolean))];
  const referenceUnits = referenceTarget && referenceTarget._karaokeUnits
    ? referenceTarget._karaokeUnits
    : [];
  const referenceSourceTexts = referenceUnits.map(karaokeUnitSourceText);
  const referenceTexts = referenceUnits.map(karaokeUnitReadingText);
  const sourceApi = window.KARAOKE_SOURCES || {};
  const timedStart = timedLine ? Number(timedLine.start) : NaN;
  const timedEnd = timedLine ? Number(timedLine.end) : NaN;
  const lineStart = Number.isFinite(timedStart)
    ? timedStart
    : Number(line.dataset.karaokeStart);
  const lineEndValue = Number.isFinite(timedEnd)
    ? timedEnd
    : Number(line.dataset.karaokeEnd);
  const start = Number.isFinite(lineStart) ? lineStart : 0;
  const end = Number.isFinite(lineEndValue) && lineEndValue > start
    ? lineEndValue
    : start + 0.04;
  const allocate = typeof sourceApi.allocateUnitTimings === "function"
    ? sourceApi.allocateUnitTimings(referenceSourceTexts, start, end)
    : [];
  let referenceTimings = allocate;
  let hasWordTiming = false;

  if (timedLine && timedLine.granularity !== "line"
    && Array.isArray(timedLine.words) && timedLine.words.length
    && typeof sourceApi.mapUnitsToWords === "function"){
    const mappedReference = sourceApi.mapUnitsToWords(referenceSourceTexts, timedLine.words);
    const enoughTextMatches = mappedReference.total > 0
      && mappedReference.matched / mappedReference.total >= 0.6;
    if (enoughTextMatches){
      referenceTimings = mappedReference.timings.map((timing, index) =>
        timing || allocate[index] || null
      );
      hasWordTiming = true;
    }
  }

  let sourceKind = hasWordTiming ? "word" : "line-proportional";
  targets.forEach(target => {
    const units = target._karaokeUnits || [];
    units.forEach(unit => {
      unit.start = null;
      unit.end = null;
      delete unit.el.dataset.karaokeStart;
      delete unit.el.dataset.karaokeEnd;
    });
    const isReference = target === referenceTarget;
    const texts = units.map(karaokeUnitSourceText);
    let timings = isReference ? referenceTimings : [];
    if (!isReference && typeof sourceApi.mapUnitsToReferenceTimings === "function"){
      const mapped = sourceApi.mapUnitsToReferenceTimings(texts, referenceTexts, referenceTimings);
      timings = mapped.timings;
      if (!mapped.complete && hasWordTiming) sourceKind = "word-reference-fallback";
    } else if (!isReference && typeof sourceApi.allocateUnitTimings === "function"){
      /* This is only a compatibility fallback for an older cached script;
         the normal path always maps romaji onto the Japanese timing array. */
      timings = sourceApi.allocateUnitTimings(texts, start, end);
    }

    units.forEach((unit, index) => {
      const timing = timings[index];
      if (!timing || !Number.isFinite(Number(timing.start)) || !Number.isFinite(Number(timing.end))) return;
      unit.start = Number(timing.start);
      unit.end = Math.max(unit.start + 0.02, Number(timing.end));
      /* Keep the timing on the element too.  Reading-mode changes replace
         the inner HTML, and a DOM-backed value makes the romaji fallback
         survive browser rendering/isolation differences just like kana. */
      unit.el.dataset.karaokeStart = String(unit.start);
      unit.el.dataset.karaokeEnd = String(unit.end);
    });
  });
  line.dataset.karaokeSource = sourceKind;
}

function decorateKaraokeLines(song){
  karaokeActiveLine = null;
  const list = document.getElementById("lyrics-list");
  if (!list || !song) return;
  list.querySelectorAll(".lyric-line").forEach(line => {
    const index = Number(line.dataset.idx);
    const range = karaokeRange(song, index);
    if (range){
      line.dataset.karaokeStart = String(range.start);
      line.dataset.karaokeEnd = String(range.end);
    }
    line.querySelectorAll(".lyric-jp, .lyric-romaji").forEach(decorateKaraokeLine);
    assignKaraokeLineTiming(line, karaokeLineTiming(song, index));
  });
}

function clearKaraokeLine(line){
  if (!line) return;
  line.querySelectorAll(".lyric-jp, .lyric-romaji").forEach(target => {
    const units = target._karaokeUnits || [];
    units.forEach(unit => unit.el.classList.remove("karaoke-lit", "karaoke-current"));
    units.forEach(unit => unit.el.style.removeProperty("--karaoke-word-progress"));
  });
}

function updateKaraokeProgress(line, time){
  if (!karaokeEnabled){
    clearKaraokeLine(karaokeActiveLine);
    karaokeActiveLine = null;
    return;
  }
  if (karaokeActiveLine && karaokeActiveLine !== line) clearKaraokeLine(karaokeActiveLine);
  karaokeActiveLine = line || null;
  if (!line || !Number.isFinite(time)) return;

  const start = Number(line.dataset.karaokeStart);
  const end = Number(line.dataset.karaokeEnd);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return;

  line.querySelectorAll(".lyric-jp, .lyric-romaji").forEach(target => {
    const units = target._karaokeUnits || [];
    if (!units.length) return;

    const hasRealWordTiming = units.some(unit =>
      (Number.isFinite(unit.start) && Number.isFinite(unit.end))
      || (Number.isFinite(Number(unit.el.dataset.karaokeStart))
        && Number.isFinite(Number(unit.el.dataset.karaokeEnd)))
    );
    if (hasRealWordTiming){
      units.forEach(unit => {
        const unitStart = Number.isFinite(unit.start)
          ? Number(unit.start) : Number(unit.el.dataset.karaokeStart);
        const unitEnd = Number.isFinite(unit.end)
          ? Number(unit.end) : Number(unit.el.dataset.karaokeEnd);
        if (!Number.isFinite(unitStart) || !Number.isFinite(unitEnd)){
          unit.el.classList.remove("karaoke-lit", "karaoke-current");
          unit.el.style.removeProperty("--karaoke-word-progress");
          return;
        }
        const progress = Math.max(0, Math.min(1, (time - unitStart) / Math.max(0.02, unitEnd - unitStart)));
        unit.el.classList.toggle("karaoke-lit", progress >= 1);
        unit.el.classList.toggle("karaoke-current", progress > 0 && progress < 1);
        unit.el.style.setProperty("--karaoke-word-progress", progress.toFixed(3));
      });
      return;
    }

    const progress = Math.max(0, Math.min(1, (time - start) / Math.max(0.01, end - start)));
    const total = units.reduce((sum, unit) => sum + unit.weight, 0) || units.length;
    const reached = progress * total;
    let passed = 0;
    units.forEach(unit => {
      const was = passed;
      passed += unit.weight;
      const lit = reached >= passed;
      const current = !lit && reached > was;
      unit.el.classList.toggle("karaoke-lit", lit);
      unit.el.classList.toggle("karaoke-current", current);
    });
  });
}

const ICON_TOKEN_PATTERNS = {
  wave: /[\[(]wave[\])]/i,
  clap: /[\[(]clap[\])]/i,
  jump: /[\[(]jump[\])]/i,
  spin: /[\[(]spin[\])]/i,
  turn: /[\[(]turn[\])]/i,
  mic: /[\[(]mic[\])]/i,
  chant: /[\[(]chant[\])]/i
};

function hasIconToken(str, name){
  if (typeof str !== "string") return false;
  return ICON_TOKEN_PATTERNS[name]?.test(str) || false;
}

// 한 줄의 jp 조각들을 훑어서 박수·동작 아이콘과 현재 선택한
// 응원 버전의 대합창 아이콘을 만들어 줍니다.
function lyricIconsHtml(line, song = currentSong){
  const hasChant = lineIsChant(line, song);
  let hasClap = false, wave = false;
  const scan = (arr) => {
    if (typeof arr === "string"){
      if (hasIconToken(arr, "wave")) wave = true;
      if (hasIconToken(arr, "clap")) hasClap = true;
      return;
    }
    if (!Array.isArray(arr)) return;
    arr.forEach(seg => {
      if (seg.tag === "clap") hasClap = true;
      if (hasIconToken(seg.text, "wave")) wave = true;
      if (hasIconToken(seg.text, "clap")) hasClap = true;
    });
  };
  scan(line.jpSegments || line.jp);
  scan(line.trSegments || line.tr);
  let html = "";
  // 박수·손 흔들기는 가사 안에 넣는 [clap] / [wave] 아이콘으로만 표시하고
  // 왼쪽 종류 표시에는 떼창만 남긴다.
  if (hasChant) html += `<span class="lyric-type-icon chant" title="大合唱">${INLINE_ICONS.mic}</span>`;
  return html;
}

function lineIsChantKr(line){
  if (!line) return false;
  const hit = (part)=>{
    if (typeof part === "string")
      return hasIconToken(part, "mic") || hasIconToken(part, "chant");
    if (!Array.isArray(part)) return false;
    return part.some(seg => seg && (seg.tag === "chant"
      || hasIconToken(seg.text, "mic") || hasIconToken(seg.text, "chant")));
  };
  return hit(line.jpSegments || line.jp) || hit(line.trSegments || line.tr);
}

function lineIsChantJp(line, song){
  if (!line || !song) return false;
  const guide = JP_CHANT_GUIDES[song.id];
  // Canva 沒有整理到的歌曲，先沿用原有標記，但在畫面上明確說明。
  if (!guide) return lineIsChantKr(line);
  const time = Number(line.time);
  if (!Number.isFinite(time)) return false;
  const matcher = jpChantTimeMatcher(song);
  return hasChantTime(matcher.any, time);
}

function lineIsFullChantJp(line, song){
  const guide = song && JP_CHANT_GUIDES[song.id];
  const time = Number(line && line.time);
  return Boolean(guide && Number.isFinite(time)
    && hasChantTime(jpChantTimeMatcher(song).full, time));
}

const jpChantTimeCache = new Map();

function jpChantTimeMatcher(song){
  const cacheKey = `${chantVersion}:${song.id}`;
  if (jpChantTimeCache.has(cacheKey)) return jpChantTimeCache.get(cacheKey);
  const guide = JP_CHANT_GUIDES[song.id] || {};
  const toBuckets = values => new Set((values || [])
    .map(value => Number(value))
    .filter(Number.isFinite)
    .map(value => Math.round(value * 100)));
  const full = toBuckets(guide.chantTimes);
  const any = new Set(full);
  (guide.chantSegments || []).forEach(segment => {
    const bucket = Number(segment && segment.time);
    if (Number.isFinite(bucket)) any.add(Math.round(bucket * 100));
  });
  const matcher = { full, any };
  jpChantTimeCache.set(cacheKey, matcher);
  return matcher;
}

function hasChantTime(buckets, time){
  const bucket = Math.round(Number(time) * 100);
  return buckets.has(bucket - 1) || buckets.has(bucket) || buckets.has(bucket + 1);
}

function chantLineClass(line, song = currentSong){
  if (!lineIsChant(line, song)) return "";
  if (typeof lineUsesChantSegments === "function" && lineUsesChantSegments(line)) {
    return "is-chant chant-partial";
  }
  const partial = chantVersion === "jp" && jpChantSegmentsForLine(line, song).length > 0;
  return partial && !lineIsFullChantJp(line, song) ? "has-chant-segment" : "is-chant";
}

/* ── 떼창 구간 ───────────────────────────────────────────────
   "떼창만 듣기" 가 쓰는 계산. 한 줄이 떼창인지 판단하는 기준은
   곡 목록 배지(songMarks)와 똑같다 — 기준이 갈리면 배지에는 떼창이
   있다고 뜨는데 재생은 건너뛰는 일이 생기므로 여기 한 곳에 모아 둔다.
     · 日本版：使用 JP_CHANT_GUIDES 的歌詞時間點
     · 韓國版：沿用 jp/tr 的 [mic]、[chant]、tag:"chant" */
function lineIsChant(line, song = currentSong){
  return chantVersion === "jp"
    ? lineIsChantJp(line, song)
    : lineIsChantKr(line);
}

const CHANT_LEAD_SEC  = 1.2;   // 떼창 직전 한 박자 먼저 들어가 준비할 시간
const CHANT_TAIL_SEC  = 0.6;   // 마지막 글자가 잘리지 않도록 뒤에 남기는 여유
const CHANT_GAP_MERGE = 2.5;   // 실제로 붙어 있는 짧은 공백만 이어서 듣는다
const chantBlockCache = new Map();

/* 곡을 훑어 떼창 구간 목록을 만든다. [{from,to,start,end}, …]
   from/to 는 가사 줄 번호, start/end 는 영상에서의 초. */
function chantBlocks(song){
  if (!song) return [];
  const cacheKey = `${chantVersion}:${song.id}`;
  if (chantBlockCache.has(cacheKey)) return chantBlockCache.get(cacheKey);

  const lines = song.lyrics || [];
  const lineEnd = (i)=> lines[i + 1] ? playbackTimeForLine(song, i + 1)
                                     : playbackTimeForLine(song, i) + 8;
  const raw = [];
  for (let i = 0; i < lines.length; i++){
    if (!lineIsChant(lines[i], song)) continue;
    let e = i;
    while (e + 1 < lines.length && lineIsChant(lines[e + 1], song)) e++;
    raw.push({
      from: i, to: e,
      start: Math.max(0, playbackTimeForLine(song, i) - CHANT_LEAD_SEC),
      end:   lineEnd(e) + CHANT_TAIL_SEC
    });
    i = e;
  }
  // 몇 초 듣자고 끊으면 오히려 어수선하므로 가까운 구간끼리 묶는다
  const out = [];
  raw.forEach(b => {
    const last = out[out.length - 1];
    if (last && b.start - last.end < CHANT_GAP_MERGE){ last.end = b.end; last.to = b.to; }
    else out.push({ from:b.from, to:b.to, start:b.start, end:b.end });
  });
  chantBlockCache.set(cacheKey, out);
  return out;
}

/* ── 곡 목록 응원 배지 ───────────────────────────────────────
   곡의 가사 데이터를 한 번 훑어서 떼창이 몇 줄인지, 박수·손 흔들기·
   점프·팔 돌리기가 들어 있는지 세어 둔다. 가사를 고치면 배지도 저절로
   따라 바뀌므로 따로 관리할 표가 없다. */
const songMarksCache = new Map();

function songMarks(song){
  const cacheKey = `${chantVersion}:${song.id}`;
  if (songMarksCache.has(cacheKey)) return songMarksCache.get(cacheKey);

  const guideMarks = SONG_MARKS[song.id];
  if (!song.lyrics && guideMarks){
    const mark = {
      chant: guideMarks.chant?.[chantVersion] || 0,
      clap: Boolean(guideMarks.clap),
      wave: Boolean(guideMarks.wave),
      jump: Boolean(guideMarks.jump),
      spin: Boolean(guideMarks.spin)
    };
    songMarksCache.set(cacheKey, mark);
    return mark;
  }

  const mark = { chant: 0, clap: false, wave: false, jump: false, spin: false };

  (song.lyrics || []).forEach(line => {
    const scanText = (t) => {
      if (typeof t !== "string") return;
      if (hasIconToken(t, "wave")) mark.wave = true;
      if (hasIconToken(t, "clap")) mark.clap = true;
      if (hasIconToken(t, "jump")) mark.jump = true;
      if (hasIconToken(t, "spin") || hasIconToken(t, "turn")) mark.spin = true;
    };
    const scanPart = (part) => {
      if (typeof part === "string"){ scanText(part); return; }
      if (!Array.isArray(part)) return;
      part.forEach(seg => {
        if (seg.tag === "clap")  mark.clap = true;
        scanText(seg.text);
      });
    };

    scanPart(line.jpSegments || line.jp);
    scanPart(line.trSegments || line.tr);
    // 판단 기준은 lineIsChant 한 곳에서만 (떼창만 듣기와 어긋나지 않도록)
    if (lineIsChant(line, song)) mark.chant++;
  });

  songMarksCache.set(cacheKey, mark);
  return mark;
}

/* ── 곡 목록 정렬 ─────────────────────────────────────────────
   "default" 등록순 · "title" 가나다순 · "chant-desc/asc" 떼창 줄 수
   여기서 정한 순서를 곡 화면의 이전/다음 곡, 곡 목록 시트도 함께 따른다. */
let songSort = (()=>{
  const v = store("horo-song-sort");
  return ["default","title","title-desc","chant-desc","chant-asc"].includes(v) ? v : "default";
})();

/* 곡의 원래 번호(1부터). 정렬을 바꿔도 이 번호는 그대로라 번호 검색이 계속 통한다. */
const songNumberById = new Map(SONGS.map((song, index) => [song.id, index + 1]));
function songNo(song){ return songNumberById.get(song.id) || 0; }

const startsHangul = (t)=> /^[\u3131-\u318E\uAC00-\uD7A3]/.test(String(t).trim());
function byTitle(a, b){
  // 한글 제목을 먼저, 그다음 영문·숫자 제목
  const ha = startsHangul(a.title) ? 0 : 1, hb = startsHangul(b.title) ? 0 : 1;
  if (ha !== hb) return ha - hb;
  return String(a.title).localeCompare(String(b.title), "ko");
}

function sortedSongs(){
  const list = SONGS.slice();
  if (songSort === "title")      return list.sort(byTitle);
  if (songSort === "title-desc") return list.sort((a,b)=> byTitle(b,a));
  if (songSort === "chant-desc") return list.sort((a,b)=> songMarks(b).chant - songMarks(a).chant || byTitle(a,b));
  if (songSort === "chant-asc")  return list.sort((a,b)=> songMarks(a).chant - songMarks(b).chant || byTitle(a,b));
  return list;
}

/* 곡 목록 한 줄의 오른쪽에 붙는 배지들.
   흔한 표시(박수·손 흔들기)에는 common 을 달아 좁은 화면에서 숨긴다. */
function songMarksHtml(song){
  const m = songMarks(song);
  let html = "";
  if (m.chant) html += `<span class="song-mark chant" title="${chantVersionLabel()}大合唱 ${m.chant} 行" aria-label="${chantVersionLabel()}大合唱 ${m.chant} 行">${useSvg("i-mic")}<b>${m.chant}</b><span class="song-mark-unit">行</span></span>`;
  if (m.clap)  html += `<span class="song-mark dot clap common" title="拍手" aria-label="拍手">${useSvg("i-hand")}</span>`;
  if (m.wave)  html += `<span class="song-mark dot wave common" title="揮手" aria-label="揮手">${useSvg("i-wave")}</span>`;
  if (m.jump)  html += `<span class="song-mark dot jump" title="跳躍" aria-label="跳躍">${useSvg("i-jump")}</span>`;
  if (m.spin)  html += `<span class="song-mark dot spin" title="轉臂" aria-label="轉臂">${useSvg("i-cheer")}</span>`;
  return html ? `<span class="song-marks">${html}</span>` : "";
}

/* ── 화면 꺼짐 방지 ───────────────────────────────────────────
   곡 화면에서는 가사를 보는 동안 화면이 자동으로 꺼지지 않게 한다.
   지원하지 않는 브라우저(주로 iOS 구버전)에서는 조용히 넘어간다. */
let wakeLock = null;
async function requestWakeLock(){
  if (!("wakeLock" in navigator) || wakeLock) return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", ()=>{ wakeLock = null; });
  } catch(e){ wakeLock = null; }
}
function releaseWakeLock(){
  if (!wakeLock) return;
  try { wakeLock.release(); } catch(e){}
  wakeLock = null;
}
// 다른 앱에 갔다 돌아오면 화면 잠금 해제가 풀리므로 다시 잡아 준다
document.addEventListener("visibilitychange", ()=>{
  if (document.visibilityState === "visible" && songShellBuilt && isSongViewActive()) requestWakeLock();
});

/* ---------------- YouTube Player API 연동 ----------------
   플레이어는 페이지당 딱 하나. 처음 한 번만 만들고 곡이 바뀌면
   loadVideoById 로 영상만 갈아끼운다. 이렇게 해야 사용자가 곡을 탭한
   순간의 "재생 허가"가 유지되어 모바일에서도 소리가 바로 난다. */
let playerReady   = false;
let videoStatusTimer = null;
let currentVideoId = null;    // 플레이어에 올라가 있는 영상
let pendingVideoId = null;    // 플레이어 준비 전에 눌린 곡
let userVolume     = 100;     // 사용자가 마지막으로 맞춰 둔 볼륨(곡이 바뀌어도 유지)
let userMuted      = false;   // 사용자가 직접 음소거해 뒀는지
let volumeWatchTimer = null;
let playbackRateRestorePending = false;

function formatPlaybackRate(rate){
  const value = Number(rate);
  return "x" + (Number.isInteger(value) ? value : String(value));
}

function samePlaybackRate(a, b){
  return Math.abs(Number(a) - Number(b)) < 0.001;
}

function readAvailablePlaybackRates(){
  if (!player || typeof player.getAvailablePlaybackRates !== "function") return [];
  try {
    const rates = player.getAvailablePlaybackRates();
    if (!Array.isArray(rates)) return [];
    return rates
      .map(Number)
      .filter(rate => Number.isFinite(rate) && rate > 0)
      .sort((a, b) => a - b);
  } catch(e){ return []; }
}

function closestAvailablePlaybackRate(rate){
  if (!availablePlaybackRates.length) return rate;
  const exact = availablePlaybackRates.find(value => samePlaybackRate(value, rate));
  if (exact !== undefined) return exact;

  // YouTube 會把不支援的速度往 1 的方向取整；這裡先同步 UI，避免
  // 使用者看到介面顯示的速度與實際播放速度不同。
  const towardNormal = availablePlaybackRates.filter(value => value <= rate);
  return towardNormal.length ? towardNormal.at(-1) : availablePlaybackRates[0];
}

function updatePlaybackRateUi(){
  const select = document.getElementById("playback-rate");
  if (!select) return;

  const selected = PLAYBACK_RATE_OPTIONS.find(rate => samePlaybackRate(rate, playbackRate));
  if (selected !== undefined) select.value = String(selected);
  select.setAttribute("aria-label", "目前倍速" + formatPlaybackRate(playbackRate));

  [...select.options].forEach(option => {
    option.disabled = availablePlaybackRates.length > 0
      && !availablePlaybackRates.some(rate => samePlaybackRate(rate, option.value));
  });
}

function refreshPlaybackRateOptions(){
  availablePlaybackRates = readAvailablePlaybackRates();
  updatePlaybackRateUi();
}

function applyPlaybackRate(){
  if (!player || !playerReady) return;
  refreshPlaybackRateOptions();
  playbackRate = closestAvailablePlaybackRate(playbackRate);
  store(PLAYBACK_RATE_STORAGE_KEY, String(playbackRate));
  updatePlaybackRateUi();
  applySongTempo(currentSong);
  playbackRateRestorePending = false;
  try { player.setPlaybackRate(playbackRate); } catch(e){}
}

function setPlaybackRate(rate){
  const requested = PLAYBACK_RATE_OPTIONS.find(value => samePlaybackRate(value, rate));
  if (requested === undefined) return;

  playbackRate = closestAvailablePlaybackRate(requested);
  store(PLAYBACK_RATE_STORAGE_KEY, String(playbackRate));
  updatePlaybackRateUi();
  applySongTempo(currentSong);
  if (player && playerReady){
    try { player.setPlaybackRate(playbackRate); } catch(e){}
  }
}

function showVideoStatus(){
  const status = document.getElementById("video-status");
  if (!status) return;
  clearTimeout(videoStatusTimer);
  status.hidden = playerReady;
  if (playerReady) return;
  status.textContent = "正在載入影片…";
  videoStatusTimer = setTimeout(()=>{
    if (!playerReady && status.isConnected) status.textContent = "影片連線延遲，請在下方開啟 YouTube。";
  }, 8000);
}

function ensurePlayer(){
  if (player || !window.YT || !window.YT.Player) return;
  buildSongShell();                       // #yt-player 자리 확보
  if (!document.getElementById("yt-player")) return;
  currentVideoId = (currentSong || SONGS[0]).youtubeId;
  player = new YT.Player('yt-player', {
    videoId: currentVideoId,
    playerVars: {
      'rel': 0,
      'playsinline': 1,                   // iOS 에서 전체화면으로 튀지 않게
      'modestbranding': 1,
      'autoplay': 0                       // 홈 화면에서 멋대로 소리 나지 않도록
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onPlaybackRateChange': onPlayerPlaybackRateChange,
      'onError': onPlayerError
    }
  });
}

function onPlayerReady(){
  playerReady = true;
  clearTimeout(videoStatusTimer);
  const status = document.getElementById("video-status");
  if (status) status.hidden = true;
  try { player.unMute(); player.setVolume(userVolume); } catch(e){}
  applyPlaybackRate();
  startVolumeWatch();
  if (pendingVideoId && isSongViewActive()) { // 歌曲頁仍在前景才執行排隊播放
    const id = pendingVideoId;
    pendingVideoId = null;
    playVideoFor(id);
  } else pendingVideoId = null;
  updateDocumentPip();
}

function onPlayerError(){
  clearTimeout(videoStatusTimer);
  const status = document.getElementById("video-status");
  if (!status) return;
  status.hidden = false;
  status.textContent = "無法播放影片，請在下方開啟 YouTube。";
}

function onPlayerPlaybackRateChange(event){
  const actual = Number(event && event.data);
  if (!Number.isFinite(actual)) return;
  if (playbackRateRestorePending && !samePlaybackRate(actual, playbackRate)) return;
  const matching = PLAYBACK_RATE_OPTIONS.find(rate => samePlaybackRate(rate, actual));
  if (matching === undefined) return;
  playbackRate = matching;
  store(PLAYBACK_RATE_STORAGE_KEY, String(playbackRate));
  updatePlaybackRateUi();
  applySongTempo(currentSong);
}

/* ── 볼륨 기억하기 ────────────────────────────────────────────
   사용자가 플레이어에서 볼륨을 조절하면 그 값을 기억해 두었다가
   다음 곡에도 그대로 적용한다. (유튜브 API 에는 볼륨 변경 이벤트가
   없어서 주기적으로 확인하는 방식) */
function startVolumeWatch(){
  if (volumeWatchTimer) return;
  volumeWatchTimer = setInterval(()=>{
    if (!player || !playerReady) return;
    try {
      const v = player.getVolume();
      const m = player.isMuted();
      if (typeof v === "number" && v > 0) userVolume = v;   // 0 은 음소거로 취급
      userMuted = !!m;
    } catch(e){}
  }, 800);
}

/* 지정한 영상을 즉시 재생. 볼륨은 사용자가 맞춰 둔 값을 그대로 유지한다.
   사용자 탭 핸들러 안에서 부르면 모바일에서도 소리가 그대로 난다. */
function playVideoFor(videoId){
  if (!player || !playerReady) { pendingVideoId = videoId; return; }
  try {
    if (userMuted) player.mute();         // 사용자가 꺼 뒀으면 계속 꺼 둠
    else           player.unMute();
    player.setVolume(userVolume);         // 100 으로 되돌리지 않음
    if (currentVideoId === videoId) {
      player.seekTo(0, true);
      player.playVideo();
    } else {
      currentVideoId = videoId;
      availablePlaybackRates = [];
      playbackRateRestorePending = true;
      updatePlaybackRateUi();
      player.loadVideoById(videoId);      // loadVideoById 는 바로 재생까지 함
    }
  } catch(e){}
}

/* 이미 그 곡이 재생 중이면 건드리지 않고, 아니면 재생시킨다.
   (곡을 탭 → 이미 playVideoFor 가 돌았으므로 여기서 다시 끊기지 않게) */
function ensurePlaying(videoId){
  if (!player || !playerReady) { pendingVideoId = videoId; return; }
  if (currentVideoId === videoId) {
    let st = -1;
    try { st = player.getPlayerState(); } catch(e){}
    if (st === YT.PlayerState.PLAYING || st === YT.PlayerState.BUFFERING) return;
  }
  playVideoFor(videoId);
}

/* 재생 버튼 모양을 현재 상태에 맞춘다 */
function updatePlayButton(){
  const btn = document.getElementById("play-toggle");
  if (!btn) return;
  let st = -1;
  try { st = player && player.getPlayerState(); } catch(e){}
  const playing = (st === 1 || st === 3);   // PLAYING / BUFFERING
  btn.innerHTML = playing ? PAUSE_SVG : PLAY_SVG;
  btn.classList.toggle("playing", playing);
  btn.setAttribute("aria-label", playing ? "暫停" : "播放");
}

function onPlayerStateChange(event) {
  updatePlayButton();
  updateDocumentPip();
  if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.CUED) {
    // loadVideoById 會把 YouTube 速度重設為 x1，換歌後在影片可播放時恢復選擇。
    applyPlaybackRate();
  }
  // 영상이 끝나면 다음 곡으로 (마지막 곡이면 첫 곡으로 되돌아감)
  if (event.data === YT.PlayerState.ENDED) {
    stopSyncTimer();
    goToNextSong();
    return;
  }

  // 재생 중(PLAYING = 1)일 때만 동기화 타이머 가동
  if (event.data === YT.PlayerState.PLAYING) {
    startSyncTimer();
  } else {
    stopSyncTimer();
    // 일시정지/탐색 시에도 위치에 맞춰 현재 가사 하이라이트 1회 갱신
    updateLyricsSync();
  }
}

/* 다음 곡으로. 마지막 곡이면 첫 곡으로 순환한다.
   (이미 재생 중인 iframe 을 그대로 쓰므로 소리도 이어서 난다) */
function goToNextSong() {
  if (!currentSong || !isSongViewActive()) return;
  const n = songNeighbors(currentSong);

  // 곡이 하나뿐이면 해시가 그대로라 hashchange 가 안 뜨므로 직접 처음부터 재생
  if (n.next.id === currentSong.id) {
    playVideoFor(n.next.youtubeId);
    return;
  }
  goNeighbor(1);
}


function startSyncTimer() {
  stopSyncTimer();
  syncTimer = setInterval(updateLyricsSync, SYNC_INTERVAL_MS);
}

function stopSyncTimer() {
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = null;
  }
}

/* ★ 재생 중인 줄은 화면 전체에서 "항상 딱 한 줄"이어야 한다.
   어떤 이유로 여러 줄이 켜지더라도 이 함수가 군더더기를 지운다.
   플레이어 상태와 무관하게 돌 수 있도록 따로 떼어 두었다. */
function pruneActiveLines(keep){
  const lit = document.querySelectorAll(".lyric-line.active");
  if (!lit.length) return 0;
  // 남길 줄을 못 정했으면 마지막 하나만 남긴다
  const target = keep || lit[lit.length - 1];
  let removed = 0;
  lit.forEach(el => {
    if (el === target) return;
    el.classList.remove("active");
    // iOS 에서 지운 표시가 화면에 남는 일이 있어 그 줄만 강제로 다시 그린다
    el.style.opacity = "0.999";
    requestAnimationFrame(()=>{ el.style.opacity = ""; });
    removed++;
  });
  return removed;
}

/* 동기화가 멈추거나 튕겨도 화면이 지저분해지지 않도록 지켜보는 타이머 */
let activeGuardTimer = null;
function startActiveGuard(){
  if (activeGuardTimer) return;
  activeGuardTimer = setInterval(()=>{ try { pruneActiveLines(null); } catch(e){} }, 300);
}
function stopActiveGuard(){
  if (activeGuardTimer){ clearInterval(activeGuardTimer); activeGuardTimer = null; }
}

function updateLyricsSync(force) {
  const list = document.getElementById("lyrics-list");
  if (!list) return;
  const lines = list.querySelectorAll(".lyric-line");

  const playerTime = getPlayerTime();
  // 실제 재생 위치보다 조금 앞선 시점을 기준으로 판단해 가사를 먼저 넘김
  const cur = playerTime === null ? null : playerTime + LYRIC_LEAD_SEC;

  // 떼창만 듣기 — 구간을 벗어났으면 다음 떼창으로 옮긴다
  chantOnlyTick(cur);

  let activeIdx = lastActiveIdx;
  if (cur !== null && isFinite(cur)){
    activeIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (cur >= Number(lines[i].dataset.time)) {
        /* Cue-only rows (for example "拍手") are intentionally kept in the
           list for their metadata, but they must not replace a lyric line
           while the singer is still finishing that line. */
        if (hasDisplayedLyricText(currentSong && currentSong.lyrics && currentSong.lyrics[i])) {
          activeIdx = i;
        }
      }
      else break;                     // time 순서대로이므로 더 볼 필요 없음
    }
  }

  const target = (activeIdx >= 0 && lines[activeIdx]) ? lines[activeIdx] : null;
  // line-level focus 與逐字 Karaoke 同時更新；後者不能等到 activeIdx 改變才刷新。
  updateKaraokeProgress(target, cur === null ? null : cur - LYRIC_LEAD_SEC);

  // 재생 위치를 못 읽었어도 군더더기 정리는 반드시 한다
  pruneActiveLines(target);
  if (target && !target.classList.contains("active")) target.classList.add("active");
  syncTicks++;
  updateDocumentPip(activeIdx);

  if (cur === null) return;           // 재생 위치를 모르면 여기까지

  // 소절이 그대로면 나머지(짤방·스크롤)는 건드리지 않는다.
  // (매 틱마다 전부 갱신하고 smooth 스크롤을 다시 시작하던 것이 버벅임의 원인)
  if (activeIdx === lastActiveIdx && !force) return;

  updateTipPic(activeIdx);          // 짤방도 이 줄에 맞춰 바꿔 준다
  lastActiveIdx = activeIdx;

  if (activeIdx >= 0 && autoScrollEnabled) {
    scrollLyricIntoView(lines[activeIdx]);
  }
}

/* 첫 소절·마지막 소절도 화면 한가운데에 놓이도록 가사 목록의 위아래에
   "빈 공간(패딩)"을 컨테이너 높이의 절반만큼 준다.
   이게 없으면 스크롤이 맨 위에서 더 내려갈 곳이 없어 첫 가사가 위에 붙는다. */
function updateLyricsPadding(){
  const container = document.querySelector(".lyrics-scroll");
  const list = document.getElementById("lyrics-list");
  if (!container || !list) return;
  const first = list.querySelector(".lyric-line");
  const h = container.clientHeight;
  if (!first || !h) return;
  const half = h / 2 - first.getBoundingClientRect().height / 2;
  list.style.paddingTop    = Math.max(8, half) + "px";
  list.style.paddingBottom = Math.max(140, h / 2) + "px";
}

/* 화면 크기가 크게 바뀌면(회전 등) 가운데 기준도 달라지므로 다시 계산한다.
   모바일 주소창이 접히며 생기는 자잘한 높이 변화로는 다시 잡지 않는다
   — 사용자가 직접 가사를 넘겨 보는 중에 화면이 튀지 않도록. */
let lastLyricsW = null, lastLyricsH = null;
window.addEventListener("resize", ()=>{
  const w = window.innerWidth, h = window.innerHeight;
  const changed = (w !== lastLyricsW) || Math.abs(h - lastLyricsH) > 100;
  if (!changed) return;
  lastLyricsW = w; lastLyricsH = h;
  if (!songShellBuilt) return;
  placeTipPic();                 // 화면이 1단↔2단으로 바뀌면 짤방 자리도 함께
  updateLyricsPadding();
  if (isSongViewActive()) updateLyricsSync(true);
});

// 가사 컨테이너만 스크롤한다. scrollIntoView는 상위 스크롤 영역까지
// 함께 움직여서 큰 화면 2단 레이아웃에서 화면이 흔들리는 원인이 됨.
function scrollLyricIntoView(el) {
  const container = document.querySelector(".lyrics-scroll");
  if (!container || !el) return;
  const cRect = container.getBoundingClientRect();
  const eRect = el.getBoundingClientRect();
  const delta = (eRect.top - cRect.top) - (container.clientHeight / 2 - eRect.height / 2);
  const maxTop = container.scrollHeight - container.clientHeight;
  const top = Math.max(0, Math.min(maxTop, container.scrollTop + delta));
  // 이미 거의 제자리면 스크롤을 다시 걸지 않음
  if (Math.abs(top - container.scrollTop) < 4) return;
  animateScrollTo(container, top, SCROLL_DURATION_MS);
}

// behavior:"smooth" 는 속도를 조절할 수 없어(브라우저 고정, 보통 400~600ms)
// 직접 애니메이션해서 SCROLL_DURATION_MS 만큼만 걸리도록 함
function animateScrollTo(container, to, duration) {
  if (scrollRafId !== null) cancelAnimationFrame(scrollRafId);
  const from = container.scrollTop;
  const diff = to - from;
  if (duration <= 0) { container.scrollTop = to; return; }
  const start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start) / duration);
    // easeOutCubic — 처음에 빠르게 움직이고 부드럽게 멈춤
    const eased = 1 - Math.pow(1 - p, 3);
    container.scrollTop = from + diff * eased;
    if (p < 1) {
      scrollRafId = requestAnimationFrame(step);
    } else {
      scrollRafId = null;
    }
  };
  scrollRafId = requestAnimationFrame(step);
}

function seekTo(seconds) {
  if (player && typeof player.seekTo === 'function') {
    player.seekTo(seconds, true);
    player.playVideo();
  }
}

/* ── 오프라인 캐시 · 홈 화면 설치 · 안내 배너 ─────────────────
   서비스워커는 https 로 올렸을 때만 동작합니다.
   (파일을 그냥 열었을 때(file://)는 조용히 건너뜁니다) */
const banner    = document.getElementById("app-banner");
const bannerMsg = document.getElementById("app-banner-msg");
const bannerBtn = document.getElementById("app-banner-action");
const bannerX   = document.getElementById("app-banner-close");
let bannerAction = null;
let bannerDismissAction = null;

function showBanner(html, btnLabel, onClick, kind, onDismiss){
  if (!banner) return;
  bannerMsg.innerHTML = html;
  bannerAction = onClick || null;
  bannerDismissAction = onDismiss || null;
  bannerBtn.textContent = btnLabel || "";
  bannerBtn.hidden = !btnLabel;
  banner.classList.toggle("offline", kind === "offline");
  banner.classList.add("show");
}
function hideBanner(){
  if (banner) banner.classList.remove("show");
  if (bannerBtn){
    bannerBtn.hidden = true;
    bannerBtn.textContent = "";
  }
  bannerAction = null;
  bannerDismissAction = null;
}
if (bannerBtn) bannerBtn.addEventListener("click", ()=>{ if (bannerAction) bannerAction(); });
if (bannerX) bannerX.addEventListener("click", ()=>{
  if (bannerDismissAction) bannerDismissAction();
  else hideBanner();
});

const INSTALL_HINT_KEY = "horo-install-hint";
function isStandaloneApp(){
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}
function installDeviceType(){
  const ua = navigator.userAgent || "";
  const ios = /iphone|ipad|ipod/i.test(ua)
    || (/macintosh/i.test(ua) && Number(navigator.maxTouchPoints) > 1);
  const android = /android/i.test(ua)
    && (/mobile/i.test(ua) || (navigator.userAgentData && navigator.userAgentData.mobile === true));
  return { ios, android };
}
function canShowInstallHint(){
  if (!navigator.onLine || isStandaloneApp()) return false;
  const device = installDeviceType();
  return device.ios || device.android;
}
function installHintDismissed(){ return store(INSTALL_HINT_KEY) === "done"; }
function dismissInstallHint(){
  store(INSTALL_HINT_KEY, "done");
  hideBanner();
}
function showInstallHint(html, btnLabel, onClick){
  if (!canShowInstallHint() || installHintDismissed()) return;
  showBanner(html, btnLabel, onClick, "install", dismissInstallHint);
}

/* 1) 서비스워커 등록 — 오프라인에서도 가사가 열리게.
   The first install is deliberately outside the initial-view critical path. */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", ()=>{
    window.setTimeout(()=>{
      const hadController = Boolean(navigator.serviceWorker.controller);
      navigator.serviceWorker.register(`./sw.js?build=${BUILD}`).then((reg)=>{
        reg.addEventListener("updatefound", ()=>{
          const sw = reg.installing;
          if (!sw) return;
          sw.addEventListener("statechange", ()=>{
            // 이미 쓰고 있는 상태에서 새 버전이 준비된 경우에만 안내
            if (sw.state === "installed" && navigator.serviceWorker.controller){
              showBanner("<b>新版本</b>已準備完成，歌詞或介面可能已更新。",
                         "重新整理",
                         ()=>{ sw.postMessage({ type:"SKIP_WAITING" }); });
            }
          });
        });
      }).catch(()=>{});

      let reloading = false;
      navigator.serviceWorker.addEventListener("controllerchange", ()=>{
        // 首次安裝只讓 Service Worker 接管，避免首次訪問多一次 reload。
        if (!hadController || reloading) return;
        reloading = true;
        location.reload();
      });
    }, 8000);
  });
}

/* 2) 오프라인이 되면 알려 주기 — 가사는 되지만 영상은 안 된다는 안내 */
function updateOnlineState(){
  if (!navigator.onLine){
    showBanner("目前處於<b>離線</b>狀態。仍可查看歌詞與應援提示，但無法播放影片。",
               "", null, "offline");
  } else if (banner && banner.classList.contains("offline")){
    hideBanner();
  }
}
window.addEventListener("online",  updateOnlineState);
window.addEventListener("offline", updateOnlineState);

/* 3) 아이폰은 설치 안내가 자동으로 뜨지 않으므로 한 번만 알려 줌 */
function maybeShowInstallHint(){
  const device = installDeviceType();
  if (!device.ios || !canShowInstallHint() || installHintDismissed()) return;
  showInstallHint("點選分享按鈕 <b>⎋</b> → <b>加入主畫面</b>，即可像 App 一樣使用。",
                  "知道了",
                  dismissInstallHint);
}

/* 안드로이드 크롬 — 설치 배너를 직접 띄움 */
let deferredInstall = null;
window.addEventListener("beforeinstallprompt", (e)=>{
  e.preventDefault();
  if (!canShowInstallHint() || installHintDismissed()) return;
  deferredInstall = e;
  showInstallHint("<b>安裝</b>到主畫面後，就能在場館直接開啟。",
                  "安裝",
                  async ()=>{
                    const promptEvent = deferredInstall;
                    dismissInstallHint();
                    deferredInstall = null;
                    if (!promptEvent) return;
                    try { promptEvent.prompt(); await promptEvent.userChoice; } catch(err){}
                  });
});
window.addEventListener("appinstalled", dismissInstallHint);

setTimeout(()=>{ updateOnlineState(); maybeShowInstallHint(); }, 1500);

window.addEventListener("hashchange", router);

// YouTube API는 실제로歌曲頁需要播放器時才載入，避免 Guide 首屏引入第三方工作。
function loadYouTubeApi(){
  if (window.YT && window.YT.Player){
    if (isSongViewActive()) ensurePlayer();
    return;
  }
  if (document.querySelector("script[data-youtube-api]")) return;
  window.onYouTubeIframeAPIReady = ()=>{
    if (isSongViewActive()) ensurePlayer();
  };
  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  script.async = true;
  script.dataset.youtubeApi = "true";
  document.head.appendChild(script);
}
setupDebugBadge();
setupChangelogModal();

router({ resetScroll: false });
document.documentElement.removeAttribute("data-initial-route");
