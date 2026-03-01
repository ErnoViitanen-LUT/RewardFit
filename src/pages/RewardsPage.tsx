import { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { RewardForm } from '../features/rewards/RewardForm'
import { listRewards, claimReward } from '../features/rewards/rewards.api'
import { listMilestones } from '../features/milestones/milestones.api'
import { useRealtime } from '../lib/realtime'
import type { Reward } from '../features/rewards/rewards.types'
import type { Milestone } from '../features/milestones/milestones.types'

export function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [showForm, setShowForm] = useState(false)

  async function loadAll() {
    const [r, m] = await Promise.all([listRewards(), listMilestones()])
    setRewards(r)
    setMilestones(m)
  }

  async function handleClaim(id: string) {
    await claimReward(id)
    loadAll()
  }

  useEffect(() => { loadAll() }, [])
  useRealtime(loadAll)

  const locked = rewards.filter(r => r.status === 'locked')
  const unlocked = rewards.filter(r => r.status === 'unlocked')
  const claimed = rewards.filter(r => r.status === 'claimed')

  function getMilestoneTitle(milestoneId: string) {
    return milestones.find(m => m.id === milestoneId)?.title ?? 'Unknown milestone'
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Rewards</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New'}
        </button>
      </div>

      {showForm && <RewardForm milestones={milestones} onCreated={() => { setShowForm(false); loadAll() }} />}

      {unlocked.length > 0 && (
        <>
          <h3 style={{ marginBottom: 8, color: 'var(--color-success)' }}>Unlocked</h3>
          {unlocked.map(r => (
            <Card key={r.id} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{r.title}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {getMilestoneTitle(r.milestone_id)}
                  </p>
                </div>
                <button
                  onClick={() => handleClaim(r.id)}
                  style={{ background: 'var(--color-success)' }}
                >
                  Claim
                </button>
              </div>
            </Card>
          ))}
        </>
      )}

      {locked.length > 0 && (
        <>
          <h3 style={{ marginBottom: 8, marginTop: 16 }}>Locked</h3>
          {locked.map(r => (
            <Card key={r.id} style={{ marginBottom: 8, opacity: 0.6 }}>
              <strong>{r.title}</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {getMilestoneTitle(r.milestone_id)}
              </p>
            </Card>
          ))}
        </>
      )}

      {claimed.length > 0 && (
        <>
          <h3 style={{ marginBottom: 8, marginTop: 16, color: 'var(--color-text-secondary)' }}>Claimed</h3>
          {claimed.map(r => (
            <Card key={r.id} style={{ marginBottom: 8, opacity: 0.5 }}>
              <strong>{r.title}</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Claimed {r.claimed_at ? new Date(r.claimed_at).toLocaleDateString() : ''}
              </p>
            </Card>
          ))}
        </>
      )}

      {rewards.length === 0 && !showForm && (
        <p style={{ color: 'var(--color-text-secondary)' }}>No rewards yet. Create one linked to a milestone!</p>
      )}
    </div>
  )
}
