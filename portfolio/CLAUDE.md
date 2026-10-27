# Portfolio — CLAUDE.md

Personal portfolio site. The design source of truth lives in Figma; this repo is the code implementation of those designs. The primary workflow is **Figma → code**: use the Figma MCP tools to inspect designs, then implement them here.

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Routing | React Router v7 (`BrowserRouter`) |
| Styling | Plain CSS files co-located with components/pages (no Tailwind, no CSS-in-JS) |
| Package manager | npm |

## Project Layout

```
portfolio/               ← you are here (app root)
├── .claude/
│   └── agents/
│       └── design-audit.md
├── public/              # Static assets (icons.svg, favicon-pokeball.svg, CNAME, 404.html)
├── src/
│   ├── assets/images/   # All raster/vector assets (PNG, SVG)
│   ├── components/      # Shared UI (Navbar.tsx + Navbar.css)
│   ├── pages/           # Route-level pages (Home.tsx + Home.css, About.tsx)
│   ├── App.tsx          # Router config
│   ├── App.css
│   ├── index.css        # Global reset/base (body bg only)
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

## Architecture

The portfolio uses a hybrid layout model:

- **Home page (`/`)** — the Portfolio-v4 v2.2 "Landing" frame (section `2042:156111`, frame `2217:57984`): built on `SidebarPage` (fixed left sidebar with the title, bio, navbar and sprite gif; works to its right) and no top navbar. One normal scrolling page. The old hero collage and About section are archived in `src/archive/`.
- **Case studies (`/work/:slug`)** — Each project gets its own tab/route. Format is similar to the home sub-sections but with a case-study-specific hero and content layout. Like the landing, they simply scroll: no scroll-triggered pop-in/fade-up reveals (the old `data-reveal` system was removed). Only diagram arrow-draws and stat count-ups still animate on scroll.

### Main Margins

All sections below the hero/landing frame share a consistent horizontal margin: 204px side margins around a 1240px content area, out of the 1648px-wide Figma frame (Works/About/Gallery — node `231:9275`, `679:2445`, `696:2411` in "Portfolio-v4", fileKey `Gh9WW3Dl4tQc40mRzkvwVv`). The hero section itself (`cs-hero`, `hero`) spans the full 1648px width with no horizontal padding. Node `63:69` is the "Findy Case Study" frame, not the Landing frame — don't use it as the margin source.

## Routes

| Path | Component | Status |
|---|---|---|
| `/` | `pages/Home.tsx` | Implemented (Work, Gallery & About are sections within; Gallery is a placeholder) |
| `/work/:slug` | `pages/CaseStudy.tsx` | To implement |

## Design System

Core tokens live in `:root` in `src/index.css` — use them instead of hardcoding.

### Canvas (page background)
- Source: the Figma **Background** component (`2172:2667`, first child of the Landing frame).
- Fill: `--color-canvas` = `#ffffff`.
- Plus Figma's **noise effect** (monotone `rgb(242,240,230)` @ 50%, size 0.5, density 1). CSS has no noise effect, so it is baked into `src/assets/images/canvas-noise.png` (256px tile shown at 128px → 0.5px grains). The tile is derived from Figma's 2x render of the component (`download_assets` `defaultScale: 2`): each pixel's alpha is solved from its distance from white toward the noise colour, so mean and grain match Figma's render. Regenerate it the same way if the noise spec changes.
- Painted **once, on `body`** in `index.css` so it propagates to the whole viewport. Pages (`.landing`, `.fcs-page`, `.case-study`) must stay transparent — never give a page shell its own background or a second noise layer (the noise is translucent, so stacking darkens it).
- Retired: the 25px grid-line pattern, the `#D9D9D9`/`#f7f7f7`/`#f7f7f5` page fills and the old `rgb(235,225,216)` @ 55% noise.

### Colors
- Canvas: `--color-canvas` `#ffffff` + noise (see above)
- Black: `#000` / near-black text: `rgba(0,0,0,0.65)`
- White fills: `#fff`
- Case-study accents are per project (e.g. Rocket Lawyer red `#991b1d`, Findy blue `#205dfd`)

