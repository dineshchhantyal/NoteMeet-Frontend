import { Metadata } from 'next';
import { ContactForm } from './components/contact-form';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
	title: 'Contact Us | NoteMeet',
	description:
		'Get in touch with the NoteMeet team for support, sales inquiries, or partnership opportunities.',
};

export default function ContactPage() {
	return (
		<div className="container mx-auto px-4 py-16">
			<h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
				<div>
					<h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
					<p className="mb-8">
						Have a question or want to learn more about NoteMeet? We&apos;re
						here to help. Fill out the form and we&apos;ll get back to you as
						soon as possible.
					</p>
					<div className="space-y-4">
						<Card>
							<CardContent className="flex items-center p-4">
								<MapPin className="h-5 w-5 mr-4 text-primary" />
								<span>900 University Ave, Monroe, LA 71209</span>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="flex items-center p-4">
								<Phone className="h-5 w-5 mr-4 text-primary" />
								<span>+1 (318) 750-6383</span>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="flex items-center p-4">
								<Mail className="h-5 w-5 mr-4 text-primary" />
								<span>myagdichhantyal@gmail.com</span>
							</CardContent>
						</Card>
					</div>
				</div>
				<ContactForm />
			</div>
		</div>
	);
}
