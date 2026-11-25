import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { products, categories, rupiah } from '../data'

const blocks = ['bg-kunyit text-tinta', 'bg-cabai text-white', 'bg-daun text-white', 'bg-tinta text-white']
const heroTiles = ['bg-kunyit', 'bg-cabai text-white', 'bg-daun text-white', 'bg-sky-200']

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Belanja dari dapur dan bengkel tetanggamu sendiri.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-gray-600">
            Kerupuk, batik, madu, anyaman. Semuanya dibuat dan dijual langsung oleh orang di desamu.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); navigate('/katalog') }}
            className="mt-8 flex max-w-lg border-2 border-tinta"
          >
            <div className="flex flex-1 items-center gap-3 px-4">
              <Search size={18} />
              <input placeholder="Cari tempe, batik, madu..." className="w-full py-3.5 outline-none" />
            </div>
            <button className="bg-cabai px-6 font-bold text-white hover:bg-tinta">Cari</button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {products.slice(0, 4).map((p, i) => (
            <div
              key={p.id}
              className={`flex h-40 flex-col justify-between p-3 ${heroTiles[i]} ${i % 2 ? 'mt-8 rotate-2' : '-rotate-2'}`}
            >
              <span className="font-display text-lg font-extrabold leading-tight">{p.name}</span>
              <span className="self-start bg-white px-2 py-0.5 text-sm font-bold text-tinta">{rupiah(p.price)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Kategori */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="font-display text-3xl font-extrabold">Cari berdasarkan lorong</h2>
        <div className="mt-6 grid auto-rows-[110px] grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((c, i) => (
            <Link
              key={c}
              to="/katalog"
              className={`flex flex-col justify-end p-4 transition hover:-translate-y-1 ${blocks[i % 4]} ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
            >
              <span className={`font-display font-extrabold leading-tight ${i === 0 ? 'text-4xl' : 'text-xl'}`}>{c}</span>
              <span className="text-sm opacity-80">{products.filter((p) => p.cat === c).length} produk</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Produk */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-extrabold">Baru naik etalase</h2>
          <Link to="/katalog" className="font-bold underline decoration-cabai decoration-2 underline-offset-4">Lihat semua</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Ajakan jadi penjual */}
      <section className="mt-10 bg-tinta text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-4xl font-extrabold leading-tight">
              Punya usaha dari rumah? Etalasemu bisa buka malam ini.
            </h2>
            <Link to="/login" className="mt-6 inline-block bg-kunyit px-6 py-3 font-bold text-tinta hover:bg-white">
              Daftar jadi penjual
            </Link>
          </div>
          <ul className="space-y-3 text-lg text-gray-200">
            <li className="border-b border-white/20 pb-3">Foto produkmu, tulis harga, selesai.</li>
            <li className="border-b border-white/20 pb-3">Pesanan masuk langsung ke dashboard.</li>
            <li>Tanpa biaya bulanan untuk toko pertamamu.</li>
          </ul>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500">
        TokoLokal, platform yang mempertemukan penjual lokal dengan pembeli.
      </footer>
    </div>
  )
}