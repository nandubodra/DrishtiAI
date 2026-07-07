# DrishtiAI - Development Guide

## Project Structure

```
DrishtiAI/
├── backend/
│   ├── src/
│   │   ├── index.js           # Main server file
│   │   ├── models/            # Database schemas
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth & logging
│   │   └── utils/             # Helper functions
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main component
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── i18n/              # Translations
│   │   └── App.css            # Global styles
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── ai-service/
│   ├── app.py                 # Flask app
│   ├── detectors.py           # Detection models
│   ├── voice_generator.py     # Voice responses
│   ├── config.py              # Configuration
│   ├── requirements.txt
│   └── Dockerfile
│
├── mobile-app/
│   ├── src/
│   │   ├── screens/           # App screens
│   │   ├── components/        # Reusable components
│   │   └── i18n/              # Translations
│   ├── app.json               # Expo config
│   └── package.json
│
├── docs/
├── docker-compose.yml
├── README.md
├── INSTALLATION.md
└── DEVELOPMENT.md
```

## Architecture Overview

### Data Flow

```
┌──────────────────┐
│  Smart Glasses   │
│    (Camera)      │
└────────┬─────────┘
         │ Video Stream
         ▼
┌──────────────────┐
│  Android Phone   │
│   (Frontend App) │
└────────┬─────────┘
         │ HTTP/WebSocket
         ▼
┌──────────────────────────────────────┐
│         Backend (Node.js)            │
│  ┌─────────────────────────────────┐ │
│  │  Express Server                 │ │
│  │  - Route Handler                │ │
│  │  - Validation                   │ │
│  │  - Authentication               │ │
│  └─────────────────────────────────┘ │
│           │                          │
│           ▼                          │
│  ┌─────────────────────────────────┐ │
│  │  AI Service Connector           │ │
│  │  - Send frames to AI            │ │
│  │  - Receive detections           │ │
│  └─────────────────────────────────┘ │
│           │                          │
│           ▼                          │
│  ┌─────────────────────────────────┐ │
│  │  Database & Cache               │ │
│  │  - User data                    │ │
│  │  - Detection history            │ │
│  │  - Session cache                │ │
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│      AI Service (Python)             │
│  ┌─────────────────────────────────┐ │
│  │  Frame Processing               │ │
│  │  - Decode Base64 image          │ │
│  │  - Resize & normalize           │ │
│  └─────────────────────────────────┘ │
│           │                          │
│           ▼                          │
│  ┌─────────────────────────────────┐ │
│  │  ML Models                      │ │
│  │  - YOLOv8 (Object Detection)    │ │
│  │  - Tesseract (OCR)              │ │
│  │  - Custom Models                │ │
│  └─────────────────────────────────┘ │
│           │                          │
│           ▼                          │
│  ┌─────────────────────────────────┐ │
│  │  Response Generation            │ │
│  │  - Detections                   │ │
│  │  - Voice responses (EN & HI)    │ │
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────┐
│   User Device    │
│   - Voice Output │
│   - Haptic       │
└──────────────────┘
```

## API Endpoints

### Authentication

```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
```

### Users

```
GET    /api/users/profile     - Get user profile
PUT    /api/users/profile     - Update user profile
POST   /api/users/emergency-contact    - Add emergency contact
GET    /api/users/emergency-contacts   - Get emergency contacts
```

### Vision

```
POST   /api/vision/process-frame   - Process video frame
GET    /api/vision/history         - Get detection history
```

### Emergency

```
POST   /api/emergency/alert        - Send emergency alert
GET    /api/emergency/status/:id   - Get emergency status
PUT    /api/emergency/cancel/:id   - Cancel emergency
```

### History

```
GET    /api/history           - Get detection history with filters
GET    /api/history/stats     - Get detection statistics
```

## Database Models

