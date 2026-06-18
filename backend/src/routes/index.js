const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const bookRoutes = require('./bookRoutes');
const categoryRoutes = require('./categoryRoutes');
const userRoutes = require('./userRoutes');
const borrowerRoutes = require('./borrowerRoutes');
const loanRoutes = require('./loanRoutes');

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);
router.use('/borrowers', borrowerRoutes);
router.use('/loans', loanRoutes);

module.exports = router;
