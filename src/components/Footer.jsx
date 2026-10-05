import { Link } from 'react-router-dom'
import Newsletter from './Newsletter'
import { site, whatsappUrl } from '../config/site'

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="logo">Dapp<span>e</span>r</Link>
          <p>{site.description}</p>
          <div className="footer-socials">
            <a href={site.socials.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href={site.socials.facebook} target="_blank" rel="noreferrer">Facebook</a>
            <a href={site.socials.tiktok} target="_blank" rel="noreferrer">TikTok</a>
          </div>
        </div>
        <div>
          <h6>Explore</h6>
          <ul>
            <li><Link to="/lookbook">Lookbook</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/process">How It Works</Link></li>
            <li><Link to="/journal">Journal</Link></li>
            <li><Link to="/book">Book a fitting</Link></li>
          </ul>
        </div>
        <div>
          <h6>Visit &amp; Contact</h6>
          <ul>
            {site.address.map((line) => <li key={line}>{line}</li>)}
            <li><a href={`tel:${site.phoneLink}`}>{site.phoneDisplay}</a></li>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a href={whatsappUrl()} target="_blank" rel="noreferrer">WhatsApp us</a></li>
          </ul>
        </div>
        <div>
          <h6>Hours</h6>
          <ul>
            {site.hours.map(([days, time]) => <li key={days}>{days}: {time}</li>)}
          </ul>
          <h6 className="footer-news-title">Newsletter</h6>
          <Newsletter variant="inline" />
        </div>
      </div>
      <div className="container footer-bottom">
        <span>&copy; {new Date().getFullYear()} {site.brand}. All rights reserved.</span>
        <span>{site.tagline}</span>
      </div>
    </footer>
  )
}
