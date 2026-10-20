import { useState } from 'react'
import './SiteFooter.css'

const RESUME_URL = 'https://www.figma.com/design/leZEBxJorC3mH2RtuKTTQN/Resume?node-id=601-2&t=vdyJ9xRD5AjN6ltP-1'
const RESUME_EMBED_URL = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(RESUME_URL)}`
const LINKEDIN_URL = 'https://www.linkedin.com/in/arminmoh'
const EMAIL = 'arminmohammadi1342@gmail.com'
const X_URL = ''

export default function SiteFooter() {
  const [resumeOpen, setResumeOpen] = useState(false)

  return (
    <>
      <footer className="site-footer">
        <nav className="site-footer-links">
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="site-footer-link">LinkedIn</a>
          <a href={`mailto:${EMAIL}`} className="site-footer-link">Email</a>
          {X_URL ? (
            <a href={X_URL} target="_blank" rel="noreferrer" className="site-footer-link">X</a>
          ) : (
            <span className="site-footer-link">X</span>
          )}
          <button type="button" className="site-footer-link" onClick={() => setResumeOpen(true)}>Resume</button>
        </nav>
      </footer>

      {resumeOpen && (
        <div className="resume-modal-overlay" onClick={() => setResumeOpen(false)}>
          <div className="resume-modal" onClick={e => e.stopPropagation()}>
            <button className="resume-modal-close" onClick={() => setResumeOpen(false)} aria-label="Close resume">✕</button>
            <iframe className="resume-modal-frame" src={RESUME_EMBED_URL} allowFullScreen title="Resume" />
          </div>
        </div>
      )}
    </>
  )
}
