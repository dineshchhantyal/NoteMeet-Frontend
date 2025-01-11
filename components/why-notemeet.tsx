import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, Workflow } from 'lucide-react';

const benefits = [
	{
		icon: Clock,
		title: 'Save Time',
		description:
			'Cut down administrative tasks by 50% with automated recording, transcription, and summarization.',
	},
	{
		icon: Users,
		title: 'Boost Collaboration',
		description:
			'Share key insights and action items instantly, enabling faster decision-making and team alignment.',
	},
	{
		icon: Workflow,
		title: 'Streamline Workflow',
		description:
			'Effortlessly integrate with your favorite tools, making meeting management seamless and efficient.',
	},
];

export function WhyNoteMeet2() {
	return (
		<section className="py-20 bg-[#F5F7FA]">
			<div className="container mx-auto px-4">
				<h2 className="text-xl font-bold text-center mb-6">Why NoteMeet?</h2>
				<p className="text-xl text-center mb-12 max-w-2xl mx-auto">
					Say goodbye to unproductive meetings. NoteMeet empowers teams to focus
					on what matters by automating the repetitive.
				</p>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{benefits.map((benefit, index) => (
						<Card key={index}>
							<CardHeader>
								<CardTitle className="flex items-center">
									<benefit.icon className="mr-2 h-6 w-6 text-white" />
									{benefit.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{benefit.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

export function WhyNoteMeet() {
	return (
		<section id="benefits" className="bg-[#0a4a4e] py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16 animate__animated animate__fadeIn">
					<h2 className="text-4xl font-bold text-white mb-4">
						Why Choose NoteMeet?
					</h2>
					<p className="text-xl text-[#63d392]">
						Transforming meetings into actionable insights
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{benefits.map((benefit, index) => (
						<div
							key={index}
							className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-[#63d392]/20 hover:border-[#63d392] transition-all duration-300 animate__animated animate__fadeInUp"
							style={{ animationDelay: `${index * 0.2}s` }}
						>
							<div className="flex items-center justify-center mb-6">
								<div className="h-16 w-16 bg-[#63d392] rounded-full flex items-center justify-center">
									<benefit.icon className="w-8 h-8 text-[#0a4a4e]" />
								</div>
							</div>
							<h3 className="text-2xl font-bold text-white text-center mb-4">
								{benefit.title}
							</h3>
							<p className="text-center text-gray-300 mb-4">
								{benefit.description}
							</p>
							<div className="flex justify-center">
								<span className="text-[#63d392] text-lg font-bold">
									{index === 0
										? '50%'
										: index === 1
											? 'Real-time Collaboration'
											: 'Multiple Integrations'}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
