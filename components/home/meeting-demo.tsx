'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
	CheckCircle2,
	Clock,
	UserCircle2,
	CalendarClock,
	AlertCircle,
	Copy,
	Check,
	ArrowRight,
	FileText,
	ListChecks,
	BarChart3,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Sample team members for task assignments
const teamMembers = [
	{ id: 1, name: 'Alex Chen', avatar: '/avatars/alex.png', initials: 'AC' },
	{ id: 2, name: 'Sarah Kim', avatar: '/avatars/sarah.png', initials: 'SK' },
	{
		id: 3,
		name: 'Miguel Lopez',
		avatar: '/avatars/miguel.png',
		initials: 'ML',
	},
	{
		id: 4,
		name: 'Taylor Swift',
		avatar: '/avatars/taylor.png',
		initials: 'TS',
	},
];

// Sample transcript lines that will animate in - Software Development Standup
const transcriptLines = [
	"I've completed the authentication flow refactoring yesterday",
	'Currently working on optimizing API response times',
	'Sarah, could you review my PR for the dashboard components?',
	'Blocking issue: we need DevOps to fix the staging environment',
	'We should also prioritize the payment gateway integration',
	'Anyone have an update on the analytics dashboard?',
];

// Sample actionable tasks with assignees
const actionableTasks = [
	{
		id: 1,
		task: 'Review PR for dashboard components',
		assignee: teamMembers[1],
		priority: 'High',
		deadline: 'Today, 4:00 PM',
		status: 'Pending',
	},
	{
		id: 2,
		task: 'Fix staging environment deployment',
		assignee: teamMembers[2],
		priority: 'Critical',
		deadline: 'Today, 2:00 PM',
		status: 'In Progress',
	},
	{
		id: 3,
		task: 'Optimize API response for product listing',
		assignee: teamMembers[0],
		priority: 'Medium',
		deadline: 'Tomorrow, 12:00 PM',
		status: 'Not Started',
	},
];

// Sample meeting summary points
const summaryPoints = [
	{
		title: 'Key Discussion Points',
		items: [
			'Authentication flow refactoring is complete',
			'API response times need optimization',
			'Dashboard components PR needs review',
			'Staging environment has deployment issues',
		],
	},
	{
		title: 'Decisions Made',
		items: [
			'Prioritize staging environment fix today',
			'Sarah will review dashboard PR by 4:00 PM',
			'API optimization to be completed by tomorrow',
		],
	},
];

