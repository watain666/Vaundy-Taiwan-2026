# 台北場應援指南 — 發佈到 GitHub

這是 Vaundy ASIA ARENA TOUR 2026「HORO」台北場的繁體中文應援指南。

專案儲存庫：<https://github.com/watain666/Vaundy-Taiwan-2026>

## 1. 專案結構與建置

```text
index.html                  ← HTML 外殼與 PWA meta；Vite 建置時填入首頁
src/main.js                 ← 頁面路由、互動與渲染邏輯
src/data.js                 ← 歌單、BPM、座位與演出資料
src/song-metadata.js        ← 歌曲清單：id、標題、YouTube、Spotify 與譯者署名（以此為準）
src/song-lyrics.js          ← 每首歌的日文歌詞、繁中翻譯與時間點
src/chant-guide.js          ← 日本版應援指南（應援時間點、分段與背景合唱）
furigana.js                 ← 以整行日文為 key 的假名讀音與羅馬字基底表
src/furigana-corrections.js ← 假名讀音與羅馬字修正（覆蓋基底表）
src/catalogue/              ← 歌曲目錄：建置時把上面這些檔案組成每首歌並檢查資料規則
src/build/                  ← 建置時寫進 Service Worker 的版本與預先下載清單
tests/                      ← vitest 測試與歌曲目錄 golden snapshot
src/base.css                ← 基礎元件樣式
src/theme.css               ← 主題與頁面外觀樣式
src/app.css                 ← CSS 統一入口
src/ui/icons.js             ← 共用 SVG 圖示與歌詞圖示模板
src/ui/home.js              ← 建置與頁面切換共用的首頁 HTML
src/ui/footer.js            ← 共用頁尾與版本資訊
src/services/storage.js     ← localStorage 安全封裝
src/services/lazy-modules.js ← 卡拉 OK 時間碼模組延後載入
src/services/support-board.js ← VAWS 交流區（Waline）設定與載入
src/ui/support-chat.js       ← 右下角 VAWS 交流區聊天泡泡
src/support-chat.css        ← 聊天泡泡與 Waline 聊天外觀（不放 layer，才能覆寫 Waline）
package.json                ← Vite 指令與相依套件
package-lock.json           ← 鎖定建置版本
vite.config.ts              ← 相對路徑、靜態資產、Service Worker 與歌曲目錄的建置設定
tsconfig.json               ← TypeScript 型別檢查設定（只檢查 .ts 檔）
.github/workflows/pages.yml  ← GitHub Pages production 部署
.github/workflows/ci.yml     ← Pull request 檢查（型別、測試、建置、空白）
DESIGN.md                   ← 畫面設計原則
sw.js                       ← 管理離線快取
manifest.json               ← App 名稱、圖示與色彩
icon-192.png                ← 主畫面圖示
icon-512.png                ← 啟動畫面／大型圖示
icon-maskable-512.png       ← 可適應圖示
apple-touch-icon.png        ← iPhone 主畫面圖示
images/                     ← 現有圖片資源（海報、台北場舞台／座位配置圖等）
```

原始碼仍使用相對路徑（`./`），因此本地直接以靜態伺服器開啟也能運作。正式部署時使用 Vite 產生
`dist/`，會壓縮 CSS／JavaScript、把每首歌（含讀音）與卡拉 OK 模組各自分檔延後載入，並保留 GitHub Pages 與自訂網域的相對路徑。

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run preview
```

歌曲資料在建置時由 `src/catalogue/` 組裝：`npm run build` 與 `npm test` 會檢查每行日文都有羅馬字、含漢字的行都有假名讀音、羅馬字能對上讀音（卡拉 OK 對齊）、應援時間點對得到歌詞行、歌詞時間遞增、各檔的歌曲 id 一致、讀音表沒有對不到歌詞的舊 key 等規則，違反時會指出歌曲 id、行號與規則名稱。改動歌詞後若 `tests/__snapshots__/song-catalogue.golden.txt` 的行數或讀音行數有預期中的變化，用 `npx vitest run -u` 更新並一起提交。

正式建置會直接輸出首頁 HTML，並讓獨立的完整 CSS 與 HTML 平行載入；互動程式正常啟動，不需要等第一次點擊或捲動才載入。直接開啟 `#/guide`、`#/setlist` 或歌曲連結時，會先隱藏首頁，再顯示指定頁面，避免閃爍與版面跳動。首頁與頁面切換共用 `src/ui/home.js`，請不要另外手寫一份首頁快照。

