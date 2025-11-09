// Home.jsx
import Hero from "./components/Hero.jsx"
import Technology from "./components/Technology.jsx"
import Features from "./components/Features.jsx"
import Accounts from "./components/Accounts.jsx"
import Contact from "./components/Contact.jsx"
import Footer from "./components/Footer.jsx"

export default function Home({ onNavigate }) {
  return (
    <>
      <main>
        <Hero onNavigate={onNavigate} />
        <Technology />
        <Features />
        <Accounts />
        <Contact />
      </main>
      <Footer />
    </>
  )
}