const pool = require('../config/db');

const UserModel = {
    getAllUsers: async () => {
        // Kita tambahkan 'role' agar muncul saat get data
        const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    },
    
    getUserById: async (id) => {
        const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // ==========================================
    // FUNGSI BARU KHUSUS UNTUK AUTH (LOGIN/REGISTER)
    // ==========================================
    getUserByEmail: async (email) => {
        // Di sini kita ambil semua kolom (*) termasuk password, 
        // karena butuh di-compare pakai bcrypt nanti di Controller
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    createUser: async (userData) => {
        // Default role adalah 'user' kalau tidak dikirim dari request
        const { name, email, password, role = 'user' } = userData;
        // Catatan: password yang masuk ke fungsi ini NANTI harus sudah di-hash dari controller
        const query = `
            INSERT INTO users (name, email, password, role) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, name, email, role, created_at
        `;
        const result = await pool.query(query, [name, email, password, role]);
        return result.rows[0];
    },

    updateUser: async (id, userData) => {
        const { name, email, password, role } = userData;
        const query = password
            ? `
                UPDATE users 
                SET name = $1, email = $2, password = $3, role = $4 
                WHERE id = $5 
                RETURNING id, name, email, role, created_at
            `
            : `
                UPDATE users 
                SET name = $1, email = $2, role = $3 
                WHERE id = $4 
                RETURNING id, name, email, role, created_at
            `;
        const values = password ? [name, email, password, role, id] : [name, email, role, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    deleteUser: async (id) => {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id, name, email, role';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = UserModel;
