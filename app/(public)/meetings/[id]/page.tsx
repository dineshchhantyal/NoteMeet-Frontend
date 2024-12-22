import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoPlayer } from '@/components/video-player';
import { TranscriptViewer } from '@/components/transcript-viewer';
import { SummarySection } from '@/components/summary-section';

export default function MeetingPage({ params }: { params: { id: string } }) {
	// In a real application, you would fetch the meeting data based on the ID
	const meetingData = {
		id: params.id,
		title: 'Project Kickoff Meeting',
		date: '2024-03-20',
		time: '10:00 AM',
		duration: '1 hour',
		participants: ['John Doe', 'Jane Smith', 'Mike Johnson'],
		videoUrl: 'https://example.com/meeting-recording.mp4',
		transcript: 'This is a sample transcript of the meeting...',
		summary: {
			keyTopics: ['Project goals', 'Timeline', 'Resource allocation'],
			actionItems: [
				'Create project plan',
				'Schedule follow-up meetings',
				'Assign team roles',
			],
			sentiment: 'Positive and productive discussion',
		},
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">{meetingData.title}</h1>
			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Meeting Details</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						<strong>Date:</strong> {meetingData.date}
					</p>
					<p>
						<strong>Time:</strong> {meetingData.time}
					</p>
					<p>
						<strong>Duration:</strong> {meetingData.duration}
					</p>
					<p>
						<strong>Participants:</strong> {meetingData.participants.join(', ')}
					</p>
				</CardContent>
			</Card>

			<VideoPlayer src={meetingData.videoUrl} />

			<Tabs defaultValue="transcript" className="mt-8">
				<TabsList>
					<TabsTrigger value="transcript">Transcript</TabsTrigger>
					<TabsTrigger value="summary">Summary</TabsTrigger>
				</TabsList>
				<TabsContent value="transcript">
					<TranscriptViewer transcript={meetingData.transcript} />
				</TabsContent>
				<TabsContent value="summary">
					<SummarySection summary={meetingData.summary} />
				</TabsContent>
			</Tabs>

			<div className="mt-8 flex justify-end space-x-4">
				<Button variant="outline">Share Meeting</Button>
				<Button>Download Report</Button>
			</div>
		</div>
	);
}
