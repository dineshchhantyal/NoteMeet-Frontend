import { Card, CardContent } from '@/components/ui/card'

export function VideoPlayer({ src }: { src: string }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="aspect-video">
          <video
            src={src}
            controls
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </CardContent>
    </Card>
  )
}

