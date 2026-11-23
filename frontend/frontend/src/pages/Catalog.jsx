import { useState } from 'react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../data'

const ranges = [['Semua harga', 0, Infinity], ['< Rp 20.000', 0, 20000], ['Rp 20.000 - 100.000', 20000, 100000], ['> Rp 100.000', 100000, Infinity]]

export default function Catalog() {
  const [cats, setCats] = useState([])
  const [range, setRange] = useState(0)
  const [sort, setSort] = useState('rating')
  const toggle = (c) => setCats((x) => (x.includes(c) ? x.filter((i) => i !== c) : [...x, c]))
  const [, lo, hi] = ranges[range]

  const list = products
    .filter((p) => (!cats.length || cats.includes(p.cat)) && p.price >= lo && p.price <= hi)
    .sort((a, b) => (sort === 'rating' ? b.rating - a.rating : sort === 'murah' ? a.price - b.price : b.price - a.price))

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside className="h-fit space-y-5 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Filter</h2>
            <button onClick={() => { setCats([]); setRange(0) }} className="text-xs text-brand">Hapus semua</button>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Kategori</h3>
            {categories.map((c) => (
              <label key={c} className="flex items-center gap-2 py-1 text-sm">
                <input type="checkbox" checked={cats.includes(c)} onChange={() => toggle(c)} className="accent-teal-700" /> {c}
              </label>
            ))}
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Harga</h3>
            {ranges.map(([l], i) => (
              <label key={l} className="flex items-center gap-2 py-1 text-sm">
                <input type="radio" checked={range === i} onChange={() => setRange(i)} className="accent-teal-700" /> {l}
              </label>
            ))}
          </div>
        </aside>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Produk</h1>
              <p className="text-sm text-gray-500">{list.length} produk ditemukan</p>
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="rating">Rating tertinggi</option>
              <option value="murah">Harga terendah</option>
              <option value="mahal">Harga tertinggi</option>
            </select>
          </div>
          {list.length ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          ) : (
            <p className="rounded-xl border border-dashed p-10 text-center text-gray-500">Tidak ada produk yang cocok. Coba ubah filter.</p>
          )}
        </section>
      </main>
    </div>
  )
}