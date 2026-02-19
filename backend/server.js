import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import chatRoutes from './routes/chats.js';
import imageRoutes from './routes/images.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/ai', aiRoutes);

// MAN-I Routes (existing)
app.post('/api/man-i/start-man-i', async (req, res) => {
    try {
        const response = await fetch('http://localhost:5001/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error starting MAN-I:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Could not connect to MAN-I server. Make sure it is running on port 5001.' 
        });
    }
});

app.post('/api/man-i/stop-man-i', async (req, res) => {
    try {
        const response = await fetch('http://localhost:5001/stop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error stopping MAN-I:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Could not connect to MAN-I server.' 
        });
    }
});

app.get('/api/man-i/man-i-status', async (req, res) => {
    try {
        const response = await fetch('http://localhost:5001/status');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error checking MAN-I status:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'MAN-I server not reachable' 
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'MAMAI Backend',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        aiServer: 'http://localhost:5001'
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mamai')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'MAMAI Backend API is running!',
    endpoints: {
      users: '/api/users',
      chats: '/api/chats',
      images: '/api/images',
      ai: '/api/ai',
      'man-i': '/api/man-i'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 MongoDB: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/mamai'}`);
  console.log(`🤖 AI Server: http://localhost:5001`);
  console.log(`🌐 API Documentation:`);
  console.log(`   GET  /api/chats - Get user chats`);
  console.log(`   POST /api/ai/chat - Chat with AI`);
  console.log(`   POST /api/ai/generate-image - Generate image`);
  console.log(`   GET  /api/images - Get user images`);
});