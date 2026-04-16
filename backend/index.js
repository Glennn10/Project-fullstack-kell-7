const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');
const routes = require('./src/routes/index'); // Cukup import 1 file hub ini
const { notFound, globalErrorHandler } = require('./src/middleware/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. MIDDLEWARE GLOBAL
app.use(cors());
app.use(express.json());

// 2. TEST KONEKSI DATABASE
const testDbConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Database Connected Successfully at:', result.rows[0].now);
    } catch (err) {
        console.error('❌ Database Connection Error:', err.message);
        process.exit(1);
    }
};
testDbConnection();

// 3. ROUTES
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Welcome to Library API Sprint 3 & 4!' });
});

// Integrasi semua API routes (otomatis diawali /api)
app.use('/api', routes);

// 4. ERROR HANDLING MIDDLEWARE
app.use(notFound);
app.use(globalErrorHandler);

// 5. START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});