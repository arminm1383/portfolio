import { forwardRef, useCallback } from 'react'

export interface LoopVideoSource {
  webm: string    // VP9, tried first (smallest)
  mp4: string     // H.264 fallback (Safari / iOS)
  poster: string  // first frame, shown until playback starts (and instead of it in iOS Low Power Mode)
}

interface LoopVideoProps {
  src: LoopVideoSource
  label?: string  // accessible name, like an <img> alt
  className?: string
  style?: React.CSSProperties
}

// Silent looping clip that stands in for a heavy GIF. React sets `muted` only as a property, but iOS needs
// the attribute present before it will autoplay inline, so it is set on the element directly.
const LoopVideo = forwardRef<HTMLVideoElement, LoopVideoProps>(function LoopVideo({ src, label, className, style }, ref) {
  const setRef = useCallback((el: HTMLVideoElement | null) => {
    if (el) {
      el.muted = true
      el.setAttribute('muted', '')
      el.play().catch(() => {}) // autoplay refused: the poster stays up
    }
    if (typeof ref === 'function') ref(el)
    else if (ref) ref.current = el
  }, [ref])

  return (
    <video
      ref={setRef}
      className={className}
      style={style}
      poster={src.poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <source src={src.webm} type="video/webm" />
      <source src={src.mp4} type="video/mp4" />
    </video>
  )
})

export default LoopVideo
