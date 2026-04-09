const express = require('express');
const router = express.Router();
const loanController = require('../controller/loanController');

router.get('/', loanController.getAllLoans);
router.get('/:id', loanController.getLoanById);
router.post('/', loanController.createLoan);
// Pakai metode PATCH karena kita cuma update status & return_date, bukan update semua field
router.patch('/:id/status', loanController.updateLoanStatus); 
router.delete('/:id', loanController.deleteLoan);

module.exports = router;