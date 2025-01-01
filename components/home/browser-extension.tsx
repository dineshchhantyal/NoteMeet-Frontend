import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function BrowserExtension() {
	return (
		<div className="container mx-auto px-4 py-16 text-white">
			<div className="grid md:grid-cols-2 gap-12 items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight mb-6">
						Supercharge Your Browser with Our Extension!
					</h1>
					<p className="text-lg  mb-8">
						Discover the power of our browser extension and make your online
						experience smarter and more efficient. With features like enhanced
						cookies management, seamless data storage, and integrated AI tools
						for better summaries and automated workflows, it&apos;s the ultimate
						productivity booster.
					</p>
					<Button
						size="lg"
						className="mb-4 bg-white text-black hover:bg-white/90 hover:text-black"
					>
						<Download className="mr-2 h-5 w-5" />
						{/* Download Now */}
						Coming Soon
					</Button>
					<p className="text-sm">Supports Chromium based browsers</p>
				</div>
				<div className="relative h-[400px]">
					<Image
						src="/logo.png"
						alt="Browser Extension Banner"
						fill
						className="object-cover rounded-lg shadow-2xl"
						priority
					/>
				</div>
			</div>
		</div>
	);
}
