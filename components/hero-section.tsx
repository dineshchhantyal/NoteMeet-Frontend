import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import Video from 'next-video';
import NoteMeetIntro from '/videos/NoteMeetIntro.mp4';

export function HeroSection2() {
	return (
		<section className="bg-gradient-to-r from-primary to-[#50E3C2] text-white section-padding">
			<div className="container py-12 mx-auto px-4 flex flex-col lg:flex-row items-center">
				<div className="lg:w-1/2 mb-10 lg:mb-0 justify-se">
					<h1 className="mb-2  text-white text-3xl font-bold">
						Streamline Your Meetings, Amplify Your Productivity
					</h1>
					<p className="text-xl mb-8 text-gray-100 max-w-lg">
						Effortlessly record, transcribe, and summarize meetings with
						NoteMeet. Focus on what matters while we handle the details.
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<Button
							size="lg"
							className="bg-white text-white font-semibold hover:bg-primary hover:text-white"
							asChild
						>
							<a href="/early-access">
								Early Access
								<ArrowRight className="ml-2 h-5 w-5" />
							</a>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="bg-white/10 text-white border-white hover:bg-white hover:text-white font-semibold"
							asChild
						>
							<a href="/early-access">
								See It in Action
								<Calendar className="ml-2 h-5 w-5" />
							</a>
						</Button>
					</div>
				</div>
				<div className="lg:w-1/2">
					{/* <Image
            src="/hero-illustration.svg"
            alt="NoteMeet collaboration illustration"
            width={600}
            height={400}
            className="w-full h-auto"
          /> */}
					<Video
						src={NoteMeetIntro}
						className="w-full h-auto aspect-video"
						blurDataURL="/logo.png"
					/>
				</div>
			</div>
		</section>
	);
}

export const HeroSection = () => {
	return (
		<section id="hero" className="bg-[#0a4a4e] min-h-[70vh] pt-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div className="text-white space-y-8 animate__animated animate__fadeIn">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
							<span className="text-[#63d392]">Transform</span> Your Meeting
							Experience
						</h1>
						<p className="text-xl md:text-2xl font-light">
							Streamline your meetings and boost productivity with automated
							recording, transcription, and summarization.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							{/* 	<button className="bg-[#63d392] text-[#0a4a4e] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 animate__animated animate__pulse animate__infinite">
								Get Started Free
							</button>
							<button className="border-2 border-[#63d392] text-[#63d392] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#63d392] hover:text-[#0a4a4e] transition-all duration-300">
								Watch Demo
							</button> */}
							<Button
								size="lg"
								className="bg-[#63d392] text-[#0a4a4e] font-semibold hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
								asChild
							>
								<a href="/early-access">Get Started Free</a>
							</Button>

							<Button
								size="lg"
								variant="outline"
								className="border-2 border-[#63d392] text-[#63d392] hover:bg-[#63d392] hover:text-[#0a4a4e] transition-all duration-300"
								asChild
							>
								<a href="/early-access">Watch in Action</a>
							</Button>
						</div>
						<div className="flex items-center gap-4 text-sm">
							<div className="flex items-center">
								<svg
									className="w-5 h-5 text-[#63d392] mr-2"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								<span>50% Time Saved</span>
							</div>
							<div className="flex items-center">
								<svg
									className="w-5 h-5 text-[#63d392] mr-2"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								<span>AI-Powered Insights</span>
							</div>
						</div>
					</div>
					<div className="relative animate__animated animate__fadeInRight">
						<div className="bg-[#63d392] absolute -inset-4 blur-lg opacity-20 rounded-xl"></div>
						<div className="relative bg-neutral-800 p-6 rounded-xl border border-[#63d392]/30">
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 rounded-full bg-red-500"></div>
									<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
									<div className="w-3 h-3 rounded-full bg-green-500"></div>
								</div>
								<div className="space-y-3">
									<div className="h-4 bg-neutral-700 rounded w-3/4"></div>
									<div className="h-4 bg-neutral-700 rounded w-1/2"></div>
									<div className="h-4 bg-neutral-700 rounded w-5/6"></div>
									<div className="h-4 bg-neutral-700 rounded w-2/3"></div>
								</div>
								<div className="flex justify-end">
									<div className="bg-[#63d392] text-[#0a4a4e] px-4 py-2 rounded text-sm">
										Meeting Transcribed
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
