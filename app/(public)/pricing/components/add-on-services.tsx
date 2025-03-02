'use client';

import { CalendarClock, Code, Users, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const addOns = [
	{
		name: 'API Access',
		description:
			'Integrate NoteMeet directly into your applications with our developer-friendly API.',
		priceLabel: 'From $100/mo',
		icon: Code,
	},
	{
		name: 'Extended Storage',
		description:
			'Add additional storage for your meeting recordings, transcripts, and summaries.',
		priceLabel: '$20/100GB/mo',
		icon: Database,
	},
	{
		name: 'Additional Users',
		description:
			'Add more team members to your plan with discounted per-user pricing.',
		priceLabel: 'From $9/user/mo',
		icon: Users,
	},
	{
		name: 'Extended Meeting Retention',
		description:
			'Keep your meeting data for longer periods beyond the standard retention policy.',
		priceLabel: 'From $30/mo',
		icon: CalendarClock,
	},
];

export function AddOnServices() {
	return (
		<div>
			<div className="text-center mb-12">
				<div className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-4">
					Customization
				</div>
				<h2 className="text-3xl font-semibold mb-4">
					Add-on <span className="text-[#63d392]">Services</span>
				</h2>
				<p className="text-gray-300 max-w-2xl mx-auto">
					Enhance your NoteMeet experience with these optional add-ons for more
					flexibility and functionality.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{addOns.map((addon, idx) => (
					<motion.div
						key={addon.name}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: idx * 0.1 }}
						className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#156469]/50 p-6 hover:border-[#63d392]/40 transition-all duration-300"
					>
						<div className="flex items-start">
							<div className="bg-[#63d392]/10 p-3 rounded-lg mr-4">
								<addon.icon className="h-6 w-6 text-[#63d392]" />
							</div>

							<div className="flex-1">
								<h3 className="text-xl font-semibold text-white mb-1">
									{addon.name}
								</h3>
								<p className="text-gray-300 mb-3">{addon.description}</p>

								<div className="flex items-center justify-between">
									<span className="text-[#63d392] font-medium">
										{addon.priceLabel}
									</span>
									<Button
										variant="outline"
										className="border-[#63d392]/30 text-[#63d392] hover:bg-[#63d392]/10 hover:text-[#63d392]"
									>
										Learn More
									</Button>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
