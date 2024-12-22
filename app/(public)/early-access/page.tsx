import { Metadata } from 'next';
import { EarlyAccessForm } from '@/components/early-access-form';

export const metadata: Metadata = {
	title: 'Early Access | NoteMeet',
	description:
		'Apply for early access to NoteMeet and experience the future of meeting management.',
};

export default function EarlyAccessPage() {
	return (
		<div className="container mx-auto px-4 py-16">
			<h1 className="text-4xl font-bold mb-8 text-center text-primary">
				Apply for Early Access
			</h1>
			<div className="max-w-2xl mx-auto">
				<p className="text-lg mb-8 text-center">
					Be among the first to experience NoteMeet&apos;s revolutionary meeting
					management platform. Fill out the form below to apply for early access
					and help shape the future of productive meetings.
				</p>
				<EarlyAccessForm />
			</div>
		</div>
	);
}
