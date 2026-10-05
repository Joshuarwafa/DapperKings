import { Link } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import Reveal from '../components/Reveal'
import { SectionHeading, CtaBand } from '../components/Section'
import { CheckIcon } from '../components/Icons'
import { useSeo } from '../hooks/useSeo'
import { services } from '../data/services'
import { site } from '../config/site'
import { img } from '../lib/format'

const priceLabel = (s) =>
  s.from ? `From ${site.currency}${s.from.toLocaleString('en-ZA')}${s.unit ? ` ${s.unit}` : ''}` : 'Quote on request'

export default function Services() {
  useSeo({
    title: 'Services',
    description: 'Bespoke suits, groom packages, wedding party outfits, tuxedos and alterations.',
    image: 'tailored suit/WhatsApp Image 2026-08-14 at 11.53.10.jpeg',
  })

  return (
    <>
      <PageTitle
        title="Services"
        image="tailored suit/WhatsApp Image 2026-08-14 at 11.53.10.jpeg"
        position="center 25%"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
      />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="What we make"
            title="Tailoring for every occasion"
            text="Every service includes a design consultation and in-person measurements. Prices depend on cloth and design — you get a written quote before anything is cut."
          />

          <div className="service-rows">
            {services.map((s, i) => (
              <Reveal key={s.id} className={`service-row ${i % 2 ? 'service-row--flip' : ''}`}>
                <div className="service-row-media">
                  <img src={img(s.image)} alt="" loading="lazy" />
                  {s.popular && <span className="badge">Most requested</span>}
                </div>
                <div className="service-row-body">
                  <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
                  <h2>{s.name}</h2>
                  <p className="service-summary">{s.summary}</p>
                  <ul className="check-list">
                    {s.includes.map((item) => (
                      <li key={item}><CheckIcon /> {item}</li>
                    ))}
                  </ul>
                  <dl className="service-facts">
                    <div><dt>Timeline</dt><dd>{s.timeline}</dd></div>
                    <div><dt>Price</dt><dd>{priceLabel(s)}</dd></div>
                  </dl>
                  <Link to={`/book?service=${s.id}`} className="btn btn--auto">Book {s.name}</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Not sure what you need?" text="Book a consultation — we will talk through the occasion, your style and your budget." />
    </>
  )
}
