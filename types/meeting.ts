import { Summary } from './summary';

export interface Meeting {
	id: string;
	title: string;
	date: string;
	duration: string;
	videoKey?: string;
	transcriptKey?: string;
	transcriptUrl?: string;
	summary?: Summary;
	status?: MeetingStatus;
	time: string;
	timezone?: string;
	description?: string;
	provider: 'zoom' | 'teams' | 'google-meet';
	meetingLink: string;
	participants: string[];
	notifications: {
		sendTranscript: boolean;
		sendSummary: boolean;
	};
}
export enum MeetingStatus {
	Scheduled = 1,
	InProgress = 2,
	Transcoding = 3,
	Transcring = 4,
	Completed = 5,
	Cancelled = 6,
}
