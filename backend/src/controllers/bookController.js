const BookModel = require('../models/bookModel');
const crypto = require('crypto');

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
            if (!title || !author || !publisher || !year || !category_id) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    error: "title, author, publisher, year, dan category_id wajib diisi"
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

            const parsedCategoryId = Number(category_id);
            if (isNaN(parsedCategoryId)) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    error: "category_id harus berupa angka valid"
                });
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
                message: "Internal Server Error"
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
            if (!title || !author || !publisher || !year || !category_id) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    error: "Semua field (title, author, publisher, year, category_id) wajib diisi"
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

            const parsedCategoryId = Number(category_id);
            if (isNaN(parsedCategoryId)) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    error: "category_id harus berupa angka valid"
                });
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
                message: "Internal Server Error"
            });
        }
    },
    getAuthPicks: async (req, res) => {
        try {
            const books = await BookModel.getAllBooks();
            const candidates = books.filter((book) => book.cover_image);
            const visitorIp = req.ip || req.socket.remoteAddress || 'local';
            const picks = candidates
                .map((book) => ({
                    book,
                    rank: crypto.createHash('sha256').update(`${visitorIp}:${book.id}`).digest('hex')
                }))
                .sort((left, right) => left.rank.localeCompare(right.rank))
                .slice(0, 2)
                .map(({ book }) => ({ id: book.id, title: book.title, cover_image: book.cover_image }));
            return res.status(200).json({ success: true, data: picks });
        } catch (error) {
            console.error('Error getAuthPicks:', error.message);
            return res.status(500).json({ success: false, message: 'Pilihan buku belum bisa dimuat' });
        }
    },
    getLandingPicks: async (req, res) => {
        try {
            const books = await BookModel.getLandingBooks();
            const weekly = [...books]
                .sort((left, right) => Number(right.weekly_loans) - Number(left.weekly_loans)
                    || Number(right.total_loans) - Number(left.total_loans)
                    || new Date(right.created_at) - new Date(left.created_at))
                .slice(0, 10);

            const now = new Date();
            const weekKey = `${now.getUTCFullYear()}-${Math.ceil((((now - new Date(Date.UTC(now.getUTCFullYear(), 0, 1))) / 86400000) + 1) / 7)}`;
            const curated = books
                .map((book) => ({
                    book,
                    rank: crypto.createHash('sha256').update(`${weekKey}:${book.id}`).digest('hex')
                }))
                .sort((left, right) => left.rank.localeCompare(right.rank))
                .slice(0, 4)
                .map(({ book }) => book);

            return res.status(200).json({ success: true, data: { weekly, curated } });
        } catch (error) {
            console.error('Error getLandingPicks:', error.message);
            return res.status(500).json({ success: false, message: 'Pilihan landing belum bisa dimuat' });
        }
    },

    updateBookStatus: async (req, res) => {
        try {
            const { inventory_status } = req.body;
            const validStatuses = ['Tersedia', 'Dalam perbaikan', 'Hilang'];
            if (!validStatuses.includes(inventory_status)) {
                return res.status(400).json({ success: false, message: 'Status harus Tersedia, Dalam perbaikan, atau Hilang' });
            }

            const existingBook = await BookModel.getBookById(req.params.id);
            if (!existingBook) return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
            if (existingBook.inventory_status === 'Dipinjam') {
                return res.status(409).json({ success: false, message: 'Status buku yang sedang dipinjam hanya bisa berubah melalui Pengembalian' });
            }

            const updatedBook = await BookModel.updateBookStatus(req.params.id, inventory_status);
            return res.status(200).json({ success: true, message: 'Status inventaris berhasil diperbarui', data: updatedBook });
        } catch (error) {
            console.error('Error updateBookStatus:', error.message);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
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
