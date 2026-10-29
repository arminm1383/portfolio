import './About.css'
import SidebarPage from '../components/SidebarPage'
import PhotoCard, { type Photo } from '../components/PhotoCard'
import { AmLMProvider } from '../components/AskAmLM'
import { registerPageImages } from '../lib/pageAssets'

import photoAnteater    from '../assets/images/about-photo-anteater.jpg'
import photoFilet       from '../assets/images/about-photo-filet.jpg'
import photoLucas       from '../assets/images/about-photo-lucas.jpg'
import photoYosemite    from '../assets/images/about-photo-yosemite.jpg'
import photoHuntington  from '../assets/images/about-photo-huntington.jpg'
import photoJapan       from '../assets/images/about-photo-japan.jpg'
import photoDesignathon from '../assets/images/about-photo-designathon.jpg'
import photoFruit       from '../assets/images/about-photo-fruit.jpg'
import photoMonet       from '../assets/images/about-photo-monet.jpg'

// Figma v2.2 About "Photos" (2227:237) — three columns (285 | 408 | 329 = 1058, gap 18). Every frame spans its column;
// `focus` keeps each Figma crop's framing under object-fit: cover.
const COLUMNS: { width: number; photos: Photo[] }[] = [
  {
    width: 285,
    photos: [
      { id: 'about-anteater', src: photoAnteater, caption: 'me + peter the anteater', meta: '06.2026', frame: [285, 198] },
      { id: 'about-filet', src: photoFilet, caption: 'reimagining the filet-o-fish', meta: '06.2026', frame: [285, 198], focus: '0% 64%' },
      { id: 'about-lucas', src: photoLucas, caption: 'the lucas museum', meta: '09.2026', frame: [285, 487.85], focus: '4% 0%' },
    ],
  },
  {
    width: 408,
    photos: [
      { id: 'about-yosemite', src: photoYosemite, caption: 'bouldering in Yosemite', meta: '09.2026', frame: [408, 432.88] },
      { id: 'about-huntington', src: photoHuntington, caption: 'the huntington library', meta: '05.2026', frame: [408, 246], focus: '75% 40%' },
      { id: 'about-japan', src: photoJapan, caption: 'jumping in japan', meta: '01.2025', frame: [408, 190] },
    ],
  },
  {
    width: 329,
    photos: [
      { id: 'about-designathon', src: photoDesignathon, caption: 'reaching the design-a-thon finals', meta: '04.2026', frame: [329, 253], focus: '100% 0%' },
      { id: 'about-fruit', src: photoFruit, caption: 'fruit in the middle of nowhere', meta: '10.2025', frame: [329, 384.51], focus: '50% 100%' },
      { id: 'about-monet', src: photoMonet, caption: 'monet at the getty', meta: '09.2025', frame: [329, 253], focus: '50% 53%' },
    ],
  },
]

registerPageImages('/about', COLUMNS.flatMap(col => col.photos.map(photo => photo.src)))

export default function About() {
  return (
    <SidebarPage
      title={'about\nme'}
      mainTop={116}
      bio={
        <>
          <p className="sidebar-tagline">
            From the stories 6-year-old me used to doodle in my journal to the case study stories I inspire my audience to connect with, I’ve always been a storyteller. This imaginative and creative side has always been innate, and it is this natural passion that made me fall in love with product design.
          </p>
          <p className="sidebar-tagline">
            I want my stories to not just reflect my craft but to also reflect the journeys, culture, and individuality that continues to excite me to connect with others every single day.
          </p>
        </>
      }
    >
      <AmLMProvider>
      <section className="about-photos">
        {COLUMNS.map(col => (
          <div key={col.width} className="about-photos-col" style={{ flexGrow: col.width }}>
            {col.photos.map(photo => <PhotoCard key={photo.caption} photo={photo} />)}
          </div>
        ))}
      </section>
      </AmLMProvider>
    </SidebarPage>
  )
}
