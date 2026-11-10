import { useEffect, useRef, useState } from 'react'

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

const BATTER = '#f2e8d3'
const BATTER_TOP = '#f9f3e6'
const PIVOT = { x: 170, y: 170 }
const SPOUT = { x: 80, y: -63 }
const BOWL = { cx: 300, rimY: 400, rx: 170, ry: 36, bottom: 560 }
const BOWL_BODY = 'M130 400 C130 490 200 560 300 560 C400 560 470 490 470 400 A170 36 0 0 1 130 400 Z'

// Half-width of the bowl interior along its left wall, sampled from the body curve.
const WALL = Array.from({ length: 60 }, (_, i) => {
  const t = i / 59
  const u = 1 - t
  const x = u ** 3 * 130 + 3 * u * u * t * 130 + 3 * u * t * t * 200 + t ** 3 * 300
  const y = u ** 3 * 400 + 3 * u * u * t * 490 + 3 * u * t * t * 560 + t ** 3 * 560
  return { y, half: BOWL.cx - x }
})
const halfWidthAt = (y) => WALL.reduce((best, p) => (Math.abs(p.y - y) < Math.abs(best.y - y) ? p : best)).half

const BUBBLES = [
  [230, 520, 3], [262, 540, 2], [340, 530, 2.5], [372, 505, 3], [205, 480, 2],
  [395, 470, 2.5], [300, 545, 2], [250, 455, 2.5], [350, 445, 2], [415, 430, 2], [185, 435, 2.5],
]

const steps = [
  { at: 0, title: 'Soaked overnight', text: 'Rice and urad dal rest in water for hours until they are soft enough to grind silky smooth.' },
  { at: 0.25, title: 'Stone-ground, never rushed', text: 'Slow wet-grinding keeps the batter cool and gives it that thick, velvety body.' },
  { at: 0.5, title: 'Thick enough to ribbon', text: 'Watch it pour: rich, slow and ribbon-like, never watery. That is how proper batter should look.' },
  { at: 0.75, title: 'Fermented naturally', text: 'Twelve hours of natural fermentation for airy idlis and crisp, lacy dosas.' },
]

