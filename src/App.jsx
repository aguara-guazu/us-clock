import { useState, useEffect } from 'react'
import Clock from './components/Clock'
import FloatingBubble from './components/FloatingBubble'
import './App.css'

const FONTS = [
  { name: 'Story Script', class: 'story-script-regular' },
  { name: 'Limelight', class: 'limelight-regular' },
  { name: 'Fascinate', class: 'fascinate-regular' },
  { name: 'Fascinate Inline', class: 'fascinate-inline-regular' },
  { name: 'Modak', class: 'modak-regular' },
  { name: 'Oi', class: 'oi-regular' },
  { name: 'Funnel Display', class: 'funnel-display' },
  { name: 'Funnel Sans', class: 'funnel-sans' },
  { name: 'Alumni Sans Pinstripe', class: 'alumni-sans-pinstripe-regular' },
  { name: 'Poiret One', class: 'poiret-one-regular' },
  { name: 'Fugaz One', class: 'fugaz-one-regular' },
  { name: 'Major Mono Display', class: 'major-mono-display-regular' }
]

function App() {
  const [clockSettings, setClockSettings] = useState(() => {
    const saved = localStorage.getItem('clockSettings')
    return saved ? JSON.parse(saved) : {
      fontClass: 'major-mono-display-regular',
      color: { r: 0, g: 0, b: 0 },
      size: 120,
      alpha: 1
    }
  })

  useEffect(() => {
    localStorage.setItem('clockSettings', JSON.stringify(clockSettings))
  }, [clockSettings])

  const handleSettingsChange = (newSettings) => {
    setClockSettings(prev => ({ ...prev, ...newSettings }))
  }

  return (
    <div className="app">
      <Clock settings={clockSettings} />
      <FloatingBubble
        fonts={FONTS}
        settings={clockSettings}
        onChange={handleSettingsChange}
      />
    </div>
  )
}

export default App
