import PageHeader from '../common/PageHeader'

const recipes = [
  {
    title: 'Crispy Golden Dosa',
    time: '10 min',
    steps: ['Heat a cast-iron tawa until very hot, then lightly oil it.', 'Pour a ladle of batter in the centre and spread in quick circles.', 'Drizzle ghee around the edges and cook until golden. Fold and serve.'],
  },
  {
    title: 'Soft Steamed Idli',
    time: '15 min',
    steps: ['Grease idli moulds and fill each three-quarters full.', 'Steam on medium heat for 10–12 minutes.', 'Rest for a minute before unmoulding. Serve with sambar.'],
  },
  {
    title: 'Onion Uttapam',
    time: '12 min',
    steps: ['Spread a thick round of batter on a medium-hot pan.', 'Top with onion, tomato, chilli and coriander; press gently.', 'Flip once the base is golden and cook for another minute.'],
  },
  {
    title: 'Instant Chutney',
    time: '1 min',
    steps: ['Empty the ARISI chutney powder sachet into a bowl.', 'Pour in hot water a little at a time, stirring as you go.', 'Rest for a minute until thick. Your chutney is ready to serve.'],
  },
  {
    title: 'Masala Dosa',
    time: '25 min',
    steps: ['Sauté potatoes with mustard seeds, curry leaves, onion and turmeric.', 'Make a thin, crisp dosa and spoon the masala in the centre.', 'Fold over and serve hot with coconut chutney.'],
  },
]

function Recipes() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10">
      <PageHeader eyebrow="Recipes" title="What will you make today?" subtitle="Simple ideas for every ARISI batter." />
      <div className="grid gap-6 md:grid-cols-2">
        {recipes.map((r) => (
          <article key={r.title} className="rounded-2xl bg-cream-dark/70 p-8 ring-1 ring-sand/60">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl">{r.title}</h3>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">{r.time}</span>
            </div>
            <ol className="mt-5 space-y-3">
              {r.steps.map((s, i) => (
                <li key={s} className="flex gap-4 text-muted">
                  <span className="font-serif italic text-brand">{i + 1}.</span>
                  {s}
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Recipes
