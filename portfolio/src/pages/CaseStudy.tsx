import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './CaseStudy.css'

import auraBg from '../assets/images/aura-bg.png'
import auraMockup from '../assets/images/aura-mockup.png'
import findyBg from '../assets/images/findy-bg.png'
import findyMockup from '../assets/images/findy-mockup.png'
import mementoArtwork from '../assets/images/memento-artwork.png'

type Project = {
  title: string
  role: string
  year: string
  desc: string
  heroImg: string
  heroAlt: string
  accent: string
}

const projects: Record<string, Project> = {
  aura: {
    title: 'Aura',
    role: 'Product Designer',
    year: '2024',
    desc: '0→1 cross-functional collaboration building a new kind of social media experience',
    heroImg: auraBg,
    heroAlt: 'Aura hero',
    accent: '#E8D5C4',
  },
  findy: {
    title: 'Findy',
    role: 'Product Designer',
    year: '2024',
    desc: 'Addressing gaps in iOS accessible to propose a tailored solution for elderly users emphasising confidence and empowerment.',
    heroImg: findyBg,
    heroAlt: 'Findy hero',
    accent: '#C4D5E8',
  },
  memento: {
    title: 'Memento',
    role: 'Product Designer',
    year: '2024',
    desc: 'An immersive memory experience transcending standard interfaces, all put together in 48 hours.',
    heroImg: mementoArtwork,
    heroAlt: 'Memento hero',
    accent: '#D5E8C4',
  },
}

const mockups: Record<string, string | null> = {
  aura: auraMockup,
  findy: findyMockup,
  memento: null,
}

export default function CaseStudy() {
  const { slug = '' } = useParams<{ slug: string }>()
  const project = projects[slug]

  if (!project) {
    return (
      <div className="case-study">
        <Navbar />
        <div className="cs-not-found">
          <p>Case study not found.</p>
        </div>
      </div>
    )
  }

  const mockup = mockups[slug]

  return (
    <div className="case-study">
      <Navbar />

      {/* Hero — full-width, no horizontal padding, matches Figma Title frame 1498×900px */}
      <section className="cs-hero" style={{ background: project.accent }}>
        <img className="cs-hero-bg" src={project.heroImg} alt="" />
        {mockup && <img className="cs-hero-mockup" src={mockup} alt={project.heroAlt} />}
        <div className="cs-hero-label">
          <span className="cs-frame-label">Frame 01</span>
          <h1 className="cs-hero-title">{project.title}</h1>
          <p className="cs-hero-role">{project.role}&nbsp;• {project.year}</p>
        </div>
        <div className="cs-corner-dot tl" />
        <div className="cs-corner-dot tr" />
        <div className="cs-corner-dot bl" />
        <div className="cs-corner-dot br" />
      </section>

      {/* Content sections — consistent 94px horizontal margin, 52px gap between sections */}
      <section className="cs-section cs-overview">
        <div className="cs-section-inner">
          <h2 className="cs-section-heading">Overview</h2>
          <p className="cs-section-body">{project.desc}</p>
        </div>
      </section>

      <section className="cs-section cs-process">
        <div className="cs-section-inner">
          <h2 className="cs-section-heading">Process</h2>
          <p className="cs-section-body">Design process content coming soon.</p>
        </div>
      </section>

      <section className="cs-section cs-outcome">
        <div className="cs-section-inner">
          <h2 className="cs-section-heading">Outcome</h2>
          <p className="cs-section-body">Final outcomes and results coming soon.</p>
        </div>
      </section>
    </div>
  )
}
