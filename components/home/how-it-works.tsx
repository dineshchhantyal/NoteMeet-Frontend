'use client';

import { useState } from 'react';
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
import { colors } from '@/tailwind.config';

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
		<section className="py-20 bg-white">
			<div className="container mx-auto px-4">
				<h2 className="text-center text-3xl font-bold mb-12">How It Works</h2>

				<Tabs defaultValue="browser-extension">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="browser-extension">
							Browser Extension Method
						</TabsTrigger>
						<TabsTrigger value="headless">Headless Method</TabsTrigger>
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

	return (
		<div className="relative w-full h-[710px]">
			<svg viewBox="0 0 800 700" className="w-full h-full">
				<defs>
					<linearGradient
						id="circleGradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="100%"
					>
						<stop offset="0%" stopColor="#60a5fa" />
						<stop offset="100%" stopColor="#3b82f6" />
					</linearGradient>
				</defs>
				<circle
					cx="400"
					cy="350"
					r="300"
					fill="none"
					stroke={colors.cambridgeBlue}
					strokeWidth="2"
				/>
				{steps.map((step, index) => {
					const angle = (index * (360 / steps.length) - 90) * (Math.PI / 180);
					const x = 400 + 300 * Math.cos(angle);
					const y = 350 + 300 * Math.sin(angle);
					const nextAngle =
						((index + 1) * (360 / steps.length) - 90) * (Math.PI / 180);
					const nextX = 400 + 300 * Math.cos(nextAngle);
					const nextY = 350 + 300 * Math.sin(nextAngle);

					return (
						<g
							key={index}
							onMouseEnter={() => setHoveredStep(index)}
							onMouseLeave={() => setHoveredStep(null)}
						>
							<motion.circle
								cx={x}
								cy={y}
								r="40"
								fill={'#63d392'}
								initial={{ scale: 1 }}
								whileHover={{ scale: 1.1, fill: colors.deepBlue }}
							/>
							<foreignObject x={x - 20} y={y - 20} width="40" height="40">
								<div className="flex items-center justify-center w-full h-full text-white">
									<step.icon size={24} />
								</div>
							</foreignObject>
							<text
								x={x}
								y={y + 60}
								textAnchor="middle"
								fill="#4b5563"
								fontSize="14"
							>
								{step.title}
							</text>
							{index < steps.length - 1 && (
								<path
									d={`M${x} ${y} Q${400} ${350} ${nextX} ${nextY}`}
									fill="none"
									stroke={colors.softRed}
									strokeWidth="2"
									strokeDasharray="5,5"
								>
									<animate
										attributeName="stroke-dashoffset"
										from="0"
										to="20"
										dur="1s"
										repeatCount="indefinite"
									/>
								</path>
							)}
						</g>
					);
				})}
				<g transform="translate(400, 350)">
					<circle cx="0" cy="0" r="80" fill={colors.deepBlue} />
					<text
						x="0"
						y="4"
						textAnchor="middle"
						fill="white"
						fontSize="24"
						fontWeight="bold"
					>
						NoteMeet
					</text>
				</g>
			</svg>
			<AnimatePresence>
				{hoveredStep !== null && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.2 }}
						className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#63d392] p-6 rounded-lg shadow-lg max-w-sm w-full text-center"
						style={{
							background: '#0a4a4e',
							border: '1px solid #cce3ff',
						}}
					>
						<h3 className="text-2xl font-semibold mb-2 text-[#63d392]">
							{steps[hoveredStep].title}
						</h3>
						<p className="text-white mb-4">{steps[hoveredStep].content}</p>
						<ul className="text-left">
							{steps[hoveredStep].benefits.map((benefit, index) => (
								<li key={index} className="flex items-start mb-2">
									<svg
										className="w-4 h-4 mt-1 mr-2"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										viewBox="0 0 24 24"
										stroke="#63d392"
									>
										<path d="M5 13l4 4L19 7"></path>
									</svg>
									<span className="text-sm text-gray-300">{benefit}</span>
								</li>
							))}
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
