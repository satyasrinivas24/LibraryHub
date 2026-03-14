const express = require('express');
const router = express.Router();
const { getBooks, getTopBooks, getBook, createBook, updateBook, getGenres } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

router.get('/genres', getGenres);
router.get('/top', getTopBooks);
router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', protect, createBook);
router.put('/:id', protect, updateBook);

module.exports = router;
