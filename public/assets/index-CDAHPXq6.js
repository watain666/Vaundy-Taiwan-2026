(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();const _s="modulepreload",Rs=function(e,t){return new URL(e,t).href},Kn={},et=function(t,n,a){let s=Promise.resolve();if(n&&n.length>0){let c=function(p){return Promise.all(p.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};const o=document.getElementsByTagName("link"),r=document.querySelector("meta[property=csp-nonce]"),l=r?.nonce||r?.getAttribute("nonce");s=c(n.map(p=>{if(p=Rs(p,a),p in Kn)return;Kn[p]=!0;const d=p.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(a)for(let g=o.length-1;g>=0;g--){const w=o[g];if(w.href===p&&(!d||w.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${p}"]${u}`))return;const m=document.createElement("link");if(m.rel=d?"stylesheet":_s,d||(m.as="script"),m.crossOrigin="",m.href=p,l&&m.setAttribute("nonce",l),document.head.appendChild(m),d)return new Promise((g,w)=>{m.addEventListener("load",g),m.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${p}`)))})}))}function i(o){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=o,window.dispatchEvent(r),!r.defaultPrevented)throw o}return s.then(o=>{for(const r of o||[])r.status==="rejected"&&i(r.reason);return t().catch(i)})},La='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="11"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',Ps='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.404 1.02.005 2.04.137 3 .404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.595 24 12.297c0-6.627-5.373-12-12-12z"/></svg>',Te='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',Hs='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',ht='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.2v13.6a1 1 0 0 0 1.5.87l11-6.8a1 1 0 0 0 0-1.74l-11-6.8A1 1 0 0 0 8 5.2z"/></svg>',Na='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="4.5" width="4" height="15" rx="1.4"/><rect x="13.5" y="4.5" width="4" height="15" rx="1.4"/></svg>',Os='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5 15.4 17.5"/><path d="M15.4 6.5 8.6 10.5"/></svg>',Fs='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 3.5h9l4.5 4.5v12a1 1 0 0 1-1 1h-12.5a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z"/><path d="M14 3.5V8h4.5"/><path d="M8.5 13h7"/><path d="M8.5 16.5h5"/></svg>',Ds='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="18" height="12" rx="1.5"/><line x1="12" y1="9" x2="12" y2="21"/><path d="M3 13h18"/><path d="M12 9S10.6 4.5 8.2 4.5A2.2 2.2 0 0 0 8.2 9z"/><path d="M12 9s1.4-4.5 3.8-4.5A2.2 2.2 0 0 1 15.8 9z"/></svg>',ae='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',qs='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><rect x="9.6" y="10.2" width="4.8" height="3.6" rx="1.2"/></svg>',Us='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.2-4.4-7.2-9.6A3.9 3.9 0 0 1 12 8.4a3.9 3.9 0 0 1 7.2 2.5c0 5.2-7.2 9.6-7.2 9.6z"/><path d="M8.4 5.2 9.6 3"/><path d="M12 4.2V2"/><path d="M15.6 5.2 14.4 3"/></svg>',Ca='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.9 18.2A2 2 0 0 0 3.6 21h16.8a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13.5"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',Vs='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6.6" y="2.6" width="10.8" height="18.8" rx="2.4"/><line x1="10.4" y1="5.6" x2="13.6" y2="5.6"/><line x1="3.6" y1="20.8" x2="20.4" y2="3.2"/></svg>',W=e=>`<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#${e}"/></svg>`,B={wave:`<span class="ico ico-wave" title="揮手">${W("i-wave")}</span>`,clap:`<span class="ico ico-clap" title="拍手"><span class="hand l">${W("i-hand")}</span><span class="hand r">${W("i-hand")}</span><span class="spark">${W("i-spark")}</span></span>`,mic:`<span class="ico ico-mic" title="大合唱">${W("i-mic")}</span>`,jump:`<span class="ico ico-jump" title="跳躍">${W("i-jump")}<span class="ground"></span></span>`,spin:`<span class="ico ico-spin" title="轉臂">
           <svg class="body" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-cheer"/></svg>
           <svg class="arm" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-cheer-arm"/></svg>
         </span>`};B.turn=B.spin;B.chant=B.mic;const Gn='<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-mic"/></svg>',Ws='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',Ks='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',Sn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>',Gs='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 5h2v14H5z"/><path d="M19 5.6v12.8a1 1 0 0 1-1.6.8l-9.2-6.4a1 1 0 0 1 0-1.6l9.2-6.4a1 1 0 0 1 1.6.8z"/></svg>',zs='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 5h2v14h-2z"/><path d="M5 5.6v12.8a1 1 0 0 0 1.6.8l9.2-6.4a1 1 0 0 0 0-1.6L6.6 4.8a1 1 0 0 0-1.6.8z"/></svg>',Ys='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><rect x="11" y="12" width="8" height="5" rx="1" fill="currentColor" stroke="none"/></svg>',dn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',Js='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.8"/><path d="M12 2.5v2.1M12 19.4v2.1M4.7 4.7l1.5 1.5M17.8 17.8l1.5 1.5M2.5 12h2.1M19.4 12h2.1M4.7 19.3l1.5-1.5M17.8 6.2l1.5-1.5"/></svg>',ja='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1z"/></svg>',zn=Object.freeze({jp:'<svg class="chant-version-flag chant-version-flag-jp" viewBox="0 0 24 16" role="img" aria-label="日本版"><rect x="1" y="1" width="22" height="14" rx="2" fill="#fff" stroke="currentColor" stroke-opacity=".45"/><circle cx="12" cy="8" r="4" fill="#bc002d"/></svg>',kr:'<svg class="chant-version-flag chant-version-flag-kr" viewBox="0 0 24 16" role="img" aria-label="韓國版"><rect x="1" y="1" width="22" height="14" rx="2" fill="#fff" stroke="currentColor" stroke-opacity=".45"/><path d="M12 4a4 4 0 0 1 0 8v-4a2 2 0 0 0 0-4Z" fill="#cd2e3a"/><path d="M12 12a4 4 0 0 1 0-8v4a2 2 0 0 0 0 4Z" fill="#0047a0"/><path d="M4 4h3m-3 1.5h3M17 10.5h3m-3 1.5h3" stroke="#141414" stroke-width="1" stroke-linecap="round"/></svg>'}),Xs="https://github.com/watain666/Vaundy-Taiwan-2026",Zs="https://www.threads.com/@brainginger/post/DdiLWztgen9",Qs="https://vaundy-seoul-2026.pages.dev/",ei="https://gall.dcinside.com/mgallery/board/view/?id=vaundy0606&no=35550";function Ba(e){return`
    <footer class="credits">
      <p class="credits-copy">VAUNDY ASIA ARENA TOUR 2026 &ldquo;HORO&rdquo;・TAIWAN FAN CHANT GUIDE（非官方粉絲製作）<span class="build">${e}</span></p>
      <nav class="credits-links" aria-label="專案連結">
        <span class="credits-origin">
          <a class="credits-link credits-repo" href="${Xs}" target="_blank" rel="noopener" aria-label="GitHub Repo" title="GitHub Repo">
            ${Ps}
          </a>
          <a class="credits-fork" href="${Qs}" target="_blank" rel="noopener" aria-label="Fork from SEOUL 응원가이드">
            Fork from SEOUL 응원가이드
          </a>
        </span>
        <a class="credits-fork" href="${ei}" target="_blank" rel="noopener" aria-label="Thanks to the original Korean creator, 카쿠메.">
          Thanks to the original Korean creator, 카쿠메.
        </a>
        <a class="credits-link" href="${Zs}" target="_blank" rel="noopener" aria-label="意見回饋" title="意見回饋">
          <span>意見回饋</span>
        </a>
        <button class="credits-link changelog-trigger" type="button" data-open-changelog aria-haspopup="dialog" aria-controls="changelog-view">
          更新日誌
        </button>
      </nav>
    </footer>
  `}function ti(e,t=`<button class="theme-toggle home-theme" type="button" data-theme-toggle aria-label="切換主題">${ja}</button>`){return`
    <section class="hero">
      ${t}
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
      <div class="info-card" id="info-card">
        <button class="menu-row info-toggle" id="info-toggle" aria-expanded="false" aria-controls="info-panel">
          <span class="info-toggle-icon">${La}</span>
          <span class="info-toggle-label">演出資訊</span>
          <span class="info-toggle-chevron">${ae}</span>
        </button>
        <div class="info-panel" id="info-panel" inert aria-hidden="true">
          <template class="info-panel-template">
          <div class="info-panel-inner">
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
                全場實名制
                <span class="sub">入場請攜帶票券及填寫的有效證件正本；外籍觀眾依售票平台規定攜帶護照正本</span>
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
                依 Ticket Plus 遠大售票平台提供
                <span class="sub">實名制資料請務必填寫正確，入場規定以售票平台公告為準</span>
              </dd>

              <dt>購票</dt>
              <dd>
                Ticket Plus 遠大售票
                <span class="sub">票務、實名制與入場問題請依售票平台最新公告確認</span>
              </dd>
            </dl>

            <a class="info-book-link" href="https://ticketplus.com.tw/activity/6c3d8c24e0f00c9c84777615c001bebe" target="_blank" rel="noopener">
              ${Te} 前往 Ticket Plus 售票頁面
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
                    <td class="label" data-label="項目">周邊／物品寄放</td>
                    <td data-label="10/31（六）">待公告</td>
                    <td data-label="11/1（日）">待公告</td>
                    <td class="note" data-label="備註">請以主辦與場館公告為準</td>
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
            <p class="info-footnote">※ 目前官方已確認開場與開演時間；周邊販售、物品寄放與入場動線公布後會再補上。<br>※ 最新資訊請以主辦單位、Ticket Plus 與台北小巨蛋公告為準。</p>



          </div>
          </template>
        </div>
      </div>

      <div class="info-card" id="notice-card">
        <button class="menu-row info-toggle" aria-expanded="false">
          <span class="info-toggle-icon">${Fs}</span>
          <span class="info-toggle-label">公告・指南</span>
          <span class="info-toggle-chevron">${ae}</span>
        </button>
        <div class="info-panel" inert aria-hidden="true">
          <template class="info-panel-template">
          <div class="info-panel-inner">
            <p class="way-note">台北場的場館地圖、MD、身分確認等<b>官方公告</b>會在公布後補上。</p>
            <div class="notice-grid" id="notice-grid"></div>
            <p class="notice-empty" id="notice-empty" hidden>
              台北場官方公告圖片尚未公布，請先以主辦與場館公告為準。
            </p>
            <p class="info-footnote">※ 台北場官方公告圖片公布後再更新。</p>
          </div>
          </template>
        </div>
      </div>

      <div class="info-card" id="seat-card">
        <button class="menu-row info-toggle" aria-expanded="false">
          <span class="info-toggle-icon">${qs}</span>
          <span class="info-toggle-label">座位配置圖</span>
          <span class="info-toggle-chevron">${ae}</span>
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
              <p class="seat-map-caption">點擊圖片後才會載入壓縮原圖，可開啟原尺寸查看。</p>
            </div>
            <p class="way-note">圖中票價與票區依主辦單位公布的配置圖整理；實際座位、入場動線與現場安排仍以票券及演出當日公告為準。</p>
            <div class="info-book-links">
              <a class="info-book-link" href="https://ticketplus.com.tw/activity/6c3d8c24e0f00c9c84777615c001bebe" target="_blank" rel="noopener">
                ${Te} Ticket Plus 售票頁面
              </a>
              <a class="info-book-link" href="https://www.arena.taipei/" target="_blank" rel="noopener">
                ${Te} 台北小巨蛋官網
              </a>
              <a class="info-book-link" href="https://twconcertview.com/venue/taipei-arena-center-stage/" target="_blank" rel="noopener">
                ${Te} 台灣各大場館視野
              </a>
            </div>

            <p class="info-footnote">※ 若主辦單位後續更新舞台、票區或票價，請以最新官方公告為準。</p>
          </div>
          </template>
        </div>
      </div>

      <div class="info-card" id="way-card">
        <button class="menu-row info-toggle" aria-expanded="false">
          <span class="info-toggle-icon">${Hs}</span>
          <span class="info-toggle-label">交通方式</span>
          <span class="info-toggle-chevron">${ae}</span>
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
          <span class="info-toggle-icon">${Us}</span>
          <span class="info-toggle-label">應援禮儀・第一次參加</span>
          <span class="info-toggle-chevron">${ae}</span>
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
                <li>大包包請放進<b>行李寄放處</b>・放在腳邊可能導致跌倒</li>
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
          <span class="info-toggle-icon">${Ds}</span>
          <span class="info-toggle-label">VAWS 會員票卡</span>
          <span class="info-toggle-chevron">${ae}</span>
        </button>
        <div class="info-panel" inert aria-hidden="true">
          <template class="info-panel-template">
          <div class="info-panel-inner">
            <div class="info-panel-title"><span class="bar">|</span> 場館限定特典 <span class="bar">|</span></div>

            <p class="way-note">VAWS MEMBERS 的「公演別原創票卡」為巡演場館限定企劃；台北場攤位位置、開放時間與領取方式目前尚待官方公告。</p>

            <dl class="info-facts">
              <dt>台北場</dt>
              <dd>
                <span class="em">台北小巨蛋 Taipei Arena</span>
                <span class="sub">2026.10.31（六）・11.01（日）</span>
              </dd>

              <dt>對象</dt>
              <dd>
                <span class="em">VAWS MEMBERS 會員</span>
                <span class="sub">是否可於演出當日新加入、兌換地點與流程，請等待官方公告</span>
              </dd>

              <dt>攤位資訊</dt>
              <dd>
                <span class="em">待官方公布</span>
                <span class="sub">其他場次的攤位位置與營運時間不適用於台北場</span>
              </dd>
            </dl>

            <ul class="way-ul warn">
              <li>官方公布後，請依公告中的 QR 碼與兌換流程辦理。</li>
              <li>攤位時間與數量可能依準備狀況、天氣及現場人流調整。</li>
              <li>開場前後預計人潮較多，請預留時間。</li>
            </ul>

            <a class="info-book-link" href="https://member.vaundy.jp/feature/ASIAARENATOUR_2026" target="_blank" rel="noopener">
              ${Te} 查看 VAWS 官方巡演頁面
            </a>

            <p class="info-footnote">※ 以上內容以 VAWS MEMBERS 官方公告為準，詳細安排可能依演出當天現場狀況調整。</p>
          </div>
          </template>
        </div>
      </div>

      <div class="menu-links">
        <a class="menu-chip" href="https://vaundy.jp/?lang=en" target="_blank" rel="noopener">
          <span class="chip-ico">${Te}</span>
          <span class="chip-label">官方網站</span>
        </a>
        <button class="menu-chip spoiler" type="button" id="setlist-btn">
          <span class="chip-ico warn">${Ca}</span>
          <span class="chip-label">東京/首爾歌單</span>
          <span class="chip-note">含劇透</span>
        </button>
      </div>
      </div>

      <!-- 폰 플래시(폰 반딧불) 안내 — 접지 않고 바로 보이는 한 문단 -->
      <aside class="home-note">
        <span class="home-note-ico">${Vs}</span>
        <div class="home-note-body">
          <b>請避免使用手機閃光燈</b>
          <p>舞台演出連燈光完全熄滅的瞬間都經過設計。觀眾席的一道光會打破黑暗，讓精心安排的畫面失去效果。</p>
          <p class="sub">若有全場一起舉燈的安排，演出中會另行通知。</p>
        </div>
      </aside>

      <div class="home-foot">
        <button class="share-btn" type="button" id="share-btn">${Os} 分享</button>
      </div>
        </section>
      </div>
    </section>

    ${Ba(e)}
  `}const A=[{id:"Tokimeki",title:"心動 (Tokimeki)",translationCredit:"巴哈姆特的月勳",youtubeId:"-_PKhPMXMDY"},{id:"KaijuNoHanauta",title:"怪獸之花歌 (怪獣の花唄)",translationCredit:"巴哈姆特的月勳",youtubeId:"UM9XNpgrqVk"},{id:"CHAINSAWBLOOD",title:"CHAINSAW BLOOD",translationCredit:"巴哈姆特的月勳",youtubeId:"FL1QjjkZVm4"},{id:"KoikazeniNosete",title:"乘著戀愛感冒 (恋風邪にのせて)",translationCredit:"巴哈姆特的月勳",youtubeId:"1FIhcdocT-k"},{id:"Odoriko",title:"舞者 (踊り子)",translationCredit:"巴哈姆特的月勳",youtubeId:"7HgJIAUtICU"},{id:"HadakaNoYusha",title:"裸身勇者 (裸の勇者)",translationCredit:"巴哈姆特的月勳",youtubeId:"FT0GKCuSaW0"},{id:"Fukakouryoku",title:"不可幸力 (不可幸力)",translationCredit:"巴哈姆特的月勳",youtubeId:"Gbz2C2gQREI"},{id:"Reunion",title:"重逢 (再会)",translationCredit:"巴哈姆特的月勳",youtubeId:"WcaSSvtHFeM"},{id:"hanaurana",title:"花占卜 (花占い)",translationCredit:"Smiecj",translationCreditUrl:"https://smiecj.com/2022/12/30/vaundy-hanauranai/",translationSourceUrl:"https://smiecj.com/2022/12/30/vaundy-hanauranai/",translationLicense:"CC BY-NC-SA 4.0",translationLicenseUrl:"https://creativecommons.org/licenses/by-nc-sa/4.0/",youtubeId:"onhBN0qkUcE"},{id:"Yobigoe",title:"呼喚聲 (呼び声)",translationCredit:"藍色小樹熊",translationCreditUrl:"https://bluekokomurmur.com/lyrics/vaundy-yobigoe/",translationSourceUrl:"https://bluekokomurmur.com/lyrics/vaundy-yobigoe/",youtubeId:"CI2x2aSi8aI"},{id:"Tomoshibi",title:"燈火 (灯火)",translationCredit:"巴哈姆特的月勳",youtubeId:"nrLZ-vTiQa4"},{id:"HowdoIknow'",title:"我怎麼會知道呢 (僕にはどうしてわかるんだろう)",translationCredit:"藍色小樹熊",translationCreditUrl:"https://bluekokomurmur.com/lyrics/vaundy-boku-niwa-doshite-wakarundarou/",translationSourceUrl:"https://bluekokomurmur.com/lyrics/vaundy-boku-niwa-doshite-wakarundarou/",youtubeId:"x4aWXNWPrtY"},{id:"Shiwaawase'",title:"皺褶相合 (しわあわせ)",youtubeId:"JwmGruvGt_I"},{id:"Homunculus",title:"人造小人 (ホムンクルス)",translationCredit:"巴哈姆特的月勳",youtubeId:"ZhUa0CumyxQ"},{id:"soramimi",title:"soramimi",youtubeId:"Jh_0EW6G3gQ"},{id:"TokyoFlash",title:"東京 Flash (東京フラッシュ)",translationCredit:"雨音子",translationCreditUrl:"https://ameotoko1997.blog.fc2.com/blog-entry-375.html",translationSourceUrl:"https://ameotoko1997.blog.fc2.com/blog-entry-375.html",youtubeId:"SIuF37EWaLU"},{id:"NakiJizo",title:"哭泣地藏 (泣き地蔵)",translationCredit:"巴哈姆特的月勳",youtubeId:"XQTM2M5iD_I"},{id:"napori",title:"napori",youtubeId:"ZeIGVnkYX04"},{id:"Backlight",title:"逆光 (逆光)",translationCredit:"巴哈姆特的月勳",youtubeId:"RhDxXvn6YaQ"},{id:"NEOJAPAN",title:"NEO JAPAN",youtubeId:"QC6gd_b1nz8"},{id:"ZuttoLoveSong",title:"一直都是情歌 (ずっとラブソング)",youtubeId:"wriTi0J_-1A"},{id:"Iseijin'",title:"偉生人 (偉生人)",translationCredit:"巴哈姆特的月勳",youtubeId:"aDaWuvpB_Kw"},{id:"ZERO",title:"ZERO",youtubeId:"Fs7MW0rx9Cw"},{id:"SonnaBitternaHanashi)",title:"那樣的 bitter 故事 (そんなbitterな話)",youtubeId:"V-gxqhWEbxI"},{id:"Fujin",title:"風神 (風神)",youtubeId:"yiU0I0tvt6s"},{id:"Jonetsu",title:"常熱 (常熱)",translationCredit:"Oblivionis",translationCreditUrl:"https://home.gamer.com.tw/artwork.php?sn=5830053",translationSourceUrl:"https://home.gamer.com.tw/artwork.php?sn=5830053",youtubeId:"fxtQ4Dsmqo0"},{id:"Kagero",title:"陽炎 (かげろう)",translationCredit:"巴哈姆特的月勳",youtubeId:"gY-7i-T76o0"},{id:"IdeagaAfureteNemurenai",title:"理念滿溢而無法入睡 (イデアが溢れて眠れない)",youtubeId:"0u_zA8BJG6A"},{id:"flyaway",title:"飛翔之時 (飛ぶ時)",translationCredit:"巴哈姆特的月勳",youtubeId:"ARj1adoUoEU"},{id:"mabuta",title:"眼瞼 (まぶた)",translationCredit:"巴哈姆特的月勳",youtubeId:"fjx_uy5eD8g"},{id:"Hitomibore",title:"為瞳孔著迷 (瞳惚れ)",youtubeId:"XEEXE8Ei5SA"},{id:"SekainoHimitsu",title:"世界的秘密 (世界の秘密)",translationCredit:"Smiecj",translationCreditUrl:"https://smiecj.com/2023/05/07/vaundy-sekainohimitu/",translationSourceUrl:"https://smiecj.com/2023/05/07/vaundy-sekainohimitu/",translationLicense:"CC BY-NC-SA 4.0",translationLicenseUrl:"https://creativecommons.org/licenses/by-nc-sa/4.0/",youtubeId:"xFoTFCHU70s"},{id:"Wasuremono",title:"遺忘之物 (忘れ物)",youtubeId:"tQq8C7irREk"},{id:"Timeparadox",title:"時間悖論 (タイムパラドックス)",translationCredit:"藍色小樹熊",translationCreditUrl:"https://bluekokomurmur.com/lyrics/vaundy-taimu-paradokkusu/",translationSourceUrl:"https://bluekokomurmur.com/lyrics/vaundy-taimu-paradokkusu/",youtubeId:"ewhRE-BvJCg"},{id:"TodomenoIchigeki",title:"最後一擊 (トドメの一撃)",translationCredit:"Smiecj",translationCreditUrl:"https://smiecj.com/2023/10/08/vaundy-todome/",translationSourceUrl:"https://smiecj.com/2023/10/08/vaundy-todome/",translationLicense:"CC BY-NC-SA 4.0",translationLicenseUrl:"https://creativecommons.org/licenses/by-nc-sa/4.0/",youtubeId:"7xRWOylrLfI"},{id:" Kimagure",title:"任性 (気まぐれ)",youtubeId:"uYyfD5A-w8Q"}],ni={"2026-10-31":[{t:"17:30",label:"開場・開始入場"},{t:"19:00",label:"正式演出開始"},{t:"21:00",label:"預計演出結束（以現場為準）"}],"2026-11-01":[{t:"17:30",label:"開場・開始入場"},{t:"19:00",label:"正式演出開始"},{t:"21:00",label:"預計演出結束（以現場為準）"}]},ai=[{start:"2026-10-31T19:00:00+08:00",end:"2026-10-31T21:30:00+08:00"},{start:"2026-11-01T19:00:00+08:00",end:"2026-11-01T21:30:00+08:00"}],si=[],ii=[],oi={wave_jump:{video:"./images/tips/wave_jump.webm",src:"./images/tips/wave_jump.webp",fallback:"./images/tips/wave_jump.gif",caption:"jump"},wave_chain:{video:"./images/tips/wave_chain.webm",src:"./images/tips/wave_chain.webp",fallback:"./images/tips/wave_chain.gif",caption:"跟著 Hu Hu Hu Hu"},wave_dada:{video:"./images/tips/wave_dada.webm",src:"./images/tips/wave_dada.webp",fallback:"./images/tips/wave_dada.gif",caption:"跟著 DA-DADADADA"},wave_turn:{video:"./images/tips/wave_turn.webm",src:"./images/tips/wave_turn.webp",fallback:"./images/tips/wave_turn.gif",caption:"旋轉雙手"},wave_rl:{video:"./images/tips/wave_rl.webm",src:"./images/tips/wave_rl.webp",fallback:"./images/tips/wave_rl.gif",caption:"向左右大幅揮動"},"wave-basic":{video:"./images/tips/wave-basic.webm",src:"./images/tips/wave-basic.webp",fallback:"./images/tips/wave-basic.gif",caption:"雙手舉過頭頂・向左右大幅揮動"},"wave-slow":{src:"./images/tips/wave-slow.gif",caption:"單手慢慢揮動"},"clap-basic":{src:"./images/tips/clap-basic.gif",caption:"在頭頂上方拍手"},jump:{src:"./images/tips/jump.gif",caption:"跳起來！"}},$a=Object.freeze({Tokimeki:120,KaijuNoHanauta:75,CHAINSAWBLOOD:147,KoikazeniNosete:118,Odoriko:157,HadakaNoYusha:163,Fukakouryoku:94,Reunion:150,hanaurana:135,Yobigoe:120,Tomoshibi:110,"HowdoIknow'":162,"Shiwaawase'":160,Homunculus:153,soramimi:130,TokyoFlash:98,NakiJizo:120,napori:130,Backlight:145,NEOJAPAN:176,ZuttoLoveSong:145,"Iseijin'":170,ZERO:105,"SonnaBitternaHanashi)":178,Fujin:97,Jonetsu:155,Kagero:100,IdeagaAfureteNemurenai:105,flyaway:142,mabuta:115,Hitomibore:110,SekainoHimitsu:160,Wasuremono:105,Timeparadox:82,TodomenoIchigeki:100," Kimagure":178}),ie={label:"東京/首爾",dates:"東京 09.05・09.06｜首爾 09.19・09.20",items:[{n:1,songs:[{id:"NakiJizo"}]},{n:2,songs:[{id:"Homunculus"}]},{n:3,songs:[{id:"HadakaNoYusha"}]},{n:4,songs:[{id:"Reunion",day:"六"},{id:"Backlight",day:"日"}]},{n:5,songs:[{id:"Fukakouryoku"}]},{n:6,songs:[{id:"Fujin"}]},{n:7,songs:[{id:"SonnaBitternaHanashi)"}]},{n:8,songs:[{id:"KoikazeniNosete"}]},{n:9,songs:[{id:" Kimagure"}]},{n:10,songs:[{id:"napori"}]},{n:11,songs:[{id:"Timeparadox"}]},{n:12,songs:[{id:"Shiwaawase'"}]},{n:13,songs:[{id:"TokyoFlash"}]},{n:14,songs:[{id:"TodomenoIchigeki"}]},{n:15,songs:[{id:"IdeagaAfureteNemurenai"}]},{n:16,songs:[{id:"Yobigoe"}]},{n:17,songs:[{id:"flyaway"}]},{n:18,songs:[{id:"soramimi"}]},{n:19,songs:[{id:"CHAINSAWBLOOD"}]},{n:20,songs:[{id:"Tokimeki",day:"六"},{id:"hanaurana",day:"日"}]},{n:21,songs:[{id:"KaijuNoHanauta"}]},{n:22,songs:[{id:"Odoriko"}]}]},Yn={cx:315,cy:210},Jn=[["A","floor",184,178,"153,119 213,119 213,154 275,205 258,223 140,223 121,204 121,150"],["B","floor",269,149,"220,119 311,119 311,169 280,199 220,150"],["C","floor",360,149,"319,119 410,119 410,149 349,199 319,169"],["D","floor",445,178,"417,119 477,119 508,149 509,204 490,223 371,223 355,205 417,154"],["E","floor",184,280,"140,235 258,235 275,254 213,304 212,340 154,340 121,308 121,254"],["F","floor",269,308,"279,260 283,261 311,289 311,339 220,340 220,309"],["G","floor",360,309,"348,260 355,263 410,309 410,340 319,340 319,289"],["H","floor",445,280,"372,235 490,235 509,254 509,308 476,340 418,340 417,304 355,254"],["201","r",482,404,"456,386 495,386 519,421 456,421"],["202","r",408,398,"363,386 454,386 454,410 363,411"],["203","r",315,398,"270,386 360,386 360,411 270,411"],["204","r",221,398,"177,386 267,386 267,411 177,411"],["205","r",147,404,"135,386 174,386 174,421 111,421"],["206","r",89,370,"73,328 132,385 111,416 44,350"],["207","r",54,300,"39,262 72,262 72,327 41,349 38,348"],["208","r",55,229,"39,200 72,200 72,259 39,259"],["209","r",54,158,"39,110 72,132 72,197 39,197"],["210","r",89,87,"109,42 115,47 132,74 73,130 44,108"],["211","r",147,52,"111,37 174,37 174,72 135,72"],["212","r",221,58,"177,46 267,46 267,72 176,72"],["213","r",314,58,"270,46 360,46 360,72 270,72"],["214","r",408,58,"363,46 453,46 454,71 363,72"],["215","r",482,52,"456,37 519,38 495,72 456,72"],["216","r",540,87,"519,42 586,108 557,130 498,74"],["217","r",575,158,"589,110 591,110 591,197 558,197 558,132"],["218","r",574,229,"558,200 591,200 591,259 558,259"],["219","r",575,300,"558,262 591,262 591,349 558,327"],["220","r",539,370,"555,328 586,350 519,416 498,385"],["308","s",15,229,"0,178 15,178 16,200 36,200 36,259 15,259 14,281 0,281"],["309","s",16,128,"13,70 23,79 14,92 35,108 35,172 0,172 0,85"],["310","s",56,55,"65,17 95,47 47,94 18,64"],["311","s",125,14,"83,0 174,0 174,14 158,14 158,35 109,35 93,12 82,22 71,13"],["312","s",216,16,"176,0 267,0 267,14 250,14 251,35 176,35"],["313","s",315,17,"269,0 361,0 361,35 269,35"],["314","s",413,16,"363,0 454,0 454,35 379,35 379,14 363,14"],["315","s",504,14,"456,0 547,0 559,13 548,22 537,12 520,35 472,35 472,14 456,14"],["316","s",573,55,"563,17 612,64 583,94 535,47"],["317","s",613,128,"616,70 630,85 630,172 595,172 595,108 616,92 607,80"],["318","s",614,229,"615,178 630,178 630,281 615,280 614,258 594,259 594,200 614,200"],["319","s",613,330,"595,287 630,287 630,374 617,389 607,380 617,367 595,351"],["320","s",585,389,"581,365 584,365 612,393 590,416 561,388 561,385"],["W1","w",0,0,"107,38 110,42 47,106 40,107"],["W2","w",0,0,"522,38 590,107 586,108 580,103 574,94 553,75 554,73 551,73 520,42"],["W3","w",0,0,"42,350 110,416 108,420 40,353"],["W4","w",0,0,"587,350 590,353 522,420 520,416"],["STAGE","stage",314,229,"314,180 364,228 364,231 316,279 265,230"]].map(e=>({id:e[0],grade:e[1],x:e[2],y:e[3],pts:e[4]})),ri={floor:{label:"Floor 站席",cls:"floor"},r:{label:"R席・2樓指定席",cls:"r"},s:{label:"S席・3樓指定席",cls:"s"}},Xn="點選區域，查看座位等級與它在配置圖上的位置。",li=["上方","右上方","右側","右下方","下方","左下方","左側","左上方"],ci={A:"西側",B:"西側",E:"西側",F:"西側",C:"北側",D:"北側",G:"北側",H:"北側"},qe={jp:{label:"日本版",source:"日本版應援標記"},kr:{label:"韓國版",source:"韓國版應援標記"}},Ma="https://www.canva.com/design/DAGzhwjn1P4/WDMcBwi1A-ZJpX615SFpig/view",di="jp",tt={KaijuNoHanauta:{notes:["「もっと」「ねぇ もっと」請大聲喊；「君がいつも」也可以直接指向 Vaundy。","第一段「落ちてく過去は鮮明で……」整段一起唱；後段只跟著「眠れない夜に／眠らない夜を／眠くないまだね」這些標色回應詞。"],chantTimes:[46.5,58.5,97.5,110,123.5,127,130,146.5,161,175.5,178.5,182,188.5,191.5,195,201,203.5,206.5,213.5,216.5,219.5]},hanaurana:{notes:["副歌以雙手高舉、左右揮手為主；開心時可以跳。","這首日本版不要求整段跟唱，拍手與揮手盡情做即可。"],chantTimes:[46.5,53.5,110.5,118],chantSegments:[{time:160,text:"何年経っても妄想が",romaji:"nan nen tatte mo mōsō ga"},{time:163,text:"もうこんなに",romaji:"mō konnani"},{time:166.5,text:"花が散るほど",romaji:"hana ga chiru hodo"}]},Backlight:{notes:["副歌一起大聲唱；最後一段兩次都是「悪党ふっ飛ばして」，請特別注意。"],chantTimes:[46.5,59,126,139,193.5,207],chantSegments:[{time:53.5,text:"ないやないやないや",romaji:"nai ya na iya na iya"},{time:56.5,text:"ないさないさ",romaji:"nai sa nai sa"},{time:66.5,text:"ないな ないなないな",romaji:"nai na nai na nai na"},{time:70,text:"ないさないさ",romaji:"nai sa nai sa"},{time:132.5,text:"ないやないやないや",romaji:"nai ya na iya na iya"},{time:136,text:"ないさないさ",romaji:"nai sa nai sa"},{time:146,text:"ないな ないなないな",romaji:"nai na nai na nai na"},{time:149.5,text:"ないさないさ",romaji:"nai sa nai sa"},{time:200.5,text:"ないやないやないや",romaji:"nai ya na iya na iya"},{time:204,text:"ないさないさ",romaji:"nai sa nai sa"},{time:214,text:"ないな ないなないな",romaji:"nai na nai na nai na"},{time:217,text:"ないさないさ",romaji:"nai sa nai sa"}]},Tomoshibi:{notes:["日本版最重要的兩個應援點是「ねぇ」與「けど まだ」，請大聲喊出來。","拍手跟著鼓聲即可。"],chantTimes:[121,140]},Jonetsu:{notes:["拍手會在 1/2 拍與 1/4 拍之間切換，請跟著鼓點。","最後一段副歌前 Vaundy 喊話時可以一起尖叫，再跟著他搖擺。"],chantTimes:[]},Odoriko:{notes:["副歌舉起食指逆時針旋轉。","第一段「とぅるるる……」是安靜段落，不用拍手；最後副歌唱完手勢自由。"],chantTimes:[]},KoikazeniNosete:{notes:["「愛で」與「日々が」請大聲唱出來，三次副歌都一樣。"],chantTimes:[],chantSegments:[{time:60.5,text:"愛で",romaji:"ai de"},{time:68.5,text:"日々が",romaji:"hibi ga"},{time:77,text:"愛で",romaji:"ai de"},{time:85,text:"日々が",romaji:"hibi ga"},{time:142,text:"愛で",romaji:"ai de"},{time:150,text:"日々が",romaji:"hibi ga"},{time:158.5,text:"愛で",romaji:"ai de"},{time:166.5,text:"日々が",romaji:"hibi ga"},{time:209.5,text:"愛で",romaji:"ai de"},{time:217,text:"日々が",romaji:"hibi ga"},{time:225.5,text:"愛で",romaji:"ai de"},{time:233.5,text:"日々が",romaji:"hibi ga"}]},Homunculus:{notes:["開頭與尾段的「Oh-yeah, yeah-yeah-yeah」請盡量吸飽氣唱。","副歌的「ホムンクルス!」最重要；其他「イチ・ニー・サン」等應援能跟上就好。"],chantTimes:[59,62.5,65.5,72,77,109.5,112.5,115.5,122,127,181.5,187.5,190.5,196.5,200]},Tokimeki:{notes:["日本版會區分 Uh／Yeah、Da、Na、Tu 等不同應援聲，請跟著各段節奏。","「Tokimekiのせい」很重要；這首歌可以和 Vaundy 一起玩得很 High。"],chantTimes:[17,26.5,33,38,49,54,63.5,89,99,105,110,121,126,134.5,153,159.5,161,166,177,182,191.5],chantSegments:[{time:44,text:"ないぜ",romaji:"nai ze"},{time:115.9,text:"ないぜ",romaji:"nai ze"},{time:145,text:"しまうの",romaji:"shimauno"},{time:172,text:"ないぜ",romaji:"nai ze"}]},CHAINSAWBLOOD:{notes:["日本版需要跟上的聲音應援很多，B 段先抓準進入時機，後半能整段跟上就很厲害。","✋⬆️ 是高舉雙手的動作；✋⤴️ 是高舉手、手心向前拋。"],chantTimes:[32.5,38,43,51.5,57,64.5,89.5,94,111,116.5,121.5,129.5,135.5,142.5,159.5,170.5,176.5,183.5]},Fukakouryoku:{notes:["副歌一起唱「Welcome to the dirty night」。","「あれ なに」「それ なに」「愛で」是熟悉 VAWS 應援的人會喊的回應。"],chantTimes:[54,59,64,69.5,97.5,102.5,108,113,176.5,181.5,187,192],chantSegments:[{time:41.5,text:"あれ、なに",romaji:"are, nani"},{time:46.5,text:"それ、なに",romaji:"sore, nani"},{time:85,text:"あれ、なに",romaji:"are, nani"},{time:90.5,text:"それ、なに",romaji:"sore, nani"},{time:154.5,text:"愛で",romaji:"ai de"}]},soramimi:{notes:["日本版副歌重點是跟著 Vaundy 一起跳；Distance／This dance? 是跳舞時的口號。"],chantTimes:[70,128,147.5]},HadakaNoYusha:{notes:["三次「愛して」只唱這三個字；後面的歌詞不需要整段跟唱。","「それは涙と対になって」與「そこは涙と対になって」請整段一起唱。"],chantTimes:[82,94],chantSegments:[{time:34.5,text:"愛して",romaji:"aishi te"},{time:105,text:"愛して",romaji:"aishi te"},{time:152,text:"愛して",romaji:"aishi te"}]},"Iseijin'":{notes:["第二次 Whoa, whoa, whoa, yeah, yeah 是三次，接著唱 True, true, true。","副歌以「先生」與「全然」交互喊為主。"],chantTimes:[33,183,194.5],chantSegments:[{time:47,text:"先生",romaji:"sensei"},{time:50.5,text:"全然",romaji:"zenzen"},{time:59,text:"先生",romaji:"sensei"},{time:61.5,text:"全然",romaji:"zenzen"},{time:104,text:"先生",romaji:"sensei"},{time:106.5,text:"全然",romaji:"zenzen"},{time:161.5,text:"先生",romaji:"sensei"},{time:163,text:"全然",romaji:"zenzen"},{time:171.5,text:"先生",romaji:"sensei"},{time:174.5,text:"全然",romaji:"zenzen"}]},ZuttoLoveSong:{notes:["副歌可以跟 Vaundy 一樣高舉手比 1。","「あの日から消えない……」有人會跟鼓聲連打兩下，屬於自由選擇。"],chantTimes:[55,154],chantSegments:[{time:67.5,text:"キャトルミューティレイション",romaji:"kyatorumyūtireishon"},{time:167,text:"キャトルミューティレイション",romaji:"kyatorumyūtireishon"},{time:183,text:"oh yeah",romaji:"oh yeah"}]},Yobigoe:{notes:["依橘色標記跟唱；如果想簡化，只要跟著唱「チェンジ」也可以。"],chantTimes:[32.5,41,47,54.5,61,68,75,140,144,151,166.5,175,181.5,184,188,202.5,209.5,215],chantSegments:[{time:50.5,text:"輝いて",romaji:"kagayai te"},{time:64.5,text:"輝いて",romaji:"kagayai te"},{time:78.5,text:"今チェンジ",romaji:"kon chenji"},{time:133.5,text:"今チェンジ",romaji:"kon chenji"},{time:197,text:"チェンジ",romaji:"chenji"},{time:197,text:"輝いて",romaji:"kagayai te"},{time:212,text:"どんな夜も Ah~",romaji:"donna yoru mo Ah ~"}]},TokyoFlash:{notes:["副歌以「できてるできてる」「悪くない悪くない」與「何処へ行こう」作為回應，並配合前後揮手。","中段需要安靜的地方不要拍手。"],chantTimes:[26,37.5,69,79,107,118,150,159.5,201.5,211,221,230.5]},TodomenoIchigeki:{notes:["副歌回應從「今日の夜は／今夜だけは」開始，接著唱「祈りあった未来とて」「道が違うのよ」「アナタ」「互いの殺意で」「トドメ」。"],chantTimes:[62,63.5,73,84.5,87,94,96.5,155,159.5,169,180.5,183,190,192.5,236,246,256,262,265,276.5,279,286,288.5,295.5,298,305,307.5]}},ui=["整體：日本版把「要跟唱」和「只做動作」分開標示；韓國版的 vocal cue 較密，常把整段副歌或回應片段標成大合唱。","怪獣の花唄：日本版強調「もっと／ねぇ もっと」、可指向 Vaundy 的「君がいつも」，以及第一段「落ちてく過去は鮮明で……」；韓國版則把更多副歌與後段波浪手勢列為跟唱。","花占い：日本版副歌以左右揮手、開心時跳躍為主，跟唱不是必要；韓國版有較明確的「なんて／抱いて／何年経っても」回應段。","逆光：日本版是副歌整體大聲唱，最後特別注意「悪党ふっ飛ばして」；韓國版較偏向「ないや／ないさ／ないな」的分段回應。","灯火／常熱：日本版分別集中在「ねぇ／けど まだ」與鼓點拍手、終段前尖叫；韓國版有更廣的副歌大合唱標記。","踊り子：日本版的核心是食指逆時針旋轉，第一段「とぅるるる」保持安靜；韓國版把較多旋律段落也列入大合唱。","恋風邪にのせて：兩版都重視「愛で／日々が」，是差異最小的歌曲之一。","ホムンクルス／Tokimeki：日本版更強調固定口號的順序（「ホムンクルス!」、Uh／Yeah、Da、Na、Tokimekiのせい）；韓國版則有較多 Hu／DA 與整段揮手標記。","CHAINSAW BLOOD／不可幸力：日本版更細分手勢與回應進場時機；不可幸力的「Welcome to the dirty night」以及「愛で」尤其要跟上。","soramimi／裸の勇者：日本版分別以跟著跳舞、以及安靜唱兩次「愛して」為主；韓國版大合唱範圍較廣。","偉生人／ずっとラブソング：日本版有明確的「Whoa → True, true, true」與食指比 1；韓國版對應的口號和揮手行較多。","呼び声／東京フラッシュ／トドメの一撃：日本版允許簡化（只唱「チェンジ」）或依副歌回應詞跟唱；韓國版則多以完整副歌行與固定揮手段落標記。"],pi={Tokimeki:{chant:{jp:25,kr:25},clap:!0,wave:!0,jump:!1,spin:!1},KaijuNoHanauta:{chant:{jp:21,kr:35},clap:!0,wave:!0,jump:!1,spin:!1},CHAINSAWBLOOD:{chant:{jp:18,kr:22},clap:!0,wave:!0,jump:!0,spin:!1},KoikazeniNosete:{chant:{jp:12,kr:12},clap:!0,wave:!0,jump:!1,spin:!1},Odoriko:{chant:{jp:0,kr:7},clap:!0,wave:!1,jump:!1,spin:!0},HadakaNoYusha:{chant:{jp:5,kr:7},clap:!0,wave:!0,jump:!1,spin:!1},Fukakouryoku:{chant:{jp:17,kr:21},clap:!0,wave:!0,jump:!1,spin:!1},Reunion:{chant:{jp:10,kr:10},clap:!0,wave:!0,jump:!1,spin:!1},hanaurana:{chant:{jp:7,kr:11},clap:!0,wave:!0,jump:!1,spin:!1},Yobigoe:{chant:{jp:24,kr:25},clap:!0,wave:!0,jump:!1,spin:!1},Tomoshibi:{chant:{jp:2,kr:7},clap:!0,wave:!0,jump:!1,spin:!1},"HowdoIknow'":{chant:{jp:8,kr:8},clap:!1,wave:!0,jump:!1,spin:!1},"Shiwaawase'":{chant:{jp:11,kr:11},clap:!1,wave:!1,jump:!1,spin:!1},Homunculus:{chant:{jp:15,kr:20},clap:!0,wave:!0,jump:!1,spin:!1},soramimi:{chant:{jp:3,kr:25},clap:!0,wave:!0,jump:!0,spin:!1},TokyoFlash:{chant:{jp:12,kr:31},clap:!1,wave:!0,jump:!1,spin:!1},NakiJizo:{chant:{jp:8,kr:8},clap:!0,wave:!0,jump:!1,spin:!1},napori:{chant:{jp:18,kr:18},clap:!1,wave:!1,jump:!1,spin:!1},Backlight:{chant:{jp:18,kr:12},clap:!0,wave:!0,jump:!1,spin:!1},NEOJAPAN:{chant:{jp:4,kr:4},clap:!1,wave:!1,jump:!1,spin:!1},ZuttoLoveSong:{chant:{jp:5,kr:12},clap:!1,wave:!0,jump:!1,spin:!1},"Iseijin'":{chant:{jp:13,kr:23},clap:!0,wave:!0,jump:!1,spin:!1},ZERO:{chant:{jp:10,kr:10},clap:!1,wave:!1,jump:!1,spin:!1},"SonnaBitternaHanashi)":{chant:{jp:10,kr:10},clap:!1,wave:!0,jump:!1,spin:!1},Fujin:{chant:{jp:19,kr:19},clap:!0,wave:!0,jump:!1,spin:!1},Jonetsu:{chant:{jp:0,kr:18},clap:!0,wave:!0,jump:!1,spin:!1},Kagero:{chant:{jp:19,kr:19},clap:!1,wave:!0,jump:!1,spin:!1},IdeagaAfureteNemurenai:{chant:{jp:16,kr:16},clap:!1,wave:!0,jump:!1,spin:!1},flyaway:{chant:{jp:22,kr:22},clap:!0,wave:!0,jump:!0,spin:!1},mabuta:{chant:{jp:11,kr:11},clap:!0,wave:!0,jump:!1,spin:!1},Hitomibore:{chant:{jp:2,kr:2},clap:!0,wave:!0,jump:!1,spin:!1},SekainoHimitsu:{chant:{jp:1,kr:1},clap:!0,wave:!1,jump:!1,spin:!1},Wasuremono:{chant:{jp:0,kr:0},clap:!1,wave:!0,jump:!1,spin:!1},Timeparadox:{chant:{jp:0,kr:0},clap:!0,wave:!1,jump:!1,spin:!1},TodomenoIchigeki:{chant:{jp:27,kr:28},clap:!0,wave:!0,jump:!1,spin:!1}," Kimagure":{chant:{jp:0,kr:0},clap:!1,wave:!1,jump:!1,spin:!1}};let zt=null,Yt=null,Jt=null,Zn=!1,Xt=null;function fi(){return Jt||(Jt=et(async()=>{const{SONG_LYRICS:e}=await import("./song-lyrics-BdR8fsLA.js");return{SONG_LYRICS:e}},[],import.meta.url).then(({SONG_LYRICS:e})=>new Map(e.map(t=>[t.id,t]))).catch(()=>new Map)),Jt}function Qn(){return Xt||(Xt=et(()=>import("./furigana-corrections-Bd6BqEDn.js"),[],import.meta.url).then(e=>e).catch(()=>null)),Xt}function ea(e){if(Zn||!e)return;const{FURIGANA_CORRECTIONS:t,ROMAJI_CORRECTIONS:n}=e;window.JP_FURIGANA&&(window.JP_FURIGANA=Object.freeze({...window.JP_FURIGANA,...t})),window.JP_ROMAJI&&(window.JP_ROMAJI=Object.freeze({...window.JP_ROMAJI,...n})),!(!window.JP_FURIGANA&&!window.JP_ROMAJI)&&(Zn=!0)}function mi(){return window.JP_FURIGANA||window.JP_ROMAJI?Qn().then(ea):(zt||(zt=Promise.all([et(()=>import("./furigana-BmLGyUBE.js"),[],import.meta.url),Qn()]).then(([,e])=>ea(e)).catch(()=>{})),zt)}function hi(){return window.KARAOKE_SOURCES?Promise.resolve(window.KARAOKE_SOURCES):(Yt||(Yt=et(()=>import("./karaoke-sources-BPOB1whk.js"),[],import.meta.url).then(()=>window.KARAOKE_SOURCES||null).catch(()=>null)),Yt)}const gi=[400,500,700],yi=/[\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u;let Zt=null,ta="";function na(e,t=!1){if(document.head.querySelector(`link[rel="preconnect"][href="${e}"]`))return;const n=document.createElement("link");n.rel="preconnect",n.href=e,t&&(n.crossOrigin="anonymous"),document.head.appendChild(n)}function bi(e){const t=Array.isArray(e)?e.join(""):String(e??"");return[...new Set([...t].filter(n=>yi.test(n)))].sort((n,a)=>n.codePointAt(0)-a.codePointAt(0)).join("")}function vi(e,t=gi){const n=bi(e);if(!n)return;const a=[...new Set(t)].map(Number).filter(r=>Number.isInteger(r)&&r>=100&&r<=900).sort((r,l)=>r-l);if(!a.length)return;const s=`${a.join(",")}:${n}`;if(Zt?.isConnected&&ta===s)return;Zt?.remove();const i=new URLSearchParams({family:`Noto Sans JP:wght@${a.join(";")}`,display:"swap",text:n});na("https://fonts.googleapis.com"),na("https://fonts.gstatic.com",!0);const o=document.createElement("link");o.rel="stylesheet",o.href=`https://fonts.googleapis.com/css2?${i.toString()}`,o.dataset.japaneseFontSubset="true",ta=s,Zt=o,document.head.appendChild(o)}function b(e,t){try{if(t===void 0)return localStorage.getItem(e);localStorage.setItem(e,t)}catch{return null}}const ki="html,body{width:100%;height:100%;margin:0;overflow:hidden}body{background:var(--stage, var(--ui-bg, #151619));color:var(--ui-text, #f5f5f7)}[hidden]{display:none!important}.document-pip{box-sizing:border-box;display:flex!important;flex-direction:column;gap:7px;width:100%;height:100%;min-height:100%;padding:12px 14px 10px;overflow:hidden;background:var(--stage, var(--ui-bg, #151619));color:var(--ui-text, #f5f5f7)}.document-pip .pip-head{flex:none;display:flex;align-items:baseline;gap:8px;min-width:0}.document-pip .pip-kicker{flex:none;color:var(--ui-accent, #e9d9a3);font-family:var(--font-tw-sans, system-ui, sans-serif);font-size:10px;letter-spacing:.08em;white-space:nowrap}.document-pip .pip-title{min-width:0;overflow:hidden;color:var(--ui-muted, #a9a9af);font-family:var(--font-tw-sans, system-ui, sans-serif);font-size:11px;line-height:1.35;text-overflow:ellipsis;white-space:nowrap}.document-pip .pip-status{flex:none;min-height:14px;color:var(--ui-muted, #a9a9af);font-size:10px;line-height:1.4}.document-pip .pip-lyrics{flex:1 1 auto;display:flex;flex-direction:column;justify-content:center;min-height:0;overflow:hidden}.document-pip .pip-line-group{min-width:0}.document-pip .pip-line-label{margin:0 6px 2px;color:var(--ui-muted, #a9a9af);font-family:var(--font-tw-sans, system-ui, sans-serif);font-size:9px;letter-spacing:.08em}.document-pip .pip-current-line,.document-pip .pip-next-line{min-width:0}.document-pip .pip-empty{margin:0;padding:12px 9px;border-radius:8px;color:var(--ui-muted, #a9a9af);font-size:13px;line-height:1.45;text-align:center}.document-pip .lyric-line{width:100%;box-sizing:border-box;display:flex;align-items:flex-start;gap:6px;margin:0;padding:5px 7px;border:0;border-radius:8px;background:transparent;color:var(--ui-text, #f5f5f7);cursor:default;pointer-events:none;text-align:left}.document-pip .pip-current-line .lyric-line{min-height:48px;border-left:3px solid var(--ui-accent, #e9d9a3);background:var(--ui-hover, rgba(255,255,255,.08))}.document-pip .pip-next-line{margin-top:5px;opacity:.58}.document-pip .lyric-body{overflow-wrap:anywhere}.document-pip .pip-current-line .lyric-jp{font-size:clamp(14px,3.2vw,18px);line-height:1.3}.document-pip .pip-current-line .lyric-romaji{font-size:clamp(10px,2.5vw,13px);line-height:1.25}.document-pip .pip-current-line .lyric-zh{font-size:clamp(12px,2.8vw,15px);line-height:1.3}.document-pip .pip-next-line .lyric-jp{font-size:clamp(11px,2.6vw,14px);line-height:1.28}.document-pip .pip-next-line .lyric-romaji{font-size:clamp(9px,2.2vw,11px);line-height:1.25}.document-pip .pip-next-line .lyric-zh{font-size:clamp(11px,2.6vw,13px);line-height:1.3}.document-pip.lyrics-hidden .pip-current-line>.lyric-line,.document-pip.lyrics-hidden .pip-next-group{display:none}.document-pip .pip-controls{flex:none;display:flex;align-items:center;gap:6px;min-height:40px}.document-pip .pip-action{min-width:40px;min-height:40px;display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:6px 9px;border:1px solid var(--ui-line, rgba(255,255,255,.15));border-radius:8px;background:var(--ui-raised, rgba(255,255,255,.08));color:var(--ui-text, #f5f5f7);font:var(--type-control, 11px/1.2 system-ui, sans-serif);cursor:pointer}.document-pip .pip-action:hover{background:var(--ui-hover, rgba(255,255,255,.13))}.document-pip .pip-action:focus-visible{outline:2px solid var(--ui-accent, #e9d9a3);outline-offset:2px}.document-pip .pip-action:active{transform:scale(.97)}.document-pip .pip-action:disabled{cursor:not-allowed;opacity:.42}.document-pip .pip-action svg{flex:none;width:16px;height:16px}.document-pip .pip-play{color:var(--ui-accent, #e9d9a3)}.document-pip .pip-return{margin-left:auto}.document-pip .pip-close{color:var(--ui-muted, #a9a9af)}@media(prefers-reduced-motion:reduce){.document-pip *,.document-pip *:before,.document-pip *:after{animation:none!important;transition:none!important}.document-pip .pip-action:active{transform:none}}@media(max-width:360px){.document-pip{padding:10px}.document-pip .pip-action{padding-left:7px;padding-right:7px}.document-pip .pip-action-label{display:none}}",wi=420,Ei=240,xi=new Set(["karaoke-lit","karaoke-current"]);function Si(){try{return typeof window<"u"&&typeof window.documentPictureInPicture?.requestWindow=="function"}catch{return!1}}function Ii(e,t){e.querySelectorAll('link[rel="stylesheet"]').forEach(a=>{const s=t.createElement("link");s.rel="stylesheet",s.href=a.href,t.head.appendChild(s)}),e.querySelectorAll("style").forEach(a=>{t.head.appendChild(a.cloneNode(!0))});const n=t.createElement("style");n.textContent=ki,t.head.appendChild(n)}function Ai(e,t){const n=e.querySelector(".icon-sprite");n&&t.body.appendChild(n.cloneNode(!0))}function aa(e){return String(e||"").replace(/\s+class="([^"]*)"/gu,(t,n)=>{const a=n.split(/\s+/u).filter(s=>s&&!xi.has(s));return a.length?` class="${a.join(" ")}"`:""}).replace(/\s+style="[^"]*"/gu,"")}function sa(e,t){if(!e||!t)return!0;const n=e.ownerDocument.createElement("template");n.innerHTML=t;const a=[...e.querySelectorAll(".karaoke-unit")],s=[...n.content.querySelectorAll(".karaoke-unit")];return a.length!==s.length?!1:(a.forEach((i,o)=>{const r=s[o];i.classList.toggle("karaoke-lit",r.classList.contains("karaoke-lit")),i.classList.toggle("karaoke-current",r.classList.contains("karaoke-current"));const l=r.style.getPropertyValue("--karaoke-word-progress");l?i.style.setProperty("--karaoke-word-progress",l):i.style.removeProperty("--karaoke-word-progress")}),!0)}function Qt(e,t,n,a,s){const i=e.createElement("button");return i.type="button",i.className=`pip-action ${t}`,i.innerHTML='<span class="pip-action-icon" aria-hidden="true"></span><span class="pip-action-label"></span>',i.querySelector(".pip-action-icon").innerHTML=a||"",i.querySelector(".pip-action-label").textContent=n,i.addEventListener("click",o=>{o.preventDefault();try{s()}catch{}}),i}function Ti({onPlayPause:e=()=>{},onFocusOpener:t=()=>{},onClosed:n=()=>{}}={}){const a=Si();let s=null,i=null,o=null,r=!1,l=null,c=null;function p(){l=null,c=null}function d(h,v=!0){s===h&&(s=null,i=null,p(),v&&n())}function u(){return s?s.closed?(d(s),!1):!0:!1}function m(h,v,k){if(h.replaceChildren(),!v){const D=h.ownerDocument.createElement("p");D.className="pip-empty",D.textContent=k||"等待同步…",h.appendChild(D);return}const L=h.ownerDocument.createElement("template");L.innerHTML=v,h.appendChild(L.content.cloneNode(!0))}function g(h={}){if(!i)return;const v=i.ownerDocument,k=h.showJapanese!==!1,L=h.showChinese!==!1,D=!k&&!L,x=D?"":String(h.currentMarkup||""),Ae=D?"":String(h.nextMarkup||""),te=D?"歌詞已隱藏":x?"":"等待第一句…",Dn=h.theme==="light"?"light":"dark";v.documentElement.dataset.theme=Dn,i.dataset.theme=Dn,i.classList.toggle("reading-both",h.readingMode==="both"),i.classList.toggle("hide-japanese",!k),i.classList.toggle("hide-chinese",!L),i.classList.toggle("karaoke-off",h.karaokeEnabled===!1),i.classList.toggle("lyrics-hidden",D),h.iconBeatDuration?i.style.setProperty("--icon-beat-duration",h.iconBeatDuration):i.style.removeProperty("--icon-beat-duration");const qn=i.querySelector(".pip-title");qn&&(qn.textContent=h.title||"同步字幕");const Wt=i.querySelector(".pip-status");Wt&&(Wt.textContent=h.status||"",Wt.hidden=!h.status);const Kt=i.querySelector(".pip-current-line");if(Kt){const Z=`${aa(x)}\0${te}`;(Z!==l||!sa(Kt,x))&&(m(Kt,x,te),l=Z)}const Un=i.querySelector(".pip-next-group"),Gt=i.querySelector(".pip-next-line");if(Un&&Gt){Un.hidden=!Ae;const Z=aa(Ae);(Z!==c||!sa(Gt,Ae))&&(m(Gt,Ae,""),c=Z)}const Re=i.querySelector(".pip-play");if(Re){const Z=h.isPlaying===!0;Re.disabled=h.canPlayPause!==!0,Re.querySelector(".pip-action-icon").innerHTML=Z?Na:ht,Re.querySelector(".pip-action-label").textContent=Z?"暫停":"播放",Re.setAttribute("aria-label",Z?"暫停主頁影片":"播放主頁影片")}const Vn=i.querySelector(".pip-return");Vn&&Vn.setAttribute("aria-label","返回主頁");const Wn=i.querySelector(".pip-close");Wn&&Wn.setAttribute("aria-label","關閉同步字幕小窗"),v.documentElement.lang="zh-Hant-TW"}function w(h){const v=h.document;v.documentElement.lang="zh-Hant-TW",v.title="同步字幕",v.head.replaceChildren(),v.body.replaceChildren(),Ii(document,v),Ai(document,v);const k=v.createElement("main");k.className="document-pip song-page",k.innerHTML=`
      <header class="pip-head">
        <span class="pip-kicker">同步字幕</span>
        <span class="pip-title"></span>
      </header>
      <p class="pip-status" role="status" aria-live="polite" hidden></p>
      <section class="pip-lyrics" aria-label="同步歌詞">
        <div class="pip-line-group pip-current-group">
          <div class="pip-line-label">目前</div>
          <div class="pip-current-line"></div>
        </div>
        <div class="pip-line-group pip-next-group">
          <div class="pip-line-label">下一句</div>
          <div class="pip-next-line"></div>
        </div>
      </section>
      <footer class="pip-controls" aria-label="字幕窗控制"></footer>
    `;const L=k.querySelector(".pip-controls");L.appendChild(Qt(v,"pip-play","播放",ht,e)),L.appendChild(Qt(v,"pip-return","返回主頁","",t)),L.appendChild(Qt(v,"pip-close","關閉",dn,V)),v.body.appendChild(k),i=k,p()}async function $(h={}){if(!a)return!1;if(s&&s.closed&&d(s),s){g(h);try{s.focus()}catch{}return!0}if(o){r=!1;const k=await o;if(k&&s){g(h);try{s.focus()}catch{}}return k}r=!1,o=(async()=>{try{const k=await window.documentPictureInPicture.requestWindow({width:wi,height:Ei});if(r){try{k.close()}catch{}return!1}return s=k,w(k),k.addEventListener("pagehide",()=>d(k),{once:!0}),g(h),!0}catch{return s=null,i=null,p(),!1}})();const v=await o;return o=null,v}function F(h){u()&&g(h)}function V(){if(o){r=!0;return}const h=s;if(h){d(h);try{h.close()}catch{}}}return Object.freeze({supported:a,open:$,update:F,close:V,isOpen:u})}const Li="./",T=document.getElementById("app"),S=document.getElementById("song-view");let ia=!0,ct=null,f=null,Ue=null,Le=!0,ce=!1;const dt=["kana","romaji","both"],oa=b("horo-reading");let j=dt.includes(oa)?oa:"kana",K=b("horo-show-japanese")!=="0",G=b("horo-show-chinese")!=="0";const Ni=b("horo-chant-version");let I=Ni==="kr"?"kr":di,_a=!1,_=b("horo-karaoke")==="1",be=-1,z=null,he=null,en=0,Ra=0,Pa=performance.now();function Ci(){if(document.head.querySelector('link[rel="manifest"]'))return;const e=document.createElement("link");e.rel="manifest",e.href=`${Li}manifest.json`,document.head.appendChild(e)}window.addEventListener("load",()=>window.setTimeout(Ci,8e3),{once:!0});const ji=100,jt="v1.10.4",Bi="https://home.gamer.com.tw/profile/index.php?owner=tsukilsao319";function ut(e){let t=E(e);const n=[],a=s=>{const i=`\0${n.length}\0`;return n.push(s),i};return t=t.replace(/`([^`]+)`/g,(s,i)=>a(`<code>${i}</code>`)),t=t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,(s,i,o)=>a(`<a href="${o}" target="_blank" rel="noopener">${ut(i)}</a>`)),t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),t.replace(/\u0000(\d+)\u0000/g,(s,i)=>n[Number(i)]||"")}function $i(e){const t=[];let n=!1;const a=()=>{n&&(t.push("</ul>"),n=!1)};return String(e||"").replace(/\r\n?/g,`
`).split(`
`).forEach(s=>{const i=s.trim();if(!i){a();return}const o=i.match(/^(#{1,3})\s+(.+)$/);if(o){a();const r=o[1].length;t.push(`<h${r}>${ut(o[2])}</h${r}>`);return}if(i.startsWith("- ")){n||(t.push("<ul>"),n=!0),t.push(`<li>${ut(i.slice(2))}</li>`);return}a(),t.push(`<p>${ut(i)}</p>`)}),a(),t.join("")}const Mi=/[?&]debug=1/.test(location.search);function _i(){if(!Mi)return;const e=document.createElement("div");e.id="dbg",e.style.cssText="position:fixed;left:6px;top:6px;z-index:9999;padding:5px 8px;background:rgba(0,0,0,.82);color:#7CFF9B;font:11px/1.45 ui-monospace,monospace;border-radius:7px;white-space:pre;pointer-events:none;max-width:92vw;",document.body.appendChild(e),setInterval(()=>{const t=document.querySelectorAll(".lyric-line.active").length,n=document.querySelectorAll("#lyrics-list, .lyrics-list").length;let a="-";try{f&&f.getCurrentTime&&(a=f.getCurrentTime().toFixed(1))}catch{a="ERR"}e.textContent=jt+"  틱 "+Ra+`
켜진 줄 `+t+` (하나여야 정상)
idx `+be+"  시간 "+a+"  목록 "+n+`
타이머 `+(Ue?"O":"X")+"  감시 "+(Be?"O":"X")},400)}const un=.35,Ri=260,Pi=.08,Hi=.65,nt=Object.freeze([.25,.5,.75,1,1.25,1.5,2]),Bt="horo-playback-rate",ra=Number(b(Bt));let P=nt.includes(ra)?ra:1,de=[],oe=null,y=null,la=0,it=null;const pn=window.matchMedia("(prefers-color-scheme: dark)"),ca=b("horo-theme");let $t=ca==="dark"?"dark":ca==="light"?"light":pn.matches?"dark":"light";const pe=Ti({onPlayPause:ys,onFocusOpener:()=>{try{window.focus()}catch{}},onClosed:wn});function Mt(e=""){return`<button class="theme-toggle ${e}" type="button" data-theme-toggle></button>`}function In(e,t=!1){$t=e,document.documentElement.dataset.theme=e,document.querySelector('meta[name="theme-color"]').content=e==="dark"?"#151619":"#f5f5f7",t&&b("horo-theme",e),document.querySelectorAll("[data-theme-toggle]").forEach(n=>{const a=e==="dark"?"淺色模式":"深色模式";n.innerHTML=e==="dark"?Js:ja,n.setAttribute("aria-label",`切換至${a}`),n.setAttribute("title",`切換至${a}`)}),me()}document.addEventListener("click",e=>{e.target.closest("[data-theme-toggle]")&&In($t==="dark"?"light":"dark",!0)});pn.addEventListener&&pn.addEventListener("change",e=>{b("horo-theme")||In(e.matches?"dark":"light")});function An(e=y,t=I){return e&&t==="jp"&&tt[e.id]||null}function gt(e=I){return qe[e]?.label||qe.jp.label}function yt(e=I){return zn[e]||zn.jp}function Ha(){return`<span class="chant-source-info">
    <b>應援版本說明</b>：預設為日本版，可用應援版本按鈕切換日本版／韓國版；切換後大合唱標記會同步更新。<br>
    <a href="${Ma}" target="_blank" rel="noopener">日本版參考：Canva《VAUNDY 應援教學》↗</a>
  </span>`}function Ye(){document.querySelectorAll("[data-chant-version]").forEach(e=>{const t=e.dataset.chantVersion===I;e.classList.toggle("active",t),e.setAttribute("aria-pressed",t?"true":"false")}),document.querySelectorAll("[data-chant-version-flag]").forEach(e=>{e.innerHTML=yt()}),document.querySelectorAll("[data-chant-version-toggle]").forEach(e=>{const t=I==="kr";e.classList.toggle("active",t),e.setAttribute("aria-pressed",t?"true":"false"),e.setAttribute("aria-label",`切換應援版本：目前${gt()}，點擊切換`),e.title="點擊切換日本版／韓國版";const n=e.querySelector(".chant-version-value");n&&(n.innerHTML=yt())})}function Oa(e=y){const t=document.getElementById("chant-version-note");if(!t)return;if(I==="kr"){t.innerHTML=`<b>${qe.kr.label}</b>：使用韓國場應援標記。`;return}if(!An(e,"jp")){t.innerHTML=`<b>${qe.jp.label}</b>：這首歌目前沒有獨立的日本版提示，暫沿用現有標記。`;return}t.innerHTML=`<b>${qe.jp.label}</b>：歌詞旁的麥克風圖示就是日本版大合唱段落。`}function Fa(e=y){const t=document.getElementById("chant-notes-toggle"),n=document.getElementById("chant-notes"),a=document.getElementById("chant-notes-list");if(!t||!n||!a)return;const s=I==="jp"?An(e,"jp"):null,i=s&&Array.isArray(s.notes)?s.notes.filter(l=>typeof l=="string"&&l.trim()):[],o=i.length>0,r=o&&_a;t.hidden=!o,t.classList.toggle("active",r),t.setAttribute("aria-expanded",r?"true":"false"),n.hidden=!r,a.innerHTML=i.map(l=>`<li>${E(l)}</li>`).join("")}document.addEventListener("click",e=>{const t=e.target.closest("[data-chant-version]");if(!t)return;const n=t.dataset.chantVersion;n!=="jp"&&n!=="kr"||Qa(n)});document.addEventListener("click",e=>{const t=e.target.closest("[data-chant-version-toggle]");if(t){if(e.preventDefault(),e.stopPropagation(),t.id==="guide-chant-version-btn"&&(ue=null,f&&typeof f.pauseVideo=="function"))try{f.pauseVideo()}catch{}Qa(I==="jp"?"kr":"jp")}});document.addEventListener("click",e=>{const t=e.target.closest("#chant-notes-toggle");if(!t||t.hidden)return;const n=document.getElementById(t.getAttribute("aria-controls")||"chant-notes");if(!n)return;const a=t.getAttribute("aria-expanded")!=="true";_a=a,t.classList.toggle("active",a),t.setAttribute("aria-expanded",a?"true":"false"),n.hidden=!a});function H(e){return String(e).padStart(2,"0")}function Da({resetScroll:e=!0}={}){Ui(),ye=null,gn();const t=location.hash.replace(/^#\/?/,"");let n=null;if(t.startsWith("song/")){const a=t.slice(5);let s=a;try{s=decodeURIComponent(a)}catch{}n=A.find(i=>i.id===s)||A.find(i=>i.id===a)||null}n?ts(n):t==="guide"?(ln(),vt("guide"),io()):t==="setlist"?(ln(),po()):(ln(),vt("guide"),ro(),to()),e&&window.scrollTo(0,0),In($t)}function Oi(e){const t=e.x-Yn.cx,n=e.y-Yn.cy,a=(Math.atan2(n,t)*180/Math.PI+450)%360;return"配置圖的"+li[Math.round(a/45)%8]}function Fi(e){const t=ri[e.grade],n=ci[e.id],a=e.grade==="floor"?n?`入場前請依現場公告前往 <span class="hi">${n}側站席等候區</span>。詳細位置請查看「公告・指南」中的場館地圖。`:"這是環繞舞台的站席區域。入場順序請依演出當天現場指示。":'<span class="warn">A 排・B 排可能因安全欄杆而有些許視線遮擋。</span>';return`<span class="grade ${t.cls}">${t.label}</span><b>${E(e.id)}區</b>・${Oi(e)}<br>${a} <button type="button" class="seat-clear">取消選取</button>`}function bt(e){const t=e&&e.closest?e.closest(".info-card"):null;if(!t||!t.classList.contains("open"))return;const n=t.querySelector(".info-panel");n&&(n.style.maxHeight=n.scrollHeight+"px")}let Di=[],qi=[],Ve=[],ge=0,He=null,Oe=null,We=null,tn=null,fn=0,se=null;function qa(e,t,{idle:n=!1}={}){const a=++fn,s=()=>{a===fn&&vi(e,t)};if(n){const i=()=>{typeof window.requestIdleCallback=="function"?window.requestIdleCallback(s,{timeout:1500}):window.setTimeout(s,1500)};typeof window.requestAnimationFrame=="function"?window.requestAnimationFrame(i):i();return}typeof window.requestAnimationFrame=="function"?window.requestAnimationFrame(()=>window.setTimeout(s,0)):window.setTimeout(s,0)}function Ui(){fn++,se?.(),se=null}function Ua(e,t,n){se?.();const a=["pointerdown","keydown","touchstart"],s=()=>{if(location.hash!==n){se?.(),se=null;return}se?.(),se=null,qa(e,t,{idle:!0})};se=()=>{a.forEach(o=>window.removeEventListener(o,s))},a.forEach(o=>window.addEventListener(o,s,{passive:!0}))}function Vi(){return A.map(e=>Tn(e.title)).join("")}function Tn(e){const t=String(e??""),n=t.match(/\(([^()]*)\)/);return n?n[1]:t}function Wi(e){const t=An(e,"jp");return[Tn(e.title),...(e.lyrics||[]).map(n=>n.jp||""),...(t?.chantSegments||[]).map(n=>n.text||"")]}function Va(e,t,n,a){if(!e||e.dataset.loaded==="1")return;e.dataset.loaded="1",e.innerHTML="",n.length=0;let s=t.length;const i=()=>{--s>0||(a&&(a.hidden=n.length>0),bt(e),zi(n))};if(!s){a&&(a.hidden=!1);return}t.forEach(o=>{const r=document.createElement("button");r.type="button",r.className="notice-item",r.hidden=!0,r.innerHTML=`<img alt="${E(o.title)}" decoding="async"><span class="cap">${E(o.title)}</span>`;const l=r.querySelector("img");l.loading="lazy",Number.isFinite(Number(o.width))&&Number.isFinite(Number(o.height))&&(l.width=Number(o.width),l.height=Number(o.height)),l.addEventListener("load",()=>{r.hidden=!1,l.naturalWidth>l.naturalHeight*1.05&&r.classList.add("wide"),n.push(o),n.sort((c,p)=>t.indexOf(c)-t.indexOf(p)),r.addEventListener("click",()=>Yi(n,n.indexOf(o))),bt(e),i()},{once:!0}),l.addEventListener("error",()=>{r.remove(),i()},{once:!0}),l.src=o.src,e.appendChild(r)})}function Ki(){const e=document.getElementById("notice-grid");!e||e.dataset.loaded==="1"||Va(e,si,Di,document.getElementById("notice-empty"))}function Gi(){const e=document.getElementById("vaws-grid");!e||e.dataset.loaded==="1"||Va(e,ii,qi,null)}function zi(e){if(!("serviceWorker"in navigator)||!e.length)return;const t=e.map(n=>n.src);navigator.serviceWorker.ready.then(n=>n.active&&n.active.postMessage({type:"CACHE_URLS",urls:t})).catch(()=>{})}function Yi(e,t){if(!e||!e.length)return;const n=document.getElementById("notice-view");if(!n)return;Ve=e,ge=Math.max(0,Math.min(e.length-1,t)),He=document.activeElement,Wa(),n.inert=!1,n.classList.add("open"),n.setAttribute("aria-hidden","false"),T.inert=!0,document.body.classList.add("no-scroll");const a=document.getElementById("nv-close");a&&a.focus()}function nn(){const e=document.getElementById("notice-view");e&&(e.classList.remove("open","zoom"),e.setAttribute("aria-hidden","true"),e.inert=!0,T.inert=!1,document.body.classList.remove("no-scroll"),He&&He.isConnected&&He.focus(),He=null)}function Wa(){const e=Ve[ge];if(!e)return;const t=document.getElementById("notice-view"),n=document.getElementById("nv-img"),a=document.getElementById("nv-title"),s=document.getElementById("nv-count"),i=document.getElementById("nv-prev"),o=document.getElementById("nv-next"),r=document.getElementById("nv-zoom"),l=document.getElementById("nv-scroll");n&&(n.src=e.src,n.alt=e.title,Number.isFinite(Number(e.width))&&Number.isFinite(Number(e.height))&&(n.width=Number(e.width),n.height=Number(e.height))),a&&(a.textContent=e.title),s&&(s.textContent=ge+1+" / "+Ve.length),i&&(i.disabled=ge===0),o&&(o.disabled=ge===Ve.length-1),t&&t.classList.remove("zoom"),r&&(r.textContent="放大"),l&&(l.scrollTop=0,l.scrollLeft=0)}function Pe(e){const t=ge+e;t<0||t>=Ve.length||(ge=t,Wa())}function Ji(){const e=document.getElementById("notice-view");if(!e||e.dataset.wired)return;e.dataset.wired="1";const t=document.getElementById("nv-zoom"),n=document.getElementById("nv-scroll"),a=()=>{const d=e.classList.toggle("zoom");t&&(t.textContent=d?"縮小":"放大"),n&&d&&(n.scrollLeft=(n.scrollWidth-n.clientWidth)/2)},s=document.getElementById("nv-close"),i=document.getElementById("nv-prev"),o=document.getElementById("nv-next");s&&s.addEventListener("click",nn),i&&i.addEventListener("click",()=>Pe(-1)),o&&o.addEventListener("click",()=>Pe(1)),t&&t.addEventListener("click",a);const r=document.getElementById("nv-img");r&&r.addEventListener("click",a),n&&n.addEventListener("click",d=>{d.target===n&&nn()}),document.addEventListener("keydown",d=>{if(e.classList.contains("open")){if(d.key==="Escape")d.preventDefault(),nn();else if(d.key==="ArrowLeft")d.preventDefault(),Pe(-1);else if(d.key==="ArrowRight")d.preventDefault(),Pe(1);else if(d.key==="Tab"){const u=[...e.querySelectorAll("button")].filter(w=>!w.disabled&&w.offsetParent!==null),m=u[0],g=u[u.length-1];d.shiftKey&&document.activeElement===m?(d.preventDefault(),g.focus()):!d.shiftKey&&document.activeElement===g&&(d.preventDefault(),m.focus())}}});let l=0,c=0,p=!1;e.addEventListener("touchstart",d=>{if(e.classList.contains("zoom"))return;const u=d.touches[0];l=u.clientX,c=u.clientY,p=!1},{passive:!0}),e.addEventListener("touchend",d=>{if(e.classList.contains("zoom")||p)return;const u=d.changedTouches[0],m=u.clientX-l,g=u.clientY-c;Math.abs(m)>60&&Math.abs(m)>Math.abs(g)*1.5&&Pe(m<0?1:-1)},{passive:!0})}function Xi(){return tn||(tn=et(()=>import("./CHANGELOG-CvXw0s_C.js"),[],import.meta.url).then(e=>e.default||"").catch(()=>"")),tn}function Zi(){const e=document.getElementById("changelog-view"),t=document.getElementById("changelog-content");if(!e||!t)return;t.dataset.rendered!=="1"&&t.dataset.loading!=="1"&&(t.dataset.loading="1",t.textContent="載入版本記錄…",Xi().then(s=>{t.dataset.rendered!=="1"&&(t.innerHTML=s?$i(s):"<p>版本記錄暫時無法載入。</p>",t.dataset.rendered="1")})),Oe=document.activeElement,We=J()?S:T,We.inert=!0,e.inert=!1,e.classList.add("open"),e.setAttribute("aria-hidden","false"),document.body.classList.add("no-scroll");const n=document.getElementById("changelog-scroll");n&&(n.scrollTop=0);const a=document.getElementById("changelog-close");a&&a.focus()}function an(){const e=document.getElementById("changelog-view");e&&(e.classList.remove("open"),e.setAttribute("aria-hidden","true"),e.inert=!0,We&&(We.inert=!1),We=null,document.body.classList.remove("no-scroll"),Oe&&Oe.isConnected&&Oe.focus(),Oe=null)}function Qi(){const e=document.getElementById("changelog-view");if(!e||e.dataset.wired)return;e.dataset.wired="1";const t=document.getElementById("changelog-close"),n=document.getElementById("changelog-scroll");t&&t.addEventListener("click",an),e&&e.addEventListener("click",a=>{(a.target===e||a.target===n)&&an()}),document.addEventListener("click",a=>{a.target.closest&&a.target.closest("[data-open-changelog]")&&(a.preventDefault(),Zi())}),document.addEventListener("keydown",a=>{if(!e.classList.contains("open"))return;if(a.key==="Escape"){a.preventDefault(),an();return}if(a.key!=="Tab")return;const s=[...e.querySelectorAll("button, a[href]")].filter(r=>!r.disabled&&r.offsetParent!==null),i=s[0],o=s[s.length-1];!i||!o||(a.shiftKey&&document.activeElement===i?(a.preventDefault(),o.focus()):!a.shiftKey&&document.activeElement===o&&(a.preventDefault(),i.focus()))})}function eo(){const e=document.querySelector(".seat-map"),t=document.getElementById("seat-readout");if(!e||!t)return;const n=[...e.querySelectorAll(".seat-blk")],a=(i,o)=>{n.forEach(c=>c.classList.remove("selected"));const r=i?Jn.find(c=>c.id===i):null;if(!r){t.textContent=Xn,o&&b("horo-seat",""),bt(t);return}const l=n.find(c=>c.dataset.id===i);l&&l.classList.add("selected"),t.innerHTML=Fi(r),o&&b("horo-seat",i),bt(t)};e.addEventListener("click",i=>{const o=i.target.closest&&i.target.closest(".seat-blk");o&&a(o.classList.contains("selected")?null:o.dataset.id,!0)}),e.addEventListener("keydown",i=>{if(i.key!=="Enter"&&i.key!==" ")return;const o=i.target.closest&&i.target.closest(".seat-blk");o&&(i.preventDefault(),a(o.classList.contains("selected")?null:o.dataset.id,!0))}),t.addEventListener("click",i=>{i.target.closest(".seat-clear")&&a(null,!0)});const s=b("horo-seat");s&&Jn.some(i=>i.id===s)?a(s,!1):t.textContent=Xn}function to(){(!ia||!T.querySelector(".hero"))&&(T.innerHTML=ti(jt,Mt("home-theme"))),ia=!1,document.getElementById("guide-btn").addEventListener("click",()=>{location.hash="#/guide"}),document.getElementById("setlist-btn").addEventListener("click",()=>{location.hash="#/setlist"}),ao(),Ji(),eo(),go(),ko()}function no(e){const t=e.closest(".hero-inner");!t||t.style.marginTop||(t.style.marginTop=getComputedStyle(t).marginTop,t.style.marginBottom="0px")}let da=null;window.addEventListener("resize",()=>{if(window.innerWidth===da)return;da=window.innerWidth;const e=document.querySelector(".hero-inner");e&&!e.querySelector(".info-card.open")&&(e.style.marginTop="",e.style.marginBottom="")});function ao(){document.querySelectorAll(".info-card").forEach(e=>so(e))}function so(e){const t=e.querySelector(".info-toggle"),n=e.querySelector(".info-panel");!e||!t||!n||t.addEventListener("click",()=>{if(e.classList.contains("open"))n.inert=!0,n.setAttribute("aria-hidden","true"),n.style.maxHeight=n.scrollHeight+"px",requestAnimationFrame(()=>{e.classList.remove("open"),t.setAttribute("aria-expanded","false"),n.style.maxHeight="0px"});else{no(e);const s=n.querySelector(":scope > .info-panel-template");s&&n.replaceChild(s.content.cloneNode(!0),s),n.inert=!1,n.setAttribute("aria-hidden","false"),e.classList.add("open"),t.setAttribute("aria-expanded","true"),n.querySelectorAll("img[data-src]").forEach(i=>{i.src=i.dataset.src,delete i.dataset.src}),e.id==="notice-card"&&Ki(),e.id==="vaws-card"&&Gi(),e.id==="way-card"&&yo(),n.style.maxHeight=n.scrollHeight+"px",setTimeout(()=>{e.classList.contains("open")&&(n.style.maxHeight=n.scrollHeight+"px")},300)}})}function io(){T.innerHTML=`
    <div class="guide-page">
      <div class="song-topbar">
        <button class="back-btn" id="back-btn" aria-label="返回首頁" title="返回首頁">${Sn}</button>
        ${Mt()}
      </div>

      <section class="songs-section">
        <div class="songs-head">
          <h1>應援指南 無劇透</h1>
          <p>選擇歌曲，搭配影片查看歌詞與大合唱重點</p>
          <div class="song-legend">
            <span class="legend-item"><span class="legend-icon chant">${B.mic}</span>大合唱 <b class="legend-num">12</b> 行</span>
            <span class="legend-item"><span class="legend-icon clap">${B.clap}</span>拍手</span>
            <span class="legend-item"><span class="legend-icon wave">${B.wave}</span>揮手</span>
            <span class="legend-item"><span class="legend-icon jump">${B.jump}</span>跳躍</span>
            <span class="legend-item"><span class="legend-icon spin">${B.spin}</span>轉臂</span>
          </div>
          <p class="song-legend-note">數字代表目前應援版本的大合唱歌詞行數。<br>切換歌曲時會依目前排序移動。<br>拍手・揮手提示會顯示在歌曲頁面。</p>
        </div>
        <details class="chant-source-details" id="guide-chant-source">
          <summary>應援版本說明</summary>
          <div id="guide-chant-source-content"></div>
        </details>
        <div class="song-search-sentinel" id="song-search-sentinel"></div>
        <div class="song-search">
          <label class="search-label" for="song-search-input">搜尋歌曲</label>
          <div class="song-search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>
            <input id="song-search-input" type="search" inputmode="search" autocomplete="off"
                   placeholder="搜尋歌曲名稱・編號">
            <button type="button" class="song-search-clear" id="song-search-clear" aria-label="清除">✕</button>
          </div>
        </div>
        <div class="song-sorts" role="group" aria-label="歌曲清單排序">
          <button class="song-sort" type="button" data-sort="default">預設</button>
          <button class="song-sort" type="button" data-sort="title" id="sort-title">名稱</button>
          <button class="song-sort" type="button" data-sort="chant" id="sort-chant">大合唱</button>
        </div>
        <div class="song-search-meta"><span id="song-count">共 ${A.length} 首</span></div>
        <p class="song-empty" id="song-empty" hidden><b>找不到歌曲</b>請輸入部分歌曲名稱或歌曲編號</p>
        <ul class="song-list" id="song-list"></ul>
      </section>

      ${Ba(jt)}
    </div>
  `,document.getElementById("back-btn").addEventListener("click",()=>{location.hash="#/"});const e=document.getElementById("guide-chant-source"),t=document.getElementById("guide-chant-source-content");e?.addEventListener("toggle",()=>{!e.open||!t||t.dataset.loaded==="1"||(t.innerHTML=`${Ha()}
      <section class="chant-differences" aria-labelledby="chant-differences-title">
        <div class="chant-differences-head">
          <h2 id="chant-differences-title">日本版／韓國版差異</h2>
          <button type="button" class="chant-differences-current chant-version-current" id="guide-chant-version-btn" data-chant-version-toggle aria-pressed="false" aria-label="切換應援版本：目前${gt()}，點擊切換">
            目前 <span data-chant-version-flag aria-hidden="true">${yt()}</span>
          </button>
        </div>
        <ul>${ui.map(n=>`<li>${E(n)}</li>`).join("")}</ul>
        <p class="chant-differences-footnote">未列入日本版歌單的歌曲會暫沿用現有標記，現場仍以 Vaundy 與觀眾的即時引導為準。</p>
      </section>`,t.dataset.loaded="1",Ye())}),Ye(),T.querySelectorAll(".song-sort").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.sort;a==="chant"?N=N==="chant-desc"?"chant-asc":"chant-desc":a==="title"?N=N==="title"?"title-desc":"title":N=a,b("horo-song-sort",N),hn({eager:!0})})}),vo(),hn(),Ua(Vi(),[500],"#/guide")}let Ee="guide";function vt(e){Ee=e==="setlist"?"setlist":"guide"}function oo(){return Ee==="setlist"?"#/setlist":"#/guide"}function kt(e){const t=A.find(n=>n.id===e.id);return t?t.title:e.title||e.id}function ve(e){return E(String(e??"")).replace(/\(([^()]*)\)/g,(t,n)=>`(<span lang="ja">${n}</span>)`)}let Y="random",Ke=null,mn=!1,wt=0;function ro(){mn=!1,wt=0,Y="random"}let Ka=(()=>{const e=parseInt(b("horo-set-pos"),10);return Number.isFinite(e)&&e>=0?e:-1})();function Ln(e){Ka=e,b("horo-set-pos",String(e))}function at(){const e=[];return ie.items.forEach(t=>t.songs.forEach((n,a)=>e.push({key:t.n+":"+a,id:n.id}))),e}function Ga(){const e=at().map(t=>t.key);for(let t=e.length-1;t>0;t--){const n=Math.floor(Math.random()*(t+1)),a=e[t];e[t]=e[n],e[n]=a}Ke=e,b("horo-set-shuffle2",JSON.stringify(e))}function lo(){const e=at();if(Ke&&Ke.length===e.length)return;const t=b("horo-set-shuffle2");if(t)try{const n=JSON.parse(t);if(Array.isArray(n)&&n.length===e.length){Ke=n;return}}catch{}Ga()}function za(){lo();const e=new Map(at().map(t=>[t.key,t]));return Ke.map(t=>e.get(t)).filter(Boolean)}function Ya(){return(Y==="random"?za():at()).filter(t=>A.some(n=>n.id===t.id))}function co(e){if(e.songs.length===1){const t=e.songs[0],n=A.some(a=>a.id===t.id);return`
      <li class="set-item">
        <button class="set-row" data-id="${E(t.id)}" ${n?"":"disabled"}>
          <span class="set-num">${H(e.n)}</span>
          <span class="set-title">${ve(kt(t))}</span>
          <span class="set-go">${n?"›":""}</span>
        </button>
      </li>`}return`
    <li class="set-item">
      <div class="set-split">
        <div class="set-split-head">
          <span class="set-num">${H(e.n)}</span>
          <span class="set-split-note">日期不同的歌曲</span>
        </div>
        ${e.songs.map(t=>{const n=A.some(a=>a.id===t.id);return`
          <button class="set-row sub" data-id="${E(t.id)}" ${n?"":"disabled"}>
            <span class="day-chip ${t.day==="日"?"sun":""}">${t.day}</span>
            <span class="set-title">${ve(kt(t))}</span>
            <span class="set-go">${n?"›":""}</span>
          </button>`}).join("")}
      </div>
    </li>`}function uo(e){const t=A.some(n=>n.id===e.id);return`
    <li class="set-item">
      <button class="set-row" data-id="${E(e.id)}" ${t?"":"disabled"}>
        <span class="set-num rand">♪</span>
        <span class="set-title">${ve(kt(e))}</span>
        <span class="set-go">${t?"›":""}</span>
      </button>
    </li>`}function ot(){const e=document.getElementById("set-list");if(!e)return;const t=Y==="order",n=at().length;e.innerHTML=t?ie.items.map(co).join(""):za().map(uo).join("");const a=document.getElementById("setlist-count");a&&(a.textContent=t?`東京/首爾 ${ie.items.length} 首・共 ${n} 首`:`共 ${n} 首`);const s=document.getElementById("setlist-mode-meta");s&&(s.textContent=t?"劇透":"隨機");const i=document.getElementById("set-shuffle");i&&(i.hidden=t);const o=document.getElementById("setlist-desc");o&&(o.innerHTML=t?`${E(ie.dates)}<br>點選歌曲即可前往應援指南`:`${E(ie.dates)}<br>目前將歌曲<b>打亂顯示，不公開演出順序</b>`);const r=document.getElementById("setlist-note");r&&(r.innerHTML=t?`※ 這是整理自粉絲紀錄的非官方東京/首爾歌單，首爾場順序與東京場相同；台北場實際演出順序仍以官方公告為準。<br>
       ※ 日期不同而有變化的曲目，已分為<b>六</b>・<b>日</b>。`:`※ 這是整理自粉絲紀錄的非官方東京/首爾歌單，首爾場順序與東京場相同；台北場實際演出順序仍以官方公告為準。<br>
       ※ 演出順序與日期差異曲目皆已隱藏。想查看完整內容，請在上方點選<b>演出順序</b>。`),T.querySelectorAll(".set-mode").forEach(c=>{const p=c.dataset.mode===Y;c.classList.toggle("active",p),c.setAttribute("aria-pressed",p?"true":"false")});let l=0;e.querySelectorAll(".set-row").forEach(c=>{if(c.disabled)return;const p=l++;c.addEventListener("click",()=>{const d=A.find(u=>u.id===c.dataset.id);d&&(wt=window.scrollY,vt("setlist"),Ln(p),Pt(d))})}),Ua(ie.items.map(c=>Tn(kt(c))).join(""),[500],"#/setlist")}function po(){T.innerHTML=`
    <div class="setlist-page">
      <div class="song-topbar">
        <button class="back-btn" id="setlist-back-btn" aria-label="返回首頁" title="返回首頁">${Sn}</button>
        <h1>歌單</h1>
        ${Mt()}
      </div>

      <section class="spoiler-hero">
        <div class="spoiler-mark">${Ca}</div>
        <h2 class="spoiler-title">劇透注意</h2>
        <p class="spoiler-desc">
          這個頁面包含<b>${ie.label}的歌曲名稱與順序</b>。<br>
          選擇查看方式前，不會顯示內容。
        </p>
        <button class="spoiler-safe" type="button" id="spoiler-safe">不看劇透，返回首頁</button>

        <div class="spoiler-choice">
          <button class="spoiler-open soft" type="button" data-mode="random">
            <b>只看歌曲名稱<span class="tag">歌曲劇透</span></b>
            <span>打亂顯示演出順序</span>
          </button>
          <button class="spoiler-open" type="button" data-mode="order">
            <b>依演出順序查看<span class="tag">完整劇透</span></b>
            <span>公開歌曲名稱與完整順序</span>
          </button>
        </div>
      </section>

      <section class="setlist-body" id="setlist-body" hidden inert>
        <div class="setlist-head">
          <h2>${E(ie.label)}歌單</h2>
          <p id="setlist-desc"></p>
        </div>

        <div class="set-modes" role="group" aria-label="歌單查看方式">
          <button class="set-mode" type="button" data-mode="order">演出順序<span class="set-mode-badge">劇透</span></button>
          <button class="set-mode" type="button" data-mode="random">隨機順序</button>
        </div>
        <div class="set-order-confirm" id="set-order-confirm" role="group" aria-label="確認公開演出順序" hidden>
          <p>演出順序將完整公開。</p>
          <button type="button" id="set-order-cancel">取消</button>
          <button type="button" id="set-order-reveal">公開順序</button>
        </div>

        <div class="set-shuffle" id="set-shuffle" hidden>
          <span><b>已將順序打亂。</b>先看看有哪些歌曲，把順序留到演出當天揭曉吧。</span>
          <button type="button" id="set-reshuffle">重新打亂</button>
        </div>

        <div class="setlist-meta">
          <span id="setlist-count"></span>
          <span id="setlist-mode-meta">劇透</span>
        </div>

        <ul class="set-list" id="set-list"></ul>

        <p class="setlist-note" id="setlist-note"></p>
      </section>
    </div>
  `,document.getElementById("setlist-back-btn").addEventListener("click",()=>{location.hash="#/"}),document.getElementById("spoiler-safe").addEventListener("click",()=>{location.hash="#/"});const e=document.getElementById("setlist-body"),t=document.getElementById("set-order-confirm"),n=(a,s)=>{Y=a==="order"?"order":"random",mn=!0,ot(),e.hidden=!1,e.inert=!1,s!==!1&&e.scrollIntoView({behavior:"smooth",block:"start"})};if(T.querySelectorAll(".spoiler-choice .spoiler-open").forEach(a=>{a.addEventListener("click",()=>n(a.dataset.mode))}),T.querySelectorAll(".set-mode").forEach(a=>{a.addEventListener("click",()=>{if(a.dataset.mode==="order"&&Y!=="order"){t.hidden=!1,document.getElementById("set-order-cancel").focus();return}t.hidden=!0,Y!==a.dataset.mode&&(Y=a.dataset.mode==="random"?"random":"order",ot())})}),document.getElementById("set-order-cancel").addEventListener("click",()=>{t.hidden=!0,T.querySelector('.set-mode[data-mode="order"]').focus()}),document.getElementById("set-order-reveal").addEventListener("click",()=>{t.hidden=!0,Y="order",ot(),T.querySelector('.set-mode[data-mode="order"]').focus()}),document.getElementById("set-reshuffle").addEventListener("click",()=>{Ga(),ot()}),mn&&(n(Y,!1),wt>0)){const a=wt,s=()=>{const i=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);window.scrollTo(0,Math.min(a,i))};requestAnimationFrame(s),setTimeout(s,80),setTimeout(s,260)}}function sn(e,t,n){const a=document.querySelector(".cd-pill"),s=document.getElementById("cd-dday"),i=document.getElementById("cd-clock");!a||!s||!i||(s.textContent=e,i.textContent=t||"",a.classList.toggle("is-live",n==="live"),a.classList.toggle("is-end",n==="end"))}function fo(e,t){document.querySelectorAll(".show-meta .show-row").forEach((a,s)=>{const i=s===e,o=!i&&(t===-1||s<t);a.classList.toggle("live",i),a.classList.toggle("past",o)})}function Ja(e){return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(e)}function mo(e,t){const n=a=>{const s=Ja(new Date(a));return Date.UTC(+s.slice(0,4),+s.slice(5,7)-1,+s.slice(8,10))};return Math.max(0,Math.round((n(t)-n(e))/864e5))}let on=null;function ho(e){const t=document.getElementById("today-card");if(!t)return;const n=Ja(new Date(e)),a=ni[n];if(!a){t.hidden=!0,on=null;return}t.hidden=!1;const s=a.map(g=>new Date(`${n}T${g.t}:00+09:00`).getTime()),i=s.findIndex(g=>g>e),o=i===-1?a.length-1:i-1;if(on!==n){on=n;const g=new Date(`${n}T12:00:00+09:00`),w=["日","一","二","三","四","五","六"][g.getDay()];document.getElementById("today-title").textContent=`今日演出・${Number(n.slice(5,7))}/${Number(n.slice(8,10))}（${w}）`}document.getElementById("today-list").innerHTML=a.map((g,w)=>`<li class="${w<o?"past":w===o?"now":""}"><span class="t">${g.t}</span><span class="l">${E(g.label)}</span></li>`).join("");const r=document.getElementById("today-now");if(i===-1){r.innerHTML="<b>今天的演出已全部結束。</b>辛苦了！";return}const l=s[i]-e,c=Math.floor(l/36e5),p=Math.floor(l%36e5/6e4),d=Math.floor(l%6e4/1e3),u=c>0?`${c} 小時 ${H(p)} 分 ${H(d)} 秒`:`${p} 分 ${H(d)} 秒`,m=o>=0?`<b>${E(a[o].label)}</b>進行中<br>`:"";r.innerHTML=`${m}距離${E(a[i].label)}還有 <span class="left">${u}</span>`}function go(){const e=document.getElementById("share-btn");e&&e.addEventListener("click",async()=>{const t={title:'VAUNDY "HORO" TAIPEI 應援指南',text:"搭配影片查看各曲歌詞與大合唱、拍手、揮手重點",url:location.href.split("#")[0]};try{if(navigator.share){await navigator.share(t);return}await navigator.clipboard.writeText(t.url),qt("已<b>複製</b>連結，請貼上分享。","確定",Ut)}catch{}})}function yo(){const e=document.getElementById("copy-addr");!e||e.dataset.wired==="1"||(e.dataset.wired="1",e.addEventListener("click",async()=>{const t="105037 臺北市松山區南京東路4段2號 台北小巨蛋 Taipei Arena";try{await navigator.clipboard.writeText(t),e.textContent="已複製 ✓"}catch{e.textContent=t}setTimeout(()=>{e.textContent="複製地址"},1600)}))}const bo=["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];function Xa(e){return[...String(e)].map(t=>{const n=t.charCodeAt(0);return n>=44032&&n<=55203?bo[Math.floor((n-44032)/588)]:t}).join("")}const Ce=e=>String(e).toLowerCase().replace(/\s+/g,"");let rt=0,ye=null,ne=null,q=null;function hn({eager:e=!1}={}){const t=document.getElementById("song-list");if(!t)return;ne&&(window.removeEventListener("scroll",ne),ne=null),q?.remove(),q=null;const n=_n(),a=++rt;ye=null,t.dataset.total=String(n.length),t.innerHTML="",t.dataset.clickBound!=="1"&&(t.dataset.clickBound="1",t.addEventListener("click",c=>{const p=c.target.closest(".song-row");if(!p||!t.contains(p))return;const d=A.find(u=>u.id===p.dataset.id);d&&(vt("guide"),Pt(d))}),t.addEventListener("focusin",()=>ye?.()));let s=0;const i=({filter:c=!0,includeMarks:p=!0}={})=>{if(a!==rt||!t.isConnected)return;const d=Math.min(s+4,n.length),u=n.slice(s,d).map(m=>`
      <li data-no="${ze(m)}">
        <button class="song-row" data-id="${E(m.id)}">
          <span class="song-num">${H(ze(m))}</span>
          <span class="song-title">${ve(m.title)}</span>
          ${p?xa(m):'<span class="song-marks song-marks-placeholder" aria-hidden="true"></span>'}
        </button>
      </li>`).join("");q?.isConnected?q.insertAdjacentHTML("beforebegin",u):t.insertAdjacentHTML("beforeend",u),s=d,c&&pt()},o=()=>{if(a!==rt||!t.isConnected)return;for(ne&&(window.removeEventListener("scroll",ne),ne=null),q?.remove(),q=null;s<n.length;)i({filter:!1,includeMarks:!0});const c=new Map(n.map(p=>[String(ze(p)),p]));t.querySelectorAll(".song-marks-placeholder").forEach(p=>{const d=p.closest("li"),u=d&&c.get(d.dataset.no);p.outerHTML=u?xa(u):""}),ye=null,pt()};if(ye=o,i({includeMarks:!0}),e)o();else if(s<n.length){q=document.createElement("li"),q.className="song-list-sentinel",q.setAttribute("aria-hidden","true"),t.appendChild(q);let c=null;const p=()=>{c=null,!(a!==rt||!t.isConnected||!q?.isConnected)&&(q.getBoundingClientRect().top>window.innerHeight+480||(i({includeMarks:!0}),s<n.length&&i({includeMarks:!0}),s>=n.length&&o()))};ne=()=>{c===null&&(c=window.requestAnimationFrame(p))},window.addEventListener("scroll",ne,{passive:!0})}T.querySelectorAll(".song-sort").forEach(c=>{const p=c.dataset.sort==="chant"||c.dataset.sort==="title"?N.startsWith(c.dataset.sort):c.dataset.sort===N;c.classList.toggle("active",p),c.setAttribute("aria-pressed",p?"true":"false")});const r=document.getElementById("sort-chant");if(r){const c=N==="chant-asc"?"少→多":"多→少";r.innerHTML=N.startsWith("chant")?`大合唱 <span class="dir">${c}</span>`:"大合唱"}const l=document.getElementById("sort-title");if(l){const c=N==="title-desc"?"Z→A":"A→Z";l.innerHTML=N.startsWith("title")?`名稱 <span class="dir">${c}</span>`:"名稱"}pt()}function pt(){const e=document.getElementById("song-search-input"),t=document.getElementById("song-search-clear"),n=document.getElementById("song-count"),a=document.getElementById("song-empty"),s=document.querySelectorAll("#song-list > li[data-no]");if(!e||!s.length)return;const i=Number(document.getElementById("song-list")?.dataset.total)||s.length,o=Ce(e.value).replace(/번$/,""),r=/^\d{1,2}$/.test(o);let l=0;s.forEach(c=>{const p=c.querySelector(".song-title").textContent,d=c.dataset.no,u=!o||(r?d===String(Number(o))||H(Number(d))===o:Ce(p).includes(o)||Ce(Xa(p)).includes(o));c.hidden=!u,u&&l++}),n&&(n.textContent=o?`搜尋結果 ${l} 首`:`共 ${i} 首`),a&&(a.hidden=l!==0),t&&t.classList.toggle("show",!!e.value)}function vo(){const e=document.getElementById("song-search-input"),t=document.getElementById("song-search-clear");if(!e)return;const n=pt,a=document.querySelector(".song-search"),s=document.getElementById("song-search-sentinel");a&&s&&"IntersectionObserver"in window&&new IntersectionObserver(([i])=>{a.classList.toggle("stuck",!i.isIntersecting)},{threshold:0}).observe(s),e.addEventListener("input",()=>{ye?.(),n()}),t.addEventListener("click",()=>{ye?.(),e.value="",n(),e.focus()}),n()}function ko(){const e=ai.map(a=>({start:new Date(a.start).getTime(),end:new Date(a.end).getTime()})),t=e[e.length-1].end;function n(){if(!document.getElementById("countdown")){gn();return}const s=Date.now();ho(s);const i=e.findIndex(u=>s>=u.start&&s<u.end),o=e.findIndex(u=>u.start>s);if(fo(i,o),i!==-1){sn("現在","直播中","live");return}if(o===-1){s>=t&&(sn("結束","","end"),gn());return}const r=e[o].start-s,l=mo(s,e[o].start),c=Math.floor(r/36e5),p=Math.floor(r%36e5/6e4),d=Math.floor(r%6e4/1e3);sn(`D-${H(l)}`,`${H(c)}:${H(p)}:${H(d)}`,"count")}n(),ct=setInterval(n,1e3)}function gn(){ct&&(clearInterval(ct),ct=null)}function Et(){const e=document.getElementById("sheet-search-input"),t=document.getElementById("sheet-search-clear"),n=S.querySelector(".song-sheet-count"),a=document.getElementById("sheet-empty"),s=S.querySelectorAll("#song-sheet-list > li");if(!e||!s.length)return;const i=Ce(e.value).replace(/번$/,""),o=/^\d{1,2}$/.test(i);let r=0;s.forEach(l=>{const c=l.querySelector(".song-sheet-name").textContent,p=l.dataset.no,d=!i||(o?p===String(Number(i))||H(Number(p))===i:Ce(c).includes(i)||Ce(Xa(c)).includes(i));l.hidden=!d,d&&r++}),n&&(n.textContent=i?`${r} 首`:`${s.length} 首`),a&&(a.hidden=r!==0),t&&t.classList.toggle("show",!!e.value)}function wo(){const e=document.getElementById("sheet-search-input");e&&(e.value="",Et())}function Eo(){const e=document.getElementById("song-sheet"),t=document.getElementById("song-picker-btn"),n=document.getElementById("song-sheet-list");if(!e)return;e.inert=!1,e.classList.add("open"),e.setAttribute("aria-hidden","false"),t&&t.setAttribute("aria-expanded","true"),S.querySelectorAll("#song-page > .song-topbar, #song-page > .song-body, #song-page > .player-controls, #song-page > .song-dock").forEach(s=>{s.inert=!0});const a=n&&n.querySelector(".song-sheet-item.current");a&&(n.scrollTop=Math.max(0,a.offsetTop-n.clientHeight/2+a.offsetHeight/2)),e.querySelector(".song-sheet-close").focus()}function Ne(){const e=document.getElementById("song-sheet"),t=document.getElementById("song-picker-btn");if(!e)return;const n=e.classList.contains("open");wo(),S.querySelectorAll("#song-page > .song-topbar, #song-page > .song-body, #song-page > .player-controls, #song-page > .song-dock").forEach(a=>{a.inert=!1}),e.classList.remove("open"),e.setAttribute("aria-hidden","true"),e.inert=!0,t&&t.setAttribute("aria-expanded","false"),n&&t&&t.focus()}let xe=!1;function xo(){if(Ee==="setlist"){const e=Ya();if(e.length){const t=e.map(n=>A.find(a=>a.id===n.id)).filter(Boolean);if(t.length)return t}}return _n()}function xt(e){if(Ee==="setlist"){const a=Ya();if(a.length){let s=Ka;if(s>=0&&s<a.length&&a[s].id===e.id||(s=a.findIndex(i=>i.id===e.id)),s>=0){const i=(s-1+a.length)%a.length,o=(s+1)%a.length,r=l=>A.find(c=>c.id===a[l].id)||e;return{idx:s,prev:r(i),next:r(o),pos:s,prevPos:i,nextPos:o}}}}const t=_n(),n=t.findIndex(a=>a.id===e.id);return n<0?{idx:-1,prev:e,next:e}:{idx:n,prev:t[(n-1+t.length)%t.length],next:t[(n+1)%t.length]}}function St(e){if(!y)return;const t=xt(y),n=e<0?t.prev:t.next,a=e<0?t.prevPos:t.nextPos;a!==void 0&&Ln(a),Pt(n)}function Za(){if(xe)return;xe=!0,ce=b("horo-venue")==="1",S.innerHTML=`
    <div class="song-page" id="song-page">
      <div class="song-topbar">
        <button class="back-btn" id="song-back-btn" aria-label="返回歌曲清單" title="返回歌曲清單">${Sn}</button>
        <h1 class="visually-hidden" id="song-page-heading"></h1>
        <nav class="song-dock" aria-label="切換歌曲">
        <div class="song-nav">
          <button class="song-nav-btn" id="prev-song" aria-label="上一首">${Gs}</button>
          <div class="song-picker-h">
            <button class="song-picker-btn" id="song-picker-btn" aria-expanded="false" aria-haspopup="dialog" title="開啟歌曲清單">
              <span class="song-picker-title" id="song-picker-title"></span>
              <span class="song-picker-caret">${ae}</span>
            </button>
          </div>
          <button class="song-nav-btn" id="next-song" aria-label="下一首">${zs}</button>
        </div>
        </nav>
        ${Mt()}
      </div>

      <div class="song-body">
        <div class="song-fixed-top">
          <div class="video-wrap">
            <div class="video-frame">
              <div id="yt-player"></div>
              <details class="karaoke-source-popover" id="karaoke-source-popover">
                <summary aria-label="查看同步資訊與中譯歌詞作者" title="同步資訊與中譯歌詞作者">${La}</summary>
                <span class="karaoke-source-status" id="karaoke-source-status" role="status" aria-live="polite">
                  <span id="karaoke-source-status-text"></span>
                  <span class="lyrics-credit" id="lyrics-credit" hidden></span>
                  ${Ha()}
                </span>
              </details>
              <div class="video-status" id="video-status" role="status">正在載入影片…</div>
            </div>
          </div>

          <div class="lyrics-note">
            <span class="dot">●</span>
            <span class="lyrics-note-copy">點選歌詞跳至影片位置，歌詞隨影片同步。</span>
            <a class="watch-on-yt" id="watch-on-yt" href="#" target="_blank" rel="noopener">在 YouTube 觀看 ↗</a>
          </div>

          <div class="lyrics-legend">
            <span class="legend-item"><span class="legend-icon chant">${B.mic}</span>大合唱</span>
            <span class="legend-item"><span class="legend-icon clap">${B.clap}</span>拍手</span>
            <span class="legend-item"><span class="legend-icon wave">${B.wave}</span>揮手</span>
            <button type="button" class="chant-notes-toggle" id="chant-notes-toggle" aria-expanded="false" aria-controls="chant-notes" title="查看這首歌的日本版應援提示" hidden>
              <span class="chant-notes-label">應援說明</span><span class="chant-notes-chevron" aria-hidden="true">${ae}</span>
            </button>
          </div>
          <div class="chant-notes-panel" id="chant-notes" hidden>
            <ul class="chant-notes-list" id="chant-notes-list"></ul>
            <a href="${Ma}" target="_blank" rel="noopener">Canva《VAUNDY 應援教學》↗</a>
          </div>
        </div>

        <div class="lyrics-pane">
          <!-- 떼창만 듣기 — 켜져 있을 때만 보이는 띠 -->
          <div class="chant-bar" id="chant-bar" hidden role="status">
            <span class="chant-ico">${Gn}</span>
            <span class="chant-bar-label">只聽大合唱</span>
            <span class="chant-bar-msg" id="chant-msg"></span>
            <span class="chant-bar-count" id="chant-count"></span>
            <button class="chant-step" id="chant-prev" aria-label="上一段大合唱">${Ws}</button>
            <button class="chant-step" id="chant-next" aria-label="下一段大合唱">${Ks}</button>
            <button class="chant-bar-off" id="chant-off" aria-label="關閉只聽大合唱">${dn}</button>
          </div>

          <!-- 짤방(동작 사진) — 지정한 가사에서만 떴다가 사라집니다 -->
          <div class="tip-pic at-below-video" id="tip-pic" aria-live="polite">
            <figure class="tip-pic-card" id="tip-pic-card" title="點選即可放大">
              <video id="tip-pic-video" muted loop playsinline preload="none" aria-hidden="true" hidden></video>
              <img id="tip-pic-img" alt="" decoding="async" hidden>
              <figcaption class="tip-pic-cap" id="tip-pic-cap"></figcaption>
            </figure>
          </div>

          <div class="lyrics-scroll">
            <ul class="lyrics-list" id="lyrics-list"></ul>
          </div>
        </div>
      </div>

      <div class="player-controls">
        <button class="play-toggle" id="play-toggle" aria-label="播放／暫停">${ht}</button>
        <label class="playback-rate-control" for="playback-rate">
          <select class="playback-rate-select" id="playback-rate" aria-label="目前倍速x1">
            ${nt.map(o=>'<option value="'+o+'">'+Ts(o)+"</option>").join("")}
          </select>
        </label>
        <button class="venue-toggle pip-toggle" id="pip-btn" type="button" aria-pressed="false" aria-label="開啟或聚焦同步字幕小窗" title="開啟或聚焦同步字幕小窗"${pe.supported?"":" hidden"}>
          ${Ys}
          <span class="venue-label venue-label-desktop">PiP</span>
          <span class="venue-label venue-label-mobile" aria-hidden="true">PiP</span>
        </button>
        <button class="venue-toggle chant-toggle" id="chant-btn" aria-pressed="false" aria-label="開啟／關閉只聽大合唱">
          <span class="chant-ico">${Gn}</span>
          <span class="venue-label">只聽大合唱</span>
        </button>
        <button class="venue-toggle chant-version-toggle" id="chant-version-btn" data-chant-version-toggle aria-pressed="false" aria-label="切換應援版本">
          <span class="venue-label venue-label-desktop">應援版</span>
          <span class="venue-label venue-label-mobile" aria-hidden="true">應援</span>
          <span class="chant-version-value">${yt()}</span>
        </button>
        <button class="venue-toggle" id="venue-btn" aria-label="開啟／關閉簡潔模式">
          <span class="venue-label">簡潔</span>
          <span class="venue-switch"><span class="venue-knob"></span></span>
        </button>
        <button class="venue-toggle reading-toggle" id="reading-btn" aria-pressed="${j!=="kana"?"true":"false"}" aria-label="切換日文讀音：目前顯示${vn()}">
          <span class="venue-label">讀音</span>
          <span class="reading-value reading-value-desktop" id="reading-value">${vn()}</span>
          <span class="reading-value reading-value-mobile" id="reading-value-mobile" aria-hidden="true">${ds()}</span>
        </button>
        <button class="venue-toggle display-toggle${K?" active":""}" id="japanese-toggle" aria-pressed="${K?"true":"false"}" aria-label="切換日文歌詞：目前${K?"顯示":"隱藏"}">
          <span class="venue-label venue-label-desktop">日文</span>
          <span class="venue-label venue-label-mobile" aria-hidden="true">日</span>
          <span class="venue-switch"><span class="venue-knob"></span></span>
        </button>
        <button class="venue-toggle display-toggle${G?" active":""}" id="chinese-toggle" aria-pressed="${G?"true":"false"}" aria-label="切換繁中翻譯：目前${G?"顯示":"隱藏"}">
          <span class="venue-label venue-label-desktop">中文</span>
          <span class="venue-label venue-label-mobile" aria-hidden="true">中</span>
          <span class="venue-switch"><span class="venue-knob"></span></span>
        </button>
        <button class="venue-toggle display-toggle karaoke-toggle${_?" active":""}" id="karaoke-btn" aria-pressed="${_?"true":"false"}" aria-label="切換逐字卡拉OK高亮：目前${_?"開啟":"關閉"}">
          <span class="venue-label venue-label-desktop">卡拉OK</span>
          <span class="venue-label venue-label-mobile" aria-hidden="true">卡拉</span>
          <span class="venue-switch"><span class="venue-knob"></span></span>
        </button>
        <button class="venue-toggle autoscroll-toggle${Le?" active":""}" id="autoscroll-btn" aria-label="開啟／關閉自動捲動">
          <span class="venue-label venue-label-desktop">自動捲動</span>
          <span class="venue-label venue-label-mobile" aria-hidden="true">同步</span>
          <span class="venue-switch"><span class="venue-knob"></span></span>
        </button>
      </div>

      <div class="song-sheet" id="song-sheet" aria-hidden="true" inert>
        <div class="song-sheet-backdrop" data-close-sheet></div>
        <div class="song-sheet-panel" role="dialog" aria-modal="true" aria-label="選擇歌曲">
          <span class="song-sheet-grip"></span>
          <div class="song-sheet-head">
            <span class="song-sheet-title" id="song-sheet-title">選擇歌曲</span>
            <span class="song-sheet-count">${A.length} 首</span>
            <button class="song-sheet-close" data-close-sheet aria-label="關閉">${dn}</button>
          </div>
          <div class="sheet-search">
            <label class="search-label" for="sheet-search-input">搜尋歌曲</label>
            <div class="song-search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>
              <input id="sheet-search-input" type="search" inputmode="search" autocomplete="off"
                     placeholder="搜尋歌曲名稱・編號">
              <button type="button" class="song-search-clear" id="sheet-search-clear" aria-label="清除">✕</button>
            </div>
          </div>
          <p class="sheet-empty" id="sheet-empty" hidden>找不到歌曲</p>
          <ul class="song-sheet-list" id="song-sheet-list"></ul>
        </div>
      </div>
    </div>
  `;const e=document.getElementById("karaoke-source-popover");let t=null;e&&e.addEventListener("toggle",()=>{t&&clearTimeout(t),e.open&&(t=setTimeout(()=>{e.removeAttribute("open"),t=null},2e3))}),document.getElementById("song-back-btn").addEventListener("click",()=>{location.hash=oo()}),document.getElementById("prev-song").addEventListener("click",()=>{St(-1)}),document.getElementById("next-song").addEventListener("click",()=>{St(1)}),document.getElementById("song-picker-btn").addEventListener("click",()=>{document.getElementById("song-sheet").classList.contains("open")?Ne():Eo()}),document.getElementById("song-sheet").querySelectorAll("[data-close-sheet]").forEach(o=>{o.addEventListener("click",Ne)}),document.getElementById("song-sheet-list").addEventListener("click",o=>{const r=o.target.closest(".song-sheet-item");if(!r)return;const l=A.find(c=>c.id===r.dataset.id);if(Ne(),!(!l||y&&l.id===y.id)){if(Ee==="setlist"){const c=parseInt(r.dataset.pos,10);Number.isFinite(c)&&Ln(c)}Pt(l)}});const n=document.getElementById("sheet-search-input"),a=document.getElementById("sheet-search-clear");n&&(n.addEventListener("input",Et),a.addEventListener("click",()=>{n.value="",Et(),n.focus()}));const s=document.getElementById("tip-pic-card");s&&s.addEventListener("click",()=>{document.getElementById("tip-pic").classList.toggle("big")}),(function(){const r=S.querySelector(".lyrics-pane");if(!r)return;let l=0,c=0,p=!1;r.addEventListener("touchstart",d=>{if(!C||d.touches.length!==1){p=!1;return}const u=d.touches[0];if(u.clientX<24||u.clientX>window.innerWidth-24){p=!1;return}l=u.clientX,c=u.clientY,p=!0},{passive:!0}),r.addEventListener("touchend",d=>{if(!p)return;p=!1;const u=d.changedTouches&&d.changedTouches[0];if(!u)return;const m=u.clientX-l,g=u.clientY-c;Math.abs(m)<70||Math.abs(m)<Math.abs(g)*2||rn(m<0?1:-1)},{passive:!0})})(),document.getElementById("lyrics-list").addEventListener("click",o=>{const r=o.target.closest(".lyric-line");r&&(Sr(Number(r.dataset.time)),C&&(O=!1,es(Number(r.dataset.time))))}),document.getElementById("play-toggle").addEventListener("click",ys);const i=document.getElementById("pip-btn");i&&pe.supported&&(i.addEventListener("click",async()=>{await pe.open(bs())&&wn()}),wn()),document.getElementById("playback-rate").addEventListener("change",o=>{dr(Number(o.currentTarget.value))}),_e(),document.getElementById("chant-btn").addEventListener("click",()=>{pa(!C)}),document.getElementById("chant-off").addEventListener("click",()=>{pa(!1)}),document.getElementById("chant-prev").addEventListener("click",()=>{ua(-1)}),document.getElementById("chant-next").addEventListener("click",()=>{ua(1)}),document.getElementById("venue-btn").addEventListener("click",o=>{ce=!ce,b("horo-venue",ce?"1":""),Ot()}),document.getElementById("reading-btn").addEventListener("click",()=>{const o=dt.indexOf(j);j=dt[(o+1)%dt.length],b("horo-reading",j),ns(),ss()}),document.getElementById("japanese-toggle").addEventListener("click",()=>{K=!K,b("horo-show-japanese",K?"1":"0"),bn()}),document.getElementById("chinese-toggle").addEventListener("click",()=>{G=!G,b("horo-show-chinese",G?"1":"0"),bn()}),document.getElementById("karaoke-btn").addEventListener("click",()=>{_=!_,b("horo-karaoke",_?"1":"0"),as()}),document.getElementById("autoscroll-btn").addEventListener("click",o=>{Le=!Le,o.currentTarget.classList.toggle("active",Le),Le&&X(!0)}),it&&document.removeEventListener("keydown",it),it=o=>{if(!J())return;const r=document.getElementById("song-sheet");if(o.key==="Escape"&&r.classList.contains("open")){o.preventDefault(),Ne();return}if(r.classList.contains("open")){if(o.key==="Tab"){const c=[...r.querySelectorAll("button, input")].filter(u=>!u.disabled&&u.offsetParent!==null),p=c[0],d=c[c.length-1];o.shiftKey&&document.activeElement===p?(o.preventDefault(),d.focus()):!o.shiftKey&&document.activeElement===d&&(o.preventDefault(),p.focus())}return}const l=(o.target&&o.target.tagName||"").toLowerCase();l==="input"||l==="textarea"||(o.key==="ArrowLeft"&&(o.preventDefault(),C?rn(-1):document.getElementById("prev-song").click()),o.key==="ArrowRight"&&(o.preventDefault(),C?rn(1):document.getElementById("next-song").click()))},document.addEventListener("keydown",it)}let C=!1,M=-1,O=!1,je=null,_t=0;function fe(){return ir(y)}function So(e=y){const t=document.getElementById("lyrics-list");!t||!e||!Array.isArray(e.lyrics)||t.querySelectorAll(".lyric-line").forEach(n=>{const a=Number(n.dataset.idx),s=e.lyrics[a];if(!s)return;const i=Ss(s,e);n.classList.toggle("is-chant",i.split(" ").includes("is-chant")),n.classList.toggle("chant-partial",i.split(" ").includes("chant-partial")),n.classList.toggle("has-chant-segment",i.split(" ").includes("has-chant-segment"));const o=n.querySelector(".lyric-icons");o&&(o.innerHTML=ks(s,e))})}function Qa(e){if(e!=="jp"&&e!=="kr"||e===I){Ye();return}I=e,b("horo-chant-version",I),Fe.clear(),mt.clear(),Ge.clear(),M=-1,O=!1,je=null,_t=0,Ye(),y&&(So(y),Oa(y),Fa(y),Rt(),Se(),C&&fe().length?ee(0):J()&&X(!0)),document.getElementById("song-list")&&hn()}function Rt(){const e=document.getElementById("song-page");e&&e.classList.toggle("chant-only",C&&fe().length>0);const t=document.getElementById("chant-btn");t&&(t.classList.toggle("active",C),t.setAttribute("aria-pressed",C?"true":"false"))}function Se(){const e=document.getElementById("chant-bar");if(!e||(e.hidden=!C,!C))return;const t=fe(),n=document.getElementById("chant-msg"),a=document.getElementById("chant-count"),s=document.getElementById("chant-prev"),i=document.getElementById("chant-next");if(!t.length){n&&(n.textContent="這首歌沒有大合唱段落"),a&&(a.textContent=""),s&&(s.disabled=!0),i&&(i.disabled=!0);return}const o=window.matchMedia&&window.matchMedia("(hover: none)").matches;n&&(n.textContent=O?"結束・按播放即可從頭開始":o?"左右滑動切換段落":"用 ← → 切換段落"),a&&(a.textContent=`第 ${Math.max(1,M+1)} / ${t.length} 段`),s&&(s.disabled=M<=0),i&&(i.disabled=M>=t.length-1)}function ee(e){const t=fe();if(t.length&&(M=Math.max(0,Math.min(t.length-1,e)),O=!1,es(t[M].start),Se(),f&&typeof f.seekTo=="function"))try{f.seekTo(t[M].start,!0),f.playVideo()}catch{}}function es(e){je=e,_t=Date.now()+4e3}function ua(e){const t=fe();if(t.length){if(O&&e<0){ee(t.length-1);return}ee(M+e)}}function Io(e){if(!C||e===null||!isFinite(e))return!1;const t=fe();if(!t.length)return!1;const n=e-un;if(je!==null)if(Math.abs(n-je)<1.6||Date.now()>_t)je=null;else return!1;const a=t.findIndex(i=>n>=i.start-.35&&n<=i.end);if(a>=0)return(a!==M||O)&&(M=a,O=!1,Se()),!1;const s=t.findIndex(i=>i.start>n);if(s>=0)return ee(s),!0;if(O=!0,M=t.length-1,Se(),f&&typeof f.pauseVideo=="function")try{f.pauseVideo()}catch{}return!0}function pa(e){C=!!e,O=!1,M=-1,Rt(),Se(),C?fe().length&&ee(0):X(!0)}function rn(e){if(!J())return;const t=fe();if(C&&t.length){const n=M+e;if(e>0&&!O&&n<=t.length-1){ee(n);return}if(e<0&&O){ee(t.length-1);return}if(e<0&&n>=0){ee(n);return}}St(e)}function Pt(e){e&&(Ft(e.youtubeId),location.hash=`#/song/${e.id}`)}function J(){return!S.classList.contains("offstage")}function Ht(e){const t=document.getElementById("song-page");if(!t)return;const n=Number($a[e?.id]);if(!Number.isFinite(n)||n<=0)return;const a=60/n/Math.max(.01,P);t.style.setProperty("--song-bpm",String(n)),t.style.setProperty("--icon-beat-duration",`${a.toFixed(3)}s`),t.dataset.bpm=String(n),Pa=performance.now(),me()}function ts(e){const t=++la;if(Za(),!Array.isArray(e.lyrics)){y=e;const{prev:c,next:p}=xt(e),d=document.getElementById("song-page");document.getElementById("song-page-heading").textContent=e.title,document.getElementById("song-picker-title").innerHTML=ve(e.title),document.getElementById("prev-song").title=`上一首：${c.title}`,document.getElementById("next-song").title=`下一首：${p.title}`,document.getElementById("lyrics-list").innerHTML="",document.getElementById("video-status").textContent="正在載入歌詞…",d?.classList.remove("song-ready"),S.classList.remove("offstage"),S.inert=!1,T.style.display="none",fi().then(u=>{if(t!==la||!location.hash.startsWith("#/song/"))return;const m=u.get(e.id);m&&ts({...e,...m})});return}mi().then(()=>{y===e&&ss()}),y=e,be=-1,z=null,he=null,M=-1,O=!1,je=null,_t=0,kr(),Je(),oe!==null&&(cancelAnimationFrame(oe),oe=null);const{prev:n,next:a}=xt(e),s=document.getElementById("song-page");Ht(e),e.cover?s.style.setProperty("--song-cover",`url('${e.cover}')`):s.style.removeProperty("--song-cover"),document.getElementById("song-picker-title").innerHTML=ve(e.title),document.getElementById("song-page-heading").textContent=e.title;const i=document.getElementById("lyrics-credit");if(i){const c=!!e.translationCredit;if(c){const d=`<a href="${e.translationCreditUrl||Bi}" target="_blank" rel="noopener">${E(e.translationCredit)}</a>`,u=e.translationSourceUrl?` · <a href="${e.translationSourceUrl}" target="_blank" rel="noopener">出處</a>`:"",m=e.translationLicenseUrl?` · <a href="${e.translationLicenseUrl}" target="_blank" rel="noopener">${E(e.translationLicense||"授權")}</a>`:"";i.innerHTML=`中譯歌詞作者：${d}${u}${m}`}else i.innerHTML="";i.hidden=!c}const o=document.getElementById("song-back-btn");if(o){const c=Ee==="setlist"?"返回歌單":"返回歌曲清單";o.title=c,o.setAttribute("aria-label",c)}document.getElementById("prev-song").title=`上一首：${n.title}`,document.getElementById("next-song").title=`下一首：${a.title}`,document.getElementById("watch-on-yt").href=`https://www.youtube.com/watch?v=${encodeURIComponent(e.youtubeId)}`,document.getElementById("lyrics-list").innerHTML=e.lyrics.map((c,p)=>`
    <li>
      <button class="lyric-line ${Ss(c,e)}" data-time="${c.time}" data-idx="${p}">
        <span class="lyric-icons">${ks(c,e)}</span>
        <span class="lyric-body">
          <span class="lyric-jp" lang="ja">${ps(c,e)}</span>
          <span class="lyric-romaji" lang="ja-Latn">${j==="both"?fs(c,e):""}</span>
          <span class="lyric-zh">${jn(c.tr||"")}</span>
        </span>
      </button>
    </li>`).join(""),document.querySelectorAll("#lyrics-list .lyric-line").forEach(c=>{gs(c,e.lyrics[Number(c.dataset.idx)])}),Xo(e),Q("loading","歌詞逐字時間：正在尋找開源時間碼…"),document.getElementById("song-sheet-list").innerHTML=xo().map((c,p)=>`
    <li data-no="${ze(c)}">
      <button class="song-sheet-item${c.id===e.id?" current":""}" data-id="${c.id}" data-pos="${p}"${c.id===e.id?' aria-current="true"':""}>
        <span class="song-sheet-num">${H(ze(c))}</span>
        <span class="song-sheet-name">${ve(c.title)}</span>
        ${c.id===e.id?'<span class="song-sheet-now">目前播放</span>':""}
      </button>
    </li>`).join("");const r=document.getElementById("song-sheet-title");r&&(r.textContent=Ee==="setlist"?"歌單歌曲":"選擇歌曲"),Ne(),Et(),S.classList.remove("offstage"),S.inert=!1,T.style.display="none",Ye(),Oa(e),Fa(e),Rt(),Se(),Ot(),ns(),bn(),as(),Dt(),Ao(),Is();const l=S.querySelector(".lyrics-scroll");l&&(l.scrollTop=0),ur(),Lr(),xn(),gr(e.youtubeId),Go(e),qa(Wi(e),[400,500,700])}let re=null;function Ao(){re&&(re.disconnect(),re=null);const e=S.querySelector(".lyrics-scroll"),t=S.querySelectorAll(".lyric-line");if(!(!e||!t.length)){if(!("IntersectionObserver"in window)){const n=performance.now();t.forEach(a=>{a.classList.add("in-view"),yn(a,n)});return}re=new IntersectionObserver(n=>{const a=performance.now();n.forEach(s=>{s.target.classList.toggle("in-view",s.isIntersecting),s.isIntersecting&&yn(s.target,a)})},{root:e,rootMargin:"120px 0px"}),t.forEach(n=>re.observe(n))}}function yn(e,t){const n=document.getElementById("song-page"),a=Number(n&&n.dataset.bpm);if(!e||!n||!Number.isFinite(a)||a<=0)return;const s=6e4/a,o=-(Math.max(0,(t||performance.now())-Pa)%s/1e3);e.querySelectorAll(".ico-wave svg, .ico-mic svg, .ico-jump svg, .ico-spin .arm, .ico-clap .hand, .ico-clap .spark").forEach(l=>{l.style.animationDelay=`${o.toFixed(3)}s`})}function Ot(){const e=document.getElementById("song-page"),t=document.getElementById("venue-btn");if(e){if(e.classList.toggle("venue",ce),e.classList.toggle("offline",!navigator.onLine),t&&t.classList.toggle("active",ce),ce){const n=document.getElementById("chant-notes-toggle"),a=document.getElementById("chant-notes");n&&(n.classList.remove("active"),n.setAttribute("aria-expanded","false")),a&&(a.hidden=!0)}Cs(),os(),Dt(),X(!0)}}function ns(){const e=document.getElementById("reading-btn"),t=document.getElementById("reading-value"),n=document.getElementById("reading-value-mobile"),a=vn(),s=ds(),i=document.getElementById("song-page");i&&i.classList.toggle("reading-both",j==="both"),t&&(t.textContent=a),n&&(n.textContent=s),e&&(e.classList.toggle("active",j!=="kana"),e.setAttribute("aria-pressed",j!=="kana"?"true":"false"),e.setAttribute("aria-label",`切換日文讀音：目前顯示${a}`)),me()}function bn(){const e=document.getElementById("song-page");if(!e)return;e.classList.toggle("hide-japanese",!K),e.classList.toggle("hide-chinese",!G);const t=document.getElementById("japanese-toggle");t&&(t.classList.toggle("active",K),t.setAttribute("aria-pressed",K?"true":"false"),t.setAttribute("aria-label",`切換日文歌詞：目前${K?"顯示":"隱藏"}`));const n=document.getElementById("chinese-toggle");n&&(n.classList.toggle("active",G),n.setAttribute("aria-pressed",G?"true":"false"),n.setAttribute("aria-label",`切換繁中翻譯：目前${G?"顯示":"隱藏"}`)),Dt(),me()}function as(){const e=document.getElementById("song-page");if(!e)return;e.classList.toggle("karaoke-off",!_);const t=document.getElementById("karaoke-btn");t&&(t.classList.toggle("active",_),t.setAttribute("aria-pressed",_?"true":"false"),t.setAttribute("aria-label",`切換逐字卡拉OK高亮：目前${_?"開啟":"關閉"}`)),_||(En(z),z=null),X(!0)}function ss(){if(!y)return;const e=document.getElementById("lyrics-list");if(!e)return;const t=performance.now();e.querySelectorAll(".lyric-line").forEach(n=>{const a=Number(n.dataset.idx),s=y.lyrics&&y.lyrics[a],i=n.querySelector(".lyric-jp"),o=n.querySelector(".lyric-romaji");!s||!i||(i.innerHTML=ps(s,y),o&&(o.innerHTML=j==="both"?fs(s,y):""),gs(n,s),At(i),o&&At(o),Mn(n,st(y,a)),yn(n,t))}),X(!0)}window.addEventListener("online",()=>{xe&&Ot()});window.addEventListener("offline",()=>{xe&&Ot()});function ln(){if(Lt(),wr(),ue=null,Ne(),Je(),re&&(re.disconnect(),re=null),rr(),pe.close(),f&&typeof f.pauseVideo=="function")try{f.pauseVideo()}catch{}xe&&S.classList.add("offstage"),S.inert=!0,T.style.display=""}let Nn=null;const is=new Set;function To(e){if(!e||typeof e!="string")return null;const t=oi[e],n=t?t.src:/[\/.]/.test(e)?e:null;if(!n||is.has(n))return null;const a=t?.video||(/\.gif$/i.test(n)?n.replace(/\.gif$/i,".webm"):""),s=t?.fallback||(/\.webp$/i.test(n)?n.replace(/\.webp$/i,".gif"):"");return{key:e,src:n,video:a,fallback:s,caption:t&&t.caption||""}}function Je(){const e=document.getElementById("tip-pic");if(!e)return;const t=document.getElementById("tip-pic-video"),n=document.getElementById("tip-pic-img");t&&(t.pause(),t.hidden=!0,t.setAttribute("aria-hidden","true")),n&&(n.hidden=!0),e.classList.remove("show","big"),Nn=null}function os(){const e=document.getElementById("tip-pic");if(!e)return;const t=S.querySelector(".lyrics-pane"),n=S.querySelector(".song-fixed-top");if(!t||!n)return;const a=window.matchMedia("(min-width:900px), (orientation: landscape) and (max-height:600px)").matches,s=ce?"at-lyrics":a?"at-lyrics-right":"at-below-video",i=s==="at-below-video"?n:t;e.classList.contains(s)||(e.classList.remove("at-below-video","at-lyrics","at-lyrics-right","big"),e.classList.add(s)),e.parentElement!==i&&i.appendChild(e)}function Lo(e){const t=document.getElementById("tip-pic"),n=document.getElementById("tip-pic-video"),a=document.getElementById("tip-pic-img"),s=document.getElementById("tip-pic-cap");if(!t||!a)return;const i=()=>{n&&(n.pause(),n.removeAttribute("src"),n.load(),n.hidden=!0,n.setAttribute("aria-hidden","true")),a.hidden=!1,a.alt=e.caption||"應援動作",a.dataset.fallbackTried="0",a.onerror=()=>{if(a.dataset.fallbackTried!=="1"&&e.fallback&&e.fallback!==e.src){a.dataset.fallbackTried="1",a.src=e.fallback;return}is.add(e.src),Je()},a.src=e.src};n&&e.video&&n.canPlayType("video/webm")?(n.onerror=i,n.onloadeddata=()=>{n.hidden=!1,n.setAttribute("aria-hidden","false"),a.hidden=!0,n.play().catch(()=>{})},n.muted=!0,n.hidden=!0,n.setAttribute("aria-hidden","true"),n.src=e.video,n.load()):i(),s&&(s.textContent=e.caption||""),t.classList.remove("big"),t.classList.add("show"),Nn=e.key}function No(e){if(!y)return Je();const t=e>=0?y.lyrics[e]:null,n=t?To(t.pic):null;if(!n)return Je();n.key!==Nn&&Lo(n)}function E(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const fa=/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u,ma=/[A-Za-z0-9]/,rs=/[\p{Script=Latin}\p{N}]/u,Co=/[\p{Script=Latin}\p{N}'’_-]/u,jo=/([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])(?=[A-Za-z0-9])/gu,Bo=/([A-Za-z0-9])(?=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])/gu;function Cn(e){return String(e??"").replace(jo,"$1 ").replace(Bo,"$1 ")}function ha(e,t){const n=Array.from(String(e||""));for(;n.length&&/\s/u.test(t?n.at(-1):n[0]);)t?n.pop():n.shift();return t?n.at(-1)||"":n[0]||""}function $o(e){const t=String(e||"").split(/(<[^>]*>)/g),n=[];t.forEach((a,s)=>{/^<[^>]*>$/.test(a)||(t[s]=Cn(a),n.push(s))});for(let a=1;a<n.length;a++){const s=n[a-1],i=n[a],o=t[s],r=t[i],l=ha(o,!0),c=ha(r,!1),p=/\s$/u.test(o),d=/^\s/u.test(r);!p&&!d&&fa.test(l)&&ma.test(c)?t[i]=" "+r:!p&&!d&&ma.test(l)&&fa.test(c)&&(t[s]=o+" ")}return t.join("")}const Ie=/[\[(](wave|clap|mic|chant|jump|spin|turn)[\])]/gi;function jn(e){return e==null?"":E(Cn(e)).replace(Ie,(t,n)=>B[n.toLowerCase()]||t)}function ls(e){const t=String(e??""),n=window.JP_FURIGANA&&window.JP_FURIGANA[t];return n?$o(n).replace(Ie,(a,s)=>B[s.toLowerCase()]||a):jn(t)}function cs(e,t=!0){const n=String(e??""),a=window.JP_ROMAJI&&window.JP_ROMAJI[n],s=typeof a=="string"?a:n;return t?jn(s):E(Cn(s)).replace(Ie,"")}function vn(e=j){return e==="romaji"?"羅馬字":e==="both"?"假名+羅馬字":"假名"}function ds(e=j){return e==="romaji"?"羅":e==="both"?"假+羅":"假"}function Mo(e){return j==="romaji"?cs(e):ls(e)}function us(e,t=y){if(I!=="jp"||!e||!t)return[];const n=tt[t.id];if(!n||!Array.isArray(n.chantSegments))return[];const a=Number(e.time);return Number.isFinite(a)?n.chantSegments.filter(s=>s&&Math.abs(Number(s.time)-a)<.01&&s.text):[]}function _o(e,t="jp"){return e?String(t==="romaji"?e.romaji||e.text:e.text||""):""}function Ro(e,t,n={}){const a=String(e||""),s=String(t||"");if(!s||!a||typeof document>"u")return a;const i=document.createElement("template");i.innerHTML=a;const o=[],r=(u,m=!1)=>{if(u.nodeType===Node.TEXT_NODE){m||Array.from(u.nodeValue||"").forEach(($,F)=>{o.push({node:u,char:$,offset:F})});return}if(u.nodeType!==Node.ELEMENT_NODE&&u.nodeType!==Node.DOCUMENT_FRAGMENT_NODE)return;const g=u.nodeType===Node.ELEMENT_NODE?u:null,w=m||!!(g&&(g.tagName==="RT"||g.tagName==="RP"||g.classList.contains("ico")||g.classList.contains("chant-segment")));[...u.childNodes].forEach($=>r($,w))};r(i.content);const c=o.map(u=>u.char).join("").indexOf(s);if(c<0)return a;const p=o.slice(c,c+Array.from(s).length);if(p.length!==Array.from(s).length)return a;const d=new Map;return p.forEach(u=>{d.has(u.node)||d.set(u.node,[]),d.get(u.node).push(u.offset)}),[...d.entries()].reverse().forEach(([u,m])=>{if(!u.parentNode)return;const g=Math.min(...m),w=Math.max(...m)+1,$=u.parentNode,F=$.nodeType===Node.ELEMENT_NODE&&$.tagName==="RUBY"&&g===0&&w===(u.nodeValue||"").length?$:null,V=document.createElement("span");if(V.className=`chant-segment${n.breakBefore?" break-before":""}`,F){F.parentNode.insertBefore(V,F),V.appendChild(F);return}let h=u;g>0&&(h=u.splitText(g)),w-g<(h.nodeValue||"").length&&h.splitText(w-g),h.parentNode.insertBefore(V,h),V.appendChild(h)}),i.innerHTML}function Bn(e,t,n,a,s){let i=a(e);return us(t,n).forEach(o=>{i=Ro(i,_o(o,s),o)}),i}function ps(e,t=y){const n=e&&e.jp||"";return Bn(n,e,t,s=>Mo(s),j==="romaji"?"romaji":"jp")}function fs(e,t=y){const n=e&&e.jp||"";return Bn(n,e,t,a=>cs(a,!1),"romaji")}const $e=e=>/\s/u.test(e);function It(e){return Array.isArray(e)&&e.some(t=>t&&t.tag==="chant")}function ms(e){return!!e&&(It(e.jpSegments)||It(e.trSegments))}function ga(e){return I==="jp"&&ms(e)}function ya(e){const t=[];return e.forEach(n=>{const a=String(n&&n.text||"").replace(Ie,"");Array.from(a).forEach(s=>{$e(s)||t.push(n.tag==="chant")})}),t}function Po(e,t){const n=Array.from(e).map(()=>!1);let a=0;return t.forEach(s=>{if(!s||s.tag!=="chant")return;const i=Array.from(String(s.text||"").replace(Ie,"")).filter(l=>!$e(l)).join("");if(!i||!/^[\x21-\x7e]+$/.test(i))return;const o=e.indexOf(i,a);if(o<0)return;const r=Array.from(e.slice(0,o)).length;Array.from(i).forEach((l,c)=>{n[r+c]=!0}),a=o+i.length}),n}function hs(e){const t=[],n=a=>{[...a.childNodes].forEach(s=>{if(s.nodeType===Node.TEXT_NODE){t.push({node:s,text:s.nodeValue||""});return}if(s.nodeType===Node.ELEMENT_NODE&&!(s.classList.contains("ico")||s.tagName==="RT"||s.tagName==="RP")){if(s.tagName==="RUBY"){const i=[...s.childNodes].filter(o=>o.nodeType===Node.TEXT_NODE).map(o=>o.nodeValue||"").join("");t.push({node:s,text:i,atomic:!0});return}n(s)}})};return n(e),t}function Ho(e){const t=document.createElement("span");t.className="seg-chant",e.replaceWith(t),t.appendChild(e)}function Oo(e,t,n){const a=document.createDocumentFragment();let s="",i=!1;const o=()=>{if(!s)return;const r=document.createTextNode(s);if(i){const l=document.createElement("span");l.className="seg-chant",l.appendChild(r),a.appendChild(l)}else a.appendChild(r);s=""};return Array.from(e.nodeValue||"").forEach(r=>{if(!$e(r)){const l=t[n++];l!==i&&(o(),i=l)}s+=r}),o(),e.replaceWith(a),n}function kn(e,t){if(e.querySelector(".seg-chant"))return;const n=hs(e);if(n.reduce((i,o)=>i+Array.from(o.text).filter(r=>!$e(r)).length,0)!==t.length||!t.includes(!0))return;let s=0;n.forEach(i=>{if(i.atomic){const o=Array.from(i.text).filter(r=>!$e(r)).length;t.slice(s,s+o).some(Boolean)&&Ho(i.node),s+=o;return}s=Oo(i.node,t,s)})}function ba(e,t){const n=hs(e).map(a=>Array.from(a.text).filter(s=>!$e(s)).join("")).join("");kn(e,Po(n,t))}function gs(e,t){if(!e||!ms(t))return;const n=t.jpSegments;if(It(n)){const s=e.querySelector(".lyric-jp");s&&(j==="romaji"?ba(s,n):kn(s,ya(n)));const i=e.querySelector(".lyric-romaji");i&&ba(i,n)}const a=e.querySelector(".lyric-zh");a&&It(t.trSegments)&&kn(a,ya(t.trSegments))}function Fo(){try{if(f&&typeof f.getCurrentTime=="function"){const e=Number(f.getCurrentTime());return Number.isFinite(e)?e:null}}catch{}return null}function Do(){try{if(f&&typeof f.getDuration=="function"){const e=Number(f.getDuration());return Number.isFinite(e)&&e>0?e:null}}catch{}return null}function qo(){try{const e=f&&typeof f.getPlayerState=="function"?f.getPlayerState():-1;return e===1||e===3}catch{return!1}}function wn(){const e=document.getElementById("pip-btn");if(!e||!pe.supported)return;const t=pe.isOpen();e.classList.toggle("active",t),e.setAttribute("aria-pressed",t?"true":"false"),e.setAttribute("aria-label",t?"聚焦同步字幕小窗":"開啟或聚焦同步字幕小窗"),e.setAttribute("title",t?"聚焦同步字幕小窗":"開啟或聚焦同步字幕小窗")}function ys(){if(!f||!U)return;if(C&&O){ee(0);return}const e=(()=>{try{return f.getPlayerState()}catch{return-1}})();try{e===YT.PlayerState.PLAYING||e===YT.PlayerState.BUFFERING?f.pauseVideo():f.playVideo()}catch{}me()}function va(e,t){if(!e)return"";const n=e.cloneNode(!0);n.classList.toggle("active",!!t),n.classList.add("in-view");const a=document.createElement("div");return a.className=n.className,a.innerHTML=n.innerHTML,a.outerHTML}function Uo(e,t){const n=e&&Array.isArray(e.lyrics)?e.lyrics:[],a=Number.isInteger(t)?t+1:0;for(let s=a;s<n.length;s++)if($n(n[s]))return s;return-1}function bs(e=be){const t=document.getElementById("song-page"),n=document.getElementById("lyrics-list"),a=n?[...n.querySelectorAll(".lyric-line")]:[],s=Number.isInteger(e)?e:-1,i=s>=0?a[s]:null,o=Uo(y,s),r=o>=0?a[o]:null,l=t?getComputedStyle(t).getPropertyValue("--icon-beat-duration").trim():"";return{title:y?y.title:"同步字幕",currentMarkup:va(i,!0),nextMarkup:va(r,!1),isPlaying:qo(),canPlayPause:!!(f&&U&&typeof f.playVideo=="function"&&typeof f.pauseVideo=="function"),theme:$t,showJapanese:K,showChinese:G,readingMode:j,karaokeEnabled:_,iconBeatDuration:l,status:U?"":"正在等待影片播放器…"}}function me(e=be){pe.isOpen()&&pe.update(bs(e))}function Q(e,t){const n=document.getElementById("karaoke-source-status"),a=document.getElementById("karaoke-source-status-text");if(!n||!a)return;n.dataset.state=e||"";const s=n.closest(".karaoke-source-popover");s&&(s.dataset.state=e||""),a.textContent=t||""}function st(e,t){return!e||!he||he.songId!==e.id?null:he.lines&&he.lines[t]||null}function ft(e,t){const n=st(e,t),a=e&&e.lyrics&&e.lyrics[t];return n&&Number.isFinite(Number(n.start))?Number(n.start):Number(a&&a.time)||0}function Vo(e){const t=document.getElementById("lyrics-list");!t||!e||!Array.isArray(e.lyrics)||(t.querySelectorAll(".lyric-line").forEach(n=>{const a=Number(n.dataset.idx),s=st(e,a),i=vs(e,a);n.dataset.time=String(ft(e,a)),i&&(n.dataset.karaokeStart=String(i.start),n.dataset.karaokeEnd=String(i.end)),Mn(n,s)}),Ge.clear(),Rt(),Se())}function Wo(e){return typeof e=="string"?e:Array.isArray(e)?e.map(t=>typeof t=="string"?t:t&&t.text||"").join(""):""}function $n(e){return e?[e.jp,e.tr].some(t=>Wo(t).replace(Ie,"").replace(/\s/gu,"").length>0):!1}function Ko(e,t){const n=e&&Array.isArray(e.lyrics)?e.lyrics:[],a=Number(n[t]&&n[t].time);for(let s=t+1;s<n.length;s++){if(!$n(n[s]))continue;const i=Number(n[s]&&n[s].time);if(Number.isFinite(i)&&(!Number.isFinite(a)||i>a))return i}return null}async function Go(e){const t=++en;he=null,Q("loading","歌詞逐字時間：正在尋找開源時間碼…");const n=await hi();if(!n||typeof n.load!="function"||typeof n.alignToLocalLyrics!="function"){Q("miss","歌詞逐字時間：目前使用本地估算同步");return}let a=Do(),s=null;try{s=await n.load(e,{duration:a,onStatus:l=>{t!==en||!l||(l.state==="cache"?Q("loading","歌詞逐字時間：已讀取本機快取，正在校正影片偏移…"):l.state==="fallback"?Q("fallback",`歌詞逐字時間：前順位來源沒有結果，改查${l.source||"下一順位來源"}…`):l.state==="offline"&&Q("miss","歌詞逐字時間：離線且沒有快取，使用本地估算同步"))}})}catch{s=null}if(t!==en||!e||y!==e)return;if(!s){Q("miss","歌詞逐字時間：找不到可用來源，使用本地估算同步");return}const i=n.alignToLocalLyrics(s,e.lyrics);if(!i){Q("miss","歌詞逐字時間：來源歌詞與本頁不相符，使用本地估算同步");return}i.songId=e.id,he=i,Vo(e);const o=s.source&&s.source.indexOf("開源多來源")>=0?"開源多來源":s.source||"開源來源",r=s.granularity==="line"?"歌詞逐行時間":"歌詞逐字時間";Q("ready",`${r}：${o}（已對齊 ${i.matchedLines}/${i.totalLines}行，偏移${i.offset.toFixed(2)}秒）`),X(!0)}function vs(e,t){const a=(e&&Array.isArray(e.lyrics)?e.lyrics:[])[t],s=Number(a&&a.time);if(!Number.isFinite(s))return null;const i=st(e,t);if(i)return{start:Number(i.start),end:Math.max(Number(i.start)+.04,Number(i.end))};const o=String(a.jp||"").replace(Ie,""),r=Xe(o)||1,l=Number($a[e.id])||120,c=Math.max(.8,Math.min(12,r*(60/l)*Hi)),p=Ko(e,t),d=p===null?s+c:Math.min(s+c,Math.max(s+.25,p-Pi));return{start:s,end:d}}function Xe(e){const t=String(e||""),n=Array.from(t).filter(a=>!/\s/u.test(a));return n.length?n.every(a=>rs.test(a))?Math.max(1,n.length*.75):n.every(a=>/[、。！？!?.,，。]/u.test(a))?.45:Math.max(1,n.length):0}function ka(e,t,n,a){const s=document.createElement("span");s.className="karaoke-unit",s.textContent=n,s.dataset.karaokeText=n,s.dataset.karaokeWeight=String(a),e.appendChild(s),t.push({el:s,weight:a})}function zo(e,t){const n=e.nodeValue||"";if(!n.trim())return;const a=document.createDocumentFragment(),s=Array.from(n);for(let i=0;i<s.length;){const o=s[i];if(/\s/u.test(o)){a.appendChild(document.createTextNode(o)),i++;continue}if(rs.test(o)){let r=i+1;for(;r<s.length&&Co.test(s[r]);)r++;const l=s.slice(i,r).join("");ka(a,t,l,Xe(l)),i=r;continue}ka(a,t,o,Xe(o)),i++}a.childNodes.length&&e.replaceWith(a)}function At(e){if(!e)return;const t=[],n=a=>{[...a.childNodes].forEach(s=>{if(s.nodeType===Node.TEXT_NODE){zo(s,t);return}if(s.nodeType===Node.ELEMENT_NODE&&!s.classList.contains("ico")){if(s.tagName==="RUBY"){const i=[...s.childNodes].filter(r=>r.nodeType===Node.TEXT_NODE).map(r=>r.nodeValue||"").join(""),o=document.createElement("span");o.className="karaoke-unit",o.dataset.karaokeText=i,o.dataset.karaokeWeight=String(Xe(i)),s.parentNode.insertBefore(o,s),o.appendChild(s),t.push({el:o,weight:Xe(i)});return}s.tagName==="RT"||s.tagName==="RP"||n(s)}})};n(e),e._karaokeUnits=t}function wa(e){return e&&e.el&&(e.el.dataset.karaokeText||e.el.textContent)||""}function Yo(e){if(!e||!e.el)return"";const t=e.el.querySelector("ruby");if(t){const n=t.querySelector("rt");return n?n.textContent||"":t.textContent||""}return e.el.textContent||""}function Jo(e){if(!e)return null;if(j!=="romaji")return e.querySelector(".lyric-jp");const t=Number(e.dataset.idx),n=y&&y.lyrics&&y.lyrics[t];if(!n)return null;const a=document.createElement("span");return a.className="lyric-jp karaoke-reference",a.lang="ja",a.innerHTML=Bn(n.jp||"",n,y,s=>ls(s),"jp"),At(a),a}function Mn(e,t){if(!e)return;const n=[...e.querySelectorAll(".lyric-jp, .lyric-romaji")].filter(h=>(h.textContent||"").trim()),a=Jo(e),s=[...new Set([a,...n].filter(Boolean))],i=a&&a._karaokeUnits?a._karaokeUnits:[],o=i.map(wa),r=i.map(Yo),l=window.KARAOKE_SOURCES||{},c=t?Number(t.start):NaN,p=t?Number(t.end):NaN,d=Number.isFinite(c)?c:Number(e.dataset.karaokeStart),u=Number.isFinite(p)?p:Number(e.dataset.karaokeEnd),m=Number.isFinite(d)?d:0,g=Number.isFinite(u)&&u>m?u:m+.04,w=typeof l.allocateUnitTimings=="function"?l.allocateUnitTimings(o,m,g):[];let $=w,F=!1;if(t&&t.granularity!=="line"&&Array.isArray(t.words)&&t.words.length&&typeof l.mapUnitsToWords=="function"){const h=l.mapUnitsToWords(o,t.words);h.total>0&&h.matched/h.total>=.6&&($=h.timings.map((k,L)=>k||w[L]||null),F=!0)}let V=F?"word":"line-proportional";s.forEach(h=>{const v=h._karaokeUnits||[];v.forEach(x=>{x.start=null,x.end=null,delete x.el.dataset.karaokeStart,delete x.el.dataset.karaokeEnd});const k=h===a,L=v.map(wa);let D=k?$:[];if(!k&&typeof l.mapUnitsToReferenceTimings=="function"){const x=l.mapUnitsToReferenceTimings(L,r,$);D=x.timings,!x.complete&&F&&(V="word-reference-fallback")}else!k&&typeof l.allocateUnitTimings=="function"&&(D=l.allocateUnitTimings(L,m,g));v.forEach((x,Ae)=>{const te=D[Ae];!te||!Number.isFinite(Number(te.start))||!Number.isFinite(Number(te.end))||(x.start=Number(te.start),x.end=Math.max(x.start+.02,Number(te.end)),x.el.dataset.karaokeStart=String(x.start),x.el.dataset.karaokeEnd=String(x.end))})}),e.dataset.karaokeSource=V}function Xo(e){z=null;const t=document.getElementById("lyrics-list");!t||!e||t.querySelectorAll(".lyric-line").forEach(n=>{const a=Number(n.dataset.idx),s=vs(e,a);s&&(n.dataset.karaokeStart=String(s.start),n.dataset.karaokeEnd=String(s.end)),n.querySelectorAll(".lyric-jp, .lyric-romaji").forEach(At),Mn(n,st(e,a))})}function En(e){e&&e.querySelectorAll(".lyric-jp, .lyric-romaji").forEach(t=>{const n=t._karaokeUnits||[];n.forEach(a=>a.el.classList.remove("karaoke-lit","karaoke-current")),n.forEach(a=>a.el.style.removeProperty("--karaoke-word-progress"))})}function Zo(e,t){if(!_){En(z),z=null;return}if(z&&z!==e&&En(z),z=e||null,!e||!Number.isFinite(t))return;const n=Number(e.dataset.karaokeStart),a=Number(e.dataset.karaokeEnd);!Number.isFinite(n)||!Number.isFinite(a)||e.querySelectorAll(".lyric-jp, .lyric-romaji").forEach(s=>{const i=s._karaokeUnits||[];if(!i.length)return;if(i.some(d=>Number.isFinite(d.start)&&Number.isFinite(d.end)||Number.isFinite(Number(d.el.dataset.karaokeStart))&&Number.isFinite(Number(d.el.dataset.karaokeEnd)))){i.forEach(d=>{const u=Number.isFinite(d.start)?Number(d.start):Number(d.el.dataset.karaokeStart),m=Number.isFinite(d.end)?Number(d.end):Number(d.el.dataset.karaokeEnd);if(!Number.isFinite(u)||!Number.isFinite(m)){d.el.classList.remove("karaoke-lit","karaoke-current"),d.el.style.removeProperty("--karaoke-word-progress");return}const g=Math.max(0,Math.min(1,(t-u)/Math.max(.02,m-u)));d.el.classList.toggle("karaoke-lit",g>=1),d.el.classList.toggle("karaoke-current",g>0&&g<1),d.el.style.setProperty("--karaoke-word-progress",g.toFixed(3))});return}const r=Math.max(0,Math.min(1,(t-n)/Math.max(.01,a-n))),l=i.reduce((d,u)=>d+u.weight,0)||i.length,c=r*l;let p=0;i.forEach(d=>{const u=p;p+=d.weight;const m=c>=p,g=!m&&c>u;d.el.classList.toggle("karaoke-lit",m),d.el.classList.toggle("karaoke-current",g)})})}const Qo={wave:/[\[(]wave[\])]/i,clap:/[\[(]clap[\])]/i,jump:/[\[(]jump[\])]/i,spin:/[\[(]spin[\])]/i,turn:/[\[(]turn[\])]/i,mic:/[\[(]mic[\])]/i,chant:/[\[(]chant[\])]/i};function R(e,t){return typeof e!="string"?!1:Qo[t]?.test(e)||!1}function ks(e,t=y){const n=Ze(e,t),a=i=>{if(typeof i=="string"){R(i,"wave"),R(i,"clap");return}Array.isArray(i)&&i.forEach(o=>{o.tag,R(o.text,"wave"),R(o.text,"clap")})};a(e.jpSegments||e.jp),a(e.trSegments||e.tr);let s="";return n&&(s+=`<span class="lyric-type-icon chant" title="大合唱">${B.mic}</span>`),s}function ws(e){if(!e)return!1;const t=n=>typeof n=="string"?R(n,"mic")||R(n,"chant"):Array.isArray(n)?n.some(a=>a&&(a.tag==="chant"||R(a.text,"mic")||R(a.text,"chant"))):!1;return t(e.jpSegments||e.jp)||t(e.trSegments||e.tr)}function er(e,t){if(!e||!t)return!1;if(!tt[t.id])return ws(e);const a=Number(e.time);if(!Number.isFinite(a))return!1;const s=Es(t);return xs(s.any,a)}function tr(e,t){const n=t&&tt[t.id],a=Number(e&&e.time);return!!(n&&Number.isFinite(a)&&xs(Es(t).full,a))}const mt=new Map;function Es(e){const t=`${I}:${e.id}`;if(mt.has(t))return mt.get(t);const n=tt[e.id]||{},s=(r=>new Set((r||[]).map(l=>Number(l)).filter(Number.isFinite).map(l=>Math.round(l*100))))(n.chantTimes),i=new Set(s);(n.chantSegments||[]).forEach(r=>{const l=Number(r&&r.time);Number.isFinite(l)&&i.add(Math.round(l*100))});const o={full:s,any:i};return mt.set(t,o),o}function xs(e,t){const n=Math.round(Number(t)*100);return e.has(n-1)||e.has(n)||e.has(n+1)}function Ss(e,t=y){return Ze(e,t)?typeof ga=="function"&&ga(e)?"is-chant chant-partial":I==="jp"&&us(e,t).length>0&&!tr(e,t)?"has-chant-segment":"is-chant":""}function Ze(e,t=y){return I==="jp"?er(e,t):ws(e)}const nr=1.2,ar=.6,sr=2.5,Ge=new Map;function ir(e){if(!e)return[];const t=`${I}:${e.id}`;if(Ge.has(t))return Ge.get(t);const n=e.lyrics||[],a=o=>n[o+1]?ft(e,o+1):ft(e,o)+8,s=[];for(let o=0;o<n.length;o++){if(!Ze(n[o],e))continue;let r=o;for(;r+1<n.length&&Ze(n[r+1],e);)r++;s.push({from:o,to:r,start:Math.max(0,ft(e,o)-nr),end:a(r)+ar}),o=r}const i=[];return s.forEach(o=>{const r=i[i.length-1];r&&o.start-r.end<sr?(r.end=o.end,r.to=o.to):i.push({from:o.from,to:o.to,start:o.start,end:o.end})}),Ge.set(t,i),i}const Fe=new Map;function De(e){const t=`${I}:${e.id}`;if(Fe.has(t))return Fe.get(t);const n=pi[e.id];if(!e.lyrics&&n){const s={chant:n.chant?.[I]||0,clap:!!n.clap,wave:!!n.wave,jump:!!n.jump,spin:!!n.spin};return Fe.set(t,s),s}const a={chant:0,clap:!1,wave:!1,jump:!1,spin:!1};return(e.lyrics||[]).forEach(s=>{const i=r=>{typeof r=="string"&&(R(r,"wave")&&(a.wave=!0),R(r,"clap")&&(a.clap=!0),R(r,"jump")&&(a.jump=!0),(R(r,"spin")||R(r,"turn"))&&(a.spin=!0))},o=r=>{if(typeof r=="string"){i(r);return}Array.isArray(r)&&r.forEach(l=>{l.tag==="clap"&&(a.clap=!0),i(l.text)})};o(s.jpSegments||s.jp),o(s.trSegments||s.tr),Ze(s,e)&&a.chant++}),Fe.set(t,a),a}let N=(()=>{const e=b("horo-song-sort");return["default","title","title-desc","chant-desc","chant-asc"].includes(e)?e:"default"})();const or=new Map(A.map((e,t)=>[e.id,t+1]));function ze(e){return or.get(e.id)||0}const Ea=e=>/^[\u3131-\u318E\uAC00-\uD7A3]/.test(String(e).trim());function lt(e,t){const n=Ea(e.title)?0:1,a=Ea(t.title)?0:1;return n!==a?n-a:String(e.title).localeCompare(String(t.title),"ko")}function _n(){const e=A.slice();return N==="title"?e.sort(lt):N==="title-desc"?e.sort((t,n)=>lt(n,t)):N==="chant-desc"?e.sort((t,n)=>De(n).chant-De(t).chant||lt(t,n)):N==="chant-asc"?e.sort((t,n)=>De(t).chant-De(n).chant||lt(t,n)):e}function xa(e){const t=De(e);let n="";return t.chant&&(n+=`<span class="song-mark chant" title="${gt()}大合唱 ${t.chant} 行" aria-label="${gt()}大合唱 ${t.chant} 行">${W("i-mic")}<b>${t.chant}</b><span class="song-mark-unit">行</span></span>`),t.clap&&(n+=`<span class="song-mark dot clap common" title="拍手" aria-label="拍手">${W("i-hand")}</span>`),t.wave&&(n+=`<span class="song-mark dot wave common" title="揮手" aria-label="揮手">${W("i-wave")}</span>`),t.jump&&(n+=`<span class="song-mark dot jump" title="跳躍" aria-label="跳躍">${W("i-jump")}</span>`),t.spin&&(n+=`<span class="song-mark dot spin" title="轉臂" aria-label="轉臂">${W("i-cheer")}</span>`),n?`<span class="song-marks">${n}</span>`:""}let le=null;async function Is(){if(!(!("wakeLock"in navigator)||le))try{le=await navigator.wakeLock.request("screen"),le.addEventListener("release",()=>{le=null})}catch{le=null}}function rr(){if(le){try{le.release()}catch{}le=null}}document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&xe&&J()&&Is()});let U=!1,Tt=null,Qe=null,ue=null,Rn=100,As=!1,Sa=null,Pn=!1;function Ts(e){const t=Number(e);return"x"+(Number.isInteger(t)?t:String(t))}function Me(e,t){return Math.abs(Number(e)-Number(t))<.001}function lr(){if(!f||typeof f.getAvailablePlaybackRates!="function")return[];try{const e=f.getAvailablePlaybackRates();return Array.isArray(e)?e.map(Number).filter(t=>Number.isFinite(t)&&t>0).sort((t,n)=>t-n):[]}catch{return[]}}function Ls(e){if(!de.length)return e;const t=de.find(a=>Me(a,e));if(t!==void 0)return t;const n=de.filter(a=>a<=e);return n.length?n.at(-1):de[0]}function _e(){const e=document.getElementById("playback-rate");if(!e)return;const t=nt.find(n=>Me(n,P));t!==void 0&&(e.value=String(t)),e.setAttribute("aria-label","目前倍速"+Ts(P)),[...e.options].forEach(n=>{n.disabled=de.length>0&&!de.some(a=>Me(a,n.value))})}function cr(){de=lr(),_e()}function Ns(){if(!(!f||!U)){cr(),P=Ls(P),b(Bt,String(P)),_e(),Ht(y),Pn=!1;try{f.setPlaybackRate(P)}catch{}}}function dr(e){const t=nt.find(n=>Me(n,e));if(t!==void 0&&(P=Ls(t),b(Bt,String(P)),_e(),Ht(y),f&&U))try{f.setPlaybackRate(P)}catch{}}function ur(){const e=document.getElementById("video-status");e&&(clearTimeout(Tt),e.hidden=U,!U&&(e.textContent="正在載入影片…",Tt=setTimeout(()=>{!U&&e.isConnected&&(e.textContent="影片連線延遲，請在下方開啟 YouTube。")},8e3)))}function xn(){f||!window.YT||!window.YT.Player||(Za(),document.getElementById("yt-player")&&(Qe=(y||A[0]).youtubeId,f=new YT.Player("yt-player",{videoId:Qe,playerVars:{rel:0,playsinline:1,modestbranding:1,autoplay:0},events:{onReady:pr,onStateChange:yr,onPlaybackRateChange:mr,onError:fr}})))}function pr(){U=!0,clearTimeout(Tt);const e=document.getElementById("video-status");e&&(e.hidden=!0);try{f.unMute(),f.setVolume(Rn)}catch{}if(Ns(),hr(),ue&&J()){const t=ue;ue=null,Ft(t)}else ue=null;me()}function fr(){clearTimeout(Tt);const e=document.getElementById("video-status");e&&(e.hidden=!1,e.textContent="無法播放影片，請在下方開啟 YouTube。")}function mr(e){const t=Number(e&&e.data);if(!Number.isFinite(t)||Pn&&!Me(t,P))return;const n=nt.find(a=>Me(a,t));n!==void 0&&(P=n,b(Bt,String(P)),_e(),Ht(y))}function hr(){Sa||(Sa=setInterval(()=>{if(!(!f||!U))try{const e=f.getVolume(),t=f.isMuted();typeof e=="number"&&e>0&&(Rn=e),As=!!t}catch{}},800))}function Ft(e){if(!f||!U){ue=e;return}try{As?f.mute():f.unMute(),f.setVolume(Rn),Qe===e?(f.seekTo(0,!0),f.playVideo()):(Qe=e,de=[],Pn=!0,_e(),f.loadVideoById(e))}catch{}}function gr(e){if(!f||!U){ue=e;return}if(Qe===e){let t=-1;try{t=f.getPlayerState()}catch{}if(t===YT.PlayerState.PLAYING||t===YT.PlayerState.BUFFERING)return}Ft(e)}function Cs(){const e=document.getElementById("play-toggle");if(!e)return;let t=-1;try{t=f&&f.getPlayerState()}catch{}const n=t===1||t===3;e.innerHTML=n?Na:ht,e.classList.toggle("playing",n),e.setAttribute("aria-label",n?"暫停":"播放")}function yr(e){if(Cs(),me(),(e.data===YT.PlayerState.PLAYING||e.data===YT.PlayerState.CUED)&&Ns(),e.data===YT.PlayerState.ENDED){Lt(),br();return}e.data===YT.PlayerState.PLAYING?vr():(Lt(),X())}function br(){if(!y||!J())return;const e=xt(y);if(e.next.id===y.id){Ft(e.next.youtubeId);return}St(1)}function vr(){Lt(),Ue=setInterval(X,ji)}function Lt(){Ue&&(clearInterval(Ue),Ue=null)}function js(e){const t=document.querySelectorAll(".lyric-line.active");if(!t.length)return 0;const n=e||t[t.length-1];let a=0;return t.forEach(s=>{s!==n&&(s.classList.remove("active"),s.style.opacity="0.999",requestAnimationFrame(()=>{s.style.opacity=""}),a++)}),a}let Be=null;function kr(){Be||(Be=setInterval(()=>{try{js(null)}catch{}},300))}function wr(){Be&&(clearInterval(Be),Be=null)}function X(e){const t=document.getElementById("lyrics-list");if(!t)return;const n=t.querySelectorAll(".lyric-line"),a=Fo(),s=a===null?null:a+un;Io(s);let i=be;if(s!==null&&isFinite(s)){i=-1;for(let r=0;r<n.length&&s>=Number(n[r].dataset.time);r++)$n(y&&y.lyrics&&y.lyrics[r])&&(i=r)}const o=i>=0&&n[i]?n[i]:null;Zo(o,s===null?null:s-un),js(o),o&&!o.classList.contains("active")&&o.classList.add("active"),Ra++,me(i),s!==null&&(i===be&&!e||(No(i),be=i,i>=0&&Le&&Er(n[i])))}function Dt(){const e=document.querySelector(".lyrics-scroll"),t=document.getElementById("lyrics-list");if(!e||!t)return;const n=t.querySelector(".lyric-line"),a=e.clientHeight;if(!n||!a)return;const s=a/2-n.getBoundingClientRect().height/2;t.style.paddingTop=Math.max(8,s)+"px",t.style.paddingBottom=Math.max(140,a/2)+"px"}let Ia=null,Aa=null;window.addEventListener("resize",()=>{const e=window.innerWidth,t=window.innerHeight;(e!==Ia||Math.abs(t-Aa)>100)&&(Ia=e,Aa=t,xe&&(os(),Dt(),J()&&X(!0)))});function Er(e){const t=document.querySelector(".lyrics-scroll");if(!t||!e)return;const n=t.getBoundingClientRect(),a=e.getBoundingClientRect(),s=a.top-n.top-(t.clientHeight/2-a.height/2),i=t.scrollHeight-t.clientHeight,o=Math.max(0,Math.min(i,t.scrollTop+s));Math.abs(o-t.scrollTop)<4||xr(t,o,Ri)}function xr(e,t,n){oe!==null&&cancelAnimationFrame(oe);const a=e.scrollTop,s=t-a,i=performance.now(),o=r=>{const l=Math.min(1,(r-i)/n),c=1-Math.pow(1-l,3);e.scrollTop=a+s*c,l<1?oe=requestAnimationFrame(o):oe=null};oe=requestAnimationFrame(o)}function Sr(e){f&&typeof f.seekTo=="function"&&(f.seekTo(e,!0),f.playVideo())}const ke=document.getElementById("app-banner"),Ir=document.getElementById("app-banner-msg"),we=document.getElementById("app-banner-action"),Ta=document.getElementById("app-banner-close");let Nt=null,Ct=null;function qt(e,t,n,a,s){ke&&(Ir.innerHTML=e,Nt=n||null,Ct=s||null,we.textContent=t||"",we.hidden=!t,ke.classList.toggle("offline",a==="offline"),ke.classList.add("show"))}function Ut(){ke&&ke.classList.remove("show"),we&&(we.hidden=!0,we.textContent=""),Nt=null,Ct=null}we&&we.addEventListener("click",()=>{Nt&&Nt()});Ta&&Ta.addEventListener("click",()=>{Ct?Ct():Ut()});const Bs="horo-install-hint";function Ar(){return window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0}function $s(){const e=navigator.userAgent||"",t=/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&Number(navigator.maxTouchPoints)>1,n=/android/i.test(e)&&(/mobile/i.test(e)||navigator.userAgentData&&navigator.userAgentData.mobile===!0);return{ios:t,android:n}}function Hn(){if(!navigator.onLine||Ar())return!1;const e=$s();return e.ios||e.android}function On(){return b(Bs)==="done"}function Vt(){b(Bs,"done"),Ut()}function Ms(e,t,n){!Hn()||On()||qt(e,t,n,"install",Vt)}"serviceWorker"in navigator&&location.protocol.startsWith("http")&&window.addEventListener("load",()=>{window.setTimeout(()=>{const e=!!navigator.serviceWorker.controller;navigator.serviceWorker.register(`./sw.js?build=${jt}`).then(n=>{n.addEventListener("updatefound",()=>{const a=n.installing;a&&a.addEventListener("statechange",()=>{a.state==="installed"&&navigator.serviceWorker.controller&&qt("<b>新版本</b>已準備完成，歌詞或介面可能已更新。","重新整理",()=>{a.postMessage({type:"SKIP_WAITING"})})})})}).catch(()=>{});let t=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{!e||t||(t=!0,location.reload())})},8e3)});function Fn(){navigator.onLine?ke&&ke.classList.contains("offline")&&Ut():qt("目前處於<b>離線</b>狀態。仍可查看歌詞與應援提示，但無法播放影片。","",null,"offline")}window.addEventListener("online",Fn);window.addEventListener("offline",Fn);function Tr(){!$s().ios||!Hn()||On()||Ms("點選分享按鈕 <b>⎋</b> → <b>加入主畫面</b>，即可像 App 一樣使用。","知道了",Vt)}let cn=null;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),!(!Hn()||On())&&(cn=e,Ms("<b>安裝</b>到主畫面後，就能在場館直接開啟。","安裝",async()=>{const t=cn;if(Vt(),cn=null,!!t)try{t.prompt(),await t.userChoice}catch{}}))});window.addEventListener("appinstalled",Vt);setTimeout(()=>{Fn(),Tr()},1500);window.addEventListener("hashchange",Da);function Lr(){if(window.YT&&window.YT.Player){J()&&xn();return}if(document.querySelector("script[data-youtube-api]"))return;window.onYouTubeIframeAPIReady=()=>{J()&&xn()};const e=document.createElement("script");e.src="https://www.youtube.com/iframe_api",e.async=!0,e.dataset.youtubeApi="true",document.head.appendChild(e)}_i();Qi();Da({resetScroll:!1});document.documentElement.removeAttribute("data-initial-route");
