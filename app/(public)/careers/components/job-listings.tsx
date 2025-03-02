'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	BriefcaseIcon,
	ChevronDown,
	Globe,
	Clock,
	ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import jobs from './jobs';

export function JobListings() {
	const [expandedJob, setExpandedJob] = useState<number | null>(null);

	return (
		<div className="space-y-6">
			{jobs.map((job) => (
				<motion.div
					key={job.id}
					className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 overflow-hidden hover:border-[#63d392]/40 transition-colors duration-300"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div
						className="p-6 cursor-pointer"
						onClick={() =>
							setExpandedJob(expandedJob === job.id ? null : job.id)
						}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<div className="bg-[#63d392]/10 p-2.5 rounded-lg mr-4">
									<BriefcaseIcon className="h-5 w-5 text-[#63d392]" />
								</div>
								<div>
									<h3 className="text-xl font-semibold text-white">
										{job.title}
									</h3>
									<div className="flex items-center text-sm text-gray-300 mt-1">
										<span>{job.department}</span>
									</div>
								</div>
							</div>
							<div className="flex items-center space-x-4">
								<div className="hidden md:flex items-center space-x-4">
									<Badge
										variant="outline"
										className="border-[#63d392]/30 text-[#63d392] bg-[#63d392]/10"
									>
										<Globe className="h-3 w-3 mr-1" />
										{job.location}
									</Badge>
									<Badge
										variant="outline"
										className="border-[#63d392]/30 text-[#63d392] bg-[#63d392]/10"
									>
										<Clock className="h-3 w-3 mr-1" />
										{job.type}
									</Badge>
								</div>
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full text-white"
									aria-label="Toggle job details"
								>
									<ChevronDown
										className={`h-5 w-5 transition-transform ${expandedJob === job.id ? 'transform rotate-180' : ''}`}
									/>
								</Button>
							</div>
						</div>

						<div className="md:hidden flex items-center space-x-3 mt-3">
							<Badge
								variant="outline"
								className="border-[#63d392]/30 text-[#63d392] bg-[#63d392]/10"
							>
								<Globe className="h-3 w-3 mr-1" />
								{job.location}
							</Badge>
							<Badge
								variant="outline"
								className="border-[#63d392]/30 text-[#63d392] bg-[#63d392]/10"
							>
								<Clock className="h-3 w-3 mr-1" />
								{job.type}
							</Badge>
						</div>
					</div>

					<AnimatePresence>
						{expandedJob === job.id && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								<div className="px-6 pb-6 border-t border-[#63d392]/20 pt-4">
									<p className="text-gray-300 mb-4">{job.description}</p>

									<h4 className="font-medium text-[#63d392] mb-2">
										Requirements
									</h4>
									<ul className="list-disc pl-5 mb-6 space-y-1 text-gray-300">
										{job.requirements.map((req: string, index: number) => (
											<li key={index}>{req}</li>
										))}
									</ul>

									<Button className="bg-[#63d392] text-[#0a4a4e] hover:bg-[#4fb87a] hover:shadow-lg hover:shadow-[#63d392]/20 transition-all">
										Apply Now <ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			))}
		</div>
	);
}
