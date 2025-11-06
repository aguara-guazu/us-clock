import { useEffect, useRef } from 'react'
import { extractDominantColor, getContrastingColor } from '../utils/colorExtraction'

function AutoColorManager({ clocks, background, onUpdateClock }) {
  const intervalRef = useRef(null)
  const lastColorRef = useRef(null)

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Check if any clock has autoColor enabled
    const hasAutoColor = clocks.some(clock => clock.autoColor)

    if (!hasAutoColor || background.type === 'none') {
      return
    }

    const updateColors = async () => {
      let dominantColor

      if (background.type === 'image') {
        // Extract color from image
        const imageUrl = background.imageSource === 'url' ? background.imageUrl : background.imageData
        if (imageUrl) {
          dominantColor = await extractDominantColor(imageUrl, 'image')
        }
      } else if (background.type === 'youtube' && background.youtubeId) {
        // For YouTube videos, extract color from thumbnail
        // Use multiple thumbnail qualities to try
        const thumbnailUrls = [
          `https://img.youtube.com/vi/${background.youtubeId}/maxresdefault.jpg`,
          `https://img.youtube.com/vi/${background.youtubeId}/hqdefault.jpg`,
          `https://img.youtube.com/vi/${background.youtubeId}/mqdefault.jpg`
        ]

        // Try thumbnails in order
        for (const thumbUrl of thumbnailUrls) {
          try {
            dominantColor = await extractDominantColor(thumbUrl, 'image')
            if (dominantColor) break
          } catch (e) {
            continue
          }
        }

        // If all thumbnails fail, use a neutral color
        if (!dominantColor) {
          dominantColor = { r: 80, g: 80, b: 80 }
        }
      }

      if (dominantColor) {
        const contrastColor = getContrastingColor(dominantColor)

        // Only update if color changed significantly
        if (!lastColorRef.current ||
            Math.abs(lastColorRef.current.r - contrastColor.r) > 10 ||
            Math.abs(lastColorRef.current.g - contrastColor.g) > 10 ||
            Math.abs(lastColorRef.current.b - contrastColor.b) > 10) {

          lastColorRef.current = contrastColor

          // Update all clocks with autoColor enabled
          clocks.forEach(clock => {
            if (clock.autoColor) {
              onUpdateClock(clock.id, {
                nameSettings: { ...clock.nameSettings, color: contrastColor },
                clockSettings: { ...clock.clockSettings, color: contrastColor },
                dateSettings: { ...clock.dateSettings, color: contrastColor }
              })
            }
          })
        }
      }
    }

    // Initial update
    updateColors()

    // For videos, update every 3 seconds
    if (background.type === 'youtube') {
      intervalRef.current = setInterval(updateColors, 3000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [clocks, background, onUpdateClock])

  return null // This component doesn't render anything
}

export default AutoColorManager
