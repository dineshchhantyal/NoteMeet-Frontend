'use client';

import { useState } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { AppSidebar } from './components/app-sidebar'
import { MeetingInfo } from './components/meeting-info'
import { VideoPlayer } from './components/video-player'
import { TranscriptViewer } from './components/transcript-viewer'
import { SummarySection } from './components/summary-section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { signIn, signOut } from 'next-auth/react'
import { MeetingInterface } from '@/interfaces'
import { NotificationDropdown } from './components/notification-dropdown'
import { UserButton } from '@/components/auth/user-button'



export default async function DashboardPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingInterface | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  

  return (
    
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar
          onSelectMeeting={setSelectedMeeting}
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="ml-auto flex items-center gap-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Meeting
              </Button>
            </div>
            <NotificationDropdown />
            <UserButton />

          </header>
          <main className="flex-grow overflow-auto p-6 space-y-6">
            {selectedMeeting ? (
              <>
                <MeetingInfo meeting={selectedMeeting} />
                <VideoPlayer src={selectedMeeting.recordingUrl} />
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

