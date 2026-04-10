const pool = require('../config/db');

const BookModel = {
    getAllBooks: async () => {
        const query = 'SELECT * FROM books ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    },

    getBookById: async (id) => {
        const query = 'SELECT * FROM books WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    createBook: async (bookData) => {
        const { title, author, publisher, year, category_id } = bookData;
        const query = `
            INSERT INTO books (title, author, publisher, year, category_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const values = [title, author, publisher, year, category_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    updateBook: async (id, bookData) => {
        const { title, author, publisher, year, category_id } = bookData;
        const query = `
            UPDATE books 
            SET title = $1, author = $2, publisher = $3, year = $4, category_id = $5
            WHERE id = $6
            RETURNING *;
        `;
        const values = [title, author, publisher, year, category_id, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    deleteBook: async (id) => {
        const query = 'DELETE FROM books WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = BookModel;