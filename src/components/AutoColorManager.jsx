import { useEffect, useRef } from 'react'
import { extractDominantColor, getContrastingColor } from '../utils/colorExtraction'

function AutoColorManager({ clocks, background, onUpdateClock }) {
  const intervalRef = useRef(null)
  const videoElementRef = useRef(null)

  useEffect(() => {
    // Find video element if background is YouTube
    if (background.type === 'youtube' && background.youtubeId) {
      const findVideoElement = () => {
        const iframe = document.querySelector('.background-video iframe')
        if (iframe) {
          videoElementRef.current = iframe
        }
      }

      // Try to find video element after a short delay
      setTimeout(findVideoElement, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [background.type, background.youtubeId])

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
      } else if (background.type === 'youtube' && videoElementRef.current) {
        // For video, we'd need to capture a frame
        // This is complex with iframe, so we'll use a simpler approach
        // and just update periodically with a default approach
        // Note: Due to CORS restrictions with YouTube iframes, we can't directly access video frames
        // We'll use a fallback color
        dominantColor = { r: 50, g: 50, b: 50 } // Dark fallback for videos
      }

      if (dominantColor) {
        const contrastColor = getContrastingColor(dominantColor)

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
