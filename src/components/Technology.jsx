import "./Technology.css"

function CheckRow({ title, desc }) {
  return (
    <li className="row">
      <span className="dot" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M9.5 16.2 5.9 12.6l1.4-1.4 2.2 2.2 6.2-6.2 1.4 1.4-7.6 7.6z" />
        </svg>
      </span>
      <div>
        <div className="row-title">{title}</div>
        <div className="row-desc">{desc}</div>
      </div>
    </li>
  )
}

export default function Technology() {
  return (
    <section className="section" id="about" aria-label="About MaMAI">
      <div className="container grid grid-2 tech">
        <div className="col-left">
          <span className="kicker">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
              <circle cx="12" cy="12" r="4" fill="currentColor" />
            </svg>
            About MAN-I
          </span>
          <h2 className="title">The next generation of AI voice interaction</h2>
          <p className="lead">
            MAN-I represents a breakthrough in voice-powered AI technology, combining advanced natural language
            processing with intuitive user experience design. Our platform transforms how you interact with technology
            through seamless voice commands.
          </p>

          <ul className="rows">
            <CheckRow
              title="Advanced Speech Recognition"
              desc="Industry-leading accuracy with support for multiple languages and accents."
            />
            <CheckRow
              title="Secure & Private"
              desc="Your data is encrypted and protected with enterprise-grade security measures."
            />
            <CheckRow
              title="Cross-Platform Integration"
              desc="Works seamlessly across all your devices and favorite applications."
            />
          </ul>

          <div className="actions">
            <a className="btn btn-primary" href="#features">
              Learn More
            </a>
            {/* <a className="btn btn-outline" href="#docs">
              View Documentation
            </a> */}
          </div>
        </div>

        <div className="col-right">
          <div className="image-wrap">
            <img
              src="src\assets\webman.jpg"
              alt="Blue futuristic analytics dashboard UI"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
