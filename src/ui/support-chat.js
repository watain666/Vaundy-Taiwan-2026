import { CHAT_SVG, CLOSE_SVG } from "./icons.js";
import { SUPPORT_BOARD_IMAGE_URL, fetchSupportBoardCount, mountSupportBoard, prefetchSupportBoard } from "../services/support-board.js";
import { store } from "../services/storage.js";

// Floating support-goods chat: a bottom-right launcher that opens the Waline
// board styled as a chat window. Shown only on the home and guide routes.
const POLL_MS = 30000;
const NEAR_BOTTOM_PX = 80;
const KEYBOARD_MIN_PX = 80;
// Set once the visitor opened the chat; later visits then load the list at idle.
const OPENED_KEY = "horo-support-chat-opened";
// Longest wait for the list before the poll baseline is fetched anyway.
const LIST_RENDER_TIMEOUT_MS = 15000;

let launcher = null;
let panel = null;
let scroller = null;
let host = null;
let pollTimer = 0;
let lastCount = null;
let stickToBottom = true;
let observer = null;
let refreshPending = false;
let generation = 0;
let mounted = false; // the board is rendered in host, whether the panel shows it or not
let pendingMount = null; // a mount started by refresh() that is still waiting for the chunk
let listReady = Promise.resolve(); // the current mount's list arrived and the poll baseline is set
let stopListWatch = null; // ends the wait for the current mount's list early
let pollQueued = false; // an open() already waits on listReady to poll

function build(){
  launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "support-chat-launcher";
  launcher.setAttribute("aria-label", "開啟 VAWS 交流區");
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "support-chat");
  launcher.innerHTML = `${CHAT_SVG}<span class="support-chat-launcher-label">VAWS 交流區</span>`;

  panel = document.createElement("section");
  panel.className = "support-chat";
  panel.id = "support-chat";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-labelledby", "support-chat-title");
  panel.innerHTML = `
    <header class="support-chat-head">
      <div class="support-chat-heading">
        <h2 id="support-chat-title">VAWS 交流區</h2>
        <p>交換應援小物、和 VAWS 交流的地方</p>
      </div>
      <button class="support-chat-close" type="button" aria-label="關閉 VAWS 交流區">${CLOSE_SVG}</button>
    </header>
    <div class="support-chat-body">
      <p class="support-chat-note">請勿公開電話、LINE ID 等個人資料，面交時留意假冒發放的詐騙。照片會自動縮小並移除拍攝地點等資訊。留言可能提到歌單，介意劇透者請斟酌閱讀。不當內容將由管理員刪除。</p>
      <div class="support-board" data-support-board></div>
    </div>
  `;
  scroller = panel.querySelector(".support-chat-body");
  host = panel.querySelector("[data-support-board]");

  launcher.addEventListener("click", open);
  panel.querySelector(".support-chat-close").addEventListener("click", () => close({ restoreFocus: true }));
  panel.addEventListener("focusout", () => {
    // Apply a refresh that was held back while the visitor was typing.
    setTimeout(() => { if (refreshPending && !isComposing()) refresh(); }, 0);
  });
  host.addEventListener("click", (e) => {
    // A reply's @mention links to "#<comment id>", which the hash router would
    // treat as an unknown route and swap the page behind the chat for home.
    const mention = e.target.closest('.wl-content a[href^="#"]');
    if (mention){
      e.preventDefault();
      host.querySelector(`[id="${CSS.escape(mention.hash.slice(1))}"]`)?.scrollIntoView({ block: "start" });
      return;
    }
    // Only open images from the upload Worker, and leave linked images to the link.
    const img = e.target.closest(".wl-content img");
    if (!img || img.closest("a") || !SUPPORT_BOARD_IMAGE_URL) return;
    if (img.src.startsWith(`${SUPPORT_BOARD_IMAGE_URL}/`)) window.open(img.src, "_blank", "noopener");
  });
  // Images grow the list after it rendered; keep the newest message in view.
  host.addEventListener("load", (e) => {
    if (e.target.tagName === "IMG" && stickToBottom) scrollToBottom();
  }, true);
  scroller.addEventListener("scroll", () => {
    stickToBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < NEAR_BOTTOM_PX;
  }, { passive: true });

  document.body.append(launcher, panel);
}

function scrollToBottom(){
  scroller.scrollTop = scroller.scrollHeight;
}

// Waline has no notion of "my" anonymous comments; match the nickname it saved.
function markOwnMessages(){
  let nick = "";
  try { nick = JSON.parse(localStorage.getItem("WALINE_USER_META") || "{}").nick || ""; } catch (e) { /* storage blocked */ }
  host.querySelectorAll(".wl-card-item").forEach(item => {
    const name = item.querySelector(":scope > .wl-card > .wl-head .wl-nick")?.textContent.trim();
    item.classList.toggle("is-mine", !!nick && name === nick);
  });
}

function watchContent(){
  observer?.disconnect();
  observer = new MutationObserver(() => {
    markOwnMessages();
    disableAutofill();
    if (stickToBottom) scrollToBottom();
  });
  observer.observe(host, { childList: true, subtree: true });
}

// Keep the panel above the on-screen keyboard (iOS does not resize fixed layers).
function fitToViewport(){
  const vv = window.visualViewport;
  if (!vv || panel.hidden) return;
  const keyboard = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
  panel.style.setProperty("--support-chat-keyboard", `${keyboard}px`);
  panel.style.setProperty("--support-chat-viewport", `${vv.height}px`);
  panel.style.setProperty("--support-chat-top", `${vv.offsetTop}px`);
  panel.classList.toggle("is-keyboard", keyboard > KEYBOARD_MIN_PX);
}

