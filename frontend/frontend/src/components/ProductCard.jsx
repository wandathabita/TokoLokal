import { Star, Heart } from 'lucide-react'
import { rupiah } from '../data'

export default function ProductCard({ p }) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md">
      <div className="flex h-36 items-center justify-center bg-gray-100 text-5xl">{p.icon}</div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold">{p.name}</h3>
          <Heart size={16} className="mt-0.5 shrink-0 text-gray-400" />
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <Star size={12} className="fill-amber-400 text-amber-400" /> {p.rating} · {p.sold} terjual
        </p>
        <p className="text-xs text-gray-400">{p.city}</p>
        <p className="mt-1 font-bold">{rupiah(p.price)}</p>
        <button className="mt-2 w-full rounded-lg bg-brand py-2 text-sm font-medium text-white hover:bg-brand-dark">Tambah ke keranjang</button>
      </div>
    </article>
  )
}