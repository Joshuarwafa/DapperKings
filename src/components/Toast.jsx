import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ToastContext = createContext(() => {})

export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const notify = useCallback((message) => setToast({ message, id: Date.now() }), [])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 3400)
    return () => clearTimeout(id)
  }, [toast])

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">
        {toast?.message}
      </div>
    </ToastContext.Provider>
  )
}
