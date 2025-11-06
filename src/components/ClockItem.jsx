import { useState, useEffect, useRef } from 'react'
import { format, toZonedTime } from 'date-fns-tz'
import { TIMEZONES } from '../utils/timezones'
import './ClockItem.css'

function ClockItem({ clock, isSelected, isLocked, onSelect, onDeselect, onUpdatePosition }) {
  const [time, setTime] = useState(new Date())
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const clockRef = useRef(null)
  const clickTimeout = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isSelected) {
      const handleClickOutside = (e) => {
        if (clockRef.current && !clockRef.current.contains(e.target)) {
          onDeselect()
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isSelected, onDeselect])

  const handleMouseDown = (e) => {
    if (isLocked || !isSelected) return

    setIsDragging(true)
    setDragStart({
      x: e.clientX - clock.position.x,
      y: e.clientY - clock.position.y
    })
  }

  const handleMouseMove = (e) => {
    if (isDragging && isSelected && !isLocked) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y

      onUpdatePosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - 400)),
        y: Math.max(0, Math.min(newY, window.innerHeight - 150))
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart, isSelected, isLocked])

  const handleClick = () => {
    if (isLocked) return

    if (clickTimeout.current) {
      // Double click
      clearTimeout(clickTimeout.current)
      clickTimeout.current = null
      if (!isSelected) {
        onSelect()
      }
    } else {
      // Single click - wait to see if it's a double click
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null
      }, 300)
    }
  }

  const formatTime = (date) => {
    try {
      const zonedTime = toZonedTime(date, clock.timezone)
      let formatString = 'HH' // Hours are always shown

      if (clock.showMinutes !== false) {
        formatString += ':mm'
      }
      if (clock.showSeconds !== false) {
        formatString += ':ss'
      }

      return format(zonedTime, formatString, { timeZone: clock.timezone })
    } catch (error) {
      // Fallback if timezone is invalid
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')

      let parts = [hours] // Hours are always shown
      if (clock.showMinutes !== false) parts.push(minutes)
      if (clock.showSeconds !== false) parts.push(seconds)

      return parts.join(':')
    }
  }

  const getDisplayName = () => {
    if (clock.useTimezoneName) {
      const tzInfo = TIMEZONES.find(tz => tz.tz === clock.timezone)
      return tzInfo ? tzInfo.city : clock.name
    }
    return clock.name
  }

  const nameRgba = `rgba(${clock.nameSettings.color.r}, ${clock.nameSettings.color.g}, ${clock.nameSettings.color.b}, ${clock.nameSettings.alpha})`
  const clockRgba = `rgba(${clock.clockSettings.color.r}, ${clock.clockSettings.color.g}, ${clock.clockSettings.color.b}, ${clock.clockSettings.alpha})`

  return (
    <div
      ref={clockRef}
      className={`clock-item ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${clock.position.x}px`,
        top: `${clock.position.y}px`,
        cursor: isLocked ? 'default' : (isSelected ? 'move' : 'pointer')
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`clock-name ${clock.nameSettings.fontClass}`}
        style={{
          color: nameRgba,
          fontSize: `${clock.nameSettings.size}px`
        }}
      >
        {getDisplayName()}
      </div>
      <div
        className={`clock-time ${clock.clockSettings.fontClass}`}
        style={{
          color: clockRgba,
          fontSize: `${clock.clockSettings.size}px`
        }}
      >
        {formatTime(time)}
      </div>
    </div>
  )
}

export default ClockItem
