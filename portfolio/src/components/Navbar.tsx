import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

import navStar from '../assets/images/nav-star.svg'
import navPerson from '../assets/images/nav-person.svg'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-pill">
        <div className="navbar-pill-blur" />

        <Link
          to="/work/aura"
          className={`nav-tab${pathname.startsWith('/work') ? ' nav-tab--active' : ''}`}
        >
          <img src={navStar} alt="" className="nav-tab-icon nav-tab-icon--star" />
          work
        </Link>

        <Link
          to="/about"
          className={`nav-tab${pathname === '/about' ? ' nav-tab--active' : ''}`}
        >
          <img src={navPerson} alt="" className="nav-tab-icon nav-tab-icon--person" />
          about
        </Link>

        <Link
          to="/playground"
          className={`nav-tab${pathname === '/playground' ? ' nav-tab--active' : ''}`}
        >
          <img src={navPerson} alt="" className="nav-tab-icon nav-tab-icon--person" />
          play
        </Link>
      </div>
    </nav>
  )
}
