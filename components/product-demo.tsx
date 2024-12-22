import { VideoPlayer } from '@/app/(protected)/(playground)/dashboard/components/video-player';

export function ProductDemo() {
	return (
		<section className="section-padding py-12">
			<div className="container mx-auto px-4 text-center">
				<h2 className="mb-8 text-white text-xl font-semibold">
					See NoteMeet in Action
				</h2>
				<div className="relative aspect-video max-w-4xl mx-auto">
					<VideoPlayer
						src="https://www.youtube.com/watch?v=cbj_bmFflrE"
						showControls={false}
					/>
				</div>
				<p className="mt-8 text-lg">Simplify Meetings Today!</p>
			</div>
		</section>
	);
}
