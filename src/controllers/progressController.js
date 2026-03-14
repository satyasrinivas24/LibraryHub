const { Progress, Borrowing, Book } = require('../models');

// POST /api/progress — upsert progress
const upsertProgress = async (req, res) => {
  try {
    const { borrowingId, currentPage, notes } = req.body;

    // Verify borrowing belongs to member
    const borrowing = await Borrowing.findOne({
      where: { id: borrowingId, memberId: req.memberId },
      include: [{ model: Book, as: 'book' }],
    });
    if (!borrowing) {
      return res.status(404).json({ success: false, message: 'Borrowing not found.' });
    }

    const [progress, created] = await Progress.findOrCreate({
      where: { borrowingId },
      defaults: {
        currentPage: currentPage || 0,
        totalPages: borrowing.book?.pages || 300,
        lastReadDate: new Date(),
        notes,
      },
    });

    if (!created) {
      await progress.update({ currentPage, lastReadDate: new Date(), notes });
    }

    res.json({ success: true, data: progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// GET /api/progress/:borrowingId
const getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ where: { borrowingId: req.params.borrowingId } });
    if (!progress) return res.status(404).json({ success: false, message: 'Progress not found.' });
    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

// GET /api/progress/analytics/member/:id
const getMemberAnalytics = async (req, res) => {
  try {
    const memberId = req.params.id;
    const borrowings = await Borrowing.findAll({
      where: { memberId },
      include: [
        { model: Book, as: 'book', attributes: ['title', 'author', 'genre', 'pages'] },
        { model: Progress, as: 'progress' },
      ],
    });

    const stats = {
      totalBorrowed: borrowings.length,
      currentlyReading: borrowings.filter((b) => b.status === 'active').length,
      returned: borrowings.filter((b) => b.status === 'returned').length,
      overdue: borrowings.filter((b) => b.status === 'overdue').length,
      averageProgress:
        borrowings.length > 0
          ? Math.round(
              borrowings
                .filter((b) => b.progress)
                .reduce((acc, b) => {
                  const pct = b.progress.totalPages > 0
                    ? (b.progress.currentPage / b.progress.totalPages) * 100
                    : 0;
                  return acc + pct;
                }, 0) / borrowings.filter((b) => b.progress).length || 0
            )
          : 0,
      genreBreakdown: borrowings.reduce((acc, b) => {
        const genre = b.book?.genre || 'Unknown';
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {}),
      recentActivity: borrowings
        .filter((b) => b.progress)
        .sort((a, b) => new Date(b.progress.lastReadDate) - new Date(a.progress.lastReadDate))
        .slice(0, 5),
    };

    res.json({ success: true, data: stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

module.exports = { upsertProgress, getProgress, getMemberAnalytics };