### User Schema

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  language: String (en/hi),
  profileImage: String,
  emergencyContacts: [
    {
      name: String,
      phone: String,
      relation: String
    }
  ],
  settings: {
    voiceSpeed: Number,
    volumeLevel: Number,
    notifications: Boolean,
    darkMode: Boolean
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Detection Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  detectionType: String (object/text/currency/traffic_signal/scene),
  data: {
    objectName: String,
    confidence: Number,
    distance: Number,
    coordinates: { x, y, width, height },
    // Other type-specific data
  },
  voiceResponse: {
    en: String,
    hi: String
  },
  frameImage: String,
  processingTime: Number,
  timestamp: Date
}
```

### Emergency Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  location: {
    type: Point,
    coordinates: [longitude, latitude]
  },
  address: String,
  notifiedContacts: [
    {
      name: String,
      phone: String,
      notifiedAt: Date,
      messageStatus: String
    }
  ],
  status: String (active/resolved/cancelled),
  message: {
    en: String,
    hi: String
  },
  createdAt: Date,
  resolvedAt: Date
}
```

## Backend API Workflow

### Vision Processing Flow

```javascript
// 1. Frontend sends frame
POST /api/vision/process-frame
{
  frameBase64: "data:image/jpeg;base64,..."
}

// 2. Backend validates and sends to AI Service
// - Decode base64
// - Validate frame format
// - Send to AI service

// 3. AI Service processes
// - Object detection
// - Text recognition
// - Generate responses

// 4. Backend saves and responds
// - Save detections to DB
// - Generate voice output
// - Return to frontend

RESPONSE 200
{
  success: true,
  detections: [...],
  voiceResponses: {
    en: "...",
    hi: "..."
  }
}
```

## Frontend Components Structure

### Pages
- `Dashboard.jsx` - Main dashboard
- `Login.jsx` - User login
- `Register.jsx` - User registration
- `VisionAssistant.jsx` - Real-time vision
- `EmergencyAlert.jsx` - Emergency features
- `History.jsx` - Detection history
- `Settings.jsx` - User settings

### Components
- `Navbar.jsx` - Navigation bar
- `LanguageSelector.jsx` - Language switcher
- `DetectionCard.jsx` - Detection display
- `EmergencyContactForm.jsx` - Contact management

## AI Service Models

### Object Detection (YOLOv8)

```python
model = YOLO('yolov8n.pt')
results = model(frame)
# Returns: boxes, confidence, class_ids
```

### Text Detection (Tesseract)

```python
text = pytesseract.image_to_string(frame)
# Returns: extracted text
```

### Traffic Signal Detection

```python
# Color-based detection in HSV space
# Identifies: Red, Green, Yellow signals
```

## Deployment Checklist

- [ ] Update environment variables
- [ ] Setup MongoDB
- [ ] Setup Redis
- [ ] Configure CORS
- [ ] Setup HTTPS
- [ ] Test all endpoints
- [ ] Load test
- [ ] Security audit
- [ ] Backup strategy
- [ ] Monitoring setup

## Performance Optimization

### Backend
- Use Redis caching for frequent queries
- Implement request rate limiting
- Use connection pooling
- Optimize database indexes

### AI Service
- Use TensorFlow Lite for mobile
- Implement frame rate limiting
- Cache model weights
- Use GPU acceleration

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Minification

## Security Best Practices

1. **Authentication**
   - Use strong passwords
   - Implement rate limiting
   - Use JWT tokens
   - Set token expiration

2. **Authorization**
   - Verify user permissions
   - Implement RBAC
   - Validate input data

3. **Data Protection**
   - Encrypt sensitive data
   - Use HTTPS only
   - Implement data validation
   - Sanitize inputs

4. **Infrastructure**
   - Setup firewall
   - Use VPN
   - Regular backups
   - Monitor logs

## Testing Strategy

### Unit Tests
- Test individual functions
- Test models
- Test utilities

### Integration Tests
- Test API endpoints
- Test database operations
- Test third-party integrations

### End-to-End Tests
- Test complete workflows
- Test user scenarios
- Test mobile app

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Write tests
5. Commit changes (`git commit -m 'Add AmazingFeature'`)
6. Push to branch (`git push origin feature/AmazingFeature`)
7. Open Pull Request

## License

MIT License
