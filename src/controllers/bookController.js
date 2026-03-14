const { Op } = require('sequelize');
const { Book } = require('../models');

// GET /api/books
const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 12, search = '', genre = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (genre) {
      where.genre = { [Op.iLike]: `%${genre}%` };
    }
    const { count, rows } = await Book.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });
    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// GET /api/books/top
const getTopBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      order: [['rating', 'DESC']],
      limit: 8,
    });
    res.json({ success: true, data: books });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// GET /api/books/:id
const getBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    res.json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// POST /api/books
const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// PUT /api/books/:id
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    await book.update(req.body);
    res.json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// GET /api/books/genres
const getGenres = async (req, res) => {
  try {
    const books = await Book.findAll({ attributes: ['genre'] });
    const genres = [...new Set(books.map((b) => b.genre))].sort();
    res.json({ success: true, data: genres });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

module.exports = { getBooks, getTopBooks, getBook, createBook, updateBook, getGenres };
