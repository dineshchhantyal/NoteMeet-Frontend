import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ListTodo, SparkleIcon } from 'lucide-react';

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
		title: 'Ask NoteMeet AI',
		description:
			'Have questions about your meetings? Simply ask NoteMeet AI, and get detailed, accurate answers instantly.',
	},
	{
		icon: ListTodo,
		title: 'Seamless Sharing',
		description:
			'Share meeting recordings and summaries with your team easily. You can choose to share the entire meeting or just specific sections to keep everyone aligned.',
	},
];

export function KeyFeatures() {
	return (
		<section className="section-padding py-12 bg-gray-50">
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
									<feature.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
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
