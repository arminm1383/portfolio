import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './CsTopbar.css'
import starSm from '../assets/images/nav-topbar-star-sm.svg'
import starLg from '../assets/images/nav-topbar-star-lg.svg'
import starMd from '../assets/images/nav-topbar-star-md.svg'
import starTexture from '../assets/images/nav-topbar-star-texture.png'

export default function CsTopbar({ showAtTop = false }: { showAtTop?: boolean }) {
  const [visible, setVisible] = useState(showAtTop)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY

    function onScroll() {
      const y = window.scrollY
      const scrollingUp = y < lastY.current
      setVisible(showAtTop ? (y <= 80 || (y > 120 && scrollingUp)) : (y > 120 && scrollingUp))
      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`cs-topbar${visible ? ' cs-topbar--visible' : ''}`}>
      <Link to="/" className="cs-topbar-name">armin mohammadi</Link>
      <div className="cs-topbar-right">
        <div className="cs-topbar-stars">
          <div className="cs-star cs-star--sm">
            <img src={starSm} alt="" className="cs-star-outline" />
            <img src={starTexture} alt="" className="cs-star-texture" />
          </div>
          <div className="cs-star cs-star--lg">
            <img src={starLg} alt="" className="cs-star-outline" />
            <img src={starTexture} alt="" className="cs-star-texture" />
          </div>
          <div className="cs-star cs-star--md">
            <img src={starMd} alt="" className="cs-star-outline" />
            <img src={starTexture} alt="" className="cs-star-texture" />
          </div>
        </div>
        <span className="cs-topbar-handle">arminLM</span>
      </div>
    </div>
  )
}
