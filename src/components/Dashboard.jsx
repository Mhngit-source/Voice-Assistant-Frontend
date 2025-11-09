import "./Dashboard.css";
import { useState, useEffect } from "react";

export default function Dashboard({ onLogout }) {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('stopped');

  const handleBackToHome = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Check MAN-I status periodically
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/man-i/man-i-status');
        const data = await response.json();
        setStatus(data.status);
        setIsRecording(data.status === 'running');
      } catch (error) {
        console.error('Error checking MAN-I status:', error);
        setStatus('error');
      }
    };

    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleVoiceButtonClick = async () => {
    if (isRecording) {
      // Stop MAN-I
      try {
        const response = await fetch('http://localhost:5000/api/man-i/stop-man-i', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.status === 'success') {
          setIsRecording(false);
          setStatus('stopped');
        } else {
          alert('Error stopping MAN-I: ' + data.message);
        }
      } catch (error) {
        console.error('Error stopping MAN-I:', error);
        alert('Error stopping MAN-I. Check if the server is running.');
      }
    } else {
      // Start MAN-I
      try {
        const response = await fetch('http://localhost:5000/api/man-i/start-man-i', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.status === 'success') {
          setIsRecording(true);
          setStatus('running');
        } else {
          alert('Error starting MAN-I: ' + data.message);
        }
      } catch (error) {
        console.error('Error starting MAN-I:', error);
        alert('Error starting MAN-I. Make sure the MAN-I server is running on port 5001.');
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>MaMAI</h2>
          <p>AI Assistant</p>
        </div>

        <div className="generated-images">
          <h3>Generated Images</h3>
          <button className="view-all-btn">View All</button>
        </div>

        <div className="new-chat-section">
          <button className="new-chat-btn">+ New Chat</button>
        </div>

        <div className="recent-chats">
          <h3>Recent Chats</h3>
          <div className="chat-item">
            <span>Weather and Music Help</span>
            <small>30m ago</small>
          </div>
          <div className="chat-item">
            <span>Image Generation Request</span>
            <small>2h ago</small>
          </div>
          <div className="chat-item">
            <span>Email Management Tips</span>
            <small>1d ago</small>
          </div>
          <div className="chat-item">
            <span>Voice Commands Setup</span>
            <small>2d ago</small>
          </div>
          {/* Additional chat history */}
          <div className="chat-item">
            <span>Calendar Schedule</span>
            <small>3d ago</small>
          </div>
          <div className="chat-item">
            <span>Recipe Suggestions</span>
            <small>4d ago</small>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="back-to-home-section">
          <button 
            className="back-to-home-btn"
            onClick={handleBackToHome}
          >
            ← Back to Home
          </button>
        </div>

        <div className="user-status">
          <div className="user-info">
            <div className="user-avatar">U</div>
            <div>
              <strong>google User</strong>
              <small>Online</small>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat">
        <div className="chat-center">
          <div className="voice-control-container">
            <button 
              className={`voice-control-button ${isRecording ? 'recording' : ''}`}
              onClick={handleVoiceButtonClick}
            >
              <div className="voice-icon">
                {isRecording ? (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 6h12v12H6z"/>
                  </svg>
                ) : (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"></path>
                    <path d="M5 11a1 1 0 1 0-2 0 9 9 0 0 0 8 8v3h2v-3a9 9 0 0 0 8-8 1 1 0 1 0-2 0 7 7 0 0 1-14 0Z"></path>
                  </svg>
                )}
              </div>
              <span className="button-text">
                {isRecording ? 'Undo' : 'Tap to Speak'}
              </span>
            </button>
          </div>
          
          <div className="center-message">
            <p>
              {isRecording 
                ? 'MAN-I is listening... Click "Undo" to stop' 
                : 'Click the button to start speaking with MAN-I'
              }
            </p>
            <small style={{color: '#64748b', marginTop: '10px', display: 'block'}}>
              Status: {status.toUpperCase()}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}