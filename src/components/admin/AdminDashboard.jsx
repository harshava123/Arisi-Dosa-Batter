import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { formatPrice, products } from '../../data/products'
import { SearchIcon, SproutIcon } from '../icons/Icons'
import OrderDrawer from './OrderDrawer'
import {
  SCREENSHOT_BUCKET,
  STATUSES,
  STATUS_LABEL,
  STATUS_STYLE,
  batterItems,
  deliveryItem,
  itemCount,
  localDate,
  prettyDate,
  prettyPhone,
} from './shared'

const REFRESH_MS = 60_000

const VIEWS = [
  { id: 'all', label: 'All orders' },
  { id: 'upcoming', label: 'Upcoming' },
  ...STATUSES.map((s) => ({ id: s, label: STATUS_LABEL[s] })),
]

function StatCard({ label, value, hint, accent }) {
  return (
    <div className={`rounded-2xl p-5 ring-1 ${accent ? 'bg-brand text-cream ring-brand' : 'bg-white ring-sand'}`}>
      <p className={`text-sm ${accent ? 'text-cream/70' : 'text-muted'}`}>{label}</p>
      <p className="mt-2 font-serif text-4xl">{value}</p>
      {hint && <p className={`mt-1 text-xs ${accent ? 'text-cream/60' : 'text-muted'}`}>{hint}</p>}
    </div>
  )
}

