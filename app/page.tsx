import { LoginButton } from "@/components/auth/login-button";
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroSection } from '@/components/hero-section'
import { WhyNoteMeet } from '@/components/why-notemeet'
import { CustomerTestimonials } from '@/components/customer-testimonials'
import { ProductDemo } from '@/components/product-demo'
import { IntegrationsHighlight } from '@/components/integrations-highlight'
import { KeyFeatures } from '@/components/key-features'
import { PricingSection } from '@/components/pricing-section'
import { Footer } from '@/components/footer'


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="NoteMeet Logo" width={40} height={40} />
            <span className="text-2xl font-bold text-[#4A4A4A]">NoteMeet</span>
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/features" className="text-[#4A4A4A] hover:text-[#4A90E2]">Features</Link></li>
              <li><Link href="/pricing" className="text-[#4A4A4A] hover:text-[#4A90E2]">Pricing</Link></li>
              <li><Link href="/contact" className="text-[#4A4A4A] hover:text-[#4A90E2]">Contact</Link></li>
            </ul>
          </nav>
          <div className="flex space-x-4">
          <LoginButton mode="modal" asChild>
            <Button variant={"outline"}>Sign In</Button>
          </LoginButton>
          <LoginButton mode="modal" asChild>
            <Button variant={"secondary"}>Sign Up</Button>
          </LoginButton>
          </div>
        </div>
      </header>

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
