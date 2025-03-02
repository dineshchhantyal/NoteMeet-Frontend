'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
	FileText,
	ListChecks,
	BarChart3,
	Share2,
	Download,
	MessageSquareText,
	Calendar,
	Copy,
	Check,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample participants
const participants = [
	{
		name: 'Sarah Johnson',
		role: 'Marketing Director',
		avatar: '/avatars/sarah.png',
		initials: 'SJ',
	},
	{
		name: 'Michael Chen',
		role: 'Product Manager',
		avatar: '/avatars/alex.png',
		initials: 'MC',
	},
	{
		name: 'Emma Garcia',
		role: 'Sales Lead',
		avatar: '/avatars/taylor.png',
		initials: 'EG',
	},
	{
		name: 'David Wong',
		role: 'Creative Director',
		avatar: '/avatars/miguel.png',
		initials: 'DW',
	},
];

// Business-friendly transcript lines for a marketing meeting
const transcriptLines = [
	{
		time: '0:05',
		speaker: 'Sarah',
		text: "Welcome to our quarterly marketing review. Today we'll cover campaign results and next steps.",
	},
	{
		time: '1:23',
		speaker: 'Emma',
		text: 'The email campaign had a 32% open rate, beating industry average by 10 points.',
	},
	{
		time: '2:47',
		speaker: 'Michael',
		text: 'Website traffic increased by 45% during the promotion period.',
	},
	{
		time: '3:15',
		speaker: 'David',
		text: 'The new brand assets are driving better engagement across all channels.',
	},
	{
		time: '4:30',
		speaker: 'Sarah',
		text: "We need to finalize the budget for next quarter's campaign by Friday.",
	},
	{
		time: '6:05',
		speaker: 'Emma',
		text: 'I suggest we increase social media advertising by 20% based on these results.',
	},
];

// Summary points for marketing meeting
const summaryPoints = [
	{
		title: 'Key Discussion Points',
		items: [
			'Email campaign exceeded industry benchmarks by 10 points',
			'Website traffic increased by 45% during promotion',
			'New brand assets performing well across channels',
			'Budget planning needed for next quarter',
		],
	},
	{
		title: 'Decisions Made',
		items: [
			'Increase social media advertising budget by 20%',
			'Continue with current email marketing strategy',
			'Review brand assets performance monthly',
		],
	},
];

// Action items with assignees
const actionItems = [
	{
		task: 'Finalize Q2 marketing budget',
		assignee: participants[0], // Sarah
		deadline: 'Friday, 5:00 PM',
		priority: 'High',
	},
	{
		task: 'Prepare social media campaign proposal',
		assignee: participants[2], // Emma
		deadline: 'Next Monday, 10:00 AM',
		priority: 'Medium',
	},
	{
		task: 'Schedule monthly brand asset review meeting',
		assignee: participants[3], // David
		deadline: 'Tomorrow, 3:00 PM',
		priority: 'Low',
	},
];

