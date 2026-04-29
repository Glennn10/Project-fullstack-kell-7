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

    // Create: Tambah buku baru (Update tambah cover_image)
    createBook: async (bookData) => {
        const { title, author, publisher, year, category_id, cover_image } = bookData;
        const query = `
            INSERT INTO books (title, author, publisher, year, category_id, cover_image)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [title, author, publisher, year, category_id, cover_image];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Update: Ubah data buku (Update tambah cover_image)
    updateBook: async (id, bookData) => {
        const { title, author, publisher, year, category_id, cover_image } = bookData;
        
        // Kita pakai trik COALESCE di PostgreSQL. 
        // Artinya: Kalau cover_image yang dikirim null (gak upload foto baru), pake nama foto yang lama aja.
        const query = `
            UPDATE books 
            SET title = $1, author = $2, publisher = $3, year = $4, category_id = $5, cover_image = COALESCE($6, cover_image)
            WHERE id = $7
            RETURNING *;
        `;
        const values = [title, author, publisher, year, category_id, cover_image, id];
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