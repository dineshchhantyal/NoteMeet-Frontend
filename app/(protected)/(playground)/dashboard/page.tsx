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
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	const [meetings, setMeetings] = useState<MeetingInterface[]>([]);
	useEffect(() => {
		const fetchMeetings = async () => {
			try {
				const response = await fetch('/api/meetings');
				const data = await response.json();
				setMeetings(data.data);
			} catch (error) {
				console.error('Error fetching meetings:', error);
			}
		};

		fetchMeetings();
	}, []);

	return (
		<SidebarProvider defaultOpen={true} open={!isSidebarCollapsed}>
			<div className="flex h-screen">
				<AppSidebar
					onSelectMeeting={setSelectedMeeting}
					isCollapsed={isSidebarCollapsed}
					meetings={meetings}
				/>
				<SidebarInset className="flex flex-col">
					<DashboardHeader
						isSidebarCollapsed={isSidebarCollapsed}
						setIsSidebarCollapsed={setIsSidebarCollapsed}
						setMeetings={setMeetings}
						meetings={meetings}
					/>
					<main className="flex-grow overflow-auto p-6 space-y-6">
						{selectedMeeting ? (
							<>
								<MeetingInfo meeting={selectedMeeting} />
								{!selectedMeeting.recordingUrl ? (
									<VideoPlayerPlaceholder>
										<p className="text-muted-foreground">No video available</p>
									</VideoPlayerPlaceholder>
								) : (
									<VideoPlayer src={selectedMeeting.recordingUrl} />
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
										<TranscriptViewer
											transcript={selectedMeeting?.transcript}
										/>
									</TabsContent>
									<TabsContent value="summary" className="mt-4">
										<SummarySection summary={selectedMeeting?.summary} />
									</TabsContent>
								</Tabs>
							</>
						) : (
							<div className="text-center text-muted-foreground">
								<p className="text-lg mb-4">
									Select a meeting from the sidebar to view details.
								</p>
								<Button onClick={() => setIsSidebarCollapsed(false)}>
									{isSidebarCollapsed ? 'Expand Sidebar' : 'View Meetings'}
								</Button>
							</div>
						)}
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
