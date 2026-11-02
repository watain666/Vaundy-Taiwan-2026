/*
 * Shared lyric text helpers: HTML escaping, the icon tokens written inside
 * lyrics ([wave], (clap), …) and the spacing between CJK and Latin text.
 * Used by the page script and the lyric view; no DOM, no globals.
 */
import { INLINE_ICONS } from "./icons.js";

const ICONS = INLINE_ICONS as Record<string, string>;

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function escapeHtml(value: unknown): string {
  return String(value).replace(/[&<>"']/g, char => HTML_ESCAPES[char]);
}

/* [wave] 처럼 대괄호로도, (wave) 처럼 소괄호로도 쓸 수 있게 둘 다 인식 */
export const ICON_TOKEN_RE = /[\[(](wave|clap|mic|chant|jump|spin|turn)[\])]/gi;

/** Replaces every icon token in already-escaped markup with its inline icon. */
export function iconTokensToMarkup(markup: string): string {
  return markup.replace(ICON_TOKEN_RE, (match: string, key: string) => ICONS[key.toLowerCase()] || match);
}

/* 가사 글자를 안전하게 처리하면서, [wave] [clap] [mic] 같은 표시를
   그 자리에서 움직이는 아이콘으로 바꿔 준다. 가사 어느 위치에나 넣을 수 있다. */
export function withIcons(value: unknown): string {
  if (value === undefined || value === null) return "";
  return iconTokensToMarkup(escapeHtml(spaceCjkLatinText(value)));
}

/*
 * 歌詞排版原則：中文／日文與相鄰的半形英數字之間保留一個半形空白。
 * 這是顯示層的處理，原始歌詞仍維持不變，避免影響假名索引與卡拉 OK 對齊。
 */
const CJK_CHAR_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;
const LATIN_OR_DIGIT_CHAR_RE = /[A-Za-z0-9]/;
const CJK_TO_LATIN_RE = /([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])(?=[A-Za-z0-9])/gu;
const LATIN_TO_CJK_RE = /([A-Za-z0-9])(?=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])/gu;

export function spaceCjkLatinText(value: unknown): string {
  return String(value ?? "")
    .replace(CJK_TO_LATIN_RE, "$1 ")
    .replace(LATIN_TO_CJK_RE, "$1 ");
}

function edgeNonSpaceChar(value: string, fromEnd: boolean): string {
  const chars = Array.from(String(value || ""));
  while (chars.length && /\s/u.test(fromEnd ? chars[chars.length - 1] : chars[0])) {
    if (fromEnd) chars.pop();
    else chars.shift();
  }
  return fromEnd ? chars[chars.length - 1] || "" : chars[0] || "";
}

/* furigana 會產生帶有 <ruby>/<rt> 的 HTML；只處理文字片段，保留標記本身。 */
export function spaceCjkLatinMarkup(markup: unknown): string {
  const parts = String(markup || "").split(/(<[^>]*>)/g);
  const textIndexes: number[] = [];

  parts.forEach((part, index) => {
    if (/^<[^>]*>$/.test(part)) return;
    parts[index] = spaceCjkLatinText(part);
    textIndexes.push(index);
  });

  for (let i = 1; i < textIndexes.length; i++) {
    const previousIndex = textIndexes[i - 1];
    const currentIndex = textIndexes[i];
    const previous = parts[previousIndex];
    const current = parts[currentIndex];
    const previousChar = edgeNonSpaceChar(previous, true);
    const currentChar = edgeNonSpaceChar(current, false);
    const hasTrailingSpace = /\s$/u.test(previous);
    const hasLeadingSpace = /^\s/u.test(current);

    if (!hasTrailingSpace && !hasLeadingSpace
      && CJK_CHAR_RE.test(previousChar) && LATIN_OR_DIGIT_CHAR_RE.test(currentChar)) {
      parts[currentIndex] = " " + current;
    } else if (!hasTrailingSpace && !hasLeadingSpace
      && LATIN_OR_DIGIT_CHAR_RE.test(previousChar) && CJK_CHAR_RE.test(currentChar)) {
      parts[previousIndex] = previous + " ";
    }
  }

  return parts.join("");
}
