import { Link } from 'react-router-dom'
import ProductCard from '../common/ProductCard'
import BatterPour from '../home/BatterPour'
import { products } from '../../data/products'
import { ArrowRight, CalendarIcon, ClockIcon, LeafIcon, PlayIcon, PotIcon, UploadIcon } from '../icons/Icons'

const features = [
  { Icon: LeafIcon, label: ['Natural', 'Ingredients'] },
  { Icon: ClockIcon, label: ['Naturally', 'Fermented'] },
  { Icon: PotIcon, label: ['Instant', 'Chutney'] },
  { Icon: CalendarIcon, label: ['Pre-booked', '& Fresh'] },
]

const chutneySteps = [
  { n: '01', title: 'Empty the sachet', text: 'Tip the chutney powder into a small bowl.' },
  { n: '02', title: 'Pour hot water', text: 'Add hot water little by little until it looks right to you.' },
  { n: '03', title: 'Stir & serve', text: 'Stir, rest for a minute, and your chutney is ready.' },
]

const orderSteps = [
  { Icon: CalendarIcon, title: 'Pre-book your batter', text: 'Order at least 1 day ahead. Order today and get it tomorrow. Every batch is made fresh to order.' },
  { Icon: UploadIcon, title: 'Pay & upload screenshot', text: 'Pay by bank transfer, then upload a screenshot of the payment with your order.' },
  { Icon: LeafIcon, title: 'We verify & prepare', text: 'Once we verify your payment, we confirm your order and grind your batter fresh.' },
]

function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-6 pb-10 pt-10 md:grid-cols-[1fr_1.1fr] lg:px-10 lg:pt-14">
          <div className="relative z-10">
            <p className="flex items-center gap-4 text-sm uppercase tracking-[0.25em] text-ink/80">
              Rooted in rice. Made with love.
              <span className="h-px w-12 bg-ink/40" />
            </p>

            <h1 className="mt-6 font-serif text-5xl font-medium leading-[1.12] tracking-tight lg:text-6xl xl:text-7xl">
              Good mornings
              <br />
              start with a{' '}
              <span className="relative inline-block italic text-brand">
                dosa
                <svg viewBox="0 0 200 20" className="absolute -bottom-3 left-0 w-full text-brand" fill="none">
                  <path d="M3 15C50 4 140 2 197 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-brand">.</span>
            </h1>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-ink/80">
              <em>Arisi</em> means rice. Our batters are stone-ground and naturally fermented, made with simple,
              honest ingredients.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/order"
                className="inline-flex items-center gap-3 rounded-full bg-brand px-7 py-3 font-medium text-cream transition hover:bg-brand-light"
              >
                Pre-Order Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/story"
                className="inline-flex items-center gap-3 rounded-full border border-brand px-7 py-3 font-medium text-brand transition hover:bg-brand hover:text-cream"
              >
                <PlayIcon className="h-5 w-5" /> Our Story
              </Link>
            </div>

            <ul className="mt-10 grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-4">
              {features.map((f) => (
                <li key={f.label[0]} className="flex items-center gap-3 text-xs leading-tight text-ink/80">
                  <f.Icon className="h-7 w-7 shrink-0 text-ink/80" />
                  <span>
                    {f.label[0]}
                    <br />
                    {f.label[1]}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative md:-mr-6 lg:-mr-16 xl:-mr-28">
            <img
              src="/images/hero.jpg"
              alt="Golden dosa with sambar and coconut chutney beside a jar of ARISI batter"
              className="hero-fade w-full object-cover"
            />
          </div>
        </div>
      </section>

      <BatterPour />

      <section className="mx-auto mt-24 max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">Our Batters</h2>
          <p className="mt-3 text-ink/70">Batter on its own, or with our instant chutney powder. 500 g packs.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-10 rounded-3xl bg-cream-dark/70 px-8 py-14 ring-1 ring-sand/60 md:grid-cols-[1fr_1.3fr] md:px-14">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-ink/60">Instant chutney</p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-tight">
              Just add <span className="italic text-brand">hot water.</span>
            </h2>
            <p className="mt-4 max-w-sm leading-relaxed text-muted">
              Every combo pack comes with our chutney powder. You don&apos;t need a grinder or any prep. It&apos;s
              ready in about a minute.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3">
            {chutneySteps.map((s) => (
              <li key={s.n} className="rounded-2xl bg-cream p-6 ring-1 ring-sand/60">
                <span className="font-serif text-3xl italic text-brand/50">{s.n}</span>
                <h3 className="mt-3 font-medium">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-6 lg:px-10">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">How pre-ordering works</h2>
          <p className="mt-3 text-ink/70">Everything is made fresh to order, so all batters must be pre-booked.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {orderSteps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl bg-brand p-8 text-cream">
              <span className="absolute right-6 top-5 font-serif text-5xl italic text-cream/15">{i + 1}</span>
              <s.Icon className="h-8 w-8 text-cream/80" />
              <h3 className="mt-5 font-serif text-2xl">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-cream/75">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/order" className="inline-flex items-center gap-3 rounded-full bg-brand px-8 py-3.5 font-medium text-cream hover:bg-brand-light">
            Start your pre-order <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}

export default Home
