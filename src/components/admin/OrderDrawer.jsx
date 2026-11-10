import { useEffect } from 'react'
import { formatPrice } from '../../data/products'
import { CloseIcon, WhatsAppIcon } from '../icons/Icons'
import { STATUSES, STATUS_LABEL, STATUS_STYLE, customerMessage, prettyDate, toWhatsAppNumber } from './shared'

function Row({ label, children }) {
  return (
    <div className="flex gap-4 py-2.5">
      <dt className="w-24 shrink-0 text-sm text-muted">{label}</dt>
      <dd className="min-w-0 flex-1 break-words text-sm">{children}</dd>
    </div>
  )
}

function OrderDrawer({ order, screenshotUrl, onClose, onStatus, busy }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" />

      <aside className="relative flex h-full w-full max-w-xl flex-col bg-cream shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-sand px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">Order</p>
            <h2 className="font-serif text-3xl">{order.reference}</h2>
            <p className="mt-1 text-sm text-muted">Placed {new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLE[order.status]}`}>
              {STATUS_LABEL[order.status]}
            </span>
            <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 hover:bg-sand/60">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Payment screenshot</h3>
            {screenshotUrl ? (
              <a href={screenshotUrl} target="_blank" rel="noopener noreferrer" className="block">
                <img src={screenshotUrl} alt={`Payment screenshot for ${order.reference}`} className="max-h-[420px] w-full rounded-xl bg-white object-contain ring-1 ring-sand" />
                <span className="mt-1.5 block text-xs text-muted">Tap to open full size</span>
              </a>
            ) : (
              <div className="grid h-48 place-items-center rounded-xl bg-white text-sm text-muted ring-1 ring-sand">Loading screenshot…</div>
            )}
          </section>

          <section className="rounded-xl bg-white p-4 ring-1 ring-sand">
            <ul className="divide-y divide-sand/70">
              {order.items.map((i) => (
                <li key={i.name} className={`flex justify-between py-2 text-sm ${i.type === 'delivery' ? 'text-muted' : ''}`}>
                  <span>{i.type === 'delivery' ? i.name : `${i.qty} × ${i.name}`}</span>
                  <span>{formatPrice(i.qty * i.price)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 flex justify-between border-t border-ink/15 pt-3 font-semibold">
              <span>Total</span>
              <span>{formatPrice(Number(order.total))}</span>
            </p>
          </section>

          <section>
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted">Customer</h3>
            <dl className="divide-y divide-sand/70">
              <Row label="Name">{order.name}</Row>
              <Row label="Phone"><a href={`tel:${order.phone}`} className="text-brand hover:underline">{order.phone}</a></Row>
              <Row label="Email"><a href={`mailto:${order.email}`} className="text-brand hover:underline">{order.email}</a></Row>
              <Row label="Address">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  {order.address}
                </a>
              </Row>
              <Row label={order.method === 'pickup' ? 'Pickup' : 'Delivery'}>
                {prettyDate(order.date)} · {order.method === 'pickup' ? 'Spandau' : 'to address'}
              </Row>
              {order.notes && <Row label="Notes">{order.notes}</Row>}
            </dl>
          </section>
        </div>

        <footer className="space-y-3 border-t border-sand bg-cream-dark/60 px-6 py-5">
          <div className="grid grid-cols-3 gap-2">
            {STATUSES.filter((s) => s !== order.status).map((s) => (
              <button
                key={s}
                disabled={busy}
                onClick={() => onStatus(order.id, s)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium capitalize transition disabled:opacity-50 ${
                  s === 'verified'
                    ? 'bg-brand text-cream hover:bg-brand-light'
                    : 'bg-white text-ink ring-1 ring-sand hover:bg-sand/40'
                }`}
              >
                {s === 'pending' ? 'Back to pending' : `Mark ${s}`}
              </button>
            ))}
          </div>
          <a
            href={`https://wa.me/${toWhatsAppNumber(order.phone)}?text=${encodeURIComponent(customerMessage(order))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2.5 text-sm font-medium text-white hover:brightness-95"
          >
            <WhatsAppIcon className="h-4 w-4" /> Message customer on WhatsApp
          </a>
        </footer>
      </aside>
    </div>
  )
}

export default OrderDrawer
