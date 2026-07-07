const express = require('express');
const router = express.Router();
const Detection = require('../models/Detection');
const authMiddleware = require('../middleware/auth');

// Get all detection history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type, limit = 20, skip = 0, startDate, endDate } = req.query;
    
    let query = { userId: req.user.userId };
    
    if (type) {
      query.detectionType = type;
    }
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const history = await Detection.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Detection.countDocuments(query);

    res.json({ success: true, history, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await Detection.aggregate([
      { $match: { userId: req.user.userId } },
      {
        $group: {
          _id: '$detectionType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
