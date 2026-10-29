import { useLayoutEffect, useRef, useState } from 'react'
import './PhotoCard.css'
import AskAmLM from './AskAmLM'
import { useAmLM } from '../lib/amlm'

export interface Photo {
  id?: string                    // arminLM graphic id (worker/src/graphicContext.ts); makes the photo selectable
  src: string
  caption: string
  meta: string                   // right-aligned caption text (date, medium…)
  frame: [number, number]        // Figma frame w × h (px); the frame always spans its column/slot
  focus?: string                 // object-position for the cover crop, matching Figma's framing (default: center)
  fit?: 'cover' | 'contain'      // default: cover
}

// Space the tag and popup need beside a photo: 47 gap + the widest popup (240) + a page margin
const ANCHOR_ROOM = 47 + 240 + 24

// Photo + caption card shared by the About and Art pages. With an `id` inside an <AmLMProvider> it is selectable:
// clicking it draws the dashed orange outline and shows the arminLM tag.
export default function PhotoCard({ photo }: { photo: Photo }) {
  const [w, h] = photo.frame
  const lm = useAmLM()
  const ref = useRef<HTMLElement>(null)
  const askable = !!(photo.id && lm)
  const selected = askable && lm.selected === photo.id
  const [side, setSide] = useState<'left' | 'right'>('right')

  // Put the tag on whichever side of the photo has room in the viewport
  useLayoutEffect(() => {
    if (!selected || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    setSide(window.innerWidth - r.right >= ANCHOR_ROOM ? 'right' : 'left')
  }, [selected])

  const toggle = (e: React.SyntheticEvent) => { e.stopPropagation(); if (photo.id) lm?.select(photo.id) }

  return (
    <figure
      ref={ref}
      className={`photo-card${askable ? ' is-askable' : ''}${selected ? ' is-selected' : ''}`}
      {...(askable ? {
        role: 'button', tabIndex: 0, 'aria-pressed': selected, 'aria-label': `Ask arminLM about ${photo.caption}`,
        onClick: toggle,
        // Only the photo itself reacts: typing in the popup (a descendant) must not toggle the selection
        onKeyDown: (e: React.KeyboardEvent) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggle(e) } },
      } : {})}
    >
      <div className="photo-card-media">
        <div className="photo-card-frame" style={{ aspectRatio: `${w} / ${h}` }}>
          <img
            src={photo.src}
            alt={photo.caption}
            decoding="async"
            draggable={false}
            className={`photo-card-${photo.fit ?? 'cover'}`}
            style={photo.focus ? { objectPosition: photo.focus } : undefined}
          />
        </div>
        {selected && (
          <svg className="ask-lm-outline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <rect x="0" y="0" width="100" height="100" fill="none" stroke="#fe8a09" strokeOpacity="0.85" strokeWidth="2"
              strokeDasharray="8 8" vectorEffect="non-scaling-stroke" />
          </svg>
        )}
        {selected && photo.id && <AskAmLM graphicId={photo.id} side={side} />}
      </div>
      <figcaption className="photo-card-caption">
        <span>{photo.caption}</span>
        <span className="photo-card-meta">{photo.meta}</span>
      </figcaption>
    </figure>
  )
}
