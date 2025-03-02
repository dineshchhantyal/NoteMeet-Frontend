'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
	CheckCircle2,
	Clock,
	UserCircle2,
	CalendarClock,
	AlertCircle,
	Play,
	Pause,
	Edit,
	Download,
	Share2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Types for the demo data
interface TeamMember {
	id: number;
	name: string;
	avatar: string;
	initials: string;
}

interface Task {
	id: number;
	task: string;
	assignee: TeamMember;
	priority: 'High' | 'Medium' | 'Critical' | 'Low';
	deadline: string;
	status: 'Pending' | 'In Progress' | 'Not Started' | 'Completed';
}

// Animation variants
const fadeIn = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.6 },
	},
};

const slideUp = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5 },
	},
};

const scaleIn = {
	hidden: { opacity: 0, scale: 0.9 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.4 },
	},
};

export const DemoWindow = () => {
	// Active tab state
	const [activeTab, setActiveTab] = useState('tasks');

	// Demo interaction states
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [demoStage, setDemoStage] = useState(0);
	const [hoveredTask, setHoveredTask] = useState<number | null>(null);
	const [clickedTask, setClickedTask] = useState<number | null>(null);
	const [showTaskActions, setShowTaskActions] = useState(false);
	const [showHint, setShowHint] = useState(false);

	// Position for cursor animation
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [showCursor, setShowCursor] = useState(false);
	const demoRef = useRef<HTMLDivElement>(null);
	const taskRefs = useRef<(HTMLDivElement | null)[]>([]);

	// Timer for auto-advancing demo
	useEffect(() => {
		if (isPlaying) {
			const timer = setInterval(() => {
				setCurrentTime((prev) => {
					const newTime = prev + 1;
					if (newTime > 20) {
						// Reset demo after 20 seconds
						setDemoStage(0);
						return 0;
					}

					// Advance stages based on time
					if (newTime === 2) setDemoStage(1);
					if (newTime === 4) setDemoStage(2);
					if (newTime === 6) {
						setDemoStage(3);
						setShowCursor(true);
						// Animate cursor to first task
						if (taskRefs.current[0]) {
							const rect = taskRefs.current[0].getBoundingClientRect();
							const demoRect = demoRef.current?.getBoundingClientRect();
							if (demoRect) {
								setCursorPosition({
									x: rect.left - demoRect.left + 20,
									y: rect.top - demoRect.top + 20,
								});
							}
						}
					}
					if (newTime === 8) {
						setClickedTask(1);
						setShowTaskActions(true);
					}
					if (newTime === 12) {
						setClickedTask(null);
						setShowTaskActions(false);
						setActiveTab('transcript');
					}
					if (newTime === 16) {
						setActiveTab('tasks');
						setShowCursor(false);
					}

					return newTime;
				});
			}, 1000);

			return () => clearInterval(timer);
		}
	}, [isPlaying]);

	// Sample data
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

	const transcriptLines = [
		"I've completed the authentication flow refactoring yesterday",
		'Currently working on optimizing API response times',
		'Sarah, could you review my PR for the dashboard components?',
		'Blocking issue: we need DevOps to fix the staging environment',
	];

	const actionableTasks: Task[] = [
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

	return (
		<div ref={demoRef} className="relative w-full h-full">
			{/* Demo backdrop glow */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, delay: 0.5 }}
				className="absolute -inset-4 bg-gradient-to-r from-[#63d392]/40 to-[#156469]/40 rounded-2xl blur-xl"
			/>

			{/* Main demo window */}
			<motion.div
				initial={{ y: 30, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.3 }}
				className="relative z-10 max-w-full"
			>
				<div className="bg-[#0f2a2c] rounded-xl overflow-hidden border border-[#63d392]/30 shadow-2xl">
					{/* Browser header with controls */}
					<div className="bg-[#0a1f21] px-4 py-3 flex items-center justify-between border-b border-[#63d392]/20">
						<div className="flex items-center space-x-2">
							<div className="w-3 h-3 rounded-full bg-red-500"></div>
							<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div className="w-3 h-3 rounded-full bg-green-500"></div>
						</div>
						<div className="text-xs text-gray-400">
							NoteMeet - Sprint Planning
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								className="h-6 w-6"
								onClick={() => {
									setIsPlaying(!isPlaying);
									if (!isPlaying) {
										setDemoStage(0);
										setCurrentTime(0);
										setClickedTask(null);
										setShowTaskActions(false);
										setActiveTab('tasks');
										setShowCursor(false);
									}
								}}
							>
								{isPlaying ? (
									<Pause className="h-3 w-3 text-[#63d392]" />
								) : (
									<Play className="h-3 w-3 text-[#63d392]" />
								)}
							</Button>
						</div>
					</div>

					{/* Browser content */}
					<div className="p-4 md:p-6">
						{/* Meeting info */}
						<div className="mb-6">
							<motion.h3
								className="text-white text-lg font-medium mb-1"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5 }}
							>
								Daily Standup - Frontend Team
							</motion.h3>
							<motion.div
								className="flex flex-wrap gap-2 text-xs"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.2 }}
							>
								<span className="text-gray-400">Mar 1, 2025</span>
								<span className="text-gray-400">•</span>
								<span className="text-gray-400">15 minutes</span>
								<span className="text-gray-400">•</span>
								<span className="text-[#63d392]">5 participants</span>
							</motion.div>
						</div>

						{/* Tabs Navigation */}
						<motion.div
							className="flex border-b border-[#156469]/50 mb-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							<button
								onClick={() => setActiveTab('transcript')}
								className={`px-4 py-2 text-sm font-medium transition-colors ${
									activeTab === 'transcript'
										? 'border-b-2 border-[#63d392] text-[#63d392]'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								Transcript
							</button>
							<button
								onClick={() => setActiveTab('tasks')}
								className={`px-4 py-2 text-sm font-medium transition-colors ${
									activeTab === 'tasks'
										? 'border-b-2 border-[#63d392] text-[#63d392]'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								Tasks
							</button>
							<button
								onClick={() => setActiveTab('summary')}
								className={`px-4 py-2 text-sm font-medium transition-colors ${
									activeTab === 'summary'
										? 'border-b-2 border-[#63d392] text-[#63d392]'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								Summary
							</button>
						</motion.div>

						{/* Transcript Tab */}
						<div
							className={`${activeTab === 'transcript' ? 'block' : 'hidden'}`}
						>
							<motion.div
								initial="hidden"
								animate={activeTab === 'transcript' ? 'visible' : 'hidden'}
								variants={fadeIn}
								className="space-y-3"
							>
								{transcriptLines.map((line, index) => (
									<motion.div
										key={index}
										variants={slideUp}
										transition={{ delay: index * 0.1 }}
										className="bg-[#156469]/20 p-3 rounded"
									>
										<p className="text-gray-300 text-sm break-words">{line}</p>
									</motion.div>
								))}

								<motion.div
									variants={slideUp}
									transition={{ delay: 0.5 }}
									className="flex justify-end mt-4"
								>
									<Button
										variant="outline"
										size="sm"
										className="border-[#63d392]/30 text-[#63d392] hover:bg-[#63d392]/10 mr-2"
									>
										<Download className="h-3 w-3 mr-1" /> Export
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="border-[#63d392]/30 text-[#63d392] hover:bg-[#63d392]/10"
									>
										<Edit className="h-3 w-3 mr-1" /> Edit
									</Button>
								</motion.div>
							</motion.div>
						</div>

						{/* Tasks Tab */}
						<div className={`${activeTab === 'tasks' ? 'block' : 'hidden'}`}>
							<div className="relative">
								{/* Task generation progress animation */}
								{demoStage === 0 && (
									<motion.div
										className="bg-[#156469]/30 rounded-lg p-6 text-center"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
									>
										<motion.div
											className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-[#63d392] border-t-transparent"
											animate={{ rotate: 360 }}
											transition={{
												repeat: Infinity,
												duration: 1,
												ease: 'linear',
											}}
										/>
										<p className="text-white text-sm">
											Processing meeting transcript...
										</p>
										<p className="text-gray-400 text-xs mt-1">
											Extracting tasks and action items
										</p>
									</motion.div>
								)}

								{demoStage >= 1 && (
									<motion.div
										initial="hidden"
										animate={activeTab === 'tasks' ? 'visible' : 'hidden'}
										variants={fadeIn}
									>
										<div className="flex justify-between items-center mb-3">
											<h4 className="text-[#63d392] text-sm uppercase tracking-wider font-medium">
												AI-Recommended Tasks
											</h4>
											<button className="text-xs text-white bg-[#156469]/50 hover:bg-[#156469]/70 px-2 py-1 rounded-md transition-colors">
												Create Tasks
											</button>
										</div>

										<div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
											{demoStage >= 2 &&
												actionableTasks.map((task, index) => (
													<motion.div
														key={index}
														ref={(el) => {
															taskRefs.current[index] = el;
														}}
														variants={scaleIn}
														transition={{ delay: index * 0.2 }}
														className={cn(
															'bg-[#156469]/20 p-3 rounded-lg border transition-all duration-200',
															hoveredTask === task.id || clickedTask === task.id
																? 'border-[#63d392]/60 shadow-lg shadow-[#63d392]/10'
																: 'border-[#63d392]/10 hover:border-[#63d392]/30',
														)}
														onMouseEnter={() => setHoveredTask(task.id)}
														onMouseLeave={() => setHoveredTask(null)}
														onClick={() => {
															if (clickedTask === task.id) {
																setClickedTask(null);
																setShowTaskActions(false);
															} else {
																setClickedTask(task.id);
																setShowTaskActions(true);
															}
														}}
													>
														<div className="flex justify-between items-start mb-2">
															<div className="flex items-center">
																<CheckCircle2 className="h-4 w-4 text-[#63d392] mr-2 flex-shrink-0" />
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
																<Avatar className="h-5 w-5 mr-2">
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
																<span className="text-gray-400">
																	{task.deadline}
																</span>
															</div>
														</div>

														{/* Task Actions - Only show for clicked task */}
														{clickedTask === task.id && showTaskActions && (
															<motion.div
																className="mt-3 pt-2 border-t border-[#156469]/30 flex justify-between"
																initial={{ opacity: 0, height: 0 }}
																animate={{ opacity: 1, height: 'auto' }}
																transition={{ duration: 0.2 }}
															>
																<div className="flex gap-1">
																	<Button
																		variant="ghost"
																		size="sm"
																		className="h-6 px-2 py-1 text-xs text-[#63d392] hover:bg-[#63d392]/10"
																	>
																		Edit
																	</Button>
																	<Button
																		variant="ghost"
																		size="sm"
																		className="h-6 px-2 py-1 text-xs text-[#63d392] hover:bg-[#63d392]/10"
																	>
																		Assign
																	</Button>
																</div>
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-6 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
																>
																	Delete
																</Button>
															</motion.div>
														)}
													</motion.div>
												))}
										</div>

										{demoStage >= 2 && (
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.8 }}
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
															transition={{ delay: 0.9 }}
															className="flex items-start"
														>
															<AlertCircle className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
															<div>
																<p className="text-white text-sm">
																	Schedule follow-up on staging environment fix
																</p>
																<p className="text-gray-400 text-xs mt-0.5">
																	Tomorrow, 10:00 AM
																</p>
															</div>
														</motion.li>
														<motion.li
															initial={{ opacity: 0 }}
															animate={{ opacity: 1 }}
															transition={{ delay: 1 }}
															className="flex items-start"
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
										)}

										{demoStage >= 3 && (
											<motion.div
												className="flex justify-between items-center mt-6"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ delay: 1.2 }}
											>
												<button className="text-xs text-[#63d392] border border-[#63d392]/30 hover:bg-[#63d392]/10 px-3 py-1.5 rounded-md transition-colors">
													Export Tasks
												</button>
												<div className="bg-gradient-to-r from-[#63d392] to-[#4fb87a] text-[#0a4a4e] px-4 py-2 rounded-full text-sm font-medium">
													3 Tasks Generated ✓
												</div>
											</motion.div>
										)}
									</motion.div>
								)}

								{/* Interactive cursor for demo */}
								{showCursor && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{
											opacity: 1,
											x: cursorPosition.x,
											y: cursorPosition.y,
										}}
										transition={{
											duration: 0.8,
											ease: 'easeInOut',
										}}
										className="absolute pointer-events-none"
										style={{ left: 0, top: 0 }}
									>
										<div className="w-6 h-6 -ml-3 -mt-3">
											<svg
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M5 3L19 12L12 13.5L14 20.5L11 22L9 14.5L5 17L5 3Z"
													fill="white"
												/>
											</svg>
										</div>
									</motion.div>
								)}

								{/* Interaction hint */}
								{!isPlaying && !showHint && (
									<motion.div
										className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
									>
										<div className="text-center p-6">
											<Play className="h-10 w-10 text-[#63d392] mx-auto mb-4" />
											<p className="text-white font-medium mb-2">
												Click play to see demo
											</p>
											<p className="text-gray-300 text-sm">
												Watch how NoteMeet automatically generates tasks from
												meeting recordings
											</p>
											<Button
												className="mt-4 bg-[#63d392] hover:bg-[#4fb87a] text-[#0a4a4e]"
												onClick={() => {
													setIsPlaying(true);
													setShowHint(true);
												}}
											>
												Start Demo
											</Button>
										</div>
									</motion.div>
								)}
							</div>
						</div>

						{/* Summary Tab */}
						<div className={`${activeTab === 'summary' ? 'block' : 'hidden'}`}>
							<motion.div
								initial="hidden"
								animate={activeTab === 'summary' ? 'visible' : 'hidden'}
								variants={fadeIn}
								className="space-y-6"
							>
								<motion.div
									variants={slideUp}
									className="bg-[#156469]/20 p-4 rounded-lg"
								>
									<h4 className="text-[#63d392] font-medium mb-3">
										Key Points
									</h4>
									<ul className="space-y-2 text-sm text-gray-300">
										<li className="flex items-start">
											<span className="text-[#63d392] mr-2">•</span>
											<span>
												Authentication flow refactoring has been completed
											</span>
										</li>
										<li className="flex items-start">
											<span className="text-[#63d392] mr-2">•</span>
											<span>API response times need optimization</span>
										</li>
										<li className="flex items-start">
											<span className="text-[#63d392] mr-2">•</span>
											<span>Dashboard PR requires review from Sarah</span>
										</li>
										<li className="flex items-start">
											<span className="text-[#63d392] mr-2">•</span>
											<span>
												Staging environment is currently experiencing issues
											</span>
										</li>
									</ul>
								</motion.div>

								<motion.div
									variants={slideUp}
									className="bg-[#156469]/20 p-4 rounded-lg"
								>
									<h4 className="text-[#63d392] font-medium mb-3">
										Meeting Summary
									</h4>
									<p className="text-sm text-gray-300 leading-relaxed">
										In today&apos;s standup, the team discussed progress on the
										authentication flow refactoring, which has been completed.
										Work is ongoing to optimize API response times. There&apos;s
										a blocking issue with the staging environment that requires
										DevOps attention. The dashboard components PR is ready for
										review by Sarah.
									</p>
								</motion.div>

								<motion.div
									variants={slideUp}
									className="flex justify-end gap-2"
								>
									<Button
										variant="outline"
										size="sm"
										className="border-[#63d392]/30 text-[#63d392] hover:bg-[#63d392]/10"
									>
										<Download className="h-3 w-3 mr-1" /> Export
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="border-[#63d392]/30 text-[#63d392] hover:bg-[#63d392]/10"
									>
										<Share2 className="h-3 w-3 mr-1" /> Share
									</Button>
								</motion.div>
							</motion.div>
						</div>

						{/* Demo Instructions */}
						{!isPlaying && activeTab === 'tasks' && demoStage === 0 && (
							<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs animate-pulse">
								Press play to start interactive demo ({currentTime}s)
							</div>
						)}
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
