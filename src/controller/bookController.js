const BookModel = require('../models/bookModel');

const bookController = {
    getAllBooks: async (req, res) => {
        try {
            const books = await BookModel.getAllBooks();
            res.status(200).json({
                success: true,
                message: 'Berhasil mengambil data buku',
                data: books
            });
        } catch (error) {
            console.error('Error getAllBooks:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    getBookById: async (req, res) => {
        try {
            const { id } = req.params;
            const book = await BookModel.getBookById(id);

            if (!book) {
                return res.status(404).json({ 
                    success: false, 
                    message: `Buku dengan ID ${id} tidak ditemukan` 
                });
            }

            res.status(200).json({
                success: true,
                message: 'Berhasil mengambil data buku',
                data: book
            });
        } catch (error) {
            console.error('Error getBookById:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    createBook: async (req, res) => {
        try {
            const { title, author, publisher, year, category_id } = req.body;

            if (!title || !author || !publisher || !year) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Data title, author, publisher, dan year wajib diisi!' 
                });
            }

            const newBook = await BookModel.createBook({ title, author, publisher, year, category_id });
            res.status(201).json({
                success: true,
                message: 'Berhasil menambahkan buku baru',
                data: newBook
            });
        } catch (error) {
            console.error('Error createBook:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // 4. Update data buku
    updateBook: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, author, publisher, year, category_id } = req.body;

            // Cek apakah buku yang mau diupdate itu ada di database
            const existingBook = await BookModel.getBookById(id);
            if (!existingBook) {
                return res.status(404).json({ 
                    success: false, 
                    message: `Gagal update. Buku dengan ID ${id} tidak ditemukan` 
                });
            }

            const updatedBook = await BookModel.updateBook(id, { title, author, publisher, year, category_id });
            res.status(200).json({
                success: true,
                message: 'Berhasil mengupdate data buku',
                data: updatedBook
            });
        } catch (error) {
            console.error('Error updateBook:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // 5. Hapus buku
    deleteBook: async (req, res) => {
        try {
            const { id } = req.params;

            const deletedBook = await BookModel.deleteBook(id);

            if (!deletedBook) {
                return res.status(404).json({ 
                    success: false, 
                    message: `Gagal menghapus. Buku dengan ID ${id} tidak ditemukan` 
                });
            }

            res.status(200).json({
                success: true,
                message: `Berhasil menghapus buku dengan ID ${id}`,
                data: deletedBook
            });
        } catch (error) {
            console.error('Error deleteBook:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};

module.exports = bookController;