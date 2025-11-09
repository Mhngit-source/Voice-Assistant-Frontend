import { useState, useEffect } from "react"
import "./App.css"
import Home from "./Home.jsx"
import Header from "./components/Header.jsx"
import Login from "./components/Login.jsx"
import Signup from "./components/Signup.jsx"
import Dashboard from "./components/Dashboard.jsx"

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check login status and URL when component mounts
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
    
    const path = window.location.pathname;
    if (path === '/login') setCurrentPage('login');
    else if (path === '/signup') setCurrentPage('signup');
    else if (path === '/dashboard') setCurrentPage('dashboard');
    else setCurrentPage('home');
  }, []);

  // Function to handle navigation
  const navigateTo = (page) => {
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page === 'home' ? '' : page}`);
  };

  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
    navigateTo('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    navigateTo('home');
  };

  // Render the current page
  const renderPage = () => {
    if (isLoggedIn && currentPage === 'dashboard') {
      return <Dashboard onLogout={handleLogout} />;
    }
    
    switch(currentPage) {
      case 'login':
        return <Login onNavigate={navigateTo} onLogin={handleLogin} />
      case 'signup':
        return <Signup onNavigate={navigateTo} />
      default:
        return <Home onNavigate={navigateTo} />
    }
  }

  return (
  <div className="App">
    {/* Show header on home page AND when not logged in AND not on auth pages */}
    {(currentPage === 'home' || (!isLoggedIn && currentPage !== 'login' && currentPage !== 'signup' && currentPage !== 'dashboard')) && 
      <Header onNavigate={navigateTo} currentPage={currentPage} />
    }
    {renderPage()}
  </div>
  )
}