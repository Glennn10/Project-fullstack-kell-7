const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'perpustakaan',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '123',
});

// Test koneksi + test query sederhana
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Gagal konek ke database:', err.message);
  } else {
    console.log('✅ Berhasil konek ke PostgreSQL!');
    client.query('SELECT NOW() AS waktu_server', (err, result) => {
      release();
      if (err) {
        console.error('❌ Test query gagal:', err.message);
      } else {
        console.log('🕐 Waktu server DB:', result.rows[0].waktu_server);
      }
    });
  }
});

module.exports = pool;