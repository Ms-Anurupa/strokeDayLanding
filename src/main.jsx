import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted variable fonts (no Google Fonts request needed)
import '@fontsource-variable/bricolage-grotesque/standard.css'
import '@fontsource-variable/figtree'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
