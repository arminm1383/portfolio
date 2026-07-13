import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

import navStar from '../assets/images/nav-star.svg'
import navPerson from '../assets/images/nav-person.svg'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="navbar">
      {/* blur backdrop rectangle — height = pill height + 12px top + 12px bottom */}
      <div className="navbar-blur" />

      <div className="navbar-pills">
        <Link
          to="/"
          className={`nav-pill${pathname === '/' ? ' nav-pill--active' : ''}`}
        >
          armin
        </Link>

        <Link
          to="/work/aura"
          className={`nav-pill${pathname.startsWith('/work') ? ' nav-pill--active' : ''}`}
        >
          <img
            src={navStar}
            alt=""
            className="nav-pill-icon nav-pill-icon--star"
          />
          work
        </Link>

        <Link
          to="/about"
          className={`nav-pill${pathname === '/about' ? ' nav-pill--active' : ''}`}
        >
          <img
            src={navPerson}
            alt=""
            className="nav-pill-icon nav-pill-icon--person"
          />
          about
        </Link>

        <Link
          to="/playground"
          className={`nav-pill${pathname === '/playground' ? ' nav-pill--active' : ''}`}
        >
          playground
        </Link>
      </div>
    </nav>
  )
}
