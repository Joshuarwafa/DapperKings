// `from` is a starting price (number). Leave null to show "Quote on request".
// Timelines are typical lead times — adjust to match the studio's real capacity.
export const services = [
  {
    id: 'bespoke',
    name: 'Bespoke Suit',
    image: 'tailored suit/Cover.jpeg',
    summary: 'A suit designed and cut for you alone — from cloth to the last buttonhole.',
    includes: ['Design consultation', 'Fabric & lining selection', 'Full measurement session', '2–3 fittings', 'Final press & garment bag'],
    timeline: '4–6 weeks',
    from: null,
  },
  {
    id: 'groom',
    name: 'Groom Package',
    image: 'tailored suit/WhatsApp Image 2026-08-14 at 11.53.10.jpeg',
    summary: 'Your wedding look, designed around your day, your venue and your partner.',
    includes: ['Styling consultation', 'Suit or tuxedo, made to measure', 'Coordination with your groomsmen', 'Accessories advice', 'Final fitting before the day'],
    timeline: '6–8 weeks',
    from: null,
    popular: true,
  },
  {
    id: 'party',
    name: 'Wedding Party & Groups',
    image: 'tailored suit/WhatsApp Image 2026-08-14 at 11.51.02.jpeg',
    summary: 'Matching groomsmen, fathers and pageboys — everyone fitted, nobody left out.',
    includes: ['One look, fitted to every body', 'Group measurement sessions', 'Pageboy sizes available', 'Individual fittings', 'Delivered together, ready to wear'],
    timeline: 'Book 8–12 weeks ahead',
    from: null,
    unit: 'per person',
  },
  {
    id: 'evening',
    name: 'Evening & Tuxedo',
    image: 'tailored suit/WhatsApp Image 2026-08-14 at 11.52.44.jpeg',
    summary: 'Shawl or peak lapels, black, ivory or colour — for galas, matric dances and black-tie nights.',
    includes: ['Tuxedo or dinner jacket', 'Satin or grosgrain lapels', 'Colour options', 'Dress-shirt pairing', '2 fittings'],
    timeline: '4–6 weeks',
    from: null,
  },
  {
    id: 'traditional',
    name: 'Traditional & Casual Sets',
    image: 'casual outfits/WhatsApp Image 2026-08-14 at 12.13.16.jpeg',
    summary: 'Coordinated shirts and trousers with signature trims for ceremonies and celebrations.',
    includes: ['Custom trim & detailing', 'Lead outfit variation', 'Group sizing', 'Fabric guidance'],
    timeline: '3–5 weeks',
    from: null,
  },
  {
    id: 'alterations',
    name: 'Alterations & Refits',
    image: 'tailored suit/WhatsApp Image 2026-08-14 at 11.51.19.jpeg',
    summary: 'Bring a suit you love back to a perfect fit.',
    includes: ['Fit assessment', 'Taking in / letting out', 'Sleeve & hem adjustments', 'Pressing'],
    timeline: '1–2 weeks',
    from: null,
  },
]

export const findService = (id) => services.find((s) => s.id === id)
