const express = require('express');
const router = express.Router();
const { upsertProgress, getProgress, getMemberAnalytics } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', upsertProgress);
router.get('/analytics/member/:id', getMemberAnalytics);
router.get('/:borrowingId', getProgress);

module.exports = router;
