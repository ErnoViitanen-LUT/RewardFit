import { useState } from 'react'
import { Card } from '../../components/Card'
import { createWorkout } from './workouts.api'

const TYPES = ['walk', 'gym', 'run', 'yoga', 'custom']
const DURATIONS = [20, 30, 45, 60]
const INTENSITIES = ['easy', 'medium', 'hard']

interface Props {
  onCreated: () => void
}

export function WorkoutForm({ onCreated }: Props) {
  const [type, setType] = useState('gym')
  const [duration, setDuration] = useState(30)
  const [intensity, setIntensity] = useState('medium')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await createWorkout({
        performed_at: new Date().toISOString(),
        type,
        duration_min: duration,
        intensity,
        notes: notes || undefined,
      })
      onCreated()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={{ marginBottom: 16 }}>
      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Type</label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {TYPES.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              style={{
                background: type === t ? 'var(--color-primary)' : 'var(--color-border)',
                color: type === t ? 'white' : 'var(--color-text)',
                padding: '6px 14px',
                fontSize: '0.85rem',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Duration</label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {DURATIONS.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              style={{
                background: duration === d ? 'var(--color-primary)' : 'var(--color-border)',
                color: duration === d ? 'white' : 'var(--color-text)',
                padding: '6px 14px',
                fontSize: '0.85rem',
              }}
            >
              {d}min
            </button>
          ))}
        </div>

        <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Intensity</label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {INTENSITIES.map(i => (
            <button
              key={i}
              type="button"
              onClick={() => setIntensity(i)}
              style={{
                background: intensity === i ? 'var(--color-primary)' : 'var(--color-border)',
                color: intensity === i ? 'white' : 'var(--color-text)',
                padding: '6px 14px',
                fontSize: '0.85rem',
              }}
            >
              {i}
            </button>
          ))}
        </div>

        <input
          placeholder="Notes (optional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Saving...' : 'Log workout'}
        </button>
      </form>
    </Card>
  )
}
