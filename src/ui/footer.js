import { GITHUB_SVG } from "./icons.js";
import { FEEDBACK_FORM_URL } from "../data.js";

const REPO_URL = "https://github.com/watain666/Vaundy-Taiwan-2026";
const FEEDBACK_URL = FEEDBACK_FORM_URL;
const ORIGINAL_SITE_URL = "https://vaundy-seoul-2026.pages.dev/";
const KOREAN_AUTHOR_URL = "https://gall.dcinside.com/mgallery/board/view/?id=vaundy0606&no=35550";

export function siteFooterHtml(build){
  return `
    <footer class="credits">
      <nav class="credits-links" aria-label="專案連結">
        <p class="credits-copy">
          <span class="credits-copy-desktop">VAUNDY ASIA ARENA TOUR 2026 &ldquo;HORO&rdquo;・TAIWAN FAN CHANT GUIDE（非官方粉絲製作）</span>
          <span class="credits-copy-mobile">VAUNDY ASIA ARENA TOUR 2026 &ldquo;HORO&rdquo;<br>TAIWAN FAN CHANT GUIDE（非官方粉絲製作）</span>
          <span class="build">${build}</span>
        </p>
        <span class="credits-origin">
          <a class="credits-link credits-repo" href="${REPO_URL}" target="_blank" rel="noopener" aria-label="GitHub Repo" title="GitHub Repo">
            ${GITHUB_SVG}
          </a>
          <a class="credits-fork" href="${ORIGINAL_SITE_URL}" target="_blank" rel="noopener" aria-label="Fork from SEOUL 응원가이드">
            Fork from SEOUL 응원가이드
          </a>
        </span>
        <a class="credits-fork" href="${KOREAN_AUTHOR_URL}" target="_blank" rel="noopener" aria-label="Thanks to the original Korean creator, 카쿠메.">
          Thanks to the original Korean creator, 카쿠메.
        </a>
        <span class="credits-actions">
          <a class="credits-link" href="${FEEDBACK_URL}" target="_blank" rel="noopener" aria-label="意見回饋" title="意見回饋">
            <span>意見回饋</span>
          </a>
          <button class="credits-link changelog-trigger" type="button" data-open-changelog aria-haspopup="dialog" aria-controls="changelog-view">
            更新日誌
          </button>
        </span>
      </nav>
    </footer>
  `;
}
