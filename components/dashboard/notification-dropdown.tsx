'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Bell,
	Calendar,
	FileText,
	CheckCircle,
	Clock,
	X,
	Check,
	AlertCircle,
	CheckCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

// Define notification types
type NotificationType = 'meeting' | 'transcript' | 'action' | 'system';

interface Notification {
	id: number;
	message: string;
	description?: string;
	time: string;
	timestamp: Date;
	type: NotificationType;
	isRead: boolean;
	link?: string;
	priority?: 'low' | 'normal' | 'high';
}

// Mock notifications with enhanced data
const MOCK_NOTIFICATIONS: Notification[] = [
	{
		id: 1,
		message: 'Marketing Strategy Meeting',
		description: 'Scheduled for tomorrow at 10:00 AM',
		time: '5 minutes ago',
		timestamp: new Date(Date.now() - 5 * 60 * 1000),
		type: 'meeting',
		isRead: false,
		priority: 'normal',
		link: '/dashboard/meetings/123',
	},
	{
		id: 2,
		message: 'Product Launch Recap',
		description: 'Transcript is now ready for review',
		time: '1 hour ago',
		timestamp: new Date(Date.now() - 60 * 60 * 1000),
		type: 'transcript',
		isRead: false,
		priority: 'normal',
		link: '/dashboard/meetings/456',
	},
	{
		id: 3,
		message: 'Update Q4 projections',
		description: 'Action item due tomorrow',
		time: '3 hours ago',
		timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
		type: 'action',
		isRead: false,
		priority: 'high',
		link: '/dashboard/tasks/789',
	},
	{
		id: 4,
		message: 'Team Weekly Standup',
		description: 'Recording processed successfully',
		time: '1 day ago',
		timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
		type: 'system',
		isRead: true,
		link: '/dashboard/meetings/012',
	},
];

