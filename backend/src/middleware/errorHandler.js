const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Endpoint tidak ditemukan - ${req.method} ${req.originalUrl}`
    });
};

const globalErrorHandler = (err, req, res, next) => {
    console.error('❌ Terjadi Kesalahan:', err.message);
    
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = { notFound, globalErrorHandler };