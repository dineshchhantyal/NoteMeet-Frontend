'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
	CheckCircle2,
	ArrowRight,
	Play,
	Clock,
	Brain,
	Sparkles,
	UserCircle2,
	CalendarClock,
	AlertCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const HeroSection = () => {
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

	// Sample transcript lines that will animate in - Software Development Standup
	const transcriptLines = [
		"I've completed the authentication flow refactoring yesterday",
		'Currently working on optimizing API response times',
		'Sarah, could you review my PR for the dashboard components?',
		'Blocking issue: we need DevOps to fix the staging environment',
	];

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
								className="bg-gradient-to-r from-[#63d392] to-[#4fb87a] text-[#0a4a4e] font-semibold hover:shadow-lg hover:shadow-[#63d392]/30 transform transition-all duration-300 text-base px-8"
							>
								Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
							</Button>

							<Button
								size="lg"
								variant="outline"
								className="border-2 border-[#63d392] text-[#63d392] hover:bg-[#63d392]/10 hover:text-white transition-all duration-300 text-base px-8 group"
							>
								<Play className="mr-2 h-4 w-4 group-hover:scale-125 transition-transform duration-300" />
								Watch Demo
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

					{/* Right Column - App Demo */}
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

									{/* Tabs Navigation */}
									<div className="flex border-b border-[#156469]/50 mb-4">
										<button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">
											Transcript
										</button>
										<button className="px-4 py-2 text-sm font-medium border-b-2 border-[#63d392] text-[#63d392]">
											Tasks
										</button>
										<button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">
											Summary
										</button>
									</div>

									{/* Actionable Tasks Section */}
									<div>
										<div className="flex justify-between items-center mb-3">
											<h4 className="text-[#63d392] text-sm uppercase tracking-wider font-medium">
												AI-Recommended Tasks
											</h4>
											<button className="text-xs text-white bg-[#156469]/50 hover:bg-[#156469]/70 px-2 py-1 rounded-md transition-colors">
												Create Tasks
											</button>
										</div>

										<div className="space-y-3">
											{actionableTasks.map((task, index) => (
												<motion.div
													key={index}
													initial={{ opacity: 0, y: 15 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{
														duration: 0.5,
														delay: 0.8 + index * 0.2,
													}}
													className="bg-[#156469]/20 p-3 rounded-lg border border-[#63d392]/10 hover:border-[#63d392]/30 transition-colors"
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
													transition={{ delay: 2.2 }}
													className="flex items-start"
												>
													<AlertCircle className="h-4 w-4 text-[#63d392] mr-2 flex-shrink-0 mt-0.5" />
													<div>
														<p className="text-white text-sm">
															Check PR review status for dashboard components
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
										<button className="text-xs text-[#63d392] border border-[#63d392]/30 hover:bg-[#63d392]/10 px-3 py-1.5 rounded-md transition-colors">
											Export Tasks
										</button>
										<div className="bg-gradient-to-r from-[#63d392] to-[#4fb87a] text-[#0a4a4e] px-4 py-2 rounded-full text-sm font-medium">
											3 Tasks Generated ✓
										</div>
									</motion.div>
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
				</div>
			</div>
		</section>
	);
};
