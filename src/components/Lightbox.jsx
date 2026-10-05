import { useEffect, useRef } from 'react'
import { img } from '../lib/format'
import { ArrowLeft, ArrowRight, CloseIcon } from './Icons'

// Full-screen image viewer. `items` are { image, title?, ... }; `caption` renders extra content.
export default function Lightbox({ items, index, onClose, onStep, caption }) {
  const item = items[index]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onStep])

  // Basic swipe support on touch screens
  const touchX = useRef(null)
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  if (!item) return null
  const stop = (e) => e.stopPropagation()

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.title || 'Photo viewer'}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button type="button" className="lightbox-btn lightbox-close" onClick={onClose} aria-label="Close">
        <CloseIcon />
      </button>
      {items.length > 1 && (
        <button type="button" className="lightbox-btn lightbox-prev" onClick={(e) => { stop(e); onStep(-1) }} aria-label="Previous">
          <ArrowLeft />
        </button>
      )}
      <figure className="lightbox-figure" onClick={stop}>
        <img key={item.image} src={img(item.image)} alt={item.title || ''} />
        {caption && <figcaption>{caption(item)}</figcaption>}
      </figure>
      {items.length > 1 && (
        <button type="button" className="lightbox-btn lightbox-next" onClick={(e) => { stop(e); onStep(1) }} aria-label="Next">
          <ArrowRight />
        </button>
      )}
      <div className="lightbox-count">{index + 1} / {items.length}</div>
    </div>
  )
}
