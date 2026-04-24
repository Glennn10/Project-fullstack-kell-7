const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
    // ==========================================
    // 1. REGISTER USER BARU
    // ==========================================
    register: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            // Validasi input kosong
            if (!name || !email || !password) {
                return res.status(400).json({ success: false, message: 'Name, email, dan password wajib diisi!' });
            }

            // Cek apakah email sudah terdaftar di database
            const existingUser = await UserModel.getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email sudah terdaftar, gunakan email lain.' });
            }

            // HASHING PASSWORD (Bcrypt)
            // Angka 10 adalah 'saltRounds' (tingkat kerumitan acakan, 10 itu standar yang aman & cepat)
            const hashedPassword = await bcrypt.hash(password, 10);

            // Simpan ke database dengan password yang sudah di-hash
            // Jika role tidak dikirim dari front-end, otomatis jadi 'user' dari logic di Model
            const newUser = await UserModel.createUser({ 
                name, 
                email, 
                password: hashedPassword, 
                role 
            });

            res.status(201).json({
                success: true,
                message: 'Registrasi berhasil! Silakan login.',
                data: newUser // (Password gak ikut ke-return karena di query Model udah kita atur)
            });

        } catch (error) {
            console.error('Error Register:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

    // ==========================================
    // 2. LOGIN USER (Generate JWT)
    // ==========================================
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validasi input kosong
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email dan password wajib diisi!' });
            }

            // Cari user berdasarkan email
            const user = await UserModel.getUserByEmail(email);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Email atau password salah!' });
            }

            // KOMPARASI PASSWORD (Bcrypt)
            // Membandingkan password plain text dari req.body dengan password hash dari database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Email atau password salah!' });
            }

            // GENERATE TOKEN (JWT)
            // Payload (data yang disimpan di token): ID dan Role.
            // Jangan simpan data sensitif kayak password di dalam payload JWT!
            const payload = {
                id: user.id,
                role: user.role
            };

            // Membuat token dengan secret key dari .env, berlaku selama 1 hari (1d)
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.status(200).json({
                success: true,
                message: 'Login berhasil!',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token: token // Ini "tiket masuk" yang harus disimpan client (Front-end/Postman)
                }
            });

        } catch (error) {
            console.error('Error Login:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};

module.exports = authController;