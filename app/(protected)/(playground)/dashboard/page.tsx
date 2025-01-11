'use client';

import { useEffect, useState } from 'react';
import { AppSidebar } from './components/app-sidebar';
import { MeetingInfo } from './components/meeting-info';
import { VideoPlayer } from './components/video-player';
import { TranscriptViewer } from './components/transcript-viewer';
import { SummarySection } from './components/summary-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MeetingInterface } from '@/types';
import { VideoPlayerPlaceholder } from './components/video-player-placeholder';
import DashboardHeader from './components/dashboard-header';
import { NewMeetingDialog } from './components/new-meeting-dialog';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { MeetingStatus } from '@/types/meeting';
import { VideoTranscriptResponse } from '@/types/video-transcript';

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
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const [transcript, setTranscript] = useState<VideoTranscriptResponse | null>(
		null,
	);

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
		if (
			selectedMeeting &&
			selectedMeeting.videoKey &&
			selectedMeeting.status &&
			selectedMeeting.status > MeetingStatus.InProgress
		) {
			const fetchVideoUrl = async () => {
				try {
					const response = await fetch(
						`/api/meetings/${selectedMeeting.id}/presigned-url`,
					);
					const data = await response.json();
					setSources(data.sources);
				} catch (error) {
					console.error('Error fetching video url:', error);
				}
			};

			fetchVideoUrl();
		} else setSources([]);

		if (selectedMeeting && selectedMeeting.transcriptKey) {
			const fetchTranscript = async () => {
				try {
					const response = await fetch(
						`/api/meetings/${selectedMeeting.id}/transcript`,
					);
					const data = await response.json();

					if (data && data.transcript) console.log(JSON.parse(data.transcript));
					setTranscript(JSON.parse(data.transcript));
				} catch (error) {
					console.error('Error fetching transcript:', error);
				}
			};

			fetchTranscript();
		}
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
		<div className="flex h-screen overflow-hidden">
			<AppSidebar
				onSelectMeeting={setSelectedMeeting}
				meetings={meetings}
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>
			<div className="flex flex-1 flex-col overflow-hidden">
				<header className="flex h-16 items-center gap-4 border-b bg-background px-6">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="md:hidden"
					>
						<Menu className="h-6 w-6" />
					</Button>

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
								<p className="text-gray-600">No video available</p>
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
								<TranscriptViewer transcript={transcript ?? null} />
							</TabsContent>
							<TabsContent value="summary" className="mt-4">
								<SummarySection
									summary={
										selectedMeeting?.summary
											? JSON.parse(selectedMeeting.summary as string)
											: null
									}
								/>
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
		</div>
	);
}