export const Step4Results = () => {
	const [activeTab, setActiveTab] = useState('summary');
	const [copied, setCopied] = useState(false);
	const [taskHighlight, setTaskHighlight] = useState<number | null>(null);

	// Handle copy animation
	const handleCopy = () => {
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// Animation for highlighting tasks
	useEffect(() => {
		if (activeTab === 'tasks') {
			const interval = setInterval(() => {
				setTaskHighlight((prev) => {
					if (prev === null) return 0;
					return (prev + 1) % actionItems.length;
				});
			}, 3000);

			return () => clearInterval(interval);
		}

		return () => setTaskHighlight(null);
	}, [activeTab]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="flex flex-col h-full bg-[#0f2a2c] rounded-xl overflow-hidden"
		>
			{/* Header */}
			<div className="bg-[#0a1f21] px-4 py-3 border-b border-[#156469]/50">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-white font-medium">
							Quarterly Marketing Review
						</h3>
						<div className="flex items-center mt-1">
							<Calendar className="h-3 w-3 text-gray-400 mr-1" />
							<span className="text-xs text-gray-400">March 1, 2025</span>
							<span className="text-gray-500 mx-2">•</span>
							<span className="text-xs text-gray-400">45 minutes</span>
							<Badge className="ml-2 bg-[#63d392]/20 text-[#63d392] text-xs">
								Completed
							</Badge>
						</div>
					</div>

					<div className="flex -space-x-2">
						{participants.map((p, i) => (
							<Avatar key={i} className="h-6 w-6 border-2 border-[#0a1f21]">
								<AvatarImage src={p.avatar} />
								<AvatarFallback className="bg-[#156469] text-white text-xs">
									{p.initials}
								</AvatarFallback>
							</Avatar>
						))}
					</div>
				</div>
			</div>

			{/* Tab Navigation */}
			<Tabs
				defaultValue="summary"
				className="flex-1 flex flex-col"
				value={activeTab}
				onValueChange={setActiveTab}
			>
				<TabsList className="bg-[#0a1f21] border-b border-[#156469]/50 rounded-none px-4 h-auto py-1">
					<TabsTrigger
						value="summary"
						className="data-[state=active]:text-[#63d392] data-[state=active]:border-b-2 data-[state=active]:border-[#63d392] rounded-none"
					>
						<BarChart3 className="h-4 w-4 mr-2" />
						Summary
					</TabsTrigger>
					<TabsTrigger
						value="tasks"
						className="data-[state=active]:text-[#63d392] data-[state=active]:border-b-2 data-[state=active]:border-[#63d392] rounded-none"
					>
						<ListChecks className="h-4 w-4 mr-2" />
						Action Items
					</TabsTrigger>
					<TabsTrigger
						value="transcript"
						className="data-[state=active]:text-[#63d392] data-[state=active]:border-b-2 data-[state=active]:border-[#63d392] rounded-none"
					>
						<FileText className="h-4 w-4 mr-2" />
						Transcript
					</TabsTrigger>
				</TabsList>

				<div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
					{/* Summary Tab */}
					<TabsContent value="summary" className="m-0">
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="flex justify-between mb-4"
						>
							<h4 className="text-[#63d392] text-sm font-medium">
								Meeting Summary
							</h4>
							<div className="flex space-x-2">
								<Button
									variant="outline"
									size="sm"
									className="h-8 text-xs border-[#156469] text-gray-300 hover:bg-[#156469]/10"
								>
									<Share2 className="h-3.5 w-3.5 mr-1" />
									Share
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="h-8 text-xs border-[#156469] text-gray-300 hover:bg-[#156469]/10"
									onClick={handleCopy}
								>
									{copied ? (
										<Check className="h-3.5 w-3.5 mr-1 text-[#63d392]" />
									) : (
										<Copy className="h-3.5 w-3.5 mr-1" />
									)}
									{copied ? 'Copied' : 'Copy'}
								</Button>
							</div>
						</motion.div>

						{/* Summary content */}
						<div className="space-y-6">
							{summaryPoints.map((section, idx) => (
								<motion.div
									key={idx}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: idx * 0.2 }}
								>
									<h5 className="text-white font-medium mb-2">
										{section.title}
									</h5>
									<ul className="space-y-2">
										{section.items.map((item, i) => (
											<motion.li
												key={i}
												className="flex items-start text-gray-300 text-sm"
												initial={{ opacity: 0, x: -5 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: idx * 0.2 + i * 0.1 }}
											>
												<div className="h-4 w-4 rounded-full bg-[#156469]/40 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
													<div className="h-1.5 w-1.5 rounded-full bg-[#63d392]" />
												</div>
												{item}
											</motion.li>
										))}
									</ul>
								</motion.div>
							))}

							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.8 }}
							>
								<div className="p-3 bg-[#156469]/20 rounded-md border border-[#156469]/40 mt-6">
									<div className="flex items-center mb-2">
										<MessageSquareText className="h-4 w-4 text-[#63d392] mr-2" />
										<h5 className="text-white font-medium">AI Insights</h5>
									</div>
									<p className="text-gray-300 text-sm">
										The team is focused on leveraging successful campaign
										results. Consider establishing clear metrics for the
										increased social media budget to track ROI effectively.
									</p>
								</div>
							</motion.div>
						</div>
					</TabsContent>

					{/* Tasks Tab */}
					<TabsContent value="tasks" className="m-0">
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="flex justify-between mb-4"
						>
							<h4 className="text-[#63d392] text-sm font-medium">
								Action Items ({actionItems.length})
							</h4>
							<Button
								variant="outline"
								size="sm"
								className="h-8 text-xs border-[#156469] text-gray-300 hover:bg-[#156469]/10"
							>
								<Download className="h-3.5 w-3.5 mr-1" />
								Export Tasks
							</Button>
						</motion.div>

						<div className="space-y-3">
							{actionItems.map((task, idx) => (
								<motion.div
									key={idx}
									className={`bg-[#156469]/20 p-3 rounded-lg border ${
										taskHighlight === idx
											? 'border-[#63d392]/80'
											: 'border-[#156469]/40'
									} hover:border-[#63d392]/50 transition-colors`}
									initial={{ opacity: 0, y: 15 }}
									animate={{
										opacity: 1,
										y: 0,
										scale: taskHighlight === idx ? 1.02 : 1,
										borderColor:
											taskHighlight === idx
												? 'rgba(99, 211, 146, 0.8)'
												: 'rgba(21, 100, 105, 0.4)',
									}}
									transition={{ delay: idx * 0.15 }}
								>
									<div className="flex justify-between items-start mb-2">
										<div className="flex items-center">
											<div className="h-5 w-5 rounded flex items-center justify-center border border-[#63d392]/50 mr-2.5 flex-shrink-0">
												<motion.div
													className="h-3 w-3 bg-[#63d392] rounded-sm"
													initial={{ opacity: 0, scale: 0 }}
													animate={
														taskHighlight === idx
															? { opacity: 1, scale: 1 }
															: { opacity: 0, scale: 0 }
													}
													transition={{ duration: 0.2 }}
												/>
											</div>
											<p className="text-white text-sm font-medium">
												{task.task}
											</p>
										</div>
										<Badge
											className={
												task.priority === 'High'
													? 'bg-amber-500/70 text-amber-50 text-xs'
													: task.priority === 'Medium'
														? 'bg-blue-500/70 text-blue-50 text-xs'
														: 'bg-[#63d392]/70 text-[#0a4a4e] text-xs'
											}
										>
											{task.priority}
										</Badge>
									</div>

									<div className="flex justify-between items-center mt-3 text-xs pl-7">
										<div className="flex items-center">
											<Avatar className="h-5 w-5 mr-2">
												<AvatarImage src={task.assignee.avatar} />
												<AvatarFallback className="bg-[#156469] text-white text-[8px]">
													{task.assignee.initials}
												</AvatarFallback>
											</Avatar>
											<span className="text-gray-300">
												{task.assignee.name}
											</span>
										</div>
										<div className="flex items-center">
											<Calendar className="h-3 w-3 text-gray-400 mr-1" />
											<span className="text-gray-400">{task.deadline}</span>
										</div>
									</div>
								</motion.div>
							))}
						</div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6 }}
							className="mt-4 flex justify-center"
						>
							<Button className="bg-[#156469]/40 hover:bg-[#156469]/60 text-sm text-white border border-[#156469]">
								Add New Task
							</Button>
						</motion.div>
					</TabsContent>

					{/* Transcript Tab */}
					<TabsContent value="transcript" className="m-0">
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="flex justify-between mb-4"
						>
							<h4 className="text-[#63d392] text-sm font-medium">
								Full Transcript
							</h4>
							<Button
								variant="outline"
								size="sm"
								className="h-8 text-xs border-[#156469] text-gray-300 hover:bg-[#156469]/10"
								onClick={handleCopy}
							>
								{copied ? (
									<Check className="h-3.5 w-3.5 mr-1 text-[#63d392]" />
								) : (
									<Download className="h-3.5 w-3.5 mr-1" />
								)}
								{copied ? 'Copied' : 'Download'}
							</Button>
						</motion.div>

						<div className="space-y-4">
							{transcriptLines.map((line, idx) => (
								<motion.div
									key={idx}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: idx * 0.1 }}
									className="flex"
								>
									<div className="text-gray-400 text-xs w-10 flex-shrink-0 mt-1">
										{line.time}
									</div>
									<div className="ml-2">
										<div className="flex items-center">
											{participants.map(
												(p, i) =>
													p.name.startsWith(line.speaker) && (
														<Avatar key={i} className="h-5 w-5 mr-2">
															<AvatarImage src={p.avatar} />
															<AvatarFallback className="bg-[#156469] text-white text-[8px]">
																{p.initials}
															</AvatarFallback>
														</Avatar>
													),
											)}
											<span className="text-[#63d392] text-sm font-medium">
												{line.speaker}
											</span>
										</div>
										<p className="text-gray-300 text-sm mt-1 pl-7">
											{line.text}
										</p>
									</div>
								</motion.div>
							))}
						</div>
					</TabsContent>
				</div>
			</Tabs>
		</motion.div>
	);
};
