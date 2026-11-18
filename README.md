# Jhen Sing Chou — portfolio

Next.js 15 (App Router) · React 19 · Tailwind v4 · Three.js via @react-three/fiber · Lenis

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things live

| What | Where |
| --- | --- |
| Project headline copy, facts, stats, stages, accent colours | `lib/projects.ts` |
| Cropped figures shown beside each stage of a case study | `lib/figures.ts` + `public/work/<slug>/fig-*.jpg` (regenerate with `scripts/make_figures.py`) |
| Work list thumbnails (greyscale, 480×360) | `public/work/thumbs/<slug>.jpg` |
| Full case-study text from the PDF (every section, insight, metric, quote), rendered under each stage | `lib/details.ts` (keyed by slug, then stage label) |
| Name, bio, quote, recognition, nav, hero copy | `lib/site.ts` |
| Image manifest (generated) | `lib/images.ts` |
| Images extracted from your PDF | `public/work/<slug>/`, `public/work/site/` |
| Home sections | `components/sections/` (Hero, Work, About, Contact) |
| Case study pages (`/work/[slug]`) | `app/work/[slug]/page.tsx`, `components/case/` |
| Glass shader, spring simulation | `components/glass/` |

To edit a project, change `lib/projects.ts`; the Work list, glass orbs and case page all read from it.
To add a project, add an entry there (and its images under `public/work/<slug>/`, registered in `lib/images.ts`).

## How it fits together

- One full-screen WebGL quad raymarches seven glass spheres over a procedural sky. Pointer and scroll feed a shared `motion` object (`lib/motion.ts`) written by a single rAF loop in `MotionRoot`.
- Scroll moves the glass from the hero, to the board, to the four method orbs (one per project: Human, Organization, Environment, Technology).
- Home is atmospheric: a living sky with raymarched glass in front of it (refraction with dispersion, fresnel, crisp speculars, a thin chartreuse film), live orbit lines and light sparks (`lib/trajectory.ts`, drawn on a 2D canvas) that bend away from the cursor and speed up with scroll. Luminous halo rings wrap the glass (`rings()` in `shader.ts`): they sit in the sky term so refraction bends them, split per colour channel for prismatic edges, wobble organically and are pushed away by the cursor. The glass itself squishes toward the cursor: bodies flatten along the line to the pointer, bulge sideways and ripple (`uPW` in `shader.ts`). Below the hero a white veil calms the sky behind body copy.
- Inner pages (`/work/*`) are solid white with dark ink. Their `<main>` fades in over the sky (`.case-enter`), the canvas is unmounted once covered (see `GlassLayer`), and it fades back in when you return home. Nothing 3D runs on a page nobody can see.
- Small screens and touch (`motion.lite`): no pointer parallax or repulsion, lower DPR cap, gentler smoothing. Reduced-motion freezes the trajectory spark and calms the simulation.

## Regenerating images

`scripts/export_images.py` crops and exports images from `pdfimages -png -p` output of the PDF, then rewrites `lib/images.ts`.

## Known limits

- Built and checked without access to the npm registry: components, CSS and pages were bundled and rendered in headless Chromium, and the shader tested separately, but `next dev` / `next build` itself has not been run. Expect to fix a small thing or two on first run.
- The portrait in the PDF is low resolution (235×353); swap in a larger one at `public/work/site/portrait.jpg`.
- Some phone mockups in the PDF are small; they stay sharp up to roughly 190px wide.
- Case-study lead images shot on black (Social Hive) sit in a rounded black card on white.
- Hero tags (Product / UX / Interaction / Social systems) follow the reference screenshot, not the PDF.

## Latest design pass

- **Glass**: one cohesive cluster (4 main spheres kissing around a small core, 3 small ones hugging it), sharper chrome-edge line, cooler rim. Only two orbit ellipses remain, drawn mostly behind the glass (`lib/rings.ts`, shader `rings()`, `lib/trajectory.ts`).
- **Type**: Instrument Serif (`.serif` italic accents, `.serif-r` roman for leads and numerals) against Hanken Grotesk. Add `@fontsource/instrument-serif` via `npm install` (already in package.json).
- **Neon yellow** `#e4ff1a` (`--color-neon`): always a surface with dark ink on it (`.mark` highlighter under key data, `.chip` tags, `.neon-hover` links, active section pill, focus ring, the "design challenge" panel).
- **Case pages** are laid out for the web, not the PDF: sticky scroll-spy section bar (`CaseNav`), two-column sub-sections, card/stat tiles, horizontal step timelines, serif pull quotes, a before/after slider (`Compare`, used for onboarding time 6 → 3 weeks; add `{ k: 'compare', ... }` blocks in `lib/details.ts`), and the original PDF boards in an enlargeable lightbox gallery (`Gallery`). The PDF has no before/after image pairs, so nothing was invented; `Compare` takes any two text panels.

