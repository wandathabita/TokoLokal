const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Nama, email, dan password wajib diisi."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            `INSERT INTO users (name, email, password, role, phone)
             VALUES ($1, $2, $3, 'customer', $4)
             RETURNING id, name, email, role, phone`,
            [name, email, hashedPassword, phone || null]
        );

        res.status(201).json({
            message: "Registrasi berhasil.",
            user: result.rows[0]
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Email sudah terdaftar."
            });
        }

        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email dan password wajib diisi."
            });
        }

        const result = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Email atau password salah."
            });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                message: "Email atau password salah."
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login berhasil.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, name, email, role, phone, created_at
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Pengguna tidak ditemukan."
            });
        }

        res.json({
            message: "Profil berhasil diambil.",
            user: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Gagal mengambil profil."
        });
    }
};
