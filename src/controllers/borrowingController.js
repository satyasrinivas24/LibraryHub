const { Book, Borrowing, Progress, Member } = require('../models');
const { Op } = require('sequelize');

// POST /api/borrowings
const createBorrowing = async (req, res) => {
  try {
    const { bookId } = req.body;
    const memberId = req.memberId;

    // Check book availability
    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    if (book.availableCopies < 1) {
      return res.status(400).json({ success: false, message: 'No copies available.' });
    }

    // Check if already borrowed
    const active = await Borrowing.findOne({
      where: { memberId, bookId, status: 'active' },
    });
    if (active) {
      return res.status(400).json({ success: false, message: 'You already have this book borrowed.' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks

    const borrowing = await Borrowing.create({
      memberId,
      bookId,
      borrowDate: new Date(),
      dueDate,
    });

    // Create initial progress
    await Progress.create({
      borrowingId: borrowing.id,
      currentPage: 0,
      totalPages: book.pages || 300,
      lastReadDate: new Date(),
    });

    // Decrease available copies
    await book.update({ availableCopies: book.availableCopies - 1 });

    const result = await Borrowing.findByPk(borrowing.id, {
      include: [
        { model: Book, as: 'book' },
        { model: Progress, as: 'progress' },
      ],
    });

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// PUT /api/borrowings/:id/return
const returnBook = async (req, res) => {
  try {
    const borrowing = await Borrowing.findOne({
      where: { id: req.params.id, memberId: req.memberId },
      include: [{ model: Book, as: 'book' }],
    });
    if (!borrowing) return res.status(404).json({ success: false, message: 'Borrowing not found.' });
    if (borrowing.status === 'returned') {
      return res.status(400).json({ success: false, message: 'Book already returned.' });
    }

    await borrowing.update({ status: 'returned', returnDate: new Date() });
    await borrowing.book.update({ availableCopies: borrowing.book.availableCopies + 1 });

    res.json({ success: true, data: borrowing, message: 'Book returned successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// GET /api/borrowings/me
const getMyBorrowings = async (req, res) => {
  try {
    const borrowings = await Borrowing.findAll({
      where: { memberId: req.memberId },
      include: [
        { model: Book, as: 'book' },
        { model: Progress, as: 'progress' },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Auto-update overdue status
    const now = new Date();
    for (const b of borrowings) {
      if (b.status === 'active' && new Date(b.dueDate) < now) {
        await b.update({ status: 'overdue' });
      }
    }

    res.json({ success: true, data: borrowings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// GET /api/borrowings/overdue
const getOverdue = async (req, res) => {
  try {
    const borrowings = await Borrowing.findAll({
      where: { status: 'overdue' },
      include: [
        { model: Book, as: 'book' },
        { model: Member, as: 'member' },
      ],
    });
    res.json({ success: true, data: borrowings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

module.exports = { createBorrowing, returnBook, getMyBorrowings, getOverdue };
