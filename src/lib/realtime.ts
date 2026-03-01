import { useEffect } from 'react'
import { supabase } from './supabase'

const TABLES = ['workouts', 'milestones', 'rewards'] as const

/**
 * Subscribe to realtime changes on all tables for the current user.
 * Calls `onUpdate` whenever any change occurs, so the page can re-fetch.
 */
export function useRealtime(onUpdate: () => void) {
  useEffect(() => {
    let cancelled = false

    async function setup() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return

      const channel = supabase
        .channel('realtime-sync')

      for (const table of TABLES) {
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            if (!cancelled) onUpdate()
          }
        )
      }

      channel.subscribe()

      return channel
    }

    let channelRef: Awaited<ReturnType<typeof setup>>
    setup().then(ch => { channelRef = ch })

    return () => {
      cancelled = true
      if (channelRef) {
        supabase.removeChannel(channelRef)
      }
    }
  }, [onUpdate])
}
