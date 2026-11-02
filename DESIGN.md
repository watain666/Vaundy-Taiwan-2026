# HORO Taipei fan guide design

## 1. Atmosphere & identity

A compact concert program for use on a phone, including in a dark arena. Official poster photography carries the mood. Information and controls stay quiet and legible around it.

## 2. Color

The home hero keeps the existing deep wine background (`--bg-deep`), cream text (`--cream`), and gold (`--gold`). The guide, playback, and setlist share semantic reading colors (`--ui-bg`, `--ui-surface`, `--ui-raised`, `--ui-text`, `--ui-muted`, `--ui-line`). Light mode uses pale neutral surfaces; dark mode uses charcoal. Follow the device preference until a visitor chooses a mode, then remember that choice. The home poster remains dark in both modes. The chant, clap, wave, jump, and spin colors identify audience actions where the cue itself needs recognition. Avoid red page fills, decorative gradients, and color on every badge.

## 3. Typography

The reading and control face uses the Taiwan-common system stack PingFang TC, Microsoft JhengHei, and Noto Sans CJK TC. Japanese lyric text uses Noto Sans JP first, then the Taiwan system stack, so Japanese kanji does not depend on a device's incomplete fallback coverage. In Chinese and Japanese lyrics, keep one half-width space between CJK characters and adjacent half-width Latin letters or digits; treat this as a project-wide lyric formatting rule following [盤古之白](https://www.jkg.tw/p3601/). Use a system monospace face for the large live countdown so every digit occupies the same width. Use tabular numerals for other times and song numbers. Body copy should keep Traditional Chinese phrases together and should not use wide tracking or chromatic shadows.

## 4. Spacing & layout

The home hero owns its centered narrow column. Guide and setlist content use the existing 640px reading width; song playback retains its existing two-column layout above 900px. Use a 4px rhythm, with 16–20px row insets and 24–32px between separate decisions. Keep 40–44px touch targets for primary controls. Neutral reading surfaces follow the selected theme; the poster remains the expressive image.

The control layer uses `--space-1` through `--space-4` (4, 8, 12, 16px), `--control-height` (40px), `--touch-height` (44px), and `--dock-height` (56px). `--radius-pill` belongs to compact controls and the song dock; `--radius-notice` belongs to the install/update notice. `--type-control` and `--type-dock-size` define their type roles, and `--elevation-float` is reserved for floating surfaces. The dock's 6px inset is a deliberate half-step around its 44px controls. Color and highlight variations live in the light/dark theme tokens rather than individual components.

## 5. Components

- **Primary action:** solid cream fill, dark text; hover darkens slightly, focus has a visible outline.
- **Menu row:** one shared dark home surface with dividers between rows; hover is a quiet tonal change, focus is outlined. Existing accordion expansion remains.
- **Segmented control:** neutral track and one solid selected item; inactive items stay transparent.
- **Song row:** one theme-matched list surface, with only a hairline between neighboring songs; title first and supporting cues second. Keep cue icons identifiable while making their resting colors quiet.
- **Lyric row:** the current line stays fully opaque; other lines recede to half opacity while playback has a current line, and regain full opacity on hover or keyboard focus.
- **Overlay:** a solid theme-matched surface and a restrained shadow only where it separates from underlying content.
- **Player controls:** a dedicated bottom utility bar takes its own space below the lyric scroller. Previous song, current song picker, and next song share one translucent floating pill below that bar, with a quiet blur and reserved space so neither covers lyrics. The video frame displays a loading message and a useful YouTube fallback when connection or playback fails.
- **Search field:** the compound field owns one visible focus boundary. Its inner input adds no second ring.
- **Install notice:** one softly raised, rounded surface without an outline. Keep update and offline notices actionable.
- **System status:** do not show a persistent success badge for offline lyric caching. Show a message only when connectivity or an update requires action.
- **Setlist:** opens directly in concert order; 六/日 variants are labelled in place, and the all-songs list remains the search and sort surface.

## 6. Motion & interaction

Use short color and opacity transitions for feedback. Keep existing motion that explains lyric timing and cheering actions. Remove decorative pulsing and layout movement. Respect reduced-motion preferences.

## 7. Depth & surface

Use tonal shifts and spacing for ordinary content. Reserve a hairline for neighboring list rows and a shadow for overlays. Poster images are the one expressive material; no blur or atmospheric gradient stacks over utility pages.

## 8. Accessibility constraints & accepted debt

Keep visible keyboard focus, readable contrast in the arena, meaningful icon labels, and phrase-preserving Traditional Chinese wrapping. The existing large single-file page and its inline SVG illustration remain; restructuring them is outside this visual pass.

The guide and song picker show persistent search labels, with 16px search text on phones. Sort and view controls expose their pressed state as ordinary buttons. Collapsed information cards and inactive screens stay out of keyboard and screen-reader navigation. When a song picker or notice image opens, focus moves into it; closing returns focus to the trigger.
