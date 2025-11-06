import { useEffect, useRef } from 'react'

function YouTubeBackground({ videoId, isMuted }) {
  const playerRef = useRef(null)
  const iframeRef = useRef(null)

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }

    // Initialize player when API is ready
    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player(iframeRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: videoId,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            mute: isMuted ? 1 : 0,
            playsinline: 1,
            rel: 0,
            enablejsapi: 1
          },
          events: {
            onReady: (event) => {
              event.target.playVideo()
            },
            onStateChange: (event) => {
              // If video ended, restart it
              if (event.data === window.YT.PlayerState.ENDED) {
                event.target.seekTo(0)
                event.target.playVideo()
              }
            }
          }
        })
      }
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy()
      }
    }
  }, [videoId])

  useEffect(() => {
    // Update mute state when it changes
    if (playerRef.current && playerRef.current.isMuted !== undefined) {
      if (isMuted) {
        playerRef.current.mute()
      } else {
        playerRef.current.unMute()
      }
    }
  }, [isMuted])

  return (
    <div className="background-container">
      <div ref={iframeRef} className="background-video" />
    </div>
  )
}

export default YouTubeBackground
