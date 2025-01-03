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

interface PricingTier {
	name: string;
	price: string;
	description: string;
	features: string[];
	isPopular?: boolean;
}

const tiers: PricingTier[] = [
	{
		name: 'Free',
		price: '$0',
		description: 'For small teams or individuals testing the platform',
		features: [
			'2 meetings (up to 60 minutes each)',
			'Basic video recording and transcript generation',
			'Limited cloud storage (2 GB)',
			'Access to summary and action item generation for 2 meetings',
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
		isPopular: true,
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

export function PricingTiers() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
			{tiers.map((tier) => (
				<Card
					key={tier.name}
					className={`flex flex-col ${tier.isPopular ? 'border-primary shadow-lg' : ''}`}
				>
					<CardHeader>
						<CardTitle className="text-2xl">{tier.name}</CardTitle>
						<CardDescription>
							<span className="text-3xl font-bold">{tier.price}</span>
							{tier.price !== 'Custom' && (
								<span className="text-sm">/month</span>
							)}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-grow">
						<p className="text-sm text-muted-foreground mb-4">
							{tier.description}
						</p>
						<ul className="space-y-2">
							{tier.features.map((feature, index) => (
								<li key={index} className="flex items-center">
									<Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
									<span className="text-sm">{feature}</span>
								</li>
							))}
						</ul>
					</CardContent>
					<CardFooter>
						<Button
							className="w-full"
							variant={tier.isPopular ? 'default' : 'outline'}
						>
							{tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
						</Button>
					</CardFooter>
					{tier.isPopular && (
						<div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
							Most Popular
						</div>
					)}
				</Card>
			))}
		</div>
	);
}
