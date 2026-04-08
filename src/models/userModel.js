const pool = require('../config/db');

const UserModel = {
    getAllUsers: async () => {
        // Sengaja gak men-select kolom password biar aman pas dikirim ke response
        const query = 'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    },
    getUserById: async (id) => {
        const query = 'SELECT id, name, email, created_at FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    createUser: async (userData) => {
        const { name, email, password } = userData;
        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at';
        const result = await pool.query(query, [name, email, password]);
        return result.rows[0];
    },
    updateUser: async (id, userData) => {
        const { name, email, password } = userData;
        const query = 'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email, created_at';
        const result = await pool.query(query, [name, email, password, id]);
        return result.rows[0];
    },
    deleteUser: async (id) => {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id, name, email';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = UserModel;