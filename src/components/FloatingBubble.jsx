import { useState, useRef, useEffect } from 'react'
import FontSelector from './FontSelector'
import './FloatingBubble.css'

function FloatingBubble({ fonts, settings, onChange }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('bubblePosition')
    return saved ? JSON.parse(saved) : { x: window.innerWidth - 100, y: window.innerHeight - 100 }
  })
  const [collapsedPosition, setCollapsedPosition] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const bubbleRef = useRef(null)

  useEffect(() => {
    // Only save to localStorage when collapsed
    if (!isExpanded) {
      localStorage.setItem('bubblePosition', JSON.stringify(position))
    }
  }, [position, isExpanded])

  const handleMouseDown = (e) => {
    // Only allow dragging from the header when expanded, or from anywhere when collapsed
    if (isExpanded && !e.target.closest('.bubble-header')) {
      return
    }

    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
    e.stopPropagation()
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y

      const bubbleWidth = isExpanded ? 400 : 60
      const bubbleHeight = isExpanded ? 600 : 60
      const maxX = window.innerWidth - bubbleWidth
      const maxY = window.innerHeight - bubbleHeight

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleToggle = (e) => {
    if (!isDragging && !isExpanded) {
      // Save current position before expanding
      setCollapsedPosition({ ...position })
      setIsExpanded(true)
    }
    e.stopPropagation()
  }

  const handleClose = (e) => {
    if (e) e.stopPropagation()

    // Start closing animation
    setIsClosing(true)

    // Wait for animation to complete before actually closing
    setTimeout(() => {
      setIsExpanded(false)
      setIsClosing(false)
      // Restore original collapsed position
      if (collapsedPosition) {
        setPosition(collapsedPosition)
        setCollapsedPosition(null)
      }
    }, 600) // Animation duration
  }

  // Adjust position when expanding to keep panel in viewport
  useEffect(() => {
    if (isExpanded) {
      const expandedWidth = 400
      const expandedHeight = 600
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let newX = position.x
      let newY = position.y

      // Check if panel goes beyond right edge
      if (position.x + expandedWidth > viewportWidth) {
        newX = Math.max(0, viewportWidth - expandedWidth)
      }

      // Check if panel goes beyond bottom edge
      if (position.y + expandedHeight > viewportHeight) {
        newY = Math.max(0, viewportHeight - expandedHeight)
      }

      // Only update if position needs adjustment
      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY })
      }
    }
  }, [isExpanded])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart, isExpanded])

  // Close when clicking outside
  useEffect(() => {
    if (isExpanded && !isClosing) {
      const handleClickOutside = (e) => {
        if (bubbleRef.current && !bubbleRef.current.contains(e.target)) {
          handleClose()
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isExpanded, isClosing, collapsedPosition])

  // Calculate target position for genie animation
  const targetX = collapsedPosition ? collapsedPosition.x : position.x
  const targetY = collapsedPosition ? collapsedPosition.y : position.y

  return (
    <div
      ref={bubbleRef}
      className={`floating-bubble ${isExpanded ? 'expanded' : ''} ${isDragging ? 'dragging' : ''} ${isClosing ? 'closing' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        '--target-x': `${targetX}px`,
        '--target-y': `${targetY}px`,
        '--start-x': `${position.x}px`,
        '--start-y': `${position.y}px`
      }}
      onMouseDown={handleMouseDown}
      onClick={handleToggle}
    >
      {!isExpanded ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17317C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7363 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C10.4178 20 8.87104 19.5308 7.55544 18.6518C6.23985 17.7727 5.21447 16.5233 4.60897 15.0615C4.00347 13.5997 3.84504 11.9911 4.15372 10.4393C4.4624 8.88743 5.22433 7.46197 6.34315 6.34315C7.46197 5.22433 8.88743 4.4624 10.4393 4.15372C11.9911 3.84504 13.5997 4.00346 15.0615 4.60896C16.5233 5.21447 17.7727 6.23984 18.6518 7.55544C19.5308 8.87103 20 10.4177 20 12C20 14.1217 19.1572 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20Z"
            fill="currentColor"
          />
          <path
            d="M12 6C11.7348 6 11.4804 6.10536 11.2929 6.29289C11.1054 6.48043 11 6.73478 11 7V13C11 13.2652 11.1054 13.5196 11.2929 13.7071C11.4804 13.8946 11.7348 14 12 14C12.2652 14 12.5196 13.8946 12.7071 13.7071C12.8946 13.5196 13 13.2652 13 13V7C13 6.73478 12.8946 6.48043 12.7071 6.29289C12.5196 6.10536 12.2652 6 12 6Z"
            fill="currentColor"
          />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
      ) : (
        <div className="expanded-content" onClick={(e) => e.stopPropagation()}>
          <div className="bubble-header" onMouseDown={handleMouseDown}>
            <div className="drag-handle">⋮⋮</div>
            <button className="close-button" onClick={handleClose}>✕</button>
          </div>
          <FontSelector
            fonts={fonts}
            settings={settings}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  )
}

export default FloatingBubble
