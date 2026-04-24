const express = require('express');
const router = express.Router();

// Import semua routes
const authRoutes = require('./authRoutes'); // <-- 1. Import authRoutes
const bookRoutes = require('./bookRoutes');
const categoryRoutes = require('./categoryRoutes');
const userRoutes = require('./userRoutes');
const borrowerRoutes = require('./borrowerRoutes');
const loanRoutes = require('./loanRoutes');

// Daftarkan semua routes di sini
router.use('/auth', authRoutes); // <-- 2. Daftarkan dengan awalan /auth
router.use('/books', bookRoutes);
router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);
router.use('/borrowers', borrowerRoutes);
router.use('/loans', loanRoutes);

module.exports = router;