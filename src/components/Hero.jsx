import "./Hero.css"

export default function Hero({ onNavigate }) {
  return (
    <section className="hero section" id="get-started" aria-label="Hero">
      <div className="container hero-inner">
        <h1 className="hero-title">
          Your <span className="blue">Voice-Powered</span>
          <br /> AI Assistant
        </h1>
        <p className="hero-sub">
          Experience the future of AI interaction with MAN-I - your intelligent companion that understands voice
          commands, generates images, and helps you accomplish tasks effortlessly.
        </p>
        <div className="hero-cta">
          <button 
            className="btn btn-primary" 
            onClick={() => onNavigate('signup')}
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  )
}