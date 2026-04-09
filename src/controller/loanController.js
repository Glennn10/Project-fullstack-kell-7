const LoanModel = require('../models/LoanModel');

// GET /api/loans
const getAllLoans = async (req, res) => {
  try {
    const data = await LoanModel.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/loans/:id
const getLoanById = async (req, res) => {
  try {
    const data = await LoanModel.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/loans/borrower/:borrowerId
const getLoansByBorrower = async (req, res) => {
  try {
    const data = await LoanModel.getByBorrower(req.params.borrowerId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/loans
const createLoan = async (req, res) => {
  try {
    const { book_id, borrower_id, loan_date, return_date, user_id } = req.body;
    if (!book_id || !borrower_id || !loan_date || !return_date) {
      return res.status(400).json({
        success: false,
        message: 'Field book_id, borrower_id, loan_date, return_date wajib diisi',
      });
    }
    const data = await LoanModel.create({ book_id, borrower_id, loan_date, return_date, user_id });
    res.status(201).json({ success: true, message: 'Loan berhasil dibuat', data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PATCH /api/loans/:id/return  — proses pengembalian
const returnLoan = async (req, res) => {
  try {
    const { return_date } = req.body;
    if (!return_date) {
      return res.status(400).json({ success: false, message: 'return_date wajib diisi' });
    }
    const data = await LoanModel.processReturn(req.params.id, return_date);
    res.json({
      success: true,
      message: `Buku berhasil dikembalikan. Status: ${data.status}`,
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/loans/:id
const updateLoan = async (req, res) => {
  try {
    const data = await LoanModel.update(req.params.id, req.body);
    if (!data) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.json({ success: true, message: 'Loan diperbarui', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/loans/:id
const deleteLoan = async (req, res) => {
  try {
    const data = await LoanModel.delete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.json({ success: true, message: 'Loan dihapus', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllLoans, getLoanById, getLoansByBorrower, createLoan, returnLoan, updateLoan, deleteLoan };