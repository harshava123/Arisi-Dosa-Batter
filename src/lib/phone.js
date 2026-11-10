import { getCountries, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js/max'

export const DEFAULT_COUNTRY = 'DE'
const PREFERRED = ['DE', 'IN']
const FALLBACK_COUNTRIES = ['DE', 'IN', 'AT', 'CH', 'NL', 'PL', 'FR', 'IT', 'GB', 'LK']

const regionNames = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(['en'], { type: 'region' }) : null
const countryName = (code) => regionNames?.of(code) ?? code
const flag = (code) => String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)))

export const COUNTRY_OPTIONS = (() => {
  const all = getCountries().map((code) => ({
    code,
    dial: `+${getCountryCallingCode(code)}`,
    label: `${flag(code)} +${getCountryCallingCode(code)}  ${countryName(code)}`,
  }))
  const preferred = PREFERRED.map((c) => all.find((o) => o.code === c))
  const rest = all.filter((o) => !PREFERRED.includes(o.code)).sort((a, b) => countryName(a.code).localeCompare(countryName(b.code)))
  return [...preferred, ...rest]
})()

// Numbers typed with "+" or "00" are read as international and ignore the selected country.
export function parsePhone(input, country = DEFAULT_COUNTRY) {
  const trimmed = input.trim().replace(/^00/, '+')
  const parsed = parsePhoneNumberFromString(trimmed, country)
  return parsed?.isValid() ? parsed : null
}

// For orders saved before country codes were required: try likely countries until one fits.
export function toInternational(phone) {
  if (!phone) return null
  if (/^\s*(\+|00)/.test(phone)) return parsePhone(phone)
  for (const country of FALLBACK_COUNTRIES) {
    const parsed = parsePhone(phone, country)
    if (parsed) return parsed
  }
  return null
}

export const whatsAppDigits = (phone) => toInternational(phone)?.number.slice(1) ?? phone.replace(/\D/g, '')
export const prettyPhone = (phone) => toInternational(phone)?.formatInternational() ?? phone
