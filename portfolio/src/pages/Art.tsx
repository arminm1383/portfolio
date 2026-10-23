import './Art.css'
import PixelPage from '../components/PixelPage'
import PhotoCard, { type Photo } from '../components/PhotoCard'
import { registerPageImages } from '../lib/pageAssets'

import artPoker    from '../assets/images/art-poker.jpg'
import artCasiopea from '../assets/images/art-casiopea.jpg'
import artFilm     from '../assets/images/art-film.jpg'

// Figma "art as of late" (node 2042:156223) — one row of artworks (325 | 479 | 231, gap 20)
const ARTWORKS: Photo[] = [
  { src: artPoker, caption: 'dogs playing poker', meta: 'paintings', frame: [325, 226], crop: [100, 158.29, -0.34, -24.35] },
  { src: artCasiopea, caption: 'Casiopea live in LA', meta: 'Music', frame: [479, 217], crop: [100, 100.16, 0, -0.08] },
  { src: artFilm, caption: 'You Can See Everything', meta: 'Film', frame: [231, 341], fit: 'contain' },
]

registerPageImages('/art', ARTWORKS.map(art => art.src))

export default function Art() {
  return (
    <PixelPage
      before="art"
      after="as of late"
      intro={
        <div className="art-bio">
          <p>
            I’ve always felt a deep connection to art across all mediums. Whether its the food I eat, movies I watch, or scenarios I come across, every piece of art inspires my creativity.
          </p>
          <p>
            Below is a collection of all the different pieces of art that resonated with me as of late.
          </p>
        </div>
      }
    >
      <section className="art-row">
        {ARTWORKS.map(art => (
          <div key={art.caption} className="art-row-item" style={{ flexGrow: art.frame[0] }}>
            <PhotoCard photo={art} />
          </div>
        ))}
      </section>
    </PixelPage>
  )
}
