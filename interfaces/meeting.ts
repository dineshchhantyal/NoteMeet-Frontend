import { Summary } from './summary';

export interface Meeting {
	id: string;
	title: string;
	date: string;
	duration: string;
	recordingUrl?: string;
	transcript?: string;
	summary?: Summary;
	status?: 'Completed' | 'Scheduled' | 'In Progress';
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
