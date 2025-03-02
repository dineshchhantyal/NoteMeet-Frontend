'use client';

import React, { useState, useEffect } from 'react';
import {
	Calendar,
	Cloud,
	PlayCircle,
	FileText,
	FolderKanban,
	BarChart,
	Users,
	LinkIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const headlessMethod = [
	{
		title: 'Schedule a Meeting',
		icon: Calendar,
		content: 'Set up your meeting details in the Dashboard.',
		benefits: [
			'Easy-to-use scheduling interface',
			'Specify date, time, and meeting title',
			'Add optional participant emails',
		],
	},
	{
		title: 'Automatic Recording',
		icon: Cloud,
		content: 'Our AI Recorder automatically captures your meeting.',
		benefits: [
			'No manual start/stop required',
			'No browser extension needed',
			'Cloud-based recording for reliability',
		],
	},
	{
		title: 'Access Recording & Notes',
		icon: PlayCircle,
		content: "Review your meeting content in the 'My Meetings' section.",
		benefits: [
			'Instant access to recordings post-meeting',
			'Review audio/video recordings',
			'Access transcripts and AI-generated notes',
		],
	},
	{
		title: 'Transcribe & Summarize',
		icon: FileText,
		content: 'Get detailed transcriptions and AI-generated summaries.',
		benefits: [
			'High-accuracy transcription',
			'Concise meeting summaries',
			'Key points and action items highlighted',
		],
	},
	{
		title: 'Organize & Collaborate',
		icon: FolderKanban,
		content: 'Manage your meeting data and share insights.',
		benefits: [
			'Intuitive tagging and folder system',
			'Easy sharing of meeting outcomes',
			'Collaborative note-editing features',
		],
	},
	{
		title: 'Team Collaboration',
		icon: Users,
		content: 'Share insights and work together on meeting outcomes.',
		benefits: [
			'Share transcripts and summaries easily',
			'Collaborate on action items',
			'Improve team communication and alignment',
		],
	},
	{
		title: 'Analyze & Improve',
		icon: BarChart,
		content: 'Gain insights from your meeting data.',
		benefits: [
			'Meeting efficiency metrics',
			'Participation and engagement analytics',
			'Actionable suggestions for better meetings',
		],
	},
];

const browserExtensionMethod = [
	{
		title: 'Install Browser Extension',
		icon: LinkIcon,
		content: 'Add NoteMeet to your browser for seamless integration.',
		benefits: [
			'One-click installation process',
			'Automatic updates for new features',
			'Secure and privacy-focused design',
		],
	},
	{
		title: 'Open and Start Recording',
		icon: PlayCircle,
		content: 'Open the meeting and start recording with a single click.',
		benefits: [
			'Automatic recording during meetings',
			'No manual start/stop required',
			'Real-time recording with user interaction',
		],
	},
	{
		title: 'Access Recording & Notes',
		icon: PlayCircle,
		content: "Review your meeting content in the 'My Meetings' section.",
		benefits: [
			'Instant access to recordings post-meeting',
			'Searchable transcripts for quick reference',
			'AI-generated meeting notes and action items',
		],
	},
	{
		title: 'Transcribe & Summarize',
		icon: FileText,
		content: 'Get detailed transcriptions and AI-generated summaries.',
		benefits: [
			'High-accuracy transcription',
			'Concise meeting summaries',
			'Key points and action items highlighted',
		],
	},
	{
		title: 'Organize & Collaborate',
		icon: FolderKanban,
		content: 'Manage your meeting data and share insights.',
		benefits: [
			'Intuitive tagging and folder system',
			'Easy sharing of meeting outcomes',
			'Collaborative note-editing features',
		],
	},
	{
		title: 'Analyze & Improve',
		icon: BarChart,
		content: 'Gain insights from your meeting data.',
		benefits: [
			'Meeting efficiency metrics',
			'Participation and engagement analytics',
			'Actionable suggestions for better meetings',
		],
	},
];

export const methods = [
	{
		title: 'Browser Extension Method',
		icon: Calendar,
		content:
			'Requires installation of a browser extension that activates during the meeting to facilitate recording with user interaction.',
		benefits: [
			'User-friendly installation process',
			'Manual start/stop recording',
			'Real-time recording during meetings',
		],
		steps: browserExtensionMethod,
	},
	{
		title: 'Headless Method',
		icon: Calendar,
		content:
			'No browser extension required; scheduling via the dashboard triggers the AI recorder, recording automatically without user intervention.',
		benefits: [
			'Seamless integration with scheduling',
			'Automatic recording without user input',
			'Reliable and efficient meeting capture',
		],
		steps: headlessMethod,
	},
];

export function InteractiveHowItWorks() {
	return (
		<section className="py-20 bg-[#0a4a4e]">
			<div className="container mx-auto px-4">
				<h2 className="text-center text-3xl font-bold mb-12 text-white">
					How <span className="text-[#63d392]">It Works</span>
				</h2>

				<Tabs defaultValue="browser-extension">
					<TabsList className="grid w-full grid-cols-2 bg-[#156469]/30 mb-8">
						<TabsTrigger
							value="browser-extension"
							className="data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-gray-300"
						>
							Browser Extension Method
						</TabsTrigger>
						<TabsTrigger
							value="headless"
							className="data-[state=active]:bg-[#63d392] data-[state=active]:text-[#0a4a4e] text-gray-300"
						>
							Headless Method
						</TabsTrigger>
					</TabsList>
					<TabsContent value="browser-extension">
						<HowItWorksStep steps={browserExtensionMethod} />
					</TabsContent>
					<TabsContent value="headless">
						<HowItWorksStep steps={headlessMethod} />
					</TabsContent>
				</Tabs>
			</div>
		</section>
	);
}

function HowItWorksStep({ steps }: { steps: typeof headlessMethod }) {
	const [hoveredStep, setHoveredStep] = useState<number | null>(null);
	const [activeStep, setActiveStep] = useState<number>(0);

	// Auto-advance steps every few seconds for demo effect
	useEffect(() => {
		const timer = setInterval(() => {
			setActiveStep((prev) => (prev + 1) % steps.length);
		}, 5000);
		return () => clearInterval(timer);
	}, [steps.length]);

	return (
		<div className="flex flex-col lg:flex-row gap-8 items-center">
			{/* Left side: Visual workflow - Enhanced with flow diagram */}
			<div className="w-full lg:w-1/2">
				<div className="relative w-full h-[540px] bg-[#0d5559] rounded-xl p-6 shadow-lg overflow-hidden">
					{/* Process flow visualization */}
					<div className="absolute inset-0 flex items-center justify-center opacity-10">
						<svg width="380" height="380" viewBox="0 0 100 100">
							<circle
								cx="50"
								cy="50"
								r="45"
								fill="none"
								stroke="#63d392"
								strokeWidth="1"
							/>
							<circle
								cx="50"
								cy="50"
								r="38"
								fill="none"
								stroke="#63d392"
								strokeWidth="0.5"
							/>
						</svg>
					</div>

					{/* Connection lines with pulsing effect */}
					<svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
						<defs>
							<linearGradient
								id="lineGradient"
								x1="0%"
								y1="0%"
								x2="100%"
								y2="0%"
							>
								<stop offset="0%" stopColor="#63d392" stopOpacity="0.4" />
								<stop offset="100%" stopColor="#63d392" stopOpacity="0.8" />
							</linearGradient>

							{/* Create filter for glow effect */}
							<filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
								<feGaussianBlur stdDeviation="2" result="blur" />
								<feMerge>
									<feMergeNode in="blur" />
									<feMergeNode in="SourceGraphic" />
								</feMerge>
							</filter>
						</defs>

						{/* Draw connecting paths between steps with arrows */}
						{steps.map(
							(_, index) =>
								index < steps.length - 1 && (
									<g key={`path-${index}`}>
										<path
											d={`M80 ${80 + index * 70} L400 ${80 + index * 70 + 35}`}
											stroke="url(#lineGradient)"
											strokeWidth="2"
											strokeDasharray="6,4"
											strokeLinecap="round"
											fill="none"
											filter="url(#glow)"
											className={
												activeStep === index ? 'opacity-100' : 'opacity-40'
											}
										>
											<animate
												attributeName="stroke-dashoffset"
												from="40"
												to="0"
												dur="2s"
												repeatCount="indefinite"
											/>
										</path>

										{/* Arrow head */}
										<polygon
											points={`395,${75 + index * 70 + 35} 400,${80 + index * 70 + 35} 395,${85 + index * 70 + 35}`}
											fill="#63d392"
											className={
												activeStep === index ? 'opacity-100' : 'opacity-40'
											}
										/>
									</g>
								),
						)}
					</svg>

					{/* Step numbers for clear progression */}
					<div className="absolute top-4 left-4 flex items-center space-x-1">
						<div className="p-1 bg-[#63d392]/20 rounded">
							<svg
								className="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="#63d392"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 5l7 7-7 7M5 5l7 7-7 7"
								/>
							</svg>
						</div>
						<span className="text-[#63d392] text-xs font-medium">
							Process Flow
						</span>
					</div>

					{/* Steps visualization */}
					<div className="relative z-10">
						{steps.map((step, index) => (
							<motion.div
								key={index}
								className={`flex items-center mb-10 cursor-pointer ${
									activeStep === index || hoveredStep === index
										? 'opacity-100'
										: 'opacity-60'
								}`}
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ delay: index * 0.1 }}
								onMouseEnter={() => setHoveredStep(index)}
								onMouseLeave={() => setHoveredStep(null)}
								onClick={() => setActiveStep(index)}
							>
								<div className="relative">
									{/* Step number indicator */}
									<div className="absolute -left-2 -top-2 w-5 h-5 rounded-full bg-[#0a4a4e] border border-[#63d392]/30 flex items-center justify-center">
										<span className="text-[#63d392] text-xs font-bold">
											{index + 1}
										</span>
									</div>

									<motion.div
										className={`flex items-center justify-center w-16 h-16 rounded-full mr-4 transition-all duration-300 ${
											activeStep === index || hoveredStep === index
												? 'bg-[#63d392] shadow-xl shadow-[#63d392]/20'
												: 'bg-[#156469]'
										}`}
										whileHover={{ scale: 1.1 }}
									>
										<step.icon
											size={28}
											className={
												activeStep === index || hoveredStep === index
													? 'text-[#0a4a4e]'
													: 'text-white'
											}
										/>
									</motion.div>
								</div>

								<div>
									<h3
										className={`text-xl font-semibold ${
											activeStep === index || hoveredStep === index
												? 'text-[#63d392]'
												: 'text-white'
										}`}
									>
										{step.title}
									</h3>
									<p className="text-white/70 text-sm max-w-[250px] line-clamp-1">
										{step.content}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>

			{/* Right side: Step details with enhanced visual design */}
			<div className="w-full lg:w-1/2">
				<AnimatePresence mode="wait">
					<motion.div
						key={activeStep}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="bg-[#156469] p-8 rounded-xl shadow-xl border border-[#63d392]/30"
					>
						{/* Step progress indicator */}
						<div className="mb-6 flex justify-between items-center">
							<div className="text-xs text-white/70">
								STEP {activeStep + 1} OF {steps.length}
							</div>
							<div className="flex space-x-1">
								{steps.map((_, idx) => (
									<button
										key={idx}
										onClick={() => setActiveStep(idx)}
										className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
											activeStep === idx
												? 'bg-[#63d392] w-10'
												: 'bg-[#63d392]/30'
										}`}
										aria-label={`Go to step ${idx + 1}`}
									/>
								))}
							</div>
						</div>

						<div className="flex items-center mb-6">
							<div className="p-3 bg-[#63d392]/20 rounded-lg mr-4">
								{steps[activeStep].icon &&
									React.createElement(steps[activeStep].icon, {
										size: 32,
										className: 'text-[#63d392]',
									})}
							</div>
							<h3 className="text-2xl font-bold text-[#63d392]">
								{steps[activeStep].title}
							</h3>
						</div>

						<p className="text-white text-lg mb-8 leading-relaxed">
							{steps[activeStep].content}
						</p>

						<div className="p-4 bg-[#0d5559]/70 rounded-lg mb-6 border border-[#63d392]/20">
							<h4 className="text-[#63d392] font-semibold mb-4 flex items-center">
								<svg
									className="w-5 h-5 mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								Key Benefits:
							</h4>
							<ul className="space-y-3">
								{steps[activeStep].benefits.map((benefit, idx) => (
									<motion.li
										key={idx}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: idx * 0.1 }}
										className="flex items-start"
									>
										<div className="p-1 bg-[#63d392]/20 rounded mr-3 mt-1">
											<svg
												className="w-4 h-4"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												viewBox="0 0 24 24"
												stroke="#63d392"
											>
												<path d="M5 13l4 4L19 7"></path>
											</svg>
										</div>
										<span className="text-gray-200">{benefit}</span>
									</motion.li>
								))}
							</ul>
						</div>

						<div className="flex justify-between mt-8">
							<button
								onClick={() =>
									setActiveStep(
										(prev) => (prev - 1 + steps.length) % steps.length,
									)
								}
								className="px-4 py-2 bg-[#0a4a4e] text-white rounded-md hover:bg-[#0d5559] transition-colors flex items-center"
							>
								<svg
									className="w-4 h-4 mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M15 19l-7-7 7-7"
									/>
								</svg>
								Previous
							</button>

							<button
								onClick={() =>
									setActiveStep((prev) => (prev + 1) % steps.length)
								}
								className="px-4 py-2 bg-[#63d392] text-[#0a4a4e] font-medium rounded-md hover:bg-[#4fb87a] transition-colors flex items-center"
							>
								Next
								<svg
									className="w-4 h-4 ml-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>
						</div>
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
