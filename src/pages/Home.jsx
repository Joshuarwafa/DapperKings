import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import Hero from '../components/Hero'
import { SectionHeading, CtaBand } from '../components/Section'
import { ArrowRight, ScissorsIcon, TapeIcon, NeedleIcon, CalendarIcon } from '../components/Icons'
import { useSeo } from '../hooks/useSeo'
import { looks } from '../data/looks'
import { services } from '../data/services'
import { steps } from '../data/process'
import { posts } from '../data/posts'
import { testimonials } from '../data/testimonials'
import { dateParts, img } from '../lib/format'

const values = [
  { icon: <ScissorsIcon />, title: 'Your design', text: 'Choose from the lookbook or bring your own idea — we design it with you.' },
  { icon: <TapeIcon />, title: 'Made to measure', text: 'Every garment is cut from your measurements, not a size chart.' },
  { icon: <NeedleIcon />, title: 'Fitted until perfect', text: 'Two to three fittings so it sits exactly right on the day.' },
  { icon: <CalendarIcon />, title: 'Groups & weddings', text: 'Groom, groomsmen, fathers and pageboys — all coordinated.' },
]

export default function Home() {
  useSeo({})
  const featured = looks.filter((l) => l.featured).slice(0, 6)
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  const highlighted = ['bespoke', 'groom', 'party'].map((id) => services.find((s) => s.id === id))

  return (
    <>
      <Hero />

      {/* Intro */}
      <section className="section">
        <div className="container split">
          <Reveal className="split-media">
            <img src={img('tailored suit/WhatsApp Image 2026-08-14 at 11.52.44.jpeg')} alt="Black shawl-collar tuxedo" loading="lazy" />
            <div className="split-badge">
              <span>Made</span>
              <strong>for you</strong>
            </div>
          </Reveal>
          <div className="split-text">
            <SectionHeading
              align="left"
              eyebrow="The studio"
              title="Every suit starts with a conversation"
              text="You choose the design. We take your measurements, cut the pattern and fit it to you until it is right. No size charts, no compromises — just clothing made for your body and your moment."
            />
            <div className="values">
              {values.map((v, i) => (
                <Reveal className="value" key={v.title} delay={i * 80}>
                  <span className="value-icon">{v.icon}</span>
                  <div>
                    <h3>{v.title}</h3>
                    <p>{v.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Link to="/about" className="read-more">Meet the designer</Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow="What we make" title="Services" text="From a single bespoke suit to a full wedding party." />
          <div className="card-grid">
            {highlighted.map((s, i) => (
              <Reveal key={s.id} delay={i * 100}>
                <Link to={`/book?service=${s.id}`} className="service-card">
                  <div className="service-card-media">
                    <img src={img(s.image)} alt="" loading="lazy" />
                  </div>
                  <div className="service-card-body">
                    <h3>{s.name}</h3>
                    <p>{s.summary}</p>
                    <span className="read-more">Book this</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="section-more">
            <Link to="/services" className="btn btn--outline">All services</Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="How it works" title="From first idea to final fitting" />
          <ol className="steps-row">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 90} className="step-card">
                <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </ol>
          <div className="section-more">
            <Link to="/process" className="read-more">See the full process</Link>
          </div>
        </div>
      </section>

      {/* Lookbook */}
      <section className="section section--dark">
        <div className="container">
          <SectionHeading eyebrow="Portfolio" title="Recent work" text="Real clients, real occasions. Tap a look to book something similar." />
          <div className="looks-grid">
            {featured.map((look, i) => (
              <Reveal key={look.id} delay={(i % 3) * 90}>
                <Link to={`/lookbook?look=${look.id}`} className="look-tile">
                  <img src={img(look.image)} alt={look.description} style={{ objectPosition: look.position }} loading="lazy" />
                  <div className="look-tile-info">
                    <span>{look.category}</span>
                    <h3>{look.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="section-more">
            <Link to="/lookbook" className="btn btn--ghost">View the full lookbook <ArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* Testimonials — shown only once real reviews are added in data/testimonials.js */}
      {testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Clients" title="Kind words" />
            <div className="testimonials">
              {testimonials.map((t, i) => (
                <Reveal as="figure" className="testimonial" key={t.name} delay={i * 90}>
                  <blockquote>{t.quote}</blockquote>
                  <figcaption>
                    <strong>{t.name}</strong>
                    {t.occasion && <span>{t.occasion}</span>}
                  </figcaption>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Journal */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Journal" title="Style notes" text="Advice on fit, fabric and dressing for the big day." />
          <div className="card-grid">
            {latest.map((p, i) => {
              const { day, monthYear } = dateParts(p.date)
              return (
                <Reveal key={p.slug} delay={i * 100}>
                  <Link to={`/journal/${p.slug}`} className="journal-card">
                    <div className="journal-card-media">
                      <img src={img(p.image)} alt="" style={{ objectPosition: p.position }} loading="lazy" />
                    </div>
                    <span className="journal-card-meta">{p.category} · {day} {monthYear}</span>
                    <h3>{p.title}</h3>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <CtaBand title="Getting married? Let's dress the whole party." text="Group fittings for grooms, groomsmen, fathers and pageboys. Book early to secure your dates." />
    </>
  )
}
