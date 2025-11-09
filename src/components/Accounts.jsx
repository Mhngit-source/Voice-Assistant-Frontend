import "./Accounts.css"

function Bullet({ children }) {
  return (
    <li className="acc-row">
      <span className="acc-dot" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="m9 16.2-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z" />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  )
}

export default function Accounts() {
  return (
    <section className="section">
      <div className="container acc">
        <div className="acc-wrap">
          <div className="acc-left">
            <h3 className="acc-title">Multi-Account Support & Persistent Data</h3>
            <ul className="acc-list">
              <Bullet>
                <strong>Multiple Account Management</strong> — Switch between different accounts seamlessly in the same
                session.
              </Bullet>
              <Bullet>
                <strong>Persistent Chat History</strong> — All your conversations are saved and accessible across
                devices.
              </Bullet>
              <Bullet>
                <strong>Cloud Synchronization</strong> — Your data syncs automatically across all your devices.
              </Bullet>
            </ul>
          </div>
          <div className="acc-right">
            <div className="acc-image">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-10-07%20203043-OmH8jD82Nz7fUjmWhR3cJrGfUDK8BO.png"
                alt="AI dashboard preview in blue tones"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
