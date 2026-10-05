import { Link } from 'react-router-dom'
import { img } from '../lib/format'

// The photo shown in the circle (path inside the Pictures folder)
const HERO_IMAGE = 'tailored suit/cover2.jpeg'
const HERO_POSITION = 'center 30%'
const HERO_ALT = 'Groom in an ivory double-breasted jacket with groomsmen in blush-pink dinner jackets'

export default function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <span className="hero-arc" aria-hidden="true" />

      <div className="hero-content">
        <span className="hero-eyebrow">Bespoke tailoring · Made to measure</span>
        <h1>
          Made to be <em>distinctly</em> yours.
        </h1>
        <p>
          Personal design, considered cloth and an impeccable fit. Every garment is made around your character — not
          the other way around.
        </p>
        <div className="hero-actions">
          <Link to="/book" className="hero-btn">
            Book a fitting <span aria-hidden="true">↗</span>
          </Link>
          <Link to="/lookbook" className="hero-link">Explore the lookbook</Link>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-orb">
          <span className="hero-ring" aria-hidden="true" />
          <Link to="/lookbook" className="hero-circle" aria-label="View the lookbook">
            <img src={img(HERO_IMAGE)} alt={HERO_ALT} style={{ objectPosition: HERO_POSITION }} fetchpriority="high" />
          </Link>
          <span className="hero-badge" aria-hidden="true">One of<br />one</span>
        </div>
      </div>
    </section>
  )
}
