import type { Session } from '@supabase/supabase-js'
import type { ReactNode } from 'react'
import { Login } from './Login'

interface Props {
  session: Session | null
  children: ReactNode
}

export function AuthGate({ session, children }: Props) {
  if (!session) {
    return <Login />
  }
  return <>{children}</>
}
