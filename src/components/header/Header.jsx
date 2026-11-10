import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../common/Logo'
import { useCart } from '../../context/CartContext'
import { CartIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from '../icons/Icons'

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/story', label: 'Our Story' },
  { to: '/recipes', label: 'Recipes' },
  { to: '/order', label: 'Pre-Order', mobileOnly: true },
  { to: '/contact', label: 'Contact' },
]

const linkClass = ({ isActive }) =>
  `relative pb-1 text-[15px] transition-colors hover:text-brand ${
    isActive ? 'font-medium text-brand after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded after:bg-brand' : 'text-ink/80'
  }`

function Header() {
  const { count } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-sand/50 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Logo className="text-3xl" />

        <nav className="hidden items-center gap-6 md:flex lg:gap-10">
          {links.filter((l) => !l.mobileOnly).map((l) => (
            <NavLink key={l.to} to={l.to} end className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-ink">
          <button aria-label="Search" className="hidden hover:text-brand lg:block">
            <SearchIcon className="h-6 w-6" />
          </button>
          <button aria-label="Account" className="hidden hover:text-brand lg:block">
            <UserIcon className="h-6 w-6" />
          </button>
          <Link
            to="/order"
            className="hidden rounded-full bg-brand px-5 py-2 text-sm font-medium text-cream transition hover:bg-brand-light md:block"
          >
            Pre-Order
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative hover:text-brand">
            <CartIcon className="h-7 w-7" />
            <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-semibold text-cream">
              {count}
            </span>
          </Link>
          <button aria-label="Menu" className="md:hidden" onClick={() => setOpen((o) => !o)}>
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 border-t border-sand/50 px-6 py-5 md:hidden">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end className={linkClass} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

export default Header
