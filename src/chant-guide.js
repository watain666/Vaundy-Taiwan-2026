/*
 * 應援版本資料
 *
 * src/song-lyrics.js 裡的 jp/tag 標記是歌詞與應援資料的共用來源。
 * 日本版則依照 Canva 的「VAUNDY 應援教學」逐曲整理；只存需要
 * 切換的應援行，歌詞本身仍共用 src/song-lyrics.js，避免同步時間與翻譯被改動。
 * 這裡的時間點會在 build 時由 src/catalogue/assemble.ts 對到歌詞行；
 * 對不到任何一行的時間點會讓 build 失敗。
 */

export const CHANT_VERSIONS = {
  jp: {
    label: "日本版",
    source: "日本版應援標記"
  },
  kr: {
    label: "韓國版",
    source: "韓國版應援標記"
  }
};

export const CHANT_REFERENCE_URL = "https://www.canva.com/design/DAGzhwjn1P4/WDMcBwi1A-ZJpX615SFpig/view";

export const DEFAULT_CHANT_VERSION = "jp";

/* 日本版標成「大合唱／跟唱」的歌詞時間點。動作提示仍沿用歌詞內
   的 [clap]、[wave]、[spin] 等標記；這裡只負責兩地不同的 vocal cue。 */
export const JP_CHANT_GUIDES = {
  KaijuNoHanauta: {
    notes: [
      "「もっと」「ねぇ もっと」請大聲喊；「君がいつも」也可以直接指向 Vaundy。",
      "第一段「落ちてく過去は鮮明で……」整段一起唱；後段跟著「眠れない夜に／眠らない夜を／眠くないまだね」這些標色回應詞，結尾第一次「落ちてく過去は鮮明で……」也整段一起唱（第二次不用）。"
    ],
    chantTimes: [46.5, 97.8, 123.6, 126.8, 130.1, 148.4, 175.6, 178.7, 181.9, 188.3, 191.5, 194.7, 200.5, 203.7, 206.9]
  },
  hanaurana: {
    notes: [
      "副歌以雙手高舉、左右揮手為主；開心時可以跳。",
      "這首日本版不要求整段跟唱，拍手與揮手盡情做即可。"
    ],
    chantTimes: [46.9, 53.9, 110.9, 117.9, 162.7, 164.4, 169.8],
    chantSegments: [
      { time: 160.3,   text: "何年経っても妄想が", romaji: "nan nen tatte mo mōsō ga" },
      { time: 163.2,   text: "もうこんなに",       romaji: "mō konnani" },
      { time: 168.1,   text: "花が散るほど",       romaji: "hana ga chiru hodo" }
    ]
  },
  Backlight: {
    notes: [
      "副歌一起大聲唱；最後一段先唱「悪党ぶっ飛ばして」，再唱「悪党ふっ飛ばして」，請特別注意。"
    ],
    chantTimes: [],
    chantSegments: [
      { time: 46.5,  text: "怒りよ今悪党ぶっ飛ばして",   romaji: "ikari yo ima akutō buttobashi te" },
      { time: 53.3,  text: "ないやないやないや",   romaji: "nai ya na iya na iya" },
      { time: 56.6,  text: "ないさないさ",         romaji: "nai sa nai sa" },
      { time: 59.3,    text: "怒りよ今 悪党蹴り飛ばして", romaji: "ikari yo ima akutō keri tobashi te" },
      { time: 66.5,  text: "ないな ないなないな",   romaji: "nai na nai na nai na" },
      { time: 69.9,    text: "ないさないさ",         romaji: "nai sa nai sa" },
      { time: 69.9,    text: "逆光よ",               romaji: "gyakkō yo" },
      { time: 126.1,   text: "怒りよ今悪党ぶっ飛ばして",   romaji: "ikari yo ima akutō buttobashi te" },
      { time: 132.8, text: "ないやないやないや",   romaji: "nai ya na iya na iya" },
      { time: 136,   text: "ないさないさ",         romaji: "nai sa nai sa" },
      { time: 138.8,   text: "怒りよ今 悪党蹴り飛ばして", romaji: "ikari yo ima akutō keri tobashi te" },
      { time: 146,   text: "ないな ないなないな",   romaji: "nai na nai na nai na" },
      { time: 149.4, text: "ないさないさ",         romaji: "nai sa nai sa" },
      { time: 149.4, text: "逆光よ",               romaji: "gyakkō yo" },
      { time: 193.4, text: "怒りよまた悪党ぶっ飛ばして", romaji: "ikari yo mata akutō buttobashi te" },
      { time: 200.6, text: "ないやないやないや",   romaji: "nai ya na iya na iya" },
      { time: 203.9,   text: "ないさないさ",         romaji: "nai sa nai sa" },
      { time: 206.7,   text: "怒りよさぁ 悪党ふっ飛ばして", romaji: "ikari yo sā akutō futtobashi te" },
      { time: 213.9,   text: "ないな ないなないな",   romaji: "nai na nai na nai na" },
      { time: 217.2,   text: "ないさないさ",         romaji: "nai sa nai sa" },
      { time: 217.2,   text: "逆光よ",               romaji: "gyakkō yo" }
    ]
  },
  Tomoshibi: {
    notes: [
      "日本版最重要的兩個應援點是「ねぇ」與「けど まだ」，請大聲喊出來。",
      "拍手跟著鼓聲即可。"
    ],
    chantTimes: [121, 140]
  },
  Jonetsu: {
    notes: [
      "拍手會在 1/2 拍與 1/4 拍之間切換，請跟著鼓點。",
      "最後一段副歌前 Vaundy 喊話時可以一起尖叫，再跟著他搖擺。"
    ],
    chantTimes: []
  },
  Odoriko: {
    notes: [
      "副歌舉起食指逆時針旋轉。",
      "第一段「とぅるるる……」是安靜段落，不用拍手；最後副歌唱完手勢自由。"
    ],
    chantTimes: []
  },
  KoikazeniNosete: {
    notes: [
      "「愛で」與「日々が」請大聲唱出來，三次副歌都一樣。"
    ],
    chantTimes: [],
    chantSegments: [
      { time: 60.7,  text: "愛で",  romaji: "ai de" },
      { time: 68.9,  text: "日々が", romaji: "hibi ga" },
      { time: 77.3,    text: "愛で",  romaji: "ai de" },
      { time: 85.2,    text: "日々が", romaji: "hibi ga" },
      { time: 142.3,   text: "愛で",  romaji: "ai de" },
      { time: 150.3,   text: "日々が", romaji: "hibi ga" },
      { time: 158.7, text: "愛で",  romaji: "ai de" },
      { time: 166.4, text: "日々が", romaji: "hibi ga" },
      { time: 209.3, text: "愛で",  romaji: "ai de" },
      { time: 217.4,   text: "日々が", romaji: "hibi ga" },
      { time: 225.8, text: "愛で",  romaji: "ai de" },
      { time: 233.5, text: "日々が", romaji: "hibi ga" }
    ]
  },
  Homunculus: {
    notes: [
      "開頭與尾段的「Oh-yeah, yeah-yeah-yeah」請盡量吸飽氣唱。",
      "副歌的「ホムンクルス!」最重要；其他「イチ・ニー・サン」等應援能跟上就好。"
    ],
    chantTimes: [8, 27, 59.2, 62.3, 65.5, 71.5, 77.8, 85, 109.4, 112.5, 115.2, 121.7, 128.1, 184.2, 187.6, 190.6, 196.4, 200, 209, 227.5],
    chantSegments: [
      { time: 155, text: "しまうほど",         romaji: "shimau hodo" },
      { time: 161, text: "あなたを",           romaji: "anata o" },
      { time: 161, text: "このままが美しいと", romaji: "kono mama ga utsukushii to" },
      { time: 169.9, text: "言霊をもう一度",     romaji: "kotodama o mōichido" }
    ]
  },
  Tokimeki: {
    notes: [
      "日本版會區分 Uh／Yeah、Da、Na、Tu 等不同應援聲，請跟著各段節奏。",
      "「Tokimekiのせい」很重要；這首歌可以和 Vaundy 一起玩得很 High。"
    ],
    chantTimes: [17.2, 25.1, 32.9, 38, 48.8, 54, 62.7, 89.1, 97.1, 104.8, 110, 120.8, 126, 134.6, 153, 159.5, 161.1, 166, 176.7, 182, 190.6],
    chantSegments: [
      { time: 43.7,    text: "(ないぜ)",   romaji: "(nai ze)" },
      { time: 115.6, text: "(ないぜ)",   romaji: "(nai ze)" },
      { time: 145.1,   text: "(しまうの)", romaji: "(shimau no)" },
      { time: 171.7,   text: "(ないぜ)",   romaji: "(nai ze)" }
    ]
  },
  CHAINSAWBLOOD: {
    notes: [
      "日本版需要跟上的聲音應援很多，B 段先抓準進入時機，後半能整段跟上就很厲害。",
      "✋⬆️ 是高舉雙手的動作；✋⤴️ 是高舉手、手心向前拋。"
    ],
    chantTimes: [32.5, 38, 43.6, 51.4, 57.4, 64.5, 89.5, 94.4, 97.5, 100.8, 104, 107.3, 111, 116.5, 121.9, 129.8, 135.6, 142.8, 162.65, 170.6, 176.7, 183.7]
  },
  Fukakouryoku: {
    notes: [
      "副歌一起唱「Welcome to the dirty night」；第一次「その理由は同じ」也要全場大合唱。",
      "「あれ なに」「それ なに」「愛で」是熟悉 VAWS 應援的人會喊的回應。"
    ],
    chantTimes: [27.7, 54.1, 59.3, 64.4, 69.3, 97.5, 102.6, 107.8, 112.8, 176.6, 181.7, 186.8, 192.1],
    chantSegments: [
      { time: 41.4,  text: "あれ、なに", romaji: "are, nani" },
      { time: 46.5,  text: "それ、なに", romaji: "sore, nani" },
      { time: 84.9,    text: "あれ、なに", romaji: "are, nani" },
      { time: 89.9,  text: "それ、なに", romaji: "sore, nani" },
      { time: 154.8, text: "愛で",       romaji: "ai de" }
    ]
  },
  soramimi: {
    notes: [
      "日本版副歌重點是跟著 Vaundy 一起跳；Distance／This dance? 是跳舞時的口號。"
    ],
    chantTimes: [70.3, 128, 147.8]
  },
  HadakaNoYusha: {
    notes: [
      "兩次「愛して」全場安靜跟唱，只唱這三個字；後面的歌詞不需要整段跟唱。",
      "「それは涙と対になって」與「そこは涙と対になって」請整段一起唱。"
    ],
    chantTimes: [81.9, 93.7],
    chantSegments: [
      { time: 34.4, text: "愛して", romaji: "aishi te" },
      { time: 152.2,  text: "愛して", romaji: "aishi te" }
    ]
  },
  "Iseijin": {
    notes: [
      "第二次 Whoa, whoa, whoa, yeah, yeah 是三次，接著唱 True, true, true。",
      "副歌以「先生」與「全然」交互喊為主。"
    ],
    chantTimes: [14, 35, 115.5, 127, 183, 194.5],
    chantSegments: [
      { time: 47.4,    text: "先生",                  romaji: "sensei" },
      { time: 50.3,  text: "全然",                  romaji: "zenzen" },
      { time: 58.7,    text: "先生",                  romaji: "sensei" },
      { time: 61.5,  text: "全然",                  romaji: "zenzen" },
      { time: 103.9,   text: "先生",                  romaji: "sensei" },
      { time: 106.8, text: "全然",                  romaji: "zenzen" },
      { time: 160.4, text: "先生",                  romaji: "sensei" },
      { time: 163.2,   text: "全然",                  romaji: "zenzen" },
      { time: 171.7, text: "先生",                  romaji: "sensei" },
      { time: 174.4, text: "全然",                  romaji: "zenzen" },
    ]
  },
  ZuttoLoveSong: {
    notes: [
      "副歌可以跟 Vaundy 一樣高舉手比 1。",
      "「あの日から消えない……」有人會跟鼓聲連打兩下，屬於自由選擇。"
    ],
    chantTimes: [54.4, 153.7],
    chantSegments: [
      { time: 63.5,  text: "BGMさ",                    romaji: "BGM sa" },
      { time: 67.6,  text: "キャトルミューティレイション", romaji: "kyatorumyūtireishon" },
      { time: 162.9, text: "BGMさ",                    romaji: "BGM sa" },
      { time: 167,   text: "キャトルミューティレイション", romaji: "kyatorumyūtireishon" }
    ]
  },
  Yobigoe: {
    notes: [
      "依橘色標記跟唱；如果想簡化，只要跟著唱「チェンジ」也可以。"
    ],
    chantTimes: [32.8, 40.7, 52.7, 63.7, 66.7, 77.7, 142.7, 153.7, 166.8, 175, 180.2, 184.5, 186.7, 200.8, 211.7, 218.5],
    chantSegments: [
      { time: 49.3, text: "チェンジ", romaji: "chenji" },
      { time: 139.2, text: "チェンジ", romaji: "chenji" },
      { time: 85,    text: "チェンジ",       romaji: "chenji" },
      { time: 133, text: "チェンジ",       romaji: "chenji" },
      { time: 197.3,   text: "チェンジ",       romaji: "chenji" },
      { time: 212,   text: "どんな夜も Ah~", romaji: "donna yoru mo Ah ~" },
    ]
  },
  TokyoFlash: {
    notes: [
      "副歌以「できてるできてる」「悪くない悪くない」與「何処へ行こう」作為回應，並配合前後揮手。",
      "主歌每行開頭的英文字「STAY」「FAKE」「STAGE」「AGE」一起喊。",
      "中段需要安靜的地方不要拍手。"
    ],
    chantTimes: [26, 37.5, 69, 79, 107, 118, 150, 159.5, 201.5, 211, 221, 230.5],
    chantSegments: [
      { time: 42,    text: "STAY",   romaji: "STAY" },
      { time: 47,    text: "FAKE",   romaji: "FAKE" },
      { time: 52,    text: "STAGE",  romaji: "STAGE" },
      { time: 57,    text: "AGE",    romaji: "AGE" },
      { time: 123,   text: "STAY",   romaji: "STAY" },
      { time: 128,   text: "FAKE",   romaji: "FAKE" },
      { time: 133,   text: "STAGE",  romaji: "STAGE" },
      { time: 137.5, text: "AGE",    romaji: "AGE" }
    ]
  },
  TodomenoIchigeki: {
    notes: [
      "副歌回應從「今日の夜は／今夜だけは」開始，接著唱「祈りあった未来とて」「道が違うのよ」「アナタ」「互いの殺意で」「トドメ」。"
    ],
    chantTimes: [84.7, 87, 94.3, 180.7, 183.1, 190.2, 276.5, 279, 286, 295.5, 298, 305],
    chantSegments: [
      { time: 63.7,  text: "今日の夜は", romaji: "kyō no yoru wa" },
      { time: 73.3,    text: "今夜だけは", romaji: "kon'ya dake wa" },
      { time: 96.7,  text: "トドメ",     romaji: "todome" },
      { time: 159.7, text: "今日の夜は", romaji: "kyō no yoru wa" },
      { time: 169.3,   text: "今夜だけは", romaji: "kon'ya dake wa" },
      { time: 192.6, text: "トドメ",     romaji: "todome" },
      { time: 236.4,   text: "今日の夜は", romaji: "kyō no yoru wa" },
      { time: 246.1,   text: "今夜だけは", romaji: "kon'ya dake wa" },
      { time: 255.8,   text: "今日の夜が", romaji: "kyō no yoru ga" },
      { time: 265.3,   text: "明日の夜も", romaji: "asu no yoru mo" },
      { time: 288.5, text: "トドメ",     romaji: "todome" },
      { time: 307.5, text: "トドメ",     romaji: "todome" }
    ]
  },
  IdeagaAfureteNemurenai: {
    notes: [
      "1:25–1:42 與 3:52–4:10 Vaundy 繼續唱主歌詞，台下跟著背景童聲一起唱「イデアが溢れて眠れない」。",
      "2:39–2:57 與 4:10–4:29 再一起唱「イデアが溢れて眠れない」；其他段落日本版不跟唱。"
    ],
    chantTimes: [158, 250],
    /* 和主唱重疊的背景合唱：start／end 是影片秒數，播放區間和它重疊的
       歌詞行下方會多一列背景合唱，主歌詞本身不標成合唱。讀音沿用
       furigana-corrections.js 以 text 為 key 的對照。 */
    backingChants: [
      { start: 85.5, end: 102, text: "イデアが溢れて眠れない" },
      { start: 232,  end: 250, text: "イデアが溢れて眠れない" }
    ]
  }
};

