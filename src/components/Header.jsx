import "./Header.css"

export default function Header({ onNavigate, currentPage }) {
  // Don't show header on login/signup pages or when logged in
  if (currentPage === 'login' || currentPage === 'signup') {
    return null;
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <a 
          className="brand" 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
        >
          <span className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"></path>
              <path d="M5 11a1 1 0 1 0-2 0 9 9 0 0 0 8 8v3h2v-3a9 9 0 0 0 8-8 1 1 0 1 0-2 0 7 7 0 0 1-14 0Z"></path>
            </svg>
          </span>
          <span className="brand-text">MAN-I</span>
        </a>

        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="actions">
          <a 
            className="login" 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('login');
            }}
          >
            Login
          </a>
          <a 
            className="get-started" 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('signup');
            }}
          >
            Sign Up
          </a>
        </div>
      </div>
    </header>
  )
}