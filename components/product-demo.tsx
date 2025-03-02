'use client';
import Video from 'next-video';
import NoteMeetAction from '/videos/NoteMeetAction.mp4';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useState } from 'react';

export function ProductDemo() {
	const [isPlaying, setIsPlaying] = useState(false);

	const handlePlayClick = () => {
		setIsPlaying(true);
	};

	return (
		<section className="py-20 bg-[#0a4a4e] overflow-hidden">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
						See NoteMeet in <span className="text-[#63d392]">Action</span>
					</h2>
					<p className="text-gray-300 max-w-2xl mx-auto">
						Watch how NoteMeet transforms your meeting experience, from
						recording to actionable insights
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.7, delay: 0.2 }}
					viewport={{ once: true }}
					className="relative max-w-5xl mx-auto"
				>
					{/* Decorative elements */}
					<div className="absolute -top-5 -bottom-5 -left-5 -right-5 bg-[#156469] rounded-2xl -z-10 transform -rotate-1"></div>
					<div className="absolute -top-5 -bottom-5 -left-5 -right-5 border border-[#63d392]/30 rounded-2xl -z-10 transform rotate-1"></div>

					{/* Video wrapper */}
					<div className="relative aspect-video rounded-xl overflow-hidden border-2 border-[#63d392]/30 shadow-xl group">
						{!isPlaying && (
							<div
								className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 cursor-pointer"
								onClick={handlePlayClick}
							>
								<motion.div
									className="h-16 w-16 rounded-full bg-[#63d392] flex items-center justify-center"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<Play className="h-8 w-8 text-[#0a4a4e] ml-1" />
								</motion.div>
							</div>
						)}
						<div
							className={
								isPlaying
									? 'w-full h-full'
									: 'w-full h-full pointer-events-none'
							}
						>
							<Video
								src={NoteMeetAction}
								blurDataURL="/logo.png"
								className="w-full h-full object-cover"
								controls={isPlaying}
								autoPlay={isPlaying}
								muted={!isPlaying}
								playsInline={true}
							/>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					viewport={{ once: true }}
					className="mt-12 text-center"
				>
					<p className="text-xl font-medium text-white mb-6">
						Ready to <span className="text-[#63d392]">transform</span> how your
						team handles meetings?
					</p>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.98 }}
						className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#63d392] to-[#4fb87a] text-[#0a4a4e] font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
					>
						Get Started Free
					</motion.button>
				</motion.div>
			</div>
		</section>
	);
}
