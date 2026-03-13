const express = require('express');
const router = express.Router();
const { uploadMinutes, getMinutes } = require('../controllers/minuteController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.post('/upload', authorize('Secretariat', 'Admin'), upload.array('file', 1), uploadMinutes);
router.get('/', getMinutes);

module.exports = router;