### Typography
- **Headings**: `--font-heading` = `'Open Sans'` **Bold (700)**. This replaced `'Peace Sans'` everywhere on the landing and case studies. Exceptions kept at Regular (400) per Figma: case-study org name, research callouts, and "Up Next" headings/card titles.
- **Body / UI text**: `--font-body` = `'Open Sans'` (Regular 400, SemiBold 600 for labels/tabs). Some older rules still list `'Open Sauce Sans'` first; it is not loaded, so they render in Open Sans.
- **Pixel / identity**: `--font-pixel` = `'Pokemon Pixel'` (`src/assets/fonts/PokemonPixel.ttf` — a copy of the local `pokemon_pixel_font.ttf` with its broken `cmap` repaired so Chrome accepts it). Used for the pixel titles, top navbar, footer links and cursor labels (the side navbar switched to Open Sans).
- Google Fonts (`index.html`) loads only what rendered pages use: Open Sans 400/600/700 + 600 italic, and JetBrains Mono 500 (Rocket carousel chips). Anton, IBM Plex Mono, Tiro Tamil and the PP Kyoto faces were removed as unused.
- `'Peace Sans'` is still declared but only used by the legacy `CsTopbar` on `/alt`.

### Design Language (from Figma)
The design deliberately mimics a Figma canvas aesthetic:
- **Dashed borders** (`border: 2px dashed #000`) on cards and the tagline box
- **Corner dots** — small `8px` (hero) or `12px` (project frames) solid green (`#18671F`) squares at corners, positioned with `position: absolute`
- **Pill tags** — rounded badges with inset box-shadow stroke (`inset 0 0 0 2px rgba(0,0,0,0.5)`) instead of real borders
- **Inset box-shadow** used universally for borders so they don't affect layout dimensions
- **Frame labels** — small `"Frame 01"` captions above project cards, like Figma frame names

### Spacing / Sizing
Pixel values in CSS are **taken directly from Figma** — do not round or adjust unless necessary. Absolute positioning is the norm for hero and project sections (the layout is canvas-like, not flex-flow).

## CSS Conventions

- Each page/component owns its CSS file: `Home.css` alongside `Home.tsx`, `Navbar.css` alongside `Navbar.tsx`.
- No global utility classes — styles are scoped by component class names.
- `index.css` is kept minimal (body background only).
- Font stacks always list the custom font first, then web-safe fallbacks.
- Use `box-shadow: inset 0 0 0 Npx color` for strokes/borders that must not affect layout.
- Use `pointer-events: none` on purely decorative elements (stars ring, blur backdrop).

## Component Patterns

### Small presentational components
Stateless helpers (e.g. `CornerDots`, `AuraCard`, `FindyCard`, `MementoCard`) are defined in the same file as their page and exported only if reused elsewhere.

### Case-study design system (Figma Portfolio-v4 variables + text styles; set by the Findy case study, node `1657:154223`)
All case studies share `pages/FindyCaseStudy.css` (despite the name) — change the **base classes**, not per-page overrides, so every case study stays consistent. Tokens are in `index.css` (`--color-surface-figure`, `--color-border-figure`, `--color-text-muted/subtle`, `--color-divider`, `--color-accent-blue`, `--radius-2xs…pill`, `--shadow-raised/media`, `--leading-md/lg`, `--case-section-gap` 56, `--case-pad-y` 100, `--case-column` 900).

| Figma text style | Spec | Classes |
|---|---|---|
| Heading/Large | Open Sans Regular 32 / 44px | `.fcs-title`, `.fcs-section-heading`, `.fcs-subsection-heading` |
| Heading/Card | Regular 20 | `.rl-upnext-title`, value-prop titles |
| Heading/Up Next | Regular 32, lh 1.2, −2% | `.rl-upnext-heading` |
| Heading/Stat | Bold 24, page accent (`--case-accent`) | `.fcs-stat-num` |
| Label/Eyebrow | SemiBold 16, lh 1.2, −2%, uppercase, 50% | `.fcs-section-label`, `.fcs-tag-label`, `.fcs-card-label`, sidebar tabs/back |
| Body/Reading | Regular 16 / 32px | `.fcs-section-body`, `.fcs-role-text` |
| Body/Meta | Regular 16, lh 1.2, −2% | `.fcs-tag-value` |
| Body/Stat | Regular 16 / 28px, 75% | card body text |
| Caption/Figure | SemiBold 14, lh 1.2, −2%, 50% | `.fcs-media-card-label` |
| Label/Small | Regular 12 (75% or 50%) | `.fcs-chip`, `.fcs-stat-label` |

