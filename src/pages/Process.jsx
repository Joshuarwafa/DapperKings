import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import Reveal from '../components/Reveal'
import { SectionHeading, CtaBand } from '../components/Section'
import { CheckIcon, PlusIcon } from '../components/Icons'
import { useSeo } from '../hooks/useSeo'
import { steps, prepare, measurements, faqs } from '../data/process'
import { img } from '../lib/format'

function Faq({ item, open, onToggle, id }) {
  return (
    <div className={`faq ${open ? 'is-open' : ''}`}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={onToggle}>
          {item.q}
          <PlusIcon />
        </button>
      </h3>
      <div id={id} className="faq-panel" role="region" hidden={!open}>
        <p>{item.a}</p>
      </div>
    </div>
  )
}

export default function Process() {
  useSeo({
    title: 'How It Works',
    description: 'From consultation to final fitting: how a made-to-measure suit is designed, measured and tailored.',
    image: 'tailored suit/WhatsApp Image 2026-08-14 at 11.52.44.jpeg',
  })
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <PageTitle
        title="How It Works"
        image="tailored suit/WhatsApp Image 2026-08-14 at 11.52.44.jpeg"
        position="center 25%"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'How It Works' }]}
      />

      {/* Timeline */}
      <section className="section">
        <div className="container narrow">
          <SectionHeading eyebrow="The process" title="Five steps to a suit made for you" />
          <ol className="timeline">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} className="timeline-item">
                <span className="timeline-num">{i + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <span className="timeline-duration">{step.duration}</span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Prepare + measurements */}
      <section className="section section--alt">
        <div className="container split">
          <div>
            <SectionHeading align="left" eyebrow="Before you come in" title="What to bring" />
            <ul className="check-list check-list--large">
              {prepare.map((item) => (
                <Reveal as="li" key={item}><CheckIcon /> {item}</Reveal>
              ))}
            </ul>
            <Link to="/book" className="btn btn--auto">Book your consultation</Link>
          </div>
          <Reveal className="split-media">
            <img src={img('tailored suit/Cover.jpeg')} alt="Navy pinstripe double-breasted suit" loading="lazy" />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Measurements"
            title="What we measure"
            text="These are taken in person at your appointment. If you would like to share your own beforehand, you can add them in the booking form."
          />
          <div className="measure-grid">
            {measurements.map((m, i) => (
              <Reveal className="measure-card" key={m.key} delay={(i % 5) * 60}>
                <span className="measure-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{m.label}</h3>
                <p>{m.hint}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--alt">
        <div className="container narrow">
          <SectionHeading eyebrow="Questions" title="Frequently asked" />
          <div className="faqs">
            {faqs.map((item, i) => (
              <Faq key={item.q} id={`faq-${i}`} item={item} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
