const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const sellerRoutes = require("./routes/sellerRoutes");

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
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
app.use("/api/seller", sellerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
    if (err) {
        console.error("Gagal menjalankan server:", err.message);
        process.exit(1);
    }
    console.log(`TokoLokal Backend berjalan di port ${PORT}`);
});