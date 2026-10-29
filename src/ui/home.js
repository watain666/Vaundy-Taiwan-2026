import { INFO_SVG, CHEVRON_SVG, EXT_LINK_SVG, SEAT_SVG, MAP_SVG, MANNER_SVG, GIFT_SVG, MUSIC_SVG, WARN_SVG, FLASH_OFF_SVG, SHARE_SVG, MOON_SVG } from "./icons.js";
import { siteFooterHtml } from "./footer.js";

// Shared by Vite prerendering and client-side navigation.
export function homeHtml(build, themeToggle = `<button class="theme-toggle home-theme" type="button" data-theme-toggle aria-label="切換主題">${MOON_SVG}</button>`){
  return `
    <section class="hero">
      ${themeToggle}
      <div class="hero-inner">
        <div class="eyebrow">ASIA ARENA TOUR 2026</div>
        <h1 class="tour-title"><span>VAUNDY</span>&ldquo;HORO&rdquo;</h1>

        <div class="countdown" id="countdown">
          <div class="cd-pill">
            <span class="cd-dday" id="cd-dday">D-00</span>
            <span class="cd-sep"></span>
            <span class="cd-clock" id="cd-clock">00:00:00</span>
          </div>
        </div>

        <div class="show-meta">
          <div class="show-row">
            <span class="show-day">10.31<span class="dow">六</span></span>
            <span class="show-time">19:00</span>
          </div>
          <div class="show-row">
            <span class="show-day">11.01<span class="dow">日</span></span>
            <span class="show-time">19:00</span>
          </div>
          <div class="show-venue">TAIPEI ARENA, TAIPEI</div>
        </div>

        <!-- 공연 당일에만 나타나는 오늘의 일정 -->
        <div class="today-card" id="today-card" hidden>
          <div class="today-head"><span class="dot"></span><span id="today-title">今日</span></div>
          <div class="today-now" id="today-now"></div>
          <ul class="today-list" id="today-list"></ul>
        </div>

        <nav class="main-menu">
          <button class="menu-btn" id="guide-btn">
            <span class="menu-btn-label">應援指南 無劇透</span>
          </button>
        </nav>

        <section class="info-section">
      <div class="menu-card">
      <div class="info-card" id="info-card" data-default-open="1">
        <button class="menu-row info-toggle" id="info-toggle" aria-expanded="false" aria-controls="info-panel">
          <span class="info-toggle-icon">${INFO_SVG}</span>
          <span class="info-toggle-label">演出資訊</span>
          <span class="info-toggle-chevron">${CHEVRON_SVG}</span>
        </button>
        <div class="info-panel" id="info-panel" inert aria-hidden="true">
          <template class="info-panel-template">
          <div class="info-panel-inner">
            <div class="info-panel-title"><span class="bar">|</span> 現場配置圖 <span class="bar">|</span></div>
            <p class="way-note">主辦單位公布的<b>台北場現場配置圖與時間表</b>：入場門、整隊區、實名驗證區、周邊販售、服務台、VAWS 攤位與拍照點位置。點圖可放大。</p>
            <div class="notice-grid" id="notice-grid"></div>
            <p class="notice-empty" id="notice-empty" hidden>
              公告圖片載入失敗，請直接查看主辦單位的原始貼文。
            </p>
            <a class="info-book-link" href="https://www.instagram.com/p/DfCRPwhk6vZ/" target="_blank" rel="noopener">
              ${EXT_LINK_SVG} 查看主辦單位 IG 現場注意事項
            </a>
            <p class="info-footnote">※ 圖片來源：主辦單位 @funfunenter。以上內容實際以現場狀況為主，主辦單位保留變更修改之權利。</p>
            <div class="info-panel-title"><span class="bar">|</span> 演出概要 <span class="bar">|</span></div>
            <dl class="info-facts">
              <dt>演出名稱</dt>
              <dd>Vaundy ASIA ARENA TOUR 2026 &ldquo;HORO&rdquo; IN TAIPEI</dd>

              <dt>日期／時間</dt>
              <dd>
                <span class="em">2026.10.31（六）19:00</span> ／ <span class="em">11.01（日）19:00</span>
                <span class="sub">兩天皆 17:30 開場・時間以官方公告為準</span>
              </dd>

              <dt>地點</dt>
              <dd>
                台北小巨蛋 Taipei Arena
                <span class="sub">105037 臺北市松山區南京東路4段2號</span>
              </dd>

              <dt>入場規則</dt>
              <dd>
                全場實名制・<span class="em">未攜帶證件無法入場</span>
                <span class="sub">透過遠大售票系統購票者 — 本國籍：身分證／駕照／健保卡正本；外國籍：護照正本（不接受以換發後的新護照核對）。證件需有可辨識本人的照片，姓名與證件號碼需與票券相符；照片與本人落差太大可能無法入場，建議攜帶有近期照片的證件</span>
                <span class="sub">無法出示有效證件正本或資料不符，視為放棄入場權益，不得要求退款、變更或轉讓</span>
                <span class="sub">驗證時間 12:00–19:00・北廣場實名驗證區，請提早完成以加速入場</span>
              </dd>

              <dt>票價</dt>
              <dd>
                <p class="info-price">
                  <span>NT$ 5,880</span>
                  <span>NT$ 4,880</span>
                  <span>NT$ 3,880</span>
                  <span>NT$ 2,880</span>
                  <span>NT$ 800</span>
                </p>
                <span class="sub">另收購票手續費</span>
              </dd>

              <dt>取票方式</dt>
              <dd>
                請提前至全台 7-11 ibon 機台取票
                <span class="sub"><b>現場無法取票。</b>實名制資料請務必填寫正確，入場規定以售票平台公告為準</span>
              </dd>

              <dt>購票</dt>
              <dd>
                Ticket Plus 遠大售票
                <span class="sub">票務、實名制與入場問題請依售票平台最新公告確認</span>
              </dd>
            </dl>

            <a class="info-book-link" href="https://ticketplus.com.tw/activity/6c3d8c24e0f00c9c84777615c001bebe" target="_blank" rel="noopener">
              ${EXT_LINK_SVG} 前往 Ticket Plus 售票頁面
            </a>

            <hr class="info-divider">

            <div class="info-panel-title"><span class="bar">|</span> 觀眾入場資訊 <span class="bar">|</span></div>
            <div class="info-table-wrap">
              <table class="info-table">
                <colgroup>
                  <col class="info-col-label">
                  <col class="info-col-day">
                  <col class="info-col-day">
                  <col class="info-col-note">
                </colgroup>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>10/31（六）</th>
                    <th>11/1（日）</th>
                    <th>備註</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="label" data-label="項目">實名驗證</td>
                    <td data-label="10/31（六）">12:00–19:00</td>
                    <td data-label="11/1（日）">12:00–19:00</td>
                    <td class="note" data-label="備註">北廣場實名驗證區</td>
                  </tr>
                  <tr>
                    <td class="label" data-label="項目">服務台・票務櫃台</td>
                    <td data-label="10/31（六）">12:00–19:30</td>
                    <td data-label="11/1（日）">12:00–19:30</td>
                    <td class="note" data-label="備註">由 6 號門出入・不代收給藝人的禮物和卡片</td>
                  </tr>
                  <tr>
                    <td class="label" data-label="項目">現場周邊販售</td>
                    <td data-label="10/31（六）">12:00–演出後</td>
                    <td data-label="11/1（日）">12:00–演出後</td>
                    <td class="note" data-label="備註">周邊整理券 11:30 起</td>
                  </tr>
                  <tr>
                    <td class="label" data-label="項目">紀念拍貼機</td>
                    <td data-label="10/31（六）">12:00–17:00</td>
                    <td data-label="11/1（日）">12:00–17:00</td>
                    <td class="note" data-label="備註">11:00 整隊・11:30 發號碼牌</td>
                  </tr>
                  <tr>
                    <td class="label" data-label="項目">VAUNDY 燈牌</td>
                    <td data-label="10/31（六）">12:00–21:00</td>
                    <td data-label="11/1（日）">12:00–21:00</td>
                    <td class="note" data-label="備註">位置見公告・指南的配置圖</td>
                  </tr>
                  <tr>
                    <td class="label" data-label="項目">卡拉OK MONSTER</td>
                    <td data-label="10/31（六）">12:00–19:00</td>
                    <td data-label="11/1（日）">12:00–19:00</td>
                    <td class="note" data-label="備註">小巨蛋南大門・依工作人員指示排隊・進場期間暫停開放</td>
                  </tr>
                  <tr>
                    <td class="label" data-label="項目">VAWS 攤位</td>
                    <td data-label="10/31（六）">12:00–21:30</td>
                    <td data-label="11/1（日）">12:00–19:00</td>
                    <td class="note" data-label="備註">近小巨蛋 8 號門・詳見本頁「VAWS 會員票卡」</td>
                  </tr>
                  <tr>
                    <td class="label" data-label="項目">搖滾區整隊</td>
                    <td data-label="10/31（六）">16:30</td>
                    <td data-label="11/1（日）">16:30</td>
                    <td class="note" data-label="備註">依票面序號・最後叫號為入場前 15 分鐘</td>
                  </tr>
                  <tr>
                    <td class="label" data-label="項目">開場／入場</td>
                    <td data-label="10/31（六）">17:30</td>
                    <td data-label="11/1（日）">17:30</td>
                    <td class="note" data-label="備註">官方已公布</td>
                  </tr>
                  <tr>
                    <td class="label" data-label="項目">正式演出</td>
                    <td data-label="10/31（六）">19:00</td>
                    <td data-label="11/1（日）">19:00</td>
                    <td class="note" data-label="備註">官方已公布</td>
                  </tr>
                  <tr>
                    <td class="label" data-label="項目">演出結束</td>
                    <td data-label="10/31（六）">預計 21:00 左右</td>
                    <td data-label="11/1（日）">預計 21:00 左右</td>
                    <td class="note" data-label="備註">實際時間以現場為準</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="info-footnote">※ 時間依主辦單位（<a href="https://www.instagram.com/p/DfCRPwhk6vZ/" target="_blank" rel="noopener">@funfunenter</a>）公布的現場注意事項整理；物品寄放目前未公布。<br>※ 最新資訊請以主辦單位、Ticket Plus 與台北小巨蛋公告為準。</p>



          </div>
          </template>
        </div>
      </div>

      <div class="info-card" id="seat-card">
        <button class="menu-row info-toggle" aria-expanded="false">
          <span class="info-toggle-icon">${SEAT_SVG}</span>
          <span class="info-toggle-label">座位配置圖</span>
          <span class="info-toggle-chevron">${CHEVRON_SVG}</span>
        </button>
        <div class="info-panel" inert aria-hidden="true">
          <template class="info-panel-template">
          <div class="info-panel-inner">
            <div class="info-panel-title"><span class="bar">|</span> 台北小巨蛋 Taipei Arena <span class="bar">|</span></div>

            <p class="way-note">台北場最新官方舞台／座位配置圖：</p>
            <div class="seat-wrap">
              <a class="seat-map-link" href="./images/taipei-stage-map.webp" target="_blank" rel="noopener">
                <img class="seat-map-image" data-src="./images/taipei-stage-map-preview.webp" width="2772" height="3681" alt="Vaundy ASIA ARENA TOUR 2026「HORO」台北場台北小巨蛋舞台與座位配置圖，含各區票價；點擊查看原尺寸" loading="lazy" decoding="async">
              </a>
              <p class="seat-map-caption">點擊圖片可放大查看原尺寸。</p>
            </div>
            <p class="way-note">圖中票價與票區依主辦單位公布的配置圖整理；實際座位、入場動線與現場安排仍以票券及演出當日公告為準。</p>

            <div class="way-sec">
              <h4>各區入場 <span>17:30 開放入場</span></h4>
              <div class="way-block">
                <div class="way-block-t">搖滾站區 → <b>16:30 整隊</b>（依票面序號）</div>
                <ul class="way-ul">
                  <li><b>搖滾 A・D 區</b>：北大門 5 號門前廣場整隊，由<b>北大門</b>入場</li>
                  <li><b>搖滾 B・C 區</b>：捷運 2 號出口前廣場整隊，由<b>北區 2 號門</b>（往 B1 樓梯）入場</li>
                </ul>
              </div>
              <div class="way-block">
                <div class="way-block-t">2F・3F 座席區 → <b>不需整隊</b></div>
                <ul class="way-ul">
                  <li><b>黃 1 區・3F 看台區・包廂區</b>：由<b>北大門</b>入場</li>
                  <li><b>藍 1 區・2F 看台區</b>：由<b>南大門</b>入場</li>
                  <li>依現場工作人員引導等候驗票，照票面座位排號入座</li>
                </ul>
              </div>
              <ul class="way-ul warn">
                <li>開始整隊後請依工作人員指示入列，避免離開隊伍順序</li>
                <li>叫號已超過您的序號視同放棄進場順序（<b>最後叫號為入場前 15 分鐘</b>）；過號者請洽工作人員，排在該區隊伍最後方入場</li>
                <li>開放入場後才到且已過號，請依工作人員指示排隊入場</li>
                <li>和非連號的朋友想一起進場，須一起排在<b>序號較大（較後面）</b>的位置</li>
              </ul>
            </div>
            <div class="info-book-links">
              <a class="info-book-link" href="https://ticketplus.com.tw/activity/6c3d8c24e0f00c9c84777615c001bebe" target="_blank" rel="noopener">
                ${EXT_LINK_SVG} Ticket Plus 售票頁面
              </a>
              <a class="info-book-link" href="https://www.arena.taipei/" target="_blank" rel="noopener">
                ${EXT_LINK_SVG} 台北小巨蛋官網
              </a>
              <a class="info-book-link" href="https://twconcertview.com/venue/taipei-arena-center-stage/" target="_blank" rel="noopener">
                ${EXT_LINK_SVG} 台灣各大場館視野
              </a>
            </div>

            <p class="info-footnote">※ 若主辦單位後續更新舞台、票區或票價，請以最新官方公告為準。</p>
          </div>
          </template>
        </div>
      </div>

      <div class="info-card" id="way-card">
        <button class="menu-row info-toggle" aria-expanded="false">
          <span class="info-toggle-icon">${MAP_SVG}</span>
          <span class="info-toggle-label">交通方式</span>
          <span class="info-toggle-chevron">${CHEVRON_SVG}</span>
        </button>
        <div class="info-panel" inert aria-hidden="true">
          <template class="info-panel-template">
          <div class="info-panel-inner">
            <div class="way-addr">
              <b>台北小巨蛋 Taipei Arena</b>
              <span>105037 臺北市松山區南京東路4段2號</span>
            </div>
            <div class="way-btns">
              <a href="https://www.arena.taipei/cp.aspx?n=459956E830D4A8BB" target="_blank" rel="noopener">場館交通資訊</a>
              <a href="https://web.metro.taipei/pages2026/WebStation/109" target="_blank" rel="noopener">台北捷運 G17</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Taipei+Arena+Taipei" target="_blank" rel="noopener">Google 地圖</a>
              <button type="button" id="copy-addr">複製地址</button>
            </div>

            <p class="way-note">演出日場館周邊預計人潮與車流較多，請<b>優先搭乘大眾運輸並預留入場時間</b>。</p>

            <div class="way-sec">
              <h4>捷運 <span>最推薦</span></h4>

              <div class="way-block">
                <div class="way-block-t">① 松山新店線（綠線） → <b>G17 台北小巨蛋站</b></div>
                <ul class="way-ul">
                  <li>搭乘台北捷運松山新店線至 G17 台北小巨蛋站，從<b> 2 號出口</b>出站即達。</li>
                  <li>從其他捷運路線前往時，請先轉乘至松山新店線；出發前可用台北捷運官方網站確認路線與營運資訊。</li>
                </ul>
              </div>
            </div>

            <div class="way-sec">
              <h4>公車</h4>
              <ul class="way-ul">
                <li>可搜尋站名「臺北小巨蛋」或「捷運台北小巨蛋站」。</li>
                <li>公車路線、到站時間與演出日改道資訊，請以臺北市公車動態資訊及現場公告為準。</li>
              </ul>
            </div>

            <div class="way-sec">
              <h4>開車／停車</h4>
              <ul class="way-ul warn">
                <li>活動日周邊車流與停車需求高，建議不要把開車作為首選。</li>
                <li>若需開車，請先查看台北小巨蛋官方停車與交通公告；場館車位有限，<b>停車不等於保證入場</b>。</li>
                <li>散場時請依工作人員與交通管制指示離場，避免在場館周邊久候。</li>
              </ul>
            </div>

            <p class="info-footnote">※ 地圖 App 需要網路連線。<br>※ 出口、交通管制、停車與臨時接駁若有變更，均以台北小巨蛋、台北捷運及主辦官方公告為準。</p>
          </div>
          </template>
        </div>
      </div>

      <div class="info-card" id="manner-card">
        <button class="menu-row info-toggle" aria-expanded="false">
          <span class="info-toggle-icon">${MANNER_SVG}</span>
          <span class="info-toggle-label">應援禮儀・第一次參加</span>
          <span class="info-toggle-chevron">${CHEVRON_SVG}</span>
        </button>
        <div class="info-panel" inert aria-hidden="true">
          <template class="info-panel-template">
          <div class="info-panel-inner">

            <p class="way-note">不知道應援口號也沒關係。<b>應援不是義務。</b>這份指南整理的是「知道後會更有趣的事」，不是必須背熟的作業。安靜站著欣賞也很棒。</p>

            <div class="way-sec">
              <h4>第一次參加 <span>知道這些就足夠</span></h4>
              <ul class="way-ul">
                <li><b>不用全部跟著做。</b>只要在熟悉的歌曲、熟悉的段落一起應援，就能玩得很開心</li>
                <li>不會日文也沒關係・大合唱多半是<b>「Hu Hu」、「DA-DA-DA」</b>這類聲音，記住發音就可以</li>
                <li>本指南的動作全部都是<b>徒手</b>完成，不需要另外準備應援物品</li>
                <li>晚一拍跟著周圍的人做也完全不奇怪</li>
                <li>場館內網路訊號可能不穩。請<b>在家先開啟一次這個頁面</b>・歌詞會儲存在手機裡，沒有網路也能查看</li>
              </ul>
            </div>

            <div class="way-sec">
              <h4>台北場官方規定 <span>主辦單位公告</span></h4>
              <ul class="way-ul warn">
                <li>用最熱情的<b>尖叫・合唱・揮手・掌聲，代替上下跳動</b></li>
                <li>為安全考量，請遵守台北小巨蛋規範，<b>2、3 樓觀眾勿站立和跺腳</b></li>
                <li><b>演出中和演出前，嚴禁使用任何器材拍攝、錄影或錄音</b>（包含手機、相機、攝影機、錄音設備、掌上遊戲機、電子設備等）。違者工作人員有權當下帶離現場並於場外刪除檔案；需再入場時設備及素材將沒收，情節嚴重者強制離場且不得再入場</li>
                <li>演出中請將手機關機或調為靜音模式</li>
                <li>場內禁止飲食</li>
                <li>禁止攜帶金屬、危險物品（刀具、尖銳物品等）、玻璃、寶特瓶容器、雷射筆、LED 燈、煙火</li>
                <li>禁止攜帶長柄雨傘、<b>大型行李</b>、摺疊椅、板凳、<b>任何可發光之物品</b>，以及可能影響他人觀賞的物品</li>
                <li>應援物請勿高舉超過個人肩寬與頭頂；勸導後未改善將代為保管至散場，且不負保管及損壞責任</li>
                <li>請避免使用香水、美髮造型品等香氣濃烈的產品</li>
                <li>禁止衝撞、人體衝浪、開圈等危險行為；因個人疏忽受傷，主辦、場館、演出者等單位皆不負責任</li>
                <li>不遵守工作人員指示可能被要求離場；因上述原因遭強制離場或無法入場者，恕不退還票款、手續費、交通費及住宿費</li>
                <li>現場可能進行照片及影片拍攝，素材可能作為宣傳用途</li>
              </ul>
            </div>

            <div class="way-sec">
              <h4>一起遵守 <span>為了大家的觀賞體驗</span></h4>
              <ul class="way-ul warn">
                <li><b>禁止拍攝・錄音・錄影。</b>若有允許拍攝的段落，現場會另行通知</li>
                <li>演出中請<b>調低手機螢幕亮度</b>。昏暗觀眾席中的亮螢幕，後方觀眾會看得非常清楚</li>
                <li>請<b>避免使用手機閃光燈</b>。舞台演出連燈光完全熄滅的瞬間都經過設計，觀眾席的一道光可能破壞那個畫面
                  <span class="way-hint">若有全場一起舉燈的安排，演出中會另行通知</span></li>
                <li>安靜歌曲・原聲樂段請<b>克制口號與歡呼</b>，很多人是來聽歌的</li>
                <li>把手大幅揮過頭頂時，請留意<b>左右與後方觀眾的視線</b></li>
                <li>演出中的交談與歌曲解說，請留到曲目結束後再分享</li>
                <li>高帽子・蓬鬆髮型可能遮擋後方觀眾視線</li>
                <li>在人潮密集的空間裡，氣味強烈的香水可能讓他人感到不適</li>
              </ul>
            </div>

            <div class="way-sec">
              <h4>如果是站席</h4>
              <ul class="way-ul">
                <li><b>不要往前推。</b>後方推擠的力量會直接累積到前排</li>
                <li>官方禁止攜帶大型行李，請<b>盡量輕裝</b>・包包放在腳邊可能導致跌倒</li>
                <li>如果周圍有人跌倒，請不要推擠，<b>停下來扶起對方</b></li>
                <li>入場前先喝水、先上洗手間，因為要站立 2 小時</li>
                <li>若呼吸急促或頭暈，請不要勉強，告知<b>附近的工作人員</b></li>
              </ul>
            </div>

            <p class="info-footnote">※ 本指南由粉絲製作。拍攝、攜入、再次入場等官方規定，以 Ticket Plus、台北小巨蛋公告與<b>演出當天現場指示</b>為準。</p>
          </div>
          </template>
        </div>
      </div>

      <div class="info-card" id="vaws-card">
        <button class="menu-row info-toggle" aria-expanded="false">
          <span class="info-toggle-icon">${GIFT_SVG}</span>
          <span class="info-toggle-label">VAWS 會員票卡</span>
          <span class="info-toggle-chevron">${CHEVRON_SVG}</span>
        </button>
        <div class="info-panel" inert aria-hidden="true">
          <template class="info-panel-template">
          <div class="info-panel-inner">
            <div class="info-panel-title"><span class="bar">|</span> 場館限定特典 <span class="bar">|</span></div>

            <p class="way-note">VAWS MEMBERS 會員可在攤位領取<b>「各公演原創票卡」</b>，每場演出設計都不一樣。演出當天新入會的人也可以參加。</p>
            <div class="notice-grid" id="vaws-grid"></div>

            <dl class="info-facts">
              <dt>地點</dt>
              <dd>
                <span class="em">台北小巨蛋 8 號門附近</span>
                <span class="sub">位置可對照「公告・指南」裡的現場配置圖</span>
              </dd>

              <dt>時間</dt>
              <dd>
                <span class="em">10/31（六）12:00–21:30</span> ／ <span class="em">11/1（日）12:00–19:00</span>
                <span class="sub">可能依準備及天氣狀況變更</span>
              </dd>

              <dt>對象</dt>
              <dd>
                <span class="em">VAWS MEMBERS 會員</span>
                <span class="sub">沒有當天演出門票也可兌換；演出當天新入會也是對象；僅限公演當天兌換</span>
              </dd>

              <dt>兌換方式</dt>
              <dd>
                用手機掃描貼在攤位附近的「兌換用 QR 碼」，出示顯示的兌換畫面，前往「VAWS MEMBERS」攤位
                <span class="sub"><b>截圖畫面無法兌換</b>，請務必用網頁瀏覽器顯示畫面；訊號不穩無法顯示時，攤位會協助處理</span>
              </dd>
            </dl>

            <ul class="way-ul warn">
              <li>每人每個公演日最多兌換 <b>1 張</b>（多場到場者每天可兌換 1 張）</li>
              <li>達到預定發放張數即結束，<b>數量有限，請盡早兌換</b></li>
              <li>為緩和攤位周圍擁擠，領取後請盡快移動</li>
              <li>開場與開演前售票處預計非常擁擠，請務必提前到達</li>
              <li>除不良品外不接受更換；不良品更換僅限公演當天</li>
              <li>禁止在拍賣網站或二手平台轉賣</li>
            </ul>

            <div class="way-sec">
              <h4>AR 相機 <span>不限會員</span></h4>
              <ul class="way-ul">
                <li>安裝 <b>Vaundy OFFICIAL APP</b> 即可使用，請先更新到最新版本</li>
                <li><b>會場限定 AR 相機</b>：到場後開啟 APP 點「AR」→ 左上角相機圖示 → 掃描會場面板上的標記，就能和<b>巡演 Logo</b> 合影。每個公演日會出現不同的限定顏色</li>
                <li><b>隨處 AR 相機</b>：在左上角選單（三條線）選「無標記」再點「播放」，巡演期間隨時都能拍</li>
                <li>點畫面左下角的灰色相機圖示可切換前／後鏡頭；多個 AR 圖像重疊時可自行拖曳位置</li>
                <li>部分裝置可能無法保證正常運作</li>
              </ul>
              <div class="info-book-links">
                <a class="info-book-link" href="https://apps.apple.com/jp/app/vaundy-official-app/id1631933316" target="_blank" rel="noopener">
                  ${EXT_LINK_SVG} APP（iOS）
                </a>
                <a class="info-book-link" href="https://play.google.com/store/apps/details?id=jp.vaundy.app" target="_blank" rel="noopener">
                  ${EXT_LINK_SVG} APP（Android）
                </a>
              </div>
            </div>

            <div class="info-book-links">
              <a class="info-book-link" href="https://member.vaundy.jp/news/detail/11319?lang=zh-tw" target="_blank" rel="noopener">
                ${EXT_LINK_SVG} VAWS 台北場攤位公告
              </a>
              <a class="info-book-link" href="https://member.vaundy.jp/feature/ASIAARENATOUR_2026" target="_blank" rel="noopener">
                ${EXT_LINK_SVG} VAWS 官方巡演頁面
              </a>
            </div>

            <p class="info-footnote">※ 以上內容以 VAWS MEMBERS 官方公告為準，詳細安排可能依演出當天現場狀況調整。</p>
          </div>
          </template>
        </div>
      </div>

      <div class="info-card" id="playlist-card">
        <button class="menu-row info-toggle" aria-expanded="false">
          <span class="info-toggle-icon">${MUSIC_SVG}</span>
          <span class="info-toggle-label">Spotify 官方預熱歌單</span>
          <span class="chip-note">可能含劇透</span>
          <span class="info-toggle-chevron">${CHEVRON_SVG}</span>
        </button>
        <div class="info-panel" inert aria-hidden="true">
          <template class="info-panel-template">
          <div class="info-panel-inner">
            <p class="way-note"><b>曲目可能與實際歌單相近，介意劇透者請勿播放。</b>這是 Spotify 的「On Tour Taiwan: Vaundy」歌單，並非本指南整理的台北場歌單。</p>
            <iframe class="home-playlist-embed" title="Spotify 歌單：On Tour Taiwan: Vaundy" src="https://open.spotify.com/embed/playlist/37i9dQZF1DXarlFLUSkBwQ?utm_source=generator" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>
            <a class="info-book-link" href="https://open.spotify.com/playlist/37i9dQZF1DXarlFLUSkBwQ" target="_blank" rel="noopener">
              ${EXT_LINK_SVG} 在 Spotify 開啟歌單
            </a>
          </div>
          </template>
        </div>
      </div>

      <div class="info-card" id="board-card">
        <button class="menu-row info-toggle" aria-expanded="false">
          <span class="info-toggle-icon">${GIFT_SVG}</span>
          <span class="info-toggle-label">應援小物交流板</span>
          <span class="chip-note">可能含劇透</span>
          <span class="info-toggle-chevron">${CHEVRON_SVG}</span>
        </button>
        <div class="info-panel" inert aria-hidden="true">
          <template class="info-panel-template">
          <div class="info-panel-inner">
            <p class="way-note"><b>粉絲自發交流，與官方及本指南無關。</b>請勿公開電話、LINE ID 等個人資料，面交時留意假冒發放的詐騙；留言可能提到歌單，介意劇透者請斟酌閱讀。新留言經管理員審核後才會顯示。</p>
            <div class="support-board" data-support-board></div>
          </div>
          </template>
        </div>
      </div>

      <div class="menu-links">
        <a class="menu-chip" href="https://vaundy.jp/?lang=en" target="_blank" rel="noopener">
          <span class="chip-ico">${EXT_LINK_SVG}</span>
          <span class="chip-label">官方網站</span>
        </a>
        <button class="menu-chip spoiler" type="button" id="setlist-btn">
          <span class="chip-ico warn">${WARN_SVG}</span>
          <span class="chip-label">東京/首爾歌單</span>
          <span class="chip-note">含劇透</span>
        </button>
      </div>
      </div>

      <!-- 폰 플래시(폰 반딧불) 안내 — 접지 않고 바로 보이는 한 문단 -->
      <aside class="home-note">
        <span class="home-note-ico">${FLASH_OFF_SVG}</span>
        <div class="home-note-body">
          <b>請避免使用手機閃光燈</b>
          <p>舞台演出連燈光完全熄滅的瞬間都經過設計。觀眾席的一道光會打破黑暗，讓精心安排的畫面失去效果。</p>
          <p class="sub">若有全場一起舉燈的安排，演出中會另行通知。</p>
        </div>
      </aside>

      <div class="home-foot">
        <button class="share-btn" type="button" id="share-btn">${SHARE_SVG} 分享</button>
      </div>
        </section>
      </div>
    </section>

    ${siteFooterHtml(build)}
  `;
}
