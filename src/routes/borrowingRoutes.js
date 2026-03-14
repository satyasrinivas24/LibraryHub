const express = require('express');
const router = express.Router();
const { createBorrowing, returnBook, getMyBorrowings, getOverdue } = require('../controllers/borrowingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/me', getMyBorrowings);
router.get('/overdue', getOverdue);
router.post('/', createBorrowing);
router.put('/:id/return', returnBook);

module.exports = router;
