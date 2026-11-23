const db = require("../config/database");

exports.getProducts = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                p.id,
                p.name,
                p.description,
                p.price,
                p.stock,
                p.image_url,
                p.category_id,
                c.name AS category_name,
                p.seller_id,
                u.name AS seller_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN users u ON p.seller_id = u.id
            ORDER BY p.created_at DESC
        `);

        res.json({
            message: "Daftar produk berhasil diambil.",
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil produk." });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM products WHERE id = $1",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Produk tidak ditemukan."
            });
        }

        res.json({ data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil detail produk." });
    }
};
