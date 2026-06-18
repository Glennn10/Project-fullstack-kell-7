const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Peminjaman milik akun yang sedang login.
router.get('/my', verifyToken, loanController.getMyLoans);

// Lihat seluruh riwayat pinjaman: khusus Admin
router.get('/', verifyToken, isAdmin, loanController.getAllLoans);
router.get('/:id', verifyToken, isAdmin, loanController.getLoanById);

// Bikin peminjaman baru: khusus Admin
router.post('/', verifyToken, isAdmin, loanController.createLoan);

// Update status & Hapus data peminjaman: Wajib Admin
router.patch('/:id/status', verifyToken, isAdmin, loanController.updateLoanStatus); 
router.delete('/:id', verifyToken, isAdmin, loanController.deleteLoan);

module.exports = router;
