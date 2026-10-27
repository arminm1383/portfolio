import './Art.css'
import SidebarPage from '../components/SidebarPage'
import PhotoCard, { type Photo } from '../components/PhotoCard'
import { registerPageImages } from '../lib/pageAssets'

import artNoOtherChoice from '../assets/images/art-no-other-choice.jpg'
import artOnGuitar      from '../assets/images/art-on-guitar.jpg'
import artStrawberry    from '../assets/images/art-strawberry-fennel.jpg'
import artMonet         from '../assets/images/art-monet.jpg'

// Figma v2.2 Art row (2227:401): four artworks spanning the full 1058 (275 | 238 | 183 | 255, gap 36),
// top-aligned. Figma's crops are baked into the image files.
const ARTWORKS: Photo[] = [
  { src: artNoOtherChoice, caption: 'no other choice', meta: 'film', frame: [275, 392.86] },
  { src: artOnGuitar, caption: 'on guitar', meta: 'album', frame: [238, 241] },
  { src: artStrawberry, caption: 'strawberry + fennel', meta: 'food', frame: [183, 181.05] },
  { src: artMonet, caption: 'monet', meta: 'museum', frame: [255, 340] },
]

registerPageImages('/art', ARTWORKS.map(art => art.src))

export default function Art() {
  return (
    <SidebarPage
      title={'art as of\nlate'}
      mainTop={116}
      bio={
        <>
          <p className="sidebar-tagline">
            I’ve always felt a deep connection to art across all mediums. Whether it’s the food I eat, movies I watch, or scenarios I come across, every piece of art inspires my creativity.
          </p>
          <p className="sidebar-tagline">
            Below is a collection of all the different pieces of art that resonated with me as of late.
          </p>
        </>
      }
    >
      <section className="art-row">
        {ARTWORKS.map(art => (
          <div key={art.caption} className="art-row-item" style={{ flexGrow: art.frame[0] }}>
            <PhotoCard photo={art} />
          </div>
        ))}
      </section>
    </SidebarPage>
  )
}
