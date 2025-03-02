'use client';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const trialFeatures = [
	'Full access to all core features',
	'No credit card required',
	'Easy upgrade to paid plan',
	'5 free meetings included',
];

export function FreeTrial() {
	return (
		<div className="relative">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="bg-gradient-to-r from-[#156469] to-[#0d5559] rounded-xl overflow-hidden"
			>
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute top-0 right-0 w-72 h-72 bg-[#63d392]/10 rounded-full blur-[80px]"></div>
					<div className="absolute bottom-0 left-0 w-72 h-72 bg-[#63d392]/10 rounded-full blur-[80px]"></div>
				</div>

				<div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center">
					<div className="flex-1">
						<h2 className="text-3xl font-bold mb-4">
							Try NoteMeet <span className="text-[#63d392]">Risk-Free</span>
						</h2>
						<p className="text-lg text-gray-300 mb-6">
							Experience the full power of NoteMeet with our 14-day free trial.
							No commitment, no credit card required.
						</p>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
							{trialFeatures.map((feature, idx) => (
								<div key={idx} className="flex items-center">
									<div className="bg-[#63d392]/20 p-1 rounded-full mr-2">
										<Check className="h-4 w-4 text-[#63d392]" />
									</div>
									<span className="text-gray-300">{feature}</span>
								</div>
							))}
						</div>
					</div>

					<div className="mt-6 md:mt-0 md:ml-8 flex-shrink-0">
						<Button
							size="lg"
							className="bg-[#63d392] text-[#0a4a4e] hover:bg-[#4fb87a] hover:shadow-lg hover:shadow-[#63d392]/20 transition-all flex items-center"
						>
							Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
						</Button>
						<p className="text-sm text-gray-300 mt-2 text-center">
							No credit card required
						</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
