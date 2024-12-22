import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface PricingTier {
	name: string;
	price: string;
	description: string;
	features: string[];
	isPopular?: boolean;
}

const tiers: PricingTier[] = [
	{
		name: 'Starter',
		price: '$19',
		description: 'Perfect for small teams or individuals',
		features: [
			'10 meetings per month',
			'Basic transcription',
			'Meeting summaries',
			'Email support',
			'5 GB storage',
		],
	},
	{
		name: 'Pro',
		price: '$49',
		description: 'For growing teams with advanced needs',
		features: [
			'Unlimited meetings',
			'Advanced AI transcription',
			'Custom AI summaries',
			'Action item extraction',
			'Priority support',
			'50 GB storage',
			'API access',
		],
		isPopular: true,
	},
	{
		name: 'Enterprise',
		price: 'Custom',
		description: 'For large organizations with specific requirements',
		features: [
			'All Pro features',
			'Dedicated account manager',
			'Custom integrations',
			'Advanced analytics',
			'SLA guarantees',
			'Unlimited storage',
			'On-premise deployment option',
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
