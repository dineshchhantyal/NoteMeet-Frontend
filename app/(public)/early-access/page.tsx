import { Metadata } from 'next';
import { EarlyAccessForm } from '@/components/early-access-form';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
	title: 'Early Access | NoteMeet',
	description:
		'Apply for early access to NoteMeet and experience the future of meeting management.',
};

export default function EarlyAccessPage() {
	return (
		<div className="bg-[#0a4a4e] min-h-screen">
			{/* Decorative background elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-[20%] left-[10%] w-72 h-72 bg-[#63d392]/5 rounded-full blur-[100px]"></div>
				<div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#156469]/20 rounded-full blur-[100px]"></div>
			</div>

			<div className="container mx-auto px-4 py-24 text-white relative z-10">
				<div className="text-center mb-16">
					<div className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-6">
						Limited Spots Available
					</div>
					<h1 className="text-4xl md:text-5xl font-bold mb-8">
						Apply for{' '}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#63d392] to-[#8ae9b3]">
							Early Access
						</span>
					</h1>
					<p className="text-xl text-gray-300 max-w-2xl mx-auto">
						Be among the first to experience NoteMeet&apos;s revolutionary
						meeting management platform. Join our exclusive early access program
						and help shape the future of productive meetings.
					</p>
				</div>

				<div className="max-w-2xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
						{[
							{
								title: 'Exclusive Features',
								description:
									"Get access to features before they're publicly available",
							},
							{
								title: 'Direct Support',
								description:
									'Receive personalized onboarding and priority support',
							},
							{
								title: 'Shape the Product',
								description:
									'Your feedback will directly influence product development',
							},
						].map((benefit, index) => (
							<div
								key={index}
								className="bg-[#156469]/30 backdrop-blur-sm border border-[#63d392]/20 rounded-xl p-6 flex flex-col items-center text-center"
							>
								<div className="bg-[#63d392]/10 p-3 rounded-full mb-4">
									<Sparkles className="h-6 w-6 text-[#63d392]" />
								</div>
								<h3 className="font-medium text-white mb-2">{benefit.title}</h3>
								<p className="text-gray-300 text-sm">{benefit.description}</p>
							</div>
						))}
					</div>

					<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-8">
						<EarlyAccessForm />
					</div>
				</div>
			</div>
		</div>
	);
}
