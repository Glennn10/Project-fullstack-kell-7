const pool = require('../config/db');

const LoanModel = {
    getAllLoans: async () => {
        const query = `
            SELECT 
                l.id, 
                l.book_id,
                b.title AS book_title, 
                b.author AS book_author,
                b.cover_image,
                br.name AS borrower_name, 
                u.name AS staff_name,
                l.loan_date, 
                COALESCE(l.due_date, (l.loan_date + INTERVAL '7 days')::date) AS due_date,
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

    getMyLoans: async (userId) => {
        const query = `
            SELECT
                l.id,
                l.loan_date,
                l.return_date,
                l.status,
                l.created_at,
                COALESCE(l.due_date, (l.loan_date + INTERVAL '7 days')::date) AS due_date,
                b.id AS book_id,
                b.title AS book_title,
                b.author AS book_author,
                b.cover_image,
                c.name AS category_name
            FROM loans l
            INNER JOIN borrowers br ON l.borrower_id = br.id
            INNER JOIN books b ON l.book_id = b.id
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE br.user_id = $1
            ORDER BY l.created_at DESC
        `;
        const result = await pool.query(query, [userId]);
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
        const { book_id, borrower_id, loan_date, due_date, user_id } = loanData;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const bookResult = await client.query('SELECT id, is_available FROM books WHERE id = $1 FOR UPDATE', [book_id]);
            const book = bookResult.rows[0];
            if (!book) {
                const error = new Error('Buku tidak ditemukan');
                error.code = 'BOOK_NOT_FOUND';
                throw error;
            }
            if (!book.is_available) {
                const error = new Error('Buku sedang dipinjam');
                error.code = 'BOOK_UNAVAILABLE';
                throw error;
            }

            const result = await client.query(`
                INSERT INTO loans (book_id, borrower_id, loan_date, due_date, user_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `, [book_id, borrower_id, loan_date, due_date, user_id]);
            await client.query('UPDATE books SET is_available = FALSE WHERE id = $1', [book_id]);
            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    updateLoanStatus: async (id, status, return_date = null) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const result = await client.query(`
                UPDATE loans
                SET status = $1, return_date = $2
                WHERE id = $3
                RETURNING *
            `, [status, return_date, id]);
            const loan = result.rows[0];
            if (loan) {
                await client.query('UPDATE books SET is_available = $1 WHERE id = $2', [status === 'Dikembalikan', loan.book_id]);
            }
            await client.query('COMMIT');
            return loan;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    deleteLoan: async (id) => {
        const query = 'DELETE FROM loans WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = LoanModel;
