import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { products, orders, sales, rupiah, badge } from '../../data'

const stats = [['Total penjualan', 'Rp 4,2 jt', 'bg-purple-100'], ['Pesanan hari ini', '12', 'bg-sky-100'], ['Stok menipis', '5', 'bg-orange-100'], ['Total pelanggan', '86', 'bg-gray-200']]
const ship = [{ n: 'Terkirim', v: 52, c: '#22c55e' }, { n: 'Dalam pengiriman', v: 18, c: '#06b6d4' }, { n: 'Dikembalikan', v: 4, c: '#dc2626' }, { n: 'Dibatalkan', v: 6, c: '#facc15' }]

export default function SellerDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([l, v, c]) => (
          <div key={l} className={`rounded-xl p-4 ${c}`}><p className="text-sm text-gray-600">{l}</p><p className="mt-1 text-2xl font-bold">{v}</p></div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 lg:col-span-2">
          <h2 className="mb-2 font-semibold">Penjualan bulanan</h2>
          <div className="h-60">
            <ResponsiveContainer><AreaChart data={sales}>
              <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={12} /><YAxis hide /><Tooltip />
              <Area dataKey="v" stroke="#16a34a" fill="#bbf7d0" strokeWidth={2} />
            </AreaChart></ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-3 font-semibold">Status stok</h2>
          {[['Tersedia', 320, 'bg-green-500'], ['Menipis', 12, 'bg-red-400'], ['Habis', 5, 'bg-red-600']].map(([l, n, c]) => (
            <div key={l} className="flex items-center justify-between border-b py-3 text-sm"><span className="flex items-center gap-2"><i className={`h-2.5 w-2.5 rounded-full ${c}`} />{l}</span><b>{n}</b></div>
          ))}
          <button className="mt-4 w-full rounded-lg bg-green-500 py-2 text-sm font-medium text-white">Kelola produk</button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-3 font-semibold">Produk terlaris</h2>
          {products.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center gap-3 border-b py-2 text-sm last:border-0"><span className="text-2xl">{p.icon}</span><span className="flex-1">{p.name}</span><b>{rupiah(p.price * p.sold)}</b></div>
          ))}
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-3 font-semibold">Pesanan terbaru</h2>
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between border-b py-2 text-sm last:border-0"><span>{o.id} {o.who}</span><span className={`rounded-full px-2 py-0.5 text-xs ${badge[o.status]}`}>{o.status}</span></div>
          ))}
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold">Status pengiriman</h2>
          <div className="h-40"><ResponsiveContainer><PieChart><Pie data={ship} dataKey="v" innerRadius={40} outerRadius={65}>{ship.map((s) => <Cell key={s.n} fill={s.c} />)}</Pie></PieChart></ResponsiveContainer></div>
          <div className="grid grid-cols-2 gap-1 text-xs">{ship.map((s) => <span key={s.n} className="flex items-center gap-1"><i className="h-2 w-2 rounded-full" style={{ background: s.c }} />{s.n}</span>)}</div>
        </div>
      </div>
    </div>
  )
}