const express = require('express');
const router = express.Router();
const axios = require('axios');
const Detection = require('../models/Detection');
const authMiddleware = require('../middleware/auth');

// Process Video Frame
router.post('/process-frame', authMiddleware, async (req, res) => {
  try {
    const { frameBase64 } = req.body;

    // Send to AI Service for processing
    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/detect`,
      { frame: frameBase64 },
      { timeout: 5000 }
    );

    const { detections, voiceResponses, processingTime } = aiResponse.data;

    // Save detections to database
    for (const detection of detections) {
      const newDetection = new Detection({
        userId: req.user.userId,
        detectionType: detection.type,
        data: detection.data,
        voiceResponse: voiceResponses[detection.type],
        processingTime
      });
      await newDetection.save();
    }

    res.json({
      success: true,
      detections,
      voiceResponses
    });
  } catch (error) {
    console.error('Vision processing error:', error.message);
    res.status(500).json({ success: false, message: 'Vision processing failed' });
  }
});

// Get Detection History
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    
    const detections = await Detection.find({ userId: req.user.userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Detection.countDocuments({ userId: req.user.userId });

    res.json({ success: true, detections, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
