import { useCallback, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import Categories from './components/Categories'
import Journey from './components/Journey'
import KeyInfo from './components/KeyInfo'
import RegistrationSection from './components/registration/RegistrationSection'
import StrokeAwareness from './components/StrokeAwareness'
import Faq from './components/Faq'
import Footer from './components/Footer'
import MobileCta from './components/MobileCta'

/**
 * Pre-select a path from the QR code URL:
 *   ?type=participate  or  ?type=attend
 */
function getInitialMode() {
  const type = new URLSearchParams(window.location.search).get('type')
  return type === 'participate' || type === 'attend' ? type : null
}

export default function App() {
  const [mode, setMode] = useState(getInitialMode)

  const choose = useCallback((next) => {
    setMode(next)
    requestAnimationFrame(() => {
      document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main>
        <Hero onChoose={choose} />
        <Categories />
        <Journey />
        <KeyInfo />
        <RegistrationSection mode={mode} onModeChange={setMode} />
        <StrokeAwareness />
        <Faq />
      </main>
      <Footer />
      <MobileCta />
    </MotionConfig>
  )
}
