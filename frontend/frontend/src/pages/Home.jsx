import { Link } from 'react-router-dom'
import { Truck, ShieldCheck, Store } from 'lucide-react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../data'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-6">
        <section className="grid items-center gap-6 rounded-2xl bg-brand-dark p-8 text-white md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">Belanja langsung dari UMKM di sekitarmu</h1>
            <p className="mt-3 text-teal-100">Kuliner, kerajinan, dan hasil bumi khas daerah, dijual oleh pembuatnya sendiri.</p>
            <div className="mt-5 flex gap-3">
              <Link to="/katalog" className="rounded-lg bg-accent px-5 py-2.5 font-semibold text-gray-900">Jelajahi produk</Link>
              <Link to="/login" className="rounded-lg border border-teal-300 px-5 py-2.5 font-medium">Buka toko</Link>
            </div>
          </div>
          <div className="flex h-48 items-center justify-center rounded-xl bg-teal-800 text-7xl">🍲🧺🍯</div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          {[[Store, 'Penjual lokal terverifikasi'], [Truck, 'Kirim dari desa ke rumahmu'], [ShieldCheck, 'Transaksi aman']].map(([I, t]) => (
            <div key={t} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm font-medium">
              <I className="text-brand" /> {t}
            </div>
          ))}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-dark">Kategori</h2>
            <Link to="/katalog" className="text-sm font-medium text-brand">Lihat semua</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link key={c} to="/katalog" className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm hover:border-brand hover:text-brand">{c}</Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-brand-dark">Produk terbaru</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      </main>
    </div>
  )
}