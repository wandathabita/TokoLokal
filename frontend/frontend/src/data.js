export const rupiah = (n) => 'Rp ' + Number(n).toLocaleString('id-ID')
export const categories = ['Makanan & Minuman', 'Kerajinan Tangan', 'Fashion Lokal', 'Pertanian']
export const products = [
  { id: 1, name: 'Sosis sedang', price: 5000, cat: 'Makanan & Minuman', icon: '🌭', rating: 4.8, sold: 120, city: 'Kudus' },
  { id: 2, name: 'Kerang dara rebus', price: 10000, cat: 'Makanan & Minuman', icon: '🐚', rating: 4.7, sold: 86, city: 'Kudus' },
  { id: 3, name: 'Tempe mendoan', price: 12000, cat: 'Makanan & Minuman', icon: '🥘', rating: 4.9, sold: 210, city: 'Jepara' },
  { id: 4, name: 'Anyaman bambu', price: 45000, cat: 'Kerajinan Tangan', icon: '🧺', rating: 4.6, sold: 34, city: 'Demak' },
  { id: 5, name: 'Batik tulis Kudus', price: 185000, cat: 'Fashion Lokal', icon: '👘', rating: 4.9, sold: 18, city: 'Kudus' },
  { id: 6, name: 'Madu hutan 250ml', price: 65000, cat: 'Pertanian', icon: '🍯', rating: 4.8, sold: 77, city: 'Pati' },
  { id: 7, name: 'Gerabah mini', price: 25000, cat: 'Kerajinan Tangan', icon: '🏺', rating: 4.5, sold: 41, city: 'Demak' },
  { id: 8, name: 'Kopi robusta 200g', price: 38000, cat: 'Pertanian', icon: '☕', rating: 4.7, sold: 95, city: 'Pati' },
]
export const orders = [
  { id: '#1045', who: 'John Doe', total: 125000, status: 'Dikirim' },
  { id: '#1044', who: 'Sarah Khan', total: 64000, status: 'Diproses' },
  { id: '#1043', who: 'David Lee', total: 38000, status: 'Selesai' },
  { id: '#1042', who: 'Emily Smith', total: 92000, status: 'Menunggu' },
]
export const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
export const sales = [45,52,48,70,62,80,66,58,64,60,55,72].map((v, i) => ({ m: months[i], v }))
export const badge = {
  Dikirim: 'bg-green-100 text-green-700', Diproses: 'bg-orange-100 text-orange-700',
  Selesai: 'bg-sky-100 text-sky-700', Menunggu: 'bg-yellow-100 text-yellow-700',
}