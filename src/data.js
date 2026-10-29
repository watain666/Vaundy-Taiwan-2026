/* 공연 당일 타임라인 — 그날이 되면 홈 화면 위쪽에 자동으로 나타납니다.
   (시각은 예매처 입장 안내 기준. 바꾸려면 이 표만 고치면 됩니다) */
export const SHOW_TIMELINE = {
  "2026-10-31": [
    { t:"11:00", label:"紀念拍貼機開始整隊" },
    { t:"11:30", label:"周邊整理券・拍貼機號碼牌發放" },
    { t:"12:00", label:"實名驗證・周邊販售・VAWS 攤位開放" },
    { t:"16:30", label:"搖滾區整隊（依票面序號）" },
    { t:"17:30", label:"開場・開始入場" },
    { t:"19:00", label:"正式演出開始" },
    { t:"21:00", label:"預計演出結束（以現場為準）" }
  ],
  "2026-11-01": [
    { t:"11:00", label:"紀念拍貼機開始整隊" },
    { t:"11:30", label:"周邊整理券・拍貼機號碼牌發放" },
    { t:"12:00", label:"實名驗證・周邊販售・VAWS 攤位開放" },
    { t:"16:30", label:"搖滾區整隊（依票面序號）" },
    { t:"17:30", label:"開場・開始入場" },
    { t:"19:00", label:"正式演出開始" },
    { t:"21:00", label:"預計演出結束（以現場為準）" }
  ]
};

/* 공연 일정 — 카운트다운이 이 순서대로 자동으로 따라갑니다.
   start ~ end 사이에는 "NOW / ON AIR", 그 사이 기간에는 다음 공연까지 카운트,
   마지막 end 가 지나면 "END" 로 바뀝니다. */
export const SHOW_SCHEDULE = [
  { start:"2026-10-31T19:00:00+08:00", end:"2026-10-31T21:30:00+08:00" },  // 10/31（六）
  { start:"2026-11-01T19:00:00+08:00", end:"2026-11-01T21:30:00+08:00" }   // 11/1（日）
];
/* ─────────────────────────────────────────────────────────────
   ★ 공지 · 안내 이미지 — 파일 이름만 적으면 됩니다
   ─────────────────────────────────────────────────────────────
   · 이미지는  images/notice/  폴더에 넣어 주세요.
   · 파일이 없는 줄은 화면에서 조용히 빠집니다. (깨지지 않아요)
   · 보여 줄 순서를 바꾸려면 아래 줄 순서를 바꾸면 됩니다.
   · 새 공지가 나오면 한 줄만 더 적으면 됩니다.
   ───────────────────────────────────────────────────────────── */
export const NOTICES = [
  { src:"./images/notice/taipei-venue-guide.webp", thumb:"./images/notice/taipei-venue-guide-preview.webp", title:"台北場現場配置與時間表", width:1638, height:2048 },
];

/* VAWS 회원 티켓 카드 카드 안에서 보여 줄 사진 — 같은 images/notice/ 폴더를 씁니다 */
export const VAWS_PICS = [
  { src:"./images/notice/vaws-ticket-card-taipei.webp", title:"台北場公演別原創票卡（SAMPLE・左 10/31、右 11/1）", width:2000, height:1170 },
  { src:"./images/notice/vaws-ar-camera.webp", title:"會場限定 AR 相機說明", width:842, height:1191 },
];

export const PICS = {
  /*
     video = WebM（現代瀏覽器優先使用）
     src   = 動畫 WebP（不能播放 WebM 時使用）
     fallback = 舊瀏覽器最後回退到 GIF
  */
  "wave_jump":  { video: "./images/tips/wave_jump.webm",  src: "./images/tips/wave_jump.webp",  fallback: "./images/tips/wave_jump.gif",  caption: "jump" },
  "wave_chain":  { video: "./images/tips/wave_chain.webm",  src: "./images/tips/wave_chain.webp",  fallback: "./images/tips/wave_chain.gif",  caption: "跟著 Hu Hu Hu Hu" },
  "wave_dada":  { video: "./images/tips/wave_dada.webm",  src: "./images/tips/wave_dada.webp",  fallback: "./images/tips/wave_dada.gif",  caption: "跟著 DA-DADADADA" },
  "wave_turn":  { video: "./images/tips/wave_turn.webm",  src: "./images/tips/wave_turn.webp",  fallback: "./images/tips/wave_turn.gif",  caption: "旋轉雙手" },
  "wave_rl":  { video: "./images/tips/wave_rl.webm",  src: "./images/tips/wave_rl.webp",  fallback: "./images/tips/wave_rl.gif",  caption: "向左右大幅揮動" },
  "wave-basic":  { video: "./images/tips/wave-basic.webm",  src: "./images/tips/wave-basic.webp",  fallback: "./images/tips/wave-basic.gif",  caption: "雙手舉過頭頂・向左右大幅揮動" },
  "wave-slow":   { src: "./images/tips/wave-slow.gif",   caption: "單手慢慢揮動" },
  "clap-basic":  { src: "./images/tips/clap-basic.gif",  caption: "在頭頂上方拍手" },
  "jump":        { src: "./images/tips/jump.gif",        caption: "跳起來！" },
  /* ↓ 여기에 계속 추가하세요
  "이름":        { src: "./images/tips/파일이름.gif",     caption: "설명" },
  */
};

