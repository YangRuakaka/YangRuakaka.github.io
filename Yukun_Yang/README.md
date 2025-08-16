# Personal Academic Site Template (Water Themed)

This is an initial template for Yukun Yang's personal academic / PhD application website, hosted via GitHub Pages (username.github.io). It emphasizes a fluid water-inspired aesthetic, animated wave background, and interactive microinteractions.

## Features
- Procedural multi-layer animated wave background (pure Canvas, no dependencies)
- Fluid glass + gradient UI, hydrodynamic metaphors
- Section scroll-in animations (IntersectionObserver)
- Interactive magnetic logo, card tilt, ripple feedback on project cards
- Responsive layout with mobile navigation drawer
- Light i18n toggle (EN / 简体中文 placeholder)
- Accessible focus handling, reduced motion respect
- Ready sections: About, Research, Projects, Publications, Contact

## Quick Start
1. Place the `index.html` at repository root (for `username.github.io`) or ensure GitHub Pages is configured to serve this folder.
2. Commit & push.
3. Visit: `https://username.github.io/` (replace with your username) or project path.

## Customize
- Update email and external profile links in `#contact` section.
- Add publications into `#publications` list.
- Replace projects in `#projects`.
- Add a PDF CV and link it (e.g., `/assets/cv/YukunYang_CV.pdf`).
- Extend `i18nMap` in `assets/js/main.js` for more translated strings.
- Replace `assets/img/avatar.jpg` with your portrait (recommended square ~800x800, compressed <150KB). Keep same filename for simplicity.

## Performance Notes
- Background waves are lightweight (4 layers, ~ few hundred path points each frame). Adjust in `layers` array in `waves.js`.
- For lower power devices, auto-respects `prefers-reduced-motion`.

### Adjusting Wave Intensity
In `assets/js/waves.js`, modify `amp` (amplitude), `len` (spatial frequency), `speed` (temporal speed), and RGBA alpha for brightness.

## Accessibility
- Escape key closes mobile nav.
- `prefers-reduced-motion` halts animation.
- Semantic landmarks: header, main, footer, sections with headings.

## License
MIT (feel free to adapt).

## Next Ideas
- Dark/light theme toggle
- Add publication BibTeX viewer
- Add timeline / news feed
- Integrate analytics (e.g., Plausible) respecting privacy
- Add service worker for offline fonts & assets
