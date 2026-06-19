const pool = require('../config/db');

const BorrowerModel = {
    getAllBorrowers: async () => {
        const query = `
            SELECT br.*, u.email AS user_email,
                COUNT(l.id)::int AS total_loans,
                COUNT(l.id) FILTER (WHERE l.status IN ('Dipinjam', 'Terlambat'))::int AS active_loans,
                COUNT(l.id) FILTER (
                    WHERE l.status = 'Terlambat'
                       OR (l.status = 'Dipinjam' AND COALESCE(l.due_date, (l.loan_date + INTERVAL '7 days')::date) < CURRENT_DATE)
                )::int AS overdue_loans
            FROM borrowers br
            LEFT JOIN users u ON br.user_id = u.id
            LEFT JOIN loans l ON l.borrower_id = br.id
            GROUP BY br.id, u.email
            ORDER BY br.created_at DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    },
    getBorrowerById: async (id) => {
        const query = 'SELECT * FROM borrowers WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    createBorrower: async (borrowerData) => {
        const { name, phone, address, user_id = null } = borrowerData;
        const query = 'INSERT INTO borrowers (name, phone, address, user_id) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await pool.query(query, [name, phone, address, user_id]);
        return result.rows[0];
    },
    updateBorrower: async (id, borrowerData) => {
        const { name, phone, address, user_id = null } = borrowerData;
        const query = 'UPDATE borrowers SET name = $1, phone = $2, address = $3, user_id = COALESCE($4, user_id) WHERE id = $5 RETURNING *';
        const result = await pool.query(query, [name, phone, address, user_id, id]);
        return result.rows[0];
    },
    updateBorrowerStatus: async (id, membershipStatus) => {
        const query = 'UPDATE borrowers SET membership_status = $1 WHERE id = $2 RETURNING *';
        const result = await pool.query(query, [membershipStatus, id]);
        return result.rows[0];
    },
    deleteBorrower: async (id) => {
        const query = 'DELETE FROM borrowers WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = BorrowerModel;
