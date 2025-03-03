'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download, Chrome, Puzzle, Clock, FileText, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const LINKS = {
	Chrome:
		'https://chromewebstore.google.com/detail/notemeet-recorder/iglooicboappkpddcinabadplpbkchfl',
	Firefox: 'https://addons.mozilla.org/en-US/firefox/addon/notemeet-recorder/',
};

const features = [
	{
		icon: <Clock size={24} />,
		title: 'Instant Recording',
		description: 'Start recording with a single click',
	},
	{
		icon: <FileText size={24} />,
		title: 'Auto Transcription',
		description: 'Get meeting notes immediately',
	},
	{
		icon: <Zap size={24} />,
		title: 'Effortless Integration',
		description: 'Works with all major platforms',
	},
];

export default function BrowserExtension() {
	const handleDownload = () => {
		const browser = navigator.userAgent.includes('Chrome')
			? 'Chrome'
			: 'Firefox';
		window.open(LINKS[browser]);
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
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
		<section className="py-20 bg-[#0a4a4e] overflow-hidden">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
						<span className="text-[#63d392]">Browser Extension</span> for
						Seamless Recording
					</h2>
					<p className="text-gray-300 max-w-2xl mx-auto">
						Capture every important meeting detail without leaving your browser
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-12 items-center">
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7 }}
						viewport={{ once: true }}
					>
						<div className="bg-[#156469]/40 backdrop-blur-sm p-8 rounded-xl border border-[#63d392]/30">
							<h3 className="text-2xl font-bold tracking-tight mb-6 text-white">
								Supercharge Your{' '}
								<span className="text-[#63d392]">Meetings</span> with Our
								Extension
							</h3>
							<p className="text-lg text-gray-300 mb-8">
								Transform how you handle meetings with our powerful browser
								extension. Automatically record, transcribe, and summarize your
								meetings with a single click, saving you hours of note-taking
								and follow-up work.
							</p>

							<motion.div
								variants={containerVariants}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								className="mb-8"
							>
								{features.map((feature, index) => (
									<motion.div
										key={index}
										variants={itemVariants}
										className="flex items-center mb-4"
									>
										<div className="h-10 w-10 rounded-full bg-[#63d392] flex items-center justify-center mr-4">
											<div className="text-[#0a4a4e]">{feature.icon}</div>
										</div>
										<div>
											<h4 className="font-medium text-white">
												{feature.title}
											</h4>
											<p className="text-sm text-gray-300">
												{feature.description}
											</p>
										</div>
									</motion.div>
								))}
							</motion.div>

							<div className="flex flex-col xl:flex-row items-center gap-4">
								<Button
									size="lg"
									className="w-full sm:w-auto bg-[#63d392] text-[#0a4a4e] hover:bg-[#4fb87a] hover:text-[#0a4a4e] transition-all duration-300"
									onClick={handleDownload}
								>
									<Download className="mr-2 h-5 w-5" />
									Download Extension
								</Button>
								<div className="flex items-center space-x-2">
									<Chrome size={20} className="text-[#63d392]" />
									<Puzzle size={20} className="text-[#63d392]" />
									<span className="text-sm text-gray-300">
										Compatible with all Chromium browsers
									</span>
								</div>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7, delay: 0.2 }}
						viewport={{ once: true }}
						className="hidden md:block"
					>
						<div className="relative">
							<div className="absolute inset-0 bg-[#63d392] blur-xl opacity-20 transform -rotate-6 rounded-3xl"></div>
							<div className="relative bg-[#156469] p-2 rounded-xl border border-[#63d392]/30 shadow-2xl">
								<div className="relative h-[400px] rounded-lg overflow-hidden">
									<div className="absolute top-0 left-0 right-0 h-10 bg-[#0a4a4e] flex items-center px-4">
										<div className="flex space-x-2">
											<div className="w-3 h-3 rounded-full bg-red-500"></div>
											<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
											<div className="w-3 h-3 rounded-full bg-green-500"></div>
										</div>
										<div className="flex-1 text-center text-xs text-gray-300">
											NoteMeet Extension
										</div>
									</div>
									<div className="mt-10">
										<Image
											src="/logo.png"
											alt="NoteMeet Browser Extension"
											width={600}
											height={350}
											className="object-cover rounded-b-lg"
											priority
										/>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
