import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ShoppingCart, Package, Store, Users, BadgePercent } from 'lucide-react'
import { products, orders, rupiah, badge } from '../../data'

const stats = [[ShoppingCart, 'Pesanan tertunda', 234, 'text-green-600 bg-green-50'], [Package, 'Total produk', 109, 'text-blue-600 bg-blue-50'], [Store, 'Toko aktif', 42, 'text-orange-600 bg-orange-50'], [Users, 'Total pelanggan', 1232, 'text-purple-600 bg-purple-50'], [BadgePercent, 'Kupon aktif', 8, 'text-indigo-600 bg-indigo-50']]
const days = ['Sab', 'Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum'].map((d, i) => ({ d, masuk: [300, 380, 450, 330, 400, 330, 600][i], kirim: [260, 330, 330, 420, 290, 410, 700][i] }))
const customers = [['Asif Mahmud', 'VIP'], ['Harunur Rashid', 'Reguler'], ['Nur Islam', 'Baru'], ['Abid Mahmood', 'VIP']]
const activity = ['Pesanan baru dari Asif', 'Produk ditambah oleh Ruhul', 'Stok diperbarui oleh Anes', 'Pesanan dikirim ke pelanggan', 'Toko baru menunggu verifikasi']

export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(([I, l, v, c]) => (
          <div key={l} className="rounded-xl bg-white p-4 shadow-sm"><span className={`inline-flex rounded-lg p-2 ${c}`}><I size={18} /></span><p className="mt-2 text-sm text-gray-500">{l}</p><p className="text-2xl font-bold">{v}</p></div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="mb-2 font-semibold">Ringkasan pesanan</h2>
          <div className="h-60"><ResponsiveContainer><LineChart data={days}>
            <XAxis dataKey="d" tickLine={false} axisLine={false} fontSize={12} /><YAxis hide /><Tooltip />
            <Line dataKey="masuk" stroke="#2563eb" strokeWidth={2} dot={false} type="monotone" />
            <Line dataKey="kirim" stroke="#16a34a" strokeWidth={2} dot={false} type="monotone" />
          </LineChart></ResponsiveContainer></div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold">Aktivitas terbaru</h2>
          {activity.map((a, i) => <p key={a} className="border-b py-2 text-sm last:border-0">{a}<span className="block text-xs text-gray-400">{(i + 1) * 12} menit lalu</span></p>)}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold">Pelanggan teratas</h2>
          {customers.map(([n, t]) => <div key={n} className="flex items-center justify-between border-b py-2 text-sm last:border-0"><span>{n}</span><span className="rounded bg-amber-50 px-2 py-0.5 text-xs text-amber-700">{t}</span></div>)}
          <h2 className="mb-2 mt-4 font-semibold">Produk teratas</h2>
          {products.slice(0, 3).map((p) => <p key={p.id} className="flex justify-between py-1 text-sm"><span>{p.icon} {p.name}</span><span className="text-gray-500">{p.sold} terjual</span></p>)}
        </div>
        <div className="overflow-x-auto rounded-xl bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="mb-3 font-semibold">Pesanan terbaru</h2>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500"><tr><th className="p-2">Pesanan</th><th>Pelanggan</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>{orders.map((o) => (
              <tr key={o.id} className="border-b last:border-0"><td className="p-2">{o.id}</td><td>{o.who}</td><td>{rupiah(o.total)}</td><td><span className={`rounded-full px-2 py-0.5 text-xs ${badge[o.status]}`}>{o.status}</span></td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}