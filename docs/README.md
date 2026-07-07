# 📚 DrishtiAI - Complete Documentation

## Project Overview

DrishtiAI is an AI-powered real-time vision assistance system designed for visually impaired users. It combines smart glasses with AI processing to provide real-time voice guidance for safe navigation.

## System Architecture

```
Smart Glasses (Camera)
        ↓
Android Phone
        ↓
┌───────────────────────┐
│  Frontend (React)      │
│  - Dashboard           │
│  - Vision Assistant    │
│  - Emergency Alert     │
│  - Settings            │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  Backend (Node.js)     │
│  - Auth Service        │
│  - Vision Processing   │
│  - Emergency Management│
│  - User Profiles       │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  AI Service (Python)   │
│  - Object Detection    │
│  - Text Recognition    │
│  - Currency Detection  │
│  - Traffic Signals     │
└───────────────────────┘
```

## Technology Stack

### Frontend
- React 18+ with TypeScript
- TailwindCSS for styling
- i18next for bilingual support (English & Hindi)
- Axios for API calls
- React Router for navigation

### Backend
- Node.js 18+ with Express.js
- MongoDB for data persistence
- JWT for authentication
- Socket.io for real-time updates
- Redis for caching

### AI Service
- Python 3.9+
- YOLOv8 for object detection
- Tesseract OCR for text recognition
- OpenCV for image processing
- TensorFlow Lite for mobile optimization

### Mobile
- React Native with Expo
- Expo Camera for video capture
- Expo Location for GPS
- Expo Speech for text-to-speech

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB 5+
- Docker (optional)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 2. AI Service Setup

```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 4. Mobile App Setup

```bash
cd mobile-app
npm install
expo start
# Scan QR code with Expo Go app
```

## Features

### 1. Real-time Vision Assistance
- Live video stream processing
- Object detection with distance estimation
- Text recognition (OCR)
- Currency identification
- Traffic signal detection

### 2. Voice Guidance
- Bilingual support (English & Hindi)
- Text-to-speech output
- Adjustable speed and volume
- Natural language descriptions

### 3. Emergency Features
- One-tap SOS button
- Real-time location sharing
- Contact notification system
- Emergency message in multiple languages

### 4. User Settings
- Language preference (English/Hindi)
- Voice speed adjustment
- Volume control
- Emergency contact management
- App customization

## API Documentation

### Authentication

**Register User**
```
POST /api/auth/register
Body: { name, email, password, phone, language }
```

**Login User**
```
POST /api/auth/login
Body: { email, password }
```

### Vision API

**Process Frame**
```
POST /api/vision/process-frame
Header: Authorization: Bearer {token}
Body: { frameBase64 }
```

**Get Detection History**
```
GET /api/history?type=object&limit=10&skip=0
Header: Authorization: Bearer {token}
```

### Emergency API

**Send Emergency Alert**
```
POST /api/emergency/alert
Header: Authorization: Bearer {token}
Body: { location, address }
```

**Get Emergency Status**
```
GET /api/emergency/status/{emergencyId}
Header: Authorization: Bearer {token}
```

## Bilingual Support

The application supports both English and Hindi:

- UI translations
- Voice responses
- Emergency notifications
- Error messages

Language preference is stored in user profile.

## Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  language: String (en/hi),
  emergencyContacts: Array,
  settings: Object,
  createdAt: Date
}
```

### Detection Collection
```javascript
{
  userId: ObjectId,
  detectionType: String,
  data: Object,
  voiceResponse: Object,
  timestamp: Date
}
```

## Deployment

### Using Docker

```bash
docker-compose up -d
```

### Manual Deployment

1. Deploy backend to Node.js hosting
2. Deploy AI service to Python hosting
3. Deploy frontend to static hosting
4. Setup environment variables
5. Configure database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file

## Support

For issues and questions, please create an issue on GitHub.
