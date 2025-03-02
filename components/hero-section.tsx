'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Clock, Brain, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MeetingDemoFlow } from './home/demo-flow';

export function HeroSection({
	onGetStarted,
	onLogin,
	isLoggedIn = false,
}: {
	onGetStarted?: () => void;
	onLogin?: () => void;
	isLoggedIn?: boolean;
}) {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setLoaded(true);
	}, []);

	const fadeUp = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.8, ease: 'easeOut' },
		},
	};

	const stagger = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	return (
		<section
			id="hero"
			className="bg-[#0a4a4e] min-h-screen pt-24 pb-16 overflow-hidden relative"
		>
			{/* Background decorative elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-[20%] left-[10%] w-72 h-72 bg-[#63d392]/5 rounded-full blur-[100px]"></div>
				<div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#156469]/20 rounded-full blur-[100px]"></div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					{/* Left Column - Text Content */}
					<motion.div
						className="text-white space-y-8"
						initial="hidden"
						animate={loaded ? 'visible' : 'hidden'}
						variants={stagger}
					>
						<motion.div variants={fadeUp}>
							<span className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-6">
								Transform Meeting Productivity
							</span>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
								<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#63d392] to-[#8ae9b3]">
									Revolutionize
								</span>{' '}
								Your Meeting Experience
							</h1>
						</motion.div>

						<motion.p
							className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed"
							variants={fadeUp}
						>
							Save hours with AI-powered recording, smart transcription, and
							automated summaries that capture every crucial detail.
						</motion.p>

						<motion.div
							className="flex flex-col sm:flex-row gap-5"
							variants={fadeUp}
						>
							<Button
								size="lg"
								onClick={onGetStarted}
								className="bg-gradient-to-r from-[#63d392] to-[#4fb87a] text-[#0a4a4e] font-semibold hover:shadow-lg hover:shadow-[#63d392]/30 transform transition-all duration-300 text-base px-8"
							>
								{isLoggedIn ? 'Go to Dashboard' : 'Get Started Free'}{' '}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>

							<Button
								size="lg"
								variant="outline"
								onClick={onLogin}
								className="border-2 border-[#63d392] text-[#63d392] hover:bg-[#63d392]/10 hover:text-white transition-all duration-300 text-base px-8 group"
							>
								<Play className="mr-2 h-4 w-4 group-hover:scale-125 transition-transform duration-300" />
								{'Early Access'}
							</Button>
						</motion.div>

						<motion.div
							className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8"
							variants={stagger}
						>
							<motion.div
								className="flex items-center bg-[#156469]/30 backdrop-blur-sm p-3 rounded-lg border border-[#63d392]/20"
								variants={fadeUp}
								whileHover={{
									scale: 1.03,
									backgroundColor: 'rgba(21, 100, 105, 0.5)',
								}}
							>
								<div className="bg-[#63d392]/20 p-2 rounded-lg mr-3">
									<Clock className="h-5 w-5 text-[#63d392]" />
								</div>
								<p className="text-sm">Save 5+ hrs weekly</p>
							</motion.div>

							<motion.div
								className="flex items-center bg-[#156469]/30 backdrop-blur-sm p-3 rounded-lg border border-[#63d392]/20"
								variants={fadeUp}
								whileHover={{
									scale: 1.03,
									backgroundColor: 'rgba(21, 100, 105, 0.5)',
								}}
							>
								<div className="bg-[#63d392]/20 p-2 rounded-lg mr-3">
									<Brain className="h-5 w-5 text-[#63d392]" />
								</div>
								<p className="text-sm">AI-Powered Insights</p>
							</motion.div>

							<motion.div
								className="flex items-center bg-[#156469]/30 backdrop-blur-sm p-3 rounded-lg border border-[#63d392]/20"
								variants={fadeUp}
								whileHover={{
									scale: 1.03,
									backgroundColor: 'rgba(21, 100, 105, 0.5)',
								}}
							>
								<div className="bg-[#63d392]/20 p-2 rounded-lg mr-3">
									<Sparkles className="h-5 w-5 text-[#63d392]" />
								</div>
								<p className="text-sm">99% Accuracy</p>
							</motion.div>
						</motion.div>
					</motion.div>

					{/* Right Column - Interactive App Demo */}
					<div className="relative lg:h-auto lg:w-full">
						<MeetingDemoFlow />
					</div>
				</div>
			</div>
		</section>
	);
}
