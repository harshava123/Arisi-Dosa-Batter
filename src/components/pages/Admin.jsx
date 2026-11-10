import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../common/PageHeader'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../data/products'
import { WhatsAppIcon } from '../icons/Icons'

const SCREENSHOT_BUCKET = 'payment-screenshots'
const STATUSES = ['pending', 'verified', 'rejected', 'completed']
const STATUS_STYLE = {
  pending: 'bg-amber-100 text-amber-800',
  verified: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-sand text-ink',
}

const inputClass =
  'w-full rounded-xl border border-sand bg-cream px-4 py-3 text-ink placeholder:text-ink/40 focus:border-brand focus:outline-none'

function toWhatsAppNumber(phone) {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  else if (digits.startsWith('0')) digits = `49${digits.slice(1)}`
  return digits
}

function customerMessage(order) {
  const when = order.method === 'pickup' ? `for pickup in Spandau on ${order.date}` : `for delivery on ${order.date}`
  return `Hi ${order.name}, your ARISI order ${order.reference} (${formatPrice(Number(order.total))}) is confirmed ${when}. Thank you!`
}

function Login() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({
      email: form.get('email'),
      password: form.get('password'),
    })
    setBusy(false)
    if (err) setError(err.message)
  }

  return (
    <section className="mx-auto max-w-md px-6">
      <PageHeader eyebrow="ARISI" title="Orders login" />
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-cream-dark/70 p-8 ring-1 ring-sand/60">
        <input required name="email" type="email" autoComplete="email" placeholder="Email" className={inputClass} />
        <input required name="password" type="password" autoComplete="current-password" placeholder="Password" className={inputClass} />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="w-full rounded-full bg-brand py-3 font-medium text-cream hover:bg-brand-light disabled:opacity-60">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </section>
  )
}

function OrderCard({ order, screenshotUrl, highlighted, onStatus }) {
  const cardRef = useRef(null)

  useEffect(() => {
    if (highlighted) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [highlighted])

  return (
    <article
      ref={cardRef}
      className={`scroll-mt-28 rounded-2xl bg-cream-dark/70 p-6 ring-1 sm:p-8 ${highlighted ? 'ring-2 ring-brand' : 'ring-sand/60'}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-2xl">{order.reference}</h3>
          <p className="text-sm text-muted">Placed {new Date(order.created_at).toLocaleString()}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLE[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <ul className="divide-y divide-sand">
            {order.items.map((i) => (
              <li key={i.name} className="flex justify-between py-2">
                <span>{i.qty} × {i.name}</span>
                <span>{formatPrice(i.qty * i.price)}</span>
              </li>
            ))}
          </ul>
          <p className="flex justify-between border-t border-ink/20 pt-2 text-lg font-medium">
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </p>

          <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
            <dt className="text-muted">Name</dt><dd>{order.name}</dd>
            <dt className="text-muted">Phone</dt><dd>{order.phone}</dd>
            <dt className="text-muted">Email</dt><dd>{order.email}</dd>
            <dt className="text-muted">Address</dt><dd>{order.address}</dd>
            <dt className="text-muted">{order.method === 'pickup' ? 'Pickup' : 'Delivery'}</dt>
            <dd>{order.method === 'pickup' ? 'Spandau' : 'To address'} on {order.date}</dd>
            {order.notes && (<><dt className="text-muted">Notes</dt><dd>{order.notes}</dd></>)}
          </dl>
        </div>

        <div>
          {screenshotUrl ? (
            <a href={screenshotUrl} target="_blank" rel="noopener noreferrer" className="block">
              <img src={screenshotUrl} alt={`Payment screenshot for ${order.reference}`} className="max-h-80 w-full rounded-xl bg-cream object-contain ring-1 ring-sand" />
              <span className="mt-1 block text-center text-xs text-muted">Tap to open full size</span>
            </a>
          ) : (
            <div className="grid h-48 place-items-center rounded-xl bg-cream text-sm text-muted ring-1 ring-sand">Loading screenshot…</div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUSES.filter((s) => s !== order.status).map((s) => (
          <button
            key={s}
            onClick={() => onStatus(order.id, s)}
            className="rounded-full border border-brand px-4 py-2 text-sm font-medium capitalize text-brand hover:bg-brand hover:text-cream"
          >
            Mark {s}
          </button>
        ))}
        <a
          href={`https://wa.me/${toWhatsAppNumber(order.phone)}?text=${encodeURIComponent(customerMessage(order))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:brightness-95"
        >
          <WhatsAppIcon className="h-4 w-4" /> Message customer
        </a>
      </div>
    </article>
  )
}

function Orders({ session }) {
  const [params] = useSearchParams()
  const highlightRef = params.get('ref')
  const [orders, setOrders] = useState([])
  const [urls, setUrls] = useState({})
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200)
    setLoading(false)
    if (err) return setError(err.message)
    setOrders(data)

    const paths = data.map((o) => o.screenshot_path)
    if (paths.length === 0) return
    const signed = await supabase.storage.from(SCREENSHOT_BUCKET).createSignedUrls(paths, 60 * 60)
    if (signed.data) setUrls(Object.fromEntries(signed.data.filter((s) => s.signedUrl).map((s) => [s.path, s.signedUrl])))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const updateStatus = async (id, status) => {
    const { error: err } = await supabase.from('orders').update({ status }).eq('id', id)
    if (err) return setError(err.message)
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <section className="mx-auto max-w-5xl px-6">
      <PageHeader eyebrow="ARISI" title="Orders" subtitle={`Signed in as ${session.user.email}`} />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-2 text-sm capitalize ${filter === s ? 'bg-brand text-cream' : 'bg-cream-dark ring-1 ring-sand'}`}
          >
            {s} {s !== 'all' && `(${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
        <button onClick={load} className="ml-auto text-sm text-brand underline-offset-4 hover:underline">Refresh</button>
        <button onClick={() => supabase.auth.signOut()} className="text-sm text-muted underline-offset-4 hover:underline">Sign out</button>
      </div>

      {error && <p className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">{error}</p>}
      {loading && <p className="text-muted">Loading orders…</p>}
      {!loading && visible.length === 0 && (
        <p className="rounded-2xl bg-cream-dark/70 p-8 text-center text-muted ring-1 ring-sand/60">
          No orders here. If you expected some, make sure you are signed in with the owner account.
        </p>
      )}

      <div className="space-y-6">
        {visible.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            screenshotUrl={urls[o.screenshot_path]}
            highlighted={o.reference === highlightRef}
            onStatus={updateStatus}
          />
        ))}
      </div>
    </section>
  )
}

function Admin() {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!supabase) return <PageHeader title="Orders" subtitle="Supabase is not configured." />
  if (!ready) return <PageHeader title="Orders" subtitle="Loading…" />
  return session ? <Orders session={session} /> : <Login />
}

export default Admin
