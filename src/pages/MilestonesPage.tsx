import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { MilestoneForm } from '../features/milestones/MilestoneForm'
import { listMilestones } from '../features/milestones/milestones.api'
import { useRealtime } from '../lib/realtime'
import type { Milestone } from '../features/milestones/milestones.types'

export function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [showForm, setShowForm] = useState(false)

  async function loadAll() {
    setMilestones(await listMilestones())
  }

  useEffect(() => { loadAll() }, [])
  useRealtime(loadAll)

  const statusColor = (s: string) =>
    s === 'unlocked' ? 'var(--color-success)' :
    s === 'active' ? 'var(--color-primary)' : 'var(--color-text-secondary)'

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Milestones</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New'}
        </button>
      </div>

      {showForm && <MilestoneForm onCreated={() => { setShowForm(false); loadAll() }} />}

      {milestones.map(m => (
        <Card key={m.id} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{m.title}</strong>
            <span style={{
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: 12,
              background: statusColor(m.status),
              color: 'white',
            }}>
              {m.status}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            {m.rule_type === 'TOTAL_WORKOUTS'
              ? `${m.target_value} total workouts`
              : `${m.target_value}/week for ${m.window_weeks} weeks`}
          </p>
        </Card>
      ))}

      {milestones.length === 0 && !showForm && (
        <p style={{ color: 'var(--color-text-secondary)' }}>No milestones yet. Create one to start tracking!</p>
      )}
    </div>
  )
}
