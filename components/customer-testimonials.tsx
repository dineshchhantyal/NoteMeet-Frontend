'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';

const testimonials = [
	{
		name: 'Dinesh Chhantyal',
		role: 'Founder',
		company: 'NoteMeet',
		image: '/testimonial-2.jpg',
		quote:
			"The time we've saved with NoteMeet has allowed us to focus on what really matters - building great products.",
	},
	{
		name: 'Sujan Mangarati',
		role: 'Marketing Head',
		company: 'TechCorp',
		image: '/testimonial-1.jpg',
		quote:
			'NoteMeet completely transformed how our team handles meetings. The summaries and action items are lifesavers!',
	},
	{
		name: 'Bishwash Kunwar',
		role: 'HR Director',
		company: 'GlobalHR',
		image: '/testimonial-3.jpg',
		quote:
			'NoteMeet has streamlined our hiring process. The transcripts and summaries have been invaluable for our team.',
	},
];

export function CustomerTestimonials() {
	return (
		<section className="py-20 bg-[#0a4a4e]">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
						Customer <span className="text-[#63d392]">Testimonials</span>
					</h2>
					<p className="text-gray-300 max-w-2xl mx-auto">
						Hear what our customers have to say about their experience with
						NoteMeet
					</p>
				</motion.div>

				<Carousel
					className="w-full max-w-4xl mx-auto"
					plugins={[
						Autoplay({
							delay: 5000,
						}),
					]}
					opts={{
						loop: true,
					}}
				>
					<CarouselContent>
						{testimonials.map((testimonial, index) => (
							<CarouselItem key={index}>
								<Card className="bg-[#156469]/40 border border-[#63d392]/20 backdrop-blur-sm">
									<CardContent className="flex flex-col md:flex-row items-center text-center md:text-left p-8">
										<div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
											<div className="relative">
												<div className="absolute inset-0 bg-[#63d392] rounded-full blur-md opacity-20"></div>
												<Avatar className="h-24 w-24 border-4 border-[#63d392]/30 relative">
													<AvatarImage
														src={testimonial.image}
														alt={testimonial.name}
													/>
													<AvatarFallback className="bg-[#156469] text-white text-xl">
														{testimonial.name
															.split(' ')
															.map((n) => n[0])
															.join('')}
													</AvatarFallback>
												</Avatar>
											</div>
											<div className="mt-4">
												<p className="font-semibold text-white">
													{testimonial.name}
												</p>
												<p className="text-sm text-[#63d392]">
													{testimonial.role}
												</p>
												<p className="text-xs text-gray-300">
													{testimonial.company}
												</p>
											</div>
										</div>
										<div className="md:w-2/3 md:pl-8 relative">
											<div className="absolute -left-2 top-0 opacity-10">
												<Quote className="h-16 w-16 text-[#63d392]" />
											</div>
											<div className="relative">
												<p className="text-lg mb-6 italic text-white leading-relaxed">
													&quot;{testimonial.quote}&quot;
												</p>
												<div className="flex items-center justify-center md:justify-start">
													<div className="flex">
														{[...Array(5)].map((_, i) => (
															<svg
																key={i}
																xmlns="http://www.w3.org/2000/svg"
																className="h-5 w-5 text-[#63d392]"
																viewBox="0 0 20 20"
																fill="currentColor"
															>
																<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
															</svg>
														))}
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>

					<div className="flex items-center justify-center mt-8 gap-4">
						<CarouselPrevious className="static bg-[#156469] hover:bg-[#156469]/80 border-[#63d392]/20 text-white hover:text-[#63d392] translate-y-0" />
						<CarouselNext className="static bg-[#156469] hover:bg-[#156469]/80 border-[#63d392]/20 text-white hover:text-[#63d392] translate-y-0" />
					</div>
				</Carousel>
			</div>
		</section>
	);
}
