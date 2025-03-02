'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const integrations = [
	{ name: 'Google Calendar', logo: '/GoogleCalendarLogo.png' },
	{ name: 'Google Meet', logo: '/GoogleMeetLogo.png' },
	{ name: 'Zoom', logo: '/ZoomLogo.png' },
	{ name: 'Microsoft Teams', logo: '/MicrosoftTeamsLogo.png' },
	{ name: 'Slack', logo: '/SlackLogo.png' },
	{ name: 'Asana', logo: '/TrelloLogo.png' },
];

export function IntegrationsHighlight() {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<section className="py-20 bg-[#0a4a4e] border-t border-[#63d392]/10">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl font-bold mb-4 text-white">
						Seamless <span className="text-[#63d392]">Integrations</span>
					</h2>
					<p className="text-gray-300 max-w-2xl mx-auto">
						NoteMeet connects with your favorite tools to make meeting
						management effortless
					</p>
				</motion.div>

				<motion.div
					className="relative p-8 rounded-xl border border-[#63d392]/20 bg-[#156469]/30 backdrop-blur-sm max-w-5xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center"
					>
						{integrations.map((integration) => (
							<motion.div
								key={integration.name}
								className="text-center"
								variants={itemVariants}
								whileHover={{ y: -5 }}
							>
								<div className="w-20 h-20 rounded-full bg-white/90 p-3 flex items-center justify-center mb-3 shadow-lg border border-[#63d392]/20 hover:border-[#63d392] transition-all duration-300 group">
									<div className="relative w-full h-full">
										<Image
											src={integration.logo}
											alt={`${integration.name} logo`}
											fill
											sizes="(max-width: 80px) 100vw, 80px"
											className="object-contain p-1"
										/>
									</div>
								</div>
								<p className="text-sm font-medium text-white">
									{integration.name}
								</p>
							</motion.div>
						))}
					</motion.div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					viewport={{ once: true }}
					className="text-center mt-12"
				>
					<p className="text-gray-300 mb-6">
						Don&apos;t see your favorite tool?{' '}
						<span className="text-[#63d392] underline cursor-pointer">
							Let us know
						</span>{' '}
						and we&apos;ll work on adding it.
					</p>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.98 }}
						className="px-6 py-2 rounded-lg border border-[#63d392] text-[#63d392] hover:bg-[#63d392]/10 transition-all duration-300"
					>
						View All Integrations
					</motion.button>
				</motion.div>
			</div>
		</section>
	);
}
