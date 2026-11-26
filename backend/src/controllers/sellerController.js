const pool = require('../config/database')

const h = (fn) => async (req, res) => {
  try { await fn(req, res) }
  catch (e) { console.error(e); res.status(500).json({ message: 'Terjadi kesalahan server.' }) }
}

exports.onlySeller = async (req, res, next) => {
  try {
    const r = await pool.query('SELECT role FROM users WHERE id=$1', [req.user.id])
    if (r.rows[0]?.role !== 'seller') return res.status(403).json({ message: 'Khusus penjual.' })
    next()
  } catch (e) { res.status(500).json({ message: 'Terjadi kesalahan server.' }) }
}

const mine = `FROM order_items oi JOIN products p ON p.id = oi.product_id JOIN orders o ON o.id = oi.order_id WHERE p.seller_id = $1`

exports.stats = h(async (req, res) => {
  const id = [req.user.id]
  const q = (sql) => pool.query(sql, id).then((r) => r.rows)
  const [total, today, cust, monthly, stock, top, recent, ship] = await Promise.all([
    q(`SELECT COALESCE(SUM(oi.qty*oi.price),0)::float AS v ${mine} AND o.status <> 'Dibatalkan'`),
    q(`SELECT COUNT(DISTINCT o.id)::int AS v ${mine} AND o.created_at::date = CURRENT_DATE`),
    q(`SELECT COUNT(DISTINCT o.customer_id)::int AS v ${mine}`),
    q(`SELECT EXTRACT(MONTH FROM o.created_at)::int AS m, SUM(oi.qty*oi.price)::float AS v ${mine}
       AND o.status <> 'Dibatalkan' AND EXTRACT(YEAR FROM o.created_at) = EXTRACT(YEAR FROM NOW()) GROUP BY m`),
    q(`SELECT COUNT(*) FILTER (WHERE stock > 5)::int AS ok, COUNT(*) FILTER (WHERE stock BETWEEN 1 AND 5)::int AS low,
       COUNT(*) FILTER (WHERE stock = 0)::int AS out FROM products WHERE seller_id = $1`),
    q(`SELECT p.id, p.name, SUM(oi.qty)::int AS qty, SUM(oi.qty*oi.price)::float AS total ${mine}
       AND o.status <> 'Dibatalkan' GROUP BY p.id, p.name ORDER BY total DESC LIMIT 4`),
    q(`SELECT o.id, u.name AS who, o.status, SUM(oi.qty*oi.price)::float AS total ${mine.replace('WHERE', 'JOIN users u ON u.id = o.customer_id WHERE')}
       GROUP BY o.id, u.name, o.status ORDER BY o.id DESC LIMIT 5`),
    q(`SELECT o.status AS n, COUNT(DISTINCT o.id)::int AS v ${mine} GROUP BY o.status`),
  ])
  res.json({
    total: total[0].v, today: today[0].v, customers: cust[0].v,
    lowStock: stock[0].low, stock: stock[0], monthly, top, recent, ship,
  })
})

exports.categories = h(async (req, res) => {
  res.json((await pool.query('SELECT id, name FROM categories ORDER BY name')).rows)
})

exports.listProducts = h(async (req, res) => {
  const r = await pool.query(
    `SELECT p.*, c.name AS category FROM products p LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.seller_id = $1 ORDER BY p.id DESC`, [req.user.id])
  res.json(r.rows)
})

exports.saveProduct = h(async (req, res) => {
  const { name, price, stock, category_id, description, image_url } = req.body
  if (!name || price == null || Number(price) < 0) return res.status(400).json({ message: 'Nama dan harga wajib diisi.' })
  const v = [name, price, stock || 0, category_id || null, description || null, image_url || null]
  const q = req.params.id
    ? await pool.query(
        'UPDATE products SET name=$1, price=$2, stock=$3, category_id=$4, description=$5, image_url=$6 WHERE id=$7 AND seller_id=$8 RETURNING *',
        [...v, req.params.id, req.user.id])
    : await pool.query(
        'INSERT INTO products (name, price, stock, category_id, description, image_url, seller_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
        [...v, req.user.id])
  if (!q.rows[0]) return res.status(404).json({ message: 'Produk tidak ditemukan.' })
  res.json(q.rows[0])
})

exports.removeProduct = async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM products WHERE id=$1 AND seller_id=$2', [req.params.id, req.user.id])
    if (!r.rowCount) return res.status(404).json({ message: 'Produk tidak ditemukan.' })
    res.json({ message: 'Produk dihapus.' })
  } catch (e) {
    if (e.code === '23503') return res.status(409).json({ message: 'Produk sudah ada di pesanan, tidak bisa dihapus. Set stoknya ke 0.' })
    console.error(e); res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
}

exports.listOrders = h(async (req, res) => {
  const r = await pool.query(
    `SELECT o.id, u.name AS who, o.status, o.created_at, SUM(oi.qty*oi.price)::float AS total
     ${mine.replace('WHERE', 'JOIN users u ON u.id = o.customer_id WHERE')}
     GROUP BY o.id, u.name, o.status, o.created_at ORDER BY o.id DESC`, [req.user.id])
  res.json(r.rows)
})

exports.setStatus = h(async (req, res) => {
  const ok = ['Menunggu', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan']
  if (!ok.includes(req.body.status)) return res.status(400).json({ message: 'Status tidak valid.' })
  const own = await pool.query(`SELECT 1 ${mine} AND o.id = $2 LIMIT 1`, [req.user.id, req.params.id])
  if (!own.rowCount) return res.status(404).json({ message: 'Pesanan tidak ditemukan.' })
  await pool.query('UPDATE orders SET status=$1 WHERE id=$2', [req.body.status, req.params.id])
  res.json({ message: 'Status diperbarui.' })
})