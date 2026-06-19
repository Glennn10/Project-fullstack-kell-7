const pool = require('../config/db');

const LoanModel = {
    getAllLoans: async () => {
        const query = `
            SELECT 
                l.id, 
                l.book_id,
                l.borrower_id,
                b.title AS book_title, 
                b.author AS book_author,
                b.cover_image,
                br.name AS borrower_name, 
                u.name AS staff_name,
                l.loan_date, 
                COALESCE(l.due_date, (l.loan_date + INTERVAL '7 days')::date) AS due_date,
                l.return_date, 
                l.return_condition,
                l.return_notes,
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

            const borrowerResult = await client.query('SELECT id, membership_status FROM borrowers WHERE id = $1', [borrower_id]);
            const borrower = borrowerResult.rows[0];
            if (!borrower) {
                const error = new Error('Anggota tidak ditemukan');
                error.code = 'BORROWER_NOT_FOUND';
                throw error;
            }
            if (borrower.membership_status !== 'Aktif') {
                const error = new Error('Keanggotaan sedang nonaktif');
                error.code = 'BORROWER_INACTIVE';
                throw error;
            }

            const result = await client.query(`
                INSERT INTO loans (book_id, borrower_id, loan_date, due_date, user_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `, [book_id, borrower_id, loan_date, due_date, user_id]);
            await client.query("UPDATE books SET is_available = FALSE, inventory_status = 'Dipinjam' WHERE id = $1", [book_id]);
            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    updateLoanStatus: async (id, status, return_date = null, return_condition = null, return_notes = null) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const result = await client.query(`
                UPDATE loans
                SET status = $1, return_date = $2, return_condition = $3, return_notes = $4
                WHERE id = $5
                RETURNING *
            `, [status, return_date, return_condition, return_notes, id]);
            const loan = result.rows[0];
            if (loan) {
                const nextInventoryStatus = status !== 'Dikembalikan'
                    ? 'Dipinjam'
                    : return_condition === 'Rusak'
                        ? 'Dalam perbaikan'
                        : return_condition === 'Hilang'
                            ? 'Hilang'
                            : 'Tersedia';
                await client.query(
                    'UPDATE books SET is_available = $1, inventory_status = $2 WHERE id = $3',
                    [nextInventoryStatus === 'Tersedia', nextInventoryStatus, loan.book_id]
                );
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
