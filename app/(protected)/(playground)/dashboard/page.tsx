'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from './components/app-sidebar';
import { MeetingInfo } from './components/meeting-info';
import { VideoPlayer } from './components/video-player';
import { TranscriptViewer } from './components/transcript-viewer';
import { SummarySection } from './components/summary-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { MeetingInterface } from '@/types';
import { VideoPlayerPlaceholder } from './components/video-player-placeholder';
import DashboardHeader from './components/dashboard-header';

export default function DashboardPage() {
	const [selectedMeeting, setSelectedMeeting] =
		useState<MeetingInterface | null>(null);
	const [loading, setLoading] = useState(true);
	const [videoUrl, setVideoUrl] = useState<string | null>(null);

	const [meetings, setMeetings] = useState<MeetingInterface[]>([]);
	useEffect(() => {
		const fetchMeetings = async () => {
			setLoading(true);
			try {
				const response = await fetch('/api/meetings');
				const data = await response.json();
				setMeetings(data.data);
			} catch (error) {
				console.error('Error fetching meetings:', error);
			}
			setLoading(false);
		};

		fetchMeetings();
	}, []);

	useEffect(() => {
		if (selectedMeeting && selectedMeeting.videoKey) {
			const fetchVideoUrl = async () => {
				try {
					const response = await fetch(
						`/api/meetings/${selectedMeeting.id}/presigned-url`,
					);
					const data = await response.json();
					console.log('data', data.presignedUrl.url);
					setVideoUrl(data.presignedUrl.url);
				} catch (error) {
					console.error('Error fetching video url:', error);
				}
			};

			fetchVideoUrl();
		} else setVideoUrl(null);
	}, [selectedMeeting]);

	const onMeetingDelete = async (meetingId: string) => {
		setMeetings((prevMeetings) =>
			prevMeetings.filter((meeting) => meeting.id !== meetingId),
		);
		const res = await fetch(`/api/meetings/${meetingId}`, {
			method: 'DELETE',
		});

		const data = await res.json();
		if (data.error) {
			console.error('Error deleting meeting:', data.error);
		}

		setSelectedMeeting(null);
	};

	return (
		<SidebarProvider>
			<div className="flex flex-col h-screen overflow-hidden">
				<header className="flex h-16 items-center gap-4 border-b bg-background px-6">
					<AppSidebar
						onSelectMeeting={setSelectedMeeting}
						meetings={meetings}
						loading={loading}
					/>
					<DashboardHeader setMeetings={setMeetings} meetings={meetings} />
				</header>
				{selectedMeeting ? (
					<main className="flex-grow overflow-auto p-6 space-y-6">
						<MeetingInfo
							meeting={selectedMeeting}
							onMeetingDelete={onMeetingDelete}
						/>
						{!videoUrl ? (
							<VideoPlayerPlaceholder>
								<p className="text-muted-foreground">No video available</p>
							</VideoPlayerPlaceholder>
						) : (
							<VideoPlayer src={videoUrl} />
						)}
						<Tabs defaultValue="transcript" className="w-full">
							<TabsList className="w-full justify-start">
								<TabsTrigger value="transcript" className="flex-1">
									Transcript
								</TabsTrigger>
								<TabsTrigger value="summary" className="flex-1">
									Summary
								</TabsTrigger>
							</TabsList>
							<TabsContent value="transcript" className="mt-4">
								<TranscriptViewer transcript={selectedMeeting?.transcript} />
							</TabsContent>
							<TabsContent value="summary" className="mt-4">
								<SummarySection summary={selectedMeeting?.summary} />
							</TabsContent>
						</Tabs>
					</main>
				) : (
					<div className="text-center text-muted-foreground">
						<p className="text-lg mb-4">
							Select a meeting from the sidebar to view details.
						</p>
						<Button
							onClick={() => {
								const sidebarButton = document.querySelector(
									'button[aria-label="Open sidebar"]',
								);
								if (sidebarButton instanceof HTMLButtonElement) {
									sidebarButton.click();
								}
							}}
						>
							View Meetings
						</Button>
					</div>
				)}
			</div>
		</SidebarProvider>
	);
}
