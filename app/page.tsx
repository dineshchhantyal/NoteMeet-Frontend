"use client";
import { HeroSection } from '@/components/hero-section'
import { WhyNoteMeet } from '@/components/why-notemeet'
import { CustomerTestimonials } from '@/components/customer-testimonials'
import { ProductDemo } from '@/components/product-demo'
import { IntegrationsHighlight } from '@/components/integrations-highlight'
import { KeyFeatures } from '@/components/key-features'
import { PricingSection } from '@/components/pricing-section'
import { Footer } from '@/components/footer'
import { Header } from "@/components/header";

export default function HomePage() {
  

  return (
    <div className="flex flex-col min-h-screen">
      <Header label='Home' />

      <main className="flex-grow">
        <HeroSection />
        <WhyNoteMeet />
        <KeyFeatures />
        <PricingSection />
        <CustomerTestimonials />
        <ProductDemo />
        <IntegrationsHighlight />
      </main>
      <Footer />
    </div>
  )
}
