/*
 * Keep the generated furigana.js untouched. Corrections use exact data.js
 * line keys, including chant markers and whitespace, so readings remain
 * contextual and split lyric lines receive their own ruby/romaji entries.
 *
 * UtaTen audit (2026-09-22): 34 songs with published lyrics; source URLs are
 * recorded with the added entries below. Preserve data.js base text even
 * when its spelling or line breaks differ from the reference.
 *
 * Reference limitations / reviewed exceptions:
 * - ZERO: https://utaten.com/lyric/tt23101201/ withholds the lyrics.
 * - 気まぐれ: absent from https://utaten.com/artist/lyric/37167.
 * - User-confirmed UtaTen readings: 踊り子 壊=わす; かげろう 帰せる=きせる.
 * - 花占い: use the page's complete 2人=ふたり reading for every occurrence,
 *   including the source's ニ人 spelling; do not copy incomplete 2 + 人=ひと.
 * - Group irregular counters 1発=いっぱつ and 1口=ひとくち as whole ruby units.
 * - かげろう: source 織火 / 烏 correspond to UtaTen 熾火 / 鳥; keep the
 *   source glyphs with the reference readings おきび / とり.
 * - トドメの一撃: source 光の矢 corresponds to UtaTen 光矢=ほーぷ;
 *   annotate the entire phrase so the inserted の is not pronounced.
 * - 裸の勇者: source 変な涙 differs from reference 今涙. Leave that wording
 *   and its reading unchanged; resolving it requires a lyric-text correction.
 */
