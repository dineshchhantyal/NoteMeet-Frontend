'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Search,
	Settings,
	Check,
	Calendar,
	Video,
	ClipboardList,
} from 'lucide-react';

// Integration categories
const categories = [
	{ id: 'all', name: 'All Integrations' },
	{ id: 'calendar', name: 'Calendar Apps', icon: Calendar },
	{ id: 'meeting', name: 'Meeting Platforms', icon: Video },
	{ id: 'workflow', name: 'Workflow Tools', icon: ClipboardList },
];

// Expanded integrations list
const integrations = [
	{
		name: 'Google Calendar',
		logo: '/GoogleCalendarLogo.png',
		category: 'calendar',
		description:
			'Sync meetings directly with Google Calendar. Schedule and manage meetings effortlessly.',
		features: ['Automatic scheduling', 'Meeting reminders', 'Two-way sync'],
		status: 'coming-soon',
	},
	{
		name: 'Google Meet',
		logo: '/GoogleMeetLogo.png',
		category: 'meeting',
		description:
			'Join Google Meet calls directly from NoteMeet and capture notes simultaneously.',
		features: [
			'One-click join',
			'Real-time transcription',
			'Action item extraction',
		],
		status: 'coming-soon',
	},
	{
		name: 'Zoom',
		logo: '/ZoomLogo.png',
		category: 'meeting',
		description:
			'Seamlessly integrate with Zoom meetings for comprehensive note-taking and summaries.',
		features: [
			'One-click recording',
			'Automated transcripts',
			'Smart summaries',
		],
		status: 'coming-soon',
	},
	{
		name: 'Microsoft Teams',
		logo: '/MicrosoftTeamsLogo.png',
		category: 'meeting',
		description:
			'Connect your Microsoft Teams meetings with NoteMeet for enhanced productivity.',
		features: ['Direct integration', 'Meeting insights', 'Action tracking'],
		status: 'coming-soon',
	},
	{
		name: 'Slack',
		logo: '/SlackLogo.png',
		category: 'workflow',
		description:
			'Share meeting notes and action items directly to Slack channels or DMs.',
		features: [
			'Channel notifications',
			'Action item assignments',
			'Meeting summary sharing',
		],
		status: 'coming-soon',
	},
	{
		name: 'Asana',
		logo: '/TrelloLogo.png',
		category: 'workflow',
		description:
			'Convert meeting action items directly to Asana tasks for seamless workflow.',
		features: ['Task creation', 'Due date syncing', 'Assignee matching'],
		status: 'coming-soon',
	},
	{
		name: 'Microsoft Outlook',
		logo: '/OutlookLogo.png',
		category: 'calendar',
		description:
			'Connect your Outlook calendar to never miss a meeting and keep everything synchronized.',
		features: ['Calendar sync', 'Meeting scheduling', 'Automated reminders'],
		status: 'coming-soon',
	},
	{
		name: 'Notion',
		logo: '/NotionLogo.png',
		category: 'workflow',
		description:
			'Export your meeting notes directly to Notion pages or databases.',
		features: ['Page creation', 'Database integration', 'Template support'],
		status: 'coming-soon',
	},
	{
		name: 'Trello',
		logo: '/TrelloLogo.png',
		category: 'workflow',
		description:
			'Turn action items into Trello cards automatically after each meeting.',
		features: ['Card creation', 'List organization', 'Label application'],
		status: 'coming-soon',
	},
	{
		name: 'Apple Calendar',
		logo: '/AppleCalendarLogo.png',
		category: 'calendar',
		description:
			'Integrate with Apple Calendar for seamless meeting management on Apple devices.',
		features: ['iCloud sync', 'iOS/macOS integration', 'Meeting alerts'],
		status: 'coming-soon',
	},
	{
		name: 'Cisco Webex',
		logo: '/WebexLogo.png',
		category: 'meeting',
		description:
			'Connect NoteMeet to your Webex meetings for comprehensive note-taking.',
		features: [
			'Join from NoteMeet',
			'Transcript generation',
			'Key point extraction',
		],
		status: 'coming-soon',
	},
	{
		name: 'Jira',
		logo: '/JiraLogo.png',
		category: 'workflow',
		description:
			'Create Jira issues directly from your meeting action items and decisions.',
		features: ['Issue creation', 'Sprint assignment', 'Epic linking'],
		status: 'coming-soon',
	},
];

