import './PhotoCard.css'

export interface Photo {
  src: string
  caption: string
  meta: string                                    // right-aligned caption text (date, medium…)
  frame: [number, number]                         // Figma frame w × h (px)
  crop?: [number, number, number, number]         // Figma image crop: w%, h%, left%, top%
  fit?: 'cover' | 'contain'                       // used when there's no crop (default: cover)
}

// Photo + caption card shared by the About and Art pages. `slotWidth` is the width (in Figma px) of the
// column/slot the card sits in; frames narrower than their slot (Figma's 281 in a 285 column) stay inset.
export default function PhotoCard({ photo, slotWidth = photo.frame[0] }: { photo: Photo; slotWidth?: number }) {
  const [w, h] = photo.frame
  const imgStyle: React.CSSProperties | undefined = photo.crop && {
    position: 'absolute',
    width: `${photo.crop[0]}%`,
    height: `${photo.crop[1]}%`,
    left: `${photo.crop[2]}%`,
    top: `${photo.crop[3]}%`,
    maxWidth: 'none',
  }

  return (
    <figure className="photo-card">
      <div className="photo-card-frame" style={{ width: `${(w / slotWidth) * 100}%`, aspectRatio: `${w} / ${h}` }}>
        <img
          src={photo.src}
          alt={photo.caption}
          decoding="async"
          className={photo.crop ? undefined : `photo-card-${photo.fit ?? 'cover'}`}
          style={imgStyle}
        />
      </div>
      <figcaption className="photo-card-caption">
        <span>{photo.caption}</span>
        <span className="photo-card-meta">{photo.meta}</span>
      </figcaption>
    </figure>
  )
}