## Hover dynamics and paired visuals

- `.hv` (globals.css): headings, nav links and project titles lift 3px, open their tracking (`--ls` + 0.025em), and get a neon `#e4ff1a` highlighter sweep with a faint glow. Neon stays a surface under dark ink so contrast holds on sky and white. `.tile` gives every card the same lift + neon-tinted shadow.
- Four relationships: the label under the cursor, or the orb under the cursor, sets `motion.hot`; that orb swells ~9% (sim), its numeral becomes a neon chip, its heading takes the `.hv` highlight and its leader line thickens.
- Case pages: on wide screens each stage shows its narrative on the left and its original PDF boards in a sticky evidence rail on the right (enlargeable), so diagrams stay beside the text they belong to.

## Figures cropped from the PDF, paired with the story

`scripts/make_figures.py` crops 67 individual diagrams, research charts, journey maps, wireframes and photo groups out of the PDF pages (boxes are page fractions) into `public/work/<project>/fig-pNN-*.jpg` and writes `lib/figures.ts`. Each figure has `at`, the index of the block in `lib/details.ts` it sits beside, so in `components/case/Stages.tsx` the claim and its evidence share a row (text left, figures right, enlargeable). The full original boards remain under a "Full original boards" disclosure at the end of each stage, so nothing is lost. To re-crop: rasterise pages 3-29 to ~2700px as `p-NN.jpg`, then `python3 scripts/make_figures.py <dir>`.

## About / Contact, and hover

About is an editorial layout (sticky identity card, highlighted statement, numbered practice tiles, serif pull quote, recognition rows); Contact has a neon CTA, copy-address button and quick links. Hover on headings, project titles and hero lines: neon fill with an ink hairline, bloom, switch to Instrument Serif italic, wider tracking, 3px lift (`.hv`); nav links become a dark pill with neon serif italic (`.hv-pill`).

## Case pages: figures only, no PDF boards
The "Original boards" disclosure, project-cover board and all full-page PDF rasters were removed (`lib/boards.ts`, `components/case/Boards.tsx`, `public/work/*/board-*.jpg`). Case pages now carry only cropped diagrams/wireframes/infographics (`lib/figures.ts`), shown as small rounded cards with soft shadows (width capped by aspect ratio in `components/case/Gallery.tsx` → `figMax`; style `.fig-card` in `globals.css`), sticky beside the paragraph they support, click to enlarge. Text-only card strips that duplicated the copy were dropped from `scripts/make_figures.py`.

## Round: About scale, line icons, page transitions
- About: statement ≈ 1.4–1.9rem, body 15.5px, two-column text + practice rows (no oversized blocks).
- Icons: `components/Icon.tsx` (24px grid, 1.5 stroke, optional neon node) used for roles, practice, recognition, stats, stage markers, case nav, contact.
- Figures: tight crops, white ground multiplied away (`.fig-img`), hairline frame, neon ring on hover.
- Transitions: `app/template.tsx` + `components/PageTransition.tsx` (framer-motion: blur-fade in, blur-fade out on internal link click, neon wipe). Add dependency with `npm install` (framer-motion ^12). Respects reduced motion.
- Chips/tags/plain links share the neon lift + tracking hover.

