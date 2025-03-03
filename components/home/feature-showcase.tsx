'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mic, FileAudio, Mail, CheckCircle } from 'lucide-react';

// Define brand colors as constants for consistency with other components
const brandColors = {
	primary: 'from-[#0a4a4e] to-[#156469]', // Dark teal gradient
	secondary: 'from-[#63d392] to-[#4fb87a]', // Mint green gradient
	accent1: 'from-[#63d392] to-[#156469]', // Mint to teal gradient
	accent2: 'from-[#156469] to-[#0a4a4e]', // Teal gradient
	buttonGradient: 'from-[#63d392] to-[#4fb87a]', // Mint green button
	textHighlight: 'from-[#63d392] to-[#4fb87a]', // Text highlight
	bgColor: 'bg-[#0a4a4e]', // Background color
	textColor: 'text-[#63d392]', // Text accent color
};
const features = [
	{
		id: 'meetingRecording',
		icon: <Mic size={24} />,
		title: 'Meeting Recording',
		description:
			'Record your meetings seamlessly through our cloud service or browser extension',
		color: `bg-gradient-to-r ${brandColors.secondary}`,
		animation: 'float',
	},
	{
		id: 'autoTranscription',
		icon: <FileAudio size={24} />,
		title: 'Auto Transcription',
		description:
			'AI-powered transcription converts speech to text with high accuracy',
		color: `bg-gradient-to-r ${brandColors.secondary}`,
		animation: 'pulse',
	},
	{
		id: 'emailSummary',
		icon: <Mail size={24} />,
		title: 'Automated Email Summary',
		description:
			'Instant meeting summaries sent to all participants without any manual work',
		color: `bg-gradient-to-r ${brandColors.secondary}`,
		animation: 'bounce',
	},
	{
		id: 'actionItemDistribution',
		icon: <CheckCircle size={24} />,
		title: 'Action Item Distribution',
		description:
			'Automatically extract and assign action items to specific participants',
		color: `bg-gradient-to-r ${brandColors.secondary}`,
		animation: 'scale',
	},
];
export function FeatureShowcase({
	onFeatureClick,
	onTryFreeClick,
}: {
	onFeatureClick?: (featureId: string) => void;
	onTryFreeClick?: () => void;
}) {
	const { ref, inView } = useInView({
		threshold: 0.2,
		triggerOnce: true,
	});

	// Animation variants for the features
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	// Different animation variants based on feature type
	const getFeatureVariant = (animationType: string) => {
		const baseVariant = {
			hidden: { opacity: 0, y: 30 },
			visible: {
				opacity: 1,
				y: 0,
				transition: {
					duration: 0.7,
					ease: 'easeOut',
				},
			},
		};

		switch (animationType) {
			case 'float':
				return {
					...baseVariant,
					animate: {
						y: [0, -10, 0],
						transition: {
							duration: 3,
							repeat: Infinity,
							ease: 'easeInOut',
						},
					},
				};
			case 'pulse':
				return {
					...baseVariant,
					animate: {
						scale: [1, 1.03, 1],
						transition: {
							duration: 2,
							repeat: Infinity,
							ease: 'easeInOut',
						},
					},
				};
			case 'bounce':
				return {
					...baseVariant,
					animate: {
						y: [0, -5, 0],
						transition: {
							duration: 0.8,
							repeat: Infinity,
							ease: 'easeInOut',
							repeatType: 'reverse',
						},
					},
				};
			case 'scale':
				return {
					...baseVariant,
					animate: {
						scale: [1, 1.05, 1],
						transition: {
							duration: 1.5,
							repeat: Infinity,
							ease: 'easeInOut',
						},
					},
				};
			default:
				return baseVariant;
		}
	};

	return (
		<section className={`py-16 ${brandColors.bgColor} overflow-hidden`}>
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className={`text-3xl md:text-4xl font-bold mb-4 text-white`}>
						Our <span className={brandColors.textColor}>Core</span> Features
					</h2>
					<p className="text-lg text-gray-300 max-w-2xl mx-auto">
						Capture every important detail automatically and focus on the
						conversation, not on taking notes.
					</p>
				</motion.div>

				<motion.div
					ref={ref}
					initial="hidden"
					animate={inView ? 'visible' : 'hidden'}
					variants={containerVariants}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
				>
					{features.map((feature, index) => {
						const featureVariant = getFeatureVariant(
							feature.animation || 'default',
						);

						return (
							<motion.div
								key={index}
								whileHover={{ y: -5, transition: { duration: 0.2 } }}
								className="relative bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-[#63d392]/20 hover:border-[#63d392] transition-all duration-300 h-full"
								onClick={() => onFeatureClick?.(feature.id)}
							>
								<motion.div
									className={`absolute w-16 h-16 rounded-full ${feature.color} -top-8 left-6 flex items-center justify-center text-[#0a4a4e] shadow-lg p-3`}
									animate={
										'animate' in featureVariant && feature.animation
											? feature.animation
											: undefined
									}
								>
									{feature.icon}
								</motion.div>
								<div className="mt-6">
									<h3 className="text-xl font-bold mb-3 pt-2 text-white">
										{feature.title}
									</h3>
									<p className="text-gray-300">{feature.description}</p>
								</div>
							</motion.div>
						);
					})}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ delay: 0.6, duration: 0.8 }}
					className="mt-16 text-center"
				>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.98 }}
						className={`px-8 py-3 rounded-lg bg-gradient-to-r ${brandColors.buttonGradient} text-[#0a4a4e] font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300`}
						onClick={onTryFreeClick}
					>
						Try NoteMeet Free
					</motion.button>
				</motion.div>
			</div>
		</section>
	);
}
