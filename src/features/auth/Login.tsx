import { useState } from 'react'
import { supabase } from '../../lib/supabase'

type Mode = 'login' | 'signup' | 'otp-email' | 'otp-code'

export function Login() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handlePasswordAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Account created! You are now logged in.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
      }
    }
    setLoading(false)
  }

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setMessage(error.message)
    } else {
      setMode('otp-code')
      setMessage('Check your email for the 6-digit code.')
    }
    setLoading(false)
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    if (error) {
      setMessage(error.message)
    }
    setLoading(false)
  }

  const linkStyle = {
    background: 'transparent',
    color: 'var(--color-primary)',
    padding: 0,
    fontSize: '0.85rem',
    fontWeight: 400 as const,
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

      {(mode === 'login' || mode === 'signup') && (
        <form onSubmit={handlePasswordAuth} style={{ width: '100%', maxWidth: 360 }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ marginBottom: 12 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ marginBottom: 12 }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Please wait...' : mode === 'signup' ? 'Sign up' : 'Log in'}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            {mode === 'login' ? (
              <button type="button" onClick={() => { setMode('signup'); setMessage('') }} style={linkStyle}>
                Create account
              </button>
            ) : (
              <button type="button" onClick={() => { setMode('login'); setMessage('') }} style={linkStyle}>
                Back to login
              </button>
            )}
            <button type="button" onClick={() => { setMode('otp-email'); setMessage('') }} style={linkStyle}>
              Use email code
            </button>
          </div>
        </form>
      )}

      {mode === 'otp-email' && (
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
          <button type="button" onClick={() => { setMode('login'); setMessage('') }} style={{ ...linkStyle, marginTop: 12 }}>
            Use password instead
          </button>
        </form>
      )}

      {mode === 'otp-code' && (
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
          <button type="button" onClick={() => { setMode('otp-email'); setToken(''); setMessage('') }} style={{ ...linkStyle, marginTop: 12 }}>
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