過去 `public/assets/` 曾手動保留幾版舊首頁引用的雜湊 JavaScript，以免 GitHub Pages 與 CDN 更新 HTML 的時間差內，仍拿到舊首頁的人載入失敗。這些檔案自 v1.10.5 起就沒有再更新，已保護不到任何版本，卻因為 Service Worker 會預先下載 `dist/assets/` 裡的所有 JavaScript 而占了第一次安裝一半的下載量，所以已經移除。現在 Service Worker 的預先下載清單只收本次建置由首頁可達的檔案（首頁引用的程式與 CSS、它們載入的所有分檔、CSS 引用的圖片）；已安裝 Service Worker 的人開啟頁面時先連網、失敗才用快取，CDN 的更新時間差也只有幾分鐘，因此不需要再保留舊檔。

首頁背景使用同尺寸的 `images/poster.webp`；座位配置預覽只在展開卡片後下載。Service Worker 會在頁面載入後準備離線所需的程式、歌詞與讀音分檔，因此只開過首頁也能在快取完成後離線進入歌曲。

介面文字使用台灣常見的裝置內建字體（PingFang TC、Microsoft JhengHei、Noto Sans CJK TC）；日文歌詞另外使用 Noto Sans JP，以避免裝置內建字體缺少日文漢字。

應援動作動畫使用 WebM 優先、動畫 WebP 次之、GIF 最後回退；圖片只會在目前歌詞需要時載入。公告與 VAWS 圖片則在展開對應卡片後才建立，並使用瀏覽器的 lazy loading，避免首頁第一次開啟就下載大型資源。

首頁與應援指南列表右下角有「VAWS 交流區」聊天泡泡，使用自架的 Waline 留言服務，點開泡泡時才載入留言程式；可以傳圖片，照片會先在瀏覽器縮小並去掉拍攝地點資訊，再存到 Cloudflare R2；聊天視窗開著時每 30 秒檢查一次留言數，有新留言才重新載入。歌曲頁與歌單頁不顯示泡泡，避免遮住播放控制。`src/services/support-board.js` 的 `SUPPORT_BOARD_SERVER_URL` 留空時，視窗只顯示「準備中」；後端部署步驟見 [`docs/support-board.md`](docs/support-board.md)。

頁尾的「意見回饋」連到 Google 表單（網址在 `src/data.js` 的 `FEEDBACK_FORM_URL`），可以許願功能、回報問題或附上截圖；表單含檔案上傳題，所以填寫需要登入 Google 帳號。第一次開啟網站會彈出一則公告（內容在 `src/data.js` 的 `ANNOUNCEMENT`，可選的 `image` 放在 `images/notice/`，建議寬度 880px 以內的 WebP），按「知道了」、✕、Esc、點背景或按下主要連結關閉後，會把公告的 `id` 記在 localStorage 的 `horo-announcement-seen`，之後不再自動出現；要再公告一次就改 `id`（localStorage 寫不進去時，至少這次開啟期間不會重彈）。頁尾的「公告」按鈕可以隨時再打開。歌曲頁不會彈出，避免遮住歌詞；開著時切到歌曲頁會先收起、離開歌曲頁後再補彈。更新日誌或公告圖片開著時也不會疊上去。

## 2. 開啟 GitHub Pages

