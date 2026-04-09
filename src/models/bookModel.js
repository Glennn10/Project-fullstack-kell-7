const pool = require('../config/db');

const BookModel = {
    // Read: Dapatkan semua buku
    getAllBooks: async () => {
        // Kita bisa tambahkan JOIN nanti untuk menampilkan nama kategori, 
        // tapi untuk awal kita select dari tabel books dulu
        const query = 'SELECT * FROM books ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    },

    // Read: Dapatkan satu buku berdasarkan ID
    getBookById: async (id) => {
        const query = 'SELECT * FROM books WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0]; // Kembalikan 1 baris data
    },

    // Create: Tambah buku baru
    createBook: async (bookData) => {
        const { title, author, publisher, year, category_id } = bookData;
        const query = `
            INSERT INTO books (title, author, publisher, year, category_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        // RETURNING * berguna untuk mengembalikan data yang baru saja di-insert
        const values = [title, author, publisher, year, category_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Update: Ubah data buku
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

    // Delete: Hapus buku
    deleteBook: async (id) => {
        const query = 'DELETE FROM books WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = BookModel;