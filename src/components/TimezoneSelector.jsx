import { useState, useEffect, useRef } from 'react'
import { TIMEZONES, getLocalTimezone } from '../utils/timezones'
import './TimezoneSelector.css'

function TimezoneSelector({ value, onChange }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredTimezones, setFilteredTimezones] = useState(TIMEZONES)
  const selectorRef = useRef(null)

  const LOCAL_OPTION = { city: 'Local (Device)', offset: '', tz: getLocalTimezone() }

  useEffect(() => {
    if (searchTerm) {
      const filtered = TIMEZONES.filter(tz =>
        tz.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tz.offset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tz.tz.toLowerCase().includes(searchTerm.toLowerCase())
      )
      // Add local option if search matches
      if ('local'.includes(searchTerm.toLowerCase()) || 'device'.includes(searchTerm.toLowerCase())) {
        setFilteredTimezones([LOCAL_OPTION, ...filtered])
      } else {
        setFilteredTimezones(filtered)
      }
    } else {
      setFilteredTimezones([LOCAL_OPTION, ...TIMEZONES])
    }
  }, [searchTerm])

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e) => {
        if (selectorRef.current && !selectorRef.current.contains(e.target)) {
          setIsOpen(false)
          setSearchTerm('')
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  const handleSelect = (timezone) => {
    onChange(timezone.tz)
    setIsOpen(false)
    setSearchTerm('')
  }

  const getCurrentTimezone = () => {
    // Check if it matches local timezone
    if (value === getLocalTimezone()) {
      const tzInfo = TIMEZONES.find(tz => tz.tz === value)
      if (tzInfo) {
        return { city: `Local (${tzInfo.city})`, offset: tzInfo.offset }
      }
      return LOCAL_OPTION
    }
    return TIMEZONES.find(tz => tz.tz === value) || { city: 'Unknown', offset: '' }
  }

  const currentTz = getCurrentTimezone()

  return (
    <div className="timezone-selector" ref={selectorRef}>
      <div className="timezone-display" onClick={() => setIsOpen(!isOpen)}>
        <span className="timezone-city">{currentTz.city}</span>
        <span className="timezone-offset">{currentTz.offset}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="timezone-dropdown">
          <input
            type="text"
            className="timezone-search"
            placeholder="Search city or GMT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <div className="timezone-list">
            {filteredTimezones.length > 0 ? (
              filteredTimezones.map((tz, index) => (
                <div
                  key={index}
                  className={`timezone-option ${tz.tz === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(tz)}
                >
                  <span className="tz-city">{tz.city}</span>
                  <span className="tz-offset">{tz.offset}</span>
                </div>
              ))
            ) : (
              <div className="no-results">No timezones found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TimezoneSelector