function BatterPour() {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf
    const measure = () => {
      const el = sectionRef.current
      if (!el) return null
      const rect = el.getBoundingClientRect()
      setProgress(clamp(-rect.top / (rect.height - window.innerHeight)))
      return rect
    }
    const tick = (now) => {
      const rect = measure()
      if (rect && !reduceMotion && rect.top < window.innerHeight && rect.bottom > 0) setTime(now / 1000)
      raf = requestAnimationFrame(tick)
    }
    measure()
    raf = requestAnimationFrame(tick)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  const p = progress
  const tilt = 58 * smooth(0, 0.18, p) * (1 - smooth(0.86, 1, p))
  const rad = (tilt * Math.PI) / 180
  const sx = PIVOT.x + SPOUT.x * Math.cos(rad) - SPOUT.y * Math.sin(rad)
  const sy = PIVOT.y + SPOUT.x * Math.sin(rad) + SPOUT.y * Math.cos(rad)

  const fill = smooth(0.22, 0.86, p)
  const levelY = lerp(BOWL.bottom - 10, BOWL.rimY + 14, fill)
  const surfaceRx = halfWidthAt(levelY) - 2
  const surfaceRy = surfaceRx * (BOWL.ry / BOWL.rx)

  const head = smooth(0.14, 0.26, p)
  const tail = smooth(0.8, 0.9, p)
  const streamOn = head - tail > 0.004
  const along = (s) => ({ x: sx + 18 * (1 - (1 - s) ** 2), y: sy + s * (levelY - sy) })

  const streamPoints = streamOn
    ? Array.from({ length: 14 }, (_, i) => along(lerp(tail, head, i / 13)))
    : []
  const streamPath = streamPoints.map((pt, i) => `${i ? 'L' : 'M'}${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ')
  const streamWidth = 26 + 2.5 * Math.sin(time * 5)

  const blobs = streamOn
    ? Array.from({ length: 6 }, (_, i) => {
        const s = (time * 0.55 + i / 6) % 1
        return { ...along(lerp(tail, head, s)), r: 15 + 3 * Math.sin(time * 3 + i * 1.7) }
      })
    : []

  const impactX = sx + 18
  const mound = 30 * smooth(0.24, 0.34, p) * (1 - smooth(0.88, 0.97, p))
  const wobble = Math.sin(time * 4) * 2

  const active = steps.reduce((idx, step, i) => (p >= step.at ? i : idx), 0)

  return (
    <section ref={sectionRef} className="relative h-[320vh] bg-brand text-cream">
      <div className="sticky top-20 flex h-[calc(100vh-5rem)] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-6 md:grid-cols-[1fr_1.1fr] lg:px-10">
          <div className="order-2 md:order-1">
            <p className="text-sm uppercase tracking-[0.25em] text-cream/60">The ARISI pour</p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-tight lg:text-5xl">
              Thick. Velvety. <span className="italic">Honest.</span>
            </h2>

            <ol className="mt-8 space-y-5">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className={`border-l-2 pl-5 transition-all duration-500 ${
                    i === active ? 'border-cream opacity-100' : 'border-cream/15 opacity-40'
                  }`}
                >
                  <h3 className="font-serif text-xl">{step.title}</h3>
                  <p
                    className={`overflow-hidden text-cream/75 transition-all duration-500 ${
                      i === active ? 'mt-1 max-h-24' : 'max-h-0'
                    }`}
                  >
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-8 h-1 w-full max-w-xs overflow-hidden rounded-full bg-cream/15">
              <div className="h-full rounded-full bg-cream" style={{ width: `${p * 100}%` }} />
            </div>
          </div>

          <div className="relative order-1 md:order-2">
            <svg viewBox="0 0 600 600" className="mx-auto h-[48vh] w-auto md:h-[72vh]" role="img" aria-label="Thick batter being poured into a bowl">
              <defs>
                <filter id="goo" filterUnits="userSpaceOnUse" x="0" y="0" width="600" height="600">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
                </filter>
                <clipPath id="bowl-inside">
                  <path d={BOWL_BODY} />
                  <ellipse cx={BOWL.cx} cy={BOWL.rimY} rx={BOWL.rx} ry={BOWL.ry} />
                </clipPath>
                <linearGradient id="batter-depth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={BATTER} />
                  <stop offset="1" stopColor="#ddcba9" />
                </linearGradient>
                <linearGradient id="clay" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#b9774a" />
                  <stop offset="1" stopColor="#7a4728" />
                </linearGradient>
                <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor="#f9f2ec" stopOpacity="0.14" />
                  <stop offset="1" stopColor="#f9f2ec" stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle cx="300" cy="380" r="280" fill="url(#glow)" />
              <ellipse cx={BOWL.cx} cy="575" rx="190" ry="16" fill="#000" opacity="0.25" />

              <ellipse cx={BOWL.cx} cy={BOWL.rimY} rx={BOWL.rx} ry={BOWL.ry} fill="#f9f2ec" opacity="0.06" stroke="#f9f2ec" strokeOpacity="0.25" strokeWidth="2" />

              <g clipPath="url(#bowl-inside)">
                <rect x="100" y={levelY} width="400" height={600 - levelY} fill="url(#batter-depth)" />
                {BUBBLES.filter(([, y, r]) => y > levelY + r + 6).map(([x, y, r]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y + Math.sin(time * 1.5 + x) * 1.5} r={r} fill="#fff" opacity="0.35" />
                ))}
                <ellipse cx={BOWL.cx} cy={levelY} rx={surfaceRx} ry={surfaceRy} fill={BATTER_TOP} />
                <ellipse cx={BOWL.cx - 30} cy={levelY - surfaceRy * 0.3} rx={surfaceRx * 0.45} ry={surfaceRy * 0.25} fill="#fff" opacity="0.35" />
              </g>

              <g filter="url(#goo)" fill={BATTER}>
                {streamOn && <path d={streamPath} stroke={BATTER} strokeWidth={streamWidth} strokeLinecap="round" fill="none" />}
                {blobs.map((b, i) => (
                  <circle key={i} cx={b.x} cy={b.y} r={b.r} />
                ))}
                {streamOn && tail < 0.02 && <circle cx={sx + 4} cy={sy + 6} r="13" />}
                {mound > 0.5 && (
                  <>
                    <ellipse cx={impactX} cy={levelY - mound * 0.35} rx={mound * 1.3} ry={mound * 0.7 + wobble} />
                    <circle cx={impactX - 26} cy={levelY + 2} r={mound * 0.5} />
                    <circle cx={impactX + 28} cy={levelY + 2} r={mound * 0.55} />
                  </>
                )}
              </g>

              {streamOn && (
                <path
                  d={streamPath}
                  transform="translate(-7 0)"
                  stroke="#fff"
                  strokeOpacity="0.45"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              )}

              <path d={BOWL_BODY} fill="#f9f2ec" fillOpacity="0.07" stroke="#f9f2ec" strokeOpacity="0.45" strokeWidth="2.5" />
              <path d="M470 400 A170 36 0 0 1 130 400" fill="none" stroke="#f9f2ec" strokeOpacity="0.7" strokeWidth="3" />
              <path d="M160 440 C168 492 210 532 250 546" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
              <path d="M440 430 C436 460 424 482 410 498" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="4" strokeLinecap="round" />

              <g transform={`translate(${PIVOT.x} ${PIVOT.y}) rotate(${tilt})`}>
                <path d="M-58 -60 C-92 -10 -80 60 -30 80 C0 92 30 92 56 78 C100 56 96 -10 60 -60 Z" fill="url(#clay)" />
                <path d="M-74 4 C-30 22 40 22 84 4" fill="none" stroke="#e0a879" strokeOpacity="0.5" strokeWidth="3" />
                <path d="M-70 22 C-30 40 40 40 80 22" fill="none" stroke="#5e341c" strokeOpacity="0.5" strokeWidth="2" />
                <ellipse cx="1" cy="-62" rx="62" ry="12" fill="#6b3d22" />
                <ellipse cx="1" cy="-60" rx="52" ry="8" fill={BATTER} />
                <path d="M56 -66 Q78 -71 84 -62 Q72 -57 58 -57 Z" fill="#a4693f" />
                <ellipse cx="1" cy="-62" rx="62" ry="12" fill="none" stroke="#c98a5c" strokeWidth="4" />
              </g>
            </svg>

            <p
              className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs uppercase tracking-[0.3em] text-cream/60 transition-opacity duration-500"
              style={{ opacity: p < 0.05 ? 1 : 0 }}
            >
              Scroll to pour ↓
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BatterPour
