const BorrowerModel = require('../models/borrowerModel');

// GET /api/borrowers
const getAllBorrowers = async (req, res) => {
  try {
    const data = await BorrowerModel.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/borrowers/:id
const getBorrowerById = async (req, res) => {
  try {
    const data = await BorrowerModel.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/borrowers
const createBorrower = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Field name wajib diisi' });
    }
    const data = await BorrowerModel.create({ name, phone, address });
    res.status(201).json({ success: true, message: 'Borrower berhasil ditambahkan', data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/borrowers/:id
const updateBorrower = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Field name wajib diisi' });
    }
    const data = await BorrowerModel.update(req.params.id, { name, phone, address });
    if (!data) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.json({ success: true, message: 'Borrower diperbarui', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/borrowers/:id
const deleteBorrower = async (req, res) => {
  try {
    const data = await BorrowerModel.delete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.json({ success: true, message: 'Borrower dihapus', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllBorrowers, getBorrowerById, createBorrower, updateBorrower, deleteBorrower };