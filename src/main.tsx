import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { ThemeProvider } from './theme/ThemeContext'
import { SimulatorProvider } from './simulation/SimulatorContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <SimulatorProvider>
        <App />
      </SimulatorProvider>
    </ThemeProvider>
  </React.StrictMode>
)
