import { useState } from 'react'
import { FONTS } from '../App'
import { TIMEZONES } from '../utils/timezones'
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

  const handleDateSettingsChange = (clockId, settings) => {
    const clock = clocks.find(c => c.id === clockId)
    onUpdateClock(clockId, {
      dateSettings: { ...clock.dateSettings, ...settings }
    })
  }

  const handleDateFormatChange = (clockId, format) => {
    onUpdateClock(clockId, { dateFormat: format })
  }

  const getDisplayName = (clock) => {
    if (clock.useTimezoneName) {
      const tzInfo = TIMEZONES.find(tz => tz.tz === clock.timezone)
      return tzInfo ? tzInfo.city : clock.name
    }
    return clock.name
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
              <span className="clock-title">{getDisplayName(clock)}</span>
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
                  >
                    <span onClick={() => toggleMainSection('name')} style={{ flex: 1, cursor: 'pointer' }}>Name</span>
                    <button
                      className="visibility-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDisplayToggle(clock.id, 'showName', !(clock.showName !== false))
                      }}
                      title={clock.showName !== false ? 'Hide name' : 'Show name'}
                    >
                      {clock.showName !== false ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <span className="expand-icon" onClick={() => toggleMainSection('name')} style={{ cursor: 'pointer' }}>
                      {expandedMainSection === 'name' ? '▼' : '▶'}
                    </span>
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
                  >
                    <span onClick={() => toggleMainSection('clock')} style={{ flex: 1, cursor: 'pointer' }}>Clock</span>
                    <button
                      className="visibility-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDisplayToggle(clock.id, 'showClock', !(clock.showClock !== false))
                      }}
                      title={clock.showClock !== false ? 'Hide clock' : 'Show clock'}
                    >
                      {clock.showClock !== false ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <span className="expand-icon" onClick={() => toggleMainSection('clock')} style={{ cursor: 'pointer' }}>
                      {expandedMainSection === 'clock' ? '▼' : '▶'}
                    </span>
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
                                    checked={clock.showMinutes ?? true}
                                    onChange={(e) => handleDisplayToggle(clock.id, 'showMinutes', e.target.checked)}
                                  />
                                  Show minutes
                                </label>
                                <label className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={clock.showSeconds ?? true}
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

                {/* Date Section */}
                <div className="main-section">
                  <div
                    className={`main-section-header ${expandedMainSection === 'date' ? 'expanded' : ''}`}
                  >
                    <span onClick={() => toggleMainSection('date')} style={{ flex: 1, cursor: 'pointer' }}>Date</span>
                    <button
                      className="visibility-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDisplayToggle(clock.id, 'showDate', !(clock.showDate !== false))
                      }}
                      title={clock.showDate !== false ? 'Hide date' : 'Show date'}
                    >
                      {clock.showDate !== false ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <span className="expand-icon" onClick={() => toggleMainSection('date')} style={{ cursor: 'pointer' }}>
                      {expandedMainSection === 'date' ? '▼' : '▶'}
                    </span>
                  </div>
                  {expandedMainSection === 'date' && (
                    <div className="main-section-content">
                      {/* Date Properties Subsection */}
                      <div className="subsection">
                        <div
                          className={`subsection-header ${expandedSubSection === 'date-properties' ? 'expanded' : ''}`}
                          onClick={() => toggleSubSection('date-properties')}
                        >
                          <span>Propiedades</span>
                          <span className="expand-icon">{expandedSubSection === 'date-properties' ? '▼' : '▶'}</span>
                        </div>
                        {expandedSubSection === 'date-properties' && (
                          <div className="subsection-content">
                            <div className="setting-group">
                              <label>Format</label>
                              <select
                                value={clock.dateFormat || 'numeric-dmy'}
                                onChange={(e) => handleDateFormatChange(clock.id, e.target.value)}
                              >
                                <option value="numeric-dmy">Numeric (DD/MM/YYYY)</option>
                                <option value="numeric-mdy">Numeric (MM/DD/YYYY)</option>
                                <option value="written">Written (Day Month Year)</option>
                              </select>
                            </div>

                            <div className="setting-group">
                              <label>Display Options</label>
                              <div className="display-options">
                                <label className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={clock.showDayOfWeek ?? false}
                                    onChange={(e) => handleDisplayToggle(clock.id, 'showDayOfWeek', e.target.checked)}
                                  />
                                  Show day of week
                                </label>
                                <label className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={clock.showDay ?? true}
                                    onChange={(e) => handleDisplayToggle(clock.id, 'showDay', e.target.checked)}
                                  />
                                  Show day
                                </label>
                                <label className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={clock.showMonth ?? true}
                                    onChange={(e) => handleDisplayToggle(clock.id, 'showMonth', e.target.checked)}
                                  />
                                  Show month
                                </label>
                                <label className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={clock.showYear ?? true}
                                    onChange={(e) => handleDisplayToggle(clock.id, 'showYear', e.target.checked)}
                                  />
                                  Show year
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Date Style Subsection */}
                      <div className="subsection">
                        <div
                          className={`subsection-header ${expandedSubSection === 'date-style' ? 'expanded' : ''}`}
                          onClick={() => toggleSubSection('date-style')}
                        >
                          <span>Estilo</span>
                          <span className="expand-icon">{expandedSubSection === 'date-style' ? '▼' : '▶'}</span>
                        </div>
                        {expandedSubSection === 'date-style' && (
                          <div className="subsection-content">
                            <ColorSettings
                              settings={clock.dateSettings}
                              onChange={(settings) => handleDateSettingsChange(clock.id, settings)}
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
