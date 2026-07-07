# 🎯 DrishtiAI - Smart Vision Assistant for Blind Users

An AI-powered real-time vision assistance system using smart glasses and Android phone to help visually impaired users navigate safely with live voice guidance.

## 🌟 Features

- 📹 Real-time video capture from smart glasses
- 🤖 AI-powered object detection (YOLO v8)
- 📖 OCR (Text Recognition)
- 💰 Currency Detection
- 🚦 Traffic Signal Detection
- 🗣️ Text-to-Speech Output (Hindi & English)
- 🧭 Navigation Assistance via Google Maps
- 🆘 Emergency SOS Button with Location Sharing
- 🌐 Bilingual Support (English & Hindi)
- ⚡ Real-time Processing on Android Device

## 📋 Tech Stack

### Frontend
- React 18+
- TypeScript
- TailwindCSS
- Axios
- i18next (Internationalization)

### Backend
- Node.js 18+
- Express.js
- MongoDB
- JWT Authentication
- Socket.io (Real-time)

### AI/ML Service
- Python 3.9+
- TensorFlow Lite
- YOLOv8
- OpenCV
- Tesseract OCR
- NumPy & Pandas

### Mobile
- React Native
- Expo
- TensorFlow Lite React Native

## 📁 Project Structure

```
DrishtiAI/
├── frontend/                 # React Web Dashboard
├── backend/                  # Node.js Server
├── ai-service/              # Python AI Processing
├── mobile-app/              # React Native Mobile App
├── docs/                    # Documentation
└── docker-compose.yml       # Docker setup
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB
- Docker (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/nandubodra/DrishtiAI.git
cd DrishtiAI
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

3. **Setup AI Service**
```bash
cd ../ai-service
pip install -r requirements.txt
python app.py
```

4. **Setup Frontend**
```bash
cd ../frontend
npm install
npm start
```

## 📖 Documentation

See the [docs](./docs) folder for detailed documentation on:
- Architecture
- API Endpoints
- AI Models
- Deployment
- Contributing

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Contributors

- Nandu Bodra

## 🤝 Support

For issues and support, please create an issue on GitHub.
