import { Link } from 'react-router-dom'
import { SproutIcon } from '../icons/Icons'

function Logo({ className = '' }) {
  return (
    <Link to="/" className={`relative inline-flex items-end font-serif font-semibold tracking-[0.04em] text-brand ${className}`}>
      ARISI
      <span className="text-leaf">.</span>
      <SproutIcon className="absolute -top-1.5 right-0 h-4 w-4 text-leaf" />
    </Link>
  )
}

export default Logo
