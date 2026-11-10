import PageHeader from '../common/PageHeader'

const values = [
  { title: 'Honest ingredients', text: 'Rice, urad dal, fenugreek, salt and water. No preservatives, no baking soda, no shortcuts.' },
  { title: 'Slow fermentation', text: 'Twelve hours of natural fermentation gives our batter its gentle tang and airy texture.' },
  { title: 'Made to order', text: 'Every order is pre-booked and ground fresh for you, never sitting on a shelf.' },
]

function Story() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10">
      <PageHeader eyebrow="Our Story" title="From our kitchen to yours" />

      <div className="grid items-center gap-12 lg:grid-cols-2">
        <img src="/images/hero.jpg" alt="Dosa with chutneys" className="w-full rounded-3xl object-cover" />
        <div className="space-y-5 text-lg leading-relaxed text-ink/80">
          <p>
            <em>Arisi</em> means rice, and rice is where every good dosa and idli begins. ARISI started in a home
            kitchen, when we couldn&apos;t find batter that tasted like home. So we started making our own and sharing
            it with friends.
          </p>
          <p>
            We still soak, grind and ferment the traditional way. Because every batch is made to order, we ask you to
            pre-book, so your batter reaches you at its freshest. You can add our instant chutney powder too: just add
            hot water.
          </p>
          <p className="font-serif text-2xl italic text-brand">Rooted in rice. Made with love.</p>
        </div>
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="rounded-2xl bg-cream-dark/70 p-8 ring-1 ring-sand/60">
            <h3 className="font-serif text-2xl text-brand">{v.title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Story
