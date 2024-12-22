import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
	title: 'Blog | NoteMeet',
	description:
		'Stay up to date with the latest news, tips, and insights from the NoteMeet team.',
};

const blogPosts = [
	{
		title: '5 Ways to Make Your Virtual Meetings More Productive',
		date: '2023-06-15',
		excerpt:
			"Discover how to leverage NoteMeet's features to boost your team's virtual meeting efficiency.",
		slug: '5-ways-to-make-virtual-meetings-productive',
	},
	{
		title: 'The Future of AI in Meeting Transcription',
		date: '2023-05-28',
		excerpt:
			"Explore how AI is revolutionizing meeting transcription and what's next on the horizon.",
		slug: 'future-of-ai-in-meeting-transcription',
	},
	{
		title: 'How NoteMeet Helped TechCorp Streamline Their Communication',
		date: '2023-05-10',
		excerpt:
			'Read about how TechCorp improved their meeting efficiency by 40% using NoteMeet.',
		slug: 'notemeet-techcorp-case-study',
	},
];

export default function BlogPage() {
	return (
		<div className="container mx-auto px-4 py-16">
			<h1 className="text-4xl font-bold mb-8 text-center">NoteMeet Blog</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{blogPosts.map((post, index) => (
					<Card key={index}>
						<CardHeader>
							<CardTitle>{post.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-500 mb-2">{post.date}</p>
							<p className="mb-4">{post.excerpt}</p>
							<Button variant={'default'} className="disabled">
								{/* <Link href={`/blog/${post.slug}`}>Read More</Link>
								 */}
								Coming soon
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
