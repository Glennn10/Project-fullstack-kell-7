const pool = require('../config/db');

const LoanModel = {
    getAllLoans: async () => {
        const query = `
            SELECT 
                l.id, 
                b.title AS book_title, 
                br.name AS borrower_name, 
                u.name AS staff_name,
                l.loan_date, 
                l.return_date, 
                l.status, 
                l.created_at
            FROM loans l
            LEFT JOIN books b ON l.book_id = b.id
            LEFT JOIN borrowers br ON l.borrower_id = br.id
            LEFT JOIN users u ON l.user_id = u.id
            ORDER BY l.created_at DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    getLoanById: async (id) => {
        const query = `
            SELECT 
                l.id, l.book_id, b.title AS book_title, 
                l.borrower_id, br.name AS borrower_name, 
                l.user_id, u.name AS staff_name,
                l.loan_date, l.return_date, l.status, l.created_at
            FROM loans l
            LEFT JOIN books b ON l.book_id = b.id
            LEFT JOIN borrowers br ON l.borrower_id = br.id
            LEFT JOIN users u ON l.user_id = u.id
            WHERE l.id = $1;
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    createLoan: async (loanData) => {
        const { book_id, borrower_id, loan_date, user_id } = loanData;
        const query = `
            INSERT INTO loans (book_id, borrower_id, loan_date, user_id) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *;
        `;
        const result = await pool.query(query, [book_id, borrower_id, loan_date, user_id]);
        return result.rows[0];
    },

    updateLoanStatus: async (id, status, return_date = null) => {
        const query = `
            UPDATE loans 
            SET status = $1, return_date = $2 
            WHERE id = $3 
            RETURNING *;
        `;
        const result = await pool.query(query, [status, return_date, id]);
        return result.rows[0];
    },

    deleteLoan: async (id) => {
        const query = 'DELETE FROM loans WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = LoanModel;