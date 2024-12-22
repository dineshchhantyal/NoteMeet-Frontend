import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Lightbulb, Lock, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FaUser } from 'react-icons/fa';

export const metadata: Metadata = {
	title: 'About Us | NoteMeet',
	description:
		'Learn about NoteMeet&quot;s mission, values, and the team behind our innovative meeting solution.',
};

export default function AboutPage() {
	return (
		<div className="bg-gradient-to-b from-primary/10 to-white">
			<div className="container mx-auto px-4 py-16">
				<h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-primary">
					About NoteMeet
				</h1>

				<section className="mb-16 text-center max-w-3xl mx-auto">
					<h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
					<p className="text-xl mb-6 text-gray-700">
						At NoteMeet, we&quot;re on a mission to revolutionize the way teams
						collaborate and communicate. We believe that every meeting should be
						productive, insightful, and actionable.
					</p>
					<p className="text-lg text-gray-600">
						Our AI-powered platform is designed to capture the essence of your
						discussions, providing you with accurate transcripts, concise
						summaries, and actionable insights.
					</p>
				</section>

				<section className="mb-16">
					<h2 className="text-3xl font-semibold mb-8 text-center">
						Our Values
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								title: 'Innovation',
								description:
									"We constantly push the boundaries of what's possible in meeting technology.",
								icon: (
									<Lightbulb className="w-16 h-16 mx-auto mb-4 text-primary" />
								),
							},
							{
								title: 'Reliability',
								description:
									'You can count on us to deliver accurate and timely meeting insights, every time.',
								icon: (
									<ShieldCheck className="w-16 h-16 mx-auto mb-4 text-primary" />
								),
							},
							{
								title: 'Privacy',
								description:
									'We prioritize the security and confidentiality of your meeting data.',
								icon: <Lock className="w-16 h-16 mx-auto mb-4 text-primary" />,
							},
						].map((value, index) => {
							return (
								<Card
									key={index}
									className="text-center hover:shadow-lg transition-shadow"
								>
									<CardContent className="p-6">
										{value.icon}
										<h3 className="text-xl font-semibold mb-2">
											{value.title}
										</h3>
										<p className="text-gray-600">{value.description}</p>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</section>

				<section className="mb-16">
					<h2 className="text-3xl font-semibold mb-12 text-center">
						Meet Our Leadership
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
						{[
							{
								name: 'Jane Doe',
								role: 'CEO &amp; Co-founder',
								image: '/team/jane-doe.jpg',
								linkedin: '#',
							},
							{
								name: 'John Smith',
								role: 'CTO &amp; Co-founder',
								image: '/team/john-smith.jpg',
								linkedin: '#',
							},
							{
								name: 'Emily Chen',
								role: 'Head of AI Research',
								image: '/team/emily-chen.jpg',
								linkedin: '#',
							},
						].map((member, index) => (
							<div key={index} className="text-center">
								<Avatar className="mx-auto mb-4 w-32 h-32">
									{/* <AvatarImage src={user?.user.image || ""} /> */}
									<AvatarFallback>
										<FaUser
											width={200}
											height={200}
											className="rounded-full mx-auto mb-4 border-4 border-primary/20"
										/>
									</AvatarFallback>
								</Avatar>
								<h3 className="text-xl font-semibold">{member.name}</h3>
								<p className="text-gray-600 mb-2">{member.role}</p>
								<a
									href={member.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline"
								>
									LinkedIn Profile
								</a>
							</div>
						))}
					</div>
				</section>

				<section className="text-center bg-primary text-white py-16 rounded-lg">
					<h2 className="text-3xl font-semibold mb-4">Join Our Journey</h2>
					<p className="text-xl mb-8 max-w-2xl mx-auto">
						We&quot;re always looking for talented individuals to join our team
						and help shape the future of meetings.
					</p>
					<Button size="lg" variant="outline" asChild className="text-primary">
						<a href="/careers">
							View Open Positions
							<ArrowRight className="ml-2 h-5 w-5" />
						</a>
					</Button>
				</section>
			</div>
		</div>
	);
}
