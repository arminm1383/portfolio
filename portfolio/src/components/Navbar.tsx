import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

import navIconWork  from '../assets/images/nav-icon-work.svg'
import navIconAbout from '../assets/images/nav-icon-about.svg'
import navIconResume from '../assets/images/nav-icon-resume.svg'

interface NavbarProps {
  onWork?: () => void
  onAbout?: () => void
  onResume?: () => void
  hidden?: boolean
  revealed?: boolean
}

export default function Navbar({ onWork, onAbout, onResume, hidden, revealed }: NavbarProps) {
  const { pathname } = useLocation()

  return (
    <nav className={`navbar${revealed ? ' navbar--revealed' : ''}${hidden ? ' navbar--hidden' : ''}`}>
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

        {onResume ? (
          <button className="nav-tab" onClick={onResume}>
            <img src={navIconResume} alt="" className="nav-tab-icon" width={20} height={20} />
            <span className="nav-tab-label">resume</span>
          </button>
        ) : (
          <Link to="https://www.figma.com/design/leZEBxJorC3mH2RtuKTTQN/Resume?node-id=601-2&t=vdyJ9xRD5AjN6ltP-1" className="nav-tab">
            <img src={navIconResume} alt="" className="nav-tab-icon" width={20} height={20} />
            <span className="nav-tab-label">resume</span>
          </Link>
        )}

      </div>
    </nav>
  )
}
