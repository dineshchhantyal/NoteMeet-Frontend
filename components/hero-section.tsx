import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-primary to-[#50E3C2] text-white section-padding">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="mb-6">Simplifying Meetings, Maximizing Impact</h1>
          <p className="text-xl mb-8 max-w-lg">Automate your meeting workflow with intelligent recordings, transcriptions, and summaries.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white hover:text-primary font-semibold">
              Schedule a Demo
              <Calendar className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2">
          <Image
            src="/hero-illustration.svg"
            alt="NoteMeet collaboration illustration"
            width={600}
            height={400}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  )
}
