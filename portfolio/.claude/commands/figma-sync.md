Sync a Figma frame or component into code for Armin Mohammadi's portfolio.

$ARGUMENTS should be a Figma URL or frame/node name.

## Steps

1. **Fetch the design** — call `get_design_context` on $ARGUMENTS. If pixel values
   are ambiguous, also call `get_screenshot` to visually confirm layout.

2. **Determine the target file** — use this rule:
   - Full page frame (Home, About, Work, etc.) → `src/pages/<PageName>.tsx` + `src/pages/<PageName>.css`
   - Reusable UI piece (Navbar, card, tag, etc.) → `src/components/<Name>.tsx` + `src/components/<Name>.css`
   - If the file already exists, edit it; do not create a duplicate.

3. **Implement the component** — follow these conventions exactly:
   - **No Tailwind, no CSS-in-JS** — all styles go in the co-located `.css` file
   - **Plain CSS class names** — scoped to the component (e.g. `.aura-card`, `.navbar-pills`)
   - **Borders as inset box-shadow** — `box-shadow: inset 0 0 0 2px color` so they don't affect layout
   - **Dashed borders** — `border: 2px dashed #000` on cards and tagline boxes
   - **Corner dots** — `8px` (hero) or `12px` (frames) solid `#18671F` squares, `position: absolute`
   - **Pill tags** — `border-radius: 9999px`, inset stroke, white background
   - **Fonts** — `'Peace Sans', 'Anton', Impact, sans-serif` for display; `'Open Sauce Sans', 'Open Sans', system-ui, sans-serif` for body/UI
   - **Pixel values** — copy directly from Figma; do not round or approximate
   - **Absolute positioning** — used for canvas-like hero and project sections; match Figma x/y exactly
   - **Assets** — images go in `src/assets/images/`; import them at the top of the `.tsx` file and reference via `<img src={imported}>`
   - **No comments** unless the value is a non-obvious Figma workaround

4. **Small stateless helpers** (e.g. `CornerDots`, individual card components) should
   be defined in the same file as their parent page and not exported unless reused elsewhere.

5. **Run type-check** — after writing all files, run:
   ```
   npx tsc --noEmit
   ```
   Fix any errors before finishing.

6. **Report back** — state which files were created or modified and list any Figma
   values that were unclear or required manual judgment.
