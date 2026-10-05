import { useState } from 'react'
import { isValidEmail } from '../lib/format'
import { useToast } from './Toast'

// variant: "card" (sidebar) or "inline" (footer)
// NOTE: sign-ups are not stored yet — connect a mailing-list service (see ROADMAP.md).
export default function Newsletter({ variant = 'card' }) {
  const notify = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    notify(`Thanks! ${email.trim()} is on the list.`)
    setEmail('')
  }

  const field = (
    <input
      type="email"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value)
        if (error) setError('')
      }}
      placeholder={variant === 'card' ? 'Your email address' : 'Email address'}
      aria-label="Email address"
      aria-invalid={Boolean(error)}
    />
  )

  if (variant === 'inline') {
    return (
      <form onSubmit={submit} noValidate>
        <div className="footer-news">
          {field}
          <button type="submit">Join</button>
        </div>
        {error && <p className="form-error">{error}</p>}
      </form>
    )
  }

  return (
    <form onSubmit={submit} noValidate>
      {field}
      {error && <p className="form-error">{error}</p>}
      <button className="btn" type="submit">
        Subscribe
      </button>
    </form>
  )
}
