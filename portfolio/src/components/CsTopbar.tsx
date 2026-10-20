import { Link } from 'react-router-dom'
import './CsTopbar.css'
import { useScrollReveal } from '../lib/useScrollReveal'
import starSm from '../assets/images/nav-topbar-star-sm.svg'
import starLg from '../assets/images/nav-topbar-star-lg.svg'
import starMd from '../assets/images/nav-topbar-star-md.svg'
import starTexture from '../assets/images/nav-topbar-star-texture.png'

export default function CsTopbar({
  showAtTop = false,
  visible: visibleProp,
  onNameClick,
}: {
  showAtTop?: boolean
  visible?: boolean
  onNameClick?: () => void
}) {
  const scrollVisible = useScrollReveal(showAtTop)
  const visible = visibleProp !== undefined ? visibleProp : scrollVisible

  return (
    <div className={`cs-topbar${visible ? ' cs-topbar--visible' : ''}`}>
      <Link to="/" className="cs-topbar-name" onClick={onNameClick}>armin mohammadi</Link>
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
        {/* <span className="cs-topbar-handle">amLM</span> */}
      </div>
    </div>
  )
}
