const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/stats', authorize('Secretariat', 'Admin'), getStats);

module.exports = router;
