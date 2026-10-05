import { useEffect, useState } from 'react'

// useState that survives a page refresh (falls back to memory if storage is blocked).
export function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) return { ...initial, ...JSON.parse(raw) }
    } catch {
      // ignore
    }
    return initial
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore
    }
  }, [key, value])

  const clear = () => {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
    setValue(initial)
  }

  return [value, setValue, clear]
}
