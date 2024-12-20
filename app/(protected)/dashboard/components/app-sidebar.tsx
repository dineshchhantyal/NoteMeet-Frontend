'use client'

import { SetStateAction, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { MeetingInterface } from '@/interfaces'

const MOCK_MEETINGS: MeetingInterface[] = [
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
    status: 'Completed'
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
    status: 'In Progress'
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
    status: 'Scheduled'

  }
]

interface AppSidebarProps {
  onSelectMeeting: (value: SetStateAction<MeetingInterface | null>) => void
  isCollapsed: boolean
}


export function AppSidebar({ onSelectMeeting, isCollapsed }: AppSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMeetings = MOCK_MEETINGS.filter(meeting =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.date.includes(searchTerm) ||
    meeting.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const nextMeeting = MOCK_MEETINGS.find(meeting => meeting.status === 'Scheduled')

  return (
    <Sidebar collapsible={isCollapsed ? 'icon' : 'offcanvas'}>
      <SidebarHeader>
        <div className="relative px-2 py-2">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search meetings..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {nextMeeting && (
          <div className="px-4 py-2 mb-4 bg-primary/10 rounded-md">
            <h3 className="font-semibold text-sm">Next Meeting</h3>
            <p className="text-sm">{nextMeeting.title}</p>
            <p className="text-xs text-muted-foreground">{nextMeeting.date} - {nextMeeting.time}</p>
          </div>
        )}
        <SidebarMenu>
          {filteredMeetings.map((meeting) => (
            <SidebarMenuItem key={meeting.id} className="mb-2">
              <SidebarMenuButton onClick={() => onSelectMeeting(meeting)} className="w-full" size={'lg'}>
                <div className="flex flex-col items-start w-full overflow-hidden">
                  <span className="font-medium truncate w-full">{meeting.title}</span>
                  <span className="text-xs text-muted-foreground truncate w-full">{meeting.date} - {meeting.time}</span>
                  {/* <Badge variant="outline" className={`mt-1 ${getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </Badge> */}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

// function getStatusColor(status: "Completed" | "Scheduled" | "In Progress" | undefined) {
//   switch (status) {
//     case 'Completed':
//       return 'bg-green-100 text-green-800 border-green-300'
//     case 'In Progress':
//       return 'bg-blue-100 text-blue-800 border-blue-300'
//     case 'Scheduled':
//       return 'bg-yellow-100 text-yellow-800 border-yellow-300'
//     default:
//       return 'bg-gray-100 text-gray-800 border-gray-300'
//   }
// }

