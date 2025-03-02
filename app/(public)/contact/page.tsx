import { Metadata } from 'next';
import { ContactForm } from './components/contact-form';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
	title: 'Contact Us | NoteMeet',
	description:
		'Get in touch with the NoteMeet team for support, sales inquiries, or partnership opportunities.',
};

export default function ContactPage() {
	return (
		<div className="bg-[#0a4a4e] min-h-screen">
			{/* Decorative background elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-[20%] left-[10%] w-72 h-72 bg-[#63d392]/5 rounded-full blur-[100px]"></div>
				<div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#156469]/20 rounded-full blur-[100px]"></div>
			</div>

			<div className="container mx-auto px-4 py-24 text-white relative z-10">
				<div className="text-center mb-16">
					<div className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-6">
						Reach Out
					</div>
					<h1 className="text-4xl md:text-5xl font-bold mb-8">
						Get in{' '}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#63d392] to-[#8ae9b3]">
							Touch
						</span>
					</h1>
					<p className="text-xl text-gray-300 max-w-2xl mx-auto">
						Have questions about NoteMeet? We're here to help you transform your
						meeting experience.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
					<div className="lg:col-span-2">
						<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-8">
							<h2 className="text-2xl font-semibold mb-6 flex items-center">
								<MessageSquare className="h-6 w-6 mr-3 text-[#63d392]" />
								How Can We Help?
							</h2>

							<p className="text-gray-300 mb-8">
								Whether you need assistance with your account, want to learn
								more about our features, or are interested in enterprise
								solutions, our team is ready to support you.
							</p>

							<div className="space-y-6">
								<Card className="bg-[#0d5559]/50 border-[#156469] shadow-md">
									<CardContent className="flex items-center p-5">
										<div className="bg-[#63d392]/10 p-2.5 rounded-lg mr-4">
											<MapPin className="h-5 w-5 text-[#63d392]" />
										</div>
										<span className="text-gray-200">
											900 University Ave, Monroe, LA 71209
										</span>
									</CardContent>
								</Card>

								<Card className="bg-[#0d5559]/50 border-[#156469] shadow-md">
									<CardContent className="flex items-center p-5">
										<div className="bg-[#63d392]/10 p-2.5 rounded-lg mr-4">
											<Phone className="h-5 w-5 text-[#63d392]" />
										</div>
										<span className="text-gray-200">+1 (318) 750-6383</span>
									</CardContent>
								</Card>

								<Card className="bg-[#0d5559]/50 border-[#156469] shadow-md">
									<CardContent className="flex items-center p-5">
										<div className="bg-[#63d392]/10 p-2.5 rounded-lg mr-4">
											<Mail className="h-5 w-5 text-[#63d392]" />
										</div>
										<span className="text-gray-200">
											myagdichhantyal@gmail.com
										</span>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>

					<div className="lg:col-span-3">
						<ContactForm />
					</div>
				</div>
			</div>
		</div>
	);
}
