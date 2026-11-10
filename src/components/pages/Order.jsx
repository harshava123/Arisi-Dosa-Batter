import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../common/PageHeader'
import Pouch from '../common/Pouch'
import { useCart } from '../../context/CartContext'
import { formatPrice, products } from '../../data/products'
import { CalendarIcon, UploadIcon, WhatsAppIcon } from '../icons/Icons'
import { supabase } from '../../lib/supabase'

const PREBOOK_DAYS = 1
const PICKUP_AREA = 'Spandau, Berlin'
const MAX_UPLOAD_MB = 5
const SCREENSHOT_BUCKET = 'payment-screenshots'
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '4915511049565'

function buildWhatsAppUrl(order) {
  const lines = [
    `*New ARISI pre-order ${order.reference}*`,
    '',
    ...order.items.map((i) => `• ${i.qty} × ${i.name} (${formatPrice(i.price * i.qty)})`),
    `*Total: ${formatPrice(order.total)}*`,
    '',
    `Name: ${order.name}`,
    `Phone: ${order.phone}`,
    `Email: ${order.email}`,
    `Address: ${order.address}`,
    order.method === 'pickup' ? `Pickup from ${PICKUP_AREA} on ${order.date}` : `Delivery on ${order.date}`,
    order.notes ? `Notes: ${order.notes}` : null,
    '',
    `View order & payment screenshot: ${window.location.origin}/admin?ref=${order.reference}`,
  ].filter((l) => l !== null)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}

const inputClass =
  'w-full rounded-xl border border-sand bg-cream px-4 py-3 text-ink placeholder:text-ink/40 focus:border-brand focus:outline-none'

