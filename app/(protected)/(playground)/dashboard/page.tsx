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
import { Menu, FileText, VideoIcon } from 'lucide-react';
import { MeetingStatus } from '@/types/meeting';
import { VideoTranscriptResponse } from '@/types/video-transcript';
import { Skeleton } from '@/components/ui/skeleton';

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
		<div className="flex h-screen bg-[#0a4a4e] overflow-hidden">
			{/* Background elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-[20%] left-[10%] w-72 h-72 bg-[#63d392]/5 rounded-full blur-[100px]"></div>
				<div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#156469]/20 rounded-full blur-[100px]"></div>
			</div>

			<AppSidebar
				onSelectMeeting={setSelectedMeeting}
				meetings={meetings}
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>
			<div className="flex flex-1 flex-col overflow-hidden relative z-10">
				<header className="flex h-16 items-center gap-4 border-b border-[#63d392]/20 bg-[#0d5559]/80 backdrop-blur-sm px-6 shadow-sm">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="md:hidden text-white hover:bg-[#156469]/50"
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
						<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-4 overflow-hidden">
							{!sources.length ? (
								<VideoPlayerPlaceholder>
									<div className="flex flex-col items-center justify-center p-8">
										<div className="bg-[#0d5559]/50 p-4 rounded-full mb-4">
											<VideoIcon className="h-8 w-8 text-[#63d392]/60" />
										</div>
										<p className="text-gray-300">
											Video is processing or unavailable
										</p>
									</div>
								</VideoPlayerPlaceholder>
							) : (
								<VideoPlayer sources={sources} />
							)}
						</div>

						<Tabs defaultValue="transcript" className="w-full">
							<TabsList className="w-full justify-start bg-[#0d5559]/70">
								<TabsTrigger
									value="transcript"
									className="flex-1 data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white"
								>
									<FileText className="h-4 w-4 mr-2" />
									Transcript
								</TabsTrigger>
								<TabsTrigger
									value="summary"
									className="flex-1 data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white"
								>
									<FileText className="h-4 w-4 mr-2" />
									Summary
								</TabsTrigger>
							</TabsList>
							<TabsContent value="transcript" className="mt-4">
								<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-4">
									<TranscriptViewer transcript={transcript ?? null} />
								</div>
							</TabsContent>
							<TabsContent value="summary" className="mt-4">
								<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-4">
									<SummarySection
										summary={
											selectedMeeting?.summary
												? JSON.parse(selectedMeeting.summary as string)
												: null
										}
									/>
								</div>
							</TabsContent>
						</Tabs>
					</main>
				) : (
					<div className="flex flex-col items-center justify-center h-full p-6 text-white">
						<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-8 max-w-md w-full text-center">
							<div className="bg-[#63d392]/10 p-4 rounded-full mx-auto mb-6 w-20 h-20 flex items-center justify-center">
								<FileText className="h-10 w-10 text-[#63d392]" />
							</div>

							<h2 className="text-2xl font-semibold mb-4">
								No Meeting Selected
							</h2>

							{loading ? (
								<div className="space-y-3">
									<Skeleton className="h-4 w-3/4 mx-auto bg-[#0d5559]" />
									<Skeleton className="h-4 w-1/2 mx-auto bg-[#0d5559]" />
								</div>
							) : (
								<>
									<p className="text-gray-300 mb-6">
										Select a meeting from the sidebar to view details, or create
										a new meeting to get started.
									</p>
									<NewMeetingDialog onMeetingCreated={handleMeetingCreated} />
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
