import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import './StreetsDemo.css'
import logo from '../assets/images/org-streets.png'
import mapImage from '../assets/images/streets-demo-map.jpg'

// Interactive recreation of the Streets enterprise search screen (Figma "Search" frame 2187:23523), shown after a
// search has already been entered. Nothing here computes anything: it is panels, toggles, lists and static updates.
//
// The UI is laid out on a fixed 1616×1160 canvas (the screenshots' 2x coordinates) and scaled to the width of its
// container, so it keeps its proportions at any size.
const W = 1616
const H = 1160
// Figma (Enterprise View) sizes are on a 1440 canvas; the demo is drawn at 1616
const u = (n: number) => Math.round((n * W) / 1440 * 10) / 10

type IconName = 'search' | 'edit' | 'map' | 'doc' | 'persons' | 'bars' | 'dots' | 'database' | 'car' | 'walk' | 'tune'
  | 'left' | 'right' | 'close' | 'expand' | 'userplus' | 'users' | 'budget' | 'check' | 'clock' | 'diet' | 'rail' | 'compare'

const PATHS: Record<IconName, React.ReactNode> = {
  search: <><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5.5 5.5" /></>,
  edit: <><path d="M5 8.5V18a1.5 1.5 0 0 0 1.5 1.5H16M9 5H6.5A1.5 1.5 0 0 0 5 6.5" /><path d="M19.5 4.5l-8 8-.5 3 3-.5 8-8z" /></>,
  map: <path d="M3.5 6.5l5.5-2 6 2 5.5-2v13l-5.5 2-6-2-5.5 2zM9 4.5v13M15 6.5v13" />,
  doc: <path d="M6.5 3.5h7l4.5 4.5v12.5h-11.5zM13.5 3.5V8H18M9 12h6M9 15.5h6" />,
  persons: <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c0-3.2 2.5-5 5.5-5 1.2 0 2.2.3 3.1.8" /><circle cx="16.5" cy="16.5" r="2.8" /><path d="M18.5 18.5l2.5 2.5" /></>,
  bars: <path d="M5 20v-7M10.5 20V8M16 20v-11M21 20V4" strokeWidth="3" />,
  dots: <><circle cx="6" cy="12" r="1.2" fill="currentColor" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /><circle cx="18" cy="12" r="1.2" fill="currentColor" /></>,
  database: <path d="M4.5 6c0-1.7 3.4-3 7.5-3s7.5 1.3 7.5 3-3.4 3-7.5 3-7.5-1.3-7.5-3zM4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" fill="currentColor" stroke="none" />,
  car: <path d="M4 16.5v-4l2-5h12l2 5v4M4 16.5h16M7 16.5v2M17 16.5v2M7 12.5h10" />,
  walk: <><circle cx="13" cy="4.5" r="1.6" /><path d="M10 21l2-6-2.5-2.5 1-5 4 1.5 2 3M9.5 12.5L7 14" /></>,
  tune: <path d="M4 7h9M17 7h3M4 17h3M11 17h9M13 4.5v5M7 14.5v5" />,
  left: <path d="M15 5l-7 7 7 7" />,
  right: <path d="M9 5l7 7-7 7" />,
  close: <path d="M6 6l6 6-6 6M12 6l6 6-6 6" />,
  expand: <path d="M4 10V4h6M20 14v6h-6M4 4l6 6M20 20l-6-6" />,
  userplus: <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c0-3.2 2.5-5 5.5-5s5.5 1.8 5.5 5M18 8v6M15 11h6" /></>,
  users: <><circle cx="9" cy="8.5" r="2.8" /><circle cx="16.5" cy="9.5" r="2.2" /><path d="M3.5 18.5c0-2.8 2.2-4.5 5.5-4.5s5.5 1.7 5.5 4.5M15 14.5c2.8 0 5 1.5 5 4" /></>,
  budget: <path d="M3.5 7h17v10h-17zM3.5 10.5h17M7 14.5h3" />,
  check: <path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM8.5 12.2l2.5 2.5 4.5-5" />,
  clock: <path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM12 7.5V12l3 2" />,
  diet: <path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM9 12l2.5 2.5L16 9.5" fill="currentColor" stroke="none" />,
  rail: <path d="M4.5 5h15v14h-15zM9.5 5v14M16 9l-3 3 3 3" />,
  compare: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19c0-3 2.5-5 5.5-5M15 13h6M18 10l3 3-3 3" /></>,
}

