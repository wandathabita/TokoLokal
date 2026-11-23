import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ClipboardList, Users, Settings, LogOut, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const menus = {
  seller: [[LayoutDashboard, 'Dashboard', '/seller'], [Package, 'Produk saya', '/seller'], [ClipboardList, 'Pesanan', '/seller'], [Settings, 'Pengaturan', '/seller']],
  admin: [[LayoutDashboard, 'Dashboard', '/admin'], [Store, 'Toko', '/admin'], [Users, 'Pengguna', '/admin'], [ClipboardList, 'Pesanan', '/admin']],
}

export default function DashLayout({ role }) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const dark = role === 'seller'
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className={`hidden w-56 shrink-0 flex-col p-4 md:flex ${dark ? 'bg-brand-dark text-teal-50' : 'border-r border-gray-200 bg-white'}`}>
        <Link to="/" className={`mb-6 text-lg font-bold ${dark ? 'text-white' : 'text-brand'}`}>Toko<span className="text-amber-400">Lokal</span></Link>
        <nav className="flex-1 space-y-1">
          {menus[role].map(([I, label, to], i) => (
            <Link key={label} to={to} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${i === 0 && pathname === to ? 'bg-green-500 font-medium text-white' : dark ? 'hover:bg-teal-800' : 'text-gray-600 hover:bg-gray-100'}`}>
              <I size={18} /> {label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 text-sm opacity-80"><LogOut size={18} /> Keluar</button>
      </aside>
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{role === 'seller' ? 'Dashboard penjual' : 'Dashboard admin'}</h1>
          <span className="rounded-full bg-white px-3 py-1.5 text-sm shadow-sm">{user?.name}</span>
        </div>
        <Outlet />
      </div>
    </div>
  )
}