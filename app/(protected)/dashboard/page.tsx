'use client';

import { useState } from 'react'
import { AppSidebar } from './components/app-sidebar'
import { MeetingInfo } from './components/meeting-info'
import { VideoPlayer } from './components/video-player'
import { TranscriptViewer } from './components/transcript-viewer'
import { SummarySection } from './components/summary-section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MeetingInterface } from '@/interfaces'
import { NotificationDropdown } from './components/notification-dropdown'
import { UserButton } from '@/components/auth/user-button'
import LogoLink from '@/components/LogoLink';
import { NewMeetingDialog } from './components/new-meeting-dialog';
import { VideoPlayerPlaceholder } from './components/video-player-placeholder';



export default function DashboardPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingInterface | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const [meetings, setMeetings] = useState<MeetingInterface[]>([
    {
      id: '1',
      title: 'Team Standup',
      date: '2024-03-15',
      duration: '30m',
      recordingUrl: 'https://example.com/recording1',
      transcript: 'This is a mock transcript for team standup...',
      summary: {
        keyTopics: ['Discussed sprint progress', 'Identified blockers', 'Set priorities'],
        actionItems: ['Review PR #123', 'Update documentation'],
        participants: ['John', 'Alice', 'Bob']
      },
      status: 'Completed',
      meetingLink: 'https://meet.example.com/standup',
      participants: ['John', 'Alice', 'Bob'],
      notifications: {
        sendSummary: true,
        sendTranscript: true
      }
    },
    {
      id: '2',
      title: 'Project Review',
      date: '2024-03-16',
      duration: '1h',
      recordingUrl: 'https://example.com/recording2',
      transcript: 'This is a mock transcript for project review...',
      summary: {
        keyTopics: ['Project status update', 'Resource allocation', 'Timeline review'],
        actionItems: ['Update roadmap', 'Schedule follow-up'],
        participants: ['Sarah', 'Mike', 'Emma']
      },
      status: 'In Progress',
      meetingLink: '',
      participants: [],
      notifications: {
        sendTranscript: false,
        sendSummary: false
      }
    },
    {
      id: '3',
      title: 'Client Meeting',
      date: '2024-03-17',
      duration: '45m',
      recordingUrl: 'https://example.com/recording3',
      transcript: 'This is a mock transcript for client meeting...',
      summary: {
        keyTopics: ['Requirements gathering', 'Feature discussion', 'Next steps'],
        actionItems: ['Send proposal', 'Schedule demo'],
        participants: ['Client A', 'David', 'Lisa']
      },
      status: 'Scheduled',
      meetingLink: '',
      participants: [],
      notifications: {
        sendTranscript: false,
        sendSummary: false
      }
    }
  ])

  const handleMeetingCreated = (newMeeting: MeetingInterface) => {
    setMeetings([...meetings, newMeeting])
  }

  return (

    <SidebarProvider defaultOpen={true} open={!isSidebarCollapsed}>
      <div className="flex h-screen">
        <AppSidebar
          onSelectMeeting={setSelectedMeeting}
          isCollapsed={isSidebarCollapsed}
          meetings={meetings}
        />
        <SidebarInset className="flex flex-col">
          <div className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <LogoLink showText={true} />

            <div className="ml-auto flex items-center gap-4">
              <NewMeetingDialog onMeetingCreated={handleMeetingCreated} />
            </div>
            <NotificationDropdown />
            <UserButton />
          </div>
          <main className="flex-grow overflow-auto p-6 space-y-6">
            {selectedMeeting ? (
              <>
                <MeetingInfo meeting={selectedMeeting} />
                {!selectedMeeting.recordingUrl ? <VideoPlayerPlaceholder>
                  <p className="text-muted-foreground">No video available</p>
                </VideoPlayerPlaceholder> :
                  <VideoPlayer src={selectedMeeting.recordingUrl} />
                }
                <Tabs defaultValue="transcript" className="w-full">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="transcript" className="flex-1">Transcript</TabsTrigger>
                    <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
                  </TabsList>
                  <TabsContent value="transcript" className="mt-4">
                    <TranscriptViewer transcript={selectedMeeting?.transcript} />
                  </TabsContent>
                  <TabsContent value="summary" className="mt-4">
                    <SummarySection summary={selectedMeeting?.summary} />
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="text-lg mb-4">Select a meeting from the sidebar to view details.</p>
                <Button onClick={() => setIsSidebarCollapsed(false)}>
                  {isSidebarCollapsed ? "Expand Sidebar" : "View Meetings"}
                </Button>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

