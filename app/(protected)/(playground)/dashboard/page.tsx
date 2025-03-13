'use client';

import { useEffect } from 'react';
import {
	Menu,
	FileText,
	VideoIcon,
	FileBarChart2,
	Loader2,
	MessageSquare,
	PanelRight,
	PanelLeft,
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Redux
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
	fetchMeetings,
	selectMeeting,
	deleteMeeting,
	setMeetings,
} from '@/lib/redux/features/meetings/meetingsSlice';

// Dashboard Components
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { MeetingInfo } from '@/components/dashboard/meeting-info';
import { VideoPlayer } from '@/components/dashboard/video-player';
import { TranscriptViewer } from '@/components/dashboard/transcript-viewer';
import { SummarySection } from '@/components/dashboard/summary-section';
import { ActionItemsTracker } from '@/components/dashboard/action-items-tracker';
import { AIMeetingAssistant } from '@/components/chat/ai-meeting-assistant';
import { MeetingAnalytics } from '@/components/dashboard/meeting-analytics';
import { VideoPlayerPlaceholder } from '@/components/dashboard/video-player-placeholder';
import { NewMeetingDialog } from '@/components/dashboard/new-meeting-dialog';

// Types
import { MeetingInterface } from '@/types';
import { MeetingStatus } from '@/types/meeting';
import { useState } from 'react';
import { VideoTranscriptResponse } from '@/types/video-transcript';
import DashboardHeader from '@/components/dashboard/dashboard-header';

