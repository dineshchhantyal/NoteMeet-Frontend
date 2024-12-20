import { VideoPlayer } from '@/app/(protected)/dashboard/components/video-player'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import Image from 'next/image'

export function ProductDemo() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-8">See NoteMeet in Action</h2>
        <div className="relative aspect-video max-w-4xl mx-auto">
         <VideoPlayer src='https://www.youtube.com/watch?v=cbj_bmFflrE'/>
          <Button
            size="lg"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <Play className="mr-2 h-6 w-6" />
            Watch Demo
          </Button>
        </div>
        <p className="mt-8 text-lg">Simplify Meetings Today!</p>
      </div>
    </section>
  )
}

