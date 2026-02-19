import React, { useState, useRef, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="user-status">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div>
            <strong>Guest User</strong>
            <small>Not logged in</small>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const getUserInitials = () => {
    if (!user.fullName && !user.name) return 'U';
    const name = user.fullName || user.name;
    return name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // SIMPLIFIED MENU - Only what you requested
  const menuItems = [
    { icon: '👤', label: 'Profile', action: () => console.log('Profile') },
    { icon: '⚙️', label: 'Settings', action: () => console.log('Settings') },
    { icon: '💬', label: 'Feedback', action: () => console.log('Feedback') },
    { icon: '🚪', label: 'Sign Out', action: handleLogout, danger: true }
  ];

  return (
    <div className="user-status" ref={dropdownRef}>
      <div 
        className={`user-info clickable ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="user-avatar">
          {getUserInitials()}
        </div>
        <div className="user-details">
          <strong>{user.fullName || user.name || 'User'}</strong>
          <small>{user.email}</small>
        </div>
        <span className={`menu-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <div className="dropdown-user">
              <div className="dropdown-avatar">{getUserInitials()}</div>
              <div className="dropdown-user-info">
                <span className="dropdown-user-name">{user.fullName || user.name}</span>
                <span className="dropdown-user-email">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="dropdown-content">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                className={`dropdown-item ${item.danger ? 'danger' : ''}`}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
              >
                <span className="item-icon">{item.icon}</span>
                <span className="item-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;