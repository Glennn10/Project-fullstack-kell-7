const multer = require('multer');
const path = require('path');

// ==========================================
// 1. KONFIGURASI STORAGE (Tempat & Nama File)
// ==========================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Nentuin folder tujuan simpan file (sesuai folder yang lu bikin tadi)
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Biar file gak ketimpa (overwrite), kita tambahin timestamp unik
        // Format: fieldname-waktuSekarang.extensi
        // Contoh jadinya: cover_image-1714402249000.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// ==========================================
// 2. VALIDASI TIPE FILE (Filter)
// ==========================================
const fileFilter = (req, file, cb) => {
    // Cuma ngebolehin file gambar (jpeg, jpg, png)
    const allowedTypes = /jpeg|jpg|png/;
    
    // Cek ekstensi file dan mimetype-nya
    const isExtNameValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isMimeTypeValid = allowedTypes.test(file.mimetype);

    if (isExtNameValid && isMimeTypeValid) {
        cb(null, true);
    } else {
        cb(new Error('Validasi Gagal: Hanya diperbolehkan upload file gambar (JPEG, JPG, PNG)!'), false);
    }
};

// ==========================================
// 3. INISIALISASI MULTER
// ==========================================
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit ukuran file maksimal 5 MB
    },
    fileFilter: fileFilter
});

module.exports = upload;