import { Link } from 'react-router-dom'
import PageHeader from '../common/PageHeader'
import Pouch from '../common/Pouch'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../data/products'

function Cart() {
  const { lines, total, setQty, clear } = useCart()

  if (lines.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 text-center lg:px-10">
        <PageHeader title="Your cart is empty" subtitle="Fresh batter is just a click away." />
        <Link to="/products" className="inline-block rounded-full bg-brand px-8 py-3.5 font-medium text-cream hover:bg-brand-light">
          Browse batters
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10">
      <PageHeader title="Your Cart" />
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <ul className="space-y-4">
          {lines.map(({ product, qty }) => (
            <li key={product.id} className="flex items-center gap-5 rounded-2xl bg-cream-dark/70 p-4 ring-1 ring-sand/60">
              <Pouch product={product} className="h-28 w-20 shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-muted">{product.weight} · {formatPrice(product.price)}</p>
              </div>
              <div className="flex items-center rounded-full ring-1 ring-sand">
                <button className="px-3 py-1.5 text-lg" onClick={() => setQty(product.id, qty - 1)} aria-label="Decrease">−</button>
                <span className="w-6 text-center">{qty}</span>
                <button className="px-3 py-1.5 text-lg" onClick={() => setQty(product.id, qty + 1)} aria-label="Increase">+</button>
              </div>
              <p className="w-20 text-right font-medium">{formatPrice(product.price * qty)}</p>
            </li>
          ))}
          <button onClick={clear} className="text-sm text-muted underline-offset-4 hover:underline">Clear cart</button>
        </ul>

        <aside className="h-fit rounded-2xl bg-brand p-8 text-cream">
          <h3 className="font-serif text-2xl">Order summary</h3>
          <div className="mt-6 flex justify-between border-t border-cream/20 pt-4 text-lg">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream/60">
            All batters are made to order. Continue to pre-book a date and upload your payment screenshot.
          </p>
          <Link to="/order" className="mt-6 block w-full rounded-full bg-cream py-3.5 text-center font-medium text-brand hover:bg-sand">
            Continue to pre-order
          </Link>
        </aside>
      </div>
    </section>
  )
}

export default Cart
