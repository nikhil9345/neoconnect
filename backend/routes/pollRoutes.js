const express = require('express');
const router = express.Router();
const { createPoll, getPolls, votePoll, getPollResults } = require('../controllers/pollController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('Secretariat', 'Admin'), createPoll);
router.get('/', getPolls);
router.post('/:id/vote', votePoll);
router.get('/:id/results', getPollResults);

module.exports = router;