export default function IntegrationsPage() {
	const [activeCategory, setActiveCategory] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');

	const filteredIntegrations = integrations.filter((integration) => {
		const matchesCategory =
			activeCategory === 'all' || integration.category === activeCategory;
		const matchesSearch = integration.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	return (
		<div className="flex flex-col min-h-screen bg-[#0a4a4e]">
			{/* Hero Section */}
			<section className="pt-24 pb-16 px-4">
				<div className="container mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center"
					>
						<h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
							Powerful <span className="text-[#63d392]">Integrations</span>
						</h1>
						<p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
							Connect NoteMeet with your favorite tools to create a seamless
							meeting workflow from scheduling to action item tracking.
						</p>

						{/* Search Bar */}
						<div className="max-w-md mx-auto mb-16 relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
							<input
								type="text"
								placeholder="Search integrations..."
								className="w-full py-3 px-10 rounded-lg bg-[#156469]/50 border border-[#63d392]/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#63d392]/50"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</motion.div>

					{/* Category Filter */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="flex flex-wrap justify-center gap-3 mb-12"
					>
						{categories.map((category) => {
							const Icon = category.icon;
							return (
								<button
									key={category.id}
									onClick={() => setActiveCategory(category.id)}
									className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
										activeCategory === category.id
											? 'bg-[#63d392] text-[#0a4a4e]'
											: 'bg-[#156469]/50 text-gray-300 hover:bg-[#156469] border border-[#63d392]/20'
									}`}
								>
									{Icon && <Icon size={16} />}
									<span>{category.name}</span>
								</button>
							);
						})}
					</motion.div>
				</div>
			</section>

			{/* Integrations Grid */}
			<section className="py-12 px-4">
				<div className="container mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredIntegrations.map((integration, index) => (
							<motion.div
								key={integration.name}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-6 hover:border-[#63d392]/50 transition-all relative overflow-hidden group"
							>
								{integration.status === 'coming-soon' && (
									<div className="absolute top-3 right-3 bg-[#fbbf24]/20 text-[#fbbf24] px-3 py-1 rounded-full text-xs font-medium">
										Coming Soon
									</div>
								)}

								<div className="flex items-center mb-4">
									<div className="w-16 h-16 rounded-full bg-white/90 p-2 flex items-center justify-center mr-4 border border-[#63d392]/20">
										<div className="relative w-full h-full">
											<Image
												src={integration.logo}
												alt={`${integration.name} logo`}
												fill
												sizes="(max-width: 80px) 100vw, 80px"
												className="object-contain p-1"
											/>
										</div>
									</div>
									<div>
										<h3 className="text-xl font-semibold text-white">
											{integration.name}
										</h3>
										<p className="text-sm text-[#63d392] capitalize">
											{integration.category}
										</p>
									</div>
								</div>

								<p className="text-gray-300 mb-4">{integration.description}</p>

								<div className="mb-4">
									<h4 className="text-sm font-medium text-gray-300 mb-2">
										Key Features:
									</h4>
									<ul className="space-y-1">
										{integration.features.map((feature, i) => (
											<li key={i} className="flex items-start text-sm">
												<Check className="h-4 w-4 text-[#63d392] mt-0.5 mr-2 flex-shrink-0" />
												<span className="text-gray-300">{feature}</span>
											</li>
										))}
									</ul>
								</div>

								<Button
									className={`w-full ${
										integration.status === 'available'
											? 'bg-[#63d392] hover:bg-[#63d392]/80 text-[#0a4a4e]'
											: 'bg-[#156469] text-gray-300 cursor-not-allowed'
									}`}
									disabled={integration.status !== 'available'}
								>
									{integration.status === 'available'
										? 'Connect'
										: 'Coming Soon'}
								</Button>
							</motion.div>
						))}
					</div>

					{filteredIntegrations.length === 0 && (
						<div className="text-center py-16">
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-gray-300"
							>
								<p className="text-xl mb-2">No integrations found</p>
								<p className="text-sm">Try a different search or category</p>
							</motion.div>
						</div>
					)}
				</div>
			</section>

			{/* Request Integration Section */}
			<section className="py-16 px-4">
				<div className="container mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="max-w-3xl mx-auto text-center bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-8"
					>
						<h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
							Don&apos;t see the integration you need?
						</h2>
						<p className="text-gray-300 mb-6">
							We&apos;re constantly expanding our ecosystem. Let us know what
							tools you&apos;d like to connect with NoteMeet.
						</p>
						<Link href="/contact" className="inline-block">
							<Button className="bg-[#63d392] hover:bg-[#63d392]/80 text-[#0a4a4e] px-8 py-2">
								Request Integration
							</Button>
						</Link>
					</motion.div>
				</div>
			</section>

			{/* Developer Section */}
			<section className="py-16 px-4 bg-[#0d5559]">
				<div className="container mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="max-w-3xl mx-auto"
					>
						<div className="text-center mb-10">
							<h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
								Build Your Own{' '}
								<span className="text-[#63d392]">Integration</span>
							</h2>
							<p className="text-gray-300">
								Are you a developer looking to connect your service with
								NoteMeet? Our developer platform provides all the tools you
								need.
							</p>
						</div>

						<div className="bg-[#156469]/50 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-8">
							<div className="flex flex-col md:flex-row items-center justify-between gap-6">
								<div className="md:w-2/3">
									<h3 className="text-xl font-semibold text-white mb-2">
										Developer API Access
									</h3>
									<p className="text-gray-300 mb-4">
										Get access to NoteMeet&apos;s APIs to build powerful
										integrations for your users.
									</p>
									<ul className="space-y-2 mb-6">
										<li className="flex items-start">
											<Check className="h-5 w-5 text-[#63d392] mt-0.5 mr-2 flex-shrink-0" />
											<span className="text-gray-300">
												Comprehensive API documentation
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-[#63d392] mt-0.5 mr-2 flex-shrink-0" />
											<span className="text-gray-300">
												SDK support for multiple languages
											</span>
										</li>
										<li className="flex items-start">
											<Check className="h-5 w-5 text-[#63d392] mt-0.5 mr-2 flex-shrink-0" />
											<span className="text-gray-300">
												Developer support team
											</span>
										</li>
									</ul>
								</div>
								<div>
									<Button
										className="bg-[#156469] text-gray-300 cursor-not-allowed px-8"
										disabled
									>
										<Settings className="mr-2 h-4 w-4" />
										Coming Soon
									</Button>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
