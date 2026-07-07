const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get User Profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update User Profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, language, settings } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone, language, settings, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add Emergency Contact
router.post('/emergency-contact', authMiddleware, async (req, res) => {
  try {
    const { name, phone, relation } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { emergencyContacts: { name, phone, relation } } },
      { new: true }
    ).select('-password');

    res.json({ success: true, message: 'Emergency contact added', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Emergency Contacts
router.get('/emergency-contacts', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ success: true, emergencyContacts: user.emergencyContacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
