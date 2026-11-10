import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

function AdminApp() {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.title = 'ARISI Admin'
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => {
      data.subscription.unsubscribe()
      document.title = 'ARISI — Rooted in rice. Made with love.'
    }
  }, [])

  if (!supabase) return <p className="p-10 text-center text-muted">Supabase is not configured.</p>
  if (!ready) return <div className="grid min-h-screen place-items-center text-muted">Loading…</div>
  return session ? <AdminDashboard session={session} /> : <AdminLogin />
}

export default AdminApp
