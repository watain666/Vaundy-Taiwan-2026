# The phone subtitle window paints a lyric view mount into a video

Phone browsers have no Document Picture-in-Picture, but iOS Safari and Android Chrome put a `<video>` into the system PiP window, which stays on screen over other apps. The phone subtitle window (`src/video-pip.js`) is a canvas, captured as a muted video stream, placed in that window. Its content comes from a third lyric view mount on a container that is never shown: `src/video-pip-frame.ts` reads the current and next rows of that mount, with their text, ruby, karaoke state, colours and opacity taken from the DOM and computed styles, and paints them in the desktop window's layout. It gets the same view model as the desktop window (`buildDocumentPipViewModel`).

While this window is open the page resumes YouTube playback when it pauses without the visitor asking for it (the player pauses itself once the page leaves the screen). A pause the visitor makes through the page's controls or the PiP window's play/pause, an intended stop such as the end of chant-only practice, and a pause from the YouTube player's own controls while the visitor is on the page are kept. The resume is capped at five attempts in twenty seconds.

## Considered Options

- **Draw the rows from the song data with a second text renderer.** Rejected for the reason in ADR 0002: two renderers of the same rows drift apart. Reading a mount keeps one row renderer and one set of theme colours.
- **Rasterize the mount's DOM through an SVG `foreignObject` image.** Rejected: Safari taints or mis-renders such images, web fonts are not carried into them, and it is slow to do on every sync tick on a phone.
- **Wrap the site in a native app to get native PiP.** Rejected: the YouTube video lives in a cross-origin iframe that a native shell cannot hand to the system player either, and a second app to ship is out of proportion.

## Consequences

- The PiP window is a picture: it has no buttons. Play/pause in the system controls reaches the page through the video's `play`/`pause` events and Media Session actions, which also carry previous/next track.
- Safari opens PiP only from inside the click and only for a video that already has frames, so the video is prepared when the song shell is built and the click handler awaits nothing before the request.
- The auto-resume keeps the YouTube audio going while only the lyrics are on screen, which YouTube's Developer Policies (III.I.9, background players) do not allow; the owner accepted that risk on 2026-11-03 after a device test showed it works on iOS. YouTube can stop it on its side at any time, and then the window still shows the lyrics while the page is on screen.
