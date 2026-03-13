const Case = require('../models/Case');

// @desc    Get analytics stats
// @route   GET /api/analytics/stats
// @access  Private (Secretariat, Admin)
const getStats = async (req, res) => {
  try {
    const casesByDepartment = await Case.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    const casesByStatus = await Case.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const casesByCategory = await Case.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Hotspot detection: 5+ cases with same department + category
    const hotspots = await Case.aggregate([
      { $group: { 
          _id: { department: '$department', category: '$category' }, 
          count: { $sum: 1 } 
        } 
      },
      { $match: { count: { $gte: 5 } } }
    ]);

    res.json({
      casesByDepartment,
      casesByStatus,
      casesByCategory,
      hotspots
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };
