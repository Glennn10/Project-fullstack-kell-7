const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json()); // Supaya bisa baca data JSON dari Body

// 1. Koneksi ke Database Postgres (Ambil data dari file .env)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// --- FITUR REGISTER ---
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Cek apakah email sudah terdaftar (karena di tabel kamu UNIQUE)
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // Acak password biar aman (Hashing)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Simpan ke database
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "User berhasil didaftarkan!",
      user: newUser.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error saat Register");
  }
});

// --- FITUR LOGIN ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Cari user di database berdasarkan email
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    // Jika user tidak ditemukan
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Email atau Password salah!" });
    }

    // 2. Bandingkan password yang diketik dengan yang di database (pakai bcrypt)
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ message: "Email atau Password salah!" });
    }

    // Jika sukses, kirim data user (jangan kirim password-nya!)
    res.json({
      message: "Login Berhasil!",
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error saat Login");
  }
});

// Jalankan Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server nyala di http://localhost:${PORT}`);
});