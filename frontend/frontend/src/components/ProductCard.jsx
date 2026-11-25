import { rupiah } from '../data'

const tone = {
  'Makanan & Minuman': 'bg-amber-100 text-amber-700',
  'Kerajinan Tangan': 'bg-rose-100 text-rose-700',
  'Fashion Lokal': 'bg-sky-100 text-sky-700',
  Pertanian: 'bg-emerald-100 text-emerald-700',
}

export default function ProductCard({ p }) {
  return (
    <article className="group">
      <div className={`relative flex h-44 items-end overflow-hidden p-3 ${tone[p.cat] || 'bg-gray-100 text-gray-600'}`}>
        {p.image_url ? (
          <img src={p.image_url} alt={p.name} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="font-display text-8xl font-extrabold leading-none opacity-60">{p.name[0]}</span>
        )}
        <span className="absolute right-0 top-3 -rotate-2 bg-tinta px-3 py-1 text-sm font-bold text-white">
          {rupiah(p.price)}
        </span>
      </div>
      <div className="border-2 border-t-0 border-tinta p-3">
        <h3 className="line-clamp-1 font-bold">{p.name}</h3>
        <p className="text-sm text-gray-500">{p.city}, {p.sold} terjual</p>
        <button className="mt-3 w-full border-2 border-tinta py-1.5 text-sm font-bold transition group-hover:bg-tinta group-hover:text-white">
          Masukkan keranjang
        </button>
      </div>
    </article>
  )
}