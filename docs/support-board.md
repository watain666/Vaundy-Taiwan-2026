# VAWS 交流區（Waline）部署

右下角的「VAWS 交流區」聊天泡泡已經內建在網站裡，但留言要存在一台 Waline 伺服器上。GitHub Pages 只能放靜態檔案，所以伺服器要另外部署。以下使用 Waline 官方最推薦的 **Vercel + Neon（PostgreSQL）**，兩者都有免費方案。

> LeanCloud 的儲存服務已經下線，舊教學若提到 LeanCloud 請略過。

## 目前部署

| 項目 | 值 |
|---|---|
| 伺服器網址 | <https://vaundy-waline.vercel.app> |
| 管理後台 | <https://vaundy-waline.vercel.app/ui> |
| Vercel 專案 | `vaundy-waline`（團隊 `tiui-lus-projects`，函式區域 `sin1`） |
| 資料庫 | Neon `vaundy-waline-db`（`sin1`，Vercel Marketplace 免費方案） |
| 伺服器版本 | `@waline/vercel` 1.43.4（官方 `example/` 範本） |
| 資料表結構 | [`docs/waline.pgsql`](waline.pgsql)（官方結構＋取消置頂修正 trigger，見下方「取消置頂後留言卡在最下面」） |

伺服器專案是用 Vercel CLI 直接部署，沒有連 Git。更新伺服器時，在伺服器專案目錄執行 `npx vercel deploy --prod`；想先驗再切，用 `npx vercel deploy --prod --skip-domain` 建好部署、測過之後再 `npx vercel promote <部署網址>`。

> **不要只靠 Redeploy 更新。** Vercel 後台與 CLI 的 Redeploy 會重建前一次部署，但不會帶上 `vercel.json` 裡 `env` 的 `NODE_OPTIONS`。Waline 1.43 用 `require()` 載入只有 ESM 的 `@mdit/*` 套件，Vercel 的 Node.js 執行環境預設關掉 `require(esm)`（`--no-experimental-require-module`），少了這個旗標函式一啟動就 `ERR_REQUIRE_ESM`，所有請求都回 500。2026-11-06 就因此停了約 4 分鐘，用 `npx vercel rollback` 救回。現在 `NODE_OPTIONS` 也設成專案的環境變數（見下表），Redeploy 不會再因此掛，但更新仍以 `vercel deploy --prod` 為準。

參考文件：

- Vercel 部署：<https://waline.js.org/en/guide/deploy/vercel.html>
- 伺服器環境變數：<https://waline.js.org/en/reference/server/env.html>

## 1. 部署伺服器

