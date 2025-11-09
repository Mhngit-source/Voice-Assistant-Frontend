"use client"

import { useState } from "react"
import "./Contact.css"

export default function Contact() {
  const [status, setStatus] = useState("")

  function onSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    // Simulate submit
    setStatus("Message sent! (demo)")
    console.log("[MaMAI] Contact form submission:", payload)
    e.currentTarget.reset()
    setTimeout(() => setStatus(""), 2500)
  }

  return (
    <section className="section" id="contact" aria-label="Contact Us">
      <div className="container contact grid grid-2">
        <div className="c-left">
          <span className="kicker">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <rect x="3" y="5" width="18" height="14" rx="3" fill="currentColor" opacity=".15" />
              <path d="M4 7h16v2l-8 5-8-5V7z" fill="currentColor" />
            </svg>
            Contact Us
          </span>
          <h2 className="c-title">Get in touch with our team</h2>
          <p className="c-lead">
            Have questions about MAN-I? Want to learn more about our AI voice technology? We'd love to hear from you.
          </p>

          <ul className="contact-list">
            <li>
              <span className="i i-mail" aria-hidden="true"></span>
              <div>
                <strong>Email</strong>
                <div>contactmaneye@gmail.com</div>
              </div>
            </li>
            <li>
              <span className="i i-phone" aria-hidden="true"></span>
              <div>
                <strong>Phone</strong>
                <div>6371177489</div>
              </div>
            </li>
            <li>
              <span className="i i-pin" aria-hidden="true"></span>
              <div>
                <strong>Office</strong>
                <div>Patia, BHUBANESWAR</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="c-right">
          <form className="card" onSubmit={onSubmit}>
            <div className="grid2">
              <label>
                <span>First Name</span>
                <input name="firstName" placeholder="John" required />
              </label>
              <label>
                <span>Last Name</span>
                <input name="lastName" placeholder="Doe" required />
              </label>
            </div>

            <label>
              <span>Email Address</span>
              <input type="email" name="email" placeholder="abc@example.com" required />
            </label>

            <label>
              <span>Subject</span>
              <input name="subject" placeholder="How can we help you?" />
            </label>

            <label>
              <span>Message</span>
              <textarea
                name="message"
                rows="5"
                placeholder="Tell us more about your inquiry..."
                maxLength={500}
              ></textarea>
              <small>Maximum 500 characters</small>
            </label>

            <button className="btn btn-primary" type="submit">
              Send Message
            </button>
            {status && <div className="sent">{status}</div>}
          </form>
        </div>
      </div>
    </section>
  )
}
