const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json()); 

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Email atau Password salah!" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ message: "Email atau Password salah!" });
    }

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server nyala di http://localhost:${PORT}`);
});