export { SONGS } from "./song-metadata.js";

/*
 * 歌曲 BPM（公開資料整理，單位：每分鐘拍數）。
 * 這裡集中管理，之後若要校正現場聽感，只需調整對應數值。
 */
export const SONG_BPM = Object.freeze({
  Tokimeki: 120,
  KaijuNoHanauta: 75,
  CHAINSAWBLOOD: 147,
  KoikazeniNosete: 118,
  Odoriko: 157,
  HadakaNoYusha: 163,
  Fukakouryoku: 94,
  Reunion: 150,
  hanaurana: 135,
  Yobigoe: 120,
  Tomoshibi: 110,
  "HowdoIknow'": 162,
  "Shiwaawase'": 160,
  Homunculus: 153,
  soramimi: 130,
  TokyoFlash: 98,
  NakiJizo: 120,
  napori: 130,
  Backlight: 145,
  NEOJAPAN: 176,
  ZuttoLoveSong: 145,
  "Iseijin'": 170,
  ZERO: 105,
  "SonnaBitternaHanashi)": 178,
  Fujin: 97,
  Jonetsu: 155,
  Kagero: 100,
  IdeagaAfureteNemurenai: 105,
  flyaway: 142,
  mabuta: 115,
  Hitomibore: 110,
  SekainoHimitsu: 160,
  Wasuremono: 105,
  Timeparadox: 82,
  TodomenoIchigeki: 100,
  " Kimagure": 178,
});
/* ── 東京/首爾歌單 ─────────────────────────────────────────
   東京 2026.09.05（六）・09.06（日）、首爾 2026.09.19（六）・09.20（日）。
   首爾場順序與東京場相同，仍僅供台北場演出前參考；實際順序以官方公告為準。
   id 必須對應上方 SONGS，才能連到歌曲頁。 */
export const SETLIST_TOKYO = {
  label: "東京/首爾",
  dates: "東京 09.05・09.06｜首爾 09.19・09.20",
  items: [
    { n:1,  songs:[{ id:"NakiJizo" }] },
    { n:2,  songs:[{ id:"Homunculus" }] },
    { n:3,  songs:[{ id:"HadakaNoYusha" }] },
    { n:4,  songs:[{ id:"Reunion", day:"六" }, { id:"Backlight", day:"日" }] },
    { n:5,  songs:[{ id:"Fukakouryoku" }] },
    { n:6,  songs:[{ id:"Fujin" }] },
    { n:7,  songs:[{ id:"SonnaBitternaHanashi)" }] },
    { n:8,  songs:[{ id:"KoikazeniNosete" }] },
    { n:9,  songs:[{ id:" Kimagure" }] },
    { n:10, songs:[{ id:"napori" }] },
    { n:11, songs:[{ id:"Timeparadox" }] },
    { n:12, songs:[{ id:"Shiwaawase'" }] },
    { n:13, songs:[{ id:"TokyoFlash" }] },
    { n:14, songs:[{ id:"TodomenoIchigeki" }] },
    { n:15, songs:[{ id:"IdeagaAfureteNemurenai" }] },
    { n:16, songs:[{ id:"Yobigoe" }] },
    { n:17, songs:[{ id:"flyaway" }] },
    { n:18, songs:[{ id:"soramimi" }] },
    { n:19, songs:[{ id:"CHAINSAWBLOOD" }] },
    { n:20, songs:[{ id:"Tokimeki", day:"六" }, { id:"hanaurana", day:"日" }] },
    { n:21, songs:[{ id:"KaijuNoHanauta" }] },
    { n:22, songs:[{ id:"Odoriko" }] },
  ],
};
/* ── 舊互動座位資料（目前不渲染） ──────────────────────────────
   座位卡目前直接顯示台北場官方舞台／座位配置圖，避免把這組舊 SVG
   區域資料誤當成最新官方配置。 */
export const SEAT_VIEW = { w: 630, h: 421, cx: 315, cy: 210 };

/* 각 구역의 실제 도형.
   [구역이름, 등급, 글자 x, 글자 y, "꼭짓점 x,y x,y …"]
   예매처 좌석배치도에서 구역별 윤곽을 그대로 옮겨 온 좌표라
   모양·비율이 실제 배치도와 같다. 배치가 바뀌면 이 표만 고치면 된다. */
