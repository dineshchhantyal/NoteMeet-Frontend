import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export function FreeTrial() {
	return (
		<Card className="text-center">
			<CardHeader>
				<CardTitle className="text-2xl">Try NoteMeet Pro for Free</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-lg mb-4">
					Experience all Pro Tier features for 14 days, no credit card required.
				</p>
				<ul className="text-sm text-gray-600 space-y-2 mb-6">
					<li>50 meetings per month (up to 2 hours each)</li>
					<li>Unlimited transcript generation and summaries</li>
					<li>Cloud storage up to 50 GB</li>
					<li>Calendar integration</li>
					<li>Priority email support</li>
				</ul>
			</CardContent>
			<CardFooter className="justify-center">
				<Button size="lg" asChild>
					<a href="/early-access">Start Your Free Trial</a>
				</Button>
			</CardFooter>
		</Card>
	);
}
