import { useCallback, useEffect, useMemo, useState } from 'react'
import './AskAmLM.css'
import starSm from '../assets/images/nav-topbar-star-sm.svg'
import starLg from '../assets/images/nav-topbar-star-lg.svg'
import starMd from '../assets/images/nav-topbar-star-md.svg'
import starTex from '../assets/images/nav-topbar-star-texture.png'
import { AmLMContext, useAmLM } from '../lib/amlm'

// arminLM backend: a Cloudflare Worker that holds the Anthropic key server-side (see worker/README.md).
// Set VITE_ARMINLM_ENDPOINT in .env.local, or replace the fallback with the deployed Worker URL.
const ARMINLM_ENDPOINT =
  import.meta.env.VITE_ARMINLM_ENDPOINT || 'https://arminlm.YOUR-SUBDOMAIN.workers.dev'

export function AmLMProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [popupOpen, setPopupOpen] = useState(false)

  const clear = useCallback(() => { setSelected(null); setPopupOpen(false) }, [])
  const select = useCallback((id: string) => {
    setPopupOpen(false)
    setSelected(prev => (prev === id ? null : id))
  }, [])
  const toggleTag = useCallback(() => setPopupOpen(p => !p), [])

  // Clicking anywhere that isn't a photo, its tag or its popup (those stop propagation) deselects; so does Escape
  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') clear() }
    document.addEventListener('click', clear)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', clear)
      document.removeEventListener('keydown', onKey)
    }
  }, [selected, clear])

  const value = useMemo(() => ({ selected, popupOpen, select, toggleTag }), [selected, popupOpen, select, toggleTag])
  return <AmLMContext.Provider value={value}>{children}</AmLMContext.Provider>
}

// Figma "AI Tag": a 20×20 orange square holding three sparkles
function Tag({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <button type="button" className="ask-lm-tag" onClick={onClick} aria-label="Ask arminLM about this">
      <span className="ask-lm-tag-stars">
        {[['sm', starSm], ['lg', starLg], ['md', starMd]].map(([size, src]) => (
          <span key={size} className={`ask-lm-tag-star ask-lm-tag-star--${size}`}>
            <img src={src} alt="" />
            <img src={starTex} alt="" className="ask-lm-star-tex" />
          </span>
        ))}
      </span>
    </button>
  )
}

// Figma "AI Popup": "ask amLM" in the pixel font with an orange send button. Mounted per selected photo, so
// switching photos starts a fresh conversation.
function Popup({ graphicId }: { graphicId: string }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ask = async () => {
    const q = question.trim()
    if (!q || loading) return
    setLoading(true); setError(''); setAnswer('')
    try {
      const res = await fetch(ARMINLM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ graphicId, question: q }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Request failed')
      setAnswer((data.answer as string) || '')
    } catch {
      setError('arminLM is offline right now, try again later.')
    } finally {
      setLoading(false)
    }
  }

  const hasReply = loading || answer || error

  return (
    <div className={`ask-lm-popup${hasReply ? ' has-reply' : ''}`} onClick={e => e.stopPropagation()}>
      <div className="ask-lm-popup-row">
        <input
          className="ask-lm-popup-input"
          type="text"
          placeholder="ask amLM"
          aria-label="Ask arminLM"
          value={question}
          maxLength={500}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); ask() } }}
          autoFocus
        />
        <button type="button" className="ask-lm-popup-send" aria-label="Send" disabled={loading} onClick={ask}>
          <svg width="8" height="8" viewBox="4 4 8 8" aria-hidden><path d="M4 8L4.705 8.705L7.5 5.915V12H8.5V5.915L11.29 8.71L12 8L8 4L4 8Z" fill="#fff" /></svg>
        </button>
      </div>
      {hasReply && (
        <div className={`ask-lm-popup-answer${error ? ' is-error' : ''}`}>
          {loading ? 'thinking…' : error || answer}
        </div>
      )}
    </div>
  )
}

// The tag and popup, 47px beside the selected photo (Figma 2207:17); `side` flips them to the left edge when the
// right side of the viewport has no room
export default function AskAmLM({ graphicId, side }: { graphicId: string; side: 'left' | 'right' }) {
  const lm = useAmLM()
  if (!lm) return null
  return (
    <div className={`ask-lm-anchor ask-lm-anchor--${side}`} onClick={e => e.stopPropagation()}>
      <Tag onClick={e => { e.stopPropagation(); lm.toggleTag() }} />
      {lm.popupOpen && <Popup graphicId={graphicId} />}
    </div>
  )
}
