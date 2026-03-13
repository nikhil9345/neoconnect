const express = require('express');
const router = express.Router();
const { 
  createCase, 
  getCases, 
  getCaseById, 
  updateCaseStatus, 
  assignCase, 
  addNote,
  escalateCase 
} = require('../controllers/caseController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All case routes are protected
router.use(protect);

router.post('/create', upload.array('attachments', 5), createCase);
router.get('/', getCases);
router.get('/:id', getCaseById);
router.put('/:id/status', authorize('CaseManager', 'Secretariat', 'Admin'), updateCaseStatus);
router.put('/:id/assign', authorize('Secretariat', 'Admin'), assignCase);
router.post('/:id/notes', addNote);
router.put('/:id/escalate', authorize('Secretariat', 'Admin'), escalateCase);

module.exports = router;
