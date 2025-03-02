'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

export function PricingTiers() {
	const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
		'annual',
	);

	const tiers = [
		{
			name: 'Starter',
			description: 'Perfect for small teams and individuals',
			monthlyPrice: 19,
			annualPrice: 15,
			features: [
				'Up to 10 meetings per month',
				'60-minute recording limit per meeting',
				'Basic transcription',
				'Meeting summaries',
				'Email support',
			],
			highlight: false,
			ctaText: 'Get Started',
		},
		{
			name: 'Professional',
			description: 'Ideal for growing teams and departments',
			monthlyPrice: 49,
			annualPrice: 39,
			features: [
				'Up to 50 meetings per month',
				'No recording time limit',
				'Advanced transcription with speaker identification',
				'AI-powered action items & insights',
				'Meeting analytics',
				'Priority email support',
				'API access',
			],
			highlight: true,
			ctaText: 'Most Popular',
			badge: 'RECOMMENDED',
		},
		{
			name: 'Enterprise',
			description: 'For organizations with advanced needs',
			monthlyPrice: 99,
			annualPrice: 79,
			features: [
				'Unlimited meetings',
				'No recording time limit',
				'Advanced transcription with speaker identification',
				'AI-powered action items & insights',
				'Advanced analytics & reporting',
				'Dedicated account manager',
				'Custom integrations',
				'Enterprise SSO',
				'Admin controls',
			],
			highlight: false,
			ctaText: 'Contact Sales',
		},
	];

	return (
		<div>
			{/* Billing toggle */}
			<div className="flex justify-center mb-12">
				<div className="bg-[#156469]/40 backdrop-blur-sm p-1 rounded-full inline-flex">
					<button
						className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
							billingCycle === 'monthly'
								? 'bg-[#63d392] text-[#0a4a4e]'
								: 'text-gray-300 hover:text-white'
						}`}
						onClick={() => setBillingCycle('monthly')}
					>
						Monthly
					</button>
					<button
						className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
							billingCycle === 'annual'
								? 'bg-[#63d392] text-[#0a4a4e]'
								: 'text-gray-300 hover:text-white'
						}`}
						onClick={() => setBillingCycle('annual')}
					>
						Annual{' '}
						<span className="text-xs font-normal opacity-80">(20% off)</span>
					</button>
				</div>
			</div>

			{/* Pricing tiers */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<TooltipProvider>
					{tiers.map((tier, idx) => (
						<motion.div
							key={tier.name}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: idx * 0.1 }}
							className={`${
								tier.highlight
									? 'bg-gradient-to-b from-[#156469] to-[#0d5559] border-[#63d392]/50 shadow-xl shadow-[#63d392]/10'
									: 'bg-[#156469]/30 backdrop-blur-sm border-[#156469]/50'
							} rounded-xl border p-6 relative`}
						>
							{tier.badge && (
								<div className="absolute -top-3 right-6 bg-[#63d392] text-[#0a4a4e] text-xs font-bold py-1 px-3 rounded-full">
									{tier.badge}
								</div>
							)}

							<h3 className="text-2xl font-semibold text-white mb-2">
								{tier.name}
							</h3>
							<p className="text-gray-300 mb-6">{tier.description}</p>

							<div className="mb-6">
								<div className="flex items-end">
									<span className="text-4xl font-bold text-white">
										$
										{billingCycle === 'monthly'
											? tier.monthlyPrice
											: tier.annualPrice}
									</span>
									<span className="text-gray-300 ml-2 mb-1">/month</span>
								</div>
								{billingCycle === 'annual' && (
									<p className="text-[#63d392] text-sm mt-1">
										Billed annually (${tier.annualPrice * 12}/year)
									</p>
								)}
							</div>

							<hr className="border-[#63d392]/20 my-6" />

							<ul className="space-y-3 mb-8">
								{tier.features.map((feature, i) => (
									<li key={i} className="flex items-start">
										<Check className="h-5 w-5 text-[#63d392] mr-2 flex-shrink-0 mt-0.5" />
										<span className="text-gray-300">{feature}</span>
									</li>
								))}
							</ul>

							<div className="mt-auto">
								<Button
									className={`w-full ${
										tier.highlight
											? 'bg-[#63d392] text-[#0a4a4e] hover:bg-[#4fb87a]'
											: 'bg-[#0d5559] text-white hover:bg-[#0a4a4e] border border-[#63d392]/30'
									}`}
								>
									{tier.ctaText}
								</Button>
							</div>
						</motion.div>
					))}
				</TooltipProvider>
			</div>

			<div className="text-center mt-8 text-gray-300">
				<p>All plans come with a 14-day free trial. No credit card required.</p>
			</div>
		</div>
	);
}
