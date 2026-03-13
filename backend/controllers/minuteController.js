const MeetingMinutes = require('../models/MeetingMinutes');

// @desc    Upload Meeting Minutes
// @route   POST /api/minutes/upload
// @access  Private (Secretariat, Admin)
const uploadMinutes = async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.files[0].filename}`;

    const minutes = await MeetingMinutes.create({
      title,
      fileUrl,
      uploadedBy: req.user._id,
    });

    res.status(201).json(minutes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Meeting Minutes
// @route   GET /api/minutes
// @access  Private
const getMinutes = async (req, res) => {
  try {
    const minutes = await MeetingMinutes.find().populate('uploadedBy', 'name email').sort({ createdAt: -1 });
    res.json(minutes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadMinutes, getMinutes };
