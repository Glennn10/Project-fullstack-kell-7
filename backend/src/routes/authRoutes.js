const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

// Endpoint untuk Register
// POST /api/auth/register
router.post('/register', authController.register);

// Endpoint untuk Login
// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;