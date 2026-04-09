const express = require('express');
const router  = express.Router();

const {
  getAllLoans, getLoanById, getLoansByBorrower,
  createLoan, returnLoan, updateLoan, deleteLoan,
} = require('../controller/LoanController');

const {
  getAllBorrowers, getBorrowerById,
  createBorrower, updateBorrower, deleteBorrower,
} = require('../controller/BorrowerController');

// ─────────────────────────────────────────
// ROUTES: LOANS (Peminjaman & Pengembalian)
// ─────────────────────────────────────────
router.get   ('/loans',                        getAllLoans);
router.get   ('/loans/:id',                    getLoanById);
router.get   ('/loans/borrower/:borrowerId',   getLoansByBorrower);
router.post  ('/loans',                        createLoan);
router.patch ('/loans/:id/return',             returnLoan);   // proses pengembalian
router.put   ('/loans/:id',                    updateLoan);
router.delete('/loans/:id',                    deleteLoan);

// ─────────────────────────────────────────
// ROUTES: BORROWERS (Data Peminjam)
// ─────────────────────────────────────────
router.get   ('/borrowers',     getAllBorrowers);
router.get   ('/borrowers/:id', getBorrowerById);
router.post  ('/borrowers',     createBorrower);
router.put   ('/borrowers/:id', updateBorrower);
router.delete('/borrowers/:id', deleteBorrower);

module.exports = router;