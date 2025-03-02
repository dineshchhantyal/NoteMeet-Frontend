'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { HeroSection } from '@/components/hero-section';
import { WhyNoteMeet } from '@/components/why-notemeet';
import { InteractiveHowItWorks } from '@/components/home/how-it-works';
import BrowserExtension from '@/components/home/browser-extension';
import BrowserSupport from '@/components/home/browser-support';
import { PricingSection } from '@/components/pricing-section';
import { CustomerTestimonials } from '@/components/customer-testimonials';
import { ProductDemo } from '@/components/product-demo';
import { IntegrationsHighlight } from '@/components/integrations-highlight';
import { motion } from 'framer-motion';
import { FeatureShowcase } from '@/components/home/feature-showcase';

// Animation variants for staggered children
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.3,
		},
	},
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			duration: 0.6,
			ease: 'easeOut',
		},
	},
};

export default function HomePage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		// Check if we should show the auth message
		const showAuthMessage = searchParams.get('showAuthMessage');
		const prev = searchParams.get('prev');

		if (showAuthMessage === 'true') {
			// Show a toast message
			toast.warning(
				prev?.includes('/invitation')
					? 'Please sign in to view the meeting invitation'
					: 'Please sign in to access that page',
				{
					description: "You'll be redirected after signing in.",
					duration: 5000,
					action: {
						label: 'Sign In',
						onClick: () => {
							// Open your auth modal or redirect to login page
							// You might want to customize this based on your auth flow
							(
								document.querySelector(
									'[data-auth-trigger="login"]',
								) as HTMLElement
							)?.click();
						},
					},
				},
			);

			// clear the search params
			router.replace('/');
		}
	}, [searchParams]);

	// Helper function to handle navigation based on authentication
	const handleNavigation = (path: string) => {
		// You can add auth check logic here if needed
		router.push(path);
	};

	return (
		<div className="flex flex-col min-h-screen overflow-x-hidden">
			<main className="flex-grow">
				<motion.div
					initial="hidden"
					animate="visible"
					variants={containerVariants}
				>
					<motion.div variants={itemVariants}>
						<HeroSection
							onGetStarted={() => {
								// If logged in, go to dashboard, otherwise show sign up dialog
								if (status === 'authenticated') {
									handleNavigation('/dashboard');
								} else {
									// Open login/register dialog
									const authTrigger = document.querySelector(
										'[data-auth-trigger="login"]',
									) as HTMLElement;

									if (authTrigger) {
										authTrigger.click();
									} else {
										handleNavigation('/auth/register');
									}
								}
							}}
							onLogin={() => {
								handleNavigation('/early-access');
							}}
							isLoggedIn={status === 'authenticated'}
						/>
					</motion.div>

					{/* Core Feature Showcase */}
					<motion.div variants={itemVariants}>
						<FeatureShowcase
							onFeatureClick={(featureId) => {
								// Can direct to specific feature documentation or demo pages
								handleNavigation(`/features/${featureId}`);
							}}
						/>
					</motion.div>

					<motion.div variants={itemVariants} className="scroll-reveal">
						<WhyNoteMeet />
					</motion.div>

					<motion.div variants={itemVariants} className="scroll-reveal">
						<InteractiveHowItWorks />
					</motion.div>

					<motion.div variants={itemVariants} className="scroll-reveal">
						<BrowserExtension />
					</motion.div>

					<motion.div variants={itemVariants} className="scroll-reveal">
						<BrowserSupport />
					</motion.div>

					<motion.div variants={itemVariants} className="scroll-reveal">
						<PricingSection
							onSelectPlan={(planId) => handleNavigation(`/pricing/${planId}`)}
							onContactSales={() => handleNavigation('/contact')}
						/>
					</motion.div>

					<motion.div variants={itemVariants} className="scroll-reveal">
						<CustomerTestimonials />
					</motion.div>

					<motion.div variants={itemVariants} className="scroll-reveal">
						<ProductDemo />
					</motion.div>

					<motion.div variants={itemVariants} className="scroll-reveal">
						<IntegrationsHighlight
							onExploreIntegrations={() => handleNavigation('/integrations')}
						/>
					</motion.div>
				</motion.div>
			</main>
		</div>
	);
}
