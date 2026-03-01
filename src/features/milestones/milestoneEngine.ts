import { updateMilestone } from './milestones.api'
import { updateReward } from '../rewards/rewards.api'
import type { Milestone } from './milestones.types'
import type { Reward } from '../rewards/rewards.types'
import type { Workout } from '../workouts/workouts.types'

/**
 * Milestone evaluation engine.
 *
 * TOTAL_WORKOUTS: Count workouts with performed_at >= start_date.
 *   Unlock when count >= target_value.
 *
 * WORKOUTS_PER_WEEK: From start_date, split into Mon-Sun week buckets.
 *   Require target_value workouts each week for window_weeks consecutive weeks.
 *   Unlock when condition met.
 */
export async function evaluateMilestones(
  workouts: Workout[],
  milestones: Milestone[],
  rewards: Reward[],
): Promise<void> {
  const active = milestones.filter(m => m.status === 'active')

  for (const milestone of active) {
    const eligible = workouts.filter(
      w => new Date(w.performed_at) >= new Date(milestone.start_date)
    )

    let unlocked = false

    if (milestone.rule_type === 'TOTAL_WORKOUTS') {
      unlocked = eligible.length >= milestone.target_value
    } else if (milestone.rule_type === 'WORKOUTS_PER_WEEK') {
      unlocked = checkWeeklyConsistency(
        eligible,
        milestone.start_date,
        milestone.target_value,
        milestone.window_weeks ?? 1,
      )
    }

    if (unlocked) {
      const now = new Date().toISOString()
      await updateMilestone(milestone.id, { status: 'unlocked', unlocked_at: now })

      // Unlock linked rewards
      const linked = rewards.filter(
        r => r.milestone_id === milestone.id && r.status === 'locked'
      )
      for (const reward of linked) {
        await updateReward(reward.id, { status: 'unlocked', unlocked_at: now })
      }
    }
  }
}

/**
 * Check if workouts meet the weekly consistency rule.
 * Uses Mon-Sun week buckets starting from start_date's week.
 */
function checkWeeklyConsistency(
  workouts: Workout[],
  startDate: string,
  perWeek: number,
  windowWeeks: number,
): boolean {
  if (workouts.length === 0) return false

  const start = getMonday(new Date(startDate))
  const now = new Date()

  // Build week buckets from start to now
  const weekCounts: number[] = []
  const current = new Date(start)

  while (current <= now) {
    const weekEnd = new Date(current)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const count = workouts.filter(w => {
      const d = new Date(w.performed_at)
      return d >= current && d < weekEnd
    }).length

    weekCounts.push(count)
    current.setDate(current.getDate() + 7)
  }

  // Check for windowWeeks consecutive weeks meeting target
  let consecutive = 0
  for (const count of weekCounts) {
    if (count >= perWeek) {
      consecutive++
      if (consecutive >= windowWeeks) return true
    } else {
      consecutive = 0
    }
  }

  return false
}

function getMonday(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  date.setHours(0, 0, 0, 0)
  return date
}
