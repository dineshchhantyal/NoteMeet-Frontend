import { Metadata } from 'next';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	ArrowRight,
	Calendar,
	Clock,
	Image as ImageIcon,
	BookOpen,
} from 'lucide-react';

export const metadata: Metadata = {
	title: 'Blog | NoteMeet',
	description:
		'Stay up to date with the latest news, tips, and insights from the NoteMeet team.',
};

// Extended blog post data with images and categories
const blogPosts = [
	{
		title: '5 Ways to Make Your Virtual Meetings More Productive',
		date: '2023-06-15',
		readTime: '5 min read',
		excerpt:
			"Discover how to leverage NoteMeet's features to boost your team's virtual meeting efficiency.",
		slug: '5-ways-to-make-virtual-meetings-productive',
		category: 'Productivity',
		image: null, // No image available yet
		isPublished: true,
	},
	{
		title: 'The Future of AI in Meeting Transcription',
		date: '2023-05-28',
		readTime: '7 min read',
		excerpt:
			"Explore how AI is revolutionizing meeting transcription and what's next on the horizon.",
		slug: 'future-of-ai-in-meeting-transcription',
		category: 'Technology',
		image: null,
		isPublished: false,
	},
	{
		title: 'How NoteMeet Helped TechCorp Streamline Their Communication',
		date: '2023-05-10',
		readTime: '8 min read',
		excerpt:
			'Read about how TechCorp improved their meeting efficiency by 40% using NoteMeet.',
		slug: 'notemeet-techcorp-case-study',
		category: 'Case Study',
		image: null,
		isPublished: false,
	},
	{
		title: 'Best Practices for Remote Team Collaboration',
		date: '2023-04-22',
		readTime: '6 min read',
		excerpt:
			'Learn effective strategies for keeping remote teams connected and productive.',
		slug: 'remote-team-collaboration',
		category: 'Teamwork',
		image: null,
		isPublished: false,
	},
	{
		title: 'Introducing NoteMeet 2.0: New Features and Improvements',
		date: '2023-03-15',
		readTime: '4 min read',
		excerpt:
			'Explore the latest features in our biggest update yet, designed to transform your meeting experience.',
		slug: 'introducing-notemeet-2',
		category: 'Product Updates',
		image: null,
		isPublished: false,
	},
];

// Categories for filter
const categories = [
	'All',
	'Productivity',
	'Technology',
	'Case Study',
	'Teamwork',
	'Product Updates',
];

export default function BlogPage() {
	return (
		<div className="bg-[#0a4a4e] min-h-screen">
			{/* Decorative background elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-[20%] left-[10%] w-72 h-72 bg-[#63d392]/5 rounded-full blur-[100px]"></div>
				<div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#156469]/20 rounded-full blur-[100px]"></div>
			</div>

			<div className="container mx-auto px-4 py-24 text-white relative z-10">
				{/* Header */}
				<div className="text-center mb-16">
					<div className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-6">
						Our Insights
					</div>
					<h1 className="text-4xl md:text-5xl font-bold mb-8">
						NoteMeet{' '}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#63d392] to-[#8ae9b3]">
							Blog
						</span>
					</h1>
					<p className="text-xl text-gray-300 max-w-2xl mx-auto">
						Stay up to date with the latest news, tips, and insights to make
						your meetings more effective.
					</p>
				</div>

				{/* Categories */}
				<div className="flex flex-wrap justify-center gap-3 mb-12">
					{categories.map((category) => (
						<button
							key={category}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
								category === 'All'
									? 'bg-[#63d392] text-[#0a4a4e]'
									: 'bg-[#156469]/40 text-white hover:bg-[#156469]'
							}`}
						>
							{category}
						</button>
					))}
				</div>

				{/* Featured post */}
				<div className="mb-16">
					<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 overflow-hidden">
						<div className="grid grid-cols-1 lg:grid-cols-2">
							<div className="relative h-64 lg:h-auto bg-[#0d5559]">
								{/* Placeholder for when no image is available */}
								<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#156469] to-[#0d5559]">
									<div className="bg-[#0a4a4e]/50 p-6 rounded-full">
										<BookOpen className="h-16 w-16 text-[#63d392]/60" />
									</div>
									<div className="absolute inset-0 bg-gradient-to-r from-[#0a4a4e]/50 to-transparent z-10"></div>
								</div>
								<div className="absolute top-4 left-4 z-20">
									<span className="bg-[#63d392] text-[#0a4a4e] text-xs font-bold px-3 py-1 rounded-full">
										{blogPosts[0].category}
									</span>
								</div>
							</div>

							<div className="p-8 flex flex-col justify-center">
								<div className="flex items-center text-sm text-gray-300 mb-3">
									<Calendar className="h-4 w-4 mr-1" />
									<span>{blogPosts[0].date}</span>
									<span className="mx-2">•</span>
									<Clock className="h-4 w-4 mr-1" />
									<span>{blogPosts[0].readTime}</span>
								</div>

								<h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
									{blogPosts[0].title}
								</h2>
								<p className="text-gray-300 mb-6">{blogPosts[0].excerpt}</p>

								<Button className="bg-[#63d392] text-[#0a4a4e] hover:bg-[#4fb87a] w-fit mt-2 flex items-center group">
									Read Article
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Blog posts grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{blogPosts.slice(1).map((post, index) => (
						<Card
							key={index}
							className="bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20 overflow-hidden hover:border-[#63d392]/40 transition-all duration-300 flex flex-col"
						>
							<div className="relative h-48 bg-[#0d5559]">
								{/* Placeholder design when no image is available */}
								<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#156469] to-[#0d5559]">
									<div className="flex flex-col items-center">
										<ImageIcon className="h-10 w-10 text-[#63d392]/40 mb-2" />
										<span className="text-[#63d392]/60 text-xs">
											Image coming soon
										</span>
									</div>
								</div>
								<div className="absolute top-4 left-4">
									<span className="bg-[#63d392]/90 text-[#0a4a4e] text-xs font-bold px-3 py-1 rounded-full">
										{post.category}
									</span>
								</div>
							</div>

							<CardHeader>
								<div className="flex items-center text-xs text-gray-300 mb-1">
									<Calendar className="h-3 w-3 mr-1" />
									<span>{post.date}</span>
									<span className="mx-2">•</span>
									<Clock className="h-3 w-3 mr-1" />
									<span>{post.readTime}</span>
								</div>
								<CardTitle className="text-white">{post.title}</CardTitle>
							</CardHeader>

							<CardContent>
								<p className="text-gray-300">{post.excerpt}</p>
							</CardContent>

							<CardFooter className="mt-auto pt-2">
								<Button
									variant="outline"
									className="border-[#63d392]/30 text-[#63d392] hover:bg-[#63d392]/10 hover:text-[#63d392] w-full mt-2"
									disabled={!post.isPublished}
								>
									{post.isPublished ? 'Read Article' : 'Coming Soon'}
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>

				{/* Coming soon section */}
				<div className="mt-20 text-center">
					<div className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-6">
						Stay Tuned
					</div>
					<h2 className="text-2xl md:text-3xl font-bold mb-4">
						More Articles <span className="text-[#63d392]">Coming Soon</span>
					</h2>
					<p className="text-gray-300 mb-6 max-w-2xl mx-auto">
						Our team is working on creating more helpful content to enhance your
						meeting experience. Check back regularly for new articles!
					</p>
				</div>
			</div>
		</div>
	);
}
