import { img } from '../lib/format'

// Background photo that never gets blown up past its real size (so it stays sharp):
// a blurred copy fills the area, and the real photo sits on top at native resolution.
// align: "right" (hero) or "center" (page banners)
export default function Backdrop({ image, position = 'center top', align = 'center', className = '' }) {
  const src = img(image)
  return (
    <div className={`backdrop backdrop--${align} ${className}`} aria-hidden="true">
      <div className="backdrop-fill" style={{ backgroundImage: `url("${src}")` }} />
      <img className="backdrop-img" src={src} alt="" style={{ objectPosition: position }} />
    </div>
  )
}
