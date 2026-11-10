import { Link } from 'react-router-dom'
import Logo from '../common/Logo'

function Footer() {
  return (
    <footer className="mt-24 bg-brand text-cream/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          <div className="inline-block rounded-lg bg-cream px-4 py-2">
            <Logo className="text-2xl" />
          </div>
          <p className="mt-5 font-serif text-2xl italic text-cream">Rooted in rice. Made with love.</p>
          <p className="mt-3 max-w-sm leading-relaxed">
            Stone-ground, naturally fermented dosa and idli batters, made fresh for every pre-order.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg text-cream">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-cream">Our Batters</Link></li>
            <li><Link to="/order" className="hover:text-cream">Pre-Order</Link></li>
            <li><Link to="/recipes" className="hover:text-cream">Recipes</Link></li>
            <li><Link to="/cart" className="hover:text-cream">Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg text-cream">Ordering</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Pre-book 1 day ahead</li>
            <li>Order today, get it tomorrow</li>
            <li>Pickup from Spandau</li>
            <li><Link to="/contact" className="hover:text-cream">Contact us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} ARISI Batters. Rooted in rice. Made with love.
      </div>
    </footer>
  )
}

export default Footer
