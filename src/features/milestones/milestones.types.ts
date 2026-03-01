export type RuleType = 'TOTAL_WORKOUTS' | 'WORKOUTS_PER_WEEK'
export type MilestoneStatus = 'active' | 'unlocked'

export interface Milestone {
  id: string
  user_id: string
  title: string
  rule_type: RuleType
  target_value: number
  window_weeks: number | null
  start_date: string
  status: MilestoneStatus
  unlocked_at: string | null
  created_at: string
}

export interface MilestoneInsert {
  title: string
  rule_type: RuleType
  target_value: number
  window_weeks?: number
  start_date: string
}
