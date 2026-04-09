const pool = require('../config/database');

const BorrowerModel = {

  // GET ALL
  getAll: async () => {
    const result = await pool.query(
      'SELECT * FROM borrowers ORDER BY created_at DESC'
    );
    return result.rows;
  },

  // GET BY ID
  getById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM borrowers WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // CREATE
  create: async ({ name, phone, address }) => {
    const result = await pool.query(
      `INSERT INTO borrowers (name, phone, address)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, phone || null, address || null]
    );
    return result.rows[0];
  },

  // UPDATE
  update: async (id, { name, phone, address }) => {
    const result = await pool.query(
      `UPDATE borrowers SET name = $1, phone = $2, address = $3
       WHERE id = $4 RETURNING *`,
      [name, phone || null, address || null, id]
    );
    return result.rows[0];
  },

  // DELETE
  delete: async (id) => {
    const result = await pool.query(
      'DELETE FROM borrowers WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = BorrowerModel;