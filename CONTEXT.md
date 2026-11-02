# Vaundy 台北場應援指南

為 Vaundy「HORO」台北場歌迷整理的繁體中文應援指南：每首歌的日文歌詞、讀音、繁中翻譯與應援標記，跟著 YouTube 影片同步顯示。

## 歌曲資料

**歌曲目錄**（catalogue）:
所有歌曲的唯一來源，由 authoring 檔在建置時組裝並驗證而成；頁面只透過它取得歌曲。
_Avoid_: 歌曲資料庫、SONGS 陣列

**歌曲摘要**（`SongSummary`）:
歌單需要的一首歌的資料：id、序號、標題、日文原題、影片與 Spotify id、譯者署名、BPM 與 marks，不含歌詞。
_Avoid_: metadata、歌曲 meta

**歌曲**（`Song`）:
歌曲摘要加上完整歌詞行與應援說明，開啟歌曲頁時才載入。
_Avoid_: fullSong、合併後的歌

**歌曲 id**（`SongId`）:
一首歌在網址、本機快取與所有 authoring 檔中的識別字串，原樣保留其中的空白與標點。
_Avoid_: slug、key

**序號**（`number`）:
歌曲在歌曲清單檔中的順序（從 1 起算），不隨排序方式改變。
_Avoid_: 編號、index

**歌詞行**（`LyricLine`）:
歌曲中有一個開始時間的一行歌詞，帶日文原文、繁中翻譯，以及已接上的讀音、羅馬字與應援標記。
_Avoid_: lyric、line object

**分段**（`jpSegments` / `trSegments`）:
一行歌詞依應援範圍切開的片段，只用來標色；整行文字仍是查表與顯示的依據。
_Avoid_: 斷句

## 讀音

**讀音**（`reading`）:
一行日文的假名 ruby 標記，已套用修正。
_Avoid_: 注音、furigana（指讀音時）

**羅馬字**（`romaji`）:
一行日文的拉丁字母讀法，已套用修正。
_Avoid_: 羅馬拼音、拼音

**讀音表**:
以整行日文原文為 key 的讀音與羅馬字基底表。
_Avoid_: 字典、對照表

**修正**（corrections）:
蓋過讀音表同一 key 的人工校正讀音或羅馬字。
_Avoid_: patch、override 表

**死 key**:
讀音表或修正中對不到任何現存歌詞行、分段或背景合唱文字的 key。
_Avoid_: 孤兒 key、殘留讀音

## 應援

**應援版本**（chant version）:
一套應援規則：日本版依應援指南的時間點標示，韓國版依歌詞內的標記標示。
_Avoid_: 應援模式

**應援指南**（chant guide）:
日本版應援的 authoring 資料：應援說明、應援時間點、應援分段與背景合唱。
_Avoid_: Canva 表、JP 指南

**應援標記**（`line.chant`）:
接到一行歌詞上的應援資訊：日本版整行或分段應援、韓國版應援、與這行重疊的背景合唱。
_Avoid_: chant flag、應援 tag

**背景合唱**（backing chant）:
主唱唱主歌詞時台下同時唱的另一句，以開始與結束時間標示，會出現在所有重疊的歌詞行下方。
_Avoid_: 和聲、副歌詞

**marks**:
歌單上每首歌的應援徽章：兩個應援版本的大合唱行數，以及有無拍手、揮手、跳躍、轉臂，由歌詞與應援指南推導。
_Avoid_: 徽章表、SONG_MARKS

## 歌詞 view

**歌詞 view**（lyric view）:
歌詞列表的唯一實作（`src/lyric-view/`）：由一首歌與 view 選項畫出歌詞行，並在播放中更新目前句、可見範圍與逐字高亮；歌曲頁與 PiP 都用它。
_Avoid_: 鏡射、clone、listMarkup

**mount**:
歌詞 view 在一個容器上的實例；歌曲頁與 PiP 各建一個，只透過它的 `render`、`setPlayhead` 等方法改歌詞行。
_Avoid_: 副本、鏡射列表

**view 選項**:
會改變歌詞行 markup 的設定：讀音模式（假名、羅馬字、兩者）與應援版本；逐字時間與分配器只改行內的時間屬性。
_Avoid_: 顯示模式、render 參數

**播放位置**（playhead）:
目前行索引、播放秒數與卡拉 OK 是否開啟；每個 tick 由頁面腳本算一次，同樣的值送給每個 mount。
_Avoid_: currentMarkup、目前行 HTML

**容器設定**:
不進歌詞行、只變成歌詞容器 class 的顯示設定：顯示日文、顯示中文、卡拉 OK、只練合唱與讀音模式「兩者」；由同一個函式推導，兩個 mount 的容器共用。
_Avoid_: 鏡射 class、pageClasses

## 建置

**authoring 檔**:
人工維護、作為歌曲目錄輸入的六個檔案：歌曲清單、歌詞、應援指南、讀音表、修正、演出資料（BPM 與歌單）。
_Avoid_: 原始資料、data 檔

**產物**:
建置時由歌曲目錄產生、不提交進 repo 的模組：歌曲摘要清單與每首歌一個分檔；golden snapshot 是唯一提交的產物。
_Avoid_: generated 檔、輸出
