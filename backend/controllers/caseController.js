const Case = require('../models/Case');

// @desc    Create a new case
// @route   POST /api/cases/create
// @access  Private (Staff/Any logged in user for this app)
const createCase = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      department,
      location,
      severity,
      isAnonymous
    } = req.body;

    // Generate tracking ID
    const year = new Date().getFullYear();
    const caseCount = await Case.countDocuments();
    const trackingId = `NEO-${year}-${String(caseCount + 1).padStart(3, "0")}`;

    // Handle file uploads safely
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => `/uploads/${file.filename}`);
    }

    const newCase = new Case({
      trackingId,
      title,
      description,
      category,
      department,
      location,
      severity,
      attachments,
      createdBy: isAnonymous === "true" ? null : req.user?._id
    });

    const savedCase = await newCase.save();

    res.status(201).json(savedCase);

  } catch (error) {
    console.error("CREATE CASE ERROR:", error);
    res.status(500).json({
      message: "Error creating case",
      error: error.message
    });
  }
};


// @desc    Get all cases (Based on role)
// @route   GET /api/cases
// @access  Private
const getCases = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Staff') {
      query.createdBy = req.user._id;
    }
    else if (req.user.role === 'CaseManager') {
      query.assignedTo = req.user._id;
    }

    const cases = await Case.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(cases);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get single case
// @route   GET /api/cases/:id
// @access  Private
const getCaseById = async (req, res) => {
  try {
    const singleCase = await Case.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name email');

    if (singleCase) {
      res.json(singleCase);
    } else {
      res.status(404).json({ message: 'Case not found' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Update case status
// @route   PUT /api/cases/:id/status
// @access  Private (CaseManager, Secretariat, Admin)
const updateCaseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const caseItem = await Case.findById(req.params.id);

    if (caseItem) {
      caseItem.status = status;
      const updatedCase = await caseItem.save();
      res.json(updatedCase);
    } else {
      res.status(404).json({ message: 'Case not found' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Assign case to Case Manager
// @route   PUT /api/cases/:id/assign
// @access  Private (Secretariat, Admin)
const assignCase = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const caseItem = await Case.findById(req.params.id);

    if (caseItem) {
      caseItem.assignedTo = assignedTo;
      caseItem.status = 'Assigned';

      const updatedCase = await caseItem.save();
      res.json(updatedCase);

    } else {
      res.status(404).json({ message: 'Case not found' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Add note to case
// @route   POST /api/cases/:id/notes
// @access  Private
const addNote = async (req, res) => {
  try {
    const { text } = req.body;
    const caseItem = await Case.findById(req.params.id);

    if (caseItem) {
      caseItem.notes.push({
        text,
        addedBy: req.user._id,
      });

      const updatedCase = await caseItem.save();
      res.json(updatedCase);

    } else {
      res.status(404).json({ message: 'Case not found' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Manually escalate a case
// @route   PUT /api/cases/:id/escalate
// @access  Private
const escalateCase = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);

    if (caseItem) {
      caseItem.status = 'Escalated';
      const updatedCase = await caseItem.save();
      res.json(updatedCase);
    }
    else {
      res.status(404).json({ message: 'Case not found' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCase,
  getCases,
  getCaseById,
  updateCaseStatus,
  assignCase,
  addNote,
  escalateCase
};