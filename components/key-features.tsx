import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ListTodo, SparkleIcon, Brain } from 'lucide-react';

const features = [
	{
		icon: FileText,
		title: 'Effortless Automatic Recording',
		description:
			'NoteMeet automatically records your meetings and provides real-time transcriptions, making it easy to capture everything without lifting a finger.',
	},
	{
		icon: ListTodo,
		title: 'Actionable Meeting Insights',
		description:
			"After each meeting, you'll receive a clear, concise summary with key points, follow-up tasks, and action items, saving you time and effort.",
	},
	{
		icon: SparkleIcon,
		title: 'MeetMind AI',
		description:
			'Your personal meeting intelligence that understands your priorities. Simply chat with MeetMind AI to get detailed, contextual answers about any meeting.',
	},
	{
		icon: ListTodo,
		title: 'Seamless Sharing',
		description:
			'Share meeting recordings and summaries with your team easily. You can choose to share the entire meeting or just specific sections to keep everyone aligned.',
	},
];

export function KeyFeatures2() {
	return (
		<section className="section-padding py-12 text-white">
			<div className="container mx-auto px-4">
				<h2 className="text-center text-xl font-bold mb-12">Key Features</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature, index) => (
						<Card
							key={index}
							className="group hover:shadow-lg transition-shadow duration-300"
						>
							<CardHeader>
								<CardTitle className="flex flex-col items-center text-center">
									<feature.icon className="h-12 w-12 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
									<span className="text-xl">{feature.title}</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-center text-gray-600 text-sm group-hover:text-foreground transition-colors duration-300">
									{feature.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

export function KeyFeatures() {
	return (
		<section id="features" className="bg-white py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16 animate__animated animate__fadeIn">
					<h2 className="text-4xl font-bold text-[#0a4a4e] mb-4">
						Powerful Features for Efficient Meetings
					</h2>
					<p className="text-xl text-gray-600">
						Everything you need to make your meetings more productive
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{[
						{
							title: 'Automatic Recording & Transcription',
							description:
								'Real-time, hands-free meeting capture with accurate transcription powered by advanced AI.',
							icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
						},
						{
							title: 'Summaries & Action Items',
							description:
								'Get clear post-meeting insights and automatically extracted action items for better follow-ups.',
							icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
						},
						{
							title: 'AI Assistance',
							description:
								"Get instant answers to meeting-related questions with NoteMeet's advanced AI assistant.",
							icon: 'M13 10V3L4 14h7v7l9-11h-7z',
						},
						{
							title: 'Seamless Sharing',
							description:
								'Share full or partial meeting content effortlessly with team members and stakeholders.',
							icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
						},
						{
							title: 'Browser Extension',
							description:
								'Enhance productivity with smart features and integrations right in your browser.',
							icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
						},
						{
							title: 'Advanced Security',
							description:
								'Enterprise-grade security and encryption to keep your meeting data safe and private.',
							icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
						},
					].map((feature, index) => (
						<div
							key={index}
							className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 animate__animated animate__fadeInUp"
							style={{ animationDelay: `${index * 0.2}s` }}
						>
							<div className="h-12 w-12 bg-[#63d392] rounded-lg flex items-center justify-center mb-6">
								<svg
									className="w-6 h-6 text-[#0a4a4e]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d={feature.icon}
									></path>
								</svg>
							</div>
							<h3 className="text-xl font-bold text-[#0a4a4e] mb-4">
								{feature.title}
							</h3>
							<p className="text-gray-600">{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
