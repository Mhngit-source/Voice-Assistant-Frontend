import "./Auth.css";
import { useState } from "react";

export default function Signup({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: '',
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
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Account created successfully!');
        // Clear form
        setFormData({ fullName: '', email: '', password: '' });
        // Redirect to login after 2 seconds
        setTimeout(() => {
          onNavigate('login');
        }, 2000);
      } else {
        setMessage(data.message || 'Error creating account');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Signup error:', error);
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
          <button 
            className="auth-tab" 
            onClick={() => onNavigate('login')}
          >
            Login
          </button>
          <button className="auth-tab active">Sign Up</button>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              placeholder="Enter your full name" 
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
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
              minLength="6"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
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