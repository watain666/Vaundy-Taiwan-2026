// Fan-run support-goods board backed by a self-hosted Waline server.
// Leave SUPPORT_BOARD_SERVER_URL empty to show a "coming soon" note instead
// of loading the comment client.
export const SUPPORT_BOARD_SERVER_URL = "https://vaundy-waline.vercel.app";

// Cloudflare Worker + R2 that stores chat images (see docs/support-board.md).
// Leave empty to hide the image button.
export const SUPPORT_BOARD_IMAGE_URL = "https://vaundy-chat-images.watain666666.workers.dev";

// Fixed thread key so every page and hash route shares one board.
const SUPPORT_BOARD_PATH = "/support-goods";

const IMAGE_MAX_EDGE = 1600;
const IMAGE_QUALITY = 0.82;
const IMAGE_MAX_BYTES = 3 * 1024 * 1024;
const UPLOAD_ERRORS = {
  413: "圖片太大，請換一張較小的圖片。",
  415: "只支援 JPG、PNG、WebP、GIF 圖片。",
  429: "上傳太頻繁，請稍等一分鐘再試。"
};

let walinePromise = null;
let boardInstance = null;

function loadWaline(){
  if (!walinePromise){
    walinePromise = Promise.all([
      import("@waline/client"),
      import("@waline/client/style")
    ])
      .then(([module]) => module)
      .catch((error) => {
        walinePromise = null;
        throw error;
      });
  }
  return walinePromise;
}

function setStatus(host, text){
  const status = document.createElement("p");
  status.className = "support-board-status";
  status.setAttribute("role", "status");
  status.textContent = text;
  host.replaceChildren(status);
}

// Total comment count, used to poll for new messages without re-rendering.
export function fetchSupportBoardCount(){
  if (!SUPPORT_BOARD_SERVER_URL) return Promise.resolve(null);
  const url = `${SUPPORT_BOARD_SERVER_URL}/api/comment?type=count&url=${encodeURIComponent(SUPPORT_BOARD_PATH)}`;
  return fetch(url)
    .then(res => res.ok ? res.json() : null)
    .then(body => Number.isFinite(body?.data?.[0]) ? body.data[0] : null)
    .catch(() => null);
}

function decodeImage(file){
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("這張圖片無法讀取，請換一張 JPG 或 PNG。")); };
    img.src = url;
  });
}

// Re-encode photos as a smaller JPEG; this also drops EXIF data such as GPS.
// Small GIFs pass through untouched to keep their animation.
async function isGif(file){
  const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  return String.fromCharCode(...head) === "GIF8";
}

async function shrinkImage(file){
  if (file.size <= IMAGE_MAX_BYTES && await isGif(file)) return file.slice(0, file.size, "image/gif");
  const img = await decodeImage(file);
  const scale = Math.min(1, IMAGE_MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff"; // transparent PNGs would otherwise turn black
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", IMAGE_QUALITY));
  if (!blob) throw new Error("這張圖片無法處理，請換一張再試。");
  return blob;
}

async function uploadImage(file){
  const image = await shrinkImage(file);
  let res;
  try {
    res = await fetch(`${SUPPORT_BOARD_IMAGE_URL}/upload`, {
      method: "POST",
      headers: { "Content-Type": image.type },
      body: image
    });
  } catch (e) {
    throw new Error("圖片上傳失敗，請確認網路連線後再試。");
  }
  if (!res.ok) throw new Error(UPLOAD_ERRORS[res.status] || "圖片上傳失敗，請稍後再試。");
  const url = await res.json().then(body => body?.url, () => null);
  if (typeof url !== "string") throw new Error("圖片上傳失敗，請稍後再試。");
  return url;
}

export function unmountSupportBoard(){
  boardInstance?.destroy();
  boardInstance = null;
}

// Resolves true once Waline is mounted in host. A re-mount re-fetches the list;
// Waline keeps unsent drafts and the nickname in localStorage. shouldMount lets
// the caller cancel a mount that finishes after the board was closed.
export function mountSupportBoard(host, shouldMount = () => true){
  if (!host) return Promise.resolve(false);
  if (!SUPPORT_BOARD_SERVER_URL){
    setStatus(host, "交流板準備中，開放後會在這裡顯示。");
    return Promise.resolve(false);
  }
  if (!boardInstance) setStatus(host, "交流板載入中…");

  return loadWaline()
    .then(({ init }) => {
      if (!host.isConnected || !shouldMount()) return false;
      unmountSupportBoard();
      host.replaceChildren();
      boardInstance = init({
        el: host,
        serverURL: SUPPORT_BOARD_SERVER_URL,
        path: SUPPORT_BOARD_PATH,
        lang: "zh-TW",
        dark: 'html[data-theme="dark"]',
        login: "disable",
        meta: ["nick"],
        requiredMeta: ["nick"],
        wordLimit: 500,
        pageSize: 20,
        commentSorting: "latest",
        noRss: true,
        reaction: false,
        emoji: false,
        search: false,
        imageUploader: SUPPORT_BOARD_IMAGE_URL ? uploadImage : false,
        highlighter: false,
        texRenderer: false,
        locale: {
          nick: "暱稱",
          placeholder: "寫點什麼…（請勿留下電話、LINE ID 等個資）",
          sofa: "還沒有人留言，來當第一個吧！"
        }
      });
      return true;
    })
    .catch(() => {
      setStatus(host, "交流板暫時無法載入，請確認網路連線後重新開啟。");
      return false;
    });
}
