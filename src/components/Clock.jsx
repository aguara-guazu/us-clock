import { useState, useEffect } from 'react'
import './Clock.css'

function Clock({ settings }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  const { fontClass, color, size, alpha } = settings
  const rgbaColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`

  return (
    <div
      className={`clock ${fontClass}`}
      style={{
        color: rgbaColor,
        fontSize: `${size}px`
      }}
    >
      {formatTime(time)}
    </div>
  )
}

export default Clock
