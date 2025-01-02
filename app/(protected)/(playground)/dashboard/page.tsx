'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from './components/app-sidebar';
import { MeetingInfo } from './components/meeting-info';
import { VideoPlayer } from './components/video-player';
import { TranscriptViewer } from './components/transcript-viewer';
import { SummarySection } from './components/summary-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MeetingInterface } from '@/types';
import { VideoPlayerPlaceholder } from './components/video-player-placeholder';
import DashboardHeader from './components/dashboard-header';
import { NewMeetingDialog } from './components/new-meeting-dialog';

export default function DashboardPage() {
	const [selectedMeeting, setSelectedMeeting] =
		useState<MeetingInterface | null>(null);
	const [loading, setLoading] = useState(true);
	const [sources, setSources] = useState<
		{
			src: { url: string; expiresAt: string };
			type: string;
		}[]
	>([]);

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
					console.log('data', data.sources);
					setSources(data.sources);
				} catch (error) {
					console.error('Error fetching video url:', error);
				}
			};

			fetchVideoUrl();
		} else setSources([]);
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

	const handleMeetingCreated = (newMeeting: MeetingInterface) => {
		setMeetings([...meetings, newMeeting]);
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
					<DashboardHeader handleMeetingCreated={handleMeetingCreated} />
				</header>
				{selectedMeeting ? (
					<main className="flex-grow overflow-auto p-6 space-y-6">
						<MeetingInfo
							meeting={selectedMeeting}
							onMeetingDelete={onMeetingDelete}
						/>
						{!sources.length ? (
							<VideoPlayerPlaceholder>
								<p className="text-muted-foreground">No video available</p>
							</VideoPlayerPlaceholder>
						) : (
							<VideoPlayer sources={sources} />
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
					<div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50 rounded-lg shadow-md">
						<p className="text-xl font-semibold text-gray-800 mb-4">
							Select a meeting from the sidebar to view details.
						</p>
						{loading ? (
							<p className="text-gray-600">Loading...</p>
						) : (
							<>
								<p className="mt-4 mb-2 text-gray-600">
									If you don&apos;t see any meetings, consider creating one!
								</p>
								<NewMeetingDialog onMeetingCreated={handleMeetingCreated} />
							</>
						)}
					</div>
				)}
			</div>
		</SidebarProvider>
	);
}
