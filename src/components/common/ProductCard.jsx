import { useState } from 'react'
import Pouch from './Pouch'
import { CartIcon } from '../icons/Icons'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../data/products'

function ProductCard({ product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    add(product.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article className="group flex gap-5 rounded-2xl bg-cream-dark/70 p-5 ring-1 ring-sand/60 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-25px_rgba(60,40,20,0.5)]">
      <Pouch product={product} className="h-44 w-28 shrink-0 transition group-hover:-rotate-2" />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium leading-snug text-ink">{product.name}</h3>
          <span className="shrink-0 rounded-md border border-ink/60 px-1.5 py-0.5 text-xs font-medium">
            {product.weight}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{product.description}</p>
        <p className="mt-3 text-xl font-medium">{formatPrice(product.price)}</p>
        <button
          onClick={handleAdd}
          className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-medium text-cream transition hover:bg-brand-light"
        >
          <CartIcon className="h-4 w-4" />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
