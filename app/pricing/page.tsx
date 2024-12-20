import { PricingTiers } from './components/pricing-tiers'
import { AddOnServices } from './components/add-on-services'
import { FreeTrial } from './components/free-trial'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90E2] to-[#50E3C2]">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8">
          Choose the Perfect Plan for Your Team
        </h1>
        <p className="text-xl text-center text-white mb-12">
          From individuals to enterprises, we have a plan that fits your needs.
        </p>
        <PricingTiers />
        <AddOnServices />
        <FreeTrial />
      </div>  
    </div>
  )
}

