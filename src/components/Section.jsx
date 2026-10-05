import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import Backdrop from './Backdrop'

export function SectionHeading({ eyebrow, title, text, align = 'center' }) {
  return (
    <Reveal className={`section-heading section-heading--${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  )
}

export function CtaBand({
  title = 'Ready to be measured?',
  text = 'Book a consultation and we will design something made only for you.',
  image = 'tailored suit/WhatsApp Image 2026-08-14 at 11.51.02.jpeg',
}) {
  return (
    <section className="cta-band">
      <Backdrop image={image} position="center 40%" />
      <div className="container cta-inner">
        <Reveal>
          <span className="eyebrow">Bespoke tailoring</span>
          <h2>{title}</h2>
          <p>{text}</p>
          <div className="cta-actions">
            <Link to="/book" className="btn btn--auto">Book a fitting</Link>
            <Link to="/lookbook" className="btn btn--ghost">View the lookbook</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
