import { supabase } from '../../lib/supabase'
import type { Milestone, MilestoneInsert } from './milestones.types'

export async function listMilestones(): Promise<Milestone[]> {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createMilestone(milestone: MilestoneInsert): Promise<Milestone> {
  const { data, error } = await supabase
    .from('milestones')
    .insert(milestone)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateMilestone(
  id: string,
  updates: Partial<Pick<Milestone, 'status' | 'unlocked_at'>>
): Promise<void> {
  const { error } = await supabase
    .from('milestones')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}
