import { supabase } from '../../lib/supabase'
import type { Reward, RewardInsert } from './rewards.types'

export async function listRewards(): Promise<Reward[]> {
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createReward(reward: RewardInsert): Promise<Reward> {
  const { data, error } = await supabase
    .from('rewards')
    .insert(reward)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function claimReward(id: string): Promise<void> {
  const { error } = await supabase
    .from('rewards')
    .update({
      status: 'claimed',
      claimed_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) throw error
}

export async function updateReward(
  id: string,
  updates: Partial<Pick<Reward, 'status' | 'unlocked_at'>>
): Promise<void> {
  const { error } = await supabase
    .from('rewards')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}
