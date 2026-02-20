import express from 'express';
import axios from 'axios';

const router = express.Router();

const FLASK_SERVER_URL = 'http://localhost:5001';

// Health check
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_SERVER_URL}/health`, { timeout: 5000 });
    res.json({
      success: true,
      node_backend: 'healthy',
      flask_server: 'connected',
      gemini_model: response.data.gemini_model,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      node_backend: 'healthy',
      flask_server: 'disconnected',
      error: error.message
    });
  }
});

// Text chat with AI
router.post('/chat', async (req, res) => {
  try {
    const { message, userId, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'No message provided' 
      });
    }

    console.log(`📤 Sending to Flask: "${message.substring(0, 50)}..."`);

    const response = await axios.post(`${FLASK_SERVER_URL}/api/chat/text`, {
      message,
      userId: userId || 'anonymous',
      sessionId: sessionId || userId || `session_${Date.now()}`
    }, { timeout: 20000 });

    console.log(`📥 Received response (${response.data.response?.length || 0} chars)`);
    
    res.json({
      success: true,
      response: response.data.response || "I'm here to help!",
      citations: [],
      source: 'gemini',
      sessionId: response.data.sessionId,
      timestamp: response.data.timestamp || new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ AI chat error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      res.json({ 
        success: true,
        response: "⚠️ **Service Unavailable**\n\nThe AI service is temporarily unavailable. Please try again later.",
        source: 'error'
      });
    } else {
      res.json({ 
        success: true,
        response: "I'm having trouble connecting. Please try again.",
        source: 'error'
      });
    }
  }
});

// Generate image – NO DATABASE SAVE
router.post('/generate-image', async (req, res) => {
  try {
    const { prompt, userId } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        error: 'No prompt provided' 
      });
    }

    console.log(`🎨 Generating image: "${prompt.substring(0, 50)}..."`);

    const response = await axios.post(`${FLASK_SERVER_URL}/api/generate-image`, {
      prompt,
      userId: userId || 'anonymous'
    }, { timeout: 60000 });

    // Images are NOT saved to database – session-only on frontend
    res.json(response.data);
    
  } catch (error) {
    console.error('❌ Image generation error:', error.message);
    res.json({ 
      success: false, 
      error: 'Failed to generate image'
    });
  }
});

// Get user images – returns empty (session-only)
router.get('/user-images/:userId', async (req, res) => {
  res.json({ success: true, images: [], count: 0 });
});

// Delete image – dummy endpoint
router.delete('/delete-image/:imageId', async (req, res) => {
  res.json({ success: true, message: 'Image deleted (simulated)' });
});

// Get chat history
router.get('/chat-history/:sessionId', async (req, res) => {
  try {
    const response = await axios.get(
      `${FLASK_SERVER_URL}/api/get-chat-history/${req.params.sessionId}`,
      { timeout: 5000 }
    );
    res.json(response.data);
  } catch (error) {
    res.json({ success: true, history: [], count: 0 });
  }
});

// Clear chat
router.post('/clear-chat/:sessionId', async (req, res) => {
  try {
    const response = await axios.post(
      `${FLASK_SERVER_URL}/api/clear-chat/${req.params.sessionId}`
    );
    res.json(response.data);
  } catch (error) {
    res.json({ success: true, message: 'Chat cleared locally' });
  }
});

export default router;