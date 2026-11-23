import { Link } from 'react-router-dom'
import { ShoppingCart, LogOut, Store, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const dash = user?.role === 'admin' ? '/admin' : user?.role === 'seller' ? '/seller' : null
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand">
          <Store size={24} /> Toko<span className="text-amber-500">Lokal</span>
        </Link>
        <Link to="/katalog" className="hidden text-sm text-gray-600 hover:text-brand sm:block">Kategori</Link>
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input placeholder="Cari produk UMKM..." className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm outline-none focus:border-brand" />
        </div>
        <ShoppingCart size={22} className="text-gray-500" />
        {user ? (
          <div className="flex items-center gap-3">
            {dash && <Link to={dash} className="text-sm font-medium text-brand">Dashboard</Link>}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-brand">{user.name?.[0]}</span>
            <button onClick={logout} title="Keluar" className="text-gray-500 hover:text-red-600"><LogOut size={20} /></button>
          </div>
        ) : (
          <Link to="/login" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">Masuk</Link>
        )}
      </div>
    </header>
  )
}