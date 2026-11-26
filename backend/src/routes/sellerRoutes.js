const router = require('express').Router()
const mw = require('../middleware/authMiddleware')
const c = require('../controllers/sellerController')

// Mendukung dua gaya ekspor: module.exports = fn  atau  module.exports = { authMiddleware }
const auth = typeof mw === 'function' ? mw : (mw.authMiddleware || mw.verifyToken || mw.protect)

router.use(auth, c.onlySeller)
router.get('/stats', c.stats)
router.get('/categories', c.categories)
router.get('/products', c.listProducts)
router.post('/products', c.saveProduct)
router.put('/products/:id', c.saveProduct)
router.delete('/products/:id', c.removeProduct)
router.get('/orders', c.listOrders)
router.patch('/orders/:id/status', c.setStatus)

module.exports = router