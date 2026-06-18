require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');
const ensureSchema = require('./config/ensureSchema');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        await ensureSchema();
        console.log('Database connected at:', result.rows[0].now);

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

startServer();
