const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected');
}).catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/vision', require('./routes/vision.routes'));
app.use('/api/emergency', require('./routes/emergency.routes'));
app.use('/api/history', require('./routes/history.routes'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'DrishtiAI Backend is running' });
});

// Real-time WebSocket Events
io.on('connection', (socket) => {
  console.log('📱 User connected:', socket.id);

  socket.on('video_frame', (data) => {
    io.emit('process_frame', data);
  });

  socket.on('emergency_alert', (data) => {
    io.emit('emergency_broadcast', data);
  });

  socket.on('disconnect', () => {
    console.log('📱 User disconnected:', socket.id);
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 DrishtiAI Backend running on http://localhost:${PORT}`);
});