1. 將儲存庫的 **Settings** → **Pages** → **Build and deployment / Source** 設為 **GitHub Actions**。
2. 推送到 `main` 後，`.github/workflows/pages.yml` 會執行 `npm ci`、`npm run build`，再發布 `dist/`。
3. 等待 Actions 完成後，就會產生 `https://帳號.github.io/儲存庫名稱/` 網址。
4. 開啟或更新 pull request 時，`.github/workflows/ci.yml` 會執行 `npm run typecheck`、`npm test`、`npm run build` 與 `git diff --check`，只檢查、不部署。

GitHub Pages 使用 HTTPS 提供網站，因此離線快取功能可以直接運作。

## 3. 開啟與確認

- 用手機開啟網址並等待幾秒，讓快取完成儲存。
- 開啟飛航模式後重新整理；如果歌詞與演出資訊仍能開啟，就代表離線功能成功。
- Android：只在手機上顯示「安裝到主畫面」提示；關閉或完成一次後不再重複顯示。
- iPhone：只在手機瀏覽器提示點擊分享按鈕 → **加入主畫面**；關閉或確認一次後不再重複顯示。桌面版不會顯示安裝提示。

首頁與各頁面上方的「深色模式／淺色模式」按鈕可以切換配色。第一次開啟時會沿用裝置設定；手動選擇後，網站會記住你的選擇。首頁海報在兩種模式下都會維持原本偏暗的氛圍。

歌曲頁面下方的膠囊式導覽列，可以切換上一首、目前歌曲清單與下一首。首頁主按鈕「應援指南・演出順序」會直接開啟依演出順序排列的歌單，沒有任何前置確認畫面；六・日不同的曲目會就地分開標示。歌單整理自粉絲紀錄，非官方資料；台北 10/31、11/01 與東京 09/05、09/06、首爾 09/19、09/20 場順序相同。首頁的「全部歌曲」按鈕則開啟可搜尋、排序的完整歌曲清單，也包含不在歌單內的歌曲。

歌曲頁面的應援動畫（拍手、揮手、跳躍、轉臂與大合唱）會共用目前歌曲的 BPM 拍長，BPM 資料集中在 `src/data.js` 的 `SONG_BPM` 表格中。日文歌詞的漢字會在上方顯示 ruby 假名讀音；下方工具列的「讀音」會依序切換 `假名`、`羅馬字` 與 `假名+羅馬字`，方便同時對照。含大合唱的歌詞行會固定使用金黃色，繁中翻譯則維持一般字幕色。

下方工具列也能分別切換「日文」與「中文」歌詞，兩個設定會保存在瀏覽器中；「簡潔模式」預設仍顯示日文，並保留同一套切換功能。

下方工具列的倍速選單可以直接選擇 `x0.25`、`x0.5`、`x0.75`、`x1`、`x1.25`、`x1.5` 或 `x2`，設定會保存在瀏覽器中；若目前 YouTube 影片不支援某個速度，該選項會停用，並使用影片實際支援的速度。

桌面版 Chrome／Edge 等支援 Document Picture-in-Picture 的瀏覽器，歌曲頁控制列會顯示「PiP」按鈕。開啟後，置頂字幕小窗會顯示目前句與下一句，並跟隨日文／中文、讀音、卡拉 OK、歌詞字級與深淺色設定；播放／暫停仍由主頁的 YouTube 影片控制。

手機（iOS Safari、Android Chrome 等）沒有 Document Picture-in-Picture，同一個按鈕會改用系統的影片子母畫面：字幕畫面以 canvas 畫成和桌面小窗相同的版面（歌名、播放進度、目前句與下一句），再放進系統 PiP 視窗，切到主畫面或其他 App 時仍浮在畫面上；小窗本身沒有按鈕，系統 PiP 的播放／暫停與上一首／下一首會控制主頁影片。小窗開著時，若 YouTube 因為網頁離開畫面而自行暫停，網站會自動恢復播放；自己按暫停（主頁、控制列或 PiP 視窗）則不會被恢復。兩種 PiP 都不支援的瀏覽器不會顯示這個入口，原本的歌曲頁字幕仍可正常使用。

