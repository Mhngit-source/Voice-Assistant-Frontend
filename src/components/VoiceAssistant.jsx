import React, { useState, useEffect } from 'react';
import './VoiceAssistant.css';

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [status, setStatus] = useState('inactive');

    const startListening = async () => {
        try {
            const response = await fetch('http://localhost:5000/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            const data = await response.json();
            if (data.status === 'started' || data.status === 'already_running') {
                setIsListening(true);
                setStatus('active');
            }
        } catch (error) {
            console.error('Error starting assistant:', error);
            alert('Error starting MAN-I. Make sure the backend server is running.');
        }
    };

    const stopListening = async () => {
        try {
            const response = await fetch('http://localhost:5000/stop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            const data = await response.json();
            if (data.status === 'stopped') {
                setIsListening(false);
                setStatus('inactive');
            }
        } catch (error) {
            console.error('Error stopping assistant:', error);
        }
    };

    // Check assistant status periodically
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await fetch('http://localhost:5000/status');
                const data = await response.json();
                setStatus(data.status);
                setIsListening(data.status === 'active');
            } catch (error) {
                console.error('Error checking status:', error);
                setStatus('error');
            }
        };

        const interval = setInterval(checkStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="voice-assistant-container">
            <div className="voice-assistant-card">
                <h2>MAN-I Voice Assistant</h2>
                <div className={`status-indicator ${status}`}>
                    Status: {status.toUpperCase()}
                </div>
                
                <div className="voice-controls">
                    {!isListening ? (
                        <button 
                            className="start-btn"
                            onClick={startListening}
                        >
                            🎤 Tap to Speak
                        </button>
                    ) : (
                        <button 
                            className="stop-btn"
                            onClick={stopListening}
                        >
                            ⏹️ Stop Listening
                        </button>
                    )}
                </div>
                
                <div className="instructions">
                    <h4>Available Commands:</h4>
                    <ul>
                        <li>"Play music" - Plays random music</li>
                        <li>"Current time" - Tells current time</li>
                        <li>"Open [app name]" - Opens applications</li>
                        <li>"Search Google [query]" - Searches on Google</li>
                        <li>"Wikipedia [topic]" - Searches Wikipedia</li>
                        <li>And many more...</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VoiceAssistant;