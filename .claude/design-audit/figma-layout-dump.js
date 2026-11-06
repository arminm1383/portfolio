// Paste into use_figma (fileKey Gh9WW3Dl4tQc40mRzkvwVv) after replacing ROOT_ID. Read-only.
// Prints the frame's live auto-layout tree: position, size, sizing mode (FIXED/HUG/FILL), absolute children,
// and for each auto-layout frame its direction, gap, padding (top right bottom left), alignment and clipping.
// Prefer this over get_design_context, whose output can lag behind recent edits.
const ROOT_ID = '0000:0000'
const MAX_DEPTH = 6

const root = await figma.getNodeByIdAsync(ROOT_ID)
if (!root) throw new Error(`node ${ROOT_ID} not found`)
let page = root
while (page.type !== 'PAGE') page = page.parent
await figma.setCurrentPageAsync(page)

const lines = []
const walk = (n, d) => {
  if (d > MAX_DEPTH || n.visible === false) return
  const al = 'layoutMode' in n && n.layoutMode !== 'NONE'
  let line = `${'  '.repeat(d)}${n.name.slice(0, 32)} [${n.type}] ${n.id} @${Math.round(n.x)},${Math.round(n.y)} ` +
    `${+n.width.toFixed(1)}x${+n.height.toFixed(1)} ${n.layoutSizingHorizontal ?? '-'}/${n.layoutSizingVertical ?? '-'}`
  if (n.layoutPositioning === 'ABSOLUTE') line += ' ABS'
  if (n.layoutGrow) line += ' grow'
  if (al) {
    line += ` | ${n.layoutMode} gap ${n.itemSpacing} pad(${[n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft].join(' ')})` +
      ` ${n.primaryAxisAlignItems}/${n.counterAxisAlignItems}`
    if (n.layoutWrap === 'WRAP') line += ` wrap rowgap ${n.counterAxisSpacing}`
    if (n.clipsContent) line += ' clip'
    if (n.minWidth != null) line += ` minW ${n.minWidth}`
    if (n.maxWidth != null) line += ` maxW ${n.maxWidth}`
  }
  if (n.type === 'TEXT') {
    const font = n.fontName === figma.mixed ? 'mixed' : `${n.fontName.family} ${n.fontName.style}`
    const size = n.fontSize === figma.mixed ? 'mixed' : n.fontSize
    line += ` | "${n.characters.slice(0, 40)}" ${font} ${size}`
  }
  lines.push(line)
  if ('children' in n && n.type !== 'INSTANCE' && n.type !== 'TEXT') n.children.forEach(c => walk(c, d + 1))
}
walk(root, 0)
return lines.join('\n')
