import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Mic, FileText, ListTodo } from 'lucide-react';

const features = [
	{
		icon: Calendar,
		title: 'Effortless Scheduling',
		description:
			'Easily schedule meetings and set reminders with our intuitive calendar.',
	},
	{
		icon: Mic,
		title: 'Automatic Recording',
		description:
			'Record meetings automatically and get real-time transcriptions effortlessly.',
	},
	{
		icon: FileText,
		title: 'Actionable Summaries',
		description:
			'Receive concise summaries post-meeting, highlighting key insights and action items.',
	},
	{
		icon: ListTodo,
		title: 'Seamless Sharing',
		description:
			'Share recordings and summaries easily to enhance team collaboration.',
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
