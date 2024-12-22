import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface VideoPlayerProps {
  src: string,
  showControls?: boolean
}

  
export function VideoPlayer({ src, showControls = true }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
  }, [])

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const newTime = Number(e.target.value)
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <Card>
      <CardContent className="p-0 relative">
        <div className="aspect-video relative">
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
          {!src && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <p className="text-muted-foreground">No video available</p>
            </div>
          )}
        </div>
        {showControls ?
        <div className="p-4 bg-gray-50">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full mb-2"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{formatTime(currentTime)} / {formatTime(duration)}</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={() => {
                const video = videoRef.current;
                if (video) video.currentTime = video.currentTime - 10;
              }}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => {
                const video = videoRef.current;
                if (video) video.currentTime = video.currentTime + 10;
              }}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div> :
        isPlaying ? "" :
       ( <Button
        size="lg"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
        onClick={togglePlay}
      >
        <Play className="mr-2 h-6 w-6" />
        Watch Demo
      </Button>)
        }

      </CardContent>
    </Card>
  )
}

