const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');
const bookRoutes = require('./src/routes/bookRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const userRoutes = require('./src/routes/userRoutes');
const borrowerRoutes = require('./src/routes/borrowerRoutes');
const loanRoutes = require('./src/routes/loanRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Fungsi test koneksi database
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

// Routes
app.use('/api/books', bookRoutes); 
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/loans', loanRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});