export const FURIGANA_CORRECTIONS = Object.freeze({
  "[wave]愛で": "[wave]<ruby>愛<rt>あい</rt></ruby>で",
  "[wave]揺れる世界の中で僕達は": "[wave]<ruby>揺<rt>ゆ</rt></ruby>れる<ruby>世界<rt>せかい</rt></ruby>の<ruby>中<rt>なか</rt></ruby>で<ruby>僕達<rt>ぼくたち</rt></ruby>は",
  "[wave]揺れる世界の中を僕達は": "[wave]<ruby>揺<rt>ゆ</rt></ruby>れる<ruby>世界<rt>せかい</rt></ruby>の<ruby>中<rt>なか</rt></ruby>を<ruby>僕達<rt>ぼくたち</rt></ruby>は",
  "[wave]靡く世界の中で僕達は": "[wave]<ruby>靡<rt>なび</rt></ruby>く<ruby>世界<rt>せかい</rt></ruby>の<ruby>中<rt>なか</rt></ruby>で<ruby>僕達<rt>ぼくたち</rt></ruby>は",
  "[wave]靡く世界の中を僕達は": "[wave]<ruby>靡<rt>なび</rt></ruby>く<ruby>世界<rt>せかい</rt></ruby>の<ruby>中<rt>なか</rt></ruby>を<ruby>僕達<rt>ぼくたち</rt></ruby>は",
  "[wave]キスをしあって生きている": "[wave]キスをしあって<ruby>生<rt>い</rt></ruby>きている",
  "手を取り合っている": "<ruby>手<rt>て</rt></ruby>を<ruby>取<rt>と</rt></ruby>り<ruby>合<rt>あ</rt></ruby>っている",
  "目を合わせあって生きる": "<ruby>目<rt>め</rt></ruby>を<ruby>合<rt>あ</rt></ruby>わせあって<ruby>生<rt>い</rt></ruby>きる",
  "[clap]どこにいっても": "[clap]どこにいっても",
  "行き詰まりそして息道理を": "<ruby>行<rt>い</rt></ruby>き<ruby>詰<rt>づ</rt></ruby>まりそして<ruby>息<rt>いき</rt></ruby><ruby>道理<rt>どうり</rt></ruby>を",
  "[clap]そんな劣等も葛藤もみんな持ってる": "[clap]そんな<ruby>劣等<rt>れっとう</rt></ruby>も<ruby>葛藤<rt>かっとう</rt></ruby>もみんな<ruby>持<rt>も</rt></ruby>ってる",
  "その理由は同じ": "その<ruby>理由<rt>りゆう</rt></ruby>は<ruby>同<rt>おな</rt></ruby>じ",
  "[clap]また回る世界に飲まれている": "[clap]また<ruby>回<rt>まわ</rt></ruby>る<ruby>世界<rt>せかい</rt></ruby>に<ruby>飲<rt>の</rt></ruby>まれている",
  "それも理由は同じ": "それも<ruby>理由<rt>りゆう</rt></ruby>は<ruby>同<rt>おな</rt></ruby>じ",
  "[clap]それ、なに、甘い理想に": "[clap]それ、なに、<ruby>甘<rt>あま</rt></ruby>い<ruby>理想<rt>りそう</rt></ruby>に",
  "落ちる": "<ruby>落<rt>お</rt></ruby>ちる",
  "[clap]それ、なに、辛い日々に": "[clap]それ、なに、<ruby>辛<rt>つら</rt></ruby>い<ruby>日々<rt>ひび</rt></ruby>に",
  "沈む": "<ruby>沈<rt>しず</rt></ruby>む",
  "[wave]なぁなんて美しい世界だ": "[wave]なぁなんて<ruby>美<rt>うつく</rt></ruby>しい<ruby>世界<rt>せかい</rt></ruby>だ",
  "僕ら何度裏切りあっていても": "<ruby>僕<rt>ぼく</rt></ruby>ら<ruby>何<rt>なん</rt></ruby><ruby>度<rt>ど</rt></ruby><ruby>裏切<rt>うらぎ</rt></ruby>りあっていても",
  "[clap]あれ、なに、わからないよ": "[clap]あれ、なに、わからないよ",
  "[clap]それ、なに、甘い理想に落ちる": "[clap]それ、なに、<ruby>甘<rt>あま</rt></ruby>い<ruby>理想<rt>りそう</rt></ruby>に<ruby>落<rt>お</rt></ruby>ちる",
  "[clap]それ、なに、辛い日々に沈む": "[clap]それ、なに、<ruby>辛<rt>つら</rt></ruby>い<ruby>日々<rt>ひび</rt></ruby>に<ruby>沈<rt>しず</rt></ruby>む",
  "思い出すこともなくなって しまうんだろう しまうんだろうって": "<ruby>思<rt>おも</rt></ruby>い<ruby>出<rt>だ</rt></ruby>すこともなくなって しまうんだろう しまうんだろうって",
  "[wave]ホムンクルス!": "[wave]ホムンクルス!",
  "[wave]イデアが溢れて眠れない x 4": "[wave]イデアが<ruby>溢<rt>あふ</rt></ruby>れて<ruby>眠<rt>ねむ</rt></ruby>れない x 4",
  "[clap]聞かせてくれよ 聞きたいんだ": "[clap]<ruby>聞<rt>き</rt></ruby>かせてくれよ <ruby>聞<rt>き</rt></ruby>きたいんだ",
  "[clap]君に似合うんだよ ずっと見ていたいよ": "[clap]<ruby>君<rt>きみ</rt></ruby>に<ruby>似合<rt>にあ</rt></ruby>うんだよ ずっと<ruby>見<rt>み</rt></ruby>ていたいよ",
  "[wave]君がいつも  歌う怪獣の歌": "[wave]<ruby>君<rt>きみ</rt></ruby>がいつも  <ruby>歌<rt>うた</rt></ruby>う<ruby>怪獣<rt>かいじゅう</rt></ruby>の<ruby>歌<rt>うた</rt></ruby>",
  "[wave]君に出会えるからまた夏で話そう": "[wave]<ruby>君<rt>きみ</rt></ruby>に<ruby>出会<rt>であ</rt></ruby>えるからまた<ruby>夏<rt>ここ</rt></ruby>で<ruby>話<rt>はな</rt></ruby>そう",
  "[clap]君を襲いかかる時がくるさ": "[clap]<ruby>君<rt>きみ</rt></ruby>を<ruby>襲<rt>おそ</rt></ruby>いかかる<ruby>時<rt>とき</rt></ruby>がくるさ",
  "[clap]「心枯れるまで、共に笑っていよう」": "[clap]「<ruby>心<rt>こころ</rt></ruby><ruby>枯<rt>か</rt></ruby>れるまで、<ruby>共<rt>とも</rt></ruby>に<ruby>笑<rt>わら</rt></ruby>っていよう」",
  "[clap]事が一つ二つ浮いているけど": "[clap]<ruby>事<rt>こと</rt></ruby>が<ruby>一<rt>ひと</rt></ruby>つ<ruby>二<rt>ふた</rt></ruby>つ<ruby>浮<rt>う</rt></ruby>いているけど",
  "[wave]力が伴う悪意振り解いて耳は聞こえちゃいない": "[wave]<ruby>力<rt>ちから</rt></ruby>が<ruby>伴<rt>ともな</rt></ruby>う<ruby>悪意<rt>あくい</rt></ruby><ruby>振<rt>ふ</rt></ruby>り<ruby>解<rt>ほど</rt></ruby>いて<ruby>耳<rt>みみ</rt></ruby>は<ruby>聞<rt>き</rt></ruby>こえちゃいない",
  "[clap]街の夕焼けに溶けた僕たちはまだニ人だろうか": "[clap]<ruby>街<rt>まち</rt></ruby>の<ruby>夕焼<rt>ゆうや</rt></ruby>けに<ruby>溶<rt>と</rt></ruby>けた<ruby>僕<rt>ぼく</rt></ruby>たちはまだ<ruby>ニ人<rt>ふたり</rt></ruby>だろうか",
  "[clap]風が吹く僕たちを乗せて": "[clap]<ruby>風<rt>かぜ</rt></ruby>が<ruby>吹<rt>ふ</rt></ruby>く<ruby>僕<rt>ぼく</rt></ruby>たちを<ruby>乗<rt>の</rt></ruby>せて",
  "[wave]風の目の方に歩き出す脱、言念、且つ自暴論": "[wave]<ruby>風<rt>かぜ</rt></ruby>の<ruby>目<rt>め</rt></ruby>の<ruby>方<rt>ほう</rt></ruby>に<ruby>歩<rt>ある</rt></ruby>き<ruby>出<rt>だ</rt></ruby>す<ruby>脱<rt>だつ</rt></ruby>、<ruby>言<rt>ごん</rt></ruby><ruby>念<rt>ねん</rt></ruby>、<ruby>且<rt>か</rt></ruby>つ<ruby>自暴<rt>じぼう</rt></ruby><ruby>論<rt>ろん</rt></ruby>",
  "[clap]風の目の方に歩き出す脱、言念、且つ自暴論": "[clap]<ruby>風<rt>かぜ</rt></ruby>の<ruby>目<rt>め</rt></ruby>の<ruby>方<rt>ほう</rt></ruby>に<ruby>歩<rt>ある</rt></ruby>き<ruby>出<rt>だ</rt></ruby>す<ruby>脱<rt>だつ</rt></ruby>、<ruby>言<rt>ごん</rt></ruby><ruby>念<rt>ねん</rt></ruby>、<ruby>且<rt>か</rt></ruby>つ<ruby>自暴<rt>じぼう</rt></ruby><ruby>論<rt>ろん</rt></ruby>",
  "[wave]風纏い擦り傷が絶えないだろう": "[wave]<ruby>風<rt>かぜ</rt></ruby><ruby>纏<rt>まと</rt></ruby>い<ruby>擦<rt>す</rt></ruby>り<ruby>傷<rt>きず</rt></ruby>が<ruby>絶<rt>た</rt></ruby>えないだろう",
  "[wave](jump)風に靡く羽に ほら従って": "[wave](jump)<ruby>風<rt>かぜ</rt></ruby>に<ruby>靡<rt>なび</rt></ruby>く<ruby>羽<rt>はね</rt></ruby>に ほら<ruby>従<rt>したが</rt></ruby>って",
  "[wave](jump)風に靡く羽に": "[wave](jump)<ruby>風<rt>かぜ</rt></ruby>に<ruby>靡<rt>なび</rt></ruby>く<ruby>羽<rt>はね</rt></ruby>に",
  "[clap]波の中で混じり合わない日々の中で": "[clap]<ruby>波<rt>なみ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>で<ruby>混<rt>ま</rt></ruby>じり<ruby>合<rt>あ</rt></ruby>わない<ruby>日々<rt>ひび</rt></ruby>の<ruby>中<rt>なか</rt></ruby>で",
  "[clap]波に乗せて ネットサーフィン": "[clap]<ruby>波<rt>なみ</rt></ruby>に<ruby>乗<rt>の</rt></ruby>せて ネットサーフィン",
  "[clap]時折り描いた暗闇照らす何か": "[clap]<ruby>時<rt>とき</rt></ruby><ruby>折<rt>お</rt></ruby>り<ruby>描<rt>か</rt></ruby>いた<ruby>暗闇<rt>くらやみ</rt></ruby><ruby>照<rt>て</rt></ruby>らす<ruby>何<rt>なに</rt></ruby>か",
  "[wave]時に歩み合うかより大切で": "[wave]<ruby>時<rt>とき</rt></ruby>に<ruby>歩<rt>あゆ</rt></ruby>み<ruby>合<rt>あ</rt></ruby>うかより<ruby>大切<rt>たいせつ</rt></ruby>で",
  "[wave]声武者震いは「今チェンジ」": "[wave]<ruby>声<rt>こえ</rt></ruby><ruby>武者震<rt>むしゃぶる</rt></ruby>いは「<ruby>今<rt>いま</rt></ruby>チェンジ」",
  "[wave]苦すぎるから​": "[wave]<ruby>苦<rt>にが</rt></ruby>すぎるから​",
  "[wave]光飛び散った最中": "[wave]<ruby>光<rt>ひかり</rt></ruby><ruby>飛<rt>と</rt></ruby>び<ruby>散<rt>ち</rt></ruby>った<ruby>最中<rt>さなか</rt></ruby>",
  "[clap]口をはにかみ、涙流すから": "[clap]<ruby>口<rt>くち</rt></ruby>をはにかみ、<ruby>涙<rt>なみだ</rt></ruby><ruby>流<rt>なが</rt></ruby>すから",
  "[clap]四六時中グダグダと チクチクが流れる": "[clap]<ruby>四<rt>し</rt></ruby><ruby>六<rt>ろく</rt></ruby><ruby>時<rt>じ</rt></ruby><ruby>中<rt>ちゅう</rt></ruby>グダグダと チクチクが<ruby>流<rt>なが</rt></ruby>れる",
  "[wave]道が違うのよ アナタ": "[wave]<ruby>道<rt>みち</rt></ruby>が<ruby>違<rt>ちが</rt></ruby>うのよ アナタ",

  // 心動 (Tokimeki) — https://utaten.com/lyric/mi23050949/
  "[wave]それは、軽やかな魔法": "[wave]それは、<ruby>軽<rt>かろ</rt></ruby>やかな<ruby>魔法<rt>まほう</rt></ruby>",
  "涙流して笑えばいいさ": "<ruby>涙<rt>なみだ</rt></ruby><ruby>流<rt>なが</rt></ruby>して<ruby>笑<rt>わら</rt></ruby>えばいいさ",
  "あくびしてる暇なんかないぜ": "あくびしてる<ruby>暇<rt>ひま</rt></ruby>なんかないぜ",
  "[wave]ほら、ほらもっと聞かせて": "[wave]ほら、ほらもっと<ruby>聞<rt>き</rt></ruby>かせて",
  "[wave]それは、鮮やかな魔法": "[wave]それは、<ruby>鮮<rt>あざ</rt></ruby>やかな<ruby>魔法<rt>まほう</rt></ruby>",
  "震え出す その線のせいで 動き出してしまうの (しまうの)": "<ruby>震<rt>ふる</rt></ruby>え<ruby>出<rt>だ</rt></ruby>す その<ruby>線<rt>せん</rt></ruby>のせいで <ruby>動<rt>うご</rt></ruby>き<ruby>出<rt>だ</rt></ruby>してしまうの (しまうの)",
  "[wave]止まれないのは": "[wave]<ruby>止<rt>と</rt></ruby>まれないのは",

  // 怪獸之花歌 (怪獣の花唄) — https://utaten.com/lyric/nm20051304/
  "[wave]君がいつも": "[wave]<ruby>君<rt>きみ</rt></ruby>がいつも",
  "歌う怪獣の歌": "<ruby>歌<rt>うた</rt></ruby>う<ruby>怪獣<rt>かいじゅう</rt></ruby>の<ruby>歌<rt>うた</rt></ruby>",
  "ねぇ 僕ら": "ねぇ <ruby>僕<rt>ぼく</rt></ruby>ら",
  "[wave]眠れない夜に": "[wave]<ruby>眠<rt>ねむ</rt></ruby>れない<ruby>夜<rt>よる</rt></ruby>に",
  "手を伸ばして": "<ruby>手<rt>て</rt></ruby>を<ruby>伸<rt>の</rt></ruby>ばして",
  "[wave]眠らない夜を": "[wave]<ruby>眠<rt>ねむ</rt></ruby>らない<ruby>夜<rt>よる</rt></ruby>を",
  "また伸ばして": "また<ruby>伸<rt>の</rt></ruby>ばして",
  "[wave]眠くないまだね": "[wave]<ruby>眠<rt>ねむ</rt></ruby>くないまだね",
  "そんな日々でいたいのにな 懲りずに": "そんな<ruby>日々<rt>ひび</rt></ruby>でいたいのにな <ruby>懲<rt>こ</rt></ruby>りずに",
  "そんな夜に歌う 怪獣の歌": "そんな<ruby>夜<rt>よる</rt></ruby>に<ruby>歌<rt>うた</rt></ruby>う <ruby>怪獣<rt>かいじゅう</rt></ruby>の<ruby>歌<rt>うた</rt></ruby>",

  // CHAINSAW BLOOD — https://utaten.com/lyric/hw22092012/
  "[clap]弾む鼓動は刻むclap無しで": "[clap]<ruby>弾<rt>はず</rt></ruby>む<ruby>鼓動<rt>ビート</rt></ruby>は<ruby>刻<rt>きざ</rt></ruby>むclap<ruby>無<rt>な</rt></ruby>しで",
  "[clap]忘れたいほど怒るchain回して": "[clap]<ruby>忘<rt>わす</rt></ruby>れたいほど<ruby>怒<rt>いか</rt></ruby>るchain<ruby>回<rt>まわ</rt></ruby>して",
  "全てをかき消してengine音": "<ruby>全<rt>すべ</rt></ruby>てをかき<ruby>消<rt>け</rt></ruby>してengine<ruby>音<rt>おん</rt></ruby>",
  "[wave]舌鳴らし今 錆び付け黒く": "[wave]<ruby>舌<rt>した</rt></ruby><ruby>鳴<rt>な</rt></ruby>らし<ruby>今<rt>いま</rt></ruby> <ruby>錆<rt>さ</rt></ruby>び<ruby>付<rt>つ</rt></ruby>け<ruby>黒<rt>くろ</rt></ruby>く",
  "[clap]使った愛の手！": "[clap]<ruby>使<rt>つか</rt></ruby>った<ruby>愛<rt>あい</rt></ruby>の<ruby>手<rt>て</rt></ruby>！",
  "[clap]笑かしたbadなschemeを食ってしまう紳士": "[clap]<ruby>笑<rt>わら</rt></ruby>かしたbadなschemeを<ruby>食<rt>く</rt></ruby>ってしまう<ruby>紳士<rt>しんし</rt></ruby>",
  "[wave]CHAINSAW is 使える愛の手": "[wave]CHAINSAW is <ruby>使<rt>つか</rt></ruby>える<ruby>愛<rt>あい</rt></ruby>の<ruby>手<rt>て</rt></ruby>",
  "[wave]弾む鼓動は歪むclean toneで": "[wave]<ruby>弾<rt>はず</rt></ruby>む<ruby>鼓動<rt>ビート</rt></ruby>は<ruby>歪<rt>ひず</rt></ruby>むclean toneで",
  "[wave]歯軋りで、ほら 焼き付く赤く": "[wave]<ruby>歯軋<rt>はぎし</rt></ruby>りで、ほら <ruby>焼<rt>や</rt></ruby>き<ruby>付<rt>つ</rt></ruby>く<ruby>赤<rt>あか</rt></ruby>く",
  "[clap]須くengineかき鳴らした": "[clap]<ruby>須<rt>すべから</rt></ruby>くengineかき<ruby>鳴<rt>な</rt></ruby>らした",

  // 乘著戀愛感冒 (恋風邪にのせて) — https://utaten.com/lyric/tt22013105/
  "[clap]二人 目をそらして気付いたの ": "[clap]<ruby>二人<rt>ふたり</rt></ruby> <ruby>目<rt>め</rt></ruby>をそらして<ruby>気付<rt>きづ</rt></ruby>いたの ",
  "[wave]そっと二人 魔法を唱えるの 恋風邪にのせて": "[wave]そっと<ruby>二人<rt>ふたり</rt></ruby> <ruby>魔法<rt>まほう</rt></ruby>を<ruby>唱<rt>とな</rt></ruby>えるの <ruby>恋風邪<rt>こいかぜ</rt></ruby>にのせて",
  "[clap]二人 目を凝らして気付いたの": "[clap]<ruby>二人<rt>ふたり</rt></ruby> <ruby>目<rt>め</rt></ruby>を<ruby>凝<rt>こ</rt></ruby>らして<ruby>気付<rt>きづ</rt></ruby>いたの",
  "[wave]そっと二人 魔法を唱えるの": "[wave]そっと<ruby>二人<rt>ふたり</rt></ruby> <ruby>魔法<rt>まほう</rt></ruby>を<ruby>唱<rt>とな</rt></ruby>えるの",
  "[clap]言葉が深める惑星の夜に今": "[clap]<ruby>言葉<rt>ことば</rt></ruby>が<ruby>深<rt>ふか</rt></ruby>める<ruby>惑星<rt>ほし</rt></ruby>の<ruby>夜<rt>よる</rt></ruby>に<ruby>今<rt>いま</rt></ruby>",
  "[clap]やっと二人 目を合わせて気付いたの": "[clap]やっと<ruby>二人<rt>ふたり</rt></ruby> <ruby>目<rt>め</rt></ruby>を<ruby>合<rt>あ</rt></ruby>わせて<ruby>気付<rt>きづ</rt></ruby>いたの",

  // 舞者 (踊り子) — https://utaten.com/lyric/ma21111952/
  "[clap]思いを蹴って 二人でしてんだ": "[clap]<ruby>思<rt>おも</rt></ruby>いを<ruby>蹴<rt>け</rt></ruby>って <ruby>二人<rt>ふたり</rt></ruby>でしてんだ",
  "[clap]壊れない愛を歌う 言葉を二人に課して": "[clap]<ruby>壊<rt>わす</rt></ruby>れない<ruby>愛<rt>あい</rt></ruby>を<ruby>歌<rt>うた</rt></ruby>う <ruby>言葉<rt>ことば</rt></ruby>を<ruby>二人<rt>ふたり</rt></ruby>に<ruby>課<rt>か</rt></ruby>して",

  // 裸身勇者 (裸の勇者) — https://utaten.com/lyric/ma22011710/
  "力が伴う 悪意振り解いて": "<ruby>力<rt>ちから</rt></ruby>が<ruby>伴<rt>ともな</rt></ruby>う <ruby>悪意振<rt>あくいふ</rt></ruby>り<ruby>解<rt>ほど</rt></ruby>いて",
  "それは涙と対になって 悲しみと力となって": "それは<ruby>涙<rt>なみだ</rt></ruby>と<ruby>対<rt>つい</rt></ruby>になって <ruby>悲<rt>かな</rt></ruby>しみと<ruby>力<rt>ちから</rt></ruby>となって",
  "そこは涙と対になって 滾りが溢れかえって": "そこは<ruby>涙<rt>なみだ</rt></ruby>と<ruby>対<rt>つい</rt></ruby>になって <ruby>滾<rt>たぎ</rt></ruby>りが<ruby>溢<rt>あふ</rt></ruby>れかえって",
  "[clap]誰もが求めた剣はこの誰かが残してった鈍が": "[clap]<ruby>誰<rt>だれ</rt></ruby>もが<ruby>求<rt>もと</rt></ruby>めた<ruby>剣<rt>つるぎ</rt></ruby>はこの<ruby>誰<rt>だれ</rt></ruby>かが<ruby>残<rt>のこ</rt></ruby>してった<ruby>鈍<rt>なまくら</rt></ruby>が",
  "[clap]この誰かが残してった鈍が闇を裂いてしまう前に": "[clap]この<ruby>誰<rt>だれ</rt></ruby>かが<ruby>残<rt>のこ</rt></ruby>してった<ruby>鈍<rt>なまくら</rt></ruby>が<ruby>闇<rt>やみ</rt></ruby>を<ruby>裂<rt>さ</rt></ruby>いてしまう<ruby>前<rt>まえ</rt></ruby>に",
  "[wave]だが勇者は今力はいらない身に任せて": "[wave]だが<ruby>勇者<rt>ゆうしゃ</rt></ruby>は<ruby>今<rt>いま</rt></ruby><ruby>力<rt>ちから</rt></ruby>はいらない<ruby>身<rt>み</rt></ruby>に<ruby>任<rt>まか</rt></ruby>せて",

  // 不可幸力 (不可幸力) — https://utaten.com/lyric/un20092501/
  "[clap]なんでもかんでも欲しがる世界じゃない？": "[clap]なんでもかんでも<ruby>欲<rt>ほ</rt></ruby>しがる<ruby>世界<rt>せかい</rt></ruby>じゃない？",
  "[wave]みんな心の中までイカレちまっている": "[wave]みんな<ruby>心<rt>こころ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>までイカレちまっている",
  "[wave]みんな心の中から弱って朽ちていく": "[wave]みんな<ruby>心<rt>こころ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>から<ruby>弱<rt>よわ</rt></ruby>って<ruby>朽<rt>く</rt></ruby>ちていく",

  // 重逢 (再会) — https://utaten.com/lyric/ks25060301/
  "[clap]超TRY 光を貸してbody": "[clap]<ruby>超<rt>スーパー</rt></ruby>TRY <ruby>光<rt>ひかり</rt></ruby>を<ruby>貸<rt>か</rt></ruby>してbody",
  "[wave]この先は一瞬も一寸の隅も": "[wave]この<ruby>先<rt>さき</rt></ruby>は<ruby>一瞬<rt>いっしゅん</rt></ruby>も<ruby>一寸<rt>いっすん</rt></ruby>の<ruby>隅<rt>すき</rt></ruby>も",
  "[clap]超HIGHもうすでに力んでるマジ": "[clap]<ruby>超<rt>スーパー</rt></ruby>HIGHもうすでに<ruby>力<rt>りき</rt></ruby>んでるマジ",
  "[wave]これまでの一瞬も一寸の隅も": "[wave]これまでの<ruby>一瞬<rt>いっしゅん</rt></ruby>も<ruby>一寸<rt>いっすん</rt></ruby>の<ruby>隅<rt>すき</rt></ruby>も",

  // 花占卜 (花占い) — https://utaten.com/lyric/hw21061809/
  "[clap]恋路の果てには何があるくだらない話をニ人でしよう": "[clap]<ruby>恋路<rt>こいじ</rt></ruby>の<ruby>果<rt>は</rt></ruby>てには<ruby>何<rt>なに</rt></ruby>があるくだらない<ruby>話<rt>はなし</rt></ruby>を<ruby>ニ人<rt>ふたり</rt></ruby>でしよう",
  "[clap]2人がたっている永劫を": "[clap]<ruby>2人<rt>ふたり</rt></ruby>がたっている<ruby>永劫<rt>えいごう</rt></ruby>を",
  "[clap]願いは君との先にあるたわいない話を2人でしよう": "[clap]<ruby>願<rt>ねが</rt></ruby>いは<ruby>君<rt>きみ</rt></ruby>との<ruby>先<rt>さき</rt></ruby>にあるたわいない<ruby>話<rt>はなし</rt></ruby>を<ruby>2人<rt>ふたり</rt></ruby>でしよう",
  "花占う恋歌": "<ruby>花占<rt>はなうらな</rt></ruby>う<ruby>恋歌<rt>れんか</rt></ruby>",
  "[clap]ニ人でちぎった花に願いを込めて": "[clap]<ruby>ニ人<rt>ふたり</rt></ruby>でちぎった<ruby>花<rt>はな</rt></ruby>に<ruby>願<rt>ねが</rt></ruby>いを<ruby>込<rt>こ</rt></ruby>めて",

  // 呼喚聲 (呼び声) — https://utaten.com/lyric/hw25121002/
  "[clap]この惑星の真ん中で": "[clap]この<ruby>惑星<rt>ほし</rt></ruby>の<ruby>真<rt>ま</rt></ruby>ん<ruby>中<rt>なか</rt></ruby>で",
  "[clap]この部屋を立ち籠めている何か": "[clap]この<ruby>部屋<rt>へや</rt></ruby>を<ruby>立<rt>た</rt></ruby>ち<ruby>籠<rt>こ</rt></ruby>めている<ruby>何<rt>なに</rt></ruby>か",
  "[clap]それは紅色の記憶のような": "[clap]それは<ruby>紅色<rt>べにいろ</rt></ruby>の<ruby>記憶<rt>きおく</rt></ruby>のような",
  "[wave]寂しくなるよだからいつまでも": "[wave]<ruby>寂<rt>さび</rt></ruby>しくなるよだからいつまでも",
  "今 チェンジ": "<ruby>今<rt>いま</rt></ruby> チェンジ",
  "[wave]どんな夜も輝いて消": "[wave]どんな<ruby>夜<rt>よる</rt></ruby>も<ruby>輝<rt>かがや</rt></ruby>いて<ruby>消<rt>き</rt></ruby>",
  "[wave]僕らまだ不確かな未来歌えるよ": "[wave]<ruby>僕<rt>ぼく</rt></ruby>らまだ<ruby>不確<rt>ふたし</rt></ruby>かな<ruby>未来<rt>みらい</rt></ruby><ruby>歌<rt>うた</rt></ruby>えるよ",
  "[wave]ほら待ってるよ 「今チェンジ」": "[wave]ほら<ruby>待<rt>ま</rt></ruby>ってるよ 「<ruby>今<rt>いま</rt></ruby>チェンジ」",
  "[clap]差し詰め、希望に似た溢れる何か": "[clap]<ruby>差<rt>さ</rt></ruby>し<ruby>詰<rt>ず</rt></ruby>め、<ruby>希望<rt>きぼう</rt></ruby>に<ruby>似<rt>に</rt></ruby>た<ruby>溢<rt>あふ</rt></ruby>れる<ruby>何<rt>なに</rt></ruby>か",
  "[clap]余さず描いた立ち籠めていた何か": "[clap]<ruby>余<rt>あま</rt></ruby>さず<ruby>描<rt>か</rt></ruby>いた<ruby>立<rt>た</rt></ruby>ち<ruby>籠<rt>こ</rt></ruby>めていた<ruby>何<rt>なに</rt></ruby>か",
  "[clap]まだ紅色幕開け前か": "[clap]まだ<ruby>紅色<rt>べにいろ</rt></ruby><ruby>幕開<rt>まくあ</rt></ruby>け<ruby>前<rt>まえ</rt></ruby>か",
  "[wave]このままこの続きを": "[wave]このままこの<ruby>続<rt>つづ</rt></ruby>きを",
  "今 チェンジ x 4": "<ruby>今<rt>いま</rt></ruby> チェンジ x 4",
  "[clap]僕ら今確かに、見上げているはず": "[clap]<ruby>僕<rt>ぼく</rt></ruby>ら<ruby>今<rt>いま</rt></ruby><ruby>確<rt>たし</rt></ruby>かに、<ruby>見上<rt>みあ</rt></ruby>げているはず",
  "[wave]伸ばして僕ら今確かに、未来歌えるよ": "[wave]<ruby>伸<rt>の</rt></ruby>ばして<ruby>僕<rt>ぼく</rt></ruby>ら<ruby>今<rt>いま</rt></ruby><ruby>確<rt>たし</rt></ruby>かに、<ruby>未来<rt>みらい</rt></ruby><ruby>歌<rt>うた</rt></ruby>えるよ",
  "[wave]どんな夜も Ah~": "[wave]どんな<ruby>夜<rt>よる</rt></ruby>も Ah~",
  "今チェンジ x 5": "<ruby>今<rt>いま</rt></ruby>チェンジ x 5",

  // 燈火 (灯火) — https://utaten.com/lyric/nm20050702/
  "[clap]完璧な理想郷など僕らにはあり得はしないから": "[clap]<ruby>完璧<rt>かんぺき</rt></ruby>な<ruby>理想郷<rt>りそうきょう</rt></ruby>など<ruby>僕<rt>ぼく</rt></ruby>らにはあり<ruby>得<rt>え</rt></ruby>はしないから",
  "[clap]ありもしない滑走路羽を広げ走る": "[clap]ありもしない<ruby>滑走路<rt>かっそうろ</rt></ruby><ruby>羽<rt>はね</rt></ruby>を<ruby>広<rt>ひろ</rt></ruby>げ<ruby>走<rt>はし</rt></ruby>る",
  "[clap]何度も声を上げて何度も声を上げて": "[clap]<ruby>何度<rt>なんど</rt></ruby>も<ruby>声<rt>こえ</rt></ruby>を<ruby>上<rt>あ</rt></ruby>げて<ruby>何度<rt>なんど</rt></ruby>も<ruby>声<rt>こえ</rt></ruby>を<ruby>上<rt>あ</rt></ruby>げて",
  "[wave]どうしようどこへ行こうか僕が今惨憺と声に出して": "[wave]どうしようどこへ<ruby>行<rt>い</rt></ruby>こうか<ruby>僕<rt>ぼく</rt></ruby>が<ruby>今<rt>いま</rt></ruby><ruby>惨憺<rt>さんたん</rt></ruby>と<ruby>声<rt>こえ</rt></ruby>に<ruby>出<rt>だ</rt></ruby>して",

  // 我怎麼會知道呢 (僕にはどうしてわかるんだろう) — https://utaten.com/lyric/hw25040809/
  "時は真夏荒天と海神蒼炎際立つ": "<ruby>時<rt>とき</rt></ruby>は<ruby>真夏<rt>まなつ</rt></ruby><ruby>荒天<rt>こうてん</rt></ruby>と<ruby>海神<rt>わだつみ</rt></ruby><ruby>蒼炎<rt>そうえん</rt></ruby><ruby>際立<rt>きわだ</rt></ruby>つ",
  "骨相青に溶けモノクロは焦シアン蒼白へ": "<ruby>骨相<rt>こっそう</rt></ruby><ruby>青<rt>あお</rt></ruby>に<ruby>溶<rt>と</rt></ruby>けモノクロは<ruby>焦<rt>そう</rt></ruby>シアン<ruby>蒼白<rt>そうはく</rt></ruby>へ",
  "[wave]全てのことがまるで明くる前のよう": "[wave]<ruby>全<rt>すべ</rt></ruby>てのことがまるで<ruby>明<rt>あ</rt></ruby>くる<ruby>前<rt>まえ</rt></ruby>のよう",

  // 皺褶相合 (しわあわせ) — https://utaten.com/lyric/ma21041401/
  "絵に描いたような君の綺麗な心臓を": "<ruby>絵<rt>え</rt></ruby>に<ruby>描<rt>か</rt></ruby>いたような<ruby>君<rt>きみ</rt></ruby>の<ruby>綺麗<rt>きれい</rt></ruby>な<ruby>心臓<rt>しんぞう</rt></ruby>を",
  "透き通るような君の綺麗な一拍を": "<ruby>透<rt>す</rt></ruby>き<ruby>通<rt>とお</rt></ruby>るような<ruby>君<rt>きみ</rt></ruby>の<ruby>綺麗<rt>きれい</rt></ruby>な<ruby>一拍<rt>いっぱく</rt></ruby>を",
  "重なるひびを僕達は流るるひびも僕達は": "<ruby>重<rt>かさ</rt></ruby>なるひびを<ruby>僕<rt>ぼく</rt></ruby><ruby>達<rt>たち</rt></ruby>は<ruby>流<rt>なが</rt></ruby>るるひびも<ruby>僕<rt>ぼく</rt></ruby><ruby>達<rt>たち</rt></ruby>は",

  // 人造小人 (ホムンクルス) — https://utaten.com/lyric/hw24061821/
  "[clap]小さくても次第にグツグツ煮立って終いにゃ それを鼓舞する": "[clap]<ruby>小<rt>ちい</rt></ruby>さくても<ruby>次第<rt>しだい</rt></ruby>にグツグツ<ruby>煮立<rt>にえた</rt></ruby>って<ruby>終<rt>しま</rt></ruby>いにゃ それを<ruby>鼓舞<rt>こぶ</rt></ruby>する",
  "[wave]ヨン で開幕起爆、解放万歳": "[wave]ヨン で<ruby>開幕<rt>かいまく</rt></ruby><ruby>起爆<rt>きばく</rt></ruby>、<ruby>解放<rt>かいほう</rt></ruby><ruby>万歳<rt>ばんざい</rt></ruby>",
  "[wave]行くぜ喝采気は満ちた": "[wave]<ruby>行<rt>い</rt></ruby>くぜ<ruby>喝采<rt>かっさい</rt></ruby><ruby>気<rt>き</rt></ruby>は<ruby>満<rt>み</rt></ruby>ちた",
  "[clap]今肩でも揉むよダーリン": "[clap]<ruby>今<rt>いま</rt></ruby><ruby>肩<rt>かた</rt></ruby>でも<ruby>揉<rt>も</rt></ruby>むよダーリン",
  "[wave]行くぜ喝采俺が来た": "[wave]<ruby>行<rt>い</rt></ruby>くぜ<ruby>喝采<rt>かっさい</rt></ruby><ruby>俺<rt>おれ</rt></ruby>が<ruby>来<rt>き</rt></ruby>た",
  "[wave]そこに見たんだよ": "[wave]そこに<ruby>見<rt>み</rt></ruby>たんだよ",
  "[wave]確かめ合うかより": "[wave]<ruby>確<rt>たし</rt></ruby>かめ<ruby>合<rt>あ</rt></ruby>うかより",
  "大切で": "<ruby>大切<rt>たいせつ</rt></ruby>で",
  "[wave]思い合えるより": "[wave]<ruby>思<rt>おも</rt></ruby>い<ruby>合<rt>あ</rt></ruby>えるより",
  "温かくて": "<ruby>温<rt>あたた</rt></ruby>かくて",
  "[wave]振り剥がせるかより": "[wave]<ruby>振<rt>ふ</rt></ruby>り<ruby>剥<rt>は</rt></ruby>がせるかより",
  "愚かに、浸ってしまうほど": "<ruby>愚<rt>おろ</rt></ruby>かに、<ruby>浸<rt>ひた</rt></ruby>ってしまうほど",
  "[wave]時に歩み合うかより": "[wave]<ruby>時<rt>とき</rt></ruby>に<ruby>歩<rt>あゆ</rt></ruby>み<ruby>合<rt>あ</rt></ruby>うかより",
  "[wave]抱きしめ合えるより": "[wave]<ruby>抱<rt>だ</rt></ruby>きしめ<ruby>合<rt>あ</rt></ruby>えるより",
  "温かく思う未来を見たいんだよ": "<ruby>温<rt>あたた</rt></ruby>かく<ruby>思<rt>おも</rt></ruby>う<ruby>未来<rt>みらい</rt></ruby>を<ruby>見<rt>み</rt></ruby>たいんだよ",

  // soramimi — https://utaten.com/lyric/nm20052727/
  "[clap]そのエロい体を貸してくれ": "[clap]そのエロい<ruby>体<rt>からだ</rt></ruby>を<ruby>貸<rt>か</rt></ruby>してくれ",
  "[clap]1発打ったこのビートを鳴らしてよさぁ": "[clap]<ruby>1発<rt>いっぱつ</rt></ruby><ruby>打<rt>う</rt></ruby>ったこのビートを<ruby>鳴<rt>な</rt></ruby>らしてよさぁ",
  "[clap]だいたいそんなもん自己満たちが踊る世界だもん": "[clap]だいたいそんなもん<ruby>自己<rt>じこ</rt></ruby><ruby>満<rt>まん</rt></ruby>たちが<ruby>踊<rt>おど</rt></ruby>る<ruby>世界<rt>せかい</rt></ruby>だもん",

  // 東京 Flash (東京フラッシュ) — https://utaten.com/lyric/rq20061008/
  "相槌がうまくなったんだ": "<ruby>相槌<rt>あいづち</rt></ruby>がうまくなったんだ",
  "[wave]東京フラッシュ君の目が覚めたら": "[wave]<ruby>東京<rt>とうきょう</rt></ruby>フラッシュ<ruby>君<rt>きみ</rt></ruby>の<ruby>目<rt>め</rt></ruby>が<ruby>覚<rt>さ</rt></ruby>めたら",
  "[wave]どこへ行こうどこへ行こう": "[wave]どこへ<ruby>行<rt>い</rt></ruby>こうどこへ<ruby>行<rt>い</rt></ruby>こう",
  "変わらないよ": "<ruby>変<rt>か</rt></ruby>わらないよ",
  "[wave]東京フラッシュ君と手を繋いだら": "[wave]<ruby>東京<rt>とうきょう</rt></ruby>フラッシュ<ruby>君<rt>きみ</rt></ruby>と<ruby>手<rt>て</rt></ruby>を<ruby>繋<rt>つな</rt></ruby>いだら",
  "断崖絶壁で愛していた": "<ruby>断崖<rt>だんがい</rt></ruby><ruby>絶壁<rt>ぜっぺき</rt></ruby>で<ruby>愛<rt>あい</rt></ruby>していた",

  // 哭泣地藏 (泣き地蔵) — https://utaten.com/lyric/hw21072901/
  "もう精一杯をもう一回 ねぇ神様もういいだろって": "もう<ruby>精一杯<rt>せいいっぱい</rt></ruby>をもう<ruby>一回<rt>いっかい</rt></ruby> ねぇ<ruby>神様<rt>かみさま</rt></ruby>もういいだろって",
  "ねぇもう一回を精一杯": "ねぇもう<ruby>一回<rt>いっかい</rt></ruby>を<ruby>精一杯<rt>せいいっぱい</rt></ruby>",
  "知らぬ仏より馴染みの地獄で": "<ruby>知<rt>し</rt></ruby>らぬ<ruby>仏<rt>ほとけ</rt></ruby>より<ruby>馴染<rt>なじ</rt></ruby>みの<ruby>地獄<rt>じごく</rt></ruby>で",

  // napori — https://utaten.com/lyric/nm20052728/
  "ろくな音楽もなくてそんなひびをまた2人で": "ろくな<ruby>音楽<rt>おんがく</rt></ruby>もなくてそんなひびをまた<ruby>2人<rt>ふたり</rt></ruby>で",
  "僕ら指にラブソングで今夜も二人で歩いてこ": "<ruby>僕<rt>ぼく</rt></ruby>ら<ruby>指<rt>ゆび</rt></ruby>にラブソングで<ruby>今夜<rt>こんや</rt></ruby>も<ruby>二人<rt>ふたり</rt></ruby>で<ruby>歩<rt>ある</rt></ruby>いてこ",
  "2人になって 君を待って思い出したんだ思い出したんだ": "<ruby>2人<rt>ふたり</rt></ruby>になって <ruby>君<rt>きみ</rt></ruby>を<ruby>待<rt>ま</rt></ruby>って<ruby>思<rt>おも</rt></ruby>い<ruby>出<rt>だ</rt></ruby>したんだ<ruby>思<rt>おも</rt></ruby>い<ruby>出<rt>だ</rt></ruby>したんだ",
  "あれは縁そっと flight": "あれは<ruby>縁<rt>べり</rt></ruby>そっと flight",
  "いずれ縁そっと flight": "いずれ<ruby>縁<rt>べり</rt></ruby>そっと flight",
  "君と 縁そっと flight": "<ruby>君<rt>きみ</rt></ruby>と <ruby>縁<rt>べり</rt></ruby>そっと flight",
  "二人はキスをする": "<ruby>二人<rt>ふたり</rt></ruby>はキスをする",
  "そんな僕の横でハイボールを1口": "そんな<ruby>僕<rt>ぼく</rt></ruby>の<ruby>横<rt>よこ</rt></ruby>でハイボールを<ruby>1口<rt>ひとくち</rt></ruby>",

  // 逆光 (逆光) — https://utaten.com/lyric/mi23111348/
  "[wave]怒りよ今悪党ぶっ飛ばしてそりゃあ愛ある罰だ": "[wave]<ruby>怒<rt>いか</rt></ruby>りよ<ruby>今<rt>いま</rt></ruby><ruby>悪党<rt>あくとう</rt></ruby>ぶっ<ruby>飛<rt>と</rt></ruby>ばしてそりゃあ<ruby>愛<rt>あい</rt></ruby>ある<ruby>罰<rt>ばつ</rt></ruby>だ",
  "[wave]そう 怒りよ今 悪党蹴り飛ばして そりゃあ愛への罰だ": "[wave]そう <ruby>怒<rt>いか</rt></ruby>りよ<ruby>今<rt>いま</rt></ruby> <ruby>悪党<rt>あくとう</rt></ruby><ruby>蹴<rt>け</rt></ruby>り<ruby>飛<rt>と</rt></ruby>ばして そりゃあ<ruby>愛<rt>あい</rt></ruby>への<ruby>罰<rt>ばつ</rt></ruby>だ",
  "[clap]もう、怒り願った言葉は 崩れ、へたってしまったが": "[clap]もう、<ruby>怒<rt>いか</rt></ruby>り<ruby>願<rt>ねが</rt></ruby>った<ruby>言葉<rt>ことば</rt></ruby>は <ruby>崩<rt>くず</rt></ruby>れ、へたってしまったが",
  "[wave]もう怒りよ今悪党ぶっ飛ばしてそりゃあ愛ある罰だ": "[wave]もう<ruby>怒<rt>いか</rt></ruby>りよ<ruby>今<rt>いま</rt></ruby><ruby>悪党<rt>あくとう</rt></ruby>ぶっ<ruby>飛<rt>と</rt></ruby>ばしてそりゃあ<ruby>愛<rt>あい</rt></ruby>ある<ruby>罰<rt>ばつ</rt></ruby>だ",

  // NEO JAPAN — https://utaten.com/lyric/mi23111349/
  "ある日気づいた、根付いた 岸辺の球根 根回し手回し": "ある<ruby>日<rt>ひ</rt></ruby><ruby>気<rt>き</rt></ruby>づいた、<ruby>根付<rt>ねづ</rt></ruby>いた <ruby>岸辺<rt>きしべ</rt></ruby>の<ruby>球根<rt>きゅうこん</rt></ruby> <ruby>根回<rt>ねまわ</rt></ruby>し<ruby>手回<rt>てまわ</rt></ruby>し",
  "足りぬと、税の倍増 を総称は心の保証と": "<ruby>足<rt>た</rt></ruby>りぬと、<ruby>税<rt>みつぎ</rt></ruby>の<ruby>倍増<rt>ばいぞう</rt></ruby> を<ruby>総称<rt>そうしょう</rt></ruby>は<ruby>心<rt>こころ</rt></ruby>の<ruby>保証<rt>ほしょう</rt></ruby>と",
  "その角のないリリックに踊らされ": "その<ruby>角<rt>かど</rt></ruby>のないリリックに<ruby>踊<rt>おど</rt></ruby>らされ",
  "後はポップなアッパーで煽るだけ": "<ruby>後<rt>あと</rt></ruby>はポップなアッパーで<ruby>煽<rt>あお</rt></ruby>るだけ",
  "否 気づかぬが仏、みな身につけるわ": "<ruby>否<rt>いな</rt></ruby> <ruby>気<rt>き</rt></ruby>づかぬが<ruby>仏<rt>ほとけ</rt></ruby>、みな<ruby>身<rt>み</rt></ruby>につけるわ",
  "自動で 手掴み、刷り込み、他動作動、Flow": "<ruby>自動<rt>じどう</rt></ruby>で <ruby>手掴<rt>てづか</rt></ruby>み、<ruby>刷<rt>す</rt></ruby>り<ruby>込<rt>こ</rt></ruby>み、<ruby>他動<rt>たどう</rt></ruby><ruby>作動<rt>さどう</rt></ruby>、Flow",
  "今 妄想厨から逃走中 にでたヴァンパイア": "<ruby>今<rt>いま</rt></ruby> <ruby>妄想<rt>もうそう</rt></ruby><ruby>厨<rt>ちゅう</rt></ruby>から<ruby>逃走<rt>とうそう</rt></ruby><ruby>中<rt>ちゅう</rt></ruby> にでたヴァンパイア",

  // 一直都是情歌 (ずっとラブソング) — https://utaten.com/lyric/mi25100129/
  "[wave]だから今夜": "[wave]だから<ruby>今夜<rt>こんや</rt></ruby>",
  "この街に落ちて来るっていう事 君に教えたなら Oh...": "この<ruby>街<rt>まち</rt></ruby>に<ruby>落<rt>お</rt></ruby>ちて<ruby>来<rt>く</rt></ruby>るっていう<ruby>事<rt>こと</rt></ruby> <ruby>君<rt>きみ</rt></ruby>に<ruby>教<rt>おし</rt></ruby>えたなら Oh...",
  "怒るのは後にしてくれよBaby": "<ruby>怒<rt>おこ</rt></ruby>るのは<ruby>後<rt>あと</rt></ruby>にしてくれよBaby",

  // 偉生人 (偉生人) — https://utaten.com/lyric/mi25102305/
  "[clap]僕ら昔は灯台の下を探す子供のまま生きてた": "[clap]<ruby>僕<rt>ぼく</rt></ruby>ら<ruby>昔<rt>むかし</rt></ruby>は<ruby>灯台<rt>とうだい</rt></ruby>の<ruby>下<rt>もと</rt></ruby>を<ruby>探<rt>さが</rt></ruby>す<ruby>子供<rt>こども</rt></ruby>のまま<ruby>生<rt>い</rt></ruby>きてた",
  "[clap]今もそんなに変わってないみたいだ": "[clap]<ruby>今<rt>いま</rt></ruby>もそんなに<ruby>変<rt>か</rt></ruby>わってないみたいだ",
  "[clap]そんな僕らは何千と違う心に穴を開けて生きてた": "[clap]そんな<ruby>僕<rt>ぼく</rt></ruby>らは<ruby>何千<rt>なんぜん</rt></ruby>と<ruby>違<rt>たが</rt></ruby>う<ruby>心<rt>こころ</rt></ruby>に<ruby>穴<rt>あな</rt></ruby>を<ruby>開<rt>あ</rt></ruby>けて<ruby>生<rt>い</rt></ruby>きてた",
  "もう、笑っていこうぜ": "もう、<ruby>笑<rt>わら</rt></ruby>っていこうぜ",

  // 那樣的 bitter 故事 (そんなbitterな話) — https://utaten.com/lyric/hw23032236/
  "[wave]愛おしいのさ": "[wave]<ruby>愛<rt>いと</rt></ruby>おしいのさ",
  "颯爽と火傷しな でも会話はまだ続けるぜ": "<ruby>颯爽<rt>さっそう</rt></ruby>と<ruby>火傷<rt>やけど</rt></ruby>しな でも<ruby>会話<rt>かいわ</rt></ruby>はまだ<ruby>続<rt>つづ</rt></ruby>けるぜ",
  "そんなことじゃあ ラブコメみたいな2人を": "そんなことじゃあ ラブコメみたいな<ruby>2人<rt>ふたり</rt></ruby>を",
  "濃い刺激食らった その味蕾が​": "<ruby>濃<rt>こ</rt></ruby>い<ruby>刺激<rt>しげき</rt></ruby><ruby>食<rt>く</rt></ruby>らった その<ruby>味蕾<rt>みらい</rt></ruby>が​",
  "[wave]愛おしいのさ​": "[wave]<ruby>愛<rt>いと</rt></ruby>おしいのさ​",

  // 風神 (風神) — https://utaten.com/lyric/mi24100822/
  "静観がキメの一手なんだって": "<ruby>静観<rt>せいかん</rt></ruby>がキメの<ruby>一手<rt>いって</rt></ruby>なんだって",
  "[clap]ジリジリ 頬つたって痛いよ": "[clap]ジリジリ <ruby>頬<rt>ほほ</rt></ruby>つたって<ruby>痛<rt>いた</rt></ruby>いよ",
  "食わず嫌いがキメの一手だったって": "<ruby>食<rt>く</rt></ruby>わず<ruby>嫌<rt>ぎら</rt></ruby>いがキメの<ruby>一手<rt>いって</rt></ruby>だったって",

  // 常熱 (常熱) — https://utaten.com/lyric/mi23111345/
  "[wave]常熱を その鼓動に毎日あげるから」": "[wave]<ruby>常熱<rt>じょうねつ</rt></ruby>を その<ruby>鼓動<rt>こどう</rt></ruby>に<ruby>毎日<rt>まいにち</rt></ruby>あげるから」",
  "[clap]脳圧満たして またもう夢見心地さ": "[clap]<ruby>脳圧<rt>のうあつ</rt></ruby><ruby>満<rt>み</rt></ruby>たして またもう<ruby>夢見心地<rt>ゆめみごこち</rt></ruby>さ",

  // 陽炎 (かげろう) — https://utaten.com/lyric/sz26060802/
  "おどけた魂が俺を帰せる幻。": "おどけた<ruby>魂<rt>たましい</rt></ruby>が<ruby>俺<rt>おれ</rt></ruby>を<ruby>帰<rt>き</rt></ruby>せる<ruby>幻<rt>まぼろし</rt></ruby>。",
  "焚き付け織火光る童は 追いつけない。": "<ruby>焚<rt>た</rt></ruby>き<ruby>付<rt>つ</rt></ruby>け<ruby>織火<rt>おきび</rt></ruby><ruby>光<rt>ひか</rt></ruby>る<ruby>童<rt>わらべ</rt></ruby>は <ruby>追<rt>お</rt></ruby>いつけない。",
  "[wave]ベランダに落ちた烏が 咲かせた花か": "[wave]ベランダに<ruby>落<rt>お</rt></ruby>ちた<ruby>烏<rt>とり</rt></ruby>が <ruby>咲<rt>さ</rt></ruby>かせた<ruby>花<rt>はな</rt></ruby>か",
  "肩透かしで避けてた矢尻じゃ 突き抜けない。": "<ruby>肩透<rt>かたす</rt></ruby>かしで<ruby>避<rt>よ</rt></ruby>けてた<ruby>矢尻<rt>やじり</rt></ruby>じゃ <ruby>突<rt>つ</rt></ruby>き<ruby>抜<rt>ぬ</rt></ruby>けない。",
  "[wave]この涙何のために流せばいい": "[wave]この<ruby>涙<rt>なみだ</rt></ruby><ruby>何<rt>なん</rt></ruby>のために<ruby>流<rt>なが</rt></ruby>せばいい",

  // 理念滿溢而無法入睡 (イデアが溢れて眠れない) — https://utaten.com/lyric/sz26033006/
  "「全てを失ったその後で": "「<ruby>全<rt>すべ</rt></ruby>てを<ruby>失<rt>うしな</rt></ruby>ったその<ruby>後<rt>あと</rt></ruby>で",
  "[wave]この 天井の先、星々の先、宇宙の先、銀河を超えて": "[wave]この <ruby>天井<rt>てんじょう</rt></ruby>の<ruby>先<rt>さき</rt></ruby>、<ruby>星々<rt>ほしぼし</rt></ruby>の<ruby>先<rt>さき</rt></ruby>、<ruby>宇宙<rt>うちゅう</rt></ruby>の<ruby>先<rt>さき</rt></ruby>、<ruby>銀河<rt>ぎんが</rt></ruby>を<ruby>超<rt>こ</rt></ruby>えて",
  "[wave]僕の瞼流る 軌道はいつも同じ": "[wave]<ruby>僕<rt>ぼく</rt></ruby>の<ruby>瞼流<rt>まぶたなが</rt></ruby>る <ruby>軌道<rt>きどう</rt></ruby>はいつも<ruby>同<rt>おな</rt></ruby>じ",
  "[wave]この 天井の光、星々の光、宇宙の光、銀河を超えて": "[wave]この <ruby>天井<rt>てんじょう</rt></ruby>の<ruby>光<rt>ひかり</rt></ruby>、<ruby>星々<rt>ほしぼし</rt></ruby>の<ruby>光<rt>ひかり</rt></ruby>、<ruby>宇宙<rt>うちゅう</rt></ruby>の<ruby>光<rt>ひかり</rt></ruby>、<ruby>銀河<rt>ぎんが</rt></ruby>を<ruby>超<rt>こ</rt></ruby>えて",

  // 飛翔之時 (飛ぶ時) — https://utaten.com/lyric/sz26020427/
  "[wave](jump)怖くない、この夜空で 明日を目指す": "[wave](jump)<ruby>怖<rt>こわ</rt></ruby>くない、この<ruby>夜空<rt>よぞら</rt></ruby>で <ruby>明日<rt>あす</rt></ruby>を<ruby>目指<rt>めざ</rt></ruby>す",

  // 為瞳孔著迷 (瞳惚れ) — https://utaten.com/lyric/ym22110116/
  "[wave]今虜になっていく": "[wave]<ruby>今<rt>いま</rt></ruby><ruby>虜<rt>とりこ</rt></ruby>になっていく",
  "[wave]滑り込んできた小悪魔も": "[wave]<ruby>滑<rt>すべ</rt></ruby>り<ruby>込<rt>こ</rt></ruby>んできた<ruby>小悪魔<rt>こあくま</rt></ruby>も",
  "[wave]それは瞳惚れ": "[wave]それは<ruby>瞳<rt>ひとみ</rt></ruby><ruby>惚<rt>ぼ</rt></ruby>れ",

  // 世界的秘密 (世界の秘密) — https://utaten.com/lyric/tt21012509/
  "[clap]これが良い事か悪い事か": "[clap]これが<ruby>良<rt>い</rt></ruby>い<ruby>事<rt>こと</rt></ruby>か<ruby>悪<rt>わる</rt></ruby>い<ruby>事<rt>こと</rt></ruby>か",

  // 時間悖論 (タイムパラドックス) — https://utaten.com/lyric/hw24011202/
  "[clap]どうしても一人じゃ使えないのさ": "[clap]どうしても<ruby>一人<rt>ひとり</rt></ruby>じゃ<ruby>使<rt>つか</rt></ruby>えないのさ",

  // 最後一擊 (トドメの一撃) — https://utaten.com/lyric/tt23092503/
  "密度高め万年を照らす光の矢を放つ、穿つ": "<ruby>密度<rt>みつど</rt></ruby><ruby>高<rt>たか</rt></ruby>め<ruby>万<rt>まん</rt></ruby><ruby>年<rt>ねん</rt></ruby>を<ruby>照<rt>て</rt></ruby>らす<ruby>光の矢<rt>ほーぷ</rt></ruby>を<ruby>放<rt>はな</rt></ruby>つ、<ruby>穿<rt>うが</rt></ruby>つ",
  "見えず匂わぬ、違えぬ未来が": "<ruby>見<rt>み</rt></ruby>えず<ruby>匂<rt>にお</rt></ruby>わぬ、<ruby>違<rt>たが</rt></ruby>えぬ<ruby>未来<rt>みらい</rt></ruby>が",
  "背中を突いた！": "<ruby>背中<rt>せなか</rt></ruby>を<ruby>突<rt>つ</rt></ruby>いた！",
  "それは散らばるミクロ砂金": "それは<ruby>散<rt>ち</rt></ruby>らばるミクロ<ruby>砂金<rt>さきん</rt></ruby>",
  "偽物じゃできないよね": "<ruby>偽物<rt>にせもの</rt></ruby>じゃできないよね",
  "[wave]明日の夜も守れますように": "[wave]<ruby>明日<rt>あす</rt></ruby>の<ruby>夜<rt>よる</rt></ruby>も<ruby>守<rt>まも</rt></ruby>れますように"
});

