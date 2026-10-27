import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Art from './pages/Art'
import HomeAlt from './pages/HomeAlt'
import CaseStudy from './pages/CaseStudy'
import FindyCaseStudy from './pages/FindyCaseStudy'
import AuraCaseStudy from './pages/AuraCaseStudy'
import RocketLawyerCaseStudy from './pages/RocketLawyerCaseStudy'
import CustomCursor from './components/CustomCursor'

// Per-route tab titles (link-preview tags in index.html are shared, since crawlers don't run JS)
const SITE = 'Armin Mohammadi'
const TITLES: Record<string, string> = {
  '/about': 'About',
  '/art': 'Art as of Late',
  '/work/findy': 'Findy',
  '/work/rocket-lawyer': 'Rocket Copilot',
  '/work/aura': 'Aura',
}

function RouteTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    const page = TITLES[pathname.replace(/\/+$/, '') || '/']
    document.title = page ? `${page} | ${SITE}` : SITE
  }, [pathname])
  return null
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouteTitle />
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/art" element={<Art />} />
        <Route path="/alt" element={<HomeAlt />} />
        <Route path="/work/findy" element={<FindyCaseStudy />} />
        <Route path="/work/aura" element={<AuraCaseStudy />} />
        <Route path="/work/rocket-lawyer" element={<RocketLawyerCaseStudy />} />
        {/* Streets is coming soon — restore <StreetsCaseStudy /> here (and the links) when it ships */}
        <Route path="/work/streets" element={<Navigate to="/" replace />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
      </Routes>
    </BrowserRouter>
  )
}

