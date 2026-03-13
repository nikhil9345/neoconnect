const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getCaseManagers } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/case-managers', protect, getCaseManagers);

module.exports = router;
