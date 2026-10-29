// Fan-run support-goods board backed by a self-hosted Waline server.
// Leave SUPPORT_BOARD_SERVER_URL empty until the server is deployed; the card
// then shows a "coming soon" note instead of loading the comment client.
export const SUPPORT_BOARD_SERVER_URL = "https://vaundy-waline.vercel.app";

// Fixed thread key so every page and hash route shares one board.
const SUPPORT_BOARD_PATH = "/support-goods";

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

export function mountSupportBoard(host){
  if (!host) return;
  if (!SUPPORT_BOARD_SERVER_URL){
    setStatus(host, "留言板準備中，開放後會在這裡顯示。");
    return;
  }
  if (host.dataset.mounted === "1") return;
  host.dataset.mounted = "1";
  setStatus(host, "留言板載入中…");

  loadWaline()
    .then(({ init }) => {
      if (!host.isConnected) return;
      boardInstance?.destroy();
      host.replaceChildren();
      boardInstance = init({
        el: host,
        serverURL: SUPPORT_BOARD_SERVER_URL,
        path: SUPPORT_BOARD_PATH,
        lang: "zh-TW",
        dark: true,
        login: "disable",
        meta: ["nick"],
        requiredMeta: ["nick"],
        wordLimit: 500,
        pageSize: 10,
        commentSorting: "latest",
        noRss: true,
        reaction: false,
        emoji: false,
        search: false,
        imageUploader: false,
        highlighter: false,
        texRenderer: false,
        locale: {
          nick: "暱稱",
          placeholder: "想發放或領取應援小物？寫下場次、時間、地點與認人方式。請勿留下電話、LINE ID 等個人資料。",
          sofa: "還沒有人留言，來當第一個吧！"
        }
      });
    })
    .catch(() => {
      host.dataset.mounted = "";
      setStatus(host, "留言板暫時無法載入，請確認網路連線後重新展開這張卡片。");
    });
}
