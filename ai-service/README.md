# DrishtiAI AI Service

Python-based AI service for real-time object detection, text recognition, and scene understanding.

## Features

- 🤖 YOLOv8 Object Detection
- 📖 Tesseract OCR for text recognition
- 💰 Currency detection
- 🚦 Traffic signal recognition
- 🎤 Bilingual voice responses (English & Hindi)

## Installation

```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

## API Endpoints

### POST /detect
Process a video frame and return detections

```json
{
  "frame": "base64_encoded_image"
}
```

Response:
```json
{
  "success": true,
  "detections": [...],
  "voiceResponses": {
    "en": "...",
    "hi": "..."
  },
  "processingTime": 0.234
}
```

### GET /models/status
Check the status of all models
