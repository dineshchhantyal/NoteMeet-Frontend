import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Download, Share2, PlayCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MeetingInterface } from '@/interfaces'

interface MeetingInfoProps {
  meeting: MeetingInterface
}

export function MeetingInfo({ meeting }: MeetingInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{meeting.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Date: {meeting.date}</p>
            <p className="text-sm text-muted-foreground">Time: {meeting.duration}</p>
            <p className="text-sm text-muted-foreground">Duration: 1 hour</p>
          </div>
          <div className="flex -space-x-2">
            {['John D', 'Jane S', 'Mike R'].map((attendee, index) => (
              <Avatar key={index}>
                <AvatarFallback>{attendee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  View Summary
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View the AI-generated summary of this meeting</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download Transcript
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download the full meeting transcript</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Recording
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share the meeting recording with others</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}

