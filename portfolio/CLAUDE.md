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
├── public/              # Static assets (icons.svg, favicon.svg)
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

- **Home page (`/`)** — Work and About content are **nested sections within the Home page** (scrollable, not separate routes). The landing/hero frame occupies the full initial viewport with no horizontal padding. Subsequent sections below the hero share a consistent horizontal margin.
- **Case studies (`/work/:slug`)** — Each project gets its own tab/route. Format is similar to the home sub-sections but with a case-study-specific hero and content layout.
- **Playground (`/playground`)** — Separate tab/route.

### Main Margins

All sections below the hero/landing frame share a consistent horizontal padding. Value: taken from Figma node `63:69` (Landing frame, Portfolio-v4). The hero section itself (`cs-hero`, `hero`) spans the full 1498px width with no horizontal padding.

## Routes

| Path | Component | Status |
|---|---|---|
| `/` | `pages/Home.tsx` | Implemented (Work & About are sections within) |
| `/work/:slug` | `pages/CaseStudy.tsx` | To implement |
| `/playground` | `pages/Playground.tsx` | Stub |

## Design System

### Colors
- Page background: `#D9D9D9` (warm grey)
- Global body background: `#F5F5F5`
- Accent / corner dots: `#18671F` (dark green)
- Black: `#000` / near-black text: `rgba(0,0,0,0.65)`
- White fills: `#fff`

### Typography
- **Display / headings**: `'Peace Sans'` with fallbacks `'Anton', Impact, sans-serif`
- **Body / UI text**: `'Open Sauce Sans'` with fallbacks `'Open Sans', system-ui, sans-serif`
- Google Fonts imports `Anton` and `Open Sans` as web-safe fallbacks via `@import` in `Home.css`

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

### Navbar
- Fixed, `z-index: 1000`, blur backdrop via a separate `div.navbar-blur` with `backdrop-filter: blur(16px)`.
- Active pill uses `--active` modifier class, determined by `useLocation().pathname`.
- Icons inverted with `filter: invert(1)` when pill is active.

## Figma → Code Workflow

1. **Inspect** the Figma frame with `get_design_context` or `get_screenshot` to extract exact values (position, size, color, font, border-radius, opacity).
2. **Match pixels** — copy coordinates/sizes directly; don't approximate.
3. **Assets** — export images from Figma and place under `src/assets/images/`. Import them in the component and use `<img src={imported}>`.
4. **CSS file** — add styles to the co-located `.css` file. Do not create new CSS files unless creating a new page or top-level component.
5. **Fonts** — custom fonts (`Peace Sans`, `Open Sauce Sans`) are loaded externally; always include the web-safe fallback stack.
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
