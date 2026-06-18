const pool = require('../config/db');

const CategoryModel = {
    getAllCategories: async () => {
        const query = `
            SELECT c.*, COUNT(b.id)::int AS book_count
            FROM categories c
            LEFT JOIN books b ON b.category_id = c.id
            GROUP BY c.id
            ORDER BY c.created_at DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    },
    getCategoryById: async (id) => {
        const query = 'SELECT * FROM categories WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },
    getCategoryByName: async (name) => {
        const query = 'SELECT * FROM categories WHERE LOWER(name) = LOWER($1)';
        const result = await pool.query(query, [name]);
        return result.rows[0];
    },
    getBookCount: async (id) => {
        const result = await pool.query('SELECT COUNT(*)::int AS count FROM books WHERE category_id = $1', [id]);
        return result.rows[0].count;
    },
    createCategory: async (name) => {
        const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
        const result = await pool.query(query, [name]);
        return result.rows[0];
    },
    updateCategory: async (id, name) => {
        const query = 'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *';
        const result = await pool.query(query, [name, id]);
        return result.rows[0];
    },
    deleteCategory: async (id) => {
        const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = CategoryModel;