function AdminDashboard({ session }) {
  const [params, setParams] = useSearchParams()
  const selectedRef = params.get('ref')
  const [orders, setOrders] = useState([])
  const [urls, setUrls] = useState({})
  const [view, setView] = useState('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)

  const load = useCallback(async () => {
    setError('')
    const { data, error: err } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(500)
    setLoading(false)
    if (err) return setError(err.message)
    setOrders(data)
    setUpdatedAt(new Date())

    const paths = data.map((o) => o.screenshot_path)
    if (paths.length === 0) return
    const signed = await supabase.storage.from(SCREENSHOT_BUCKET).createSignedUrls(paths, 60 * 60)
    if (signed.data) setUrls(Object.fromEntries(signed.data.filter((s) => s.signedUrl).map((s) => [s.path, s.signedUrl])))
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, REFRESH_MS)
    return () => clearInterval(id)
  }, [load])

  const today = localDate(0)
  const tomorrow = localDate(1)

  const stats = useMemo(() => {
    const live = orders.filter((o) => o.status !== 'rejected')
    const forTomorrow = live.filter((o) => o.date === tomorrow)
    const prep = products
      .map((p) => ({
        name: p.name,
        qty: forTomorrow.reduce((sum, o) => sum + (o.items.find((i) => i.name === p.name)?.qty ?? 0), 0),
      }))
      .filter((p) => p.qty > 0)
    return {
      pending: orders.filter((o) => o.status === 'pending').length,
      tomorrowCount: forTomorrow.length,
      tomorrowPacks: forTomorrow.reduce((sum, o) => sum + itemCount(o), 0),
      revenue: orders.filter((o) => o.status === 'verified' || o.status === 'completed').reduce((sum, o) => sum + Number(o.total), 0),
      placedToday: orders.filter((o) => localDate(0) === new Date(o.created_at).toLocaleDateString('sv-SE')).length,
      prep,
    }
  }, [orders, tomorrow])

  const counts = useMemo(() => {
    const c = { all: orders.length, upcoming: orders.filter((o) => o.date >= today && o.status !== 'rejected' && o.status !== 'completed').length }
    STATUSES.forEach((s) => (c[s] = orders.filter((o) => o.status === s).length))
    return c
  }, [orders, today])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders
      .filter((o) => {
        if (view === 'upcoming') return o.date >= today && o.status !== 'rejected' && o.status !== 'completed'
        return view === 'all' || o.status === view
      })
      .filter((o) => !q || [o.reference, o.name, o.phone, o.email, o.address].some((f) => f?.toLowerCase().includes(q)))
      .sort((a, b) => (view === 'upcoming' ? a.date.localeCompare(b.date) : 0))
  }, [orders, view, query, today])

  const selected = orders.find((o) => o.reference === selectedRef)
  const openOrder = (ref) => setParams({ ref })
  const closeOrder = useCallback(() => setParams({}), [setParams])

  const updateStatus = async (id, status) => {
    setBusy(true)
    const { error: err } = await supabase.from('orders').update({ status }).eq('id', id)
    setBusy(false)
    if (err) return setError(err.message)
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  return (
    <div className="min-h-screen bg-[#f4efe8] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col bg-brand text-cream lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center justify-between px-6 py-5 lg:py-7">
          <div className="relative inline-flex items-end font-serif text-2xl font-semibold tracking-[0.04em]">
            ARISI<span className="text-leaf">.</span>
            <SproutIcon className="absolute -top-1.5 right-0 h-3.5 w-3.5 text-leaf" />
            <span className="ml-3 rounded-md bg-cream/10 px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-widest text-cream/70">Admin</span>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="text-sm text-cream/70 hover:text-cream lg:hidden">Sign out</button>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                view === v.id ? 'bg-cream text-brand' : 'text-cream/80 hover:bg-cream/10'
              }`}
            >
              {v.label}
              <span className={`rounded-full px-2 text-xs ${view === v.id ? 'bg-brand/10' : 'bg-cream/10'}`}>{counts[v.id] ?? 0}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto hidden space-y-3 border-t border-cream/10 px-6 py-5 text-sm lg:block">
          <p className="truncate text-cream/60">Signed in as {session.user.email.split('@')[0]}</p>
          <div className="flex justify-between">
            <Link to="/" className="text-cream/80 hover:text-cream">View website ↗</Link>
            <button onClick={() => supabase.auth.signOut()} className="text-cream/80 hover:text-cream">Sign out</button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl">Dashboard</h1>
            <p className="mt-1 text-sm text-muted">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
              {updatedAt && ` · updated ${updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </p>
          </div>
          <button onClick={load} className="rounded-lg bg-white px-4 py-2 text-sm font-medium ring-1 ring-sand hover:bg-sand/40">Refresh</button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard accent label="Awaiting verification" value={stats.pending} hint="Check payment screenshots" />
          <StatCard label="For tomorrow" value={stats.tomorrowCount} hint={`${stats.tomorrowPacks} packs · ${prettyDate(tomorrow)}`} />
          <StatCard label="Placed today" value={stats.placedToday} hint="New pre-orders" />
          <StatCard label="Verified revenue" value={formatPrice(stats.revenue)} hint="Verified + completed" />
        </div>

        {stats.prep.length > 0 && (
          <div className="mt-4 rounded-2xl bg-white p-5 ring-1 ring-sand">
            <p className="text-sm font-semibold">To prepare for {prettyDate(tomorrow)}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {stats.prep.map((p) => (
                <span key={p.name} className="rounded-lg bg-cream px-3 py-2 text-sm ring-1 ring-sand">
                  <strong className="font-serif text-lg">{p.qty}×</strong> {p.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl">{VIEWS.find((v) => v.id === view).label}</h2>
          <label className="relative w-full sm:w-72">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, phone, reference…"
              className="w-full rounded-lg bg-white py-2.5 pl-9 pr-3 text-sm ring-1 ring-sand focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </label>
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">{error}</p>}

        <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-sand">
          {loading ? (
            <p className="p-10 text-center text-muted">Loading orders…</p>
          ) : visible.length === 0 ? (
            <p className="p-10 text-center text-muted">No orders here yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="hidden bg-cream/70 text-xs uppercase tracking-wide text-muted md:table-header-group">
                <tr>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Items</th>
                  <th className="px-5 py-3 font-medium">For</th>
                  <th className="px-5 py-3 text-right font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/70">
                {visible.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => openOrder(o.reference)}
                    className="grid cursor-pointer grid-cols-2 gap-1 px-5 py-4 transition hover:bg-cream/60 md:table-row md:p-0"
                  >
                    <td className="md:px-5 md:py-4">
                      <p className="font-semibold">{o.reference}</p>
                      <p className="text-xs text-muted">{new Date(o.created_at).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="text-right md:px-5 md:py-4 md:text-left">
                      <p className="font-medium">{o.name}</p>
                      <p className="text-xs text-muted">{prettyPhone(o.phone)}</p>
                    </td>
                    <td className="text-muted md:px-5 md:py-4">
                      {batterItems(o).map((i) => `${i.qty}× ${i.name.replace(' + Instant Chutney', ' + Chutney')}`).join(', ')}
                    </td>
                    <td className="text-right md:px-5 md:py-4 md:text-left">
                      <p className={o.date === tomorrow ? 'font-semibold text-brand' : ''}>{prettyDate(o.date)}</p>
                      <p className="text-xs text-muted">
                        {o.method === 'pickup' ? 'Pickup · Spandau' : `Delivery${deliveryItem(o)?.km ? ` · ${deliveryItem(o).km} km` : ''}`}
                      </p>
                    </td>
                    <td className="font-semibold md:px-5 md:py-4 md:text-right">{formatPrice(Number(o.total))}</td>
                    <td className="text-right md:px-5 md:py-4 md:text-left">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STATUS_STYLE[o.status]}`}>
                        {STATUS_LABEL[o.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {selected && (
        <OrderDrawer
          order={selected}
          screenshotUrl={urls[selected.screenshot_path]}
          onClose={closeOrder}
          onStatus={updateStatus}
          busy={busy}
        />
      )}
    </div>
  )
}

export default AdminDashboard
