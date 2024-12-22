import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Mic, FileText, ListTodo } from 'lucide-react';

const features = [
	{
		icon: Calendar,
		title: 'Smart Scheduling',
		description:
			'Effortlessly plan and organize your meetings with our intuitive scheduling tool.',
	},
	{
		icon: Mic,
		title: 'Automated Recording',
		description:
			'Never miss a detail with our automatic meeting recording feature.',
	},
	{
		icon: FileText,
		title: 'Intelligent Transcription',
		description:
			'Get accurate, searchable transcripts of your meetings in real-time.',
	},
	{
		icon: ListTodo,
		title: 'Action-Oriented Summaries',
		description: 'Receive concise, actionable summaries after each meeting.',
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