const toDateInput = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function Order() {
  const { lines, clear } = useCart()
  const [qty, setQty] = useState(() =>
    Object.fromEntries(products.map((p) => [p.id, lines.find((l) => l.product.id === p.id)?.qty ?? 0])),
  )
  const [method, setMethod] = useState('pickup')
  const [screenshot, setScreenshot] = useState(null)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle')
  const [confirmation, setConfirmation] = useState(null)

  const minDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + PREBOOK_DAYS)
    return toDateInput(d)
  }, [])

  const total = products.reduce((sum, p) => sum + p.price * qty[p.id], 0)
  const itemCount = Object.values(qty).reduce((a, b) => a + b, 0)

  const changeQty = (id, delta) => setQty((q) => ({ ...q, [id]: Math.max(0, q[id] + delta) }))

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    setError('')
    if (!file) return setScreenshot(null)
    if (!file.type.startsWith('image/')) return setError('Please upload an image (PNG or JPG) of your payment.')
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return setError(`The screenshot must be smaller than ${MAX_UPLOAD_MB} MB.`)
    setScreenshot({ file, url: URL.createObjectURL(file) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (itemCount === 0) return setError('Please add at least one batter to your order.')
    if (!screenshot) return setError('Please upload your payment screenshot so we can verify your order.')

    if (!supabase) return setError('Online ordering is not configured yet. Please message us on WhatsApp.')

    const form = new FormData(e.currentTarget)
    const reference = `ARS-${Date.now().toString(36).toUpperCase().slice(-6)}`
    const items = products.filter((p) => qty[p.id] > 0).map((p) => ({ name: p.name, qty: qty[p.id], price: p.price }))
    const order = {
      reference,
      name: form.get('name').trim(),
      phone: form.get('phone').trim(),
      email: form.get('email').trim(),
      address: form.get('address').trim(),
      method,
      date: form.get('date'),
      notes: form.get('notes').trim() || null,
      items,
      total,
    }

    setStatus('sending')
    try {
      const ext = screenshot.file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${order.date}/${reference}-${crypto.randomUUID()}.${ext}`
      const upload = await supabase.storage
        .from(SCREENSHOT_BUCKET)
        .upload(path, screenshot.file, { contentType: screenshot.file.type, upsert: false })
      if (upload.error) throw upload.error

      const insert = await supabase.from('orders').insert({ ...order, screenshot_path: path })
      if (insert.error) throw insert.error

      const whatsappUrl = buildWhatsAppUrl(order)

      setConfirmation({ ...order, whatsappUrl })
      setStatus('done')
      clear()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.open(whatsappUrl, '_blank', 'noopener')
    } catch (err) {
      console.error(err)
      setStatus('idle')
      setError('Something went wrong sending your order. Please try again, or message us on WhatsApp.')
    }
  }

  if (status === 'done' && confirmation) {
    return (
      <section className="mx-auto max-w-2xl px-6">
        <PageHeader eyebrow="Pre-order received" title={`Thank you, ${confirmation.name}!`} />
        <div className="rounded-2xl bg-cream-dark/70 p-8 ring-1 ring-sand/60">
          <p className="text-muted">
            Your reference is <span className="font-semibold text-ink">{confirmation.reference}</span>. Your order is
            saved. As a last step, send it to us on WhatsApp so we can verify your payment and confirm.
          </p>
          <a
            href={confirmation.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-3.5 font-medium text-white transition hover:brightness-95"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Send order on WhatsApp
          </a>          <ul className="mt-6 divide-y divide-sand">
            {confirmation.items.map((i) => (
              <li key={i.name} className="flex justify-between py-3">
                <span>{i.qty} × {i.name}</span>
                <span>{formatPrice(i.qty * i.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-ink/20 pt-4 text-lg font-medium">
            <span>Total paid</span>
            <span>{formatPrice(confirmation.total)}</span>
          </div>
          <p className="mt-4 text-sm text-muted">
            {confirmation.method === 'pickup'
              ? `Pickup from ${PICKUP_AREA} on ${confirmation.date}`
              : `Delivery to ${confirmation.address} on ${confirmation.date}`}
          </p>
          <Link to="/" className="mt-8 inline-block rounded-full bg-brand px-8 py-3 font-medium text-cream hover:bg-brand-light">
            Back to home
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10">
      <PageHeader
        eyebrow="Pre-Order"
        title="Book your fresh batter"
        subtitle="Every batch is ground and fermented to order, so all batters must be pre-booked."
      />

      <div className="mx-auto mb-10 flex max-w-3xl items-start gap-4 rounded-2xl border border-brand/20 bg-brand/5 p-5 text-sm leading-relaxed">
        <CalendarIcon className="mt-0.5 h-6 w-6 shrink-0 text-brand" />
        <p>
          <strong className="text-brand">Pre-booking required.</strong> Please order at least 1 day in advance. Order
          today and get it tomorrow. Your order is <strong>confirmed only after we verify your payment screenshot</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          <fieldset className="rounded-2xl bg-cream-dark/70 p-6 ring-1 ring-sand/60 sm:p-8">
            <legend className="font-serif text-2xl">1. Choose your batters</legend>
            <ul className="mt-4 divide-y divide-sand">
              {products.map((p) => (
                <li key={p.id} className="flex items-center gap-4 py-4">
                  <Pouch product={p} className="h-20 w-14 shrink-0" />
                  <div className="ml-2 flex-1">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted">{p.weight} · {formatPrice(p.price)}</p>
                  </div>
                  <div className="flex items-center rounded-full bg-cream ring-1 ring-sand">
                    <button type="button" className="px-3 py-1.5 text-lg" onClick={() => changeQty(p.id, -1)} aria-label={`Fewer ${p.name}`}>−</button>
                    <span className="w-6 text-center">{qty[p.id]}</span>
                    <button type="button" className="px-3 py-1.5 text-lg" onClick={() => changeQty(p.id, 1)} aria-label={`More ${p.name}`}>+</button>
                  </div>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl bg-cream-dark/70 p-6 ring-1 ring-sand/60 sm:p-8">
            <legend className="font-serif text-2xl">2. Your details</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required name="name" placeholder="Full name" className={inputClass} />
              <input required name="phone" type="tel" placeholder="Phone / WhatsApp" className={inputClass} />
            </div>
            <input required name="email" type="email" placeholder="Email address" className={inputClass} />
            <textarea required name="address" rows={2} placeholder="Your address (street, house number, postcode, city)" className={inputClass} />

            <div className="flex gap-3">
              {[
                ['pickup', `Pickup from ${PICKUP_AREA}`],
                ['delivery', 'Delivery to my address'],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className={`flex-1 cursor-pointer rounded-xl border px-4 py-3 text-center transition ${
                    method === value ? 'border-brand bg-brand text-cream' : 'border-sand bg-cream'
                  }`}
                >
                  <input type="radio" name="method" value={value} checked={method === value} onChange={() => setMethod(value)} className="sr-only" />
                  {label}
                </label>
              ))}
            </div>
            {method === 'pickup' && (
              <p className="rounded-xl bg-cream px-4 py-3 text-sm text-muted ring-1 ring-sand">
                Pickup is from <strong className="text-ink">{PICKUP_AREA}</strong>. We&apos;ll send you the exact pickup
                point and time when we confirm your order.
              </p>
            )}

            <label className="block">
              <span className="mb-1.5 block text-sm text-muted">Preferred {method === 'pickup' ? 'pickup' : 'delivery'} date</span>
              <input required name="date" type="date" min={minDate} defaultValue={minDate} className={inputClass} />
            </label>
            <textarea name="notes" rows={2} placeholder="Notes (optional)" className={inputClass} />
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl bg-cream-dark/70 p-6 ring-1 ring-sand/60 sm:p-8">
            <legend className="font-serif text-2xl">3. Payment &amp; verification</legend>
            <div className="rounded-xl bg-cream p-5 text-sm leading-relaxed ring-1 ring-sand">
              <p className="font-medium">Pay {formatPrice(total)} using one of the following:</p>
              <ul className="mt-2 space-y-1 text-muted">
                <li><span className="text-ink">Bank transfer:</span> ARISI Batters · IBAN DE00 0000 0000 0000 0000 00</li>
                <li><span className="text-ink">PayPal:</span> pay@arisi.eu</li>
                <li>Please use your name as the payment reference.</li>
              </ul>
            </div>

            <label
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition ${
                screenshot ? 'border-brand bg-brand/5' : 'border-sand bg-cream hover:border-brand/50'
              }`}
            >
              {screenshot ? (
                <>
                  <img src={screenshot.url} alt="Payment screenshot preview" className="max-h-48 rounded-lg object-contain" />
                  <span className="text-sm text-brand">{screenshot.file.name} · click to change</span>
                </>
              ) : (
                <>
                  <UploadIcon className="h-8 w-8 text-brand" />
                  <span className="font-medium">Upload payment screenshot</span>
                  <span className="text-xs text-muted">PNG or JPG, up to {MAX_UPLOAD_MB} MB. Required for verification.</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
            </label>

            <label className="flex items-start gap-3 text-sm text-muted">
              <input required type="checkbox" className="mt-1 accent-[#1e3f24]" />
              I understand my order is confirmed only after ARISI verifies my payment screenshot.
            </label>
          </fieldset>
        </div>

        <aside className="h-fit rounded-2xl bg-brand p-8 text-cream lg:sticky lg:top-28">
          <h3 className="font-serif text-2xl">Order summary</h3>
          <ul className="mt-6 space-y-3 text-cream/80">
            {products.filter((p) => qty[p.id] > 0).map((p) => (
              <li key={p.id} className="flex justify-between gap-4">
                <span>{qty[p.id]} × {p.name}</span>
                <span>{formatPrice(p.price * qty[p.id])}</span>
              </li>
            ))}
            {itemCount === 0 && <li className="text-cream/50">No batters selected yet.</li>}
          </ul>
          <div className="mt-6 flex justify-between border-t border-cream/20 pt-4 text-xl">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          {error && <p className="mt-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">{error}</p>}
          <button
            disabled={status === 'sending'}
            className="mt-6 w-full rounded-full bg-cream py-3.5 font-medium text-brand transition hover:bg-sand disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Place pre-order'}
          </button>
          <p className="mt-4 text-xs leading-relaxed text-cream/60">
            Dosa or Idli batter: {formatPrice(3)} per 500 g. With instant chutney: {formatPrice(5)}.
          </p>
        </aside>
      </form>
    </section>
  )
}

export default Order