## Round: text/image separation, dedupe, paired steps
- Figures are re-cropped to visuals only (no baked titles/paragraphs); text-card crops were dropped (their copy already lives as web text in `lib/details.ts`). Captions are one short label; full description is the alt text. Originals are reproducible via `scripts/make_figures.py` (then apply the fractional crops listed in this commit's notes).
- `lib/dedupe.ts` hides detail blocks whose wording repeats the stage copy; figures re-home to the next shown block.
- Steps/cards blocks whose figures carry a `step` index render as a paired list: step text left, its own diagram right (`Paired` in `components/case/Stages.tsx`). Other blocks use a 5/7 text/figure pair from `lg` (1024px) up, single column below. `.gutter` centres content at 1680px on ultrawide.

## Round: frameless figures
Figures have no card, border, padding, radius or shadow. They fill their column (paired steps) or the full content width (other blocks); portrait groups sit 2–3 across; the caption is a small mono line beneath. See `.fig-card` in `globals.css` and `Gallery` (`bare`).

## Round: borderless modules, code-rendered charts, dedupe
- Grey cards/boxes removed from case pages (cards, lists, stat tiles, points, contribution, table); modules are hairline-topped columns.
- `components/case/Viz.tsx`: `Rings` (78/66/53% life perception), `Bars` (key skills, intention vs action) and `Scores` (exhibition scores) in SVG/CSS with neon `#e4ff1a` fills, animate once on scroll, static for reduced motion. The survey and score images they replaced were deleted.
- `lib/dedupe.ts` hides duplicate blocks and (`skipPoints`) duplicate stage point lists. Overview headline stats intentionally restate key numbers once.

## Round: living orbit, sphere cursor, atmosphere, kinetic neon
- Orbit: four riders (two per ellipse, counter-rotating, ~15–25 s a lap, scroll adds speed), trails on every rider, a neon dash train marching along each ellipse, livelier tilt/ratio drift (`lib/trajectory.ts`, `lib/rings.ts`; the shader's soft rings use the same params).
- Cursor: `lib/cursor.ts` + `components/Cursor.tsx`; chrome ball → clear glass bubble with neon rim over interactive elements, magnetic pull, luminous trail. Disabled on touch and reduced motion (system cursor stays).
- Sky: deeper gradient, sun-side rim-lit clouds with blue-grey undersides, vignette and light shaft (`skyCol` in `components/glass/shader.ts`).
- Kinetic neon: letter-wave and sweeping highlighter on "connected", glowing metric callouts (`site.metrics`), scroll-reactive neon marquee (`components/sections/Marquee.tsx`).

## Round: code-rendered diagrams, capped figures, tighter rhythm
- `lib/diagrams.ts` + `app/diagrams.css` (imported by `globals.css`): the social-capital pillars, desk-research Venn, journey maps (social, workplace), research-process flow, persona 2×2 matrix, Double Diamond and the FlexFit Venn/Identify→Adjust framework are plain HTML + CSS (glass nodes, chrome orbs, neon fills), not images. Figures with a `diagram` id render through `components/case/Diagram.tsx`; `lead: true` puts one before its block. The same strings feed the standalone preview.
- The seven replaced picture files were deleted; `fig-p05-desk` and `fig-p15-persona` were re-cropped to just the photos. `lib/dedupe.ts` hides the blocks the diagrams now carry.
- Raster figures are capped at `min(70vh, 680px)` tall, never upscaled; near-square/portrait ones sit beside their text (`Stages.tsx`, `compact`). Stage, block and overview spacing reduced.
- `scripts/make_figures.py` still lists the deleted crops; do not re-run it without removing them.

## Round: home polish
- Removed the neon ticker (Marquee), the hero hairlines/crosshair ticks, the PEOPLE/IDEAS label and the coordinates.
- `components/sections/Work.tsx` replaces Departures + Method: one pinned section. Left: the four relationship themes (Human ↔ Human …); right: project number, title, description and a "Read the case" link for the selected theme. Hover/focus/tap a theme or hover an orb to switch. `SPREAD_WIDE` in `components/glass/sim.ts` keeps the orbs in the middle band so text never overlaps glass. Nav is WORK / ABOUT / CONTACT.
- Orbit: the 2D layer now runs on phones too (it used to hold still below 768px while the shader kept moving), follows the WebGL clock but falls back to the wall clock, and the frame loop always reschedules itself. Only `prefers-reduced-motion` stops it.
- About: practice list is borderless rows; recognition is a timeline with one fixed-width year column and one rail (`.tl` in globals.css).
- Contact: quick-link boxes and coordinates removed; email + copy only, with a minimal footer.

## Four Relationships refinement
- `lib/projects.ts` → `home: { year, status?, desc }` drives the homepage panel (01 Social Hive 2025 Awarded · 02 Workplace Unboxing Plan 2024 Adopted · 03 FlexFit Gym 2025 · 04 Designing Digital Confidence 2025).
- Hover/focus a theme row: it becomes a neon `#e4ff1a` pill (ink outline), its leader line turns solid ink to its orb, and the right panel cross-fades/slides in (staggered). Portrait: 2×2 theme grid + detail panel.

## Work section layout (list left, links + case info right)
- Left: the four projects as rows with black-and-white thumbnails (`public/work/thumbs/*.jpg`, 480×360 greyscale crops of each hero) + year + title. Right: the four relationship links (neon pill when active, leader line to the matching orb) and, beneath them, the case info (number, year, status, title, description, "Read the case").
- Interactions unchanged: hovering/focusing/clicking either list or an orb switches everything together; the thumbnail gets a neon ring + full-contrast image. Thumbnails: `home.thumb` in `lib/projects.ts`.
- Orb layout: `SPREAD_WIDE` sits between the two columns; `SPREAD_TALL` shifted up. Phones: orbs → case info → 2×2 links → thumbnail strip.

## Work section: merged left menu
- Each left card = B&W thumbnail + year + title + "Human ↔ …" tag (neon pill when active, leader line from the tag to its orb). Right column = case info + "Read the case" only. Phones: orbs → case info → 2×2 compact cards (thumb + tag).

## About on one screen
- Header is now sticky with a frosted-glass bar once you scroll (`data-nav='solid'`, set in `MotionRoot`); About starts below it (`padding-top: 6.5rem`).
- One bio paragraph (`about.paragraph` + `about.marks` in `lib/site.ts`); role tags removed.
- Listening / Connecting / Designing are the stage's three scenes: `lib/about-layouts.ts` (glass layouts + matching guide drawing), `lib/about-driver.ts` (timer, hover/focus/tap to hold a verb, tells the glass where the stage is), `sim.ts` (blends the layouts). Section is `100svh` from 900px wide landscape up; on phones it stacks and scrolls.

## Round: unified Work cards, hero metrics, soft header, simpler About
- Work: one card per project on the left (thumbnail, year, status, title, description, "Human ↔ …" tag, "Read the case" on the active one); orbs use the right side. The right-hand case-info block now only exists on phones.
- Hero metrics (`site.metrics`): 200K+ residents reached (Digital Confidence), 4M+ residents under facility standards it shaped (FlexFit), 3 first prizes — all from the case-study stats.
- Header: gradient + masked backdrop blur, no border line. About: shorter paragraph, recognition retitled "first prizes" with event + project only, `01 / profile` chip removed.

## Overlap pass
- Automated geometry audit (text/box intersections, row spill, horizontal overflow) at 1920×1080 → 360×740. Fixes: Work header no longer reaches the first card on short screens (`.w-left top: max(26%, 15.5rem)`, shorter intro line); hero metrics moved lower and the hero glass raised/shrunk so labels no longer cross the bubbles. Cards were verified to contain their content (no spill) from 1920×1080 down to 900×700.

## Fix: preview class clash + About on short screens
- Preview only: the Work menu wrapper used the class `pl`, which the case-study process list already uses, so case-study stages stacked on each other. Renamed to `wmenu`. (The real components use `w-*` classes and were not affected.)
- About: `min-height: 100svh` instead of a fixed height, so on short/zoomed windows it grows (page scrolls) instead of clipping the quote card or recognition list; children no longer shrink.

## Round 14
- Hero: "Hi, I'm Jesing. I design products, interactions & social systems." intro; "Scroll to explore" removed.
- Nav: new SVG mark (open C ring + neon dot that steps inside on hover) replaces the "JC" text.
- Work: no pinned/scrubbed scroll; section is a plain 100svh block and the glass disperses on a time-eased in-view target (MotionRoot). Rows zoom 1.04x (thumb 1.12x) on hover.
- About: quote wrapped in real curly quotes (CSS ::before/::after on .ab-bq).

## Round 15
- Hero: one left column. Disciplines, headline, then "Hi, I'm Jesing." + the intro sentence (the separate top intro line was removed, so nothing repeats).
- Logo: a "J" (stem, hook, neon dot) set inside a "C" ring. Dot lifts on hover.
- Work: dashed "More work / Coming soon" slot (`.w-more`) under the four rows. To add a project: append it in lib/projects.ts and add a row; the glass currently has 4 orbs (components/glass/sim.ts SPREAD_*), so a fifth needs a fifth spread entry.

## Round 16
- Logo: single-stroke monogram (C that runs into a J, neon dot as the J's tittle).
- Alignment: one shared outer gutter `--gx` (globals.css) used by nav logo/menu, hero left column and metrics; hero intro now bottom-aligned with the metrics.
- Metrics labels shortened: "Residents reached", "Under its standards", "First prizes".
- Smoothness: sim runs in fixed ~8 ms substeps, slightly higher damping, softer scroll kick; Work overlays (leader lines, numerals) now update inside the WebGL frame (`frameSubs`) so they never lag the orbs, and skip work when out of view; adaptive DPR reacts faster.
- "More work": expandable card (dashed to solid on hover, + rotates, opens upward with a Get in touch link).

## Round 17
- Logo: geometric "J" nested inside a "C" (shared geometry, flat caps); a neon dot fades into the C's opening on hover.
- "More work": the "+" is replaced by a thin outward arrow that nudges on hover and flips inward when the card is open.

## Round 18
- Work: rows are no longer squeezed into a fixed-height grid. Landscape: normal flow with generous padding, flexible section height (the page just scrolls); portrait: 2x2 cards with the detail block clear of them. Leader lines and numerals are now `position: fixed` (they share the orbs' viewport coordinates, so they stay correct while the section scrolls).
- Hero on tall screens: glass in the upper half, all type below it (disciplines become one wrapping line); short landscape screens hide the disciplines list.
- Orbs: tall layout moved up/smaller; Work sub-line hidden on short portrait screens so nothing sits under the orbs.
- Checked in the preview at 1440x900, 1280x640, 1024x768, 768x1024, 390x844, 360x640: no horizontal scroll, no overlapping text in rows. Not yet checked: the real Next.js app.

## Final check (round 19)
- Static checks passed: every `.ts/.tsx` file parses, every `@/` and relative import resolves, every image path referenced in code exists in `public/`, and every imported package is in `package.json`.
- DOM audit of the HTML preview at 1920x1080, 1440x900, 1280x720, 1280x640, 1024x768, 820x1180, 768x1024, 390x844 and 360x740: no horizontal scroll, no text overlapping other text in Hero, Work, About or Contact, nothing off-screen.
- NOT done (no npm registry access in the build session): `npm install`, `next build`, `tsc`. Run `npm install && npm run build` first and fix any type error it reports.
- Remove `public/portfolio-preview.html` if you copy the preview in; it is not part of the site.

## Round 20
- Removed every decorative line between sections: the orbit ellipses/sparks layer (`TrajectoryLayer`, `lib/trajectory.ts`) and the shader's ring glow (halo strength 0), the Work leader lines and end dots (hover now lights the card, its orb and its numeral together), and the hand-drawn line image + footer rule in Contact (`public/work/site/lines.jpg` deleted).
- Contact is now just sky, type, the email button and the footer text.

## Round 21
- Restored the orbit ellipses, chrome/neon beads and ring glow around the hero cluster (`TrajectoryLayer`, `lib/trajectory.ts`, halo strength). The Work leader lines stay removed.
- Glass simulation restored to the original values (damping, scroll inertia, one step per frame). Adaptive resolution no longer reacts during the first ~2 s (dev-mode compile stalls) and never drops below 1x, which was what made blob edges jagged.
- About: identity | bio | stage on top, quote | prizes | practice below, on two shared grid rows (subgrid) so tops and bottoms line up; no more auto-margin gaps.
- Contact: the yellow "02 / contact" tag is removed.

## If it looks unstyled

Styling is Tailwind v4 compiled by PostCSS (`postcss.config.mjs` → `@tailwindcss/postcss`, entry `app/globals.css`, theme mirrored in `tailwind.config.js`). Fonts are the `@fontsource` npm packages. All of that is installed by npm, so:

1. Use Node 20.9+ (`node -v`; `.nvmrc` says 20).
2. Run from the project root: `npm install` then `npm run check` (explains anything missing).
3. Delete the `.next` folder and restart: `npm run dev`.
4. Open the site over http://localhost:3000, not by double-clicking files. `public/portfolio-preview.html` is not part of the app.
