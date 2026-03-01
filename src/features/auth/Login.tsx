import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the magic link!')
    }
    setLoading(false)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 24,
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>RewardFit</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32 }}>
        Log workouts. Hit milestones. Earn rewards.
      </p>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360 }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ marginBottom: 12 }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Sending...' : 'Send magic link'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 16, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          {message}
        </p>
      )}
    </div>
  )
}
