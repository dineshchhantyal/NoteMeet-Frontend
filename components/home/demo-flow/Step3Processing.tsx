'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Clock, FileText, BarChart3, ListChecks, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const Step3Processing = () => {
	const [processingStep, setProcessingStep] = useState(0);
	const [progress, setProgress] = useState(0);

	// Processing steps animation
	useEffect(() => {
		// Advance through steps with increasing speed (showing AI getting faster)
		const stepTimes = [3000, 2500, 2000, 1500];

		if (processingStep < 4) {
			const timer = setTimeout(() => {
				setProcessingStep((prev) => prev + 1);
			}, stepTimes[processingStep]);

			return () => clearTimeout(timer);
		}
	}, [processingStep]);

	// Update progress bar
	useEffect(() => {
		// Calculate progress percentage based on step
		const targetProgress = processingStep * 25; // 4 steps = 25% each

		// Animate progress smoothly
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev < targetProgress) {
					return prev + 1;
				} else {
					clearInterval(interval);
					return prev;
				}
			});
		}, 30);

		return () => clearInterval(interval);
	}, [processingStep]);

	// Processing steps info - using business-friendly language
	const steps = [
		{
			title: 'Converting Recording',
			description: 'Preparing audio for high accuracy transcription',
			icon: <Clock className="h-8 w-8 text-[#63d392]" />,
			completed: processingStep > 0,
		},
		{
			title: 'Creating Transcript',
			description:
				'Turning conversation into searchable text with speaker identification',
			icon: <FileText className="h-8 w-8 text-[#63d392]" />,
			completed: processingStep > 1,
		},
		{
			title: 'Identifying Key Points',
			description: 'Finding important topics and decisions from your meeting',
			icon: <BarChart3 className="h-8 w-8 text-[#63d392]" />,
			completed: processingStep > 2,
		},
		{
			title: 'Creating Action Items',
			description: 'Identifying tasks and follow-ups for your team',
			icon: <ListChecks className="h-8 w-8 text-[#63d392]" />,
			completed: processingStep > 3,
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="flex flex-col items-center justify-center p-6 bg-[#0f2a2c] rounded-xl h-full"
		>
			<h3 className="text-2xl font-semibold text-white mb-2">
				NoteMeet Magic at Work
			</h3>
			<p className="text-gray-300 mb-8 text-center">
				Turning your meeting into actionable insights in minutes
			</p>

			<div className="w-full max-w-md mb-8">
				<Progress value={progress} className="h-2 bg-[#156469]/30" />
				<div className="flex justify-between mt-2">
					<span className="text-[#63d392] text-xs">{progress}% complete</span>
					<span className="text-gray-400 text-xs">Estimated: 2 minutes</span>
				</div>
			</div>

			<div className="w-full max-w-md space-y-6">
				{steps.map((step, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 10 }}
						animate={{
							opacity: index <= processingStep ? 1 : 0.5,
							y: 0,
						}}
						transition={{ delay: index * 0.2 }}
						className={`flex items-start ${
							step.completed ? 'opacity-100' : 'opacity-50'
						}`}
					>
						<div
							className={`p-3 rounded-full ${
								step.completed
									? 'bg-[#63d392]/20'
									: index === processingStep
										? 'bg-[#156469]/30 animate-pulse'
										: 'bg-[#156469]/10'
							} mr-4`}
						>
							{step.icon}
						</div>

						<div className="flex-1">
							<div className="flex items-center">
								<h4 className="text-white font-medium">{step.title}</h4>

								{index === processingStep && (
									<motion.div
										className="ml-2"
										animate={{ opacity: [0.5, 1, 0.5] }}
										transition={{ repeat: Infinity, duration: 1.5 }}
									>
										<Sparkles className="h-4 w-4 text-[#63d392]" />
									</motion.div>
								)}

								{step.completed && (
									<motion.span
										className="ml-2 text-[#63d392]"
										initial={{ scale: 0.5, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
									>
										✓
									</motion.span>
								)}
							</div>

							<p className="text-gray-400 text-sm mt-1">{step.description}</p>
						</div>
					</motion.div>
				))}
			</div>

			{processingStep >= steps.length && (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="mt-8 bg-[#63d392]/20 p-4 rounded-lg border border-[#63d392]/30 text-center"
				>
					<Sparkles className="h-6 w-6 text-[#63d392] mx-auto mb-2" />
					<p className="text-white font-medium">Processing Complete!</p>
					<p className="text-sm text-gray-300 mt-1">
						Your meeting insights are ready to view
					</p>
				</motion.div>
			)}
		</motion.div>
	);
};
