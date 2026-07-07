# Installation & Setup Guide

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/nandubodra/DrishtiAI.git
cd DrishtiAI

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# AI Service: http://localhost:5001
```

### Option 2: Manual Setup

#### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# nano .env

# Start MongoDB
mongod

# Start Redis
redis-server

# Run backend server
npm run dev
```

#### 2. AI Service Setup

```bash
cd ../ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run AI service
python app.py
```

#### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Start development server
npm start

# Open http://localhost:3000
```

#### 4. Mobile App Setup

```bash
cd ../mobile-app
npm install

# Start Expo
expo start

# Scan QR code with Expo Go app on your phone
```

## 📋 System Requirements

### Minimum Requirements
- Node.js 16+ or 18+
- Python 3.8+
- MongoDB 4.4+
- 4GB RAM
- 2GB storage

### Recommended
- Node.js 18+
- Python 3.10+
- MongoDB 5+
- 8GB RAM
- 4GB storage
- GPU (NVIDIA CUDA for faster AI processing)

## 🔧 Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://admin:password@localhost:27017/drishti?authSource=admin
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# AI Service
AI_SERVICE_URL=http://localhost:5001

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### AI Service (.env)

```env
FLASK_ENV=development
FLASK_APP=app.py
PORT=5001
CONFIDENCE_THRESHOLD=0.5
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AI_URL=http://localhost:5001
```

## 🌐 Language Configuration

The application supports English and Hindi. Language preference is stored in:

1. **Local Storage**: Browser stores user language preference
2. **User Profile**: Backend saves default language
3. **i18next**: Handles all translations

To add more languages:

1. Edit `frontend/src/i18n/translations.json`
2. Add language codes and translations
3. Update language dropdown in Navbar

## 🔐 Security Setup

### 1. Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Setup HTTPS

```bash
# Generate self-signed certificate (development)
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
```

### 3. Configure CORS

Edit `backend/src/index.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## 📱 Mobile App Deployment

### Android

```bash
cd mobile-app
expo build:android
# Follow prompts to build APK
```

### iOS

```bash
cd mobile-app
expo build:ios
# Requires Apple developer account
```

## 🚀 Production Deployment

### Backend (Node.js)

1. **Deploy to Heroku**
```bash
heroku login
heroku create drishti-backend
git push heroku main
```

2. **Deploy to AWS**
- Use AWS Elastic Beanstalk
- Or EC2 with PM2

3. **Deploy to DigitalOcean**
- Use App Platform or Droplet
- Configure nginx as reverse proxy

### Frontend (React)

1. **Build for production**
```bash
cd frontend
npm run build
```

2. **Deploy to Vercel**
```bash
npm install -g vercel
vercel
```

3. **Deploy to Netlify**
```bash
npm run build
# Drag and drop build folder to Netlify
```

### AI Service (Python)

1. **Deploy to AWS Lambda**
2. **Deploy to Google Cloud Run**
3. **Deploy to Heroku**

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### AI Service Tests

```bash
cd ai-service
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🐛 Troubleshooting

### MongoDB Connection Error

```bash
# Check if MongoDB is running
mongo --version

# Start MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### Port Already in Use

```bash
# Find and kill process on port
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:5001 | xargs kill -9  # AI Service
lsof -ti:3000 | xargs kill -9  # Frontend
```

### AI Service Import Errors

```bash
cd ai-service
pip install --upgrade torch torchvision
pip install --upgrade ultralytics
```

### Frontend CORS Issues

```javascript
// In backend/src/index.js
app.use(cors({
  origin: '*',  // Only for development
  credentials: true
}));
```

## 📊 Monitoring

### Backend Logs

```bash
# Using PM2
pm2 logs backend
```

### AI Service Logs

```bash
# Check Flask output
# Or configure logging to file
```

### Database Monitoring

```bash
# MongoDB Shell
mongo
use drishti
db.users.find()
db.detections.find()
```

## 🔄 Updating

```bash
# Pull latest changes
git pull origin main

# Update dependencies
cd backend && npm install
cd ../ai-service && pip install -r requirements.txt --upgrade
cd ../frontend && npm install

# Restart services
docker-compose down
docker-compose up -d
```

## 📞 Support

For issues:
1. Check GitHub Issues
2. Read Documentation
3. Create new issue with details
4. Provide error logs and steps to reproduce

## 📝 License

MIT License - See LICENSE file
