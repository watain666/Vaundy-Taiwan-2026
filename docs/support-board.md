# 應援小物交流板（Waline）部署

首頁的「應援小物交流板」前端已經內建在網站裡，但留言要存在一台 Waline 伺服器上。GitHub Pages 只能放靜態檔案，所以伺服器要另外部署。以下使用 Waline 官方最推薦的 **Vercel + Neon（PostgreSQL）**，兩者都有免費方案。

> LeanCloud 的儲存服務已經下線，舊教學若提到 LeanCloud 請略過。

## 目前部署

| 項目 | 值 |
|---|---|
| 伺服器網址 | <https://vaundy-waline.vercel.app> |
| 管理後台 | <https://vaundy-waline.vercel.app/ui> |
| Vercel 專案 | `vaundy-waline`（團隊 `tiui-lus-projects`，函式區域 `sin1`） |
| 資料庫 | Neon `vaundy-waline-db`（`sin1`，Vercel Marketplace 免費方案） |
| 伺服器版本 | `@waline/vercel` 1.43.4（官方 `example/` 範本） |

伺服器專案是用 Vercel CLI 直接部署，沒有連 Git。更新伺服器時，在伺服器專案目錄執行 `npx vercel deploy --prod`。

參考文件：

- Vercel 部署：<https://waline.js.org/en/guide/deploy/vercel.html>
- 伺服器環境變數：<https://waline.js.org/en/reference/server/env.html>

## 1. 部署伺服器

1. 用 GitHub 帳號登入 [Vercel](https://vercel.com)。
2. 打開上面的官方 Vercel 部署文件，點 **Deploy** 按鈕，依指示建立新專案。Vercel 會在你的 GitHub 建立一個 Waline 伺服器 repo。
3. 進入新專案的 **Storage** → **Create Database** → 選 **Neon** → **Accept and Create**。
4. 建立完成後點 **Open in Neon** → **SQL Editor**，貼上 [`waline.pgsql`](https://github.com/walinejs/waline/blob/main/assets/waline.pgsql) 的全部內容並執行，建立資料表。
5. 回到 Vercel，到 **Settings** → **Environment Variables** 加入下一節的變數。
6. 到 **Deployments**，對最新一筆部署選 **Redeploy**。之後只要修改環境變數，都要再 Redeploy 一次才會生效。
7. 點 **Visit** 打開伺服器網址（例如 `https://xxxx.vercel.app`），這就是前端要填的 `serverURL`。

如果留言時出現資料庫連線錯誤，請到 Neon 複製連線資訊，手動設定 `PG_HOST`、`PG_PORT`（通常是 `5432`）、`PG_DB`、`PG_USER`、`PG_PASSWORD`，再 Redeploy。

## 2. 環境變數

| 變數 | 建議值 | 用途 |
|---|---|---|
| `SITE_NAME` | `VAUNDY HORO 台北應援指南` | 通知訊息中顯示的網站名稱 |
| `SITE_URL` | `https://vaundy.tiaui.co` | 通知訊息中的網站連結 |
| `SECURE_DOMAINS` | `vaundy.tiaui.co,xxxx.vercel.app` | 只允許這些網域呼叫 API。填主機名稱，以逗號分隔，伺服器自己的網域也要加 |
| `COMMENT_AUDIT` | `true` | 新留言先隱藏，管理員核准後才公開。網站卡片上的說明文字以此為前提 |
| `IPQPS` | `60`（預設） | 同一個 IP 兩則留言之間至少要隔幾秒 |
| `DISABLE_USERAGENT` | `true` | 不顯示留言者的瀏覽器與作業系統 |
| `DISABLE_REGION` | `true` | 不顯示留言者的所在地區 |

不要設定 `LOGIN=force`，否則訪客無法只填暱稱留言。

選用：

- **Telegram 通知**：設定 `TG_BOT_TOKEN`、`TG_CHAT_ID`，有新留言時傳到 Telegram，方便即時審核。
- **禁用詞**：`FORBIDDEN_WORDS` 用逗號分隔，命中的留言會被標成垃圾留言。官方英文文件沒有列出這個變數，但伺服器程式有實作。不要放正規表示式的特殊符號。
- **垃圾留言過濾**：Waline 預設使用共用的 Akismet key，通常不用另外設定。

## 3. 建立管理員帳號

1. 打開 `<serverURL>/ui/register`，第一個註冊的帳號會成為管理員。
2. 之後到 `<serverURL>/ui` 審核、刪除留言。

請在把網址填進網站之前完成註冊，避免別人搶先註冊成管理員。

## 4. 接上網站

1. 把 `src/services/support-board.js` 的 `SUPPORT_BOARD_SERVER_URL` 改成伺服器網址，例如：

   ```js
   export const SUPPORT_BOARD_SERVER_URL = "https://xxxx.vercel.app";
   ```

2. 執行 `npm run build` 確認建置成功，再依 `AGENTS.md` 的發布流程上線。
3. 上線後展開首頁的「應援小物交流板」，送出一則測試留言，再到 `<serverURL>/ui` 確認它出現在待審核列表。

## 前端設定說明

`src/services/support-board.js` 已經套用以下設定：

- 只需要填暱稱，不需要登入或填 email（`login: "disable"`、`requiredMeta: ["nick"]`）。
- 所有頁面共用同一個留言串（`path: "/support-goods"`）。
- 關閉圖片上傳、GIF 搜尋、表情包、回應按鈕與 RSS，避免向 unpkg 或 giphy 等第三方發出請求，也減少不當內容。
- 單則留言上限 500 字，介面使用繁體中文（`lang: "zh-TW"`）。
