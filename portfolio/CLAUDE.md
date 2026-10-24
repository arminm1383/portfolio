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
├── public/              # Static assets (icons.svg, CNAME, 404.html)
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

- **Home page (`/`)** — the Portfolio-v4 "Landing" frame (node `2021:85606`): pixel-font header ("hi, [sprite gif] i'm armin" + tagline), a two-column work grid, side navbar, footer links, and the top navbar. One normal scrolling page. The old hero collage and About section are archived in `src/archive/`.
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
- Fill: `--color-canvas` = `#f7f7f5` (Figma variable `color/background/canvas`).
- Plus Figma's **noise effect** (monotone `rgb(235,225,216)` @ 55%, size 0.5, density 1). CSS has no noise effect, so it is baked into `src/assets/images/canvas-noise.png` (256px tile shown at 128px → 0.5px grains), calibrated against Figma's render.
- Painted **once, on `body`** in `index.css` so it propagates to the whole viewport. Pages (`.landing`, `.fcs-page`, `.case-study`) must stay transparent — never give a page shell its own background or a second noise layer (the noise is translucent, so stacking darkens it).
- Retired: the 25px grid-line pattern and the `#D9D9D9`/`#f7f7f7` page fills.

### Colors
- Canvas: `--color-canvas` `#f7f7f5` (see above)
- Black: `#000` / near-black text: `rgba(0,0,0,0.65)`
- White fills: `#fff`
- Case-study accents are per project (e.g. Rocket Lawyer red `#991b1d`, Findy blue `#205dfd`)

### Typography
- **Headings**: `--font-heading` = `'Open Sans'` **Bold (700)**. This replaced `'Peace Sans'` everywhere on the landing and case studies. Exceptions kept at Regular (400) per Figma: case-study org name, research callouts, and "Up Next" headings/card titles.
- **Body / UI text**: `--font-body` = `'Open Sans'` (Regular 400, SemiBold 600 for labels/tabs). Some older rules still list `'Open Sauce Sans'` first; it is not loaded, so they render in Open Sans.
- **Pixel / identity**: `--font-pixel` = `'Pokemon Pixel'` (`src/assets/fonts/PokemonPixel.ttf` — a copy of the local `pokemon_pixel_font.ttf` with its broken `cmap` repaired so Chrome accepts it). Used for the landing title, top navbar, side navbar and footer links.
- Open Sans 400/600/700 is loaded globally via the Google Fonts `@import` at the top of `index.css`.
- `'Peace Sans'` is still loaded but only used by the legacy `CsTopbar`.

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
- Just "armin mohammadi", left-aligned (`--font-pixel` 24px, links home via the page transition). The Poké Ball icon and the Poké Ball favicon were removed on request; the site has no favicon (`<link rel="icon" href="data:,">` so browsers don't request `/favicon.ico`).
- Scroll behaviour from `lib/useScrollReveal.ts`: shown near the top, hides on scroll-down, reveals on scroll-up.
- The landing entrance slides it down from `y: -80` (0.55s). `CsTopbar` is the legacy bar — kept, but only `/alt` uses it.

### Side navbar (`components/Navbar.tsx`)
- Figma "Side Navbar" component `2042:156000`: fixed at x=0 / y=250, vertical stack of `--font-pixel` 24px links (home, about me, my inspo, playground), padding 12px 24px (text at x=24), gap 12, no fill/stroke/shadow, backdrop blur 9.15px (Figma 18.3).
- Every item is 50% opacity except the current page's, which is black. Live items (home → `/`, about me → `/about`) stay clickable and nudge right 4px on hover. Items without a page yet ("my inspo", "playground") are inert, with no hover and no custom-cursor variant.

### Pixel pages (`components/PixelPage.tsx`) — Landing (`/`), About (`/about`), Art as of late (`/art`)
- Shared shell: top navbar, side navbar, pixel title row ("word [sprite gif] word"), intro, body, `SiteFooter` (links + resume popup).
- Every pixel page shares one grid: Main at x=314 / y=213, 1078px wide; subtext (tagline/bio) Open Sans 20px spanning the full 1078; body 96px below the header. The gif is always at x=445 (Main +131, Figma's Art frame): the word before it sits in a fixed 1.07em slot (the width of "art") left-aligned with the body text at x=314, so every title word lines up with the body and the gif never moves. A word longer than "art" would need the slot widened (which moves the gif on every page). (If a future title ever does move the gif, the transition glides it to its new spot.)
- Photo + caption cards on About and Art use the shared `components/PhotoCard.tsx`. Work artwork (landing) and these photos use a 2px corner radius; photos lift 10px and tilt 1° on hover (like the work cards) but aren't links.
- Page transition (`lib/pageTransition.ts`, via `useTransitionNavigate`): everything except the gif fades out (top navbar slides up), the route changes, then the new page's entrance plays (0.38s gif-only moment, then content). Use it for links between pixel pages.

### Loading — nothing pops in (`lib/pageReady.ts`, `lib/pageAssets.ts`)
- Pages stay hidden until **every font the page uses and every `<img>` in it** is loaded and decoded (`waitForPage`), with a 10s safety cap. Never add `loading="lazy"` to images on these pages — the page waits for them, so lazy images would stall it.
- Pixel pages: the sprite gif shows alone for at least 0.38s, longer if loading takes longer, then content reveals. Case studies: `useRevealWhenReady()` holds the whole page (incl. top navbar) and fades it in.
- Google Fonts load from `index.html` (preconnect + stylesheet), not a CSS `@import`; `main.tsx` starts the core faces before React renders.
- Pixel pages register their images (`registerPageImages`) so the other pixel page is prefetched in idle time, and the destination starts loading during the exit animation.
- Keep assets at ≤ 2× their largest display size (case-study column 900px → 1800px wide max); opaque photos as JPEG. Figma gif exports are huge (10–95 MB). Export animations at **2× display width** (anything less looks soft on retina) as **animated WebP** (Pillow, quality ~80–85, alpha kept: phone mockups have transparent corners); GIF palettes band on gradients/wallpapers and heavy `--lossy` looks low-quality. Halve the frame rate (summing delays) for long clips to stay under ~7 MB each.

### Custom cursor (`components/CustomCursor.tsx`) — work cards only
- Figma "Cursor" component set `2042:155868`: 20×20 `#fe8a09` square, radius 4; on hover expands to a 24px-tall pill with icon + `--font-pixel` 16px label: `case-study` (155px, "view case study"), `devpost` (135px), `coming-soon` (135px).
- Variants are set with `data-cursor` and are only used on work/project cards (landing works, case-study "Up Next" cards).

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
