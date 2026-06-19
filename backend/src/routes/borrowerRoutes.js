const express = require('express');
const router = express.Router();
const borrowerController = require('../controllers/borrowerController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken, isAdmin);

router.get('/', borrowerController.getAllBorrowers);
router.get('/:id', borrowerController.getBorrowerById);
router.post('/', borrowerController.createBorrower);
router.put('/:id', borrowerController.updateBorrower);
router.patch('/:id/status', borrowerController.updateBorrowerStatus);
router.delete('/:id', borrowerController.deleteBorrower);

module.exports = router;
