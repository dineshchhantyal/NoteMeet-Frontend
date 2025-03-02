'use client';

import { FaChrome, FaEdge, FaFirefox } from 'react-icons/fa';
import { SiBrave } from 'react-icons/si';
import { motion } from 'framer-motion';

const supportedBrowsers = [
	{
		name: 'Google Chrome',
		icon: FaChrome,
		version: '88+',
	},
	{
		name: 'Microsoft Edge',
		icon: FaEdge,
		version: '88+',
	},
	{
		name: 'Firefox',
		icon: FaFirefox,
		version: '78+',
	},
	{
		name: 'Brave',
		icon: SiBrave,
		version: '1.0+',
	},
];

export default function BrowserSupport() {
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
		<section className="py-16 bg-[#0a4a4e]">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4 text-white">
						<span className="text-[#63d392]">Browser</span> Compatibility
					</h2>
					<p className="text-gray-300 max-w-2xl mx-auto">
						NoteMeet works seamlessly with all modern browsers
					</p>
				</div>

				<motion.div
					className="relative p-6 rounded-xl border border-[#63d392]/20 bg-[#156469]/40 backdrop-blur-sm max-w-3xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#63d392] text-[#0a4a4e] px-4 py-1 rounded-full text-sm font-medium">
						Supported Platforms
					</div>

					<motion.div
						className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-4"
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						{supportedBrowsers.map((browser) => (
							<motion.div
								key={browser.name}
								variants={itemVariants}
								className="flex flex-col items-center text-center group"
								whileHover={{ scale: 1.05 }}
							>
								<div className="h-16 w-16 flex items-center justify-center bg-white/10 rounded-full mb-3 group-hover:bg-[#63d392]/20 transition-all duration-300">
									<browser.icon className="h-8 w-8 text-[#63d392]" />
								</div>
								<div>
									<p className="font-medium text-white">{browser.name}</p>
									<p className="text-sm text-gray-300">
										Version {browser.version}
									</p>
								</div>
							</motion.div>
						))}
					</motion.div>

					<div className="mt-8 pt-6 border-t border-[#63d392]/20 text-center">
						<p className="text-gray-300 text-sm">
							Additional browsers based on Chromium are also supported
						</p>
					</div>
				</motion.div>

				<div className="flex justify-center mt-10">
					<motion.div
						className="inline-flex items-center px-4 py-2 rounded-full bg-[#156469] border border-[#63d392]/30 text-white text-sm"
						whileHover={{ scale: 1.05 }}
					>
						<span className="mr-2">🔒</span>
						NoteMeet uses secure browser APIs that respect your privacy
					</motion.div>
				</div>
			</div>
		</section>
	);
}
