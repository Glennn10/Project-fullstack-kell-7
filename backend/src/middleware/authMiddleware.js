const jwt = require('jsonwebtoken');
require('dotenv').config();

// ==========================================
// 1. AUTHENTICATION: Cek apakah user bawa Token valid
// ==========================================
const verifyToken = (req, res, next) => {
    // Ambil header Authorization (Biasanya formatnya: "Bearer eyJhbGciOi...")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            message: 'Akses ditolak! Token tidak ditemukan atau format salah.' 
        });
    }

    // Pisahkan kata "Bearer" dan ambil tokennya aja
    const token = authHeader.split(' ')[1];

    try {
        // Verifikasi token dengan secret key kita
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Kalau valid, simpan data (id, role) ke dalam object req.user
        // Biar bisa dipakai di controller nanti (misal buat tau siapa yang lagi login)
        req.user = decoded;
        
        // Lanjut ke controller/proses berikutnya
        next();
    } catch (error) {
        return res.status(403).json({ 
            success: false, 
            message: 'Token tidak valid atau sudah kedaluwarsa! Silakan login ulang.' 
        });
    }
};

// ==========================================
// 2. AUTHORIZATION: Cek apakah user adalah Admin
// ==========================================
const isAdmin = (req, res, next) => {
    // Pastikan verifyToken sudah dijalankan sebelumnya sehingga req.user ada isinya
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Akses terlarang! Endpoint ini hanya untuk Admin.' 
        });
    }
    // Kalau dia admin, silakan lanjut
    next();
};

module.exports = { verifyToken, isAdmin };