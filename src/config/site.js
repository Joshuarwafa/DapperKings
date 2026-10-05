// ─────────────────────────────────────────────────────────────
//  Business details — edit these and the whole site updates.
//  Anything in [brackets] is a placeholder that must be replaced.
// ─────────────────────────────────────────────────────────────
export const site = {
  brand: 'Dapper',
  tagline: 'Bespoke tailoring for the moments that matter',
  description:
    'Made-to-measure suits, wedding tuxedos and group outfits. Choose your design, get measured, and wear something made only for you.',
  siteUrl: 'https://example.com', // your live domain, used for SEO/share links

  designer: {
    name: '[Designer name]',
    title: 'Founder & Master Tailor',
    photo: 'tailored suit/Cover.jpeg',
  },

  phoneDisplay: '[+27 00 000 0000]',
  phoneLink: '+27000000000', // used for tel: links
  whatsapp: '27000000000', // international format, digits only — used for wa.me links
  email: 'hello@example.com',
  address: ['[Street address]', '[City, Postal code]'],
  hours: [
    ['Mon – Fri', '9am – 6pm'],
    ['Saturday', '10am – 4pm'],
    ['Sunday', 'By appointment'],
  ],
  socials: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    tiktok: 'https://tiktok.com/',
  },

  // Booking delivery. Leave empty to send requests by WhatsApp / email only.
  // To receive bookings in an inbox automatically, create a free form at
  // https://formspree.io (or similar) and paste its endpoint URL here.
  bookingEndpoint: '',

  currency: 'R',

  // Set to true to show the light/dark toggle in the header again
  enableDarkMode: false,

  // Appointment slots offered in the booking form
  appointmentTimes: ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'],
  closedWeekdays: [0], // 0 = Sunday
}

export const whatsappUrl = (text = '') =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`
