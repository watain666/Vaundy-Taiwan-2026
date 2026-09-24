let furiganaPromise = null;
let karaokeSourcesPromise = null;
let songLyricsPromise = null;
let furiganaCorrectionsApplied = false;
let correctionsPromise = null;

export function loadSongLyrics(){
  if (!songLyricsPromise){
    songLyricsPromise = import("../song-lyrics.js")
      .then(({ SONG_LYRICS }) => new Map(SONG_LYRICS.map(song => [song.id, song])))
      .catch((error) => {
        songLyricsPromise = null;
        throw error;
      });
  }
  return songLyricsPromise;
}

function loadCorrections(){
  if (!correctionsPromise){
    correctionsPromise = import("../furigana-corrections.js")
      .then(module => module)
      .catch(() => null);
  }
  return correctionsPromise;
}

function applyFuriganaCorrections(corrections){
  if (furiganaCorrectionsApplied) return;
  if (!corrections) return;
  const { FURIGANA_CORRECTIONS, ROMAJI_CORRECTIONS } = corrections;
  if (window.JP_FURIGANA){
    window.JP_FURIGANA = Object.freeze({
      ...window.JP_FURIGANA,
      ...FURIGANA_CORRECTIONS
    });
  }
  if (window.JP_ROMAJI){
    window.JP_ROMAJI = Object.freeze({
      ...window.JP_ROMAJI,
      ...ROMAJI_CORRECTIONS
    });
  }
  if (!window.JP_FURIGANA && !window.JP_ROMAJI) return;
  furiganaCorrectionsApplied = true;
}

export function loadFurigana(){
  if (window.JP_FURIGANA || window.JP_ROMAJI){
    return loadCorrections().then(applyFuriganaCorrections);
  }
  if (!furiganaPromise){
    furiganaPromise = Promise.all([
      import("../../furigana.js"),
      loadCorrections()
    ])
      .then(([, corrections]) => applyFuriganaCorrections(corrections))
      .catch(() => undefined);
  }
  return furiganaPromise;
}

export function loadKaraokeSources(){
  if (window.KARAOKE_SOURCES) return Promise.resolve(window.KARAOKE_SOURCES);
  if (!karaokeSourcesPromise){
    karaokeSourcesPromise = import("../../karaoke-sources.js")
      .then(() => window.KARAOKE_SOURCES || null)
      .catch(() => null);
  }
  return karaokeSourcesPromise;
}
