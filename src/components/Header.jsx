import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useScroll } from '../hooks/useScroll'
import { site } from '../config/site'
import { MenuIcon, CloseIcon, SunIcon, MoonIcon } from './Icons'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Lookbook', to: '/lookbook' },
  { label: 'Services', to: '/services' },
  { label: 'How It Works', to: '/process' },
  { label: 'Journal', to: '/journal' },
  { label: 'About', to: '/about' },
]

export default function Header({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)
  const { y, progress } = useScroll()
  const { pathname } = useLocation()
  // The home hero is a dark photo, so the header starts transparent there
  const overHero = pathname === '/' && y < 40 && !open

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1101px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <header className={`site-header ${y > 40 ? 'is-scrolled' : ''} ${overHero ? 'is-transparent' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="logo logo--mark" aria-label="Dapper — home">
          <span className="logo-monogram" aria-hidden="true">D</span>
          <span className="logo-word">Dapper</span>
        </Link>

        <nav className={`main-nav ${open ? 'open' : ''}`} aria-label="Main">
          <ul>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === '/'} className="nav-link">
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="nav-book">
              <Link to="/book" className="btn">Book a fitting</Link>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          {site.enableDarkMode && (
            <button
              type="button"
              className="icon-btn theme-toggle"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={onToggleTheme}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          )}
          <Link to="/book" className="btn btn--outline header-cta">
            Book a fitting
          </Link>
          <button
            type="button"
            className="icon-btn menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      <div className="progress-bar" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    </header>
  )
}
