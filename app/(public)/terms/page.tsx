import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Terms of Service | NoteMeet',
	description:
		'Read the terms and conditions governing the use of NoteMeet services.',
};

export default function TermsOfServicePage() {
	return (
		<main className="container mx-auto px-4 py-16 max-w-4xl">
			<h1 className="text-4xl font-bold mb-12 text-center">Terms of Service</h1>

			<div className="prose prose-lg max-w-none">
				<p className="text-gray-600">Last updated: June 20, 2023</p>

				{/* Terms sections with improved styling */}
				<div className="space-y-8">
					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">
							1. Acceptance of Terms
						</h2>
						<p className="text-gray-700 leading-relaxed">
							By accessing or using NoteMeet&apos;s services, you agree to be
							bound by these Terms of Service and all applicable laws and
							regulations. If you do not agree with any part of these terms, you
							may not use our services.
						</p>
					</section>

					{/* Repeat the section structure for each term */}
					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">
							2. Description of Service
						</h2>
						<p className="text-gray-700 leading-relaxed">
							NoteMeet provides an AI-powered meeting management platform that
							includes features such as meeting transcription, summarization,
							and analysis. We reserve the right to modify or discontinue,
							temporarily or permanently, the service with or without notice.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">
							3. User Accounts
						</h2>
						<p className="text-gray-700 leading-relaxed">
							You are responsible for maintaining the confidentiality of your
							account and password. You agree to accept responsibility for all
							activities that occur under your account or password.
						</p>
					</section>

					{/* For the section with list */}
					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">
							5. Prohibited Uses
						</h2>
						<p className="text-gray-700 mb-4">
							You agree not to use the service:
						</p>
						<ul className="list-disc pl-6 space-y-2 text-gray-700">
							<li>
								For any unlawful purpose or to solicit others to perform or
								participate in any unlawful acts
							</li>
							<li>
								To infringe upon or violate our intellectual property rights or
								the intellectual property rights of others
							</li>
							<li>
								To harass, abuse, insult, harm, defame, slander, disparage,
								intimidate, or discriminate
							</li>
							<li>To submit false or misleading information</li>
							<li>
								To upload or transmit viruses or any other type of malicious
								code
							</li>
						</ul>
					</section>

					{/* Contact section with special styling */}
					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">
							9. Contact Us
						</h2>
						<p className="text-gray-700 leading-relaxed">
							If you have any questions about these Terms, please contact us at:
						</p>
						<div className="mt-4 bg-gray-50 p-4 rounded-lg">
							<p className="text-gray-700">Email: myagdichhantyal@gmail.com</p>
							<p className="text-gray-700">
								Address: 900 University Ave, Monroe, LA 71209
							</p>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}
