import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageTitle from '../components/PageTitle'
import { useToast } from '../components/Toast'
import { CheckIcon, WhatsAppIcon, MailIcon, CalendarIcon, ArrowLeft, ArrowRight } from '../components/Icons'
import { useSeo } from '../hooks/useSeo'
import { useStoredState } from '../hooks/useStoredState'
import { site, whatsappUrl } from '../config/site'
import { services, findService } from '../data/services'
import { looks, findLook } from '../data/looks'
import { measurements } from '../data/process'
import {
  MEASURE_MODES, FIT_OPTIONS, CONTACT_OPTIONS, SOURCES, emptyBooking,
  makeReference, bookingSummary, bookingMessage, bookingMailto, bookingIcs, downloadFile,
} from '../lib/booking'
import { formatDate, img, isValidEmail, isValidPhone, toISODate, weekday } from '../lib/format'

const STEPS = ['Service', 'Design', 'Details', 'Appointment', 'Contact', 'Review']
const GROUP_SERVICES = ['party', 'traditional']
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const tomorrow = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return toISODate(d)
}

function validate(step, b) {
  const e = {}
  if (step === 0 && !b.service) e.service = 'Please choose a service.'
  if (step === 1 && b.looks.length === 0 && !b.ownDesign.trim()) e.design = 'Pick at least one look, or describe your own idea.'
  if (step === 2) {
    if (!Number.isInteger(Number(b.people)) || Number(b.people) < 1) e.people = 'Enter the number of people.'
    if (b.eventDate && b.eventDate < toISODate(new Date())) e.eventDate = 'The event date is in the past.'
  }
  if (step === 3) {
    if (!b.date) e.date = 'Choose a preferred date.'
    else if (b.date < tomorrow()) e.date = 'Choose a date from tomorrow onwards.'
    else if (site.closedWeekdays.includes(weekday(b.date))) e.date = `We are closed on ${WEEKDAY_NAMES[weekday(b.date)]}s — please pick another day.`
    if (!b.time) e.time = 'Choose a preferred time.'
  }
  if (step === 4) {
    if (!b.name.trim()) e.name = 'Please enter your name.'
    if (!isValidPhone(b.phone)) e.phone = 'Please enter a valid phone number.'
    if (b.email && !isValidEmail(b.email)) e.email = 'Please enter a valid email address.'
  }
  return e
}

function Field({ label, error, hint, children, id }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <small className="field-hint">{hint}</small>}
      {error && <small className="form-error" role="alert">{error}</small>}
    </div>
  )
}

function Confirmation({ result, onReset }) {
  const { ref, booking, via } = result
  const ics = bookingIcs(booking, ref)
  return (
    <div className="booking-done">
      <span className="done-icon"><CheckIcon /></span>
      <h2>Request {via === 'online' ? 'sent' : 'ready'}</h2>
      <p className="booking-ref">Reference <strong>{ref}</strong></p>
      <p>
        {via === 'online'
          ? 'Thank you — your request has been received. We will contact you to confirm your appointment.'
          : 'Your request opened in WhatsApp. Press send there so it reaches us — we will reply to confirm your appointment.'}
      </p>
      <div className="done-actions">
        {via !== 'online' && (
          <>
            <a className="btn btn--auto btn--wa" href={whatsappUrl(bookingMessage(booking, ref))} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> Open WhatsApp again
            </a>
            <a className="btn btn--outline" href={bookingMailto(booking, ref)}><MailIcon /> Send by email instead</a>
          </>
        )}
        {ics && (
          <button type="button" className="btn btn--outline" onClick={() => downloadFile(`${ref}.ics`, ics, 'text/calendar')}>
            <CalendarIcon /> Add to calendar
          </button>
        )}
      </div>
      <div className="done-next">
        <h3>What happens next</h3>
        <ol>
          <li>We confirm your appointment time.</li>
          <li>At your consultation we finalise the design and cloth.</li>
          <li>We take your measurements and schedule your fittings.</li>
        </ol>
      </div>
      <div className="done-links">
        <Link to="/lookbook" className="read-more">Browse more looks</Link>
        <button type="button" className="link-btn" onClick={onReset}>Make another booking</button>
      </div>
    </div>
  )
}

