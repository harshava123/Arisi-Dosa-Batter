import { formatPrice } from '../../data/products'

export const SCREENSHOT_BUCKET = 'payment-screenshots'
export const ADMIN_EMAIL_DOMAIN = 'arisi.app'
export const STATUSES = ['pending', 'verified', 'completed', 'rejected']

export const STATUS_STYLE = {
  pending: 'bg-amber-100 text-amber-800 ring-amber-200',
  verified: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  completed: 'bg-stone-200 text-stone-700 ring-stone-300',
  rejected: 'bg-red-100 text-red-700 ring-red-200',
}

export const STATUS_LABEL = {
  pending: 'Awaiting verification',
  verified: 'Verified',
  completed: 'Completed',
  rejected: 'Rejected',
}

export const localDate = (offsetDays = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const prettyDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })

export const itemCount = (order) => order.items.reduce((sum, i) => sum + i.qty, 0)

export function toWhatsAppNumber(phone) {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  else if (digits.startsWith('0')) digits = `49${digits.slice(1)}`
  return digits
}

export function customerMessage(order) {
  const total = formatPrice(Number(order.total))
  const when = order.method === 'pickup' ? `for pickup in Spandau on ${prettyDate(order.date)}` : `for delivery on ${prettyDate(order.date)}`
  if (order.status === 'rejected') {
    return `Hi ${order.name}, this is ARISI about order ${order.reference} (${total}). We could not verify your payment. Could you please send the payment screenshot again?`
  }
  return `Hi ${order.name}, your ARISI order ${order.reference} (${total}) is confirmed ${when}. Thank you!`
}
