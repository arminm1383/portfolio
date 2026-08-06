import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

import navStar from '../assets/images/nav-star.svg'
import navPerson from '../assets/images/nav-person.svg'
import navPaintbrush from '../assets/images/nav-paintbrush.svg'


interface NavbarProps {
  /** On the home page, these override Link navigation with scroll-based goTo() calls */
  onWork?: () => void
  onAbout?: () => void
  onGallery?: () => void
}

export default function Navbar({ onWork, onAbout, onGallery }: NavbarProps) {
  const { pathname } = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-pill">
        <div className="navbar-pill-blur" />

        {onWork ? (
          <button className="nav-tab" onClick={onWork}>
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
          <button className="nav-tab" onClick={onAbout}>
            <img src={navPerson} alt="" className="nav-tab-icon nav-tab-icon--person" />
            about
          </button>
        ) : (
          <Link to="/about" className={`nav-tab${pathname === '/about' ? ' nav-tab--active' : ''}`}>
            <img src={navPerson} alt="" className="nav-tab-icon nav-tab-icon--person" />
            about
          </Link>
        )}

        {onGallery ? (
          <button className="nav-tab" onClick={onGallery}>
            <img src={navPaintbrush} alt="" className="nav-tab-icon nav-tab-icon--paintbrush" />
            gallery
          </button>
        ) : (
          <Link to="/" className="nav-tab">
            <img src={navPaintbrush} alt="" className="nav-tab-icon nav-tab-icon--paintbrush" />
            gallery
          </Link>
        )}
      </div>
    </nav>
  )
}