export const ROMAJI_CORRECTIONS = Object.freeze({
  "[clap]聞かせてくれよ 聞きたいんだ": "[clap]kika se te kure yo kiki tai n da",
  "[wave]愛で": "[wave]ai de",
  "[wave]揺れる世界の中で僕達は": "[wave]yureru sekai no naka de bokutachi wa",
  "[wave]揺れる世界の中を僕達は": "[wave]yureru sekai no naka o bokutachi wa",
  "[wave]靡く世界の中で僕達は": "[wave]nabiku sekai no naka de bokutachi wa",
  "[wave]靡く世界の中を僕達は": "[wave]nabiku sekai no naka o bokutachi wa",
  "[wave]キスをしあって生きている": "[wave]kisu o shi atte iki te iru",
  "手を取り合っている": "te o tori atte iru",
  "目を合わせあって生きる": "me o awase atte iki ru",
  "[clap]どこにいっても": "[clap]doko ni itte mo",
  "行き詰まりそして息道理を": "ikizumari soshite iki dōri o",
  "[clap]そんな劣等も葛藤もみんな持ってる": "[clap]sonna rettō mo kattō mo minna motteru",
  "その理由は同じ": "sono riyū wa onaji",
  "[clap]また回る世界に飲まれている": "[clap]mata mawaru sekai ni noma re te iru",
  "それも理由は同じ": "sore mo riyū wa onaji",
  "[clap]それ、なに、甘い理想に": "[clap]sore, nani, amai risō ni",
  "落ちる": "ochiru",
  "[clap]それ、なに、辛い日々に": "[clap]sore, nani, tsurai hibi ni",
  "沈む": "shizumu",
  "[wave]なぁなんて美しい世界だ": "[wave]nā nante utsukushii sekai da",
  "僕ら何度裏切りあっていても": "bokura nan do uragiri atte i te mo",
  "[clap]あれ、なに、わからないよ": "[clap]are, nani, wakara nai yo",
  "[clap]それ、なに、甘い理想に落ちる": "[clap]sore, nani, amai risō ni ochiru",
  "[clap]それ、なに、辛い日々に沈む": "[clap]sore, nani, tsurai hibi ni shizumu",
  "思い出すこともなくなって しまうんだろう しまうんだろうって": "omoidasu koto mo nakunatte shimau n darō shimau n darō tte",
  "[wave]ホムンクルス!": "[wave]homunkurusu!",
  "[wave]イデアが溢れて眠れない x 4": "[wave]idea ga afure te nemure nai x 4",
  "もっと": "motto",

  /* Lines split out of the generated table still need their own exact key.
     Keep these line-level so a reading such as 君 can vary safely by context. */
  "[wave]それは、軽やかな魔法": "[wave]sore wa, karoyaka na mahō",
  "涙流して笑えばいいさ": "namida nagashi te warae ba ii sa",
  "あくびしてる暇なんかないぜ": "akubi shi teru hima nanka nai ze",
  "[wave]ほら、ほらもっと聞かせて": "[wave]hora, hora motto kika se te",
  "[wave]それは、鮮やかな魔法": "[wave]sore wa, azayaka na mahō",
  "震え出す その線のせいで 動き出してしまうの (しまうの)": "furue dasu sono sen no sei de ugokidashi te shimau no (shimau no)",
  "[wave]止まれないのは": "[wave]tomare nai no wa",
  "[wave]ときめきのせい": "[wave]tokimeki no sei",

  "[wave]君がいつも": "[wave]kimi ga itsumo",
  "歌う怪獣の歌": "utau kaijū no uta",
  "[wave]ねぇ、もっと": "[wave]nē, motto",
  "ねぇ 僕ら": "nē bokura",
  "[wave]眠れない夜に": "[wave]nemure nai yoru ni",
  "手を伸ばして": "te o nobashi te",
  "[wave]眠らない夜を": "[wave]nemura nai yoru o",
  "また伸ばして": "mata nobashi te",
  "[wave]眠くないまだね": "[wave]nemuku nai mada ne",
  "そんな日々でいたいのにな 懲りずに": "sonna hibi de i tai noni na kori zu ni",
  "そんな夜に歌う 怪獣の歌": "sonna yoru ni utau kaijū no uta",

  "全てをかき消してengine音": "subete o kakikeshi te engine on",
  "[wave]舌鳴らし今 錆び付け黒く": "[wave]shita narashi ima sabitsuke kuroku",
  "[clap]使った愛の手！": "[clap]tsukatta ai no te!",
  "(ハイッ ハイッ)": "(hai hai)",
  "[wave]CHAINSAW is 使える愛の手": "[wave]CHAINSAW is tsukaeru ai no te",
  "(あ？なんだって？)": "(a? nan datte?)",
  "[wave]歯軋りで、ほら 焼き付く赤く": "[wave]hagishiri de, hora yakitsuku akaku",
  "[clap]須くengineかき鳴らした": "[clap]subekaraku engine kakinarashita",

  "とぅるるる とぅるるる とぅるる x 4": "turururu turururu tururu x 4",
  "とぅるるる とぅるるる とぅるる x 8": "turururu turururu tururu x 8",

  "[wave]寂しくなるよだからいつまでも": "[wave]sabishiku naru yo dakara itsu made mo",
  "今 チェンジ": "ima chenji",
  "[wave]僕らまだ不確かな未来歌えるよ": "[wave]bokura mada futashika na mirai utaeru yo",
  "チェンジ": "chenji",
  "[wave]このままこの続きを": "[wave]kono mama kono tsuzuki o",
  "今 チェンジ x 4": "ima chenji x4",
  "[wave]伸ばして僕ら今確かに、未来歌えるよ": "[wave]nobashi te bokura ima tashika ni, mirai utaeru yo",
  "[wave]どんな夜も Ah~": "[wave]donna yoru mo Ah ~",
  "今チェンジ x 5": "ima chenji x5",

  "[clap]何度も声を上げて何度も声を上げて": "[clap]nan do mo koe o age te nan do mo koe o age te",
  "ねぇ": "nē",
  "[wave]けどまだ": "[wave]kedo mada",
  "どうしようここにいようか": "dō shiyō koko ni iyō ka",
  "しまうんだろう しまうんだろうって": "shimau n darō shimau n darō tte",
  "また しわをあわせて": "mata shiwa o awase te",

  "[wave]行くぜ喝采気は満ちた": "[wave]iku ze kassai ki wa michi ta",
  "あれは": "are wa",
  "ホムンクルス!": "homunkurusu!",
  "[wave]行くぜ喝采俺が来た": "[wave]iku ze kassai ore ga ki ta",
  "これが": "kore ga",
  "[wave]そこに見たんだよ": "[wave]soko ni mi ta n da yo",
  "[wave]確かめ合うかより": "[wave]tashikame au ka yori",
  "大切で": "taisetsu de",
  "[wave]思い合えるより": "[wave]omoi aeru yori",
  "温かくて": "atatakaku te",
  "[wave]振り剥がせるかより": "[wave]furi haga seru ka yori",
  "愚かに、浸ってしまうほど": "oroka ni, hitatte shimau hodo",
  "[wave]時に歩み合うかより": "[wave]tokini ayumi au ka yori",
  "[wave]抱きしめ合えるより": "[wave]dakishime aeru yori",
  "温かく思う未来を見たいんだよ": "atatakaku omou mirai o mi tai n da yo",

  "[clap]で、まぁいいかな": "[clap]de, mā ii ka na",
  "[clap]このくらいがちょうどいいかなって": "[clap]kono kurai ga chōdo ii ka natte",
  "[clap]で、まぁいいから": "[clap]de, mā ii kara",
  "[clap]ぁあ、まぁいいからそんなことはどうでもいいからって?": "[clap]āa, mā ii kara sonna koto wa dō demo ii kara tte?",

  "相槌がうまくなったんだ": "aizuchi ga umaku natta n da",
  "できてるできてる": "deki teru deki teru",
  "わるくないわるくない": "waruku nai waruku nai",
  "あぁ、もういいのかい": "ā, mō ii no kai",
  "[wave]どこへ行こうどこへ行こう": "[wave]doko e ikō doko e ikō",
  "変わらないよ": "kawara nai yo",
  "断崖絶壁で愛していた": "dangaizeppeki de aishi te i ta",
  "あぁ、もういいよ": "ā, mō ii yo",

  "Napori ずっといたいよ": "Napori zutto i tai yo",
  "[clap]あんたらわかっちゃないだろ": "[clap]antara wakatcha nai darō",
  " ディストピア x 6": " disutopia x 6",
  "ディストピア x 6": "disutopia x 6",

  "[wave]だから今夜": "[wave]dakara kon'ya",
  "キャトルミューティレイション": "kyatorumyūtireishon",
  "[wave]キャトルミューティレイション": "[wave]kyatorumyūtireishon",
  "「ずっとラブソング」さ": "\" zutto rabusongu \" sa",
  "oh yeah~ 「ずっとラブソング」~": "oh yeah~ \" zutto rabusongu \"~",

  "[clap]今もそんなに変わってないみたいだ": "[clap]ima mo sonnani kawatte nai mitai da",
  "ふふふ": "fufufu",
  "ねぇどうだい": "nē dō dai",
  "もう、笑っていこうぜ": "mō, waratte ikō ze",
  "[wave]ああもうつかれちまったろ": "[wave]ā mō tsukare chimatta ro",

  "そんなことじゃあ ラブコメみたいなくだりで": "sonna koto jaa rabukome mitai na kudari de",
  "それはもちろんhot and black": "sore wa mochiron hot and black",
  "いうんだよ これはそう​": "iu n da yo kore wa sō​",
  "[clap]でもね トクトク あたたかいね": "[clap]demo ne toku toku atatakai ne",
  "それでこのぬくもりに": "sore de kono nukumori ni",
  "[clap]してたような": "[clap]shi te ta yō na",

  "[wave](jump)それじゃまた": "[wave](jump)sore ja mata",
  "[wave]されどイメージしたのは": "[wave]saredo imēji shi ta no wa",
  "きっと": "kitto",
  "つーんと": "tsūn to",
  "もしも": "moshimo",
  "それは": "sore wa",
  "[wave]それはトキメクパッションで": "[wave]sore wa tokimeku passhon de",
  "[clap]しまいそうなほど": "[clap]shimaisō na hodo",

  "[clap]ブレイクできるはず だから": "[clap]bureiku dekiru hazu dakara",
  "[clap]ブレイクできるはず そうだろ？": "[clap]bureiku dekiru hazu sō daro?",
  "[clap]ステップだけ x 4": "[clap]suteppu dake x4",
  "[clap]ねぇ ほら しまっておきなよ": "[clap]nē hora shimatte oki na yo",
  "背中を突いた！": "senaka o tsui ta!",
  "[wave]だから": "[wave]dakara",
  "[wave]こっちにきてもっと": "[wave]kocchi ni ki te motto",
  "[wave]やっぱりやめとくわ": "[wave]yappari yame toku wa",
  "こういうのとか そういうのとか": "kō iu no toka sō iu no toka",
  "偽物じゃできないよね": "nisemono ja deki nai yo ne",
  "[wave]ワタシにさせて": "[wave]watashi ni sase te",

  // CHAINSAW BLOOD — https://utaten.com/lyric/hw22092012/
  "[clap]弾む鼓動は刻むclap無しで": "[clap]hazumu bīto wa kizamu clap nashi de",
  "[clap]忘れたいほど怒るchain回して": "[clap]wasure tai hodo ikaru chain mawashi te",
  "[clap]笑かしたbadなschemeを食ってしまう紳士": "[clap]warakashita bad na scheme o kutte shimau shinshi",
  "[wave]弾む鼓動は歪むclean toneで": "[wave]hazumu bīto wa hizumu clean tone de",

  // 乘著戀愛感冒 (恋風邪にのせて) — https://utaten.com/lyric/tt22013105/
  "[clap]二人 目をそらして気付いたの ": "[clap]futari me o sorashi te kizui ta no",
  "[wave]そっと二人 魔法を唱えるの 恋風邪にのせて": "[wave]sotto futari mahō o tonaeru no koi kaze ni nose te",
  "[clap]二人 目を凝らして気付いたの": "[clap]futari me o korashi te kizui ta no",
  "[wave]そっと二人 魔法を唱えるの": "[wave]sotto futari mahō o tonaeru no",
  "[clap]言葉が深める惑星の夜に今": "[clap]kotoba ga fukameru hoshi no yoru ni ima",
  "[clap]やっと二人 目を合わせて気付いたの": "[clap]yatto futari me o awase te kizui ta no",

  // 舞者 (踊り子) — https://utaten.com/lyric/ma21111952/
  "[clap]思いを蹴って 二人でしてんだ": "[clap]omoi o kette futari deshi te n da",
  "[clap]壊れない愛を歌う 言葉を二人に課して": "[clap]wasure nai ai o utau kotoba o futari ni kashi te",

  // 裸身勇者 (裸の勇者) — https://utaten.com/lyric/ma22011710/
  "力が伴う 悪意振り解いて": "chikara ga tomonau akui furihodoite",
  "それは涙と対になって 悲しみと力となって": "sore wa namida to tsui ni natte kanashimi to chikara to natte",
  "そこは涙と対になって 滾りが溢れかえって": "soko wa namida to tsui ni natte tagiri ga afure kaette",
  "[clap]誰もが求めた剣はこの誰かが残してった鈍が": "[clap]dare mo ga motome ta tsurugi wa kono dareka ga nokoshitetta namakura ga",
  "[clap]この誰かが残してった鈍が闇を裂いてしまう前に": "[clap]kono dareka ga nokoshitetta namakura ga yami o sai te shimau mae ni",
  "[wave]力が伴う悪意振り解いて耳は聞こえちゃいない": "[wave]chikara ga tomonau akui furihodoite mimi wa kikoe cha i nai",
  "[wave]だが勇者は今力はいらない身に任せて": "[wave]daga yūsha wa ima chikara wa ira nai mi ni makase te",

  // 不可幸力 (不可幸力) — https://utaten.com/lyric/un20092501/
  "[clap]なんでもかんでも欲しがる世界じゃない？": "[clap]nan demo kan de mo hoshi garu sekai ja nai?",
  "[wave]みんな心の中までイカレちまっている": "[wave]minna kokoro no naka made ika re chimatte iru",
  "[wave]みんな心の中から弱って朽ちていく": "[wave]minna kokoro no naka kara yowatte kuchi te iku",

  // 重逢 (再会) — https://utaten.com/lyric/ks25060301/
  "[clap]超TRY 光を貸してbody": "[clap]sūpā TRY hikari o kashi te body",
  "[wave]この先は一瞬も一寸の隅も": "[wave]kono saki wa isshun mo issun no suki mo",
  "[wave]君に出会えるからまた夏で話そう": "[wave]kimi ni deaeru kara mata koko de hanasō",
  "[clap]超HIGHもうすでに力んでるマジ": "[clap]sūpā HIGH mō sudeni rikin deru maji",
  "在処など僕が知らなかったら": "arika nado boku ga shira nakattara",
  "[wave]これまでの一瞬も一寸の隅も": "[wave]kore made no isshun mo issun no suki mo",

  // 花占卜 (花占い) — https://utaten.com/lyric/hw21061809/
  "[clap]街の夕焼けに溶けた僕たちはまだニ人だろうか": "[clap]machi no yūyake ni toke ta boku tachi wa mada futari darō ka",
  "[clap]恋路の果てには何があるくだらない話をニ人でしよう": "[clap]koiji no hate ni wa nani ga aru kudaranai hanashi o futari de shiyō",
  "[wave]僕達は千年後もまだ同じ様にまってんだ笑っちゃうよね": "[wave]bokutachi wa sen nen go mo mada onaji yō ni matten da waratchau yo ne",
  "[clap]2人がたっている永劫を": "[clap]futari ga tatte iru eigō o",
  "[clap]願いは君との先にあるたわいない話を2人でしよう": "[clap]negai wa kimi to no saki ni aru tawainai hanashi o futari de shiyō",
  "花占う恋歌": "hana uranau renka",
  "[clap]ニ人でちぎった花に願いを込めて": "[clap]futari de chigitta hana ni negai o kome te",

  // 呼喚聲 (呼び声) — https://utaten.com/lyric/hw25121002/
  "[clap]この惑星の真ん中で": "[clap]kono hoshi no mannaka de",
  "[clap]時折り描いた暗闇照らす何か": "[clap]tokiori kaita kurayami terasu nani ka",
  "[clap]この部屋を立ち籠めている何か": "[clap]kono heya o tachikomete iru nani ka",
  "[clap]それは紅色の記憶のような": "[clap]sore wa beni iro no kioku no yō na",
  "[wave]どんな夜も輝いて消": "[wave]donna yoru mo kagayai te ki",
  "[wave]ほら待ってるよ 「今チェンジ」": "[wave]hora matteru yo \" ima chenji \"",
  "[clap]余さず描いた立ち籠めていた何か": "[clap]amasa zu kaita tachikomete i ta nani ka",
  "[clap]まだ紅色幕開け前か": "[clap]mada beni iro makuake mae ka",
  "[wave]声武者震いは「今チェンジ」": "[wave]koe mushaburui wa \" ima chenji \"",
  "[clap]僕ら今確かに、見上げているはず": "[clap]bokura ima tashika ni, miage te iru hazu",

  // 燈火 (灯火) — https://utaten.com/lyric/nm20050702/
  "[clap]完璧な理想郷など僕らにはあり得はしないから": "[clap]kampeki na risōkyō nado bokura ni wa ari e wa shi nai kara",
  "[clap]ありもしない滑走路羽を広げ走る": "[clap]ari mo shi nai kassōro hane o hiroge hashiru",
  "[wave]どうしようどこへ行こうか僕が今惨憺と声に出して": "[wave]dō shiyō doko e ikō ka boku ga ima santan to koe ni dashi te",

  // 我怎麼會知道呢 (僕にはどうしてわかるんだろう) — https://utaten.com/lyric/hw25040809/
  "小さなプライドの行方を探したずっと気づけなかったんだ": "chīsana puraido no yukue o sagashi ta zutto kizuke nakatta n da",
  "時は真夏荒天と海神蒼炎際立つ": "toki wa manatsu kōten to wadatsumi sōen kiwadatsu",
  "骨相青に溶けモノクロは焦シアン蒼白へ": "kossō ao ni toke monokuro wa sō shian sōhaku e",
  "[wave]全てのことがまるで明くる前のよう": "[wave]subete no koto ga marude akuru mae no yō",

  // 皺褶相合 (しわあわせ) — https://utaten.com/lyric/ma21041401/
  "絵に描いたような君の綺麗な心臓を": "e ni kaita yō na kimi no kirei na shinzō o",
  "透き通るような君の綺麗な一拍を": "sukitōru yō na kimi no kirei na ippaku o",
  "重なるひびを僕達は流るるひびも僕達は": "kasanaru hibi o bokutachi wa nagaruru hibi mo bokutachi wa",

  // 人造小人 (ホムンクルス) — https://utaten.com/lyric/hw24061821/
  "[clap]小さくても次第にグツグツ煮立って終いにゃ それを鼓舞する": "[clap]chīsaku te mo shidaini gutsugutsu nietatte shimai nya sore o kobu suru",
  "[wave]ヨン で開幕起爆、解放万歳": "[wave]yon de kaimaku kibaku, kaihō banzai",
  "[wave]風の目の方に歩き出す脱、言念、且つ自暴論": "[wave]kaze no me no hō ni aruki dasu datsu, gon nen, katsu jibō ron",
  "[clap]今肩でも揉むよダーリン": "[clap]ima kata demo momu yo dārin",
  "[clap]風の目の方に歩き出す脱、言念、且つ自暴論": "[clap]kaze no me no hō ni aruki dasu datsu, gon nen, katsu jibō ron",

  // soramimi — https://utaten.com/lyric/nm20052727/
  "[clap]そのエロい体を貸してくれ": "[clap]sono eroi karada o kashi te kure",
  "[clap]1発打ったこのビートを鳴らしてよさぁ": "[clap]ippatsu utta kono bīto o narashi te yo sā",
  "[clap]だいたいそんなもん自己満たちが踊る世界だもん": "[clap]daitai sonna mon jiko man tachi ga odoru sekai da mon",

  // 東京 Flash (東京フラッシュ) — https://utaten.com/lyric/rq20061008/
  "[wave]東京フラッシュ君の目が覚めたら": "[wave]tōkyō furasshu kimi no me ga same tara",
  "[wave]東京フラッシュ君と手を繋いだら": "[wave]tōkyō furasshu kimi to te o tsunai dara",

  // 哭泣地藏 (泣き地蔵) — https://utaten.com/lyric/hw21072901/
  "もう精一杯をもう一回 ねぇ神様もういいだろって": "mō seiippai o mō ikkai nē kamisama mō ii daro tte",
  "ねぇもう一回を精一杯": "nē mō ikkai o seiippai",
  "知らぬ仏より馴染みの地獄で": "shira nu hotoke yori najimi no jigoku de",
  "[wave]でもずっと願うほどの夢じゃなかった気がして": "[wave]demo zutto negau hodo no yume ja nakatta ki ga shi te",

  // napori — https://utaten.com/lyric/nm20052728/
  "ろくな音楽もなくてそんなひびをまた2人で": "rokuna ongaku mo naku te sonna hibi o mata futari de",
  "僕ら指にラブソングで今夜も二人で歩いてこ": "bokura yubi ni rabusongu de kon'ya mo futari de arui te ko",
  "2人になって 君を待って思い出したんだ思い出したんだ": "futari ni natte kimi o matte omoidashi ta n da omoidashi ta n da",
  "あれは縁そっと flight": "are wa beri sotto flight",
  "いずれ縁そっと flight": "izure beri sotto flight",
  "君と 縁そっと flight": "kimi to beri sotto flight",
  "二人はキスをする": "futari wa kisu o suru",
  "そんな僕の横でハイボールを1口": "sonna boku no yoko de haibōru o hitokuchi",

  // 逆光 (逆光) — https://utaten.com/lyric/mi23111348/
  "[wave]怒りよ今悪党ぶっ飛ばしてそりゃあ愛ある罰だ": "[wave]ikari yo ima akutō buttobashi te soryā ai aru batsu da",
  "[wave]そう 怒りよ今 悪党蹴り飛ばして そりゃあ愛への罰だ": "[wave]sō ikari yo ima akutō keri tobashi te soryā ai e no batsu da",
  "[clap]もう、怒り願った言葉は 崩れ、へたってしまったが": "[clap]mō, ikari negatta kotoba wa kuzure, hetatte shimatta ga",
  "[wave]もう怒りよ今悪党ぶっ飛ばしてそりゃあ愛ある罰だ": "[wave]mō ikari yo ima akutō buttobashi te soryā ai aru batsu da",

  // NEO JAPAN — https://utaten.com/lyric/mi23111349/
  "ある日気づいた、根付いた 岸辺の球根 根回し手回し": "aru hi kizui ta, nezui ta kishibe no kyūkon nemawashi temawashi",
  "足りぬと、税の倍増 を総称は心の保証と": "tari nu to, mitsugi no baizō o sōshō wa kokoro no hoshō to",
  "その角のないリリックに踊らされ": "sono kado no nai ririkku ni odora sa re",
  "後はポップなアッパーで煽るだけ": "ato wa poppu na appā de aoru dake",
  "否 気づかぬが仏、みな身につけるわ": "ina kizuka nu ga hotoke, mina mi ni tsukeru wa",
  "自動で 手掴み、刷り込み、他動作動、Flow": "jidō de tezukami, surikomi, tadō sadō, Flow",
  "今 妄想厨から逃走中 にでたヴァンパイア": "ima mōsō chū kara tōsō chū ni de ta vampaia",

  // 一直都是情歌 (ずっとラブソング) — https://utaten.com/lyric/mi25100129/
  "この街に落ちて来るっていう事 君に教えたなら Oh...": "kono machi ni ochi te kuru tteyuu koto kimi ni oshie ta nara Oh...",
  "怒るのは後にしてくれよBaby": "okoru no wa ato ni shi te kure yo Baby",

  // 偉生人 (偉生人) — https://utaten.com/lyric/mi25102305/
  "[clap]僕ら昔は灯台の下を探す子供のまま生きてた": "[clap]bokura mukashi wa tōdai no moto o sagasu kodomo no mama iki te ta",
  "[clap]そんな僕らは何千と違う心に穴を開けて生きてた": "[clap]sonna bokura wa nanzen to tagau kokoro ni ana o ake te iki te ta",
  "[wave]全然足りなかったような 悲しみが未来を": "[wave]zenzen tari nakatta yō na kanashimi ga mirai o",
  "[wave]全然足りなかったような 愛しさと未来を": "[wave]zenzen tari nakatta yō na itoshi sa to mirai o",
  "[clap]子供の頃は世界を守って精一杯 ただ、めいっぱいだった": "[clap]kodomo no koro wa sekai o mamotte seiippai tada, me ippai datta",

  // 那樣的 bitter 故事 (そんなbitterな話) — https://utaten.com/lyric/hw23032236/
  "[wave]愛おしいのさ": "[wave]itōshii no sa",
  "颯爽と火傷しな でも会話はまだ続けるぜ": "sassō to yakedo shina demo kaiwa wa mada tsuzukeru ze",
  "そんなことじゃあ ラブコメみたいな2人を": "sonna koto jā rabu kome mitai na futari o",
  "濃い刺激食らった その味蕾が​": "koi shigeki kuratta sono mirai ga ​",
  "[wave]愛おしいのさ​": "[wave]itōshii no sa ​",

  // 風神 (風神) — https://utaten.com/lyric/mi24100822/
  "静観がキメの一手なんだって": "seikan ga kime no itte na n datte",
  "[clap]ジリジリ 頬つたって痛いよ": "[clap]jirijiri hoho tsutatte itai yo",
  "食わず嫌いがキメの一手だったって": "kuwazugirai ga kime no itte datta tte",

  // 常熱 (常熱) — https://utaten.com/lyric/mi23111345/
  "[wave]常熱を その鼓動に毎日あげるから」": "[wave]jōnetsu o sono kodō ni mainichi ageru kara \"",
  "[clap]何重圧も肌に溶ける": "[clap]nan jūatsu mo hada ni tokeru",

  // 陽炎 (かげろう) — https://utaten.com/lyric/sz26060802/
  "おどけた魂が俺を帰せる幻。": "odoke ta tamashī ga ore o kiseru maboroshi.",
  "焚き付け織火光る童は 追いつけない。": "takitsuke okibi hikaru warabe wa oitsuke nai.",
  "[wave]ベランダに落ちた烏が 咲かせた花か": "[wave]beranda ni ochi ta tori ga sakase ta hana ka",
  "肩透かしで避けてた矢尻じゃ 突き抜けない。": "katasukashi de yoke te ta yajiri ja tsukinuke nai.",
  "[wave]この涙何のために流せばいい": "[wave]kono namida nan no tame ni nagase ba ii",
  "[wave]目にかかる砂煙が 魅せてった熱か": "[wave]me ni kakaru sunakemuri ga misetetta netsu ka",
  "[wave]目にかかる砂煙が 魅せてった熱よ": "[wave]me ni kakaru sunakemuri ga misetetta netsu yo",

  // 理念滿溢而無法入睡 (イデアが溢れて眠れない) — https://utaten.com/lyric/sz26033006/
  "「全てを失ったその後で": "\" subete o ushinatta sono ato de",
  "[wave]この 天井の先、星々の先、宇宙の先、銀河を超えて": "[wave]kono tenjō no saki, hoshiboshi no saki, uchū no saki, ginga o koe te",
  "[wave]僕の瞼流る 軌道はいつも同じ": "[wave]boku no mabuta nagaru kidō wa itsumo onaji",
  "[wave]この 天井の光、星々の光、宇宙の光、銀河を超えて": "[wave]kono tenjō no hikari, hoshiboshi no hikari, uchū no hikari, ginga o koe te",

  // 飛翔之時 (飛ぶ時) — https://utaten.com/lyric/sz26020427/
  "[wave]光飛び散った最中": "[wave]hikari tobichitta sanaka",
  "[wave](jump)怖くない、この夜空で 明日を目指す": "[wave](jump)kowaku nai, kono yozora de asu o mezasu",

  // 為瞳孔著迷 (瞳惚れ) — https://utaten.com/lyric/ym22110116/
  "[wave]今虜になっていく": "[wave]ima toriko ni natte iku",
  "[wave]滑り込んできた小悪魔も": "[wave]suberikon de ki ta koakuma mo",
  "[wave]それは瞳惚れ": "[wave]sore wa hitomibore",

  // 世界的秘密 (世界の秘密) — https://utaten.com/lyric/tt21012509/
  "[clap]実は僕らが悪者だったかもしれない": "[clap]jitsuwa bokura ga warumono datta kamo shire nai",
  "[clap]これが良い事か悪い事か": "[clap]kore ga ii koto ka warui koto ka",

  // 遺忘之物 (忘れ物) — https://utaten.com/lyric/ym22112201/
  "そこらにある物じゃ 足りなかった": "sokora ni aru mono ja tari nakatta",

  // 時間悖論 (タイムパラドックス) — https://utaten.com/lyric/hw24011202/
  "[clap]どうしても一人じゃ使えないのさ": "[clap]dōshitemo hitori ja tsukae nai no sa",

  // 最後一擊 (トドメの一撃) — https://utaten.com/lyric/tt23092503/
  "密度高め万年を照らす光の矢を放つ、穿つ": "mitsudo takame man nen o terasu hōpu o hanatsu, ugatsu",
  "見えず匂わぬ、違えぬ未来が": "mie zu niowa nu, tagae nu mirai ga",
  "それは散らばるミクロ砂金": "sore wa chirabaru mikuro sakin",
  "[wave]明日の夜も守れますように": "[wave]asu no yoru mo mamore masu yō ni",

  /* Partial chant labels also need exact romaji keys so the chant color can
     follow Japanese segments inside a longer lyric line. */
  "ないぜ": "nai ze",
  "しまうの": "shimau no",
  "愛で": "ai de",
  "日々が": "hibi ga",
  "愛して": "aishi te",
  "あれ、なに": "are, nani",
  "それ、なに": "sore, nani",
  "何年経っても妄想が": "nan nen tatte mo mōsō ga",
  "もうこんなに": "mō konnani",
  "花が散るほど": "hana ga chiru hodo",
  "輝いて": "kagayai te",
  "今チェンジ": "ima chenji",
  "ないやないやないや": "nai ya na iya na iya",
  "ないさないさ": "nai sa nai sa",
  "ないな ないなないな": "nai na nai na nai na",
  "先生": "sensei",
  "全然": "zenzen"
});
