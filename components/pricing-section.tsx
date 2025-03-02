'use client';
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
import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

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
		popular: false,
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
		popular: true,
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
		popular: false,
	},
];

export function PricingSection({
	onSelectPlan,
	onContactSales,
}: {
	onSelectPlan?: (planId: string) => void;
	onContactSales?: () => void;
}) {
	return (
		<section className="py-20 bg-[#0c5054]">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
						Simple, <span className="text-[#63d392]">Transparent</span> Pricing
					</h2>
					<p className="text-gray-300 max-w-2xl mx-auto">
						Choose the plan that fits your needs. All plans include core
						NoteMeet features.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
					{tiers.map((tier, index) => (
						<motion.div
							key={tier.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
							className="relative"
						>
							{tier.popular && (
								<div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#63d392] text-[#0a4a4e] px-4 py-1 rounded-full text-sm font-medium z-10 flex items-center">
									<Star className="w-4 h-4 mr-1" /> Most Popular
								</div>
							)}
							<Card
								className={`flex flex-col h-full overflow-hidden border border-[#63d392]/30 ${tier.popular ? 'bg-[#156469]/80' : 'bg-[#156469]/40'} backdrop-blur-sm`}
							>
								<CardHeader
									className={`${tier.popular ? 'border-b border-[#63d392]/30 pb-6' : ''}`}
								>
									<CardTitle className="text-2xl font-bold text-white">
										{tier.name}
									</CardTitle>
									<CardDescription className="text-gray-300">
										<span className="text-3xl text-[#63d392] font-bold">
											{tier.price}
										</span>
										{tier.price !== 'Custom' && (
											<span className="text-sm text-gray-300">
												/month per user
											</span>
										)}
									</CardDescription>
									<p className="text-sm text-gray-300 mt-2">
										{tier.description}
									</p>
								</CardHeader>
								<CardContent className="flex-grow pt-6">
									<ul className="space-y-3">
										{tier.features.map((feature, index) => (
											<li key={index} className="flex items-start">
												<div className="mt-1 mr-3 p-1 rounded-full bg-[#63d392]/20">
													<Check className="h-4 w-4 text-[#63d392]" />
												</div>
												<span className="text-sm text-gray-300">{feature}</span>
											</li>
										))}
									</ul>
								</CardContent>
								<CardFooter className="pt-4">
									<Button
										className={`w-full group transition-all duration-300 ${
											tier.popular
												? 'bg-[#63d392] text-[#0a4a4e] hover:bg-[#4fb87a]'
												: 'bg-transparent border border-[#63d392] text-[#63d392] hover:bg-[#63d392]/10'
										}`}
										onClick={() => onSelectPlan?.(tier.name)}
									>
										{tier.name === 'Free' ? 'Get Started' : 'Choose Plan'}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 7l5 5m0 0l-5 5m5-5H6"
											/>
										</svg>
									</Button>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</div>

				<motion.div
					className="text-center mt-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					viewport={{ once: true }}
				>
					<p className="text-lg mb-4 text-gray-300">
						Need a custom solution for your enterprise?
					</p>
					<Button
						variant="outline"
						size="lg"
						onClick={onContactSales}
						className="border-[#63d392] text-[#63d392] hover:bg-[#63d392] hover:text-[#0a4a4e]"
					>
						Contact Sales for Enterprise
					</Button>
				</motion.div>
			</div>
		</section>
	);
}
