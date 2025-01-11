import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';

const tiers = [
	{
		name: 'Free',
		price: '$0',
		description: 'For small teams or individuals testing the platform',
		features: [
			'2 meetings (up to 60 minutes each)',
			'Basic video recording and transcript generation',
			'Limited cloud storage (2 GB)',
			'Access to summary and action item generation for 3 meetings',
			'Community support',
		],
	},
	{
		name: 'Pro',
		price: '$25',
		description:
			'For small businesses and teams needing consistent meeting management tools',
		features: [
			'50 meetings per month (up to 2 hours each)',
			'Unlimited transcript generation and summaries',
			'Cloud storage up to 50 GB',
			'Calendar integration for automated scheduling and reminders',
			'Priority email support',
		],
	},
	{
		name: 'Business',
		price: '$75',
		description:
			'For growing organizations requiring advanced analytics and integrations',
		features: [
			'Unlimited meetings (up to 4 hours each)',
			'Advanced transcription with sentiment analysis and multi-language support',
			'500 GB cloud storage',
			'Detailed analytics dashboards',
			'API access for custom workflows',
			'24/7 premium support',
		],
	},
];

export function PricingSection() {
	return (
		<section className="py-20 bg-gray-50">
			<div className="container mx-auto px-4 text-white">
				<h2 className="font-bold text-xl text-center mb-12 leading-tight">
					Simple, Transparent Pricing
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{tiers.map((tier) => (
						<Card key={tier.name} className="flex flex-col">
							<CardHeader>
								<CardTitle className="text-2xl">{tier.name}</CardTitle>
								<CardDescription>
									<span className="text-3xl font-bold">{tier.price}</span>
									{tier.price !== 'Custom' && (
										<span className="text-sm">/month per user</span>
									)}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex-grow">
								<p className="text-sm mb-4">{tier.description}</p>
								<ul className="space-y-2">
									{tier.features.map((feature, index) => (
										<li key={index} className="flex items-center">
											<Check className="h-5 w-5 text-white mr-2" />
											<span className="text-sm">{feature}</span>
										</li>
									))}
								</ul>
							</CardContent>
							<CardFooter>
								<Button
									className="w-full"
									variant={tier.name === 'Pro' ? 'default' : 'outline'}
									asChild
								>
									<a href="/early-access">
										{tier.name === 'Free' ? 'Get Started' : 'Choose Plan'}
									</a>
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
				<div className="text-center mt-12">
					<p className="text-lg mb-4">
						Need a custom solution for your enterprise?
					</p>
					<Button variant="outline" size="lg" asChild>
						<Link href="/contact" passHref>
							Contact Sales
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
