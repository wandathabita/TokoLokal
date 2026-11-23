
# TokoLokal Backend Setup

$folders = @(
    "src/config",
    "src/controllers",
    "src/middleware",
    "src/routes"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
}

$files = @{
"src/config/database.js" = @'
const { Pool } = require("pg");
require("dotenv").config();

const db = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

db.on("error", (error) => {
    console.error("Database error:", error.message);
});

module.exports = db;
'@

"src/controllers/authController.js" = @'
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
'@

"src/controllers/productController.js" = @'
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
'@

"src/middleware/authMiddleware.js" = @'
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Token autentikasi tidak ditemukan."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token tidak valid atau sudah kedaluwarsa."
        });
    }
};

module.exports = authMiddleware;
'@

"src/routes/authRoutes.js" = @'
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
'@

"src/routes/productRoutes.js" = @'
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

module.exports = router;
'@

"src/server.js" = @'
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Selamat datang di TokoLokal API",
        status: "Backend berjalan"
    });
});

app.get("/api/db-test", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT current_database() AS database"
        );

        res.json({
            message: "Database berhasil terhubung.",
            database: result.rows[0].database
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Koneksi database gagal."
        });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`TokoLokal Backend berjalan di port ${PORT}`);
});
'@

".gitignore" = @'
node_modules/
.env
'@
}

foreach ($file in $files.GetEnumerator()) {
    Set-Content -Path $file.Key -Value $file.Value -Encoding utf8
    Write-Host "Berhasil membuat: $($file.Key)" -ForegroundColor Green
}

# Atur scripts pada package.json
$package = Get-Content "package.json" -Raw | ConvertFrom-Json
$package.scripts = @{
    start = "node src/server.js"
    dev = "nodemon src/server.js"
}
$package | ConvertTo-Json -Depth 10 | Set-Content "package.json" -Encoding utf8

# Isi .env jika belum ada atau masih kosong
if (!(Test-Path ".env") -or (Get-Item ".env").Length -eq 0) {
@'
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tokolokal_db
DB_USER=postgres
DB_PASSWORD=ISI_PASSWORD_POSTGRES_KAMU
JWT_SECRET=GANTI_DENGAN_SECRET_RANDOM_YANG_PANJANG
'@ | Set-Content ".env" -Encoding utf8
}

Write-Host "`nSetup backend selesai." -ForegroundColor Cyan
