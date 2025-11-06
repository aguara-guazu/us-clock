import { useState, useEffect } from 'react'
import ClockItem from './components/ClockItem'
import FloatingBubble from './components/FloatingBubble'
import { getLocalTimezone } from './utils/timezones'
import './App.css'

export const FONTS = [
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
  const [clocks, setClocks] = useState(() => {
    const saved = localStorage.getItem('clocks')
    if (saved) {
      return JSON.parse(saved)
    }
    // Default: one clock with local timezone
    return [{
      id: Date.now(),
      name: 'Local Time',
      useTimezoneName: false,
      timezone: getLocalTimezone(),
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      dateFormat: 'numeric-dmy', // 'numeric-dmy', 'numeric-mdy', 'written'
      showDay: true,
      showMonth: true,
      showYear: true,
      showDayOfWeek: false,
      showName: true,
      showClock: true,
      showDate: true,
      position: { x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 50 },
      nameSettings: {
        fontClass: 'poiret-one-regular',
        color: { r: 0, g: 0, b: 0 },
        size: 24,
        alpha: 1
      },
      clockSettings: {
        fontClass: 'major-mono-display-regular',
        color: { r: 0, g: 0, b: 0 },
        size: 120,
        alpha: 1
      },
      dateSettings: {
        fontClass: 'poiret-one-regular',
        color: { r: 0, g: 0, b: 0 },
        size: 18,
        alpha: 1
      }
    }]
  })

  const [isLocked, setIsLocked] = useState(false)
  const [selectedClockId, setSelectedClockId] = useState(null)

  useEffect(() => {
    localStorage.setItem('clocks', JSON.stringify(clocks))
  }, [clocks])

  const findFreePosition = () => {
    const margin = 50
    const clockWidth = 400
    const clockHeight = 150

    // Try to find a position that doesn't overlap with existing clocks
    for (let attempts = 0; attempts < 20; attempts++) {
      const x = Math.random() * (window.innerWidth - clockWidth - margin * 2) + margin
      const y = Math.random() * (window.innerHeight - clockHeight - margin * 2) + margin

      const overlaps = clocks.some(clock => {
        const dx = Math.abs(clock.position.x - x)
        const dy = Math.abs(clock.position.y - y)
        return dx < clockWidth && dy < clockHeight
      })

      if (!overlaps) {
        return { x, y }
      }
    }

    // Fallback: just offset from center
    return {
      x: window.innerWidth / 2 - 200 + clocks.length * 30,
      y: window.innerHeight / 2 - 50 + clocks.length * 30
    }
  }

  const addClock = () => {
    const newClock = {
      id: Date.now(),
      name: 'New Clock',
      useTimezoneName: false,
      timezone: getLocalTimezone(),
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      dateFormat: 'numeric-dmy',
      showDay: true,
      showMonth: true,
      showYear: true,
      showDayOfWeek: false,
      showName: true,
      showClock: true,
      showDate: true,
      position: findFreePosition(),
      nameSettings: {
        fontClass: 'poiret-one-regular',
        color: { r: 0, g: 0, b: 0 },
        size: 24,
        alpha: 1
      },
      clockSettings: {
        fontClass: 'major-mono-display-regular',
        color: { r: 0, g: 0, b: 0 },
        size: 80,
        alpha: 1
      },
      dateSettings: {
        fontClass: 'poiret-one-regular',
        color: { r: 0, g: 0, b: 0 },
        size: 18,
        alpha: 1
      }
    }
    setClocks(prev => [...prev, newClock])
    setSelectedClockId(newClock.id)
  }

  const removeClock = (id) => {
    setClocks(prev => prev.filter(clock => clock.id !== id))
    if (selectedClockId === id) {
      setSelectedClockId(null)
    }
  }

  const updateClock = (id, updates) => {
    setClocks(prev => prev.map(clock =>
      clock.id === id ? { ...clock, ...updates } : clock
    ))
  }

  const updateClockPosition = (id, position) => {
    setClocks(prev => prev.map(clock =>
      clock.id === id ? { ...clock, position } : clock
    ))
  }

  const handleToggleLock = () => {
    setIsLocked(!isLocked)
    // Deselect any selected clock when locking
    if (!isLocked) {
      setSelectedClockId(null)
    }
  }

  return (
    <div className="app">
      {clocks.map(clock => (
        <ClockItem
          key={clock.id}
          clock={clock}
          isSelected={selectedClockId === clock.id}
          isLocked={isLocked}
          onSelect={() => setSelectedClockId(clock.id)}
          onDeselect={() => setSelectedClockId(null)}
          onUpdatePosition={(position) => updateClockPosition(clock.id, position)}
        />
      ))}
      <FloatingBubble
        clocks={clocks}
        isLocked={isLocked}
        onToggleLock={handleToggleLock}
        onAddClock={addClock}
        onRemoveClock={removeClock}
        onUpdateClock={updateClock}
      />
    </div>
  )
}

export default App
