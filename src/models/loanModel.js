const pool = require('../config/database');

const LoanModel = {

  // GET ALL
  getAll: async () => {
    const query = `
      SELECT
        l.id,
        l.loan_date,
        l.return_date,
        l.status,
        l.created_at,
        b.id     AS book_id,
        b.title  AS book_title,
        b.author AS book_author,
        bw.id    AS borrower_id,
        bw.name  AS borrower_name,
        bw.phone AS borrower_phone,
        u.name   AS processed_by
      FROM loans l
      JOIN books     b  ON l.book_id     = b.id
      JOIN borrowers bw ON l.borrower_id = bw.id
      LEFT JOIN users u ON l.user_id     = u.id
      ORDER BY l.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // GET BY ID
  getById: async (id) => {
    const query = `
      SELECT
        l.*,
        b.title       AS book_title,
        b.author      AS book_author,
        bw.name       AS borrower_name,
        bw.phone      AS borrower_phone,
        bw.address    AS borrower_address,
        u.name        AS processed_by
      FROM loans l
      JOIN books     b  ON l.book_id     = b.id
      JOIN borrowers bw ON l.borrower_id = bw.id
      LEFT JOIN users u ON l.user_id     = u.id
      WHERE l.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // GET BY BORROWER
  getByBorrower: async (borrowerId) => {
    const query = `
      SELECT l.*, b.title, b.author
      FROM loans l
      JOIN books b ON l.book_id = b.id
      WHERE l.borrower_id = $1
      ORDER BY l.loan_date DESC
    `;
    const result = await pool.query(query, [borrowerId]);
    return result.rows;
  },

  // CREATE
  create: async ({ book_id, borrower_id, loan_date, return_date, user_id }) => {
    const result = await pool.query(
      `INSERT INTO loans (book_id, borrower_id, loan_date, return_date, user_id, status)
       VALUES ($1, $2, $3, $4, $5, 'Dipinjam')
       RETURNING *`,
      [book_id, borrower_id, loan_date, return_date, user_id || null]
    );
    return result.rows[0];
  },

  // PROSES PENGEMBALIAN - update return_date & status
  processReturn: async (id, actualReturnDate) => {
    const existing = await pool.query('SELECT return_date, status FROM loans WHERE id = $1', [id]);
    if (!existing.rows[0]) throw new Error('Data loan tidak ditemukan');
    if (existing.rows[0].status === 'Dikembalikan') throw new Error('Buku sudah dikembalikan');

    const batasKembali = new Date(existing.rows[0].return_date);
    const tglKembali   = new Date(actualReturnDate);
    const newStatus    = tglKembali > batasKembali ? 'Terlambat' : 'Dikembalikan';

    const result = await pool.query(
      `UPDATE loans SET return_date = $1, status = $2 WHERE id = $3 RETURNING *`,
      [actualReturnDate, newStatus, id]
    );
    return result.rows[0];
  },

  // UPDATE
  update: async (id, { book_id, borrower_id, loan_date, return_date, status, user_id }) => {
    const result = await pool.query(
      `UPDATE loans
       SET book_id = $1, borrower_id = $2, loan_date = $3,
           return_date = $4, status = $5, user_id = $6
       WHERE id = $7
       RETURNING *`,
      [book_id, borrower_id, loan_date, return_date, status, user_id || null, id]
    );
    return result.rows[0];
  },

  // DELETE
  delete: async (id) => {
    const result = await pool.query(
      'DELETE FROM loans WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = LoanModel;