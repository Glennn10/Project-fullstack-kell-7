const BorrowerModel = require('../models/borrowerModel');

const borrowerController = {
    getAllBorrowers: async (req, res) => {
        try {
            const borrowers = await BorrowerModel.getAllBorrowers();
            res.status(200).json({ success: true, message: 'Data peminjam berhasil diambil', data: borrowers });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    getBorrowerById: async (req, res) => {
        try {
            const borrower = await BorrowerModel.getBorrowerById(req.params.id);
            if (!borrower) return res.status(404).json({ success: false, message: 'Peminjam tidak ditemukan' });
            res.status(200).json({ success: true, data: borrower });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    createBorrower: async (req, res) => {
        try {
            const { name, phone, address } = req.body;
            if (!name) return res.status(400).json({ success: false, message: 'Nama peminjam wajib diisi' });
            
            const newBorrower = await BorrowerModel.createBorrower({ name, phone, address });
            res.status(201).json({ success: true, message: 'Peminjam berhasil ditambahkan', data: newBorrower });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    updateBorrower: async (req, res) => {
        try {
            const { name, phone, address } = req.body;
            const updatedBorrower = await BorrowerModel.updateBorrower(req.params.id, { name, phone, address });
            if (!updatedBorrower) return res.status(404).json({ success: false, message: 'Peminjam tidak ditemukan' });
            res.status(200).json({ success: true, message: 'Peminjam berhasil diupdate', data: updatedBorrower });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    deleteBorrower: async (req, res) => {
        try {
            const deletedBorrower = await BorrowerModel.deleteBorrower(req.params.id);
            if (!deletedBorrower) return res.status(404).json({ success: false, message: 'Peminjam tidak ditemukan' });
            res.status(200).json({ success: true, message: 'Peminjam berhasil dihapus', data: deletedBorrower });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};

module.exports = borrowerController;