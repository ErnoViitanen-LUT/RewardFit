import { useState } from 'react'
import { Card } from '../../components/Card'
import { createMilestone } from './milestones.api'
import type { RuleType } from './milestones.types'

interface Props {
  onCreated: () => void
}

export function MilestoneForm({ onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [ruleType, setRuleType] = useState<RuleType>('TOTAL_WORKOUTS')
  const [targetValue, setTargetValue] = useState(10)
  const [windowWeeks, setWindowWeeks] = useState(4)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await createMilestone({
        title,
        rule_type: ruleType,
        target_value: targetValue,
        window_weeks: ruleType === 'WORKOUTS_PER_WEEK' ? windowWeeks : undefined,
        start_date: new Date().toISOString().split('T')[0],
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
        <input
          placeholder="Milestone title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ marginBottom: 12 }}
        />

        <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Rule type</label>
        <select
          value={ruleType}
          onChange={e => setRuleType(e.target.value as RuleType)}
          style={{ marginBottom: 12 }}
        >
          <option value="TOTAL_WORKOUTS">Total workouts</option>
          <option value="WORKOUTS_PER_WEEK">Workouts per week</option>
        </select>

        <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
          {ruleType === 'TOTAL_WORKOUTS' ? 'Target workouts' : 'Workouts per week'}
        </label>
        <input
          type="number"
          min={1}
          value={targetValue}
          onChange={e => setTargetValue(Number(e.target.value))}
          style={{ marginBottom: 12 }}
        />

        {ruleType === 'WORKOUTS_PER_WEEK' && (
          <>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Consecutive weeks
            </label>
            <input
              type="number"
              min={1}
              value={windowWeeks}
              onChange={e => setWindowWeeks(Number(e.target.value))}
              style={{ marginBottom: 12 }}
            />
          </>
        )}

        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Saving...' : 'Create milestone'}
        </button>
      </form>
    </Card>
  )
}
