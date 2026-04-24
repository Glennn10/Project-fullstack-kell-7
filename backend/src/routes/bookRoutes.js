const express = require('express');
const router = express.Router();
const bookController = require('../controller/bookController');

// 1. IMPORT MIDDLEWARE (SATPAM)
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// ==========================================
// PUBLIC ROUTES (Tidak butuh login)
// ==========================================
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// ==========================================
// PROTECTED ROUTES (Butuh login & Wajib Admin)
// ==========================================
// Middleware akan mengeksekusi verifyToken dulu -> kalau lolos cek isAdmin -> kalau lolos baru jalankan Controller
router.post('/', verifyToken, isAdmin, bookController.createBook);
router.put('/:id', verifyToken, isAdmin, bookController.updateBook);
router.delete('/:id', verifyToken, isAdmin, bookController.deleteBook);

module.exports = router;