export function NotificationDropdown() {
	const [notifications, setNotifications] =
		useState<Notification[]>(MOCK_NOTIFICATIONS);
	const [open, setOpen] = useState(false);
	const [activeFilter, setActiveFilter] = useState<string | null>(null);
	const [hasNewNotification, setHasNewNotification] = useState(false);

	// Count unread notifications
	const unreadCount = notifications.filter((n) => !n.isRead).length;

	// Filter notifications based on active filter
	const filteredNotifications = activeFilter
		? notifications.filter((n) => n.type === activeFilter)
		: notifications;

	const markAsRead = (id: number) => {
		setNotifications(
			notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
		);
	};

	const clearNotification = (id: number) => {
		setNotifications(notifications.filter((n) => n.id !== id));
	};

	const markAllAsRead = () => {
		setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
	};

	const clearAllNotifications = () => {
		setNotifications([]);
	};

	// Simulate new notification arrival
	useEffect(() => {
		const interval = setInterval(() => {
			if (Math.random() > 0.9 && !open) {
				setHasNewNotification(true);
				setTimeout(() => setHasNewNotification(false), 2000);
			}
		}, 15000);

		return () => clearInterval(interval);
	}, [open]);

	// Icon mapping for notification types
	const getNotificationIcon = (
		type: NotificationType,
		isRead: boolean,
		priority?: string,
	) => {
		const iconClass = cn(
			'h-5 w-5',
			isRead ? 'text-gray-400' : 'text-[#63d392]',
			priority === 'high' && !isRead && 'text-amber-400',
		);

		switch (type) {
			case 'meeting':
				return <Calendar className={iconClass} />;
			case 'transcript':
				return <FileText className={iconClass} />;
			case 'action':
				return <CheckCircle className={iconClass} />;
			case 'system':
				return <AlertCircle className={iconClass} />;
			default:
				return <Bell className={iconClass} />;
		}
	};

	// Get class for notification priority
	const getNotificationClass = (notification: Notification) => {
		if (notification.isRead) return 'bg-[#0d5559]/50';

		switch (notification.priority) {
			case 'high':
				return 'bg-[#0d5559]/80 border-l-2 border-amber-400';
			case 'normal':
				return 'bg-[#0d5559]/80 border-l-2 border-[#63d392]/70';
			case 'low':
				return 'bg-[#0d5559]/80';
			default:
				return 'bg-[#0d5559]/80';
		}
	};

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative text-white hover:bg-[#156469]/50 focus:ring-1 focus:ring-[#63d392]/30"
				>
					<AnimatePresence>
						{hasNewNotification && (
							<motion.div
								className="absolute inset-0 rounded-full"
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1.2, opacity: 0.5 }}
								exit={{ scale: 1.5, opacity: 0 }}
								transition={{ duration: 1, repeat: 1 }}
							>
								<div className="w-full h-full rounded-full bg-[#63d392]/20" />
							</motion.div>
						)}
					</AnimatePresence>

					<Bell className="h-5 w-5" />

					{unreadCount > 0 && (
						<Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 bg-[#63d392] text-[#0a4a4e] font-medium border-0">
							{unreadCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				className="w-[380px] p-0 bg-[#0a4a4e]/95 backdrop-blur-md border-[#63d392]/20 text-white shadow-md"
			>
				<div className="flex items-center justify-between p-3 border-b border-[#63d392]/20">
					<DropdownMenuLabel className="text-base font-medium m-0">
						Notifications
					</DropdownMenuLabel>

					<div className="flex items-center gap-1">
						{unreadCount > 0 && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 text-[#63d392] hover:bg-[#156469]/50 hover:text-[#63d392]"
											onClick={markAllAsRead}
										>
											<CheckCheck className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent className="bg-[#0d5559] border-[#63d392]/20">
										<p>Mark all as read</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}

						{notifications.length > 0 && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 text-white hover:bg-[#156469]/50 hover:text-white"
											onClick={clearAllNotifications}
										>
											<X className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent className="bg-[#0d5559] border-[#63d392]/20">
										<p>Clear all</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
				</div>

				{notifications.length > 0 && (
					<div className="p-2 border-b border-[#63d392]/20">
						<Tabs
							defaultValue="all"
							className="w-full"
							onValueChange={(value) =>
								setActiveFilter(value === 'all' ? null : value)
							}
						>
							<TabsList className="w-full bg-[#0d5559]/70 p-1 rounded-lg shadow-inner">
								<TabsTrigger
									value="all"
									className="flex-1 data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white hover:bg-[#156469]/50 text-xs"
								>
									All
								</TabsTrigger>
								<TabsTrigger
									value="meeting"
									className="flex-1 data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white hover:bg-[#156469]/50 text-xs"
								>
									Meetings
								</TabsTrigger>
								<TabsTrigger
									value="transcript"
									className="flex-1 data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white hover:bg-[#156469]/50 text-xs"
								>
									Transcripts
								</TabsTrigger>
								<TabsTrigger
									value="action"
									className="flex-1 data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white hover:bg-[#156469]/50 text-xs"
								>
									Actions
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				)}

				<div className="max-h-[350px] overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-[#156469] scrollbar-track-transparent">
					<AnimatePresence>
						{filteredNotifications.length === 0 ? (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="flex flex-col items-center justify-center py-8 text-center"
							>
								<div className="bg-[#156469]/30 p-4 rounded-full mb-3">
									<Bell className="h-6 w-6 text-gray-400" />
								</div>
								<p className="text-gray-300 font-medium">No notifications</p>
								<p className="text-xs text-gray-400 mt-1 max-w-[240px]">
									{activeFilter
										? `You don't have any ${activeFilter} notifications yet`
										: "You're all caught up! New notifications will appear here"}
								</p>
							</motion.div>
						) : (
							filteredNotifications.map((notification) => (
								<motion.div
									key={notification.id}
									layout
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, x: -50 }}
									transition={{ duration: 0.2 }}
								>
									<DropdownMenuItem
										className={cn(
											'flex p-0 cursor-default focus:bg-transparent focus:text-white',
										)}
									>
										<div
											className={cn(
												'flex w-full rounded-md mx-1 my-0.5 overflow-hidden transition-colors',
												getNotificationClass(notification),
											)}
										>
											<div className="p-3 flex items-start">
												<div className="mr-3 mt-1">
													{getNotificationIcon(
														notification.type,
														notification.isRead,
														notification.priority,
													)}
												</div>
												<div className="flex-1">
													<p
														className={cn(
															'font-medium line-clamp-1',
															notification.isRead
																? 'text-gray-300'
																: 'text-white',
														)}
													>
														{notification.message}
													</p>
													{notification.description && (
														<p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
															{notification.description}
														</p>
													)}
													<div className="flex items-center mt-1 gap-2">
														<span className="text-xs text-gray-400 flex items-center">
															<Clock className="h-3 w-3 mr-1 opacity-70" />
															{notification.time}
														</span>

														<div className="flex ml-auto gap-1">
															{!notification.isRead && (
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		markAsRead(notification.id);
																	}}
																	className="h-6 px-2 text-xs bg-[#156469]/30 hover:bg-[#156469]/50 text-[#63d392]"
																>
																	<Check className="h-3 w-3 mr-1" />
																	Mark read
																</Button>
															)}

															<Button
																variant="ghost"
																size="sm"
																onClick={(e) => {
																	e.stopPropagation();
																	clearNotification(notification.id);
																}}
																className="h-6 w-6 p-0 text-gray-400 hover:bg-[#156469]/50 hover:text-white"
															>
																<X className="h-3 w-3" />
															</Button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</DropdownMenuItem>
								</motion.div>
							))
						)}
					</AnimatePresence>
				</div>

				{notifications.length > 0 && (
					<div className="p-2 border-t border-[#63d392]/20">
						<Button
							variant="link"
							className="w-full text-sm text-[#63d392] hover:text-[#63d392]/80 h-8"
						>
							View all notifications
						</Button>
					</div>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
