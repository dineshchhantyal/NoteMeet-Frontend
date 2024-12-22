import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play } from 'lucide-react'

interface VideoPlayerProps {
  children?: React.ReactNode
  onClick?: () => void
}

export function VideoPlayerPlaceholder({ children, onClick }: VideoPlayerProps) {
  return (
    <Card>
      <CardContent className="p-0 relative">
        <div className="aspect-video relative">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            {
              children ??
              <Button variant="outline" size="lg" onClick={onClick}>
                <Play className="h-8 w-8" />
              </Button>
            }
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
