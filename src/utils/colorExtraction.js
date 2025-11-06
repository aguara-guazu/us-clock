// Extract dominant color from an image or video
export function extractDominantColor(source, sourceType) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = 100
    canvas.height = 100

    try {
      if (sourceType === 'image') {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          const color = analyzeDominantColor(ctx, canvas.width, canvas.height)
          resolve(color)
        }
        img.onerror = () => resolve({ r: 128, g: 128, b: 128 })
        img.src = source
      } else if (sourceType === 'video') {
        // For video, we need to draw current frame
        ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
        const color = analyzeDominantColor(ctx, canvas.width, canvas.height)
        resolve(color)
      }
    } catch (error) {
      console.error('Error extracting color:', error)
      resolve({ r: 128, g: 128, b: 128 })
    }
  })
}

function analyzeDominantColor(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  // Sample pixels (every 4th pixel to improve performance)
  const samples = []
  for (let i = 0; i < data.length; i += 16) { // RGBA, so +16 skips 4 pixels
    samples.push({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2]
    })
  }

  // Calculate average color (simple approach)
  const avg = samples.reduce(
    (acc, color) => ({
      r: acc.r + color.r,
      g: acc.g + color.g,
      b: acc.b + color.b
    }),
    { r: 0, g: 0, b: 0 }
  )

  return {
    r: Math.round(avg.r / samples.length),
    g: Math.round(avg.g / samples.length),
    b: Math.round(avg.b / samples.length)
  }
}

// Calculate relative luminance
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Calculate contrast ratio between two colors
function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1.r, color1.g, color1.b)
  const l2 = getLuminance(color2.r, color2.g, color2.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// Get a contrasting color that is readable
export function getContrastingColor(backgroundColor) {
  const bgLuminance = getLuminance(backgroundColor.r, backgroundColor.g, backgroundColor.b)

  // If background is dark, return white or light color
  // If background is light, return black or dark color
  if (bgLuminance < 0.5) {
    // Dark background - use white or light color
    const white = { r: 255, g: 255, b: 255 }
    const contrastRatio = getContrastRatio(backgroundColor, white)

    if (contrastRatio >= 4.5) {
      return white
    } else {
      // Try a light gray
      return { r: 240, g: 240, b: 240 }
    }
  } else {
    // Light background - use black or dark color
    const black = { r: 0, g: 0, b: 0 }
    const contrastRatio = getContrastRatio(backgroundColor, black)

    if (contrastRatio >= 4.5) {
      return black
    } else {
      // Try a dark gray
      return { r: 20, g: 20, b: 20 }
    }
  }
}

// Smooth transition between colors
export function interpolateColor(fromColor, toColor, factor) {
  return {
    r: Math.round(fromColor.r + (toColor.r - fromColor.r) * factor),
    g: Math.round(fromColor.g + (toColor.g - fromColor.g) * factor),
    b: Math.round(fromColor.b + (toColor.b - fromColor.b) * factor)
  }
}