1. 用 GitHub 帳號登入 [Vercel](https://vercel.com)。
2. 打開上面的官方 Vercel 部署文件，點 **Deploy** 按鈕，依指示建立新專案。Vercel 會在你的 GitHub 建立一個 Waline 伺服器 repo。
3. 進入新專案的 **Storage** → **Create Database** → 選 **Neon** → **Accept and Create**。
4. 建立完成後點 **Open in Neon** → **SQL Editor**，貼上本 repo 的 [`docs/waline.pgsql`](waline.pgsql) 全部內容並執行，建立資料表。這份是官方 [`waline.pgsql`](https://github.com/walinejs/waline/blob/main/assets/waline.pgsql) 加上檔案最後的取消置頂修正，不要改貼官方原檔。
5. 回到 Vercel，到 **Settings** → **Environment Variables** 加入下一節的變數。
6. 到 **Deployments**，對最新一筆部署選 **Redeploy**。之後只要修改環境變數，都要再 Redeploy 一次才會生效。Redeploy 之前務必確認下一節的 `NODE_OPTIONS` 已經設成環境變數，否則重建出來的函式會啟動失敗（見上方「不要只靠 Redeploy 更新」）。
7. 點 **Visit** 打開伺服器網址（例如 `https://xxxx.vercel.app`），這就是前端要填的 `serverURL`。

如果留言時出現資料庫連線錯誤，請到 Neon 複製連線資訊，手動設定 `PG_HOST`、`PG_PORT`（通常是 `5432`）、`PG_DB`、`PG_USER`、`PG_PASSWORD`，再 Redeploy。

## 2. 環境變數

| 變數 | 建議值 | 用途 |
|---|---|---|
| `SITE_NAME` | `VAUNDY HORO 台北應援指南` | 通知訊息中顯示的網站名稱 |
| `SITE_URL` | `https://vaundy.tiaui.co` | 通知訊息中的網站連結 |
| `SECURE_DOMAINS` | `vaundy.tiaui.co,xxxx.vercel.app` | 只允許這些網域呼叫 API。填主機名稱，以逗號分隔，伺服器自己的網域也要加 |
| `IPQPS` | `10`（預設 60） | 同一個 IP 兩則留言之間至少要隔幾秒；60 秒對聊天來說太久，連續回覆會出現「Comment too fast!」 |
| `DISABLE_USERAGENT` | `true` | 不顯示留言者的瀏覽器與作業系統 |
| `DISABLE_REGION` | `true` | 不顯示留言者的所在地區 |
| `GRAVATAR_STR` | `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7` | 頭像網址樣板。聊天視窗用 CSS 藏了頭像，瀏覽器卻仍會向預設的 `seccdn.libravatar.org` 下載（從台灣約 0.7 秒）；改成這個 1×1 透明 GIF 的 data URI 後就沒有外部頭像請求（2026-11-06 已設定並部署）。見下方「速度」 |
| `NODE_OPTIONS` | `--experimental-require-module` | 讓 Waline 能用 `require()` 載入只有 ESM 的 `@mdit/*` 套件。官方 `vercel.json` 的 `env` 也有這行，但 Redeploy 不會帶上它，所以要在這裡再設一次（三個環境都設，2026-11-06 已設定） |

不要設定 `LOGIN=force`，否則訪客無法只填暱稱留言。

目前**沒有**設定 `COMMENT_AUDIT`，留言送出後直接公開，管理員事後到後台刪除不當內容。若要改成先審核再公開，加上 `COMMENT_AUDIT=true` 並 Redeploy，同時在 `src/ui/support-chat.js` 的提醒文字改回「新留言經管理員審核後才會顯示」。

選用：

- **Telegram 通知**：設定 `TG_BOT_TOKEN`、`TG_CHAT_ID`，有新留言時傳到 Telegram，方便即時刪除不當留言。
- **禁用詞**：`FORBIDDEN_WORDS` 用逗號分隔，命中的留言會被標成垃圾留言。官方英文文件沒有列出這個變數，但伺服器程式有實作。不要放正規表示式的特殊符號。
- **垃圾留言過濾**：Waline 預設使用共用的 Akismet key，通常不用另外設定。

## 3. 建立管理員帳號

1. 打開 `<serverURL>/ui/register`，第一個註冊的帳號會成為管理員。
2. 之後到 `<serverURL>/ui` 管理、刪除留言。

請在把網址填進網站之前完成註冊，避免別人搶先註冊成管理員。

## 4. 接上網站

1. 把 `src/services/support-board.js` 的 `SUPPORT_BOARD_SERVER_URL` 改成伺服器網址，例如：

   ```js
   export const SUPPORT_BOARD_SERVER_URL = "https://xxxx.vercel.app";
   ```

2. 執行 `npm run build` 確認建置成功，再依 `AGENTS.md` 的發布流程上線。
3. 上線後點開首頁右下角的聊天泡泡，送出一則測試留言，確認它出現在留言列表，再到 `<serverURL>/ui` 刪除。

## 前端設定說明

`src/services/support-board.js` 已經套用以下設定：

- 只需要填暱稱，不需要登入或填 email（`login: "disable"`、`requiredMeta: ["nick"]`）。
- 所有頁面共用同一個留言串（`path: "/support-goods"`）。
- 最新留言排在最底部；與自己上次使用的暱稱相同的留言會靠右顯示（只是外觀，任何人都能用相同暱稱）。
- 聊天視窗開著時每 30 秒查詢一次留言數，有增加才重新載入清單。訪客正在輸入或還有未送出的文字時會先延後，等離開輸入框再載入，避免收起鍵盤。
- 圖片改用自架的 Cloudflare R2 上傳（見下方「圖片上傳」）。關閉 GIF 搜尋、表情包、回應按鈕與 RSS，避免向 unpkg 或 giphy 等第三方發出請求，也減少不當內容。
- 每頁 20 則，單則留言上限 500 字，介面使用繁體中文（`lang: "zh-TW"`）。

## 取消置頂後留言卡在最下面

Waline 的已知問題：管理員在留言上按「取消置頂」時，前端送出的是 `sticky: 0`，不是清回 `NULL`；伺服器卻用 `sticky DESC NULLS LAST, insertedAt DESC` 排序。結果 `0` 排在所有從沒置頂過（`NULL`）的留言前面，再加上聊天視窗用 `column-reverse` 把第一則顯示在最底部，取消置頂的舊留言就會一直卡在最下面，不會回到原本的時間位置。

修正放在資料庫，不改前端也不用重新部署伺服器：[`docs/waline.pgsql`](waline.pgsql) 最後的 trigger `wl_comment_unsticky_null` 會把寫入的 `sticky = 0` 自動改存成 `NULL`。目前的 Neon 資料庫已在 2026-10-31 套用。

重建資料庫時，貼上整份 `docs/waline.pgsql` 就會一起建立。若是資料庫已經存在、只缺這個修正，在 Neon SQL Editor 執行：

1. 先把已經是 `0` 的留言改回 `NULL`：

   ```sql
   UPDATE wl_comment SET sticky = NULL WHERE sticky = 0;
   ```

2. 再執行 `docs/waline.pgsql` 最後的 `CREATE OR REPLACE FUNCTION wl_comment_unsticky_null` 與 `CREATE TRIGGER wl_comment_unsticky_null` 兩段。

確認 trigger 存在：

```sql
SELECT tgname FROM pg_trigger WHERE tgrelid = 'wl_comment'::regclass AND NOT tgisinternal;
```

升級 `@waline/vercel` 後，若官方已改成取消置頂時清回 `NULL`，這個 trigger 留著也不影響。

## 圖片上傳（Cloudflare Worker + R2）

Waline 內建的上傳只會把圖片轉成 base64 存進留言，而且上限 128KB，所以改由 Cloudflare Worker 接收圖片並存到 R2。

| 項目 | 值 |
|---|---|
| Worker 原始碼 | `~/dev/vaundy-chat-images/`（`src/index.js`、`wrangler.toml`，不在本 repo） |
| Worker 網址 | `https://vaundy-chat-images.watain666666.workers.dev` |
| R2 bucket | `vaundy-chat-images` |
| 免費額度 | R2 儲存 10GB／月，下載流量不計費；Workers 每天 100,000 次請求 |

運作方式：

- 前端（`uploadImage()`）先把照片縮到長邊 1600px、重新存成 JPEG（品質 0.82），同時去掉 EXIF（含 GPS 拍攝地點）。3MB 以內的 GIF 保留原檔以維持動畫。
- `POST /upload` 只接受 `vaundy.tiaui.co` 和 localhost 的 `Origin`；限 JPEG、PNG、WebP、GIF，並檢查檔頭，最大 3MB；每個 IP 每 60 秒最多 10 次。
- 圖片存成 `support-goods/年/月/<uuid>.<副檔名>`，經 `GET /i/<key>` 讀取，帶 `nosniff` 與 `default-src 'none'` 標頭。
- `src/services/support-board.js` 的 `SUPPORT_BOARD_IMAGE_URL` 留空時不顯示上傳按鈕。

重新部署 Worker：

```sh
cd ~/dev/vaundy-chat-images
npx wrangler@4 deploy
```

### 刪除不當圖片

在 Waline 後台刪除留言**不會**刪除圖片檔。從留言內容的圖片網址取出 `/i/` 後面的路徑，再執行：

```sh
npx wrangler@4 r2 object delete "vaundy-chat-images/support-goods/2026/10/<uuid>.jpg" --remote
```

也可以到 Cloudflare 後台 R2 → `vaundy-chat-images` 找到檔案刪除。刪除後 Cloudflare 與瀏覽器的快取可能還會短暫保留舊圖片。

## 速度：冷啟動與頭像

2026-11-06 從台灣用 curl 實測（伺服器在 Vercel `sin1`，資料庫在 Neon `sin1`，專案建立時 Fluid Compute 就已開啟）：

- 暖機中的函式，不論端點（包含不碰資料庫的 `/` 與 `/api/token`），回應時間都約 0.43–0.69 秒；這是 Vercel 邊緣 → 新加坡函式這條路的固定開銷，網站端改不了。
- 冷啟動 4–5 秒。暖機後同時送 6 個請求：3 個由同一個暖機實例同時服務（0.50–0.57 秒），另外 3 個開新實例、各等 4.3–4.4 秒。也就是 Fluid Compute 的同實例併發有效，但一個實例同時大約只吃 3 個請求，超過就會冷啟動。網站同時送 2 個清單＋2 個留言數時全部 0.66–0.91 秒。
- 預設頭像來自 `seccdn.libravatar.org`，約 0.7 秒；暱稱是純數字時會改抓 `q1.qlogo.cn`。聊天視窗用 CSS 把頭像藏起來，但瀏覽器還是會下載。設定 `GRAVATAR_STR` 後，清單裡 20 則留言的 `avatar` 全部變成 data URI，用 headless Chrome 開正式站的交流區也不再有任何頭像外連請求。

網站端已經做的事見 [`README.md`](../README.md) 的交流區段落：閒置時用 `GET /api/token`（沒帶 token 時伺服器不讀資料庫，見 `@waline/vercel` 的 `src/logic/base.js`；帶 `Origin` 才會過 `SECURE_DOMAINS`，瀏覽器的跨網域 fetch 一定會帶）喚醒函式、開過交流區的人在閒置時先載好清單、關閉視窗不拆掉已載入的留言、留言數基準等清單畫好才查。

伺服器端 2026-11-06 已做：

1. **`GRAVATAR_STR`** 設成上表的 data URI 並部署。這個變數是 nunjucks 樣板，沒有樣板語法就原樣輸出（已用 nunjucks 3.2.4 驗證），所以所有留言的 `avatar` 都是內嵌的透明圖，前端與管理後台都不再向外抓頭像。
2. **`NODE_OPTIONS`** 設成專案環境變數，讓 Redeploy 不會再把函式弄崩（見上方「不要只靠 Redeploy 更新」）。
3. **Fluid Compute** 不用動：`resourceConfig.fluid` 本來就是 `true`（2025-04-23 之後建立的專案預設開）。

不要用排程定時喚醒函式來躲冷啟動：Neon 免費方案每個專案每月 100 CU-hours，超過就停到下個月，定時喚醒會把額度吃光。
