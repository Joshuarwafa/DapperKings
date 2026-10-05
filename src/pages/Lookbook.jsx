import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import Reveal from '../components/Reveal'
import Lightbox from '../components/Lightbox'
import { CtaBand } from '../components/Section'
import { WhatsAppIcon } from '../components/Icons'
import { useSeo } from '../hooks/useSeo'
import { looks, lookCategories } from '../data/looks'
import { site } from '../config/site'
import { img } from '../lib/format'

export default function Lookbook() {
  useSeo({
    title: 'Lookbook',
    description: 'Bespoke suits, wedding tuxedos and group outfits designed and tailored by Dapper.',
    image: 'tailored suit/WhatsApp Image 2026-08-14 at 11.51.02.jpeg',
  })
  const [params, setParams] = useSearchParams()
  const category = params.get('category')
  const openId = params.get('look')

  const visible = useMemo(() => (category ? looks.filter((l) => l.category === category) : looks), [category])
  const openIndex = visible.findIndex((l) => l.id === openId)

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, state: { keepScroll: true } })
  }

  const close = () => setParam('look', null)
  const step = (dir) => setParam('look', visible[(openIndex + dir + visible.length) % visible.length].id)

  const shareText = (look) =>
    `https://wa.me/?text=${encodeURIComponent(`${look.title} by ${site.brand} — ${window.location.origin}/lookbook?look=${look.id}`)}`

  return (
    <>
      <PageTitle
        title="Lookbook"
        image="tailored suit/WhatsApp Image 2026-08-14 at 11.51.02.jpeg"
        position="center 70%"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Lookbook' }]}
      />

      <section className="section">
        <div className="container">
          <Reveal className="lookbook-intro">
            <p>Every piece here was designed with the client and made to their measurements. Find a look you love and we will make it yours.</p>
          </Reveal>

          <div className="filter-tabs" role="tablist" aria-label="Filter looks">
            <button type="button" role="tab" aria-selected={!category} className={!category ? 'is-active' : ''} onClick={() => setParam('category', null)}>
              All <span>{looks.length}</span>
            </button>
            {lookCategories.map((c) => (
              <button
                type="button"
                role="tab"
                key={c}
                aria-selected={category === c}
                className={category === c ? 'is-active' : ''}
                onClick={() => setParam('category', c)}
              >
                {c} <span>{looks.filter((l) => l.category === c).length}</span>
              </button>
            ))}
          </div>

          <div className="masonry">
            {visible.map((look, i) => (
              <Reveal key={look.id} className="masonry-item" delay={(i % 3) * 80}>
                <button type="button" className="look-tile look-tile--masonry" onClick={() => setParam('look', look.id)}>
                  <img src={img(look.image)} alt={look.description} loading="lazy" />
                  <div className="look-tile-info">
                    <span>{look.category}</span>
                    <h3>{look.title}</h3>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Seen something you love?" text="Pick a look, book a consultation, and we will adapt it to you." />

      {openIndex >= 0 && (
        <Lightbox
          items={visible}
          index={openIndex}
          onClose={close}
          onStep={step}
          caption={(look) => (
            <div className="look-caption">
              <div>
                <span className="eyebrow">{look.category}</span>
                <h3>{look.title}</h3>
                <p>{look.description}</p>
              </div>
              <div className="look-caption-actions">
                <Link to={`/book?look=${look.id}&service=${look.service}`} className="btn btn--auto">Book this look</Link>
                <a href={shareText(look)} target="_blank" rel="noreferrer" className="share-btn share-btn--light">
                  <WhatsAppIcon /> Share
                </a>
              </div>
            </div>
          )}
        />
      )}
    </>
  )
}
