import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export function Login() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setMessage(error.message)
    } else {
      setStep('code')
      setMessage('Check your email for the 6-digit code.')
    }
    setLoading(false)
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error) {
      setMessage(error.message)
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

      {step === 'email' ? (
        <form onSubmit={handleSendCode} style={{ width: '100%', maxWidth: 360 }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ marginBottom: 12 }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Sending...' : 'Send login code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} style={{ width: '100%', maxWidth: 360 }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 12 }}>
            Code sent to {email}
          </p>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit code"
            value={token}
            onChange={e => setToken(e.target.value)}
            required
            style={{ marginBottom: 12, textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3em' }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Verifying...' : 'Log in'}
          </button>
          <button
            type="button"
            onClick={() => { setStep('email'); setToken(''); setMessage('') }}
            style={{ width: '100%', marginTop: 8, background: 'transparent', color: 'var(--color-text-secondary)' }}
          >
            Use different email
          </button>
        </form>
      )}

      {message && (
        <p style={{ marginTop: 16, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          {message}
        </p>
      )}
    </div>
  )
}
