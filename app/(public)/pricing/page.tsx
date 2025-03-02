import { Metadata } from 'next';
import { PricingTiers } from './components/pricing-tiers';
import { AddOnServices } from './components/add-on-services';
import { FreeTrial } from './components/free-trial';
import { PricingFAQ } from './components/pricing-faq';

export const metadata: Metadata = {
	title: 'Pricing | NoteMeet',
	description:
		"Explore NoteMeet's flexible pricing plans designed to fit teams of all sizes.",
};

export default function PricingPage() {
	return (
		<div className="bg-[#0a4a4e] min-h-screen">
			{/* Decorative background elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-[20%] left-[10%] w-72 h-72 bg-[#63d392]/5 rounded-full blur-[100px]"></div>
				<div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#156469]/20 rounded-full blur-[100px]"></div>
			</div>

			<div className="container mx-auto px-4 py-24 text-white relative z-10">
				<div className="text-center mb-16">
					<div className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-6">
						Pricing Plans
					</div>
					<h1 className="text-4xl md:text-5xl font-bold mb-8">
						Simple,{' '}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#63d392] to-[#8ae9b3]">
							Transparent
						</span>{' '}
						Pricing
					</h1>
					<p className="text-xl text-gray-300 max-w-2xl mx-auto">
						Choose the perfect plan for your team. All plans include our core
						features with varying usage limits and support levels.
					</p>
				</div>

				<PricingTiers />

				<div className="mt-24 mb-24">
					<AddOnServices />
				</div>

				<div className="mb-24">
					<FreeTrial />
				</div>

				<div className="mb-16">
					<PricingFAQ />
				</div>
			</div>
		</div>
	);
}
