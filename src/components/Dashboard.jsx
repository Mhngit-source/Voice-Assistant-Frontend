import "./Dashboard.css";
import { useState, useEffect } from "react";
import ChatWindow from "./Chatwindow";
import ImageGallery from "./ImageGallery";
import ChatHistory from "./ChatHistory";
import UserProfile from "./UserProfile";
import VoiceAssistant from "./VoiceAssistant";

export default function Dashboard({ onLogout }) {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('stopped');
  const [activeTab, setActiveTab] = useState('chat');
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Load user chats
          fetchUserChats(parsedUser.id);
          
          // Load user images
          fetchUserImages(parsedUser.id);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [refreshTrigger]);

  // Check MAN-I status periodically
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/man-i/man-i-status');
        const data = await response.json();
        setStatus(data.status);
        setIsRecording(data.status === 'running' || data.status === 'active');
      } catch (error) {
        console.error('Error checking MAN-I status:', error);
        setStatus('error');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch user chats
  const fetchUserChats = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chats?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setChats(data.chats || []);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // Fetch user images
  const fetchUserImages = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/images?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleVoiceButtonClick = async () => {
    if (isRecording) {
      try {
        const response = await fetch('http://localhost:5000/api/man-i/stop-man-i', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.status === 'success' || data.status === 'stopped') {
          setIsRecording(false);
          setStatus('stopped');
        }
      } catch (error) {
        console.error('Error stopping MAN-I:', error);
      }
    } else {
      try {
        const response = await fetch('http://localhost:5000/api/man-i/start-man-i', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.status === 'success' || data.status === 'started' || data.status === 'already_running') {
          setIsRecording(true);
          setStatus('running');
        }
      } catch (error) {
        console.error('Error starting MAN-I:', error);
      }
    }
  };

  const handleCreateNewChat = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/chats', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user.id 
        },
        body: JSON.stringify({
          title: 'New Chat',
          initialMessage: ''
        })
      });

      const data = await response.json();
      if (data.success) {
        setChats([data.chat, ...chats]);
        setActiveTab('chat');
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleSelectChat = (chatId) => {
    setActiveTab('chat');
    localStorage.setItem('selectedChatId', chatId);
  };

  const handleBackToHome = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };

  const refreshChats = () => {
    if (user) {
      fetchUserChats(user.id);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>MaMAI</h2>
          <p>AI Assistant</p>
        </div>

        {/* Navigation Tabs */}
        <div className="sidebar-tabs">
          <button 
            className={`sidebar-tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            💬 Chat
          </button>
          <button 
            className={`sidebar-tab ${activeTab === 'voice' ? 'active' : ''}`}
            onClick={() => setActiveTab('voice')}
          >
            🎤 Voice {isRecording && <span className="live-dot"></span>}
          </button>
          <button 
            className={`sidebar-tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            🖼️ Gallery {images.length > 0 && <span className="count-badge">{images.length}</span>}
          </button>
        </div>

        {/* Recent Chats */}
        <ChatHistory 
          chats={chats}
          onSelectChat={handleSelectChat}
          onRefresh={refreshChats}
          simplified={true}
        />

        {/* Back to Home Button - Blue */}
        <div className="back-to-home-section">
          <button 
            className="back-to-home-btn"
            onClick={handleBackToHome}
          >
            <span className="btn-icon">←</span>
            <span>Back to Home</span>
          </button>
        </div>

        {/* User Profile */}
        <UserProfile user={user} onLogout={onLogout} />
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {activeTab === 'chat' && (
          <ChatWindow 
            user={user} 
            onMessageSent={() => {
              setTimeout(() => {
                refreshChats();
                setRefreshTrigger(prev => prev + 1);
              }, 500);
            }}
          />
        )}
        
        {activeTab === 'voice' && (
          <VoiceAssistant 
            isRecording={isRecording}
            onToggleRecording={handleVoiceButtonClick}
            status={status}
          />
        )}
        
        {activeTab === 'gallery' && (
          <ImageGallery 
            images={images} 
            onRefresh={() => fetchUserImages(user?.id)}
          />
        )}
      </div>
    </div>
  );
}