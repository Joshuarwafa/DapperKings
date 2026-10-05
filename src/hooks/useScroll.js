import { useEffect, useState } from 'react'

// Current scroll offset and 0–1 progress through the page.
export function useScroll() {
  const [state, setState] = useState({ y: 0, progress: 0 })

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setState({ y: window.scrollY, progress: max > 0 ? Math.min(1, window.scrollY / max) : 0 })
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return state
}

export const scrollToId = (id) => {
  // Wait a tick so a route change can render the target first
  setTimeout(() => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 60)
}
