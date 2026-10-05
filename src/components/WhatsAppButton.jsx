import { useLocation } from 'react-router-dom'
import { site, whatsappUrl } from '../config/site'
import { WhatsAppIcon } from './Icons'

export default function WhatsAppButton() {
  const { pathname } = useLocation()
  // The booking page has its own WhatsApp send button
  if (pathname === '/book') return null

  return (
    <a
      className="wa-float"
      href={whatsappUrl(`Hi ${site.brand}, I'd like to ask about a fitting.`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon />
      <span>Chat with us</span>
    </a>
  )
}
