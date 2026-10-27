import './PhotoCard.css'

export interface Photo {
  src: string
  caption: string
  meta: string                   // right-aligned caption text (date, medium…)
  frame: [number, number]        // Figma frame w × h (px); the frame always spans its column/slot
  focus?: string                 // object-position for the cover crop, matching Figma's framing (default: center)
  fit?: 'cover' | 'contain'      // default: cover
}

// Photo + caption card shared by the About and Art pages
export default function PhotoCard({ photo }: { photo: Photo }) {
  const [w, h] = photo.frame

  return (
    <figure className="photo-card">
      <div className="photo-card-frame" style={{ aspectRatio: `${w} / ${h}` }}>
        <img
          src={photo.src}
          alt={photo.caption}
          decoding="async"
          className={`photo-card-${photo.fit ?? 'cover'}`}
          style={photo.focus ? { objectPosition: photo.focus } : undefined}
        />
      </div>
      <figcaption className="photo-card-caption">
        <span>{photo.caption}</span>
        <span className="photo-card-meta">{photo.meta}</span>
      </figcaption>
    </figure>
  )
}
