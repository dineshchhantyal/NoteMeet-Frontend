'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Step1Schedule } from './Step1Schedule';
import { Step2Recording } from './Step2Recording';
import { Step3Processing } from './Step3Processing';
import { Step4Results } from './Step4Results';

export const MeetingDemoFlow = () => {
	// State for controlling which step is shown
	const [currentStep, setCurrentStep] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	// Array of steps to display
	const steps = [
		{
			title: 'Schedule or Join',
			component: <Step1Schedule />,
			description: 'Connect your calendar or join a meeting directly',
		},
		{
			title: 'Meeting Recording',
			component: <Step2Recording />,
			description: 'NoteMeet automatically records and transcribes',
		},
		{
			title: 'AI Processing',
			component: <Step3Processing />,
			description: 'Our AI analyzes the content in minutes',
		},
		{
			title: 'Ready Results',
			component: <Step4Results />,
			description: 'Get summaries, tasks, and action items',
		},
	];

	// Auto-advance through demo steps
	useEffect(() => {
		if (isAutoPlaying) {
			const timer = setTimeout(() => {
				setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
			}, 8000); // 8 seconds per step

			return () => clearTimeout(timer);
		}
	}, [currentStep, isAutoPlaying, steps.length]);

	const goToNextStep = () => {
		setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
		setIsAutoPlaying(false);
	};

	const goToPrevStep = () => {
		setCurrentStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
		setIsAutoPlaying(false);
	};

	return (
		<div className="relative lg:h-auto lg:w-full">
			{/* Background glow effect */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1 }}
				className="absolute -inset-4 bg-gradient-to-r from-[#63d392]/40 to-[#156469]/40 rounded-2xl blur-xl"
			/>

			<div className="relative z-10 overflow-hidden rounded-xl border border-[#63d392]/30 shadow-2xl bg-[#0f2a2c]">
				{/* Header with steps indicator */}
				<div className="bg-[#0a1f21] px-4 py-3 border-b border-[#63d392]/20">
					<div className="flex justify-between items-center">
						<div className="flex items-center space-x-2">
							<div className="w-3 h-3 rounded-full bg-red-500"></div>
							<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div className="w-3 h-3 rounded-full bg-green-500"></div>
						</div>
						<div className="text-xs text-gray-400">noteMeet - How It Works</div>
						<div className="w-4"></div>
					</div>

					{/* Step progress indicator */}
					<div className="flex justify-center mt-3">
						<div className="flex space-x-2">
							{steps.map((_, index) => (
								<motion.button
									key={index}
									className={`h-1.5 rounded-full transition-all ${
										currentStep === index
											? 'bg-[#63d392] w-8'
											: 'bg-[#63d392]/30 w-4'
									}`}
									onClick={() => {
										setCurrentStep(index);
										setIsAutoPlaying(false);
									}}
									whileHover={{ scale: 1.1 }}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Content area */}
				<div className="p-4 md:p-6">
					{/* Step title */}
					<div className="mb-6 flex justify-between items-center">
						<div>
							<h3 className="text-white text-lg font-medium mb-1">
								{steps[currentStep].title}
							</h3>
							<p className="text-gray-400 text-sm">
								{steps[currentStep].description}
							</p>
						</div>

						{/* Pause/Play Button */}
						<Button
							size="sm"
							variant="outline"
							className="border-[#63d392]/30 hover:bg-[#63d392]/10 text-[#63d392]"
							onClick={() => setIsAutoPlaying(!isAutoPlaying)}
						>
							{isAutoPlaying ? 'Pause Demo' : 'Auto Play'}
						</Button>
					</div>

					{/* Step content with animation */}
					<div className="relative h-[400px] overflow-hidden">
						<AnimatePresence mode="wait">
							<motion.div
								key={currentStep}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.5 }}
								className="h-full"
							>
								{steps[currentStep].component}
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Navigation buttons */}
					<div className="flex justify-between mt-6">
						<Button
							size="sm"
							variant="outline"
							className="border-[#63d392]/30 hover:bg-[#63d392]/10 text-[#63d392]"
							onClick={goToPrevStep}
						>
							<ChevronLeft className="h-4 w-4 mr-2" />
							Previous
						</Button>

						<Button
							size="sm"
							className="bg-[#63d392] hover:bg-[#4fb87a] text-[#0a4a4e]"
							onClick={goToNextStep}
						>
							Next
							<ChevronRight className="h-4 w-4 ml-2" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
