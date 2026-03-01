export interface Workout {
  id: string
  user_id: string
  performed_at: string
  type: string
  duration_min: number
  intensity: string
  notes: string | null
  created_at: string
}

export interface WorkoutInsert {
  performed_at: string
  type: string
  duration_min: number
  intensity: string
  notes?: string
}