export const MeetingDemo = () => {
	// State for active tab
	const [activeTab, setActiveTab] = useState('transcript');
	const [showProcessing, setShowProcessing] = useState(true);
	const [processingStep, setProcessingStep] = useState(0);
	const [copied, setCopied] = useState(false);
	const [taskShowcase, setTaskShowcase] = useState(false);

	// Processing steps simulation
	useEffect(() => {
		if (showProcessing) {
			const timer = setTimeout(() => {
				if (processingStep < 3) {
					setProcessingStep(processingStep + 1);
				} else {
					setShowProcessing(false);
					// Automatically move to tasks tab after processing
					setTimeout(() => {
						setActiveTab('tasks');
						// After showing tasks, trigger task showcase animation
						setTimeout(() => {
							setTaskShowcase(true);
						}, 1000);
					}, 500);
				}
			}, 1200);
			return () => clearTimeout(timer);
		}
	}, [processingStep, showProcessing]);

	// Copy animation
	const handleCopy = () => {
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// Processing steps text
	const processingSteps = [
		'Recording audio...',
		'Transcribing meeting...',
		'Analyzing content...',
		'Generating insights...',
	];

	return (
		<div className="relative lg:h-auto lg:w-full">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, delay: 0.5 }}
				className="absolute -inset-4 bg-gradient-to-r from-[#63d392]/40 to-[#156469]/40 rounded-2xl blur-xl"
			/>

			<motion.div
				initial={{ y: 30, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.3 }}
				className="relative z-10 max-w-full"
			>
				{/* Main card with browser look */}
				<div className="bg-[#0f2a2c] rounded-xl overflow-hidden border border-[#63d392]/30 shadow-2xl">
					{/* Browser header */}
					<div className="bg-[#0a1f21] px-4 py-3 flex items-center justify-between border-b border-[#63d392]/20">
						<div className="flex items-center space-x-2">
							<div className="w-3 h-3 rounded-full bg-red-500"></div>
							<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div className="w-3 h-3 rounded-full bg-green-500"></div>
						</div>
						<div className="text-xs text-gray-400">
							noteMeet - Sprint Planning
						</div>
						<div className="w-4"></div>
					</div>

					{/* Browser content */}
					<div className="p-4 md:p-6">
						{/* Meeting info */}
						<div className="mb-6">
							<h3 className="text-white text-lg font-medium mb-1">
								Daily Standup - Frontend Team
							</h3>
							<div className="flex flex-wrap gap-2 text-xs">
								<span className="text-gray-400">Mar 1, 2025</span>
								<span className="text-gray-400">•</span>
								<span className="text-gray-400">15 minutes</span>
								<span className="text-gray-400">•</span>
								<span className="text-[#63d392]">5 participants</span>
							</div>
						</div>

						{/* Processing Animation */}
						<AnimatePresence>
							{showProcessing && (
								<motion.div
									className="py-12"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0, transition: { duration: 0.3 } }}
								>
									<div className="flex flex-col items-center justify-center">
										<div className="relative">
											<svg className="w-20 h-20" viewBox="0 0 50 50">
												<motion.circle
													cx="25"
													cy="25"
													r="20"
													fill="none"
													stroke="#156469"
													strokeWidth="2"
												/>
												<motion.circle
													cx="25"
													cy="25"
													r="20"
													fill="none"
													stroke="#63d392"
													strokeWidth="2"
													initial={{ pathLength: 0 }}
													animate={{
														pathLength: [0, processingStep / 3],
														rotate: [0, 360],
													}}
													transition={{
														pathLength: { duration: 1, ease: 'easeInOut' },
														rotate: {
															repeat: Infinity,
															duration: 3,
															ease: 'linear',
														},
													}}
													style={{
														scaleX: -1,
														rotate: '90deg',
														transformOrigin: 'center',
													}}
												/>
											</svg>
											<motion.div
												className="absolute inset-0 flex items-center justify-center"
												initial={{ scale: 0.7, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												transition={{ delay: 0.3 }}
											>
												{processingStep === 0 && (
													<Clock className="h-8 w-8 text-[#63d392]" />
												)}
												{processingStep === 1 && (
													<FileText className="h-8 w-8 text-[#63d392]" />
												)}
												{processingStep === 2 && (
													<BarChart3 className="h-8 w-8 text-[#63d392]" />
												)}
												{processingStep === 3 && (
													<ListChecks className="h-8 w-8 text-[#63d392]" />
												)}
											</motion.div>
										</div>
										<motion.p
											className="text-[#63d392] font-medium mt-6 text-center"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											key={processingStep}
										>
											{processingSteps[processingStep]}
										</motion.p>
										<p className="text-gray-400 text-sm mt-2 text-center">
											Please wait while we process your meeting...
										</p>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Tabs Navigation - Only show when processing is complete */}
						<AnimatePresence>
							{!showProcessing && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}
								>
									<div className="flex border-b border-[#156469]/50 mb-4">
										<button
											className={`px-4 py-2 text-sm font-medium transition-colors ${
												activeTab === 'transcript'
													? 'border-b-2 border-[#63d392] text-[#63d392]'
													: 'text-gray-400 hover:text-white'
											}`}
											onClick={() => setActiveTab('transcript')}
										>
											<span className="flex items-center">
												<FileText className="h-3.5 w-3.5 mr-1.5" />
												Transcript
											</span>
										</button>
										<button
											className={`px-4 py-2 text-sm font-medium transition-colors ${
												activeTab === 'tasks'
													? 'border-b-2 border-[#63d392] text-[#63d392]'
													: 'text-gray-400 hover:text-white'
											}`}
											onClick={() => setActiveTab('tasks')}
										>
											<span className="flex items-center">
												<ListChecks className="h-3.5 w-3.5 mr-1.5" />
												Tasks
											</span>
										</button>
										<button
											className={`px-4 py-2 text-sm font-medium transition-colors ${
												activeTab === 'summary'
													? 'border-b-2 border-[#63d392] text-[#63d392]'
													: 'text-gray-400 hover:text-white'
											}`}
											onClick={() => setActiveTab('summary')}
										>
											<span className="flex items-center">
												<BarChart3 className="h-3.5 w-3.5 mr-1.5" />
												Summary
											</span>
										</button>
									</div>

									{/* Tab Content */}
									<AnimatePresence mode="wait">
										{activeTab === 'transcript' && (
											<motion.div
												key="transcript"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: 10 }}
												transition={{ duration: 0.3 }}
												className="space-y-3 mb-6"
											>
												<div className="flex justify-between items-center mb-3">
													<h4 className="text-[#63d392] text-sm uppercase tracking-wider font-medium">
														Meeting Transcript
													</h4>
													<button
														className="text-xs flex items-center text-white bg-[#156469]/50 hover:bg-[#156469]/70 px-2 py-1 rounded-md transition-colors"
														onClick={handleCopy}
													>
														{copied ? (
															<>
																<Check className="h-3 w-3 mr-1" />
																Copied
															</>
														) : (
															<>
																<Copy className="h-3 w-3 mr-1" />
																Copy
															</>
														)}
													</button>
												</div>

												<div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
													{transcriptLines.map((line, index) => (
														<motion.div
															key={index}
															initial={{ opacity: 0, x: -10 }}
															animate={{ opacity: 1, x: 0 }}
															transition={{
																duration: 0.5,
																delay: 0.1 + index * 0.1,
															}}
															className="bg-[#156469]/20 p-3 rounded"
														>
															<div className="flex">
																<Avatar className="h-6 w-6 mr-3">
																	<AvatarImage
																		src={teamMembers[index % 4].avatar}
																	/>
																	<AvatarFallback className="text-[9px] bg-[#156469] text-white">
																		{teamMembers[index % 4].initials}
																	</AvatarFallback>
																</Avatar>
																<div>
																	<div className="flex items-center">
																		<p className="text-[#63d392] text-xs font-medium">
																			{teamMembers[index % 4].name}
																		</p>
																		<span className="text-gray-500 text-xs ml-2">
																			10:0{index + 1} AM
																		</span>
																	</div>
																	<p className="text-gray-300 text-sm break-words mt-1">
																		{line}
																	</p>
																</div>
															</div>
														</motion.div>
													))}
												</div>
											</motion.div>
										)}

										{activeTab === 'tasks' && (
											<motion.div
												key="tasks"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: 10 }}
												transition={{ duration: 0.3 }}
											>
												{/* Actionable Tasks Section */}
												<div>
													<div className="flex justify-between items-center mb-3">
														<h4 className="text-[#63d392] text-sm uppercase tracking-wider font-medium">
															AI-Recommended Tasks
														</h4>
														<motion.button
															whileHover={{ scale: 1.05 }}
															whileTap={{ scale: 0.95 }}
															className="text-xs text-white bg-[#156469]/50 hover:bg-[#156469]/70 px-2 py-1 rounded-md transition-colors"
															onClick={() => setTaskShowcase(!taskShowcase)}
														>
															Create Tasks
														</motion.button>
													</div>

													<div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
														{actionableTasks.map((task, index) => (
															<motion.div
																key={index}
																initial={{ opacity: 0, y: 15 }}
																animate={{
																	opacity: 1,
																	y: 0,
																	x:
																		taskShowcase && index === 0
																			? [0, -5, 0]
																			: 0,
																	scale:
																		taskShowcase && index === 0
																			? [1, 1.03, 1]
																			: 1,
																}}
																transition={{
																	duration: 0.5,
																	delay: taskShowcase ? 0 : 0.8 + index * 0.2,
																	x: {
																		duration: 0.3,
																		repeat: taskShowcase ? 1 : 0,
																		repeatType: 'reverse',
																	},
																	scale: {
																		duration: 0.3,
																		repeat: taskShowcase ? 1 : 0,
																		repeatType: 'reverse',
																	},
																}}
																className={`bg-[#156469]/20 p-3 rounded-lg border ${
																	taskShowcase && index === 0
																		? 'border-[#63d392]/50'
																		: 'border-[#63d392]/10 hover:border-[#63d392]/30'
																} transition-colors`}
															>
																<div className="flex justify-between items-start mb-2">
																	<div className="flex items-center">
																		<motion.div
																			whileHover={{ scale: 1.1 }}
																			whileTap={{ scale: 0.9 }}
																			className="cursor-pointer"
																		>
																			<CheckCircle2
																				className={`h-4 w-4 ${
																					taskShowcase && index === 0
																						? 'text-[#63d392] animate-pulse'
																						: 'text-[#63d392]'
																				} mr-2 flex-shrink-0`}
																			/>
																		</motion.div>
																		<p className="text-white text-sm font-medium">
																			{task.task}
																		</p>
																	</div>
																	<div>
																		<Badge
																			className={
																				task.priority === 'High'
																					? 'bg-amber-500/70 hover:bg-amber-500/60 text-amber-50 text-xs'
																					: task.priority === 'Critical'
																						? 'bg-red-500/70 hover:bg-red-500/60 text-red-50 text-xs'
																						: 'bg-[#63d392]/70 hover:bg-[#63d392]/60 text-[#0a4a4e] text-xs'
																			}
																		>
																			{task.priority}
																		</Badge>
																	</div>
																</div>

																<div className="flex justify-between items-center mt-2 text-xs">
																	<div className="flex items-center">
																		<Avatar
																			className={`h-5 w-5 mr-2 ${
																				taskShowcase && index === 0
																					? 'ring-1 ring-[#63d392]'
																					: ''
																			}`}
																		>
																			<AvatarImage src={task.assignee.avatar} />
																			<AvatarFallback className="text-[8px] bg-[#156469] text-white">
																				{task.assignee.initials}
																			</AvatarFallback>
																		</Avatar>
																		<span className="text-gray-300">
																			{task.assignee.name}
																		</span>
																	</div>
																	<div className="flex items-center">
																		<CalendarClock className="h-3 w-3 text-gray-400 mr-1" />
																		<span
																			className={`${
																				taskShowcase && index === 0
																					? 'text-[#63d392]'
																					: 'text-gray-400'
																			}`}
																		>
																			{task.deadline}
																		</span>
																	</div>
																</div>
															</motion.div>
														))}
													</div>
												</div>

												{/* Follow-up Recommendations */}
												<motion.div
													initial={{ opacity: 0, y: 15 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 0.5, delay: 1.8 }}
													className="mt-6"
												>
													<h4 className="text-[#63d392] text-sm uppercase tracking-wider font-medium mb-3">
														Follow-up Reminders
													</h4>
													<div className="bg-[#156469]/30 rounded-lg p-4 border border-[#63d392]/30">
														<ul className="space-y-3">
															<motion.li
																initial={{ opacity: 0 }}
																animate={{ opacity: 1 }}
																transition={{ delay: 2.0 }}
																className="flex items-start"
																whileHover={{ x: 3 }}
															>
																<AlertCircle className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
																<div>
																	<p className="text-white text-sm">
																		Schedule follow-up on staging environment
																		fix
																	</p>
																	<p className="text-gray-400 text-xs mt-0.5">
																		Tomorrow, 10:00 AM
																	</p>
																</div>
															</motion.li>
															<motion.li
																initial={{ opacity: 0 }}
																animate={{ opacity: 1 }}
																transition={{ delay: 2.2 }}
																className="flex items-start"
																whileHover={{ x: 3 }}
															>
																<AlertCircle className="h-4 w-4 text-[#63d392] mr-2 flex-shrink-0 mt-0.5" />
																<div>
																	<p className="text-white text-sm">
																		Check PR review status for dashboard
																		components
																	</p>
																	<p className="text-gray-400 text-xs mt-0.5">
																		Today, 5:00 PM
																	</p>
																</div>
															</motion.li>
														</ul>
													</div>
												</motion.div>

												{/* Status label */}
												<motion.div
													className="flex justify-between items-center mt-6"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ duration: 0.5, delay: 2.6 }}
												>
													<motion.button
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
														className="text-xs text-[#63d392] border border-[#63d392]/30 hover:bg-[#63d392]/10 px-3 py-1.5 rounded-md transition-colors"
													>
														Export Tasks
													</motion.button>
													<div className="bg-gradient-to-r from-[#63d392] to-[#4fb87a] text-[#0a4a4e] px-4 py-2 rounded-full text-sm font-medium">
														3 Tasks Generated ✓
													</div>
												</motion.div>
											</motion.div>
										)}

										{activeTab === 'summary' && (
											<motion.div
												key="summary"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: 10 }}
												transition={{ duration: 0.3 }}
											>
												<div className="flex justify-between items-center mb-4">
													<h4 className="text-[#63d392] text-sm uppercase tracking-wider font-medium">
														AI Meeting Summary
													</h4>
													<button
														className="text-xs flex items-center text-white bg-[#156469]/50 hover:bg-[#156469]/70 px-2 py-1 rounded-md transition-colors"
														onClick={handleCopy}
													>
														{copied ? (
															<>
																<Check className="h-3 w-3 mr-1" />
																Copied
															</>
														) : (
															<>
																<Copy className="h-3 w-3 mr-1" />
																Copy
															</>
														)}
													</button>
												</div>

												<div className="space-y-6 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
													{summaryPoints.map((section, sIndex) => (
														<motion.div
															key={sIndex}
															initial={{ opacity: 0, y: 10 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{
																duration: 0.4,
																delay: sIndex * 0.2,
															}}
														>
															<h5 className="text-white font-medium text-sm mb-2">
																{section.title}
															</h5>
															<ul className="space-y-2 pl-1">
																{section.items.map((item, iIndex) => (
																	<motion.li
																		key={iIndex}
																		initial={{ opacity: 0, x: -5 }}
																		animate={{ opacity: 1, x: 0 }}
																		transition={{
																			duration: 0.3,
																			delay: sIndex * 0.2 + iIndex * 0.1 + 0.2,
																		}}
																		className="flex items-baseline"
																	>
																		<span className="text-[#63d392] mr-2">
																			•
																		</span>
																		<span className="text-gray-300 text-sm">
																			{item}
																		</span>
																	</motion.li>
																))}
															</ul>
														</motion.div>
													))}

													<motion.div
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														transition={{ delay: 1 }}
														className="bg-[#156469]/30 rounded-lg p-4 border border-[#63d392]/20 mt-4"
													>
														<p className="text-sm text-white font-medium mb-1">
															Next Steps
														</p>
														<p className="text-xs text-gray-300">
															The team should focus on fixing the staging
															environment as the highest priority, followed by
															completing the PR review for dashboard components.
															API optimization can be addressed once these
															blocking issues are resolved.
														</p>
														<div className="mt-3 flex justify-end">
															<Button
																size="sm"
																className="bg-[#63d392]/20 hover:bg-[#63d392]/30 text-[#63d392] text-xs py-1 h-auto"
															>
																Create Calendar Event{' '}
																<ArrowRight className="ml-1 h-3 w-3" />
															</Button>
														</div>
													</motion.div>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</motion.div>

			{/* Floating elements - Fixed positioning for better responsiveness */}
			<motion.div
				initial={{ opacity: 0, y: -20, x: 30 }}
				animate={{ opacity: 1, y: 0, x: 0 }}
				transition={{ duration: 0.7, delay: 1.5 }}
				className="absolute top-8 -right-12 bg-[#156469] bg-opacity-70 backdrop-blur-sm p-3 rounded-lg border border-[#63d392]/20 shadow-lg hidden md:block"
			>
				<div className="flex items-center">
					<div className="w-8 h-8 rounded-full bg-[#63d392]/20 flex items-center justify-center mr-3">
						<UserCircle2 className="h-4 w-4 text-[#63d392]" />
					</div>
					<p className="text-white text-xs">Task assignments ready</p>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20, x: -30 }}
				animate={{ opacity: 1, y: 0, x: 0 }}
				transition={{ duration: 0.7, delay: 1.9 }}
				className="absolute -bottom-6 -left-8 bg-[#156469] bg-opacity-70 backdrop-blur-sm p-3 rounded-lg border border-[#63d392]/20 shadow-lg hidden md:block"
			>
				<div className="flex items-center">
					<div className="w-8 h-8 rounded-full bg-[#63d392]/20 flex items-center justify-center mr-3">
						<Clock className="h-4 w-4 text-[#63d392]" />
					</div>
					<p className="text-white text-xs">Ready in 2 minutes</p>
				</div>
			</motion.div>
		</div>
	);
};
