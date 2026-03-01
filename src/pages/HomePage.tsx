import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import { listMilestones } from '../features/milestones/milestones.api'
import { listRewards } from '../features/rewards/rewards.api'
import { listWorkouts } from '../features/workouts/workouts.api'
import { evaluateMilestones } from '../features/milestones/milestoneEngine'
import { useRealtime } from '../lib/realtime'
import type { Milestone } from '../features/milestones/milestones.types'
import type { Reward } from '../features/rewards/rewards.types'
import type { Workout } from '../features/workouts/workouts.types'

export function HomePage() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [workouts, setWorkouts] = useState<Workout[]>([])

  async function loadAll() {
    const [w, m, r] = await Promise.all([
      listWorkouts(),
      listMilestones(),
      listRewards(),
    ])
    setWorkouts(w)
    setMilestones(m)
    setRewards(r)
    await evaluateMilestones(w, m, r)
  }

  useEffect(() => { loadAll() }, [])
  useRealtime(loadAll)

  const activeMilestones = milestones.filter(m => m.status === 'active')
  const nextReward = rewards.find(r => r.status === 'locked')

  return (
    <div className="page">
      <h1>RewardFit</h1>

      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 8 }}>Workouts logged</h3>
        <p style={{ fontSize: '2rem', fontWeight: 700 }}>{workouts.length}</p>
      </Card>

      {activeMilestones.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 12 }}>Active milestones</h3>
          {activeMilestones.map(m => {
            const count = workouts.filter(w =>
              new Date(w.performed_at) >= new Date(m.start_date)
            ).length
            return (
              <ProgressBar
                key={m.id}
                label={m.title}
                value={count}
                max={m.target_value}
              />
            )
          })}
        </Card>
      )}

      {nextReward && (
        <Card>
          <h3 style={{ marginBottom: 4 }}>Next reward</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>{nextReward.title}</p>
        </Card>
      )}

      {milestones.length === 0 && rewards.length === 0 && (
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 16 }}>
          Get started by logging a workout and creating a milestone!
        </p>
      )}
    </div>
  )
}
