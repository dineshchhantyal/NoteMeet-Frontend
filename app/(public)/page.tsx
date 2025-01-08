'use client';
import { HeroSection } from '@/components/hero-section';
import { WhyNoteMeet } from '@/components/why-notemeet';
import { KeyFeatures } from '@/components/key-features';
import { InteractiveHowItWorks } from '@/components/home/how-it-works';
import BrowserExtension from '@/components/home/browser-extension';
import BrowserSupport from '@/components/home/browser-support';
import { PricingSection } from '@/components/pricing-section';
import { CustomerTestimonials } from '@/components/customer-testimonials';
import { ProductDemo } from '@/components/product-demo';
import { IntegrationsHighlight } from '@/components/integrations-highlight';

export default function HomePage() {
	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-grow">
				<HeroSection />
				<KeyFeatures />
				<WhyNoteMeet />
				<InteractiveHowItWorks />
				<BrowserExtension />
				<BrowserSupport />
				<PricingSection />
				<CustomerTestimonials />
				<ProductDemo />
				<IntegrationsHighlight />
			</main>
		</div>
	);
}
