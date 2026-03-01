import { useState } from 'react'
import { Card } from '../../components/Card'
import { createReward } from './rewards.api'
import type { Milestone } from '../milestones/milestones.types'

interface Props {
  milestones: Milestone[]
  onCreated: () => void
}

export function RewardForm({ milestones, onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [milestoneId, setMilestoneId] = useState(milestones[0]?.id ?? '')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await createReward({ title, milestone_id: milestoneId })
      onCreated()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  if (milestones.length === 0) {
    return (
      <Card style={{ marginBottom: 16 }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Create a milestone first, then link a reward to it.
        </p>
      </Card>
    )
  }

  return (
    <Card style={{ marginBottom: 16 }}>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Reward title (e.g. New headphones)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ marginBottom: 12 }}
        />

        <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
          Linked milestone
        </label>
        <select
          value={milestoneId}
          onChange={e => setMilestoneId(e.target.value)}
          style={{ marginBottom: 12 }}
        >
          {milestones.map(m => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>

        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Saving...' : 'Create reward'}
        </button>
      </form>
    </Card>
  )
}
