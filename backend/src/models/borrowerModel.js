const pool = require('../config/db');

const BorrowerModel = {
    getAllBorrowers: async () => {
        const query = 'SELECT * FROM borrowers ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    },
    getBorrowerById: async (id) => {
        const query = 'SELECT * FROM borrowers WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    createBorrower: async (borrowerData) => {
        const { name, phone, address } = borrowerData;
        const query = 'INSERT INTO borrowers (name, phone, address) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query, [name, phone, address]);
        return result.rows[0];
    },
    updateBorrower: async (id, borrowerData) => {
        const { name, phone, address } = borrowerData;
        const query = 'UPDATE borrowers SET name = $1, phone = $2, address = $3 WHERE id = $4 RETURNING *';
        const result = await pool.query(query, [name, phone, address, id]);
        return result.rows[0];
    },
    deleteBorrower: async (id) => {
        const query = 'DELETE FROM borrowers WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = BorrowerModel;