import { supabase } from '../../lib/supabase'
import type { Workout, WorkoutInsert } from './workouts.types'

export async function listWorkouts(): Promise<Workout[]> {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .order('performed_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createWorkout(workout: WorkoutInsert): Promise<Workout> {
  const { data, error } = await supabase
    .from('workouts')
    .insert(workout)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteWorkout(id: string): Promise<void> {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id)

  if (error) throw error
}
