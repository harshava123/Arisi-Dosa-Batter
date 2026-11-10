function Pouch({ product, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative mx-auto flex h-full w-full flex-col items-center overflow-hidden rounded-t-md rounded-b-xl bg-gradient-to-b from-[#f7f1e8] to-[#ece2d4] pt-3 shadow-[0_10px_25px_-12px_rgba(60,40,20,0.45)] ring-1 ring-black/5">
        <div className="h-1.5 w-[90%] rounded-full bg-[#e4d8c8]" />
        <div className="mt-4 font-serif text-[15px] font-semibold tracking-wide text-brand">ARISI.</div>
        <div className="mt-0.5 h-px w-8 bg-brand/40" />
        <div className="mt-3 px-2 text-center font-serif text-[13px] leading-tight text-ink">{product.label}</div>
        <div className="mt-0.5 text-center text-[9px] uppercase tracking-wide text-muted">{product.variant}</div>

        <div className="absolute inset-x-0 bottom-0 h-[38%]">
          <div className="absolute -left-2 bottom-1 h-10 w-16 -rotate-[25deg] rounded-[100%_0] bg-leaf/90" />
          <div className="absolute -right-1 bottom-2 h-8 w-12 rotate-[30deg] rounded-[0_100%] bg-brand-light/90" />
          <div
            className="absolute bottom-[-18px] left-1/2 h-14 w-20 -translate-x-1/2 rounded-full border-4 border-[#8a5a35] shadow-inner"
            style={{ background: product.accent }}
          />
        </div>
      </div>

      {product.chutney && (
        <div className="absolute -bottom-2 -right-4 flex h-16 w-12 rotate-6 flex-col items-center justify-center rounded-md bg-gradient-to-b from-[#f4ecdc] to-[#e3d3b8] shadow-[0_8px_16px_-8px_rgba(60,40,20,0.6)] ring-1 ring-black/10">
          <div className="text-[8px] font-semibold tracking-wide text-brand">ARISI.</div>
          <div className="mt-1 h-4 w-7 rounded-full bg-[#b5652d]" />
          <div className="mt-1 text-center text-[6.5px] uppercase leading-tight tracking-wide text-ink/70">
            Chutney
            <br />
            Powder
          </div>
        </div>
      )}
    </div>
  )
}

export default Pouch
