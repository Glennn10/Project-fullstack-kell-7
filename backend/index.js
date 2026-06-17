const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./src/config/db');
const ensureSchema = require('./src/config/ensureSchema');
const routes = require('./src/routes/index');
const { notFound, globalErrorHandler } = require('./src/middleware/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const testDbConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        await ensureSchema();
        console.log('Database Connected Successfully at:', result.rows[0].now);
    } catch (err) {
        console.error('Database Connection Error:', err.message);
        process.exit(1);
    }
};

app.get('/', (req, res) => {
    res.json({ success: true, message: 'Welcome to Library API Sprint 3 & 4!' });
});

app.use('/api', routes);

app.use(notFound);
app.use(globalErrorHandler);

testDbConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
