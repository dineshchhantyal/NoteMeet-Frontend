import { Metadata } from 'next';
import { PricingTiers } from './components/pricing-tiers';
import { AddOnServices } from './components/add-on-services';
import { FreeTrial } from './components/free-trial';
import FAQPage from '../faq/page';

export const metadata: Metadata = {
	title: 'Pricing | NoteMeet',
	description:
		"Explore NoteMeet's flexible pricing plans designed to fit teams of all sizes.",
};

export default function PricingPage() {
	return (
		<div className="bg-gradient-to-b from-primary/10 to-white min-h-screen">
			<div className="container mx-auto px-4 py-16">
				<h1 className="text-4xl md:text-5xl font-bold text-center text-primary mb-4">
					Simple, Transparent Pricing
				</h1>
				<p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
					Choose the perfect plan for your team. All plans include our core
					features with varying usage limits and support levels.
				</p>
				<PricingTiers />
				<AddOnServices />
				<FreeTrial />
				<FAQPage />
			</div>
		</div>
	);
}
