import { Card, CardContent } from '@/components/ui/card'

interface VideoPlayerProps extends React.HTMLProps<HTMLVideoElement> {
  text?: string
}


export function VideoPlayer({ src, ...props }: VideoPlayerProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="aspect-video">
          <video
            src={src}
            controls
            className="w-full h-full"
            {...props}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </CardContent>
    </Card>
  )
}

