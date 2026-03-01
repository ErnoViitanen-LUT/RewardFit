import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { WorkoutForm } from '../features/workouts/WorkoutForm'
import { listWorkouts, deleteWorkout } from '../features/workouts/workouts.api'
import { listMilestones } from '../features/milestones/milestones.api'
import { listRewards } from '../features/rewards/rewards.api'
import { evaluateMilestones } from '../features/milestones/milestoneEngine'
import { useRealtime } from '../lib/realtime'
import type { Workout } from '../features/workouts/workouts.types'

export function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [showForm, setShowForm] = useState(false)

  async function loadAll() {
    const w = await listWorkouts()
    setWorkouts(w)
  }

  async function handleCreated() {
    setShowForm(false)
    const [w, m, r] = await Promise.all([
      listWorkouts(),
      listMilestones(),
      listRewards(),
    ])
    setWorkouts(w)
    await evaluateMilestones(w, m, r)
  }

  async function handleDelete(id: string) {
    await deleteWorkout(id)
    loadAll()
  }

  useEffect(() => { loadAll() }, [])
  useRealtime(loadAll)

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Workouts</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Log'}
        </button>
      </div>

      {showForm && <WorkoutForm onCreated={handleCreated} />}

      {workouts.map(w => (
        <Card key={w.id} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{w.type}</strong>
              <span style={{ color: 'var(--color-text-secondary)', marginLeft: 8 }}>
                {w.duration_min}min · {w.intensity}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {new Date(w.performed_at).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleDelete(w.id)}
                style={{ background: 'var(--color-danger)', padding: '4px 10px', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            </div>
          </div>
          {w.notes && <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>{w.notes}</p>}
        </Card>
      ))}

      {workouts.length === 0 && !showForm && (
        <p style={{ color: 'var(--color-text-secondary)' }}>No workouts yet. Tap + Log to get started!</p>
      )}
    </div>
  )
}
