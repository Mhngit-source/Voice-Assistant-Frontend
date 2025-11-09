import "./Footer.css"

function Social({ href, children, label }) {
  return (
    <a className="s" href={href} aria-label={label} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="footer" aria-label="Site Footer">
      <div className="container">
        <div className="top">
          <div className="brand-col">
            <div className="brand">
              <span className="brand-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"></path>
                  <path d="M5 11a1 1 0 1 0-2 0 9 9 0 0 0 8 8v3h2v-3a9 9 0 0 0 8-8 1 1 0 1 0-2 0 7 7 0 0 1-14 0Z"></path>
                </svg>
              </span>
              <span className="brand-text">MAN-I</span>
            </div>
            <p className="desc">
              Your intelligent voice companion for everyday tasks. Experience the future of voice interaction with
              advanced AI technology .
            </p>
            <div className="socials">
              <Social href="#" label="Twitter">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.2 1.7-2.1-.7.4-1.6.8-2.4.9A3.8 3.8 0 0 0 12 7.8c0 .3 0 .6.1.8-3.1-.2-5.9-1.7-7.8-4.1-.3.6-.5 1.2-.5 1.9 0 1.3.7 2.5 1.7 3.2-.6 0-1.2-.2-1.7-.5 0 1.9 1.3 3.5 3.1 3.8-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.6 2 2.8 3.7 2.9A7.6 7.6 0 0 1 2 18a10.7 10.7 0 0 0 5.8 1.7c7 0 10.9-6 10.9-11.2v-.5c.8-.6 1.4-1.2 1.9-2Z"
                  />
                </svg>
              </Social>
              <Social href="#" label="Facebook">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M13 22v-8h3l.5-4H13V7.5c0-.9.3-1.5 1.6-1.5H17V2.2c-.8-.1-1.7-.2-2.5-.2C11.8 2 10 3.5 10 6.3V10H7v4h3v8h3Z"
                  />
                </svg>
              </Social>
              <Social href="#" label="LinkedIn">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M6.94 6.5A1.94 1.94 0 1 1 5 4.56a1.94 1.94 0 0 1 1.94 1.94ZM4.75 20.25h4.38V9.56H4.75v10.69ZM14.44 9.44c-2.09 0-3.16 1.15-3.69 2h-.06V9.56H6.31v10.69h4.38v-5.66c0-1.5.28-2.94 2.14-2.94 1.83 0 1.86 1.7 1.86 3.03v5.56h4.38v-6c0-2.87-.61-5.5-4.63-5.5Z"
                  />
                </svg>
              </Social>
              <Social href="#" label="GitHub">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.9 11c.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.6-1.6-1.5-2-1.5-2-1.2-.8 0-.8 0-.8 1.3.1 2 .1 3 .2 0-.8.4-1.4.8-1.8-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0C16 .5 17 1 17 1c.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.5-2.7 5.4-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5Z"
                  />
                </svg>
              </Social>
            </div>
          </div>

          <div className="links">
            <div className="col">
              <div className="col-title">Product</div>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#api">API</a>
              <a href="#docs">Documentation</a>
            </div>
            <div className="col">
              <div className="col-title">Support</div>
              <a href="#help">Help Center</a>
              <a href="#contact">Contact Us</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>

        <hr />

        <div className="bottom">
          <div>© 2025 MAN-I. All rights reserved.</div>
          <div className="powered">Powered by J Mohan.K</div>
        </div>
      </div>
    </footer>
  )
}
