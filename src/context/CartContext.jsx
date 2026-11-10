import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { products } from '../data/products'

const CartContext = createContext(null)
const STORAGE_KEY = 'arisi-cart'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo(() => {
    const lines = Object.entries(items)
      .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
      .filter((line) => line.product)

    return {
      lines,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      total: lines.reduce((sum, l) => sum + l.qty * l.product.price, 0),
      add: (id) => setItems((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 })),
      setQty: (id, qty) =>
        setItems((prev) => {
          const next = { ...prev }
          if (qty <= 0) delete next[id]
          else next[id] = qty
          return next
        }),
      clear: () => setItems({}),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext)
}
