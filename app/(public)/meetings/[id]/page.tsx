import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoPlayer } from '@/components/video-player';
import { TranscriptViewer } from '@/components/transcript-viewer';
import { SummarySection } from '@/components/summary-section';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, FileText, FileBarChart2 } from 'lucide-react';
import { currentUser } from '@/lib/auth';

async function getMeetingData(id: string) {
	try {
		const user = await currentUser();

		if (!user) {
			throw new Error('Unauthorized');
		}

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_APP_URL}/api/meetings/${id}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
			},
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Failed to fetch meeting');
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching meeting:', error);
		throw error;
	}
}

export default async function MeetingPage({
	params,
}: {
	params: { id: string };
}) {
	let meetingData;

	try {
		meetingData = await getMeetingData(params.id);
	} catch (error) {
		return notFound();
	}

	const formatDate = (dateStr: string) => {
		if (!dateStr) return 'Date not set';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	const formatTime = (timeStr: string) => {
		return timeStr || 'Time not set';
	};

	return (
		<div className="min-h-screen bg-[#0a4a4e] overflow-auto">
			{/* Background gradient elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
				<div className="absolute top-[10%] left-[5%] w-96 h-96 bg-[#63d392]/5 rounded-full blur-[120px]"></div>
				<div className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] bg-[#156469]/20 rounded-full blur-[150px]"></div>
				<div className="absolute top-[40%] right-[15%] w-64 h-64 bg-[#63d392]/8 rounded-full blur-[100px]"></div>
			</div>

			<div className="container mx-auto px-4 py-8 relative z-10">
				<h1 className="text-3xl font-bold mb-6 text-white">
					{meetingData.title}
				</h1>

				<Card className="mb-8 bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20 text-white shadow-lg">
					<CardHeader className="border-b border-[#63d392]/20">
						<CardTitle className="text-[#63d392]">Meeting Details</CardTitle>
					</CardHeader>
					<CardContent className="py-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-[#63d392]" />
									<span className="text-gray-300">Date:</span>
									<span className="text-white">
										{formatDate(meetingData.scheduledAt || meetingData.date)}
									</span>
								</div>

								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-[#63d392]" />
									<span className="text-gray-300">Time:</span>
									<span className="text-white">
										{formatTime(meetingData.scheduledTime || meetingData.time)}
									</span>
								</div>

								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-[#63d392]" />
									<span className="text-gray-300">Duration:</span>
									<span className="text-white">
										{meetingData.duration || 'Not specified'}
									</span>
								</div>
							</div>

							<div>
								<div className="flex items-start gap-2">
									<Users className="h-4 w-4 text-[#63d392] mt-1" />
									<div>
										<span className="text-gray-300">Participants:</span>
										<div className="flex flex-wrap gap-1 mt-1">
											{meetingData.participants?.map(
												(participant: any, idx: number) => (
													<Badge
														key={idx}
														variant="outline"
														className="bg-[#0d5559]/70 border-[#63d392]/30 text-white"
													>
														{participant.user?.name ||
															participant.email ||
															'Unknown'}
													</Badge>
												),
											) ||
												meetingData.participantList?.map(
													(participant: string, idx: number) => (
														<Badge
															key={idx}
															variant="outline"
															className="bg-[#0d5559]/70 border-[#63d392]/30 text-white"
														>
															{participant}
														</Badge>
													),
												) || (
													<span className="text-gray-400">No participants</span>
												)}
										</div>
									</div>
								</div>

								{meetingData.description && (
									<div className="mt-4">
										<span className="text-gray-300">Description:</span>
										<p className="text-white mt-1">{meetingData.description}</p>
									</div>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-4 mb-8 overflow-hidden shadow-md">
					<VideoPlayer
						src={
							meetingData.videoUrl ||
							(meetingData.videoKey
								? `/api/meetings/${meetingData.id}/stream`
								: undefined)
						}
					/>
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
					</TabsList>

					<TabsContent value="transcript" className="mt-4">
						<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-4 shadow-md">
							<TranscriptViewer
								transcript={
									meetingData.transcriptKey
										? `/api/meetings/${meetingData.id}/transcript`
										: meetingData.transcript || 'No transcript available'
								}
							/>
						</div>
					</TabsContent>

					<TabsContent value="summary" className="mt-4">
						<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-4 shadow-md">
							<SummarySection
								summary={
									meetingData.summary
										? typeof meetingData.summary === 'string'
											? JSON.parse(meetingData.summary)
											: meetingData.summary
										: null
								}
							/>
						</div>
					</TabsContent>
				</Tabs>

				<div className="mt-8 flex flex-wrap justify-end gap-4">
					{meetingData.shareToken && (
						<Button
							variant="outline"
							className="border-[#63d392]/30 text-[#63d392] hover:bg-[#0d5559]"
							onClick={() => {
								// This would need client-side logic in a <form> or client component
							}}
						>
							Accept Meeting
						</Button>
					)}

					<Button
						className="bg-[#63d392] text-[#0a4a4e] hover:bg-[#63d392]/80"
						onClick={() => {
							// This would need client-side logic in a <form> or client component
						}}
					>
						Download Report
					</Button>
				</div>
			</div>
		</div>
	);
}
