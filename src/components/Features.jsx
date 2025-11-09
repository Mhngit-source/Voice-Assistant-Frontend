import "./Features.css"

const items = [
  {
    title: "Voice Commands",
    desc: "Natural voice interaction with advanced speech recognition and real-time processing.",
    icon: "mic",
  },
  {
    title: "Image Generation",
    desc: "Create stunning images from text descriptions using advanced AI models.",
    icon: "image",
  },
  {
    title: "Smart Tasks",
    desc: "Automate your daily tasks with intelligent task management and execution.",
    icon: "check",
  },
  {
    title: "Email Management",
    desc: "Send, organize, and manage your emails with voice commands and AI assistance.",
    icon: "mail",
  },
  {
    title: "Music Control",
    desc: "Control your music playback, discover new songs, and create playlists.",
    icon: "music",
  },
  {
    title: "System Control",
    desc: "Manage system settings, applications, and device controls with voice.",
    icon: "settings",
  },
]

function Icon({ name }) {
  switch (name) {
    case "mic":
      return (
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z" />
          <path
            fill="currentColor"
            d="M5 11a1 1 0 1 0-2 0 9 9 0 0 0 8 8v3h2v-3a9 9 0 0 0 8-8 1 1 0 1 0-2 0 7 7 0 0 1-14 0Z"
          />
        </svg>
      )
    case "image":
      return (
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14ZM8 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-1 9 3-4 2 3 3-4 4 5H7Z"
          />
        </svg>
      )
    case "check":
      return (
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="m9 16.2-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z" />
        </svg>
      )
    case "mail":
      return (
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M4 6h16a2 2 0 0 1 2 2v.5l-10 6.25L2 8.5V8a2 2 0 0 1 2-2Zm16 12H4a2 2 0 0 1-2-2V9.6l10 6.2 10-6.2V16a2 2 0 0 1-2 2Z"
          />
        </svg>
      )
    case "music":
      return (
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M19 3v12.35a3.5 3.5 0 1 1-2-3.15V7h-6v8.35a3.5 3.5 0 1 1-2-3.15V5h10Z" />
        </svg>
      )
    case "settings":
      return (
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9.4 4a7.7 7.7 0 0 0-.13-1.46l2.02-1.58-2-3.46-2.44.98a7.88 7.88 0 0 0-2.54-1.46L13.6 1h-3.2l-.71 2.98a7.88 7.88 0 0 0-2.54 1.46l-2.44-.98-2 3.46 2.02 1.58A7.7 7.7 0 0 0 2.6 12c0 .5.05.98.13 1.46L.71 15.04l2 3.46 2.44-.98c.76.63 1.62 1.14 2.54 1.46L10.4 23h3.2l.71-2.98c.92-.32 1.78-.83 2.54-1.46l2.44.98 2-3.46-2.02-1.58c.08-.48.13-.96.13-1.46Z"
          />
        </svg>
      )
    default:
      return null
  }
}

export default function Features() {
  return (
    <section className="section" id="features" aria-label="Features">
      <div className="container">
        <h2 className="features-title">Powerful Features for Modern AI Interaction</h2>
        <p className="features-sub">
          MAN-I combines cutting-edge AI technology with intuitive voice interaction to provide you with an unparalleled
          digital assistant experience.
        </p>

        <div className="cards">
          {items.map((it) => (
            <div key={it.title} className="card">
              <div className="icon">
                <Icon name={it.icon} />
              </div>
              <div className="card-title">{it.title}</div>
              <div className="card-desc">{it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
