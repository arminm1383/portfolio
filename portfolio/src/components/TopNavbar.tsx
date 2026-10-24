import { Link, useLocation } from 'react-router-dom'
import './TopNavbar.css'
import { useScrollReveal } from '../lib/useScrollReveal'
import { useTransitionNavigate } from '../lib/pageTransition'

export default function TopNavbar() {
  const visible = useScrollReveal(true)
  const { pathname } = useLocation()
  const go = useTransitionNavigate()

  const onNameClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' })
    else go('/')
  }

  return (
    <header className={`top-navbar${visible ? ' top-navbar--visible' : ''}`}>
      <Link to="/" className="top-navbar-name" onClick={onNameClick}>
        armin mohammadi
      </Link>
    </header>
  )
}
