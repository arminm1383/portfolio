import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { preloadCoreFonts } from './lib/pageReady'

// Start font downloads before the first render; pages hold their content until these (and their images) are ready
preloadCoreFonts()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
