import PageHeader from '../common/PageHeader'
import ProductCard from '../common/ProductCard'
import { products } from '../../data/products'

function Products() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10">
      <PageHeader
        eyebrow="Shop"
        title="Our Batters"
        subtitle="Dosa or Idli batter €3 per 500 g. With instant chutney €5. All orders are pre-booked."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

export default Products
