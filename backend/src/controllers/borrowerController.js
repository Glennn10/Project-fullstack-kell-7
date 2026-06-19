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
            const { name, phone, address, user_id } = req.body;
            if (!name) return res.status(400).json({ success: false, message: 'Nama peminjam wajib diisi' });

            const newBorrower = await BorrowerModel.createBorrower({ name, phone, address, user_id });
            res.status(201).json({ success: true, message: 'Peminjam berhasil ditambahkan', data: newBorrower });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    updateBorrower: async (req, res) => {
        try {
            const { name, phone, address, user_id } = req.body;
            if (!name) return res.status(400).json({ success: false, message: 'Nama peminjam wajib diisi' });

            const updatedBorrower = await BorrowerModel.updateBorrower(req.params.id, { name, phone, address, user_id });
            if (!updatedBorrower) return res.status(404).json({ success: false, message: 'Peminjam tidak ditemukan' });
            res.status(200).json({ success: true, message: 'Peminjam berhasil diupdate', data: updatedBorrower });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    updateBorrowerStatus: async (req, res) => {
        try {
            const { membership_status } = req.body;
            if (!['Aktif', 'Nonaktif'].includes(membership_status)) {
                return res.status(400).json({ success: false, message: 'Status anggota harus Aktif atau Nonaktif' });
            }
            const borrower = await BorrowerModel.getBorrowerById(req.params.id);
            if (!borrower) return res.status(404).json({ success: false, message: 'Anggota tidak ditemukan' });
            if (membership_status === 'Nonaktif') {
                const borrowers = await BorrowerModel.getAllBorrowers();
                const summary = borrowers.find((item) => String(item.id) === String(req.params.id));
                if (Number(summary?.active_loans || 0) > 0) {
                    return res.status(409).json({ success: false, message: 'Anggota masih membawa buku dan belum bisa dinonaktifkan' });
                }
            }
            const updatedBorrower = await BorrowerModel.updateBorrowerStatus(req.params.id, membership_status);
            return res.status(200).json({ success: true, message: 'Status anggota berhasil diperbarui', data: updatedBorrower });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
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
