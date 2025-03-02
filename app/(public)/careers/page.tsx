import { Metadata } from 'next';
import { JobListings } from './components/job-listings';
import { ApplicationForm } from './components/application-form';
import { ArrowRight, Users, Sparkles, Brain } from 'lucide-react';

export const metadata: Metadata = {
	title: 'Careers | NoteMeet',
	description:
		'Join the NoteMeet team and help shape the future of meetings. View our open positions and apply today.',
};

export default function CareersPage() {
	return (
		<div className="bg-[#0a4a4e] min-h-screen">
			{/* Decorative background elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-[20%] left-[10%] w-72 h-72 bg-[#63d392]/5 rounded-full blur-[100px]"></div>
				<div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#156469]/20 rounded-full blur-[100px]"></div>
			</div>

			<div className="container mx-auto px-4 py-24 text-white relative z-10">
				{/* Header */}
				<div className="text-center mb-16">
					<div className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-6">
						Join Our Team
					</div>
					<h1 className="text-4xl md:text-5xl font-bold mb-8">
						Careers at{' '}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#63d392] to-[#8ae9b3]">
							NoteMeet
						</span>
					</h1>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						We&apos;re building the future of meeting productivity and looking
						for talented individuals to join our mission.
					</p>
				</div>

				{/* Why join us section */}
				<section className="mb-20">
					<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-8 shadow-lg">
						<h2 className="text-2xl font-semibold mb-8 flex items-center">
							<span className="bg-[#63d392]/20 p-2 rounded-lg mr-3">
								<Users className="h-6 w-6 text-[#63d392]" />
							</span>
							Why Join NoteMeet?
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{[
								{
									title: 'Innovation-Driven',
									description:
										'Work on cutting-edge AI technology that transforms how people work.',
									icon: <Brain className="h-6 w-6 text-[#63d392]" />,
								},
								{
									title: 'Growth & Impact',
									description:
										'Make meaningful contributions in a fast-growing startup environment.',
									icon: <Sparkles className="h-6 w-6 text-[#63d392]" />,
								},
								{
									title: 'Remote-Friendly',
									description:
										'Flexible work arrangements with a focus on results, not location.',
									icon: <ArrowRight className="h-6 w-6 text-[#63d392]" />,
								},
							].map((item, index) => (
								<div
									key={index}
									className="bg-[#0d5559]/50 rounded-lg p-6 border border-[#156469]"
								>
									<div className="bg-[#63d392]/10 p-2 rounded-lg inline-block mb-4">
										{item.icon}
									</div>
									<h3 className="text-xl font-semibold mb-2 text-white">
										{item.title}
									</h3>
									<p className="text-gray-300">{item.description}</p>
								</div>
							))}
						</div>

						<div className="mt-8 text-lg text-gray-300">
							<p>
								At NoteMeet, we&apos;re building the future of meeting
								productivity. We&apos;re looking for passionate individuals who
								are excited about using technology to solve real-world problems.
								If you&apos;re innovative, collaborative, and ready to make an
								impact, we want to hear from you!
							</p>
						</div>
					</div>
				</section>

				{/* Open positions */}
				<section className="mb-20">
					<div className="text-center mb-12">
						<div className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-4">
							Opportunities
						</div>
						<h2 className="text-3xl font-semibold">
							Open <span className="text-[#63d392]">Positions</span>
						</h2>
					</div>

					<JobListings />
				</section>

				{/* Application form */}
				<section>
					<div className="text-center mb-12">
						<div className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-4">
							Apply Now
						</div>
						<h2 className="text-3xl font-semibold">
							Start Your <span className="text-[#63d392]">Journey</span>
						</h2>
					</div>

					<ApplicationForm />
				</section>
			</div>
		</div>
	);
}
