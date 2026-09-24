import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

import navIconWork  from '../assets/images/nav-icon-work.svg'
import navIconAbout from '../assets/images/nav-icon-about.svg'


interface NavbarProps {
  onWork?: () => void
  onAbout?: () => void
  hidden?: boolean
}

export default function Navbar({ onWork, onAbout, hidden }: NavbarProps) {
  const { pathname } = useLocation()

  return (
    <nav className="navbar" style={hidden ? { opacity: 0, pointerEvents: 'none' } : undefined}>
      <div className="navbar-pill">

        {onWork ? (
          <button className="nav-tab" onClick={onWork}>
            <img src={navIconWork} alt="" className="nav-tab-icon" width={20} height={20} />
            <span className="nav-tab-label">work</span>
          </button>
        ) : (
          <Link to="/work/aura" className={`nav-tab${pathname.startsWith('/work') ? ' nav-tab--active' : ''}`}>
            <img src={navIconWork} alt="" className="nav-tab-icon" width={20} height={20} />
            <span className="nav-tab-label">work</span>
          </Link>
        )}

        {onAbout ? (
          <button className="nav-tab" onClick={onAbout}>
            <img src={navIconAbout} alt="" className="nav-tab-icon" width={20} height={20} />
            <span className="nav-tab-label">about</span>
          </button>
        ) : (
          <Link to="/" className="nav-tab">
            <img src={navIconAbout} alt="" className="nav-tab-icon" width={20} height={20} />
            <span className="nav-tab-label">about</span>
          </Link>
        )}

      </div>
    </nav>
  )
}
