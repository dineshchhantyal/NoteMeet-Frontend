import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import Video from 'next-video';
import NoteMeetIntro from '/videos/NoteMeetIntro.mp4';

export function HeroSection() {
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
							className="bg-white text-primary font-semibold hover:bg-primary hover:text-white"
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
							className="bg-white/10 text-white border-white hover:bg-white hover:text-primary font-semibold"
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
