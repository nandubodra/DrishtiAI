const mongoose = require('mongoose');

const detectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  detectionType: {
    type: String,
    enum: ['object', 'text', 'currency', 'traffic_signal', 'scene'],
    required: true
  },
  data: {
    objectName: String,
    confidence: Number,
    distance: Number,
    location: String,
    currency: String,
    amount: Number,
    trafficSignal: String,
    textContent: String,
    coordinates: {
      x: Number,
      y: Number,
      width: Number,
      height: Number
    }
  },
  voiceResponse: {
    en: String,
    hi: String
  },
  frameImage: String,
  processingTime: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Detection', detectionSchema);
