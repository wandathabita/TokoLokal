import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Store, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const perks = [
  'Belanja langsung dari penjual lokal',
  'Buka toko dan kelola produk sendiri',
  'Pantau pesanan dan penjualan dalam satu dashboard',
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'seller') navigate('/seller')
      else navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Panel kiri */}
      <aside className="relative hidden flex-col justify-between bg-brand-dark p-12 text-white md:flex">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Store size={26} /> Toko<span className="text-accent">Lokal</span>
        </Link>

        <div>
          <div className="mb-8 flex gap-4 text-6xl">
            <span className="rounded-2xl bg-teal-800 p-4">🍲</span>
            <span className="mt-6 rounded-2xl bg-teal-800 p-4">🧺</span>
            <span className="rounded-2xl bg-teal-800 p-4">🍯</span>
          </div>
          <h1 className="max-w-md text-4xl font-bold leading-tight">
            Dukung UMKM, belanja dari tangan pertama
          </h1>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-teal-100">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent" /> {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-teal-300">© 2026 TokoLokal</p>
      </aside>

      {/* Panel form */}
      <main className="flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 text-xl font-bold text-brand md:hidden">
            <Store size={24} /> Toko<span className="text-amber-500">Lokal</span>
          </Link>

          <h2 className="text-3xl font-bold text-gray-900">Selamat datang kembali</h2>
          <p className="mt-2 text-gray-500">Masuk untuk lanjut belanja atau mengelola tokomu.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-brand focus:ring-4 focus:ring-teal-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-12 outline-none transition focus:border-brand focus:ring-4 focus:ring-teal-100"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-70"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Memproses...</> : 'Masuk'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link to="/" className="font-medium text-brand hover:underline">Kembali ke beranda</Link>
          </p>
        </div>
      </main>
    </div>
  )
}