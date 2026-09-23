const a=`# CHANGELOG

本檔案依 Git 歷史整理，使用版本提交作為每一段的邊界。

## **v1.10.2**

- [PR #5](https://github.com/watain666/Vaundy-Taiwan-2026/pull/5)：建置時僅內嵌首頁首次繪製所需的樣式，讓完整樣式表在背景下載，並於首次操作時套用，改善手機版首次載入效能。
- [PR #5](https://github.com/watain666/Vaundy-Taiwan-2026/pull/5)：直接開啟指南、劇透歌單或歌曲時，待完整樣式就緒後再顯示；將首頁海報納入 Service Worker 離線預快取。
- 感謝 [@watain666](https://github.com/watain666) 提供 [PR #5](https://github.com/watain666/Vaundy-Taiwan-2026/pull/5)，改善首頁載入體驗。

## [**v1.10.1**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/fdbc0eca3e2442c39c6450e36048c803f3241dac)

- [commit bff0cd7](https://github.com/watain666/Vaundy-Taiwan-2026/commit/bff0cd744d5f2f1af4cf36b64fef026c623e5295)：將首頁 CSS 從 HTML 內嵌樣式改為獨立雜湊資產，縮小首頁文件並讓樣式與 HTML 平行載入；Service Worker 也納入該資產的離線預快取。

## [**v1.10.0**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/12e3b27496f5f8bb47a16648fbfba973d502f2bd)

- [commit 602ef37](https://github.com/watain666/Vaundy-Taiwan-2026/commit/602ef37a8fb6a1a62981879c877b117da569595d)：改版首頁資訊區與頁尾，將首頁改為建置時預先輸出並內嵌壓縮 CSS；海報轉為 WebP、座位圖延後至展開卡片後載入，並補齊 Service Worker 對分檔資源的離線預快取。
- [commit 772be72](https://github.com/watain666/Vaundy-Taiwan-2026/commit/772be726aec60ee59da36ed91dccb5bed44a52f5)：收合中的首頁資訊卡改為首次展開時才建立內容，並延後交通卡片的地址複製事件綁定，減少首頁初始 DOM 與初始化工作。

## [**v1.9.4**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/8c5f1ce23de5a018a8b42eb68a6eaff61a769eab)

- 延後指南首屏的完整 CSS、日文字型、歌詞與 YouTube 等非必要資源，保留首次互動後的搜尋、歌曲頁與同步功能。
- 修正首屏圖示 sprite、圖例換行與圖片尺寸造成的版面位移，並改善頁尾對比度、觸控尺寸與空通知按鈕的無障礙狀態。
- 補上 production 的 canonical、\`robots.txt\` 與 \`sitemap.xml\`，同步整理 Vite 靜態資產與 Service Worker 快取版本。

## [**v1.9.3**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/6609b00c88403fb27d6746ed5d15144ff7967468)

- 修正桌面 Document Picture-in-Picture 的逐字 Karaoke 與應援動作圖示在同步更新時反覆重建，避免動畫抽蓄、過快重播或卡住。
- 保留字幕浮窗既有 DOM，只更新目前高亮與進度狀態，讓 PiP 的同步動畫更穩定。

## [**v1.9.2**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/cb06ce871a16557f3cc10ed4b70eb2c4ad98fc4d)

- 修正全 36 首歌曲、1419 行歌詞的卡拉 OK 同步，統一以日文逐字時間作為假名與羅馬字的共同基準。
- 修正 \`satotte\` 等促音、長音、拗音、macron 與英文／數字混排的羅馬字映射，保留自然羅馬字單字顯示，非標點單位皆有有效時間。
- 新增全曲逐行對齊檢查，並保留〈再会〉的 \`夏＝ここ／koko\` 讀音。

## [**v1.9.1**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/d6fe90143815f4534fbfa24e8832aee4a1741196)

- [PR #3](https://github.com/watain666/Vaundy-Taiwan-2026/pull/3)：依 UtaTen 歌詞逐行校對並修正 34 首歌曲的日文 ruby 讀音與羅馬字，保留應援標記、斷行與上下文讀法。
- [PR #3](https://github.com/watain666/Vaundy-Taiwan-2026/pull/3)：補齊〈心動〉、〈怪獣の花唄〉、〈恋風邪にのせて〉、〈踊り子〉、〈裸の勇者〉、〈不可幸力〉、〈再会〉、〈花占い〉、〈呼び声〉等歌曲的讀音資料。
- [PR #3](https://github.com/watain666/Vaundy-Taiwan-2026/pull/3)：為異讀、當て字、數字量詞與英文混合歌詞加入逐行例外處理，讓日文、ruby 與羅馬字在歌詞及應援顯示中保持一致。
- 感謝 [@narihira2000](https://github.com/narihira2000) 提供 [PR #3](https://github.com/watain666/Vaundy-Taiwan-2026/pull/3)，協助校對並補齊多首歌曲的 ruby 與羅馬字。

## [**v1.9.0**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/a619bc61c714e82eadc96bcbed7bed4bd090bb01)

- 新增桌面版 Document Picture-in-Picture 字幕浮窗，顯示目前句與下一句，並沿用日文、假名／羅馬字、繁中翻譯、ruby 讀音、應援標色與逐字 Karaoke 高亮。
- 字幕浮窗會跟隨播放、暫停、seek、換歌、倍速、顯示設定與深淺色主題，提供播放／暫停、返回主頁與關閉控制；僅在支援 Document PiP 的桌面瀏覽器顯示入口。

## [**v1.8.30**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/b109a718476b8583e3498d54c14c8c5855973a55)

- 拆分〈不可幸力〉第二段副歌的「あれ、なに」與「それ、なに」為兩個歌詞段落，並同步更新日本版合唱時間、假名與羅馬字，讓應援提示與演唱節奏一致。

## [**v1.8.29**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/3dd6f153ab539484e0f2e9fc95483ed196b2ba3e)

- [PR #2](https://github.com/watain666/Vaundy-Taiwan-2026/pull/2)：修正〈不可幸力〉、〈恋風邪にのせて〉等歌曲的過長歌詞分段，補齊對應的假名、羅馬字與應援區段。
- [PR #2](https://github.com/watain666/Vaundy-Taiwan-2026/pull/2)：移除舊韓文歌詞提示，將合唱與拍手等應援 \`tag\` 統一交由日文歌詞分段承載，並補齊原本缺少 \`jp\` 的提示行。
- [PR #2](https://github.com/watain666/Vaundy-Taiwan-2026/pull/2)：更新應援判斷、歌曲標記與歌詞讀音邏輯，避免再依賴已移除的 \`ko\` 歌詞資料。
- 感謝 [@wunyee](https://github.com/wunyee) 提供 [PR #2](https://github.com/watain666/Vaundy-Taiwan-2026/pull/2)，協助將應援歌詞分段與標色修正為只標示實際應援文字。

## [**v1.8.25**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/84025c84a1c31f6eff44c3151f41772ef37f2c6f) - [**v1.8.28**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/dcba472ce471bbe82d64c0b5077f6cb5917ff057)

- 調整手機版歌曲工具列的倍速與讀音控制寬度、字級和間距，讓控制項在小螢幕上更容易操作。
- 在頁尾加入「更新日誌」，以彈出視窗顯示本檔案內容；支援關閉按鈕、背景點擊、Esc 鍵與鍵盤焦點返回。
- 讓更新日誌視窗跟隨網站的深色／淺色主題，並縮小視窗尺寸、改善手機版的閱讀高度與間距。
- 調整手機版頁尾的專案連結排列，保留 GitHub 專案與原始 Seoul 指南的來源資訊。
- 新增較慢的歌曲播放倍速 \`x0.25\`、\`x0.5\`、\`x0.75\`；設定會保存，並依目前 YouTube 影片實際支援的倍速停用不適用選項。

## [**v1.8.20**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/84e01a8351d0e44600b182dbf127516c0af83a9c) - [**v1.8.24**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/b5df23c1f2766c8cb07af375e089d89a4a11f531)

- 新增歌曲播放倍速控制，支援 \`x1\`、\`x1.25\`、\`x1.5\`、\`x2\`，並保存使用者選擇；切換歌曲時會依 YouTube 實際支援的倍速恢復設定，同步調整 BPM 應援動畫。
- 移除不穩定的 \`x1.1\` 選項，停用目前影片不支援的倍速，並修正倍速控制的狀態與無障礙標籤。
- 為手機版歌曲工具列提供更短的「應援」、「日／中」、「卡拉」與「同步」標籤，以及「假／羅／假+羅」讀音縮寫，避免控制項擁擠。
- 調整手機版讀音控制的寬度、間距與倍速選單字體，讓小螢幕上的歌曲控制更容易辨識與操作。

## [**v1.8.15**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/8df2f425ce121d2edaffb4d08d7541ef790423ed) - [**v1.8.19**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/60f21277ea694244c43745b57d7949e6b6dc26af)

- 支援手機橫向分割畫面，並讓歌曲頁的「簡潔模式」（隱藏影片畫面、保留聲音與歌詞）在橫向版面使用完整寬度。
- 修正同步歌詞提示文字的對齊，完成羅馬字對照與歌詞映射稽核。
- 新增 LRCLIB \`lyricsfile\`／同步 LRC 的逐行時間來源；卡拉 OK 會在既有逐字來源與 AMLL TTML DB 無結果時繼續 fallback。
- 依來源實際提供逐字或逐行時間顯示狀態，並改善來源名稱、對齊行數、影片偏移與本機快取的提示。

## [**v1.7.5**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/115ecd78b3330a3f1331a0caf120b1e905f7cc66) - [**v1.8.14**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/ffd4e397bbfa4a2d9849ee3a2d211d1913011871)

- 新增日本版／韓國版應援切換，提供逐曲應援說明、差異摘要、Canva 參考來源與記憶使用者選擇。
- 移除容易混淆的韓國歌詞提示，將日本版的跟唱、動作與口號分開標示。
- 將日文應援片段拆到正確的歌詞區段，只為實際應援文字套用顏色，並修正〈Tokimeki〉、日文 motto 與其他歌曲的時間點和分段。
- 加入可收合的日文應援筆記，保留歌曲切換後的設定，並修正應援旗標、圖示顏色、行數與段數顯示。
- 更新劇透歌單的安全返回與查看模式文字，修正服務工作者在發佈後的快取更新。

## [**v1.6.19**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/1479630c5caf6ba1de149bcfb679a21ef19759d6) - [**v1.7.2**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/ffaefea4fac2c2e10669ca0cb6a492149989d8ff)

- 將介面字體改為台灣常見的系統字體，移除不必要的 Pretendard 字體檔，並在中日文與英數字之間補上顯示用半形空白。
- 將應援動作圖片改為 WebM 優先、動畫 WebP 次之、GIF 最後回退，並延後載入公告、VAWS 圖片與歌曲應援素材，減少首次開啟的下載量。
- 修正只有拍手／揮手提示的歌詞資料列不應搶走目前演唱歌詞的同步邏輯。
- 補上韓國原作者致謝，更新台灣場地圖與手機版頁尾排列，並同步 PWA 的版本與離線快取標記。

## [**v1.6.6**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/8973b38ec0fe2611fbb3fbb46b370cc06c744b4a) - [**v1.6.16**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/e0c6e9137424a91c424e48804dcd7632bc1aa126)

- 在頁尾補上原始專案、翻譯作者與回饋入口，統一歌曲資訊與卡拉 OK 說明提示，並修正台灣應援指南的標示。
- 更新主題控制與日文讀音介面，整理假名、羅馬字與合併讀音的文字；抽出可重複使用的歌詞翻譯來源資料。
- 改用日文字型顯示歌曲標題，修正回饋連結、卡拉 OK 陰影與自動捲動控制的樣式。
- 加入場館檢視參考連結，並改善手機版座位連結、Jonetsu 翻譯資料與頁尾連結的排列。

## [**v1.6.1**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/08b17fa5ff4050e702ce88a83053af79f618890e) - [**v1.6.5**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/e3998c87b399a224d051dae01fdf6f3c0a5cf126)

- 縮短歌詞同步提示，將卡拉 OK 來源狀態移入影片資訊區，並穩定 YouTube 播放器的開啟與狀態顯示。
- 修正並替換〈怪獣の花唄〉的中文歌詞翻譯。
- 使用上一首／下一首的曲目圖示改善歌曲導覽。
- 在頁尾加入中文歌詞翻譯來源與作者連結，並調整手機版翻譯署名、頁尾連結與簡潔模式播放控制的排版。

## [**cccc899**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/cccc89922ebdbb10afe57cd16e843cf1e3e0d2a8) - [**v1.6.0**](https://github.com/watain666/Vaundy-Taiwan-2026/commit/9ff8bd36561f08e8564053ef1b3965073c6f33f7)

- 將介面、PWA metadata、公告與演出資訊轉為繁體中文，並將指南從首爾場調整為台北場。
- 加入台北場座位圖，將東京／首爾歌單明確標示為非官方參考。
- 讓拍手、揮手等應援動畫依歌曲 BPM 同步，並修正歌詞圖示的動畫相位。
- 加入日文歌詞的假名 ruby、假名／羅馬字切換，以及日文與繁中歌詞的顯示切換。
- 加入卡拉 OK 逐字進度、可關閉逐字高亮的開關、開源計時歌詞來源與羅馬字模式同步修正。
- 將專案改為 Vite 靜態 PWA，拆分資料、樣式、圖示、儲存與延後載入模組，並建立 GitHub Pages 部署流程。
`;export{a as default};