- **Figures** (`.fcs-media-card`): grey wash `--color-surface-figure`, 1px `--color-border-figure`, **square corners**, padding 32/24, gap 24, caption first.
- **White cards** (`.fcs-card`): surface, 1px `--color-border-subtle`, radius 8, `--shadow-raised`, padding 32/24. Stats bar (`.fcs-stats`): radius 20, `--shadow-media`.
- **Chips** (`.fcs-chip`), **dividers** (`.fcs-divider`, 2px, 20% black), **icons** (`.fcs-icon` images: Material Symbols glyphs exported from Figma as outlined SVGs `cs-icon-*.svg`, padded to their Figma text box — 24×29 or 32×38 `--lg`; export new ones the same way rather than using an icon font).
- **Rhythm**: 56px between sections and from header to first section (`.fcs-section` padding-top; the last child's margin never stacks); 16px between elements within a section; header internals gap 32.
- **Sidebar**: back link = 16px arrow (`cs-back-arrow.svg`) + "BACK"; tabs are Label/Eyebrow at 50%, active at 100%, 24px apart. Findy (the reference): one tab per labelled section, in page order; a click sets the tab active, pauses scroll-spy until `scrollend` (or wheel/touch/key), and calls native `scrollIntoView({behavior:"smooth"})`, with `scroll-margin-top` landing the section label level with BACK (y=100). Scroll-spy = last section whose top passed 35% of the viewport; the last tab once the page bottoms out.

### Top navbar (`components/TopNavbar.tsx`) — used on the landing and every case study
- Figma "Top Navbar" component `2042:155940`: fixed at x=24 / y=24, 1586×56 (right edge at 1610), padding 12px 0 — no side padding, so it starts at x=24 in line with the side navbar's text. Radius 12.
- **No fill, stroke, shadow or blur** (the Figma component still lists a background blur; it was removed on request).
- Just "armin mohammadi", left-aligned (`--font-pixel` 24px, links home via the page transition). The Poké Ball icon was removed from the Figma component (instance `2045:167854`); the favicon is still the Poké Ball (`public/favicon-pokeball.svg`).
- Scroll behaviour from `lib/useScrollReveal.ts`: shown near the top, hides on scroll-down, reveals on scroll-up.
- The landing entrance slides it down from `y: -80` (0.55s). `CsTopbar` is the legacy bar — kept, but only `/alt` uses it.

### Side navbar (`components/Navbar.tsx`)
- Figma "Side Navbar" component `2042:156000`: fixed at x=0 / y=250, vertical stack of Open Sans Regular 20px links (home, about me, art as of late, playground), padding 12px 24px (text at x=24), gap 12, no fill/stroke/shadow, backdrop blur 9.15px (Figma 18.3). Under 900px it becomes one row; under 520px the row drops to 16px / 12px gaps so it fits a 390px phone.
- Every item is 50% opacity except the current page's, which is black. Live items (home, about me, art as of late) stay clickable and nudge right 4px on hover. Items without a page yet ("playground") are inert, with no hover and no custom-cursor variant.

### Sidebar pages (`components/SidebarPage.tsx`, v2.2 layout) — Landing (`/`), About (`/about`), Art as of late (`/art`)
- Figma v2.2 (section `2042:156111`; Side Navbar component set `2227:58903`, one variant per page). `components/Sidebar.tsx` is a fixed 366px left column (auto layout: padding 72 40 72 40, gap 4): a text block that grows to fill the height (page title in `--font-pixel` 64px, bio, `SidebarNav` pinned to its bottom; never less than its content) and the sprite gif under it (244×130 box clipping a 270×144 gif, keeps the `pixel-sprites` class). A `\n` in the title is a deliberate line break ("about\nme"). Under 900px it becomes the top of the page.
- Bio per page, passed to `SidebarPage`: landing = Open Sans 12 tagline plus "current / prev" rows (pixel-font 20px label at 60% black over Open Sans 16); About and Art = Open Sans 12 paragraphs (`.sidebar-tagline`).
- `components/SidebarNav.tsx` (Figma "Navbar"): home, about me, art as of late, play; Open Sans 16 rows with a right arrow (`nav-arrow.svg`), current page (by route) 100%, others 50%; live rows nudge their arrow on hover; "play" is inert. Drop shadow 0/4 blur 4.
- Body: Figma "Main" right of the sidebar (vertical, gap 64, padding-top 72 on the landing and 116 on About/Art via `mainTop`, none below: the footer brings its own 48px): the page body (1058 wide, centred, 24px minimum gutter), the footer, always below ALL the content (never fixed or floating; Figma puts it at the bottom of the frame): it fills the remaining height, so even a short page keeps it at the window's bottom, with its links bottom-right (centred on small screens). No top navbar on these pages.
- Landing works: two equal columns of 513×317 thumbnails, 32px apart, right column padded 24px more. Order: Streets, Findy | Rocket Copilot, Memento.
- About photos: three columns 285 | 408 | 329 (flex-grow by width), gap 18, photos 20 apart, last photo of each column stretches so they end together; the old "currently studying / exploring" stat cards are gone (not in the v2.2 frame). Art row: 275 | 238 | 183 | 255, gap 36, top-aligned.
- Page transition (`lib/pageTransition.ts`): `.sidebar-title`, `.sidebar-bio`, `.sidebar-nav` and the body fade/rise in and out; the gif sits at the same spot on every page, so it simply stays.
- `PixelPage` (title row + top navbar + old side navbar) is no longer used by any page; kept for reference.

### Loading — nothing pops in (`lib/pageReady.ts`, `lib/pageAssets.ts`)
- Pages stay hidden until **every font the page uses and every `<img>` and `<video>` in it** is ready (`waitForPage`), with a 10s safety cap. A video counts as ready once its poster or first frame loads (iOS Low Power Mode never loads autoplay video). Never add `loading="lazy"` to images on these pages — the page waits for them, so lazy images would stall it.
- Pixel pages: the sprite gif shows alone for at least 0.38s, longer if loading takes longer, then content reveals. Case studies: `useRevealWhenReady()` holds the whole page (incl. top navbar) and fades it in.
- Google Fonts load from `index.html` (preconnect + stylesheet), not a CSS `@import`; `main.tsx` starts the core faces before React renders.
- Pixel pages register their images (`registerPageImages`) so the other pixel page is prefetched in idle time, and the destination starts loading during the exit animation.
- Keep assets at ≤ 2× their largest display size (case-study column 900px → 1800px wide max); opaque photos as JPEG. **Animations (gifs): always run the `gif-quality` skill** (`.claude/skills/gif-quality/`, auto-reminded by a hook in `.claude/settings.json`): 2x of the rendered box; opaque clips ship as video via `components/LoopVideo.tsx` (WebM + MP4 + first-frame poster, e.g. the landing's Streets/Memento/Rocket cards), anything needing transparency as animated WebP; ship only after its checks print `RESULT: PASS`.

### Custom cursor (`components/CustomCursor.tsx`) — work cards only
- Figma "Cursor" component set `2042:155868`: 20×20 `#fe8a09` square, radius 4; on hover expands to a 24px-tall pill with icon + `--font-pixel` 16px label: `case-study` (155px, "view case study"), `devpost` (135px), `coming-soon` (135px).
- Variants are set with `data-cursor` on work/project cards (landing works, case-study "Up Next" cards).
- Only on devices with a real mouse (`(hover: hover) and (pointer: fine)`, in both the CSS and the JS). It stays hidden until the first mousemove, and the native cursor is hidden only from then on (`html.has-custom-cursor`); touch devices keep their native cursor and never render the custom one.

### Link previews and titles
- `index.html` carries the description, Open Graph and Twitter tags (shared by every route, since crawlers don't run JS). `og:image` is `public/og-image.png` (1200x630; currently a placeholder rendered from the landing header).
- Tab titles are set per route in `App.tsx` (`RouteTitle`): "About | Armin Mohammadi" etc.

## Figma → Code Workflow

1. **Inspect** the Figma frame with `get_design_context` or `get_screenshot` to extract exact values (position, size, color, font, border-radius, opacity).
2. **Match pixels** — copy coordinates/sizes directly; don't approximate.
3. **Assets** — export images from Figma and place under `src/assets/images/`. Import them in the component and use `<img src={imported}>`.
4. **CSS file** — add styles to the co-located `.css` file. Do not create new CSS files unless creating a new page or top-level component.
5. **Fonts** — use the `--font-heading` / `--font-body` / `--font-pixel` tokens from `index.css`; they already carry the fallback stack.
6. **No new dependencies** unless the feature genuinely requires one.

## Running Locally

```bash
npm run dev      # dev server at http://localhost:5173
npm run build    # type-check + Vite production build
npm run lint     # ESLint
```

## Key Things to Avoid

- Do not introduce CSS-in-JS, Tailwind, or styling libraries — keep plain CSS.
- Do not add comments explaining what the code does; only add comments for non-obvious layout hacks or Figma-specific workarounds.
- Do not create intermediate planning/analysis files — work from conversation context.
- Do not deviate from Figma pixel values unless there is a clear technical reason (and note it inline).
