import { MeetingHeader } from '@/components/dashboard/meeting-header';
import { MeetingFooter } from '@/components/meeting-footer';
import { useAppSelector } from '@/lib/redux/hooks';

export default function MeetingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { meetings, selectedMeeting, loading } = useAppSelector(
		(state) => state.meetings,
	);

	return (
		<div className="flex flex-col min-h-screen">
			<MeetingHeader
				meeting={selectedMeeting}
				showShareButton={meetings.length > 0 && !loading}
			/>
			<main className="flex-grow">{children}</main>
			<MeetingFooter />
		</div>
	);
}
