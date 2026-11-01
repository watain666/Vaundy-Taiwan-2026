let karaokeSourcesPromise = null;

/* Song lyrics and readings now come from the song catalogue
   (src/catalogue/); only the karaoke adapter is still loaded here. */
export function loadKaraokeSources(){
  if (window.KARAOKE_SOURCES) return Promise.resolve(window.KARAOKE_SOURCES);
  if (!karaokeSourcesPromise){
    karaokeSourcesPromise = import("../../karaoke-sources.js")
      .then(() => window.KARAOKE_SOURCES || null)
      .catch(() => null);
  }
  return karaokeSourcesPromise;
}
