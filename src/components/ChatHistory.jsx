import React, { useState, useEffect } from 'react';
import './ChatHistory.css';

const ChatHistory = ({ chats, onSelectChat, onRefresh, simplified = true }) => {
  const [loading, setLoading] = useState(false);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Auto-refresh every 10 seconds for real-time updates
  useEffect(() => {
    if (onRefresh) {
      const interval = setInterval(() => {
        onRefresh();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [onRefresh]);

  // Also refresh when component mounts
  useEffect(() => {
    if (onRefresh) {
      onRefresh();
    }
  }, []);

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this chat?')) return;

    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const response = await fetch(`http://localhost:5000/api/chats/${chatId}`, {
          method: 'DELETE',
          headers: {
            'x-user-id': user.id
          }
        });
        
        const data = await response.json();
        if (data.success && onRefresh) {
          onRefresh();
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <div className="recent-chats">
      <h3>Recent Chats</h3>
      
      <div className="chat-list">
        {chats.length === 0 ? (
          <div className="empty-chats">
            <p>No chats yet</p>
            <small>Start a new conversation</small>
          </div>
        ) : (
          chats.slice(0, 8).map((chat, index) => (
            <div 
              key={chat.id || index}
              className="chat-item"
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="chat-item-main">
                <span className="chat-title">{chat.title || `Chat ${index + 1}`}</span>
                <span className="chat-time">{formatTime(chat.lastUpdated || chat.createdAt || new Date())}</span>
              </div>
              <div className="chat-item-preview">
                <span className="chat-preview-text">
                  {chat.lastMessage || 'No messages yet'}
                </span>
                <button 
                  className="chat-delete-btn"
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  title="Delete chat"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistory;