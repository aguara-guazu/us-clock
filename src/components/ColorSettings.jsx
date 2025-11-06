import { useState, useRef, useEffect } from 'react'
import './ColorSettings.css'

function ColorSettings({ settings, onChange, fonts }) {
  const [hexColor, setHexColor] = useState(rgbToHex(settings.color))
  const colorWheelRef = useRef(null)
  const [isDraggingWheel, setIsDraggingWheel] = useState(false)

  function rgbToHex(rgb) {
    const toHex = (n) => {
      const hex = Math.max(0, Math.min(255, n)).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : settings.color
  }

  // Update hex input when color changes externally
  useEffect(() => {
    setHexColor(rgbToHex(settings.color))
  }, [settings.color])

  const handleColorChange = (color) => {
    onChange({ color })
    setHexColor(rgbToHex(color))
  }

  const handleHexChange = (e) => {
    const hex = e.target.value
    setHexColor(hex)
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      onChange({ color: hexToRgb(hex) })
    }
  }

  const handleHexBlur = () => {
    // Revert to current color if hex is invalid
    if (!/^#[0-9A-F]{6}$/i.test(hexColor)) {
      setHexColor(rgbToHex(settings.color))
    }
  }

  const handleRgbChange = (channel, value) => {
    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0))
    const newColor = { ...settings.color, [channel]: numValue }
    handleColorChange(newColor)
  }

  const handleColorWheelClick = (e) => {
    const rect = colorWheelRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const color = getColorFromPosition(x, y, rect.width, rect.height)
    handleColorChange(color)
  }

  const handleColorWheelMove = (e) => {
    if (isDraggingWheel) {
      const rect = colorWheelRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const color = getColorFromPosition(x, y, rect.width, rect.height)
      handleColorChange(color)
    }
  }

  const getColorFromPosition = (x, y, width, height) => {
    const centerX = width / 2
    const centerY = height / 2
    const angle = Math.atan2(y - centerY, x - centerX)
    const distance = Math.min(Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2), width / 2)
    const normalizedDistance = distance / (width / 2)
    const hue = (angle * 180 / Math.PI + 360) % 360

    // Map distance to saturation and lightness
    // Center (0): white (S=0, L=100)
    // Middle (0.5): full color (S=100, L=50)
    // Edge (1): black (S=100, L=0)
    let saturation, lightness

    if (normalizedDistance < 0.5) {
      // From center to middle: increase saturation, decrease lightness
      saturation = normalizedDistance * 200 // 0 to 100
      lightness = 100 - normalizedDistance * 100 // 100 to 50
    } else {
      // From middle to edge: full saturation, decrease lightness to black
      saturation = 100
      lightness = (1 - normalizedDistance) * 100 // 50 to 0
    }

    return hslToRgb(hue, saturation, lightness)
  }

  function hslToRgb(h, s, l) {
    s /= 100
    l /= 100
    const k = n => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4))
    }
  }

  useEffect(() => {
    if (isDraggingWheel) {
      const handleMouseUp = () => setIsDraggingWheel(false)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('mousemove', handleColorWheelMove)
      return () => {
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('mousemove', handleColorWheelMove)
      }
    }
  }, [isDraggingWheel])

  return (
    <div className="color-settings">
      <div className="setting-group">
        <label>Font</label>
        <select
          value={settings.fontClass}
          onChange={(e) => onChange({ fontClass: e.target.value })}
        >
          {fonts.map((font) => (
            <option key={font.class} value={font.class}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      <div className="setting-group">
        <label>Color</label>
        <div
          ref={colorWheelRef}
          className="color-wheel"
          onMouseDown={(e) => {
            setIsDraggingWheel(true)
            handleColorWheelClick(e)
          }}
        />
      </div>

      <div className="setting-group">
        <label>Hex</label>
        <input
          type="text"
          value={hexColor}
          onChange={handleHexChange}
          onBlur={handleHexBlur}
          placeholder="#000000"
        />
      </div>

      <div className="setting-group">
        <label>RGB</label>
        <div className="rgb-inputs">
          <div className="rgb-input">
            <label>R</label>
            <input
              type="number"
              min="0"
              max="255"
              value={settings.color.r}
              onChange={(e) => handleRgbChange('r', e.target.value)}
            />
          </div>
          <div className="rgb-input">
            <label>G</label>
            <input
              type="number"
              min="0"
              max="255"
              value={settings.color.g}
              onChange={(e) => handleRgbChange('g', e.target.value)}
            />
          </div>
          <div className="rgb-input">
            <label>B</label>
            <input
              type="number"
              min="0"
              max="255"
              value={settings.color.b}
              onChange={(e) => handleRgbChange('b', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="setting-group">
        <label>Opacity: {Math.round(settings.alpha * 100)}%</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={settings.alpha}
          onChange={(e) => onChange({ alpha: parseFloat(e.target.value) })}
        />
      </div>

      <div className="setting-group">
        <label>Size: {settings.size}px</label>
        <input
          type="range"
          min="12"
          max="200"
          step="2"
          value={settings.size}
          onChange={(e) => onChange({ size: parseInt(e.target.value) })}
        />
      </div>

      <div className="color-preview">
        <div
          className="preview-box"
          style={{
            backgroundColor: `rgba(${settings.color.r}, ${settings.color.g}, ${settings.color.b}, ${settings.alpha})`
          }}
        />
      </div>
    </div>
  )
}

export default ColorSettings
