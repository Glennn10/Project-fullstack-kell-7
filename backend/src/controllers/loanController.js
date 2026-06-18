const LoanModel = require('../models/loanModel');

const loanController = {
    getMyLoans: async (req, res) => {
        try {
            const loans = await LoanModel.getMyLoans(req.user.id);
            res.status(200).json({ success: true, message: 'Data peminjaman akun berhasil diambil', data: loans });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
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
            const { book_id, borrower_id, loan_date, due_date } = req.body;
            const user_id = req.user.id;
            
            if (!book_id || !borrower_id || !loan_date) {
                return res.status(400).json({ success: false, message: 'Buku, peminjam, dan tanggal pinjam wajib diisi' });
            }

            if (isNaN(Number(book_id)) || isNaN(Number(borrower_id))) {
                return res.status(400).json({ success: false, message: 'book_id dan borrower_id harus berupa angka valid' });
            }

            if (isNaN(Date.parse(loan_date))) {
                return res.status(400).json({ success: false, message: 'loan_date harus berupa tanggal valid' });
            }

            const normalizedDueDate = due_date || new Date(new Date(loan_date).getTime() + (7 * 24 * 60 * 60 * 1000));
            if (isNaN(Date.parse(normalizedDueDate)) || new Date(normalizedDueDate) < new Date(loan_date)) {
                return res.status(400).json({ success: false, message: 'Batas pengembalian harus sama atau setelah tanggal pinjam' });
            }

            const newLoan = await LoanModel.createLoan({ book_id, borrower_id, loan_date, due_date: normalizedDueDate, user_id });
            res.status(201).json({ success: true, message: 'Peminjaman berhasil dicatat', data: newLoan });
        } catch (error) {
            console.error(error.message);
            if (error.code === 'BOOK_NOT_FOUND') {
                return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
            }
            if (error.code === 'BOOK_UNAVAILABLE') {
                return res.status(409).json({ success: false, message: 'Buku sedang dipinjam dan belum kembali' });
            }
            res.status(500).json({ success: false, message: 'Internal Server Error (Pastikan ID yang dimasukkan valid)' });
        }
    },
    updateLoanStatus: async (req, res) => {
        try {
            const { status, return_date } = req.body;
            
            const validStatus = ['Dipinjam', 'Dikembalikan', 'Terlambat'];
            if (!validStatus.includes(status)) {
                return res.status(400).json({ success: false, message: "Status harus salah satu dari: 'Dipinjam', 'Dikembalikan', 'Terlambat'" });
            }

            if (return_date && isNaN(Date.parse(return_date))) {
                return res.status(400).json({ success: false, message: 'return_date harus berupa tanggal valid' });
            }

            const normalizedReturnDate = status === 'Dikembalikan' ? (return_date || new Date()) : null;
            const updatedLoan = await LoanModel.updateLoanStatus(req.params.id, status, normalizedReturnDate);
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
