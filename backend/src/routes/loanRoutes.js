const express = require('express');
const router = express.Router();
const loanController = require('../controller/loanController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Lihat riwayat pinjaman: minimal harus login (nanti bisa di-upgrade cuma liat riwayat sendiri)
router.get('/', verifyToken, loanController.getAllLoans);
router.get('/:id', verifyToken, loanController.getLoanById);

// Bikin peminjaman baru: minimal harus login
router.post('/', verifyToken, loanController.createLoan);

// Update status & Hapus data peminjaman: Wajib Admin
router.patch('/:id/status', verifyToken, isAdmin, loanController.updateLoanStatus); 
router.delete('/:id', verifyToken, isAdmin, loanController.deleteLoan);

module.exports = router;