import { Link } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import Reveal from '../components/Reveal'
import { SectionHeading, CtaBand } from '../components/Section'
import { WhatsAppIcon, PhoneIcon, MailIcon, CalendarIcon } from '../components/Icons'
import { useSeo } from '../hooks/useSeo'
import { site, whatsappUrl } from '../config/site'
import { img } from '../lib/format'

export default function About() {
  useSeo({
    title: 'About',
    description: `Meet ${site.designer.name}, the designer behind ${site.brand}.`,
    image: site.designer.photo,
  })

  const contacts = [
    { icon: <WhatsAppIcon />, label: 'WhatsApp', value: 'Chat with us', href: whatsappUrl(`Hi ${site.brand}!`), external: true },
    { icon: <PhoneIcon />, label: 'Call', value: site.phoneDisplay, href: `tel:${site.phoneLink}` },
    { icon: <MailIcon />, label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: <CalendarIcon />, label: 'Book', value: 'Request a fitting', to: '/book' },
  ]

  return (
    <>
      <PageTitle
        title="About the Designer"
        image="tailored suit/WhatsApp Image 2026-08-14 at 11.50.38.jpeg"
        position="center 30%"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
      />

      <section className="section">
        <div className="container split">
          <Reveal className="split-media split-media--portrait">
            <img src={img(site.designer.photo)} alt={site.designer.name} />
          </Reveal>
          <div className="split-text">
            <SectionHeading align="left" eyebrow={site.designer.title} title={site.designer.name} />
            <Reveal className="prose">
              {/* Replace with the designer's own story — where they trained, why they started, what they love making. */}
              <p>
                {site.brand} is a bespoke tailoring studio built on a simple idea: clothing should be made for the person
                wearing it. Every client chooses their design, is measured in person, and is fitted until the garment is right.
              </p>
              <p>
                [Add the designer's story here — how they learned the craft, when they started, and the kind of work they
                are proudest of.]
              </p>
              <p>
                From a single suit to a full wedding party, the goal is the same — you should walk into the room and feel
                like the best-dressed version of yourself.
              </p>
            </Reveal>
            <Reveal className="signature">{site.designer.name}</Reveal>
          </div>
        </div>
      </section>

      <section className="section section--alt" id="contact-details">
        <div className="container">
          <SectionHeading eyebrow="Get in touch" title="Visit, call or message" />
          <div className="contact-grid">
            {contacts.map((c, i) => {
              const inner = (
                <>
                  <span className="contact-icon">{c.icon}</span>
                  <span className="contact-label">{c.label}</span>
                  <span className="contact-value">{c.value}</span>
                </>
              )
              return (
                <Reveal key={c.label} delay={i * 80}>
                  {c.to ? (
                    <Link to={c.to} className="contact-card">{inner}</Link>
                  ) : (
                    <a href={c.href} className="contact-card" {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}>{inner}</a>
                  )}
                </Reveal>
              )
            })}
          </div>
          <Reveal className="studio-info">
            <div>
              <h3>Studio</h3>
              {site.address.map((line) => <p key={line}>{line}</p>)}
            </div>
            <div>
              <h3>Hours</h3>
              {site.hours.map(([d, t]) => <p key={d}>{d}: {t}</p>)}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
