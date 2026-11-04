# Mohamed Nishaz — Portfolio

Complete source export of the current portfolio design. Plain HTML, CSS, and JavaScript; no build step, package installation, or external image dependency.

## Start locally

Open `index.html` in a browser, or run this command inside this folder:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000. Stop the server with Ctrl+C.

## Files

- `index.html` — all page sections and content.
- `styles.css` — responsive dark UI, layouts, and animations; portfolio artwork retains its colors.
- `script.js` — kinetic name reveal, experience views, book page turns, and portrait interactions.
- `hero-motion.css` — stepped name typography, masked letter rolls, and integrated object motion matching the supplied video.
- `intro-reveal.js` — centered introduction with a gray-to-white scroll reveal and teal INDEX Holding / yellow PickMe brand words; reduced motion shows the finished colors.
- `selected-work.css` — reference-style Product Design cards with three-panel collages, a circular arrow, and category/title below; responsive and reduced-motion support.
- `design-wall.css` and `design-wall.js` — sticky native-scroll 3D assembly of eight large design panels: four desktop columns, two mobile columns, reversible scrubbing, and a static reduced-motion/no-JavaScript gallery. Per-card timing and starting transforms are in `entrances`.
- `unpack.css` and `unpack.js` — scroll-driven box opening and three equal framed artwork cards, with a static reduced-motion fallback.
- `experience-previews.css` and `experience-previews.js` — small animated mockup stacks for each experience. A 4+ button expands extra images inline; per-company images are configured in `experienceImages`.
- `assets/` — local portraits, characters, and supplied artwork.
- `CODEX_HANDOFF.md` — current behavior, design preferences, and development notes.
- `project-links.js` — destinations for the five project cards. Add each URL to its matching entry; configured links open in a new tab. Empty entries leave a display-only card.
- `assets/circlo/` — supplied PDF and rendered artwork; the CirClo card uses its branding image.

## Adding project links

Edit the `projectLinks` object in `project-links.js` and paste each destination URL into the matching empty string. Cards use `target="_blank"` and `rel="noopener noreferrer"`. There are no case-study detail pages or popups.

## Page sections

1. Animated introduction
2. What’s inside the box? (three artwork cards emerge on scroll)
3. Experience (five roles)
4. Product Design (five projects)
5. Crafts (four portrait cards)
6. My Design Principles
7. Clients I’ve worked with (five locations)
8. My Design Wall
9. About me
10. Read My Journey (interactive book)
11. Footer

This is a frontend prototype. It has no backend or deployment configuration.

## Browser verification

With Playwright available, run `node scripts/verify.cjs` while the local server is running. If Playwright is installed elsewhere, set `PLAYWRIGHT_MODULE` to that module’s path. The check covers 320, 390, 768, and 1440px layouts, the dark UI, timeline expansion, the design wall, and reduced motion. Screenshots are saved to `output/qa/`.

Run `node scripts/verify-design-wall.cjs` for the wall’s center-first entrance, final grid, reverse scrolling, sticky release, live resize, reduced-motion changes, and no-JavaScript fallback. It also checks a 320 × 568px phone and a 1920px desktop.
