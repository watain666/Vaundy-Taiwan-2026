/* ─────────────────────────────────────────────────────────────
   응원가이드 서비스워커 — 오프라인에서도 열리도록 파일을 폰에 저장해 둡니다.

   ★ 가사나 화면을 고쳐서 다시 올릴 때는 아래 CACHE_VERSION 숫자를 꼭 올려 주세요.
     그래야 사람들 폰에 새 내용이 내려갑니다. (v1 → v2 → v3 …)
   ───────────────────────────────────────────────────────────── */
const CACHE_VERSION = "v1.10.3";
const CACHE_NAME    = `horo-guide-${CACHE_VERSION}`;

/* Vite production builds include the entry, split lyrics/readings, and CSS
   images so opening a song for the first time also works offline. */
const VITE_BUILD_ASSETS = [];

/* 처음 방문할 때 미리 받아 둘 핵심 파일들.
   큰 사진과 응원 GIF/WebM은 실제로 사용될 때만 받아 둡니다. */
const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png",
  ...(VITE_BUILD_ASSETS.length ? [] : ["./images/poster.webp", "./images/setlist-bg.jpg"]),
  ...VITE_BUILD_ASSETS
];

/* The route-loaded Noto Sans JP CSS and woff2 files are cached at runtime. */
const RUNTIME_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(PRECACHE.map(url =>
      cache.add(new Request(url, { cache: "reload" })).catch(() => {
        /* 포스터 이미지가 없는 경우 등 — 그냥 건너뜁니다 */
      })
    ));
    self.skipWaiting();   // 새 버전을 곧바로 대기 상태로
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith("horo-guide-") && k !== CACHE_NAME)
          .map(k => caches.delete(k))          // 옛 버전 캐시 정리
    );
    await self.clients.claim();
  })());
});

/* 페이지가 "이 파일들도 오프라인용으로 받아 둬" 하고 보내오면 하나씩 챙겨 둔다.
   짤방 GIF 는 용량이 크므로 한꺼번에 받지 않고 순서대로,
   이미 받아 둔 것은 건너뛴다. 하나가 실패해도 나머지는 계속 받는다. */
async function cacheUrls(urls){
  const cache = await caches.open(CACHE_NAME);
  for (const url of urls){
    try {
      if (await cache.match(url)) continue;          // 이미 있으면 넘어감
      const res = await fetch(url, { cache: "no-cache" });
      if (res && res.ok) await cache.put(url, res.clone());
    } catch (e) { /* 이 파일만 건너뛴다 */ }
  }
}

/* 페이지에서 "지금 새 버전 적용" 을 눌렀을 때 */
self.addEventListener("message", (event) => {
  const d = event.data;
  if (!d) return;
  if (d.type === "SKIP_WAITING") self.skipWaiting();
  if (d.type === "CACHE_URLS" && Array.isArray(d.urls)) event.waitUntil(cacheUrls(d.urls));
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  /* 유튜브 등 그 밖의 외부 요청은 손대지 않습니다 (영상은 캐시 불가) */
  const sameOrigin = url.origin === self.location.origin;
  const isFontHost = RUNTIME_HOSTS.includes(url.hostname);
  if (!sameOrigin && !isFontHost) return;

  /* 페이지 이동(주소 입력·새로고침) — 네트워크 우선, 실패하면 저장해 둔 화면 */
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put("./index.html", fresh.clone());
        return fresh;
      } catch (e) {
        const cache  = await caches.open(CACHE_NAME);
        return (await cache.match("./index.html")) || (await cache.match("./")) || Response.error();
      }
    })());
    return;
  }

  /* 사진·글꼴·GIF 는 한 번 받아 두면 내용이 바뀌지 않는다.
     (내용을 바꿀 때는 위의 CACHE_VERSION 을 올리므로 그때 전부 새로 받는다)
     그래서 저장해 둔 게 있으면 네트워크를 아예 건드리지 않는다.
     이렇게 안 하면 앱을 열 때마다 뒤에서 글꼴·사진 수 MB 를 다시 받아
     공연장처럼 데이터가 느린 곳에서 손해가 크다. */
  const isStatic = /\.(woff2?|ttf|otf|jpe?g|png|gif|webp|svg|ico)$/i.test(url.pathname);

  event.respondWith((async () => {
    const cache  = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);

    if (isStatic && cached) return cached;          // 이미 있으면 그걸로 끝

    const network = fetch(req).then((res) => {
      if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
      return res;
    }).catch(() => null);

    return cached || (await network) || Response.error();
  })());
});
