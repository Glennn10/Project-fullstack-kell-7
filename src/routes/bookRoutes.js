const express = require('express');
const router = express.Router();
const bookController = require('../controller/bookController');

// 1. GET: Ambil semua buku
// Endpoint: GET /api/books
router.get('/', bookController.getAllBooks);

// 2. GET: Ambil satu buku berdasarkan ID
// Endpoint: GET /api/books/:id
router.get('/:id', bookController.getBookById);

// 3. POST: Tambah buku baru
// Endpoint: POST /api/books
router.post('/', bookController.createBook);

// 4. PUT: Update data buku
// Endpoint: PUT /api/books/:id
router.put('/:id', bookController.updateBook);

// 5. DELETE: Hapus buku
// Endpoint: DELETE /api/books/:id
router.delete('/:id', bookController.deleteBook);

module.exports = router;