/* 顯示在應援指南的差異摘要。這些是依 Canva 日本版與目前韓國版
   標記方式整理的使用者提示，不取代演出現場指示。 */
export const CHANT_DIFFERENCES = [
  "整體：日本版把「要跟唱」和「只做動作」分開標示；韓國版的 vocal cue 較密，常把整段副歌或回應片段標成大合唱。",
  "怪獣の花唄：日本版強調「もっと／ねぇ もっと」、可指向 Vaundy 的「君がいつも」，以及第一段「落ちてく過去は鮮明で……」；韓國版則把更多副歌與後段波浪手勢列為跟唱。",
  "花占い：日本版副歌以左右揮手、開心時跳躍為主，跟唱不是必要；韓國版有較明確的「なんて／抱いて／何年経っても」回應段。",
  "逆光：日本版是副歌整體大聲唱，最後特別注意「悪党ふっ飛ばして」；韓國版較偏向「ないや／ないさ／ないな」的分段回應。",
  "灯火／常熱：日本版分別集中在「ねぇ／けど まだ」與鼓點拍手、終段前尖叫；韓國版有更廣的副歌大合唱標記。",
  "踊り子：日本版的核心是食指逆時針旋轉，第一段「とぅるるる」保持安靜；韓國版把較多旋律段落也列入大合唱。",
  "恋風邪にのせて：兩版都重視「愛で／日々が」，是差異最小的歌曲之一。",
  "ホムンクルス／Tokimeki：日本版更強調固定口號的順序（「ホムンクルス!」、Uh／Yeah、Da、Na、Tokimekiのせい）；韓國版則有較多 Hu／DA 與整段揮手標記。",
  "CHAINSAW BLOOD／不可幸力：日本版更細分手勢與回應進場時機；不可幸力的「Welcome to the dirty night」以及「愛で」尤其要跟上。",
  "soramimi／裸の勇者：日本版分別以跟著跳舞、以及安靜唱兩次「愛して」為主；韓國版大合唱範圍較廣。",
  "偉生人／ずっとラブソング：日本版有明確的「Whoa → True, true, true」與食指比 1；韓國版對應的口號和揮手行較多。",
  "イデアが溢れて眠れない：日本版只跟唱 1:25–1:42、3:52–4:10 的背景童聲，與 2:39–2:57、4:10–4:29 的「イデアが溢れて眠れない」；韓國版把各段副歌都標成大合唱。",
  "呼び声／東京フラッシュ／トドメの一撃：日本版允許簡化（只唱「チェンジ」）或依副歌回應詞跟唱；韓國版則多以完整副歌行與固定揮手段落標記。"
];
