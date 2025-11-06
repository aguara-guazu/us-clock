import { useState } from 'react'
import { FONTS } from '../App'
import TimezoneSelector from './TimezoneSelector'
import ColorSettings from './ColorSettings'
import './SettingsMenu.css'

function SettingsMenu({ clocks, isLocked, onToggleLock, onAddClock, onRemoveClock, onUpdateClock }) {
  const [expandedClockId, setExpandedClockId] = useState(null)
  const [expandedSection, setExpandedSection] = useState(null) // 'name' or 'clock'
  const [backgroundsExpanded, setBackgroundsExpanded] = useState(false)

  const toggleClock = (clockId) => {
    if (expandedClockId === clockId) {
      setExpandedClockId(null)
      setExpandedSection(null)
    } else {
      setExpandedClockId(clockId)
      setExpandedSection(null)
    }
  }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleNameChange = (clockId, name) => {
    onUpdateClock(clockId, { name })
  }

  const handleTimezoneChange = (clockId, timezone) => {
    onUpdateClock(clockId, { timezone })
  }

  const handleUseTimezoneNameChange = (clockId, value) => {
    onUpdateClock(clockId, { useTimezoneName: value })
  }

  const handleNameSettingsChange = (clockId, settings) => {
    const clock = clocks.find(c => c.id === clockId)
    onUpdateClock(clockId, {
      nameSettings: { ...clock.nameSettings, ...settings }
    })
  }

  const handleClockSettingsChange = (clockId, settings) => {
    const clock = clocks.find(c => c.id === clockId)
    onUpdateClock(clockId, {
      clockSettings: { ...clock.clockSettings, ...settings }
    })
  }

  return (
    <div className="settings-menu">
      {/* Lock Toggle */}
      <div className="settings-header">
        <button
          className={`lock-button ${isLocked ? 'locked' : ''}`}
          onClick={onToggleLock}
          title={isLocked ? 'Unlock all clocks' : 'Lock all clocks'}
        >
          {isLocked ? '🔒' : '🔓'} {isLocked ? 'Locked' : 'Unlocked'}
        </button>
      </div>

      {/* Clocks List */}
      <div className="clocks-list">
        {clocks.map(clock => (
          <div key={clock.id} className="clock-entry">
            <div
              className={`clock-header ${expandedClockId === clock.id ? 'expanded' : ''}`}
              onClick={() => toggleClock(clock.id)}
            >
              <span className="clock-icon">🕔</span>
              <span className="clock-title">{clock.name}</span>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (clocks.length > 1) {
                    onRemoveClock(clock.id)
                  }
                }}
                disabled={clocks.length === 1}
                title="Delete clock"
              >
                🗑️
              </button>
              <span className="expand-icon">{expandedClockId === clock.id ? '▼' : '▶'}</span>
            </div>

            {expandedClockId === clock.id && (
              <div className="clock-submenus">
                {/* Name Submenu */}
                <div className="submenu">
                  <div
                    className={`submenu-header ${expandedSection === 'name' ? 'expanded' : ''}`}
                    onClick={() => toggleSection('name')}
                  >
                    <span>Name</span>
                    <span className="expand-icon">{expandedSection === 'name' ? '▼' : '▶'}</span>
                  </div>
                  {expandedSection === 'name' && (
                    <div className="submenu-content">
                      <div className="setting-group">
                        <label>Display Name</label>
                        <input
                          type="text"
                          value={clock.name}
                          onChange={(e) => handleNameChange(clock.id, e.target.value)}
                        />
                      </div>

                      <div className="setting-group checkbox-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={clock.useTimezoneName}
                            onChange={(e) => handleUseTimezoneNameChange(clock.id, e.target.checked)}
                          />
                          Use timezone name
                        </label>
                      </div>

                      <div className="setting-group">
                        <label>Timezone</label>
                        <TimezoneSelector
                          value={clock.timezone}
                          onChange={(tz) => handleTimezoneChange(clock.id, tz)}
                        />
                      </div>

                      <ColorSettings
                        settings={clock.nameSettings}
                        onChange={(settings) => handleNameSettingsChange(clock.id, settings)}
                        fonts={FONTS}
                      />
                    </div>
                  )}
                </div>

                {/* Clock Submenu */}
                <div className="submenu">
                  <div
                    className={`submenu-header ${expandedSection === 'clock' ? 'expanded' : ''}`}
                    onClick={() => toggleSection('clock')}
                  >
                    <span>Clock</span>
                    <span className="expand-icon">{expandedSection === 'clock' ? '▼' : '▶'}</span>
                  </div>
                  {expandedSection === 'clock' && (
                    <div className="submenu-content">
                      <ColorSettings
                        settings={clock.clockSettings}
                        onChange={(settings) => handleClockSettingsChange(clock.id, settings)}
                        fonts={FONTS}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Clock Button */}
      <button className="add-clock-button" onClick={onAddClock}>
        ➕ Add Clock
      </button>

      {/* Backgrounds Section */}
      <div className="backgrounds-section">
        <div
          className={`section-header ${backgroundsExpanded ? 'expanded' : ''}`}
          onClick={() => setBackgroundsExpanded(!backgroundsExpanded)}
        >
          <span className="section-icon">🖥️</span>
          <span>Backgrounds</span>
          <span className="expand-icon">{backgroundsExpanded ? '▼' : '▶'}</span>
        </div>
        {backgroundsExpanded && (
          <div className="section-content">
            <p className="placeholder-text">Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsMenu
