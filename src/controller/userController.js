const UserModel = require('../models/userModel');

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await UserModel.getAllUsers();
            res.status(200).json({ success: true, message: 'Data user berhasil diambil', data: users });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    getUserById: async (req, res) => {
        try {
            const user = await UserModel.getUserById(req.params.id);
            if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    createUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
            
            const newUser = await UserModel.createUser({ name, email, password });
            res.status(201).json({ success: true, message: 'User berhasil ditambahkan', data: newUser });
        } catch (error) {
            // Error code 23505 adalah error PostgreSQL untuk UNIQUE violation (email sudah terdaftar)
            if (error.code === '23505') return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    updateUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const updatedUser = await UserModel.updateUser(req.params.id, { name, email, password });
            if (!updatedUser) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
            res.status(200).json({ success: true, message: 'User berhasil diupdate', data: updatedUser });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const deletedUser = await UserModel.deleteUser(req.params.id);
            if (!deletedUser) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
            res.status(200).json({ success: true, message: 'User berhasil dihapus', data: deletedUser });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};

module.exports = userController;