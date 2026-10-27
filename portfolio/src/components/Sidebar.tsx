import './Sidebar.css'
import SidebarNav from './SidebarNav'
import sprites from '../assets/images/landing-sprites.gif'

interface SidebarProps {
  title: string            // pixel-font page title ("armin mohammadi", "about me"…)
  bio: React.ReactNode     // the page's description under the title
}

// Figma "Side Navbar" (v2.2 Landing 2217:58051): fixed left column with the page title, its description, the
// navbar pinned to the bottom of the text block, and the sprite gif below it. Title, bio and navbar swap with the
// page transition; the gif keeps the `pixel-sprites` class so it stays put (or glides) across routes.
export default function Sidebar({ title, bio }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-text">
        <h1 className="sidebar-title">{title}</h1>
        <div className="sidebar-bio">{bio}</div>
        <div className="sidebar-nav-slot">
          <SidebarNav />
        </div>
      </div>
      <div className="sidebar-gif">
        <div className="sidebar-gif-frame">
          <img src={sprites} alt="" className="pixel-sprites" aria-hidden draggable={false} />
        </div>
      </div>
    </aside>
  )
}