export default function Book() {
  useSeo({
    title: 'Book a Fitting',
    description: 'Choose your design, share your details and request a fitting in under two minutes.',
    image: 'tailored suit/WhatsApp Image 2026-08-14 at 11.52.05.jpeg',
  })
  const notify = useToast()
  const [params, setParams] = useSearchParams()
  const [booking, setBooking, clearBooking] = useStoredState('dapper-booking', emptyBooking)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)
  const topRef = useRef(null)

  // Pre-fill from links like /book?service=groom&look=ivory-shawl-groom
  useEffect(() => {
    const service = params.get('service')
    const look = params.get('look')
    if (!service && !look) return
    setBooking((b) => ({
      ...b,
      service: findService(service) ? service : b.service,
      looks: findLook(look) && !b.looks.includes(look) ? [...b.looks, look] : b.looks,
    }))
    if (findService(service)) setStep(findLook(look) ? 2 : 1)
    setParams({}, { replace: true, state: { keepScroll: true } })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key, value) => {
    setBooking((b) => ({ ...b, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }
  const setMeasurement = (key, value) => set('measurements', { ...booking.measurements, [key]: value })
  const toggleLook = (id) => {
    set('looks', booking.looks.includes(id) ? booking.looks.filter((l) => l !== id) : [...booking.looks, id])
    setErrors((e) => ({ ...e, design: undefined }))
  }

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const goTo = (target) => {
    // Only allow jumping forward if every step before it is valid
    for (let s = 0; s < target; s++) {
      const e = validate(s, booking)
      if (Object.keys(e).length) {
        setStep(s)
        setErrors(e)
        scrollTop()
        return
      }
    }
    setErrors({})
    setStep(target)
    scrollTop()
  }

  const next = () => goTo(step + 1)
  const back = () => jumpTo(step - 1)
  // Going back never needs validation; going forward does
  const jumpTo = (target) => {
    if (target > step) return goTo(target)
    setErrors({})
    setStep(Math.max(0, target))
    scrollTop()
  }

  const finish = (ref, via) => {
    setResult({ ref, booking, via })
    clearBooking()
    setStep(0)
    scrollTop()
  }

  const sendWhatsApp = () => {
    const ref = makeReference()
    window.open(whatsappUrl(bookingMessage(booking, ref)), '_blank', 'noopener')
    finish(ref, 'whatsapp')
  }

  const sendEmail = () => {
    const ref = makeReference()
    window.location.href = bookingMailto(booking, ref)
    finish(ref, 'email')
  }

  const sendOnline = async () => {
    const ref = makeReference()
    setSending(true)
    try {
      const res = await fetch(site.bookingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          reference: ref,
          ...Object.fromEntries(bookingSummary(booking)),
          message: bookingMessage(booking, ref),
          _replyto: booking.email || undefined,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      finish(ref, 'online')
    } catch {
      notify('We could not send your request online — please use WhatsApp or email.')
    } finally {
      setSending(false)
    }
  }

  const service = findService(booking.service)
  const selectedLooks = booking.looks.map(findLook).filter(Boolean)
  // Show looks for the chosen service first
  const orderedLooks = service ? [...looks].sort((a, b) => (b.service === service.id) - (a.service === service.id)) : looks
  const isGroup = GROUP_SERVICES.includes(booking.service)

  return (
    <>
      <PageTitle
        title="Book a Fitting"
        image="tailored suit/WhatsApp Image 2026-08-14 at 11.52.05.jpeg"
        position="center 30%"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Book' }]}
      />

      <section className="section booking-section" ref={topRef}>
        <div className="container booking-layout">
          <div className="booking-main">
            {result ? (
              <Confirmation result={result} onReset={() => setResult(null)} />
            ) : (
              <>
                <ol className="stepper" aria-label="Booking steps">
                  {STEPS.map((label, i) => (
                    <li key={label} className={i === step ? 'is-current' : i < step ? 'is-done' : ''}>
                      <button type="button" onClick={() => jumpTo(i)} aria-current={i === step ? 'step' : undefined}>
                        <span className="stepper-dot">{i < step ? <CheckIcon /> : i + 1}</span>
                        <span className="stepper-label">{label}</span>
                      </button>
                    </li>
                  ))}
                </ol>

                <form
                  className="booking-form"
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (step < STEPS.length - 1) next()
                  }}
                >
                  {/* 1 — Service */}
                  {step === 0 && (
                    <fieldset className="step-panel">
                      <legend>What would you like made?</legend>
                      <div className="option-grid">
                        {services.map((s) => (
                          <label key={s.id} className={`option-card ${booking.service === s.id ? 'is-selected' : ''}`}>
                            <input type="radio" name="service" value={s.id} checked={booking.service === s.id} onChange={() => set('service', s.id)} />
                            <img src={img(s.image)} alt="" loading="lazy" />
                            <span className="option-body">
                              <strong>{s.name}</strong>
                              <span>{s.summary}</span>
                              <em>{s.timeline}</em>
                            </span>
                            <span className="option-check"><CheckIcon /></span>
                          </label>
                        ))}
                      </div>
                      {errors.service && <p className="form-error" role="alert">{errors.service}</p>}
                    </fieldset>
                  )}

                  {/* 2 — Design */}
                  {step === 1 && (
                    <fieldset className="step-panel">
                      <legend>Choose your design</legend>
                      <p className="step-help">Select any looks you like — you can pick more than one. Or describe your own idea below.</p>
                      <div className="look-picker">
                        {orderedLooks.map((look) => {
                          const selected = booking.looks.includes(look.id)
                          return (
                            <button
                              type="button"
                              key={look.id}
                              className={`look-pick ${selected ? 'is-selected' : ''}`}
                              aria-pressed={selected}
                              onClick={() => toggleLook(look.id)}
                            >
                              <img src={img(look.image)} alt="" style={{ objectPosition: look.position }} loading="lazy" />
                              <span className="look-pick-title">{look.title}</span>
                              <span className="option-check"><CheckIcon /></span>
                            </button>
                          )
                        })}
                      </div>
                      <Field id="ownDesign" label="Your own idea (optional)" error={errors.design}>
                        <textarea
                          id="ownDesign"
                          rows={4}
                          value={booking.ownDesign}
                          onChange={(e) => { set('ownDesign', e.target.value); setErrors((er) => ({ ...er, design: undefined })) }}
                          placeholder="e.g. Burgundy velvet dinner jacket with black peak lapels"
                        />
                      </Field>
                      <Field id="colours" label="Colours or fabric preferences (optional)" hint="You can send inspiration photos on WhatsApp after booking.">
                        <input id="colours" value={booking.colours} onChange={(e) => set('colours', e.target.value)} placeholder="e.g. Navy, wool, wedding colours are sage and gold" />
                      </Field>
                    </fieldset>
                  )}

                  {/* 3 — Details & measurements */}
                  {step === 2 && (
                    <fieldset className="step-panel">
                      <legend>Occasion & measurements</legend>
                      <div className="field-row">
                        <Field id="eventDate" label="Event date (if any)" error={errors.eventDate}>
                          <input id="eventDate" type="date" min={toISODate(new Date())} value={booking.eventDate} onChange={(e) => set('eventDate', e.target.value)} />
                        </Field>
                        <Field id="people" label={isGroup ? 'How many people?' : 'Number of people'} error={errors.people} hint={isGroup ? 'Include groomsmen, fathers and pageboys.' : undefined}>
                          <input id="people" type="number" min={1} max={60} value={booking.people} onChange={(e) => set('people', e.target.value === '' ? '' : Number(e.target.value))} />
                        </Field>
                      </div>
                      <div className="field-row">
                        <div className="field">
                          <span className="field-label">Preferred fit</span>
                          <div className="segmented">
                            {Object.entries(FIT_OPTIONS).map(([key, label]) => (
                              <label key={key} className={booking.fit === key ? 'is-selected' : ''}>
                                <input type="radio" name="fit" value={key} checked={booking.fit === key} onChange={() => set('fit', key)} />
                                {label}
                              </label>
                            ))}
                          </div>
                        </div>
                        <Field id="budget" label="Budget (optional)" hint="Helps us recommend the right cloth.">
                          <input id="budget" value={booking.budget} onChange={(e) => set('budget', e.target.value)} placeholder={`e.g. ${site.currency}5 000 – ${site.currency}8 000`} />
                        </Field>
                      </div>

                      <div className="field">
                        <span className="field-label">Measurements</span>
                        <div className="radio-list">
                          {Object.entries(MEASURE_MODES).map(([key, label]) => (
                            <label key={key} className={booking.measureMode === key ? 'is-selected' : ''}>
                              <input type="radio" name="measureMode" value={key} checked={booking.measureMode === key} onChange={() => set('measureMode', key)} />
                              <span className="radio-dot" />
                              {label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {booking.measureMode === 'own' && (
                        <div className="measure-inputs">
                          <p className="step-help">All in centimetres. Fill in what you can — we confirm everything in person before cutting.</p>
                          <div className="measure-input-grid">
                            {measurements.map((m) => (
                              <Field key={m.key} id={`m-${m.key}`} label={m.label} hint={m.hint}>
                                <div className="input-unit">
                                  <input
                                    id={`m-${m.key}`}
                                    type="number"
                                    inputMode="decimal"
                                    min={0}
                                    step={0.5}
                                    value={booking.measurements[m.key] || ''}
                                    onChange={(e) => setMeasurement(m.key, e.target.value)}
                                  />
                                  <span>cm</span>
                                </div>
                              </Field>
                            ))}
                          </div>
                        </div>
                      )}
                    </fieldset>
                  )}

                  {/* 4 — Appointment */}
                  {step === 3 && (
                    <fieldset className="step-panel">
                      <legend>Pick a consultation time</legend>
                      <p className="step-help">Choose your preferred slot — we will confirm it with you. {site.hours.map(([d, t]) => `${d}: ${t}`).join(' · ')}</p>
                      <Field id="date" label="Preferred date" error={errors.date}>
                        <input id="date" type="date" min={tomorrow()} value={booking.date} onChange={(e) => set('date', e.target.value)} />
                      </Field>
                      <div className={`field ${errors.time ? 'has-error' : ''}`}>
                        <span className="field-label">Preferred time</span>
                        <div className="time-slots">
                          {site.appointmentTimes.map((t) => (
                            <button type="button" key={t} className={booking.time === t ? 'is-selected' : ''} aria-pressed={booking.time === t} onClick={() => set('time', t)}>
                              {t}
                            </button>
                          ))}
                        </div>
                        {errors.time && <small className="form-error" role="alert">{errors.time}</small>}
                      </div>
                      <label className="checkbox">
                        <input type="checkbox" checked={booking.flexible} onChange={(e) => set('flexible', e.target.checked)} />
                        <span>I'm flexible — another time nearby is fine</span>
                      </label>
                    </fieldset>
                  )}

                  {/* 5 — Contact */}
                  {step === 4 && (
                    <fieldset className="step-panel">
                      <legend>Your details</legend>
                      <div className="field-row">
                        <Field id="name" label="Full name" error={errors.name}>
                          <input id="name" autoComplete="name" value={booking.name} onChange={(e) => set('name', e.target.value)} />
                        </Field>
                        <Field id="phone" label="Phone / WhatsApp" error={errors.phone}>
                          <input id="phone" type="tel" autoComplete="tel" value={booking.phone} onChange={(e) => set('phone', e.target.value)} />
                        </Field>
                      </div>
                      <div className="field-row">
                        <Field id="email" label="Email (optional)" error={errors.email}>
                          <input id="email" type="email" autoComplete="email" value={booking.email} onChange={(e) => set('email', e.target.value)} />
                        </Field>
                        <div className="field">
                          <span className="field-label">Best way to reach you</span>
                          <div className="segmented">
                            {Object.entries(CONTACT_OPTIONS).map(([key, label]) => (
                              <label key={key} className={booking.contactVia === key ? 'is-selected' : ''}>
                                <input type="radio" name="contactVia" value={key} checked={booking.contactVia === key} onChange={() => set('contactVia', key)} />
                                {label}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Field id="source" label="How did you hear about us?">
                        <select id="source" value={booking.source} onChange={(e) => set('source', e.target.value)}>
                          <option value="">Choose one (optional)</option>
                          {SOURCES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </Field>
                      <Field id="notes" label="Anything else? (optional)">
                        <textarea id="notes" rows={3} value={booking.notes} onChange={(e) => set('notes', e.target.value)} />
                      </Field>
                    </fieldset>
                  )}

                  {/* 6 — Review */}
                  {step === 5 && (
                    <fieldset className="step-panel">
                      <legend>Review your request</legend>
                      <dl className="review-list">
                        {bookingSummary(booking).map(([label, value]) => (
                          <div key={label}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="send-actions">
                        {site.bookingEndpoint ? (
                          <button type="button" className="btn btn--auto" onClick={sendOnline} disabled={sending}>
                            {sending ? 'Sending…' : 'Send booking request'}
                          </button>
                        ) : null}
                        <button type="button" className={`btn btn--auto btn--wa ${site.bookingEndpoint ? 'btn--secondary' : ''}`} onClick={sendWhatsApp}>
                          <WhatsAppIcon /> Send on WhatsApp
                        </button>
                        <button type="button" className="btn btn--outline" onClick={sendEmail}>
                          <MailIcon /> Send by email
                        </button>
                      </div>
                      <p className="step-help">Your appointment is confirmed once we reply. Nothing is charged online.</p>
                    </fieldset>
                  )}

                  {step < 5 && (
                    <div className="step-nav">
                      {step > 0 ? (
                        <button type="button" className="btn btn--outline" onClick={back}><ArrowLeft /> Back</button>
                      ) : <span />}
                      <button type="submit" className="btn btn--auto btn--dark">
                        {step === 4 ? 'Review' : 'Continue'} <ArrowRight />
                      </button>
                    </div>
                  )}
                  {step === 5 && (
                    <div className="step-nav">
                      <button type="button" className="btn btn--outline" onClick={back}><ArrowLeft /> Back</button>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>

          {/* Live summary */}
          <aside className="booking-aside">
            <div className="summary-card">
              <h3>Your booking</h3>
              {service ? (
                <div className="summary-service">
                  <img src={img(service.image)} alt="" />
                  <div>
                    <strong>{service.name}</strong>
                    <span>{service.timeline}</span>
                  </div>
                </div>
              ) : (
                <p className="muted">Choose a service to get started.</p>
              )}
              {selectedLooks.length > 0 && (
                <div className="summary-looks">
                  {selectedLooks.map((l) => (
                    <img key={l.id} src={img(l.image)} alt={l.title} title={l.title} style={{ objectPosition: l.position }} />
                  ))}
                </div>
              )}
              {booking.date && <p className="summary-line"><CalendarIcon /> {formatDate(booking.date)}{booking.time && ` · ${booking.time}`}</p>}
              <ul className="summary-perks">
                <li><CheckIcon /> Free, no-obligation consultation request</li>
                <li><CheckIcon /> Your progress is saved on this device</li>
                <li><CheckIcon /> Written quote before anything is cut</li>
              </ul>
            </div>
            <a className="help-card" href={whatsappUrl(`Hi ${site.brand}, I have a question before booking.`)} target="_blank" rel="noreferrer">
              <WhatsAppIcon />
              <span>
                <strong>Questions first?</strong>
                Chat to us on WhatsApp
              </span>
            </a>
          </aside>
        </div>
      </section>
    </>
  )
}
