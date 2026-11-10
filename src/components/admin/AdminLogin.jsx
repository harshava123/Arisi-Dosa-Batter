import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { SproutIcon } from '../icons/Icons'
import { ADMIN_EMAIL_DOMAIN } from './shared'

const inputClass =
  'w-full rounded-xl border border-sand bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15'

function AdminLogin() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const username = form.get('username').trim().toLowerCase()
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({
      email: username.includes('@') ? username : `${username}@${ADMIN_EMAIL_DOMAIN}`,
      password: form.get('password'),
    })
    setBusy(false)
    if (err) setError(err.message === 'Invalid login credentials' ? 'Wrong username or password.' : err.message)
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand p-12 text-cream md:flex">
        <div className="relative inline-flex w-fit items-end font-serif text-3xl font-semibold tracking-[0.04em]">
          ARISI<span className="text-leaf">.</span>
          <SproutIcon className="absolute -top-1.5 right-0 h-4 w-4 text-leaf" />
        </div>
        <div>
          <p className="font-serif text-5xl leading-tight">
            Rooted in rice.
            <br />
            <span className="italic">Made with love.</span>
          </p>
          <p className="mt-4 text-cream/60">Order management</p>
        </div>
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cream/5" />
        <div className="pointer-events-none absolute -bottom-10 right-24 h-48 w-48 rounded-full bg-cream/5" />
      </div>

      <div className="flex items-center justify-center bg-cream px-6 py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          <div>
            <p className="font-serif text-2xl font-semibold text-brand md:hidden">ARISI.</p>
            <h1 className="mt-2 font-serif text-4xl">Welcome back</h1>
            <p className="mt-2 text-muted">Sign in to manage pre-orders.</p>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Username</span>
            <input required name="username" autoComplete="username" autoCapitalize="none" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Password</span>
            <input required name="password" type="password" autoComplete="current-password" className={inputClass} />
          </label>
          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">{error}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-brand py-3 font-medium text-cream transition hover:bg-brand-light disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
