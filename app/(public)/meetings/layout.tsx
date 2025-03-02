import { MeetingHeader } from '@/components/dashboard/meeting-header';
import { MeetingFooter } from '@/components/meeting-footer';

export default function MeetingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen">
			<MeetingHeader />
			<main className="flex-grow">{children}</main>
			<MeetingFooter />
		</div>
	);
}
