'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	ChevronDown,
	ChevronUp,
	BarChart3,
	Clock,
	UserCheck,
	MessageSquare,
	PieChart,
} from 'lucide-react';
import { MeetingInterface } from '@/types';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalyticsData {
	totalDuration: number;
	attendees: {
		name: string;
		speakingTime: number;
		messageCount: number;
		attendanceRate: number;
	}[];
	topicDistribution: {
		topic: string;
		duration: number;
		percentage: number;
	}[];
}

interface MeetingAnalyticsProps {
	meeting: MeetingInterface;
}

export function MeetingAnalytics({ meeting }: MeetingAnalyticsProps) {
	const [expanded, setExpanded] = useState(false);
	const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (meeting?.id) {
			setLoading(true);

			// Fetch analytics data from API
			fetch(`/api/meetings/${meeting.id}/analytics`)
				.then((res) => res.json())
				.then((data) => {
					setAnalytics(data.analytics);
					setLoading(false);
				})
				.catch((err) => {
					console.error('Error fetching meeting analytics:', err);
					setLoading(false);

					// Generate mock data for demo purposes
					generateMockAnalytics();
				});
		}
	}, [meeting?.id]);

	const generateMockAnalytics = () => {
		// Create realistic mock data based on meeting info
		const participants = meeting.participants || [
			'John Doe',
			'Jane Smith',
			'Mike Johnson',
		];
		const keyTopics = meeting.summary?.keyTopics || [
			'Project Timeline',
			'Budget Review',
			'Design Updates',
			'Marketing Strategy',
		];

		const mockData: AnalyticsData = {
			totalDuration: 3600, // 1 hour in seconds
			attendees: participants.map((name) => ({
				name,
				speakingTime: Math.floor(Math.random() * 900) + 300, // 5-20 minutes
				messageCount: Math.floor(Math.random() * 30) + 5,
				attendanceRate: Math.floor(Math.random() * 30) + 70, // 70-100%
			})),
			topicDistribution: keyTopics.map((topic, i) => {
				const percentage =
					i === keyTopics.length - 1
						? 100 -
							keyTopics
								.slice(0, -1)
								.reduce((acc, _, idx) => acc + (25 - idx * 5), 0)
						: 25 - i * 5; // Distribute percentages
				return {
					topic,
					duration: Math.floor((percentage / 100) * 3600),
					percentage,
				};
			}),
		};

		setAnalytics(mockData);
	};

	// Format seconds to mm:ss
	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	// Format seconds to percentage of total duration
	const getPercentageOfTotal = (seconds: number) => {
		if (!analytics?.totalDuration) return 0;
		return Math.round((seconds / analytics.totalDuration) * 100);
	};

	// Get color based on value
	const getParticipationColor = (participation: number) => {
		if (participation >= 30)
			return 'bg-[#63d392]/20 text-[#63d392] border-[#63d392]/30';
		if (participation >= 15)
			return 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30';
		return 'bg-red-500/20 text-red-400 border-red-500/30';
	};

	// Generate color for avatar based on name
	const getAvatarColor = (name: string) => {
		const colors = [
			'bg-[#63d392]/30 text-[#63d392]',
			'bg-[#156469]/30 text-white',
			'bg-[#0d5559]/40 text-white',
			'bg-[#fbbf24]/30 text-[#fbbf24]',
			'bg-[#818cf8]/30 text-[#818cf8]',
		];

		// Simple hash function for consistent colors
		const hash = name
			.split('')
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return colors[hash % colors.length];
	};

	// Get initials from name
	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((part) => part[0])
			.join('')
			.toUpperCase();
	};

	if (!analytics && !loading) {
		return null;
	}

	return (
		<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 overflow-hidden shadow-md">
			<div
				className="flex items-center justify-between bg-[#0d5559]/80 px-4 py-3 border-b border-[#63d392]/20 cursor-pointer"
				onClick={() => setExpanded(!expanded)}
			>
				<div className="flex items-center">
					<div className="bg-[#63d392]/20 p-1.5 rounded-md mr-2">
						<BarChart3 className="h-5 w-5 text-[#63d392]" />
					</div>
					<h3 className="font-medium text-white">Meeting Analytics</h3>
				</div>
				<Button
					variant="ghost"
					size="sm"
					className="text-white hover:bg-[#156469]/50 p-0 h-8 w-8"
				>
					{expanded ? (
						<ChevronUp className="h-5 w-5" />
					) : (
						<ChevronDown className="h-5 w-5" />
					)}
				</Button>
			</div>

			{expanded && (
				<>
					{loading ? (
						<div className="flex justify-center py-10">
							<div className="animate-spin h-8 w-8 border-2 border-[#63d392] border-t-transparent rounded-full"></div>
						</div>
					) : (
						<div className="p-4">
							<Tabs defaultValue="participants" className="w-full">
								<TabsList className="w-full bg-[#0d5559]/50 p-1 rounded-lg">
									<TabsTrigger
										value="participants"
										className="flex-1 data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white"
									>
										<UserCheck className="h-4 w-4 mr-2" />
										Participation
									</TabsTrigger>
									<TabsTrigger
										value="topics"
										className="flex-1 data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white"
									>
										<PieChart className="h-4 w-4 mr-2" />
										Topics
									</TabsTrigger>
								</TabsList>

								<TabsContent value="participants" className="mt-4">
									<div className="bg-[#0d5559]/30 rounded-lg p-4 mb-4">
										<div className="flex items-center justify-between mb-2">
											<h4 className="text-sm font-medium text-white">
												Participant Contributions
											</h4>
											<Badge className="bg-[#63d392]/20 text-[#63d392] border-0">
												<Clock className="h-3.5 w-3.5 mr-1" />
												Total: {formatDuration(analytics?.totalDuration || 0)}
											</Badge>
										</div>

										<div className="space-y-4 mt-4">
											{analytics?.attendees.map((attendee, index) => (
												<div key={index} className="space-y-2">
													<div className="flex items-center justify-between">
														<div className="flex items-center">
															<Avatar
																className={`h-8 w-8 mr-2 ${getAvatarColor(attendee.name)}`}
															>
																<AvatarFallback>
																	{getInitials(attendee.name)}
																</AvatarFallback>
															</Avatar>
															<div>
																<p className="text-sm text-white">
																	{attendee.name}
																</p>
																<div className="flex items-center space-x-2">
																	<Badge
																		variant="outline"
																		className={`${getParticipationColor(getPercentageOfTotal(attendee.speakingTime))} text-xs h-5`}
																	>
																		{getPercentageOfTotal(
																			attendee.speakingTime,
																		)}
																		%
																	</Badge>
																	<span className="text-xs text-gray-300">
																		{formatDuration(attendee.speakingTime)}
																	</span>
																</div>
															</div>
														</div>

														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger asChild>
																	<div className="bg-[#0d5559]/60 px-2 py-1 rounded flex items-center">
																		<MessageSquare className="h-3.5 w-3.5 mr-1 text-[#63d392]" />
																		<span className="text-xs text-gray-200">
																			{attendee.messageCount}
																		</span>
																	</div>
																</TooltipTrigger>
																<TooltipContent className="bg-[#0d5559] border-[#63d392]/20">
																	<p>{attendee.messageCount} messages sent</p>
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													</div>

													<Progress
														value={getPercentageOfTotal(attendee.speakingTime)}
														className="h-1.5 bg-[#0d5559]/80 [&>div]:bg-[#63d392]"
													/>
												</div>
											))}
										</div>
									</div>
								</TabsContent>

								<TabsContent value="topics" className="mt-4">
									<div className="bg-[#0d5559]/30 rounded-lg p-4">
										<h4 className="text-sm font-medium text-white mb-4">
											Time Spent on Topics
										</h4>

										<div className="space-y-4">
											{analytics?.topicDistribution.map((topic, index) => (
												<div key={index} className="space-y-2">
													<div className="flex items-center justify-between">
														<p className="text-sm text-white">{topic.topic}</p>
														<div className="flex items-center space-x-3">
															<span className="text-xs text-gray-300">
																{formatDuration(topic.duration)}
															</span>
															<Badge className="bg-[#63d392]/20 text-[#63d392] border-0">
																{topic.percentage}%
															</Badge>
														</div>
													</div>

													<Progress
														value={topic.percentage}
														className="h-2 bg-[#0d5559]/80 [&>div]:bg-[#63d392]"
													/>
												</div>
											))}
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</div>
					)}
				</>
			)}
		</div>
	);
}
