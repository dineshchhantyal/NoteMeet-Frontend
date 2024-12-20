import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Download, Edit } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface TranscriptViewerProps {
  transcript?: string
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const highlightedTranscript = transcript
    ? transcript.split('\n').map((line, index) => {
        if (searchTerm && line.toLowerCase().includes(searchTerm.toLowerCase())) {
          const parts = line.split(new RegExp(`(${searchTerm})`, 'gi'))
          return (
            <p key={index}>
              {parts.map((part, i) => 
                part.toLowerCase() === searchTerm.toLowerCase() 
                  ? <mark key={i} className="bg-yellow-200">{part}</mark> 
                  : part
              )}
            </p>
          )
        }
        return <p key={index}>{line}</p>
      })
    : null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Transcript</CardTitle>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download transcript</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit transcript</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transcript..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="max-h-96 overflow-y-auto space-y-2 text-sm">
          {transcript ? (
            highlightedTranscript
          ) : (
            <p className="text-muted-foreground">No transcript available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

