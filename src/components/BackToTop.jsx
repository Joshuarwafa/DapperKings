import { useScroll } from '../hooks/useScroll'
import { ArrowUp } from './Icons'

export default function BackToTop() {
  const { y } = useScroll()
  return (
    <button
      type="button"
      className={`to-top ${y > 600 ? 'show' : ''}`}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUp />
    </button>
  )
}
