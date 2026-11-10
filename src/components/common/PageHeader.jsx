function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-10 pt-16 text-center">
      {eyebrow && <p className="text-sm uppercase tracking-[0.25em] text-ink/60">{eyebrow}</p>}
      <h1 className="mt-4 font-serif text-5xl font-medium tracking-tight">{title}</h1>
      {subtitle && <p className="mt-4 text-lg text-ink/70">{subtitle}</p>}
    </div>
  )
}

export default PageHeader
