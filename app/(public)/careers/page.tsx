import { Metadata } from 'next'
import { JobListings } from './components/job-listings'
import { ApplicationForm } from './components/application-form'

export const metadata: Metadata = {
  title: 'Careers | NoteMeet',
  description: 'Join the NoteMeet team and help shape the future of meetings. View our open positions and apply today.',
}

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Careers at NoteMeet</h1>
      
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Join Our Team</h2>
        <p className="text-lg mb-4">
          At NoteMeet, we&apos;re building the future of meeting productivity. We&apos;re looking for passionate individuals who are excited about using technology to solve real-world problems. If you&apos;re innovative, collaborative, and ready to make an impact, we want to hear from you!
        </p>
      </section>

      <JobListings />
      
      <ApplicationForm />
    </div>
  )
}

