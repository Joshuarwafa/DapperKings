// Every photo in /Pictures is bundled by Vite (hashed + cached in production).
const files = import.meta.glob('/Pictures/**/*.{jpg,jpeg,png,webp,avif}', { eager: true, import: 'default' })
const byPath = Object.fromEntries(Object.entries(files).map(([key, url]) => [key.replace('/Pictures/', ''), url]))

// Turns a Pictures-relative path (e.g. "tailored suit/Cover.jpeg") into a URL
export const img = (path) => {
  const url = byPath[path]
  if (!url && import.meta.env.DEV) console.warn(`Image not found in /Pictures: ${path}`)
  return url || ''
}

const parse = (iso) => new Date(`${iso}T00:00:00`)

export const formatDate = (iso) =>
  parse(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export const formatLongDate = (iso) =>
  parse(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export const dateParts = (iso) => {
  const d = parse(iso)
  return {
    day: String(d.getDate()).padStart(2, '0'),
    monthYear: d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
  }
}

export const monthKey = (iso) => iso.slice(0, 7)

export const monthLabel = (key) =>
  parse(`${key}-01`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

export const readingTime = (post) => {
  const words = [post.excerpt, ...post.body].join(' ').split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

export const isValidPhone = (value) => value.replace(/[^\d]/g, '').length >= 9

// Local YYYY-MM-DD (avoids the UTC shift of toISOString)
export const toISODate = (date) => {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const weekday = (iso) => parse(iso).getDay()
