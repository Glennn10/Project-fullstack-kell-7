const multer = require('multer');

const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Endpoint tidak ditemukan - ${req.method} ${req.originalUrl}`
    });
};

const globalErrorHandler = (err, req, res, next) => {
    console.error('Terjadi Kesalahan:', err.message);

    if (err instanceof multer.MulterError) {
        const message = err.code === 'LIMIT_FILE_SIZE'
            ? 'Ukuran file maksimal 5 MB'
            : err.message;

        return res.status(400).json({
            success: false,
            message
        });
    }

    if (err.message && err.message.startsWith('Validasi Gagal:')) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = { notFound, globalErrorHandler };
