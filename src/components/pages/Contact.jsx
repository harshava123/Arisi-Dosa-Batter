import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../common/PageHeader'

const inputClass =
  'w-full rounded-xl border border-sand bg-cream px-4 py-3 text-ink placeholder:text-ink/40 focus:border-brand focus:outline-none'

function Contact() {
  const [sent, setSent] = useState(false)

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10">
      <PageHeader eyebrow="Contact" title="Say hello" subtitle="Questions about our batters, bulk orders or events? We'd love to hear from you." />

      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6 rounded-2xl bg-brand p-8 text-cream/80">
          <div>
            <h3 className="font-serif text-xl text-cream">Want to order?</h3>
            <p className="mt-2">All batters must be pre-booked at least 1 day ahead. Order today and get it tomorrow. Please upload a payment screenshot for verification.</p>
            <Link to="/order" className="mt-4 inline-block rounded-full bg-cream px-6 py-2.5 font-medium text-brand hover:bg-sand">
              Go to pre-order form
            </Link>
          </div>
          <div>
            <h3 className="font-serif text-xl text-cream">Prices</h3>
            <p className="mt-2">Dosa or Idli batter: €3 per 500 g<br />With instant chutney: €5 per 500 g</p>
          </div>
          <div>
            <h3 className="font-serif text-xl text-cream">Pickup</h3>
            <p className="mt-2">Pick up your order for free from Spandau, Berlin, or get it delivered: €1 within 5 km, €2 for 5–10 km.</p>
          </div>
        </div>

        <form
          className="space-y-4 rounded-2xl bg-cream-dark/70 p-8 ring-1 ring-sand/60"
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
            e.currentTarget.reset()
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Your name" className={inputClass} />
            <input required type="email" placeholder="Email address" className={inputClass} />
          </div>
          <input placeholder="Subject" className={inputClass} />
          <textarea required rows={5} placeholder="Your message" className={inputClass} />
          <button className="rounded-full bg-brand px-8 py-3 font-medium text-cream hover:bg-brand-light">Send message</button>
          {sent && <p className="text-sm text-brand">Thanks! We'll get back to you soon.</p>}
        </form>
      </div>
    </section>
  )
}

export default Contact