`卡拉OK` 開關可以關閉逐字高亮；關閉後仍保留一般歌詞同步、日文讀音與其他工具列功能，設定同樣會保存。

控制列的 `字` 選單可以調整歌詞字級（小、標準、大、特大、超大），會同時縮放日文、讀音、羅馬字、繁中翻譯與背景合唱，開啟中的 PiP 字幕小窗也會同步套用；切換後目前這一句會重新置中，設定同樣會保存。

開啟歌曲頁時（不論 `卡拉OK` 開關是否開啟），頁面會先用歌曲的 Spotify track ID（`src/song-metadata.js` 的 `spotifyTrackId`）查詢 [Beautiful Lyrics Reborn](https://github.com/yeahnangua/beautiful-lyrics-reborn) 的公開歌詞服務，它會聚合 Musixmatch RichSync、QQ QRC、酷狗 KRC、網易雲 YRC 等來源；沒有 ID 的歌曲會略過這一步。接著 fallback 到 AMLL TTML DB，最後才查 LRCLIB 的 `lyricsfile`／同步 LRC。前四者可提供逐字或逐音節時間；LRCLIB 是逐行時間，因此會在該句範圍內按比例高亮，適合補足前面來源沒有收錄的歌曲。取得後以歌詞文字對齊目前 YouTube 影片。每一行仍以現有手動錨點為準，來源只提供句內節奏，因此不同版本的前奏或分行不會讓整段畫面漂移；最後仍保留原本依句時間估算的 fallback。逐字資料會以 `karaoke-sources.js` 的 `timed-lyrics-v1`（每句 `start`／`end` 加上 `words[]`）作為前端統一格式，不需要改動現有的翻譯、應援標記或手動句錨點。

第一次在線上開啟歌曲時，逐字資料會存入瀏覽器的本機快取；之後即使演出場館沒有網路，已經載入過的歌曲仍可使用真實逐字時間。所有來源都找不到的歌曲會記住 7 天不再重查，Beautiful Lyrics 回應 4xx（429 除外）的歌曲也不會再向它查詢，避免對外部服務重複送出無效請求。網路或伺服器錯誤不會記成找不到，下次開啟時會重試；但 Beautiful Lyrics 逾時、回應 429 或伺服器錯誤後，30 分鐘內所有歌曲都暫停向它查詢。歌詞區下方會顯示來源、對齊行數與影片偏移，方便確認目前是開源逐字資料還是本地估算。

從歌單進入歌曲後返回，會回到原本的捲動位置；歌曲頁的上一首、下一首也會沿用歌單的演出順序。

## 4. 修改內容後重新上傳

修改歌詞或畫面並重新上傳時，請務必提高版本號。版本號只寫在 `package.json`，用 `npm version` 更新（會一併更新 `package-lock.json` 的兩處版本），再在 `CHANGELOG.md` 最上面寫同一個版本的段落：

```sh
npm version patch --no-git-tag-version   # 新功能用 minor
```

`npm run build` 會把 `v` 加上這個版本號寫進三個地方：頁尾與除錯面板顯示的 `BUILD`、`dist/sw.js` 的 `CACHE_VERSION`，以及預先輸出的首頁頁尾，所以 `src/main.js` 與根目錄 `sw.js` 不再寫版本號（`sw.js` 裡只是佔位字串，建置找不到佔位時會直接失敗）。`npm test` 會確認 `CHANGELOG.md` 最新標題、`package.json` 與 `package-lock.json` 的版本一致。

如果版本號沒有變更，Service Worker 會沿用同一個快取名稱，曾經造訪過網站的使用者仍可能看到舊內容。提高版本號後，下一次連線時會下載新檔案，畫面下方也會出現「新版本已準備完成」的提示，方便立即更新。

## 5. 公告文字範例

> 演出場館的行動網路可能不穩定。
> **請在家先開啟一次網站。** 先開啟過一次，到了演出現場即使沒有網路，也能查看歌詞。
> （只有 YouTube 影片需要網路連線。）
