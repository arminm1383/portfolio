import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'
import { useTransitionNavigate } from '../lib/pageTransition'

interface NavItem {
  label: string
  to?: string
}

// The current page's item is black; other live items are greyed but clickable.
// Items without a `to` don't have a page yet — they render greyed out and inert.
const ITEMS: NavItem[] = [
  { label: 'home', to: '/' },
  { label: 'about me', to: '/about' },
  { label: 'art as of late' },  // hidden for now — restore `to: '/art'` (and the /art route) to bring it back
  { label: 'playground' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const go = useTransitionNavigate()

  return (
    <nav className="navbar">
      {ITEMS.map(item => item.to ? (
        <Link
          key={item.label}
          to={item.to}
          className={`nav-item nav-item--link${pathname === item.to ? ' nav-item--current' : ''}`}
          aria-current={pathname === item.to ? 'page' : undefined}
          onClick={e => { e.preventDefault(); go(item.to!) }}
        >
          {item.label}
        </Link>
      ) : (
        <span key={item.label} className="nav-item" aria-disabled="true">
          {item.label}
        </span>
      ))}
    </nav>
  )
}
