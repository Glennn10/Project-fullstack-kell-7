const LoanModel = require('../models/loanModel');

const loanController = {
    getAllLoans: async (req, res) => {
        try {
            const loans = await LoanModel.getAllLoans();
            res.status(200).json({ success: true, message: 'Data peminjaman berhasil diambil', data: loans });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    getLoanById: async (req, res) => {
        try {
            const loan = await LoanModel.getLoanById(req.params.id);
            if (!loan) return res.status(404).json({ success: false, message: 'Data peminjaman tidak ditemukan' });
            res.status(200).json({ success: true, data: loan });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    createLoan: async (req, res) => {
        try {
            const { book_id, borrower_id, loan_date, user_id } = req.body;
            
            if (!book_id || !borrower_id || !loan_date || !user_id) {
                return res.status(400).json({ success: false, message: 'book_id, borrower_id, loan_date, dan user_id wajib diisi' });
            }

            const newLoan = await LoanModel.createLoan({ book_id, borrower_id, loan_date, user_id });
            res.status(201).json({ success: true, message: 'Peminjaman berhasil dicatat', data: newLoan });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error (Pastikan ID yang dimasukkan valid)' });
        }
    },
    updateLoanStatus: async (req, res) => {
        try {
            const { status, return_date } = req.body;
            
            // Validasi ENUM sesuai database
            const validStatus = ['Dipinjam', 'Dikembalikan', 'Terlambat'];
            if (!validStatus.includes(status)) {
                return res.status(400).json({ success: false, message: "Status harus salah satu dari: 'Dipinjam', 'Dikembalikan', 'Terlambat'" });
            }

            const updatedLoan = await LoanModel.updateLoanStatus(req.params.id, status, return_date);
            if (!updatedLoan) return res.status(404).json({ success: false, message: 'Data peminjaman tidak ditemukan' });
            
            res.status(200).json({ success: true, message: 'Status peminjaman berhasil diupdate', data: updatedLoan });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    deleteLoan: async (req, res) => {
        try {
            const deletedLoan = await LoanModel.deleteLoan(req.params.id);
            if (!deletedLoan) return res.status(404).json({ success: false, message: 'Data peminjaman tidak ditemukan' });
            res.status(200).json({ success: true, message: 'Data peminjaman berhasil dihapus', data: deletedLoan });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};

module.exports = loanController;