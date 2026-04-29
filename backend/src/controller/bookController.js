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

            // Tangkap nama file dari multer (kalau ada file yang diupload)
            const cover_image = req.file ? req.file.filename : null;

            // VALIDASI REQUIRED
            if (!title || !author || !publisher || !year) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    error: "title, author, publisher, dan year wajib diisi"
                });
            }

            // VALIDASI TIPE DATA (Harus di-parse ke Number karena multipart/form-data ngirimnya String)
            const parsedYear = Number(year);
            if (isNaN(parsedYear)) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    error: "year harus berupa angka valid"
                });
            }

            let parsedCategoryId = null;
            if (category_id !== null && category_id !== undefined) {
                parsedCategoryId = Number(category_id);
                if (isNaN(parsedCategoryId)) {
                    return res.status(400).json({
                        success: false,
                        message: "Validation error",
                        error: "category_id harus berupa angka valid atau tidak diisi"
                    });
                }
            }

            // Masukkan cover_image ke parameter Model
            const newBook = await BookModel.createBook({
                title,
                author,
                publisher,
                year: parsedYear,
                category_id: parsedCategoryId,
                cover_image
            });

            res.status(201).json({
                success: true,
                message: "Berhasil menambahkan buku",
                data: newBook
            });

        } catch (error) {
            console.error("Error createBook:", error.message);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
        }
    },

    updateBook: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, author, publisher, year, category_id } = req.body;

            // Tangkap nama file baru (jika user mau ganti foto)
            const cover_image = req.file ? req.file.filename : null;

            const existingBook = await BookModel.getBookById(id);

            if (!existingBook) {
                return res.status(404).json({
                    success: false,
                    message: "Book not found"
                });
            }

            // VALIDASI REQUIRED
            if (!title || !author || !publisher || !year) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    error: "Semua field (title, author, publisher, year) wajib diisi"
                });
            }

            // VALIDASI TIPE DATA
            const parsedYear = Number(year);
            if (isNaN(parsedYear)) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    error: "year harus berupa angka valid"
                });
            }

            let parsedCategoryId = category_id !== undefined ? category_id : existingBook.category_id;
            if (category_id !== null && category_id !== undefined) {
                parsedCategoryId = Number(category_id);
                if (isNaN(parsedCategoryId)) {
                    return res.status(400).json({
                        success: false,
                        message: "Validation error",
                        error: "category_id harus berupa angka valid"
                    });
                }
            }

            const updatedBook = await BookModel.updateBook(id, {
                title,
                author,
                publisher,
                year: parsedYear,
                category_id: parsedCategoryId,
                cover_image
            });

            res.status(200).json({
                success: true,
                message: "Buku berhasil diupdate",
                data: updatedBook
            });

        } catch (error) {
            console.error("Error updateBook:", error.message);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: error.message
            });
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