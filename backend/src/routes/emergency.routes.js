const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const axios = require('axios');

// Trigger Emergency Alert
router.post('/alert', authMiddleware, async (req, res) => {
  try {
    const { location, address } = req.body;
    const user = await User.findById(req.user.userId);

    const emergency = new Emergency({
      userId: req.user.userId,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      address,
      message: {
        en: `Emergency alert from ${user.name}. Location: ${address}`,
        hi: `${user.name} से आपातकालीन सतर्कता। स्थान: ${address}`
      }
    });

    await emergency.save();

    // Notify emergency contacts
    if (user.emergencyContacts && user.emergencyContacts.length > 0) {
      const smsMessage = emergency.message.en;
      
      for (const contact of user.emergencyContacts) {
        // Send SMS/Call to emergency contacts (integrate with SMS service)
        emergency.notifiedContacts.push({
          name: contact.name,
          phone: contact.phone,
          notifiedAt: new Date(),
          messageStatus: 'sent'
        });
      }
      await emergency.save();
    }

    res.json({
      success: true,
      message: 'Emergency alert triggered',
      emergencyId: emergency._id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Emergency Status
router.get('/status/:emergencyId', authMiddleware, async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.emergencyId);
    
    if (!emergency) {
      return res.status(404).json({ success: false, message: 'Emergency not found' });
    }

    res.json({ success: true, emergency });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cancel Emergency
router.put('/cancel/:emergencyId', authMiddleware, async (req, res) => {
  try {
    const emergency = await Emergency.findByIdAndUpdate(
      req.params.emergencyId,
      { status: 'cancelled', resolvedAt: new Date() },
      { new: true }
    );

    res.json({ success: true, message: 'Emergency cancelled', emergency });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
