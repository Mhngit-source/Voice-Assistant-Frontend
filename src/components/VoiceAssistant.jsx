import React from 'react';
import './VoiceAssistant.css';

const VoiceAssistant = ({ isRecording, onToggleRecording, status }) => {
  const commands = [
    { icon: '🎵', command: '"Play music"', description: 'Plays random music' },
    { icon: '⏰', command: '"Current time"', description: 'Tells current time' },
    { icon: '📂', command: '"Open [app name]"', description: 'Opens applications' },
    { icon: '🔍', command: '"Search Google [query]"', description: 'Searches on Google' },
    { icon: '🎨', command: '"Generate image of [description]"', description: 'Creates AI image' },
    { icon: '💭', command: '"Ask AI [question]"', description: 'Chat with AI' }
  ];

  // Split commands into two columns
  const leftColumn = commands.slice(0, 3);
  const rightColumn = commands.slice(3, 6);

  return (
    <div className="voice-control-tab">
      {/* Centered Circle */}
      <div className="voice-control-container">
        <button 
          className={`voice-control-button ${isRecording ? 'recording' : ''}`}
          onClick={onToggleRecording}
        >
          <div className="voice-icon">
            {isRecording ? (
              <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="1"/>
              </svg>
            ) : (
              <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            )}
          </div>
          <span className="button-text">
            {isRecording ? 'Stop Listening' : 'Tap to Speak'}
          </span>
        </button>
      </div>
      
      <div className="center-message">
        <p>
          {isRecording 
            ? 'MAN-I is listening... Speak your command' 
            : 'Click the button to start speaking with MAN-I'
          }
        </p>
        <small className={`status-text ${status}`}>
          Status: {status.toUpperCase()}
        </small>
      </div>

      {/* Voice Commands - Two Column Grid with Different Icons */}
      <div className="voice-commands-container">
        <h4>Available Voice Commands</h4>
        <div className="voice-commands-grid">
          <div className="command-column">
            {leftColumn.map((cmd, index) => (
              <div key={index} className="command-item">
                <span className="command-icon">{cmd.icon}</span>
                <div className="command-details">
                  <span className="command-phrase">{cmd.command}</span>
                  <span className="command-desc">{cmd.description}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="command-column">
            {rightColumn.map((cmd, index) => (
              <div key={index} className="command-item">
                <span className="command-icon">{cmd.icon}</span>
                <div className="command-details">
                  <span className="command-phrase">{cmd.command}</span>
                  <span className="command-desc">{cmd.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;