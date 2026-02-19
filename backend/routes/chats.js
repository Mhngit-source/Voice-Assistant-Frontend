import express from 'express';
import Chat from '../models/Chat.js';
import { authenticate } from './middleware.js';

const router = express.Router();

// Get all chats for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({ 
      userId: req.user.id,
      isArchived: false 
    })
    .sort({ lastUpdated: -1 })
    .select('title messages lastUpdated')
    .lean();

    // Format response
    const formattedChats = chats.map(chat => ({
      id: chat._id,
      title: chat.title,
      lastMessage: chat.messages.length > 0 
        ? chat.messages[chat.messages.length - 1].content.substring(0, 50) + '...'
        : 'No messages',
      lastUpdated: chat.lastUpdated,
      messageCount: chat.messages.length
    }));

    res.json({
      success: true,
      chats: formattedChats,
      count: formattedChats.length
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get specific chat with messages
router.get('/:chatId', authenticate, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.user.id
    });

    if (!chat) {
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }

    res.json({
      success: true,
      chat: {
        id: chat._id,
        title: chat.title,
        messages: chat.messages,
        createdAt: chat.createdAt,
        lastUpdated: chat.lastUpdated
      }
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create new chat
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, initialMessage } = req.body;

    const chat = new Chat({
      userId: req.user.id,
      title: title || 'New Chat',
      messages: []
    });

    if (initialMessage) {
      chat.messages.push({
        role: 'user',
        content: initialMessage,
        type: 'text'
      });
    }

    await chat.save();

    res.status(201).json({
      success: true,
      chat: {
        id: chat._id,
        title: chat.title,
        lastUpdated: chat.lastUpdated
      }
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add message to chat
router.post('/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { role, content, type = 'text', imageUrl } = req.body;

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.user.id
    });

    if (!chat) {
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }

    const message = {
      role,
      content,
      type,
      timestamp: new Date()
    };

    if (imageUrl) {
      message.imageUrl = imageUrl;
    }

    chat.messages.push(message);
    await chat.save();

    res.json({
      success: true,
      message: {
        ...message,
        id: chat.messages[chat.messages.length - 1]._id
      },
      chatId: chat._id
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete chat
router.delete('/:chatId', authenticate, async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.chatId,
      userId: req.user.id
    });

    if (!chat) {
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }

    res.json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Archive chat
router.post('/:chatId/archive', authenticate, async (req, res) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.chatId,
        userId: req.user.id
      },
      { isArchived: true },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }

    res.json({
      success: true,
      message: 'Chat archived'
    });
  } catch (error) {
    console.error('Archive chat error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;