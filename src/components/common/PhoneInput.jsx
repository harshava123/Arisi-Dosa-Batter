import { COUNTRY_OPTIONS } from '../../lib/phone'

function PhoneInput({ country, onCountryChange, value, onChange, onBlur, invalid, className = '' }) {
  return (
    <div
      className={`flex overflow-hidden rounded-xl border bg-cream focus-within:border-brand ${
        invalid ? 'border-red-400' : 'border-sand'
      } ${className}`}
    >
      <select
        aria-label="Country code"
        value={country}
        onChange={(e) => onCountryChange(e.target.value)}
        className="w-28 shrink-0 cursor-pointer border-r border-sand bg-cream-dark/60 px-2 text-sm text-ink focus:outline-none"
      >
        {COUNTRY_OPTIONS.map((o) => (
          <option key={o.code} value={o.code}>
            {o.label}
          </option>
        ))}
      </select>
      <input
        required
        name="phone"
        type="tel"
        autoComplete="tel-national"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder="WhatsApp number"
        className="min-w-0 flex-1 bg-transparent px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none"
      />
    </div>
  )
}

export default PhoneInput
