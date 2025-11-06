import { useState } from 'react'
import { FONTS } from '../App'
import TimezoneSelector from './TimezoneSelector'
import ColorSettings from './ColorSettings'
import './SettingsMenu.css'

function SettingsMenu({ clocks, isLocked, onToggleLock, onAddClock, onRemoveClock, onUpdateClock }) {
  const [expandedClockId, setExpandedClockId] = useState(null)
  const [expandedMainSection, setExpandedMainSection] = useState(null) // 'name' or 'clock'
  const [expandedSubSection, setExpandedSubSection] = useState(null) // 'properties' or 'style'
  const [backgroundsExpanded, setBackgroundsExpanded] = useState(false)

  const toggleClock = (clockId) => {
    if (expandedClockId === clockId) {
      setExpandedClockId(null)
      setExpandedMainSection(null)
      setExpandedSubSection(null)
    } else {
      setExpandedClockId(clockId)
      setExpandedMainSection(null)
      setExpandedSubSection(null)
    }
  }

  const toggleMainSection = (section) => {
    if (expandedMainSection === section) {
      setExpandedMainSection(null)
      setExpandedSubSection(null)
    } else {
      setExpandedMainSection(section)
      setExpandedSubSection(null)
    }
  }

  const toggleSubSection = (section) => {
    setExpandedSubSection(expandedSubSection === section ? null : section)
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

  const handleDisplayToggle = (clockId, field, value) => {
    onUpdateClock(clockId, { [field]: value })
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
              <div className="clock-content">
                {/* Name Section */}
                <div className="main-section">
                  <div
                    className={`main-section-header ${expandedMainSection === 'name' ? 'expanded' : ''}`}
                    onClick={() => toggleMainSection('name')}
                  >
                    <span>Name</span>
                    <span className="expand-icon">{expandedMainSection === 'name' ? '▼' : '▶'}</span>
                  </div>
                  {expandedMainSection === 'name' && (
                    <div className="main-section-content">
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

                      {/* Name Style Subsection */}
                      <div className="subsection">
                        <div
                          className={`subsection-header ${expandedSubSection === 'name-style' ? 'expanded' : ''}`}
                          onClick={() => toggleSubSection('name-style')}
                        >
                          <span>Estilo</span>
                          <span className="expand-icon">{expandedSubSection === 'name-style' ? '▼' : '▶'}</span>
                        </div>
                        {expandedSubSection === 'name-style' && (
                          <div className="subsection-content">
                            <ColorSettings
                              settings={clock.nameSettings}
                              onChange={(settings) => handleNameSettingsChange(clock.id, settings)}
                              fonts={FONTS}
                              showSizeControl={true}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Clock Section */}
                <div className="main-section">
                  <div
                    className={`main-section-header ${expandedMainSection === 'clock' ? 'expanded' : ''}`}
                    onClick={() => toggleMainSection('clock')}
                  >
                    <span>Clock</span>
                    <span className="expand-icon">{expandedMainSection === 'clock' ? '▼' : '▶'}</span>
                  </div>
                  {expandedMainSection === 'clock' && (
                    <div className="main-section-content">
                      {/* Properties Subsection */}
                      <div className="subsection">
                        <div
                          className={`subsection-header ${expandedSubSection === 'clock-properties' ? 'expanded' : ''}`}
                          onClick={() => toggleSubSection('clock-properties')}
                        >
                          <span>Propiedades</span>
                          <span className="expand-icon">{expandedSubSection === 'clock-properties' ? '▼' : '▶'}</span>
                        </div>
                        {expandedSubSection === 'clock-properties' && (
                          <div className="subsection-content">
                            <div className="setting-group">
                              <label>Timezone</label>
                              <TimezoneSelector
                                value={clock.timezone}
                                onChange={(tz) => handleTimezoneChange(clock.id, tz)}
                              />
                            </div>

                            <div className="setting-group">
                              <label>Display Options</label>
                              <div className="display-options">
                                <label className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={clock.showHours !== false}
                                    onChange={(e) => handleDisplayToggle(clock.id, 'showHours', e.target.checked)}
                                  />
                                  Show hours
                                </label>
                                <label className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={clock.showMinutes !== false}
                                    onChange={(e) => handleDisplayToggle(clock.id, 'showMinutes', e.target.checked)}
                                  />
                                  Show minutes
                                </label>
                                <label className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={clock.showSeconds !== false}
                                    onChange={(e) => handleDisplayToggle(clock.id, 'showSeconds', e.target.checked)}
                                  />
                                  Show seconds
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Clock Style Subsection */}
                      <div className="subsection">
                        <div
                          className={`subsection-header ${expandedSubSection === 'clock-style' ? 'expanded' : ''}`}
                          onClick={() => toggleSubSection('clock-style')}
                        >
                          <span>Estilo</span>
                          <span className="expand-icon">{expandedSubSection === 'clock-style' ? '▼' : '▶'}</span>
                        </div>
                        {expandedSubSection === 'clock-style' && (
                          <div className="subsection-content">
                            <ColorSettings
                              settings={clock.clockSettings}
                              onChange={(settings) => handleClockSettingsChange(clock.id, settings)}
                              fonts={FONTS}
                              showSizeControl={true}
                            />
                          </div>
                        )}
                      </div>
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
