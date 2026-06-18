const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const validRoles = ['user', 'admin'];

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
            const { name, email, password, role = 'user' } = req.body;
            if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
            if (!validRoles.includes(role)) return res.status(400).json({ success: false, message: "Role harus 'user' atau 'admin'" });
            
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await UserModel.createUser({ name, email, password: hashedPassword, role });
            res.status(201).json({ success: true, message: 'User berhasil ditambahkan', data: newUser });
        } catch (error) {
            if (error.code === '23505') return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    updateUser: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;
            if (role && !validRoles.includes(role)) return res.status(400).json({ success: false, message: "Role harus 'user' atau 'admin'" });

            const existingUser = await UserModel.getUserById(req.params.id);
            if (!existingUser) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

            const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
            const updatedUser = await UserModel.updateUser(req.params.id, {
                name: name ?? existingUser.name,
                email: email ?? existingUser.email,
                password: hashedPassword,
                role: role ?? existingUser.role
            });
            if (!updatedUser) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
            res.status(200).json({ success: true, message: 'User berhasil diupdate', data: updatedUser });
        } catch (error) {
            if (error.code === '23505') return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
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
