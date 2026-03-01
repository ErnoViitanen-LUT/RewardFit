export type RewardStatus = 'locked' | 'unlocked' | 'claimed'

export interface Reward {
  id: string
  user_id: string
  milestone_id: string
  title: string
  status: RewardStatus
  unlocked_at: string | null
  claimed_at: string | null
  created_at: string
}

export interface RewardInsert {
  milestone_id: string
  title: string
}
