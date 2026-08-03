import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

import navStar from '../assets/images/nav-star-green.svg'
import navPerson from '../assets/images/nav-person-green.svg'

interface NavbarProps {
  /** On the home page, these override Link navigation with scroll-based goTo() calls */
  onWork?: () => void
  onAbout?: () => void
}

export default function Navbar({ onWork, onAbout }: NavbarProps) {
  const { pathname } = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-pill">
        <div className="navbar-pill-blur" />

        {onWork ? (
          <button className="nav-tab">
            <img src={navStar} alt="" className="nav-tab-icon nav-tab-icon--star" />
            work
          </button>
        ) : (
          <Link to="/work/aura" className={`nav-tab${pathname.startsWith('/work') ? ' nav-tab--active' : ''}`}>
            <img src={navStar} alt="" className="nav-tab-icon nav-tab-icon--star" />
            work
          </Link>
        )}

        {onAbout ? (
          <button className="nav-tab">
            <img src={navPerson} alt="" className="nav-tab-icon nav-tab-icon--person" />
            about
          </button>
        ) : (
          <Link to="/about" className={`nav-tab${pathname === '/about' ? ' nav-tab--active' : ''}`}>
            <img src={navPerson} alt="" className="nav-tab-icon nav-tab-icon--person" />
            about
          </Link>
        )}

        <Link to="/playground" className={`nav-tab${pathname === '/playground' ? ' nav-tab--active' : ''}`}>
          <img src={navPerson} alt="" className="nav-tab-icon nav-tab-icon--person" />
          play
        </Link>
      </div>
    </nav>
  )
}
