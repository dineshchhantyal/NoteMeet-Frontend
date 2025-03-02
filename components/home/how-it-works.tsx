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
			{/* Left side: Visual workflow */}
			<div className="w-full lg:w-1/2">
				<div className="relative w-full h-[500px] bg-[#0d5559] rounded-xl p-6 shadow-lg overflow-hidden">
					{/* Connection lines */}
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
						</defs>

						{/* Draw connecting paths between steps */}
						{steps.map(
							(_, index) =>
								index < steps.length - 1 && (
									<path
										key={`path-${index}`}
										d={`M80 ${80 + index * 80} L420 ${80 + index * 80 + 40}`}
										stroke="url(#lineGradient)"
										strokeWidth="2"
										strokeDasharray="6,4"
										strokeLinecap="round"
										fill="none"
									>
										<animate
											attributeName="stroke-dashoffset"
											from="40"
											to="0"
											dur="2s"
											repeatCount="indefinite"
										/>
									</path>
								),
						)}
					</svg>

					{/* Steps visualization */}
					<div className="relative z-10">
						{steps.map((step, index) => (
							<motion.div
								key={index}
								className={`flex items-center mb-12 cursor-pointer ${
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
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>

			{/* Right side: Step details */}
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

						<p className="text-white text-lg mb-6">
							{steps[activeStep].content}
						</p>

						<div className="mt-6">
							<h4 className="text-[#63d392] font-semibold mb-3">
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
								className="px-4 py-2 bg-[#0a4a4e] text-white rounded-md hover:bg-[#0d5559] transition-colors"
							>
								Previous
							</button>
							<div className="flex space-x-1">
								{steps.map((_, idx) => (
									<button
										key={idx}
										onClick={() => setActiveStep(idx)}
										className={`w-2.5 h-2.5 rounded-full ${
											activeStep === idx ? 'bg-[#63d392]' : 'bg-[#63d392]/30'
										}`}
									/>
								))}
							</div>
							<button
								onClick={() =>
									setActiveStep((prev) => (prev + 1) % steps.length)
								}
								className="px-4 py-2 bg-[#63d392] text-[#0a4a4e] font-medium rounded-md hover:bg-[#4fb87a] transition-colors"
							>
								Next
							</button>
						</div>
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
