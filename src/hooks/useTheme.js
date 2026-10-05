import { useEffect, useState } from 'react'
import { site } from '../config/site'

// Light is the default. Dark mode is only used when the visitor switches to it
// with the toggle — that choice is remembered on their device.
const KEY = 'dapper-theme-choice'

const initialTheme = () => {
  if (!site.enableDarkMode) return 'light'
  try {
    if (localStorage.getItem(KEY) === 'dark') return 'dark'
  } catch {
    // storage unavailable — use the default
  }
  return 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggle = () =>
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(KEY, next)
      } catch {
        // ignore
      }
      return next
    })

  return [theme, toggle]
}
