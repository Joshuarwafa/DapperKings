# Dapper — Launch Checklist & Growth Roadmap

## How the site works today

| Page | Purpose |
|---|---|
| **Home** `/` | Hero, studio intro, services, 5-step process, recent work, journal, call to action |
| **Lookbook** `/lookbook` | Filterable portfolio. Each look opens full-screen with **Book this look** and **Share on WhatsApp** |
| **Services** `/services` | Every service with inclusions, timeline and price, plus a **Book** button for each |
| **How It Works** `/process` | Timeline, what to bring, what gets measured, FAQ |
| **Book** `/book` | 6-step booking: service → design → details/measurements → date & time → contact → review |
| **Journal** `/journal` | Blog with search, filters and articles (good for Google traffic) |
| **About** `/about` | Designer story and all contact options |

**How booking requests arrive:** the client presses **Send on WhatsApp**. A complete, formatted request opens in WhatsApp with a reference number (e.g. `DAP-261002-X7KQ`), and the client sends it to the designer's number. Email is offered as a backup. The client's progress is saved on their device, so they can leave and come back.

Run locally: `npm run dev` · Build for hosting: `npm run build` (output in `dist/`)

---

## 1. Must do before launch

Edit **`src/config/site.js`**. Every placeholder in [brackets] needs replacing:

- [ ] Designer's **name** and title
- [ ] **WhatsApp number** (`whatsapp`, digits only, e.g. `27821234567`). *Booking depends on this.*
- [ ] Phone, email, studio address, opening hours
- [ ] Instagram / Facebook / TikTok links
- [ ] `siteUrl` once the domain is bought
- [ ] Appointment times and closed days

Then:

- [ ] **About page** (`src/pages/About.jsx`): replace the placeholder paragraph with the designer's real story
- [ ] **Prices** (`src/data/services.js`): set `from:` numbers, or leave `null` to show "Quote on request"
- [ ] **Timelines & FAQ** (`src/data/services.js`, `src/data/process.js`): confirm the lead times, the deposit wording and whether home/venue visits are offered
- [ ] **Photo permission**: get written OK from clients whose photos are on the site
- [ ] **Buy a domain** (e.g. `dapper.co.za`) and **deploy** to Netlify or Vercel (free tier; config files are already included)

## 2. First month: get found & capture leads

- [ ] **Google Business Profile**: the single biggest free win for "tailor near me" searches. Add photos, hours, a booking link to `/book`, and ask every client for a review
- [ ] **Real testimonials**: add them to `src/data/testimonials.js`. The section appears on the home page automatically once there's at least one
- [ ] **Online booking inbox**: create a free form at formspree.io and paste the URL into `bookingEndpoint` in `site.js`. Requests then arrive by email automatically, with WhatsApp as a backup
- [ ] **Newsletter**: connect the signup forms to Mailchimp or Brevo (they currently only show a thank-you message and don't store anything)
- [ ] **Analytics**: add Google Analytics 4 or Plausible to see which pages and looks bring bookings
- [ ] **Instagram bio link** → `/book`; **WhatsApp Business** auto-reply → link to `/lookbook`

## 3. Marketing system (ongoing)

| Habit | Why |
|---|---|
| Add **every finished job** to the Lookbook (`src/data/looks.js` + photo in `Pictures/`) | The portfolio is the sales pitch |
| Post **1 journal article a month** | Brings Google traffic ("what to wear as a groomsman", "suit fitting guide") |
| Ask "**How did you hear about us?**" (already in the booking form) | Shows which channel actually brings clients |
| **Wedding season push** (book 8–12 weeks ahead) | Group bookings are the highest-value jobs |
| Partner with **wedding planners, photographers, venues** | Each referral can be a whole wedding party |
| **Referral reward** for past clients | Word of mouth is a tailor's strongest channel |
| Short **Reels/TikToks**: fittings, before/after, the reveal | Shows the craft, not just the result |

## 4. Next technical upgrades (when the business is ready)

1. **Real calendar booking**: show live free slots (Cal.com / Calendly embed, or a small backend) instead of "preferred time"
2. **Client measurement profiles**: securely store measurements so repeat clients don't start from scratch (this needs a backend and a privacy policy, since it is personal data)
3. **Deposits online**: PayFast / Yoco / Stripe payment link after the quote is accepted
4. **Admin dashboard**: one place to view bookings, status (consult → measured → fitting → collected) and due dates
5. **Pre-rendering for SEO** (e.g. `vite-plugin-ssr` or moving to Next.js/Astro) so every page is instantly indexable
6. **Image optimisation**: export photos as WebP at 1600px wide for faster loading on mobile data
7. **POPIA**: add a privacy notice explaining what booking data is collected and how it's used
