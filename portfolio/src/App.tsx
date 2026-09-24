import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import CaseStudy from './pages/CaseStudy'
import FindyCaseStudy from './pages/FindyCaseStudy'
import AuraCaseStudy from './pages/AuraCaseStudy'
import RocketLawyerCaseStudy from './pages/RocketLawyerCaseStudy'
import CustomCursor from './components/CustomCursor'

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
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/findy" element={<FindyCaseStudy />} />
        <Route path="/work/aura" element={<AuraCaseStudy />} />
        <Route path="/work/rocket-lawyer" element={<RocketLawyerCaseStudy />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
      </Routes>
    </BrowserRouter>
  )
}

