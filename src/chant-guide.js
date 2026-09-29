/*
 * 應援版本資料
 *
 * data.js 裡的 jp/tag 標記是歌詞與應援資料的共用來源。
 * 日本版則依照 Canva 的「VAUNDY 應援教學」逐曲整理；只存需要
 * 切換的應援行，歌詞本身仍共用 data.js，避免同步時間與翻譯被改動。
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
      "第一段「落ちてく過去は鮮明で……」整段一起唱；後段只跟著「眠れない夜に／眠らない夜を／眠くないまだね」這些標色回應詞。"
    ],
    chantTimes: [46.5, 58.5, 97.5, 110, 123.5, 127, 130, 146.5, 161, 175.5, 178.5, 182, 188.5, 191.5, 195, 201, 203.5, 206.5, 213.5, 216.5, 219.5]
  },
  hanaurana: {
    notes: [
      "副歌以雙手高舉、左右揮手為主；開心時可以跳。",
      "這首日本版不要求整段跟唱，拍手與揮手盡情做即可。"
    ],
    chantTimes: [46.5, 53.5, 110.5, 118],
    chantSegments: [
      { time: 160,   text: "何年経っても妄想が", romaji: "nan nen tatte mo mōsō ga" },
      { time: 163,   text: "もうこんなに",       romaji: "mō konnani" },
      { time: 168,   text: "花が散るほど",       romaji: "hana ga chiru hodo" }
    ]
  },
  Backlight: {
    notes: [
      "副歌一起大聲唱；最後一段兩次都是「悪党ふっ飛ばして」，請特別注意。"
    ],
    chantTimes: [46.5, 59, 126, 139, 193.5, 207],
    chantSegments: [
      { time: 53.5,  text: "ないやないやないや",   romaji: "nai ya na iya na iya" },
      { time: 56.5,  text: "ないさないさ",         romaji: "nai sa nai sa" },
      { time: 66.5,  text: "ないな ないなないな",   romaji: "nai na nai na nai na" },
      { time: 70,    text: "ないさないさ",         romaji: "nai sa nai sa" },
      { time: 132.5, text: "ないやないやないや",   romaji: "nai ya na iya na iya" },
      { time: 136,   text: "ないさないさ",         romaji: "nai sa nai sa" },
      { time: 146,   text: "ないな ないなないな",   romaji: "nai na nai na nai na" },
      { time: 149.5, text: "ないさないさ",         romaji: "nai sa nai sa" },
      { time: 200.5, text: "ないやないやないや",   romaji: "nai ya na iya na iya" },
      { time: 204,   text: "ないさないさ",         romaji: "nai sa nai sa" },
      { time: 214,   text: "ないな ないなないな",   romaji: "nai na nai na nai na" },
      { time: 217,   text: "ないさないさ",         romaji: "nai sa nai sa" }
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
      { time: 60.5,  text: "愛で",  romaji: "ai de" },
      { time: 68.5,  text: "日々が", romaji: "hibi ga" },
      { time: 77,    text: "愛で",  romaji: "ai de" },
      { time: 85,    text: "日々が", romaji: "hibi ga" },
      { time: 142,   text: "愛で",  romaji: "ai de" },
      { time: 150,   text: "日々が", romaji: "hibi ga" },
      { time: 158.5, text: "愛で",  romaji: "ai de" },
      { time: 166.5, text: "日々が", romaji: "hibi ga" },
      { time: 209.5, text: "愛で",  romaji: "ai de" },
      { time: 217,   text: "日々が", romaji: "hibi ga" },
      { time: 225.5, text: "愛で",  romaji: "ai de" },
      { time: 233.5, text: "日々が", romaji: "hibi ga" }
    ]
  },
  Homunculus: {
    notes: [
      "開頭與尾段的「Oh-yeah, yeah-yeah-yeah」請盡量吸飽氣唱。",
      "副歌的「ホムンクルス!」最重要；其他「イチ・ニー・サン」等應援能跟上就好。"
    ],
    chantTimes: [59, 62.5, 65.5, 72, 77, 109.5, 112.5, 115.5, 122, 127, 181.5, 187.5, 190.5, 196.5, 200]
  },
  Tokimeki: {
    notes: [
      "日本版會區分 Uh／Yeah、Da、Na、Tu 等不同應援聲，請跟著各段節奏。",
      "「Tokimekiのせい」很重要；這首歌可以和 Vaundy 一起玩得很 High。"
    ],
    chantTimes: [17, 26.5, 33, 38, 49, 54, 63.5, 89, 99, 105, 110, 121, 126, 134.5, 153, 159.5, 161, 166, 177, 182, 191.5],
    chantSegments: [
      { time: 44,   text: "ないぜ", romaji: "nai ze" },
      { time: 115.9, text: "ないぜ", romaji: "nai ze" },
      { time: 145,  text: "しまうの", romaji: "shimauno" },
      { time: 172,  text: "ないぜ", romaji: "nai ze" }
    ]
  },
  CHAINSAWBLOOD: {
    notes: [
      "日本版需要跟上的聲音應援很多，B 段先抓準進入時機，後半能整段跟上就很厲害。",
      "✋⬆️ 是高舉雙手的動作；✋⤴️ 是高舉手、手心向前拋。"
    ],
    chantTimes: [32.5, 38, 43, 51.5, 57, 64.5, 89.5, 94, 111, 116.5, 121.5, 129.5, 135.5, 142.5, 159.5, 170.5, 176.5, 183.5]
  },
  Fukakouryoku: {
    notes: [
      "副歌一起唱「Welcome to the dirty night」。",
      "「あれ なに」「それ なに」「愛で」是熟悉 VAWS 應援的人會喊的回應。"
    ],
    chantTimes: [54, 59, 64, 69.5, 97.5, 102.5, 108, 113, 176.5, 181.5, 187, 192],
    chantSegments: [
      { time: 41.5,  text: "あれ、なに", romaji: "are, nani" },
      { time: 46.5,  text: "それ、なに", romaji: "sore, nani" },
      { time: 85,    text: "あれ、なに", romaji: "are, nani" },
      { time: 90.5,  text: "それ、なに", romaji: "sore, nani" },
      { time: 154.5, text: "愛で",       romaji: "ai de" }
    ]
  },
  soramimi: {
    notes: [
      "日本版副歌重點是跟著 Vaundy 一起跳；Distance／This dance? 是跳舞時的口號。"
    ],
    chantTimes: [70, 128, 147.5]
  },
  HadakaNoYusha: {
    notes: [
      "三次「愛して」只唱這三個字；後面的歌詞不需要整段跟唱。",
      "「それは涙と対になって」與「そこは涙と対になって」請整段一起唱。"
    ],
    chantTimes: [82, 94],
    chantSegments: [
      { time: 34.5, text: "愛して", romaji: "aishi te" },
      { time: 105,  text: "愛して", romaji: "aishi te" },
      { time: 152,  text: "愛して", romaji: "aishi te" }
    ]
  },
  "Iseijin'": {
    notes: [
      "第二次 Whoa, whoa, whoa, yeah, yeah 是三次，接著唱 True, true, true。",
      "副歌以「先生」與「全然」交互喊為主。"
    ],
    chantTimes: [33, 183, 194.5],
    chantSegments: [
      { time: 47,    text: "先生",                  romaji: "sensei" },
      { time: 50.5,  text: "全然",                  romaji: "zenzen" },
      { time: 59,    text: "先生",                  romaji: "sensei" },
      { time: 61.5,  text: "全然",                  romaji: "zenzen" },
      { time: 104,   text: "先生",                  romaji: "sensei" },
      { time: 106.5, text: "全然",                  romaji: "zenzen" },
      { time: 161.5, text: "先生",                  romaji: "sensei" },
      { time: 163,   text: "全然",                  romaji: "zenzen" },
      { time: 171.5, text: "先生",                  romaji: "sensei" },
      { time: 174.5, text: "全然",                  romaji: "zenzen" },
    ]
  },
  ZuttoLoveSong: {
    notes: [
      "副歌可以跟 Vaundy 一樣高舉手比 1。",
      "「あの日から消えない……」有人會跟鼓聲連打兩下，屬於自由選擇。"
    ],
    chantTimes: [55, 154],
    chantSegments: [
      { time: 67.5, text: "キャトルミューティレイション", romaji: "kyatorumyūtireishon" },
      { time: 167,  text: "キャトルミューティレイション", romaji: "kyatorumyūtireishon" },
      { time: 183,  text: "oh yeah",                  romaji: "oh yeah" }
    ]
  },
  Yobigoe: {
    notes: [
      "依橘色標記跟唱；如果想簡化，只要跟著唱「チェンジ」也可以。"
    ],
    chantTimes: [32.5, 41, 47, 54.5, 61, 68, 75, 140, 144, 151, 166.5, 175, 181.5, 184, 188, 202.5, 209.5, 215],
    chantSegments: [
      { time: 50.5,  text: "輝いて",         romaji: "kagayai te" },
      { time: 64.5,  text: "輝いて",         romaji: "kagayai te" },
      { time: 78.5,  text: "今チェンジ",     romaji: "kon chenji" },
      { time: 133.5, text: "今チェンジ",     romaji: "kon chenji" },
      { time: 197,   text: "チェンジ",       romaji: "chenji" },
      { time: 197,   text: "輝いて",         romaji: "kagayai te" },
      { time: 212,   text: "どんな夜も Ah~", romaji: "donna yoru mo Ah ~" },
    ]
  },
  TokyoFlash: {
    notes: [
      "副歌以「できてるできてる」「悪くない悪くない」與「何処へ行こう」作為回應，並配合前後揮手。",
      "中段需要安靜的地方不要拍手。"
    ],
    chantTimes: [26, 37.5, 69, 79, 107, 118, 150, 159.5, 201.5, 211, 221, 230.5]
  },
  TodomenoIchigeki: {
    notes: [
      "副歌回應從「今日の夜は／今夜だけは」開始，接著唱「祈りあった未来とて」「道が違うのよ」「アナタ」「互いの殺意で」「トドメ」。"
    ],
    chantTimes: [62, 63.5, 73, 84.5, 87, 94, 96.5, 155, 159.5, 169, 180.5, 183, 190, 192.5, 236, 246, 256, 262, 265, 276.5, 279, 286, 288.5, 295.5, 298, 305, 307.5]
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
  "呼び声／東京フラッシュ／トドメの一撃：日本版允許簡化（只唱「チェンジ」）或依副歌回應詞跟唱；韓國版則多以完整副歌行與固定揮手段落標記。"
];
