import { useEffect, useRef } from 'react'
import { extractDominantColor, getContrastingColor } from '../utils/colorExtraction'

function AutoColorManager({ clocks, background, onUpdateClock }) {
  const intervalRef = useRef(null)
  const lastColorRef = useRef(null)

  useEffect(() => {
    console.log('AutoColorManager: useEffect triggered', {
      clocksCount: clocks.length,
      backgroundType: background.type,
      clocksWithAutoColor: clocks.filter(c => c.autoColor).length
    })

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Check if any clock has autoColor enabled
    const hasAutoColor = clocks.some(clock => clock.autoColor)
    console.log('AutoColorManager: hasAutoColor =', hasAutoColor)

    if (!hasAutoColor || background.type === 'none') {
      console.log('AutoColorManager: Exiting early - hasAutoColor:', hasAutoColor, 'background.type:', background.type)
      return
    }

    const updateColors = async () => {
      console.log('AutoColorManager: updateColors called', { backgroundType: background.type, youtubeId: background.youtubeId })
      let dominantColor

      if (background.type === 'image') {
        // Extract color from image
        const imageUrl = background.imageSource === 'url' ? background.imageUrl : background.imageData
        if (imageUrl) {
          console.log('AutoColorManager: Extracting color from image')
          dominantColor = await extractDominantColor(imageUrl, 'image')
          console.log('AutoColorManager: Image dominant color:', dominantColor)
        }
      } else if (background.type === 'youtube' && background.youtubeId) {
        console.log('AutoColorManager: YouTube background detected, youtubeId:', background.youtubeId)
        // For YouTube videos, extract color from thumbnail
        // Use multiple thumbnail qualities to try
        const thumbnailUrls = [
          `https://img.youtube.com/vi/${background.youtubeId}/maxresdefault.jpg`,
          `https://img.youtube.com/vi/${background.youtubeId}/hqdefault.jpg`,
          `https://img.youtube.com/vi/${background.youtubeId}/mqdefault.jpg`
        ]

        console.log('AutoColorManager: Trying thumbnail URLs:', thumbnailUrls)

        // Try thumbnails in order
        for (const thumbUrl of thumbnailUrls) {
          try {
            console.log('AutoColorManager: Trying thumbnail:', thumbUrl)
            dominantColor = await extractDominantColor(thumbUrl, 'image')
            if (dominantColor) {
              console.log('AutoColorManager: Successfully extracted color from thumbnail:', thumbUrl, dominantColor)
              break
            }
          } catch (e) {
            console.log('AutoColorManager: Failed to extract from thumbnail:', thumbUrl, e)
            continue
          }
        }

        // If all thumbnails fail, use a neutral color
        if (!dominantColor) {
          console.log('AutoColorManager: All thumbnails failed, using neutral color')
          dominantColor = { r: 80, g: 80, b: 80 }
        }
      }

      if (dominantColor) {
        const contrastColor = getContrastingColor(dominantColor)
        console.log('AutoColorManager: Calculated contrast color:', contrastColor)

        // Only update if color changed significantly
        if (!lastColorRef.current ||
            Math.abs(lastColorRef.current.r - contrastColor.r) > 10 ||
            Math.abs(lastColorRef.current.g - contrastColor.g) > 10 ||
            Math.abs(lastColorRef.current.b - contrastColor.b) > 10) {

          console.log('AutoColorManager: Color changed significantly, updating clocks')
          lastColorRef.current = contrastColor

          // Update all clocks with autoColor enabled
          const clocksWithAutoColor = clocks.filter(c => c.autoColor)
          console.log('AutoColorManager: Clocks with autoColor enabled:', clocksWithAutoColor.length)

          clocks.forEach(clock => {
            if (clock.autoColor) {
              console.log('AutoColorManager: Updating clock', clock.id, 'with color', contrastColor)
              onUpdateClock(clock.id, {
                nameSettings: { ...clock.nameSettings, color: contrastColor },
                clockSettings: { ...clock.clockSettings, color: contrastColor },
                dateSettings: { ...clock.dateSettings, color: contrastColor }
              })
            }
          })
        } else {
          console.log('AutoColorManager: Color did not change significantly, skipping update')
        }
      } else {
        console.log('AutoColorManager: No dominant color extracted')
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
