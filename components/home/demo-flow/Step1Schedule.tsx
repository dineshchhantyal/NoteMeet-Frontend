'use client';

import { motion } from 'framer-motion';
import { Calendar, Plus, ArrowRight, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const Step1Schedule = () => {
	const [activeOption, setActiveOption] = useState('calendar');

	return (
		<div className="flex flex-col h-full">
			<div className="flex justify-center mb-4 bg-[#156469]/20 rounded-lg p-2">
				<button
					className={`px-4 py-2 rounded-md text-sm flex items-center ${
						activeOption === 'calendar'
							? 'bg-[#63d392]/20 text-[#63d392]'
							: 'text-gray-300 hover:bg-[#156469]/30'
					}`}
					onClick={() => setActiveOption('calendar')}
				>
					<Calendar className="h-4 w-4 mr-2" />
					Calendar
				</button>
				<button
					className={`px-4 py-2 rounded-md text-sm flex items-center ${
						activeOption === 'join'
							? 'bg-[#63d392]/20 text-[#63d392]'
							: 'text-gray-300 hover:bg-[#156469]/30'
					}`}
					onClick={() => setActiveOption('join')}
				>
					<Video className="h-4 w-4 mr-2" />
					Join Meeting
				</button>
			</div>

			{activeOption === 'calendar' ? (
				<div className="flex-1 bg-[#156469]/10 rounded-lg p-4 border border-[#156469]/30">
					<div className="text-center mb-6">
						<h3 className="text-[#63d392] text-lg mb-2">
							Connect Your Calendar
						</h3>
						<p className="text-gray-300 text-sm">
							NoteMeet syncs with your calendar to automatically record your
							scheduled meetings
						</p>
					</div>

					<div className="space-y-3 max-w-sm mx-auto">
						<motion.div
							className="bg-[#156469]/30 p-3 rounded-lg flex items-center justify-between"
							whileHover={{ scale: 1.02 }}
						>
							<div className="flex items-center">
								<div className="bg-blue-500/20 p-2 rounded-md mr-3">
									<svg
										className="h-5 w-5 text-blue-500"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M21.6 4.8V19.2C21.6 20.52 20.52 21.6 19.2 21.6H4.8C3.48 21.6 2.4 20.52 2.4 19.2V4.8C2.4 3.48 3.48 2.4 4.8 2.4H19.2C20.52 2.4 21.6 3.48 21.6 4.8ZM12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18ZM12 9.6C13.32 9.6 14.4 10.68 14.4 12C14.4 13.32 13.32 14.4 12 14.4C10.68 14.4 9.6 13.32 9.6 12C9.6 10.68 10.68 9.6 12 9.6Z" />
									</svg>
								</div>
								<div>
									<p className="text-white text-sm">Google Calendar</p>
									<p className="text-xs text-gray-400">
										Connect your work account
									</p>
								</div>
							</div>
							<Button
								size="sm"
								className="bg-[#63d392] hover:bg-[#4fb87a] text-[#0a4a4e] h-8"
							>
								Connect
							</Button>
						</motion.div>

						<motion.div
							className="bg-[#156469]/30 p-3 rounded-lg flex items-center justify-between"
							whileHover={{ scale: 1.02 }}
						>
							<div className="flex items-center">
								<div className="bg-blue-700/20 p-2 rounded-md mr-3">
									<svg
										className="h-5 w-5 text-blue-700"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M7.88 12.04C8.74 12.04 9.44 11.34 9.44 10.48C9.44 9.62 8.74 8.92 7.88 8.92C7.02 8.92 6.32 9.62 6.32 10.48C6.32 11.34 7.02 12.04 7.88 12.04ZM16.12 12.04C16.98 12.04 17.68 11.34 17.68 10.48C17.68 9.62 16.98 8.92 16.12 8.92C15.26 8.92 14.56 9.62 14.56 10.48C14.56 11.34 15.26 12.04 16.12 12.04ZM19.26 6.18V12.36C19.26 13.84 15.6 15.04 12 15.04C8.4 15.04 4.74 13.84 4.74 12.36V6.18C4.74 4.7 8.4 3.5 12 3.5C15.6 3.5 19.26 4.7 19.26 6.18Z" />
									</svg>
								</div>
								<div>
									<p className="text-white text-sm">Microsoft Outlook</p>
									<p className="text-xs text-gray-400">
										Connect your work account
									</p>
								</div>
							</div>
							<Button
								size="sm"
								className="bg-[#63d392] hover:bg-[#4fb87a] text-[#0a4a4e] h-8"
							>
								Connect
							</Button>
						</motion.div>

						<motion.div
							className="bg-[#156469]/30 p-3 rounded-lg flex items-center justify-between"
							whileHover={{ scale: 1.02 }}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
						>
							<div className="flex items-center">
								<div className="bg-[#63d392]/20 p-2 rounded-md mr-3">
									<Plus className="h-5 w-5 text-[#63d392]" />
								</div>
								<div>
									<p className="text-white text-sm">More Options</p>
									<p className="text-xs text-gray-400">
										Apple, Zoom, Teams, etc.
									</p>
								</div>
							</div>
							<Button size="sm" variant="ghost" className="text-[#63d392] h-8">
								See All <ArrowRight className="ml-1 h-3 w-3" />
							</Button>
						</motion.div>
					</div>

					<motion.div
						className="text-center mt-6 text-sm text-gray-400"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8 }}
					>
						Once connected, NoteMeet will be ready to capture your important
						meetings
					</motion.div>
				</div>
			) : (
				<div className="flex-1 bg-[#156469]/10 rounded-lg p-4 border border-[#156469]/30">
					<div className="text-center mb-6">
						<h3 className="text-[#63d392] text-lg mb-2">Join Any Meeting</h3>
						<p className="text-gray-300 text-sm">
							Enter a meeting link or ID to join and let NoteMeet capture
							everything
						</p>
					</div>

					<div className="max-w-md mx-auto">
						<div className="space-y-4">
							<div className="bg-[#156469]/30 p-4 rounded-lg">
								<p className="text-sm text-white mb-2">Meeting Platform</p>
								<div className="grid grid-cols-4 gap-2">
									{['Zoom', 'Teams', 'Google', 'WebEx'].map((platform, idx) => (
										<motion.button
											key={idx}
											className={`p-2 rounded-md text-xs ${
												idx === 0
													? 'bg-[#63d392]/20 text-[#63d392]'
													: 'bg-[#156469]/20 text-gray-300 hover:bg-[#156469]/40'
											}`}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											{platform}
										</motion.button>
									))}
								</div>
							</div>

							<div className="bg-[#156469]/30 p-4 rounded-lg">
								<p className="text-sm text-white mb-2">Meeting Link or ID</p>
								<div className="flex">
									<input
										type="text"
										className="flex-1 bg-[#0a1f21] border border-[#156469]/50 rounded-l-md p-2 text-white text-sm focus:outline-none focus:border-[#63d392]/50"
										placeholder="https://zoom.us/j/123456789"
										defaultValue="https://zoom.us/j/987654321"
									/>
									<Button className="bg-[#63d392] hover:bg-[#4fb87a] text-[#0a4a4e] rounded-l-none">
										Join
									</Button>
								</div>
							</div>

							<motion.div
								className="text-center p-3 rounded-lg bg-[#63d392]/10 border border-[#63d392]/30"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.6 }}
							>
								<p className="text-sm text-[#63d392]">
									<Video className="inline-block h-4 w-4 mr-1" />
									Ready to join &ldquo;Weekly Marketing Team Sync&rdquo;
								</p>
							</motion.div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
