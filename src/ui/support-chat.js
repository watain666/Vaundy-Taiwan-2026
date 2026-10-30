import { CHAT_SVG, CLOSE_SVG } from "./icons.js";
import { SUPPORT_BOARD_IMAGE_URL, fetchSupportBoardCount, mountSupportBoard, unmountSupportBoard } from "../services/support-board.js";

// Floating support-goods chat: a bottom-right launcher that opens the Waline
// board styled as a chat window. Shown only on the home and guide routes.
const POLL_MS = 30000;
const NEAR_BOTTOM_PX = 80;
const KEYBOARD_MIN_PX = 80;

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

function build(){
  launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "support-chat-launcher";
  launcher.setAttribute("aria-label", "開啟 VAWS 交流板");
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "support-chat");
  launcher.innerHTML = CHAT_SVG;

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
        <h2 id="support-chat-title">VAWS 交流板</h2>
        <p>交換應援小物、和 VAWS 交流的地方</p>
      </div>
      <button class="support-chat-close" type="button" aria-label="關閉 VAWS 交流板">${CLOSE_SVG}</button>
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

function refresh(){
  refreshPending = false;
  const current = ++generation;
  return mountSupportBoard(host, () => current === generation && !panel.hidden).then((mounted) => {
    if (!mounted) return;
    fetchSupportBoardCount().then(count => { if (current === generation) lastCount = count; });
  });
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
  fitToViewport();
  watchContent();
  stickToBottom = true;
  refresh();
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
  generation++;
  refreshPending = false;
  unmountSupportBoard();
  lastCount = null;
  if (!launcher.dataset.routeHidden) launcher.hidden = false;
  if (restoreFocus && !launcher.hidden) launcher.focus();
}

// Called on every route change.
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
  } else {
    launcher.dataset.routeHidden = "1";
    close();
    launcher.hidden = true;
  }
}
