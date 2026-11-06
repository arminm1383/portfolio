// Hook: make sure the gif-quality skill runs whenever gifs are involved.
//   UserPromptSubmit — the prompt mentions a gif / animation        → inject "run the skill" (every time)
//   PostToolUse      — a tool call touched a .gif/.webp or gifsicle → inject the reminder (once per session)
// Prints nothing (no-op) when gifs aren't involved or the call is the skill's own scripts.
const fs = require('fs')
const os = require('os')
const path = require('path')

const PROMPT_RE = /\bgifs?\b|\banimat(ed|ion|ions)\b|\.webp\b/i
const TOOL_RE = /\.(gif|webp)\b|gifsicle/i
const MESSAGE = 'Gifs are involved: invoke the `gif-quality` skill (Skill tool) and follow it as a subroutine — '
  + 'export from Figma at 2x via download_assets defaultScale 2, encode to 2x animated WebP, and get RESULT: PASS '
  + 'from verify_animated.py and audit_page.cjs before applying or reporting the asset.'

let input = ''
process.stdin.on('data', d => { input += d })
process.stdin.on('end', () => {
  let event
  try { event = JSON.parse(input) } catch { return }

  if (event.hook_event_name === 'UserPromptSubmit') {
    if (PROMPT_RE.test(event.prompt || '')) process.stdout.write(MESSAGE + '\n')
    return
  }

  if (event.hook_event_name === 'PostToolUse') {
    const touched = JSON.stringify(event.tool_input || {})
    if (!TOOL_RE.test(touched) || touched.includes('skills/gif-quality')) return
    const marker = path.join(os.tmpdir(), `gif-quality-reminded-${event.session_id || 'x'}`)
    if (fs.existsSync(marker)) return
    try { fs.writeFileSync(marker, '') } catch { /* reminder still goes out */ }
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: MESSAGE },
    }))
  }
})
