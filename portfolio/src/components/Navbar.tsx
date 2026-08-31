import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

import navStar from '../assets/images/nav-star.svg'
import navPerson from '../assets/images/nav-person.svg'
import navPaintbrush from '../assets/images/nav-paintbrush.svg'


interface NavbarProps {
  /** On the home page, these override Link navigation with scroll-based goTo() calls */
  onWork?: () => void
  onAbout?: () => void
  onResume?: () => void
}

export default function Navbar({ onWork, onAbout, onResume }: NavbarProps) {
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
          <Link to="/" className="nav-tab">
            <img src={navPerson} alt="" className="nav-tab-icon nav-tab-icon--person" />
            about
          </Link>
        )}

        {onResume ? (
          <button className="nav-tab" onClick={onResume}>
            <img src={navPaintbrush} alt="" className="nav-tab-icon nav-tab-icon--paintbrush" />
            resume
          </button>
        ) : (
          <Link to="/" className="nav-tab">
            <img src={navPaintbrush} alt="" className="nav-tab-icon nav-tab-icon--paintbrush" />
            resume
          </Link>
        )}
      </div>
    </nav>
  )
}
