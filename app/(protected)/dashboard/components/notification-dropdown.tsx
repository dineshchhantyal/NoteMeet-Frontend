'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

const MOCK_NOTIFICATIONS = [
  { id: 1, message: 'New meeting scheduled', time: '5 minutes ago' },
  { id: 2, message: 'Transcript ready for review', time: '1 hour ago' },
  { id: 3, message: 'Action item due tomorrow', time: '3 hours ago' },
]

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const clearNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5">
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <DropdownMenuItem>No new notifications</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex justify-between items-start p-3">
              <div>
                <p className="font-medium">{notification.message}</p>
                <p className="text-sm text-muted-foreground">{notification.time}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  clearNotification(notification.id)
                }}
              >
                Clear
              </Button>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

