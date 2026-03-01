import { supabase } from '../lib/supabase'

export function SettingsPage() {
  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="page">
      <h1>Settings</h1>
      <button onClick={handleLogout} style={{ background: 'var(--color-danger)', marginTop: 16 }}>
        Log out
      </button>
    </div>
  )
}
