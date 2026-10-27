import { useLayoutEffect } from 'react'
import './SidebarPage.css'
import Sidebar from './Sidebar'
import SiteFooter from './SiteFooter'
import { runPageEntrance } from '../lib/pageTransition'

interface SidebarPageProps {
  title: string            // sidebar title
  bio: React.ReactNode     // sidebar description
  children: React.ReactNode // page body (works, photos…)
  mainTop?: number         // Main's top padding: 72 on the landing, 116 on the photo pages (Figma)
}

// Page shell for the v2.2 layout (Figma 2042:156111): the fixed sidebar on the left; to its right Figma's "Main",
// which holds the page body and the footer. Uses the same entrance/exit as PixelPage (lib/pageTransition.ts), so
// the sidebar text and body swap with the familiar fade while the sprite gif persists.
export default function SidebarPage({ title, bio, children, mainTop = 72 }: SidebarPageProps) {
  useLayoutEffect(() => runPageEntrance(), [])

  return (
    <>
      <Sidebar title={title} bio={bio} />
      <div className="sidebar-page">
        <main className="sidebar-page-main" style={{ '--main-top': `${mainTop}px` } as React.CSSProperties}>
          <div className="pixel-page-body">{children}</div>
          <SiteFooter />
        </main>
      </div>
    </>
  )
}
