import "./Auth.css";
import { useState } from "react";

export default function Login({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Login successful!');
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        // Call the onLogin prop to handle navigation to dashboard
        setTimeout(() => {
          if (onLogin) {
            onLogin();
          }
        }, 1000);
      } else {
        setMessage(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">MAN_I</h1>
          <p className="auth-subtitle">Your Voice-Powered AI Assistant</p>
        </div>
        
        <div className="auth-tabs">
          <button className="auth-tab active">Login</button>
          <button 
            className="auth-tab" 
            onClick={() => onNavigate('signup')}
          >
            Sign Up
          </button>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {message && (
            <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className="auth-divider">
            <span>Or continue with</span>
          </div>
          
          <div className="social-buttons">
            <button type="button" className="social-button google">
              Google
            </button>
            <button type="button" className="social-button facebook">
              Facebook
            </button>
          </div>
          
          <a 
            href="#" 
            className="back-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
          >
            ← Back to Home
          </a>
        </form>
      </div>
    </div>
  );
}