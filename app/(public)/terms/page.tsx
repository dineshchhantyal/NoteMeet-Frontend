import { Metadata } from 'next';
import {
	File,
	Users,
	Ban,
	ShieldAlert,
	MessageSquare,
	BookOpen,
	Building,
} from 'lucide-react';

export const metadata: Metadata = {
	title: 'Terms of Service | NoteMeet',
	description:
		'Read the terms and conditions governing the use of NoteMeet services.',
};

export default function TermsOfServicePage() {
	// Define the terms sections with icons
	const termsSections = [
		{
			id: 'acceptance',
			title: '1. Acceptance of Terms',
			content:
				"By accessing or using NoteMeet's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.",
			icon: <File className="h-6 w-6" />,
		},
		{
			id: 'service',
			title: '2. Description of Service',
			content:
				'NoteMeet provides an AI-powered meeting management platform that includes features such as meeting transcription, summarization, and analysis. We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.',
			icon: <BookOpen className="h-6 w-6" />,
		},
		{
			id: 'accounts',
			title: '3. User Accounts',
			content:
				'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.',
			icon: <Users className="h-6 w-6" />,
		},
		{
			id: 'intellectual',
			title: '4. Intellectual Property',
			content:
				'The Service and its original content, features, and functionality are owned by NoteMeet and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.',
			icon: <Building className="h-6 w-6" />,
		},
		{
			id: 'prohibited',
			title: '5. Prohibited Uses',
			content: 'You agree not to use the service:',
			listItems: [
				'For any unlawful purpose or to solicit others to perform or participate in any unlawful acts',
				'To infringe upon or violate our intellectual property rights or the intellectual property rights of others',
				'To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate',
				'To submit false or misleading information',
				'To upload or transmit viruses or any other type of malicious code',
			],
			icon: <Ban className="h-6 w-6" />,
		},
		{
			id: 'termination',
			title: '6. Termination',
			content:
				'We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.',
			icon: <ShieldAlert className="h-6 w-6" />,
		},
		{
			id: 'contact',
			title: '7. Contact Us',
			content:
				'If you have any questions about these Terms, please contact us at:',
			contactInfo: [
				{
					label: 'Email:',
					value: 'myagdichhantyal@gmail.com',
					link: 'mailto:myagdichhantyal@gmail.com',
				},
				{ label: 'Address:', value: '900 University Ave, Monroe, LA 71209' },
			],
			icon: <MessageSquare className="h-6 w-6" />,
		},
	];

	return (
		<div className="bg-[#0a4a4e] min-h-screen">
			{/* Decorative background elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-[20%] left-[10%] w-72 h-72 bg-[#63d392]/5 rounded-full blur-[100px]"></div>
				<div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#156469]/20 rounded-full blur-[100px]"></div>
			</div>

			<main className="container mx-auto px-4 py-24 max-w-4xl relative z-10">
				<div className="text-center mb-12">
					<div className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-6">
						Legal Information
					</div>
					<h1 className="text-4xl font-bold mb-3 text-white">
						Terms of{' '}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#63d392] to-[#8ae9b3]">
							Service
						</span>
					</h1>
					<p className="text-gray-300 max-w-2xl mx-auto">
						Please read these terms carefully before using the NoteMeet
						platform.
					</p>
				</div>

				<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-8 mb-8">
					<p className="text-gray-300 border-b border-[#63d392]/20 pb-4">
						Last updated: <span className="text-white">June 20, 2023</span>
					</p>

					<div className="flex flex-col-reverse md:flex-row gap-8 mt-6">
						{/* Table of Contents (desktop) */}
						<div className="hidden md:block md:w-1/4">
							<div className="sticky top-8">
								<h3 className="text-[#63d392] font-medium mb-4">Contents</h3>
								<ul className="space-y-2 text-sm">
									{termsSections.map((section) => (
										<li key={section.id}>
											<a
												href={`#${section.id}`}
												className="text-gray-300 hover:text-[#63d392] transition-colors flex items-center"
											>
												<div className="mr-2 opacity-70">{section.icon}</div>
												{section.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						</div>

						{/* Main Content */}
						<div className="flex-1">
							<section className="space-y-12">
								{termsSections.map((section) => (
									<div
										key={section.id}
										id={section.id}
										className="scroll-mt-24 hover:bg-[#156469]/50 p-6 -mx-6 rounded-lg transition-colors"
									>
										<div className="flex items-center mb-4">
											<div className="bg-[#63d392]/10 p-2 rounded-lg mr-4 text-[#63d392]">
												{section.icon}
											</div>
											<h2 className="text-2xl font-semibold text-white">
												{section.title}
											</h2>
										</div>

										<p className="text-gray-300 leading-relaxed mb-4">
											{section.content}
										</p>

										{section.listItems && (
											<ul className="space-y-2 pl-6">
												{section.listItems.map((item, i) => (
													<li
														key={i}
														className="text-gray-300 flex items-start"
													>
														<span className="text-[#63d392] mr-2 mt-1.5">
															•
														</span>
														{item}
													</li>
												))}
											</ul>
										)}

										{section.contactInfo && (
											<div className="mt-4 bg-[#0d5559]/50 p-4 rounded-lg border border-[#63d392]/20">
												{section.contactInfo.map((info, i) => (
													<p key={i} className="text-gray-300 mb-2 last:mb-0">
														<span className="text-[#63d392] font-medium">
															{info.label}
														</span>{' '}
														{info.link ? (
															<a
																href={info.link}
																className="text-white hover:text-[#63d392] hover:underline transition-colors"
															>
																{info.value}
															</a>
														) : (
															<span className="text-white">{info.value}</span>
														)}
													</p>
												))}
											</div>
										)}
									</div>
								))}
							</section>
						</div>
					</div>
				</div>

				{/* Additional notes */}
				<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 p-6 text-center">
					<p className="text-gray-300">
						For additional information about how we handle your data, please
						refer to our{' '}
						<a href="/privacy" className="text-[#63d392] hover:underline">
							Privacy Policy
						</a>
						.
					</p>
				</div>
			</main>
		</div>
	);
}