export const SEAT_BLOCKS = [
  ["A","floor",184,178,"153,119 213,119 213,154 275,205 258,223 140,223 121,204 121,150"],
  ["B","floor",269,149,"220,119 311,119 311,169 280,199 220,150"],
  ["C","floor",360,149,"319,119 410,119 410,149 349,199 319,169"],
  ["D","floor",445,178,"417,119 477,119 508,149 509,204 490,223 371,223 355,205 417,154"],
  ["E","floor",184,280,"140,235 258,235 275,254 213,304 212,340 154,340 121,308 121,254"],
  ["F","floor",269,308,"279,260 283,261 311,289 311,339 220,340 220,309"],
  ["G","floor",360,309,"348,260 355,263 410,309 410,340 319,340 319,289"],
  ["H","floor",445,280,"372,235 490,235 509,254 509,308 476,340 418,340 417,304 355,254"],

  ["201","r",482,404,"456,386 495,386 519,421 456,421"],
  ["202","r",408,398,"363,386 454,386 454,410 363,411"],
  ["203","r",315,398,"270,386 360,386 360,411 270,411"],
  ["204","r",221,398,"177,386 267,386 267,411 177,411"],
  ["205","r",147,404,"135,386 174,386 174,421 111,421"],
  ["206","r",89,370,"73,328 132,385 111,416 44,350"],
  ["207","r",54,300,"39,262 72,262 72,327 41,349 38,348"],
  ["208","r",55,229,"39,200 72,200 72,259 39,259"],
  ["209","r",54,158,"39,110 72,132 72,197 39,197"],
  ["210","r",89,87,"109,42 115,47 132,74 73,130 44,108"],
  ["211","r",147,52,"111,37 174,37 174,72 135,72"],
  ["212","r",221,58,"177,46 267,46 267,72 176,72"],
  ["213","r",314,58,"270,46 360,46 360,72 270,72"],
  ["214","r",408,58,"363,46 453,46 454,71 363,72"],
  ["215","r",482,52,"456,37 519,38 495,72 456,72"],
  ["216","r",540,87,"519,42 586,108 557,130 498,74"],
  ["217","r",575,158,"589,110 591,110 591,197 558,197 558,132"],
  ["218","r",574,229,"558,200 591,200 591,259 558,259"],
  ["219","r",575,300,"558,262 591,262 591,349 558,327"],
  ["220","r",539,370,"555,328 586,350 519,416 498,385"],

  ["308","s",15,229,"0,178 15,178 16,200 36,200 36,259 15,259 14,281 0,281"],
  ["309","s",16,128,"13,70 23,79 14,92 35,108 35,172 0,172 0,85"],
  ["310","s",56,55,"65,17 95,47 47,94 18,64"],
  ["311","s",125,14,"83,0 174,0 174,14 158,14 158,35 109,35 93,12 82,22 71,13"],
  ["312","s",216,16,"176,0 267,0 267,14 250,14 251,35 176,35"],
  ["313","s",315,17,"269,0 361,0 361,35 269,35"],
  ["314","s",413,16,"363,0 454,0 454,35 379,35 379,14 363,14"],
  ["315","s",504,14,"456,0 547,0 559,13 548,22 537,12 520,35 472,35 472,14 456,14"],
  ["316","s",573,55,"563,17 612,64 583,94 535,47"],
  ["317","s",613,128,"616,70 630,85 630,172 595,172 595,108 616,92 607,80"],
  ["318","s",614,229,"615,178 630,178 630,281 615,280 614,258 594,259 594,200 614,200"],
  ["319","s",613,330,"595,287 630,287 630,374 617,389 607,380 617,367 595,351"],
  ["320","s",585,389,"581,365 584,365 612,393 590,416 561,388 561,385"],

  /* 휠체어석 — 2층 네 모서리의 얇은 띠 (누를 수 없는 표시용) */
  ["W1","w",0,0,"107,38 110,42 47,106 40,107"],
  ["W2","w",0,0,"522,38 590,107 586,108 580,103 574,94 553,75 554,73 551,73 520,42"],
  ["W3","w",0,0,"42,350 110,416 108,420 40,353"],
  ["W4","w",0,0,"587,350 590,353 522,420 520,416"],

  ["STAGE","stage",314,229,"314,180 364,228 364,231 316,279 265,230"],
].map(a => ({ id: a[0], grade: a[1], x: a[2], y: a[3], pts: a[4] }));

export const SEAT_GRADE = {
  floor: { label: "Floor 站席",     cls: "floor" },
  r:     { label: "R席・2樓指定席",  cls: "r" },
  s:     { label: "S席・3樓指定席",  cls: "s" }
};

export const SEAT_HINT = "點選區域，查看座位等級與它在配置圖上的位置。";
export const SEAT_DIRS = ["上方","右上方","右側","右下方","下方","左下方","左側","左上方"];
/* 플로어 구역별 스탠딩 대기장소 (공연장 맵 기준) */
export const FLOOR_WAIT = { A:"西側", B:"西側", E:"西側", F:"西側",
                     C:"北側", D:"北側", G:"北側", H:"北側" };
