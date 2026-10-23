import './About.css'
import PixelPage from '../components/PixelPage'
import PhotoCard, { type Photo } from '../components/PhotoCard'
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

// Figma About "works" — three columns (285 | 428 | 329 = 1078, gap 18)
const COLUMNS: { width: number; photos: Photo[] }[] = [
  {
    width: 285,
    photos: [
      { src: photoAnteater, caption: 'me + peter the anteater', meta: '06.2026', frame: [285, 198] },
      { src: photoFilet, caption: 'reimagining the filet-o-fish', meta: '06.2026', frame: [285, 198], crop: [102.11, 186.88, -0.02, -55.45] },
      { src: photoLucas, caption: 'the lucas museum', meta: '09.2026', frame: [281, 481], crop: [245.19, 107.23, -5.81, 0.04] },
    ],
  },
  {
    width: 428,
    photos: [
      { src: photoYosemite, caption: 'bouldering in yosemite', meta: '09.2026', frame: [428, 454.1] },
      { src: photoHuntington, caption: 'the huntington library', meta: '05.2026', frame: [428, 246], crop: [114.55, 136.85, -10.95, -14.75] },
      { src: photoJapan, caption: 'jumping in japan', meta: '01.2025', frame: [428, 138.84], crop: [103.73, 116.57, -2.29, -9.89] },
    ],
  },
  {
    width: 329,
    photos: [
      { src: photoDesignathon, caption: 'reaching the design-a-thon finals', meta: '04.2026', frame: [329, 253], crop: [101.17, 99.96, -1.26, 0] },
      { src: photoFruit, caption: 'fruit in the middle of nowhere', meta: '10.2025', frame: [326, 381], crop: [100, 114.06, 0, -14.29] },
      { src: photoMonet, caption: 'monet at the getty', meta: '09.2025', frame: [329, 253], crop: [99.97, 113.99, 0.03, -7.35] },
    ],
  },
]

registerPageImages('/about', COLUMNS.flatMap(col => col.photos.map(photo => photo.src)))

export default function About() {
  return (
    <PixelPage
      before="me"
      after="(about)"
      intro={
        <div className="about-bio">
          <p>
            From the stories 6-year old me used to doodle in my journal to the case study stories I inspire my audience to connect with, I’ve always been a story teller. This imaginative and creative side has always been innate, and it is this natural passion that made me fall in love with product design.
          </p>
          <p>
            I want my stories to not just reflect my craft but to also reflect the journeys, culture, and individuality that continues to excite me to connect with others every single day.
          </p>
        </div>
      }
    >
      <div className="about-body">
        <section className="about-photos">
          {COLUMNS.map(col => (
            <div key={col.width} className="about-photos-col" style={{ flexGrow: col.width }}>
              {col.photos.map(photo => <PhotoCard key={photo.caption} photo={photo} slotWidth={col.width} />)}
            </div>
          ))}
        </section>

        <section className="about-stats">
          <div className="about-stat">
            <p className="about-stat-label">currently studying...</p>
            <p className="about-stat-value">Business Administration &amp; Computer Science @ University of California, Irvine</p>
          </div>
          <div className="about-stat">
            <p className="about-stat-label">exploring...</p>
            <p className="about-stat-value">Design Engineering, 3D Modeling, and Brand Design</p>
          </div>
        </section>
      </div>
    </PixelPage>
  )
}
