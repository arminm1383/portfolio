import { Link, useLocation } from 'react-router-dom'
import './SidebarNav.css'
import { useTransitionNavigate } from '../lib/pageTransition'
import navArrow from '../assets/images/nav-arrow.svg'

interface NavItem {
  label: string
  to?: string
}

// Figma "Navbar" component set (2227:457): one variant per page, the current page's row at full opacity.
// Items without a `to` don't have a page yet: greyed out and inert.
const ITEMS: NavItem[] = [
  { label: 'work', to: '/' },
  { label: 'about me', to: '/about' },
  { label: 'art as of late', to: '/art' },
  { label: 'play' },
]

export default function SidebarNav() {
  const { pathname } = useLocation()
  const go = useTransitionNavigate()

  return (
    <nav className="sidebar-nav">
      {ITEMS.map(item => {
        const current = pathname === item.to
        const content = (
          <>
            <span className="sidebar-nav-label">{item.label}</span>
            <img src={navArrow} alt="" className="sidebar-nav-arrow" aria-hidden draggable={false} />
          </>
        )
        return item.to ? (
          <Link
            key={item.label}
            to={item.to}
            className={`sidebar-nav-item sidebar-nav-item--link${current ? ' sidebar-nav-item--current' : ''}`}
            aria-current={current ? 'page' : undefined}
            onClick={e => { e.preventDefault(); go(item.to!) }}
          >
            {content}
          </Link>
        ) : (
          <span key={item.label} className="sidebar-nav-item" aria-disabled="true">{content}</span>
        )
      })}
    </nav>
  )
}