export default function DashboardPage() {
	const dispatch = useAppDispatch();
	const { meetings, selectedMeeting, loading } = useAppSelector(
		(state) => state.meetings,
	);

	const [loadingTranscript, setLoadingTranscript] = useState(false);
	const [loadingVideo, setLoadingVideo] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [rightPanelOpen, setRightPanelOpen] = useState(true);
	const [sources, setSources] = useState<
		{ src: { url: string; expiresAt: string }; type: string }[]
	>([]);
	const [transcript, setTranscript] = useState<VideoTranscriptResponse | null>(
		null,
	);

	// Fetch meetings on component mount
	useEffect(() => {
		dispatch(fetchMeetings());
	}, [dispatch]);

	// Handle video and transcript fetching when a meeting is selected
	useEffect(() => {
		if (
			selectedMeeting &&
			selectedMeeting.videoKey &&
			selectedMeeting.status &&
			selectedMeeting.status > MeetingStatus.InProgress
		) {
			const fetchVideoUrl = async () => {
				setLoadingVideo(true);
				try {
					const response = await fetch(
						`/api/meetings/${selectedMeeting.id}/presigned-url`,
					);
					const data = await response.json();
					setSources(data.sources);
				} catch (error) {
					console.error('Error fetching video url:', error);
				} finally {
					setLoadingVideo(false);
				}
			};

			fetchVideoUrl();
		} else setSources([]);

		if (selectedMeeting && selectedMeeting.transcriptKey) {
			const fetchTranscript = async () => {
				setLoadingTranscript(true);
				try {
					const response = await fetch(
						`/api/meetings/${selectedMeeting.id}/transcript`,
					);
					const data = await response.json();
					setTranscript(data.transcript ? JSON.parse(data.transcript) : null);
				} catch (error) {
					console.error('Error fetching transcript:', error);
				} finally {
					setLoadingTranscript(false);
				}
			};

			fetchTranscript();
		} else {
			setTranscript(null);
		}
	}, [selectedMeeting]);

	const onMeetingDelete = async (meetingId: string) => {
		dispatch(deleteMeeting(meetingId));
	};

	const handleMeetingCreated = (newMeeting: MeetingInterface) => {
		dispatch(setMeetings([...meetings, newMeeting]));
		dispatch(selectMeeting(newMeeting));
	};

	return (
		<div className="flex h-screen bg-[#0a4a4e] overflow-hidden">
			{/* Background gradient elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
				<div className="absolute top-[10%] left-[5%] w-96 h-96 bg-[#63d392]/5 rounded-full blur-[120px]"></div>
				<div className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] bg-[#156469]/20 rounded-full blur-[150px]"></div>
				<div className="absolute top-[40%] right-[15%] w-64 h-64 bg-[#63d392]/8 rounded-full blur-[100px]"></div>
			</div>

			<AppSidebar
				onSelectMeeting={(meeting) => dispatch(selectMeeting(meeting))}
				meetings={meetings}
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				selectedMeeting={selectedMeeting}
				loading={loading} // Pass the loading state from Redux
			/>

			<div className="flex flex-1 flex-col overflow-hidden relative z-10">
				<header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-[#63d392]/20 bg-[#0d5559]/85 backdrop-blur-md px-6 shadow-md">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="md:hidden text-white hover:bg-[#156469]/50 focus:ring-1 focus:ring-[#63d392]/30"
						aria-label="Toggle sidebar"
					>
						<Menu className="h-5 w-5" />
					</Button>

					<DashboardHeader handleMeetingCreated={handleMeetingCreated} />
				</header>

				{selectedMeeting ? (
					<main className="flex flex-1 overflow-hidden">
						<div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
							<MeetingInfo
								meeting={selectedMeeting}
								onMeetingDelete={onMeetingDelete}
							/>

							<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-4 overflow-hidden transition-all shadow-md">
								{loadingVideo ? (
									<VideoPlayerPlaceholder>
										<div className="flex flex-col items-center justify-center p-8">
											<div className="bg-[#0d5559]/70 p-4 rounded-full mb-4 animate-pulse">
												<Loader2 className="h-8 w-8 text-[#63d392]/80 animate-spin" />
											</div>
											<p className="text-gray-200">Loading video...</p>
										</div>
									</VideoPlayerPlaceholder>
								) : !sources.length ? (
									<VideoPlayerPlaceholder>
										<div className="flex flex-col items-center justify-center p-8">
											<div className="bg-[#0d5559]/70 p-4 rounded-full mb-4">
												<VideoIcon className="h-8 w-8 text-[#63d392]/80" />
											</div>
											<p className="text-gray-200">
												Video is processing or unavailable
											</p>
										</div>
									</VideoPlayerPlaceholder>
								) : (
									<VideoPlayer sources={sources} />
								)}
							</div>

							<Tabs defaultValue="transcript" className="w-full">
								<TabsList className="w-full justify-start bg-[#0d5559]/80 p-1 rounded-lg shadow-inner">
									<TabsTrigger
										value="transcript"
										className="flex-1 data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white hover:bg-[#156469]/50 transition-colors"
									>
										<FileText className="h-4 w-4 mr-2" />
										Transcript
									</TabsTrigger>
									<TabsTrigger
										value="summary"
										className="flex-1 data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white hover:bg-[#156469]/50 transition-colors"
									>
										<FileBarChart2 className="h-4 w-4 mr-2" />
										Summary
									</TabsTrigger>
									<TabsTrigger
										value="ai-assistant"
										className="flex-1 data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-white hover:bg-[#156469]/50 transition-colors"
									>
										<MessageSquare className="h-4 w-4 mr-2" />
										AI Assistant
									</TabsTrigger>
								</TabsList>

								<TabsContent value="transcript" className="mt-4">
									<div
										className={cn(
											'bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 transition-all shadow-md',
											loadingTranscript && 'animate-pulse',
										)}
									>
										{loadingTranscript ? (
											<div className="flex flex-col items-center justify-center py-8">
												<Loader2 className="h-8 w-8 text-[#63d392]/60 animate-spin mb-2" />
												<p className="text-gray-300">Loading transcript...</p>
											</div>
										) : (
											<TranscriptViewer transcript={transcript ?? null} />
										)}
									</div>
								</TabsContent>

								<TabsContent value="summary" className="mt-4">
									<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 transition-all shadow-md">
										<SummarySection
											summary={
												selectedMeeting?.summary
													? JSON.parse(selectedMeeting.summary as string)
													: null
											}
											isLoading={loadingTranscript}
										/>
									</div>
								</TabsContent>

								<TabsContent value="ai-assistant" className="mt-4">
									<AIMeetingAssistant meeting={selectedMeeting} />
								</TabsContent>
							</Tabs>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<ActionItemsTracker meeting={selectedMeeting} />
								<MeetingAnalytics meeting={selectedMeeting} />
							</div>
						</div>

						{/* Right Panel Toggle Button (Mobile) */}
						<div className="md:hidden absolute right-4 bottom-4 z-30">
							<Button
								variant="outline"
								size="icon"
								onClick={() => setRightPanelOpen(!rightPanelOpen)}
								className="rounded-full h-12 w-12 bg-[#156469] border-[#63d392]/30 text-white shadow-lg hover:bg-[#0d5559]"
							>
								{rightPanelOpen ? (
									<PanelRight className="h-5 w-5 text-[#63d392]" />
								) : (
									<PanelLeft className="h-5 w-5 text-[#63d392]" />
								)}
							</Button>
						</div>
					</main>
				) : (
					<div className="flex flex-col items-center justify-center h-full p-6 text-white">
						<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-8 max-w-md w-full text-center shadow-lg transition-all hover:shadow-[#63d392]/10">
							<div className="bg-[#63d392]/10 p-5 rounded-full mx-auto mb-6 w-20 h-20 flex items-center justify-center shadow-inner">
								<FileText className="h-10 w-10 text-[#63d392]" />
							</div>

							<h2 className="text-2xl font-semibold mb-4">
								No Meeting Selected
							</h2>

							{loading ? (
								<div className="space-y-3">
									<Skeleton className="h-4 w-3/4 mx-auto bg-[#0d5559] animate-pulse" />
									<Skeleton className="h-4 w-1/2 mx-auto bg-[#0d5559] animate-pulse" />
									<Skeleton className="h-9 w-40 mx-auto mt-6 bg-[#0d5559] rounded-md animate-pulse" />
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
