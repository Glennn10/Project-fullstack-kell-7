const express = require('express');
const router = express.Router();

// Import routes
const bookRoutes = require('./bookRoutes');
const categoryRoutes = require('./categoryRoutes');
const userRoutes = require('./userRoutes');
const borrowerRoutes = require('./borrowerRoutes');
const loanRoutes = require('./loanRoutes');

// List daftar semua routes
router.use('/books', bookRoutes);
router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);
router.use('/borrowers', borrowerRoutes);
router.use('/loans', loanRoutes);

module.exports = router;