// Keep iOS from offering contact AutoFill (phone numbers) in the chat inputs.
function disableAutofill(){
  host.querySelectorAll('.wl-editor, .wl-header input:not([autocomplete="off"])').forEach(el => {
    el.setAttribute("autocomplete", "off");
  });
}

function onKeydown(e){
  if (e.key === "Escape" && !e.isComposing) close({ restoreFocus: true });
}

// Re-mounting Waline would drop focus and close the on-screen keyboard.
function isComposing(){
  const active = document.activeElement;
  if (active && host.contains(active) && active.matches("input, textarea")) return true;
  return !!host.querySelector(".wl-editor")?.value.trim();
}

// Resolves once Waline has rendered the list or its empty state, or after the
// timeout (a failed load shows a retry button instead). A newer mount ends the
// previous wait at once.
function whenListRendered(){
  stopListWatch?.();
  return new Promise((resolve) => {
    const watcher = new MutationObserver(check);
    let timer = 0;
    function done(){
      watcher.disconnect();
      clearTimeout(timer);
      if (stopListWatch === done) stopListWatch = null;
      resolve();
    }
    function check(){ if (host.querySelector(".wl-card-item, .wl-empty")) done(); }
    stopListWatch = done;
    watcher.observe(host, { childList: true, subtree: true });
    timer = setTimeout(done, LIST_RENDER_TIMEOUT_MS);
    check();
  });
}

// The board is mounted but shows neither the list, the empty state nor the
// loading state: Waline's list request failed, for example while offline.
function listFailed(){
  return !host.querySelector(".wl-card-item, .wl-empty, .wl-loading");
}

// Mount (or re-mount) the board, shown or not. The count that the poll compares
// against is fetched only after the list arrived: the server handles one
// request per instance, so a count request racing the list request would send
// one of them to a cold instance. As before, a message posted between the two
// requests is folded into the baseline. A later refresh supersedes one still
// loading.
function refresh(){
  refreshPending = false;
  const current = ++generation;
  const mount = mountSupportBoard(host, () => current === generation).then((ok) => {
    if (pendingMount === mount) pendingMount = null;
    if (current !== generation) return false;
    mounted = ok;
    if (!ok) return false;
    listReady = whenListRendered()
      .then(() => (current === generation ? fetchSupportBoardCount() : null))
      .then((count) => { if (count != null && current === generation) lastCount = count; });
    return true;
  });
  pendingMount = mount;
  return mount;
}

function poll(){
  if (panel.hidden || document.visibilityState !== "visible") return;
  fetchSupportBoardCount().then((count) => {
    if (count == null || panel.hidden) return;
    if (lastCount == null || count <= lastCount){
      lastCount = count;
      return;
    }
    if (isComposing()) refreshPending = true;
    else refresh();
  });
}

function open(){
  panel.hidden = false;
  launcher.hidden = true;
  launcher.setAttribute("aria-expanded", "true");
  store(OPENED_KEY, "1");
  fitToViewport();
  watchContent();
  stickToBottom = true;
  if (mounted && !pendingMount && !listFailed()){
    // Loaded at idle or kept from the last open: show it at once and reload
    // only when the count poll finds new messages.
    markOwnMessages();
    disableAutofill();
    scrollToBottom();
    if (!pollQueued){
      pollQueued = true;
      listReady.then(() => { pollQueued = false; poll(); });
    }
  } else if (!pendingMount){
    // Not loaded yet, or the earlier load failed; a mount still waiting for
    // the chunk is left to finish and already shows the loading note.
    refresh();
  }
  document.addEventListener("keydown", onKeydown);
  clearInterval(pollTimer);
  pollTimer = setInterval(poll, POLL_MS);
  panel.querySelector(".support-chat-close").focus();
}

function close({ restoreFocus = false } = {}){
  if (!panel || panel.hidden) return;
  panel.hidden = true;
  launcher.setAttribute("aria-expanded", "false");
  clearInterval(pollTimer);
  document.removeEventListener("keydown", onKeydown);
  observer?.disconnect();
  refreshPending = false;
  // The board stays mounted behind the hidden panel, so reopening is instant.
  if (!launcher.dataset.routeHidden) launcher.hidden = false;
  if (restoreFocus && !launcher.hidden) launcher.focus();
}

// Called on every route change.
// Warm up once the page has settled; Safari has no requestIdleCallback.
// Visitors who opened the chat before get the list mounted behind the hidden
// panel, so their next open shows it at once; that list request itself wakes
// the server. First-time visitors only wake the server, so people who never
// open the chat do not wake the database.
let prefetchScheduled = false;
function schedulePrefetch(){
  if (prefetchScheduled) return;
  prefetchScheduled = true;
  const run = () => {
    const returning = store(OPENED_KEY) === "1";
    prefetchSupportBoard({ wakeServer: !returning }).then((ready) => {
      if (ready && returning && !mounted && generation === 0) refresh();
    });
  };
  if (window.requestIdleCallback) requestIdleCallback(run, { timeout: 5000 });
  else setTimeout(run, 2000);
}

export function syncSupportChat(visible){
  if (!launcher){
    if (!visible) return;
    build();
    window.visualViewport?.addEventListener("resize", fitToViewport);
    window.visualViewport?.addEventListener("scroll", fitToViewport);
  }
  if (visible){
    delete launcher.dataset.routeHidden;
    if (panel.hidden) launcher.hidden = false;
    schedulePrefetch();
  } else {
    launcher.dataset.routeHidden = "1";
    close();
    launcher.hidden = true;
  }
}
