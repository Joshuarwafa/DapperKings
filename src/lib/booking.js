import { site } from '../config/site'
import { findService } from '../data/services'
import { findLook } from '../data/looks'
import { measurements } from '../data/process'
import { formatLongDate } from './format'

export const MEASURE_MODES = {
  studio: 'Measure me at the studio',
  visit: 'Home / venue visit (groups)',
  own: "I'll share my own measurements",
}

export const FIT_OPTIONS = { slim: 'Slim', classic: 'Classic', relaxed: 'Relaxed' }

export const CONTACT_OPTIONS = { whatsapp: 'WhatsApp', call: 'Phone call', email: 'Email' }

export const SOURCES = ['Instagram', 'Facebook', 'TikTok', 'Google search', 'Friend or family', 'Saw your work at an event', 'Other']

export const emptyBooking = {
  service: '',
  looks: [],
  ownDesign: '',
  colours: '',
  eventDate: '',
  people: 1,
  fit: 'classic',
  budget: '',
  measureMode: 'studio',
  measurements: {},
  date: '',
  time: '',
  flexible: false,
  name: '',
  phone: '',
  email: '',
  contactVia: 'whatsapp',
  source: '',
  notes: '',
}

export const makeReference = () => {
  const d = new Date()
  const stamp = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `DAP-${stamp}-${rand}`
}

const measurementText = (b) => {
  if (b.measureMode !== 'own') return MEASURE_MODES[b.measureMode]
  const filled = measurements.filter((m) => b.measurements[m.key]).map((m) => `${m.label} ${b.measurements[m.key]}cm`)
  return filled.length ? `Own — ${filled.join(', ')}` : 'Own (to be shared)'
}

const appointmentText = (b) => {
  const slot = b.date ? `${formatLongDate(b.date)}${b.time ? ` at ${b.time}` : ''}` : 'No date chosen'
  return b.flexible ? `${slot} (flexible)` : slot
}

// Ordered [label, value] rows — used by the review screen and the outgoing message.
export const bookingSummary = (b) =>
  [
    ['Service', findService(b.service)?.name],
    ['Looks', b.looks.map((id) => findLook(id)?.title).filter(Boolean).join(', ')],
    ['Own design', b.ownDesign],
    ['Colours / fabric', b.colours],
    ['Event date', b.eventDate && formatLongDate(b.eventDate)],
    ['People', b.people > 1 ? String(b.people) : ''],
    ['Fit', FIT_OPTIONS[b.fit]],
    ['Budget', b.budget],
    ['Measurements', measurementText(b)],
    ['Appointment', appointmentText(b)],
    ['Name', b.name],
    ['Phone', b.phone],
    ['Email', b.email],
    ['Contact via', CONTACT_OPTIONS[b.contactVia]],
    ['Heard about us', b.source],
    ['Notes', b.notes],
  ].filter(([, value]) => value)

export const bookingMessage = (b, ref) =>
  [
    `New fitting request — ${ref}`,
    '',
    ...bookingSummary(b).map(([label, value]) => `${label}: ${value}`),
  ].join('\n')

export const bookingMailto = (b, ref) =>
  `mailto:${site.email}?subject=${encodeURIComponent(`Fitting request ${ref}`)}&body=${encodeURIComponent(bookingMessage(b, ref))}`

// Calendar file for the requested slot (marked as awaiting confirmation)
export const bookingIcs = (b, ref) => {
  if (!b.date || !b.time) return null
  const [h, m] = b.time.split(':').map(Number)
  const day = b.date.replace(/-/g, '')
  const pad = (n) => String(n).padStart(2, '0')
  const start = `${day}T${pad(h)}${pad(m)}00`
  const end = `${day}T${pad(h + 1)}${pad(m)}00`
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${site.brand}//Booking//EN`,
    'BEGIN:VEVENT',
    `UID:${ref}@${site.brand.toLowerCase()}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${site.brand} fitting (awaiting confirmation)`,
    `LOCATION:${site.address.join(', ')}`,
    `DESCRIPTION:Booking reference ${ref}. We will confirm this time with you.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export const downloadFile = (filename, content, type) => {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