function Ico({ name, size = 22, className = '' }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg className={`sd-ico ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {PATHS[name]}
    </svg>
  )
}

const TOOLS: { id: string; label: string; icon: IconName }[] = [
  { id: 'map', label: 'Map', icon: 'map' },
  { id: 'projects', label: 'Projects Library', icon: 'doc' },
  { id: 'personas', label: 'Persona Library', icon: 'persons' },
  { id: 'rankings', label: 'Rankings', icon: 'bars' },
]

const PROJECTS = [
  'Coffee Demographic in Irving', 'Popular Coffee Shops Near Irving', 'Coffee Demographic in Irving',
  'Coffee Consumption Trends in Irving', 'Health Benefits of Moderate Coffee Intake', 'Popular Coffee Brewing Methods Among Irving',
]
const MORE_PROJECTS = ['Weekend Brunch Spots Near Plano', 'Boutique Fitness in Frisco', 'Late-Night Dining in Deep Ellum']
// Search mode of the sidebar (Figma Sidebar Menu v3, Variant2): the Projects and Personas lists give way to Recent Searches
const RECENT = ['5040 State Hwy 121, Lewisville, TX 75056']
const MORE_RECENT = ['2201 N Central Expy, Plano, TX 75074', '8300 Preston Rd, Dallas, TX 75225']
const SIDE_PERSONAS = ['Halal Spot that is Not Spicy', 'Coffee and Quiet Place to Read']
const MORE_PERSONAS = ['Weeknight Taco Regular', 'Group Birthday Dinner']

// Search bar insets (canvas px): the results panel is 357 wide, the persona panel 417 (640 widened)
const PANEL_W = 357
const DETAIL_W = 417
const DETAIL_WIDE_W = 640
const BAR_GAP = 24
const SEARCH_QUERY = '5040 State Hwy 121, Lewisville, TX 75056'

const DISTANCES = [5, 15, 25, 50]

const PERSONA_CARDS = [
  { title: 'Museum Late Date', open: true },
  { title: 'Opening Night Scene', open: false },
  { title: 'Opening Night Scene', open: false },
  { title: 'Opening Night Scene', open: false },
]

const TRACTS = [
  { title: 'Block Group 2, Tract 31.02', sub: 'Dallas County' },
  { title: 'Block Group 7, Tract 12.00', sub: 'Collin County' },
  { title: 'Block Group 4, Tract 20.04', sub: 'Tarrant County' },
  { title: 'Block Group 1, Tract 216.53', sub: 'Denton County' },
]

const PREFERENCES: { label: string; pct: number; tone: 'good' | 'ok' | 'low' | 'none' }[] = [
  { label: 'Evening Events', pct: 99, tone: 'good' },
  { label: 'Date Nights', pct: 80, tone: 'good' },
  { label: 'Bar Onsite', pct: 75, tone: 'good' },
  { label: 'Cozy', pct: 55, tone: 'ok' },
  { label: 'Good for Kids', pct: 12, tone: 'low' },
  { label: 'Quiet', pct: 8, tone: 'low' },
]

// Persona Tags Row (Figma 343:4612): an icon beside a bold muted label over its value; Budget dims its last two $
function Meta() {
  return (
    <div className="sd-meta">
      <div><Ico name="users" size={u(12)} /><span><em>Parties</em><span>Solo</span></span></div>
      <div><Ico name="budget" size={u(12)} /><span><em>Budget</em><b>$$<i>$$</i></b></span></div>
      <div><Ico name="check" size={u(12)} /><span><em>Familiarity</em><span>Routine</span></span></div>
    </div>
  )
}

export default function StreetsDemo() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)

  // Sidebar
  const [collapsed, setCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'dashboard' | 'search'>('dashboard')
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [personasOpen, setPersonasOpen] = useState(false)
  const [created, setCreated] = useState<string[]>([])
  const [recentOpen, setRecentOpen] = useState(false)
  const [selectedRecent, setSelectedRecent] = useState<string | null>(RECENT[0])
  const sideScrollRef = useRef<HTMLDivElement>(null)

  // Left panel
  const [panelOpen, setPanelOpen] = useState(true)
  const [travel, setTravel] = useState<'drive' | 'walk'>('drive')
  const [distance, setDistance] = useState<number | null>(null)
  const [tab, setTab] = useState<'tracts' | 'personas'>('personas')
  const listRef = useRef<HTMLDivElement>(null)

  // Right panel
  const [personaOpen, setPersonaOpen] = useState(false)
  const [wide, setWide] = useState(false)
  const [added, setAdded] = useState(false)

  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const fit = () => setScale(el.clientWidth / W)
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const q = query.trim().toLowerCase()
  const allProjects = useMemo(() => [...created, ...PROJECTS, ...(projectsOpen ? MORE_PROJECTS : [])], [created, projectsOpen])
  const allPersonas = useMemo(() => [...SIDE_PERSONAS, ...(personasOpen ? MORE_PERSONAS : [])], [personasOpen])
  // Searching looks through every project and persona, including the ones behind "More"
  const projects = q ? [...created, ...PROJECTS, ...MORE_PROJECTS].filter(p => p.toLowerCase().includes(q)) : allProjects
  const personas = q ? [...SIDE_PERSONAS, ...MORE_PERSONAS].filter(p => p.toLowerCase().includes(q)) : allPersonas
  const recents = q ? [...RECENT, ...MORE_RECENT].filter(p => p.toLowerCase().includes(q)) : [...RECENT, ...(recentOpen ? MORE_RECENT : [])]
  const noResults = q !== '' && (mode === 'search' ? recents.length === 0 : projects.length === 0 && personas.length === 0)

  const newProject = () => {
    const next = created.length + 1
    const name = next === 1 ? 'Untitled Project' : `Untitled Project ${next}`
    setCreated(c => [name, ...c])
    setQuery('')
    requestAnimationFrame(() => sideScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  const pickDistance = (m: number) => setDistance(d => (d === m ? null : m))
  const openPersona = () => setPersonaOpen(o => !o)
  const closePersona = () => { setPersonaOpen(false); setWide(false) }
  const pageList = (dir: 1 | -1) => listRef.current?.scrollBy({ top: dir * 220, behavior: 'smooth' })

  return (
    <div ref={viewportRef} className="sd-viewport" style={{ height: H * scale }}>
      <div className="sd" style={{ transform: `scale(${scale})` }}>

        {/* ── Left rail ── */}
        <aside className={`sd-side${collapsed ? ' is-collapsed' : ''}`}>
          <div className="sd-brand">
            <img src={logo} alt="" draggable={false} />
            <span className="sd-lbl sd-brand-name">Streets</span>
          </div>

          <label className="sd-filesearch">
            <Ico name="search" size={u(24)} />
            <input
              className="sd-lbl"
              type="search"
              value={query}
              placeholder="File Search"
              aria-label="File search"
              onChange={e => setQuery(e.target.value)}
            />
          </label>

          <div className="sd-rule" />

          <button type="button" className="sd-newproject" onClick={newProject} aria-label="New project">
            <Ico name="edit" size={u(20)} />
            <span className="sd-lbl">New Project</span>
          </button>

          <div className="sd-segment sd-segment--rail" role="tablist">
            {(['dashboard', 'search'] as const).map(m => (
              <button key={m} type="button" role="tab" aria-selected={mode === m}
                className={mode === m ? 'is-on' : ''} onClick={() => setMode(m)}>
                {m === 'dashboard' ? 'Dashboard' : 'Search'}
              </button>
            ))}
          </div>

          <div ref={sideScrollRef} className="sd-side-scroll">
            <p className="sd-label sd-lbl">Tools</p>
            {TOOLS.map(t => (
              <div key={t.id} className="sd-tool">
                <Ico name={t.icon} size={u(20)} /><span className="sd-lbl">{t.label}</span>
              </div>
            ))}

            {mode === 'dashboard' ? (
              <>
              <p className="sd-label sd-lbl sd-label--gap">Projects</p>
              {projects.map((p, i) => (
                  <div key={`${p}-${i}`} className="sd-item sd-item--static">
                    <Ico name="doc" size={u(20)} /><span className="sd-lbl">{p}</span>
                  </div>
                ))}
              {!q && (
                <button type="button" className="sd-item sd-more" onClick={() => setProjectsOpen(o => !o)} aria-expanded={projectsOpen}>
                  <Ico name="dots" size={u(22)} /><span className="sd-lbl">{projectsOpen ? 'Less' : 'More'}</span>
                </button>
              )}

              <p className="sd-label sd-lbl sd-label--gap">Personas</p>
              {personas.map(p => (
                  <div key={p} className="sd-item sd-item--static">
                    <Ico name="persons" size={u(20)} /><span className="sd-lbl">{p}</span>
                  </div>
                ))}
              {!q && (
                <button type="button" className="sd-item sd-more" onClick={() => setPersonasOpen(o => !o)} aria-expanded={personasOpen}>
                  <Ico name="dots" size={u(22)} /><span className="sd-lbl">{personasOpen ? 'Less' : 'More'}</span>
                </button>
              )}
              </>
            ) : (
              <>
                <p className="sd-label sd-lbl sd-label--gap">Recent Searches</p>
                {recents.map(a => (
                  <button key={a} type="button" className={`sd-item${selectedRecent === a ? ' is-on' : ''}`} onClick={() => setSelectedRecent(a)}>
                    <Ico name="search" size={u(14)} className="sd-recent-ico" /><span className="sd-lbl">{a}</span>
                  </button>
                ))}
                {!q && (
                  <button type="button" className="sd-item sd-more" onClick={() => setRecentOpen(o => !o)} aria-expanded={recentOpen}>
                    <Ico name="dots" size={u(22)} /><span className="sd-lbl">{recentOpen ? 'Less' : 'More'}</span>
                  </button>
                )}
              </>
            )}
            {noResults && <p className="sd-empty sd-lbl">No files match “{query}”</p>}
          </div>
        </aside>

        {/* ── Workspace ── */}
        <section className={`sd-work${collapsed ? ' is-wide' : ''}`}>
          <img src={mapImage} alt="" className="sd-map" draggable={false} />

          <div className="sd-topbar">
            <button type="button" className="sd-topbtn" onClick={() => setCollapsed(c => !c)} aria-pressed={collapsed}
              aria-label={collapsed ? 'Expand the sidebar' : 'Collapse the sidebar'}>
              <Ico name="rail" size={u(24)} />
            </button>
            <button type="button" className="sd-topbtn" onClick={() => setPanelOpen(o => !o)} aria-pressed={!panelOpen}
              aria-label={panelOpen ? 'Hide the results panel' : 'Show the results panel'}>
              <Ico name="map" size={u(24)} />
            </button>
          </div>

          {/* Results panel */}
          <div className={`sd-panel${panelOpen ? '' : ' is-hidden'}`}>
            <p className="sd-label" style={{ top: 26 }}>Census Area</p>
            <div className="sd-census">
              <span className="sd-circle sd-circle--blue"><Ico name="database" size={u(16)} /></span>
              <div><b>Census Name of this Area</b><small>lores ipsum</small></div>
            </div>

            <p className="sd-label" style={{ top: 135 }}>Search Results for...</p>
            <div className="sd-address">
              <span className="sd-circle sd-circle--green"><Ico name="search" size={u(16)} /></span>
              <b>5040 State Hwy 121,<br />Lewisville, TX 75056</b>
            </div>

            <p className="sd-label" style={{ top: 228 }}>Filter Distance By</p>
            <div className="sd-segment sd-segment--travel" role="tablist" style={{ top: 255 }}>
              {(['drive', 'walk'] as const).map(m => (
                <button key={m} type="button" role="tab" aria-selected={travel === m}
                  className={travel === m ? 'is-on' : ''} onClick={() => setTravel(m)}>
                  <Ico name={m === 'drive' ? 'car' : 'walk'} size={u(16)} />{m === 'drive' ? 'Drive' : 'Walk'}
                </button>
              ))}
            </div>

            <div className={`sd-distance${distance ? ' has-value' : ''}`} style={{ top: 305 }}>
              <span>{distance ? `${distance} min.` : 'Enter Distance'}</span>
              <button type="button" onClick={() => setDistance(null)} aria-label="Clear the distance" disabled={!distance}>
                <Ico name="tune" size={u(14)} />
              </button>
            </div>
            <div className="sd-chips" style={{ top: 355 }}>
              {DISTANCES.map(m => (
                <button key={m} type="button" className={distance === m ? 'is-on' : ''} aria-pressed={distance === m} onClick={() => pickDistance(m)}>
                  {m} min.
                </button>
              ))}
            </div>

            <div className="sd-rule sd-rule--panel" style={{ top: 407 }} />

            <div className="sd-tabs" style={{ top: 430 }}>
              <button type="button" className={tab === 'tracts' ? 'is-on' : ''} onClick={() => setTab('tracts')}>Tracts</button>
              <button type="button" className={tab === 'personas' ? 'is-on' : ''} onClick={() => setTab('personas')}>Personas</button>
              <span className="sd-tabs-gap" />
              <button type="button" className="sd-page" onClick={() => pageList(-1)} aria-label="Scroll the list up"><Ico name="left" size={u(12)} /></button>
              <button type="button" className="sd-page" onClick={() => pageList(1)} aria-label="Scroll the list down"><Ico name="right" size={u(12)} /></button>
            </div>

            <div ref={listRef} className="sd-list" key={tab}>
              {tab === 'personas'
                ? PERSONA_CARDS.map((c, i) => c.open ? (
                    <button key={i} type="button" className={`sd-card sd-card--open${personaOpen ? ' is-on' : ''}`} onClick={openPersona} aria-pressed={personaOpen}>
                      <b>{c.title}</b><Meta />
                    </button>
                  ) : (
                    <div key={i} className="sd-card sd-card--locked" aria-disabled="true">
                      <b>{c.title}</b><Meta />
                    </div>
                  ))
                : TRACTS.map(t => (
                    <div key={t.title} className="sd-card sd-card--tract">
                      <b>{t.title}</b><span>{t.sub}</span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Static search bar (search isn't part of this demo): the query is already entered, and the bar fits the
              map space left between the results panel and the persona panel */}
          <div
            className="sd-searchbar"
            style={{
              left: panelOpen ? PANEL_W + BAR_GAP : BAR_GAP,
              right: personaOpen ? (wide ? DETAIL_WIDE_W : DETAIL_W) + BAR_GAP : BAR_GAP,
            }}
          >
            <Ico name="search" size={u(32)} />
            <span title={SEARCH_QUERY}>{SEARCH_QUERY}</span>
            <i><Ico name="right" size={u(18)} className="sd-up" /></i>
          </div>

          {/* Persona detail panel */}
          <div className={`sd-detail${personaOpen ? ' is-open' : ''}${wide ? ' is-wide' : ''}`} aria-hidden={!personaOpen}>
            <div className="sd-detail-head">
              <button type="button" onClick={closePersona} aria-label="Close the persona panel" tabIndex={personaOpen ? 0 : -1}><Ico name="close" size={u(16)} /></button>
              <button type="button" onClick={() => setWide(w => !w)} aria-pressed={wide} aria-label={wide ? 'Make the panel narrower' : 'Make the panel wider'} tabIndex={personaOpen ? 0 : -1}>
                <Ico name="expand" size={u(14)} />
              </button>
              <span />
              <span className="sd-detail-more" aria-hidden><Ico name="dots" size={u(22)} /></span>
            </div>
            <div className="sd-detail-scroll">
              <div className="sd-sec sd-sec--head">
                <h3>Museum Late Date</h3>
                <p className="sd-quote">An early-stage date at a museum’s extended evening hours, wine in hand, art doing the conversational heavy lifting.</p>
              </div>
              <div className="sd-tags">
                <span className="sd-tag sd-tag--blue">Arts &amp; Culture</span>
                <span className="sd-tag sd-tag--tan">Ages 22-25</span>
                <button type="button" className={`sd-tag sd-tag--btn${added ? ' is-on' : ''}`} onClick={() => setAdded(a => !a)} aria-pressed={added} tabIndex={personaOpen ? 0 : -1}>
                  <Ico name="userplus" size={u(16)} />{added ? 'Added to Project' : 'Add to Project'}
                </button>
              </div>

              <div className="sd-rule sd-rule--detail" />
              <div className="sd-sec">
              <h4>Key Details</h4>
              <div className="sd-kd">
                <div><span><Ico name="users" size={u(16)} />Parties</span><b>Solo</b></div>
                <div><span><Ico name="budget" size={u(16)} />Budget</span><b>$$<i>$$</i></b></div>
                <div><span><Ico name="clock" size={u(16)} />Time of Day</span><b>Evening</b></div>
                <div><span><Ico name="diet" size={u(16)} />Diet &amp; Lifestyle</span><b>No Restrictions</b></div>
                <div><span><Ico name="check" size={u(16)} />Familiarity</span><b>Routine</b></div>
              </div>
              <span className="sd-compare"><Ico name="compare" size={u(16)} />Compare with Other Personas</span>
              </div>

              <div className="sd-rule sd-rule--detail" />
              <div className="sd-sec">
              <h4>Key Stats</h4>
              <dl className="sd-stats">
                <dt>Practical</dt><dd>A date with built-in conversation material</dd>
                <dt>Social</dt><dd>Impress without trying too hard</dd>
                <dt>Emotional</dt><dd>Low-stakes romance with elevated backdrop</dd>
              </dl>
              </div>

              <div className="sd-prefs">
                <div className="sd-prefs-head"><span>Persona Preferences</span><span>Compatibility</span></div>
                {PREFERENCES.map(p => (
                  <div key={p.label} className="sd-pref"><span>{p.label}</span><em className={`sd-badge sd-badge--${p.tone}`}>{p.pct}%</em></div>
                ))}
              </div>

              <div className="sd-sec sd-sec--cards">
              <h4>Most Similar Personas</h4>
              <div className="sd-card sd-card--similar"><b>Museum Late Date</b><Meta /></div>
              <div className="sd-card sd-card--similar"><b>Opening Night Scene</b><Meta /></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
