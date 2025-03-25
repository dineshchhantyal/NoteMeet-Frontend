import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaLinkedinIn } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'About Us | NoteMeet',
	description:
		"Learn about NoteMeet's mission, values, and the team behind our innovative meeting solution.",
};

export default function AboutPage() {
	return (
		<div className="bg-[#0a4a4e] min-h-screen">
			{/* Decorative background elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-[20%] left-[10%] w-72 h-72 bg-[#63d392]/5 rounded-full blur-[100px]"></div>
				<div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#156469]/20 rounded-full blur-[100px]"></div>
			</div>

			<div className="container mx-auto px-4 py-24 text-white relative z-10">
				{/* Hero section */}
				<div className="text-center mb-20">
					<div className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-6">
						Our Story
					</div>
					<h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
						About{' '}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#63d392] to-[#8ae9b3]">
							NoteMeet
						</span>
					</h1>
					<div className="max-w-3xl mx-auto">
						<p className="text-xl text-gray-300 mb-6">
							At NoteMeet, we&apos;re on a mission to revolutionize the way
							teams collaborate and communicate. We believe that every meeting
							should be productive, insightful, and actionable.
						</p>
					</div>
				</div>

				{/* Mission section */}
				<section className="mb-24 flex flex-col md:flex-row gap-12 items-center">
					<div className="w-full md:w-1/2">
						<div className="bg-[#156469]/40 backdrop-blur-sm p-1 rounded-lg border border-[#63d392]/20 shadow-lg">
							<div className="relative h-80 rounded-lg overflow-hidden">
								<Image
									src="/logo.png"
									alt="NoteMeet mission"
									fill
									style={{ objectFit: 'cover' }}
									className="opacity-90 hover:scale-105 transition-transform duration-700"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[#0a4a4e]/80 to-transparent"></div>
								<div className="absolute bottom-0 left-0 p-6">
									<span className="text-[#63d392] font-medium">
										Our Purpose
									</span>
									<h3 className="text-2xl font-bold mt-1 text-white">
										Transforming Meetings
									</h3>
								</div>
							</div>
						</div>
					</div>

					<div className="w-full md:w-1/2">
						<h2 className="text-3xl font-semibold mb-6">
							<span className="text-[#63d392]">Our</span> Mission
						</h2>
						<p className="text-lg mb-6 text-gray-300">
							Our AI-powered platform is designed to capture the essence of your
							discussions, providing you with accurate transcripts, concise
							summaries, and actionable insights to boost productivity and
							eliminate the need for manual note-taking.
						</p>
						<p className="text-lg text-gray-300">
							We&apos;re dedicated to creating a future where meetings are no
							longer a source of frustration, but rather a catalyst for
							innovation, collaboration, and meaningful outcomes.
						</p>
					</div>
				</section>

				{/* Values section */}
				<section className="mb-24">
					<div className="text-center mb-12">
						<div className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-4">
							What Drives Us
						</div>
						<h2 className="text-3xl font-semibold">
							Our Core <span className="text-[#63d392]">Values</span>
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								title: 'Innovation',
								description:
									"We constantly push the boundaries of what's possible in meeting technology.",
								icon: <Sparkles className="w-10 h-10 text-[#63d392]" />,
							},
							{
								title: 'Reliability',
								description:
									'You can count on us to deliver accurate and timely meeting insights, every time.',
								icon: <ShieldCheck className="w-10 h-10 text-[#63d392]" />,
							},
							{
								title: 'Privacy',
								description:
									'We prioritize the security and confidentiality of your meeting data.',
								icon: <Lock className="w-10 h-10 text-[#63d392]" />,
							},
						].map((value, index) => (
							<div
								key={index}
								className="bg-[#156469]/30 backdrop-blur-sm p-6 rounded-lg border border-[#63d392]/20 hover:border-[#63d392]/40 transition-colors duration-300 hover:shadow-lg hover:shadow-[#63d392]/5"
							>
								<div className="bg-[#63d392]/10 p-3 rounded-lg inline-block mb-4">
									{value.icon}
								</div>
								<h3 className="text-xl font-semibold mb-3 text-white">
									{value.title}
								</h3>
								<p className="text-gray-300">{value.description}</p>
							</div>
						))}
					</div>
				</section>

				{/* Team section */}
				<section className="mb-24">
					<div className="text-center mb-12">
						<div className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-4">
							Who We Are
						</div>
						<h2 className="text-3xl font-semibold">
							Meet Our <span className="text-[#63d392]">Leadership</span>
						</h2>
					</div>

					<div className="flex justify-center gap-10">
						{[
							{
								name: 'Dinesh Chhantyal',
								role: 'CEO & Co-founder',
								bio: "Leading NoteMeet's vision and strategy with 10+ years of experience in AI and software development.",
								image: '/team/dinesh-chhantyal.jpg',
								linkedin: 'https://www.linkedin.com/in/dineshchhantyal',
							},
						].map((member, index) => (
							<div
								key={index}
								className="bg-[#156469]/20 backdrop-blur-sm rounded-xl overflow-hidden border border-[#63d392]/10 hover:border-[#63d392]/30 transition-all duration-300 max-w-[400px]"
							>
								<div className="bg-gradient-to-br from-[#156469] to-[#0a4a4e] p-6 text-center">
									<Avatar className="mx-auto mb-4 w-28 h-28 border-4 border-[#63d392]/20">
										<AvatarImage src={member.image} />
										<AvatarFallback className="bg-[#156469] text-[#63d392] text-xl font-bold">
											{member.name
												.split(' ')
												.map((n) => n[0])
												.join('')}
										</AvatarFallback>
									</Avatar>
									<h3 className="text-xl font-semibold text-white">
										{member.name}
									</h3>
									<p className="text-[#63d392] mb-2 font-medium">
										{member.role}
									</p>
								</div>

								<div className="p-6">
									<p className="text-gray-300 mb-4 text-sm">{member.bio}</p>
									<a
										href={member.linkedin}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center text-[#63d392] hover:underline"
									>
										<FaLinkedinIn className="mr-2" />
										Connect on LinkedIn
									</a>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* Join us section */}
				<section className="relative overflow-hidden rounded-xl">
					<div className="absolute inset-0 bg-gradient-to-r from-[#156469] to-[#0d5559]"></div>
					<div className="absolute inset-0 opacity-20">
						<div className="absolute top-0 right-0 w-72 h-72 bg-[#63d392]/30 rounded-full blur-[80px]"></div>
						<div className="absolute bottom-0 left-0 w-72 h-72 bg-[#63d392]/20 rounded-full blur-[80px]"></div>
					</div>
					<div className="relative z-10 text-center py-16 px-4">
						<h2 className="text-3xl font-semibold mb-4">Join Our Journey</h2>
						<p className="text-xl mb-8 max-w-2xl mx-auto">
							We&apos;re always looking for talented individuals to join our
							team and help shape the future of meetings.
						</p>
						<Button
							size="lg"
							className="bg-[#63d392] text-[#0a4a4e] hover:bg-[#4fb87a] hover:shadow-lg hover:shadow-[#63d392]/20 transition-all"
						>
							<a href="/careers" className="flex items-center">
								View Open Positions
								<ArrowRight className="ml-2 h-5 w-5" />
							</a>
						</Button>
					</div>
					{/* link to presentation */}
					<Link
						href="https://www.canva.com/design/DAGhi3SiSRo/3yfzdhBXk0ODtGmPVuvP0Q/edit?utm_content=DAGhi3SiSRo&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
						className="p-4 bg-[#63d392] rounded-tl-xl text-[#0a4a4e] font-medium"
					>
						See Our Presentation
					</Link>
				</section>
			</div>
		</div>
	);
}
