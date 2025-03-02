'use client';
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
	return (
		<div className="flex flex-col min-h-screen overflow-x-hidden">
			<main className="flex-grow">
				<motion.div
					initial="hidden"
					animate="visible"
					variants={containerVariants}
				>
					<motion.div variants={itemVariants}>
						<HeroSection />
					</motion.div>

					{/* Core Feature Showcase - New Component */}
					<motion.div variants={itemVariants}>
						<FeatureShowcase />
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
						<PricingSection />
					</motion.div>

					<motion.div variants={itemVariants} className="scroll-reveal">
						<CustomerTestimonials />
					</motion.div>

					<motion.div variants={itemVariants} className="scroll-reveal">
						<ProductDemo />
					</motion.div>

					<motion.div variants={itemVariants} className="scroll-reveal">
						<IntegrationsHighlight />
					</motion.div>
				</motion.div>
			</main>
		</div>
	);
}
