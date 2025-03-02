import { Metadata } from 'next';
import {
	Shield,
	Lock,
	FileText,
	Users,
	Search,
	RefreshCw,
	MessageSquare,
} from 'lucide-react';

export const metadata: Metadata = {
	title: 'Privacy Policy | NoteMeet',
	description:
		'Learn about how NoteMeet collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
	const sections = [
		{
			id: 'introduction',
			title: '1. Introduction',
			content:
				'NoteMeet ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.',
			icon: <Shield className="h-6 w-6" />,
		},
		{
			id: 'information-collected',
			title: '2. Information We Collect',
			content:
				'We collect information that you provide directly to us, such as:',
			listItems: [
				'Account information (e.g., name, email address, password)',
				'Profile information (e.g., job title, company name)',
				'Meeting data (e.g., meeting titles, participants, transcripts, summaries)',
				'Communication data (e.g., when you contact our support team)',
			],
			icon: <Users className="h-6 w-6" />,
		},
		{
			id: 'information-use',
			title: '3. How We Use Your Information',
			content: 'We use the information we collect to:',
			listItems: [
				'Provide, maintain, and improve our services',
				'Process transactions and send related information',
				'Send you technical notices, updates, security alerts, and support messages',
				'Respond to your comments, questions, and requests',
				'Develop new products and services',
			],
			icon: <FileText className="h-6 w-6" />,
		},
		{
			id: 'data-security',
			title: '4. Data Security',
			content:
				'We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.',
			icon: <Lock className="h-6 w-6" />,
		},
		{
			id: 'your-rights',
			title: '5. Your Rights',
			content:
				'Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. To exercise these rights, please contact us using the information provided at the end of this policy.',
			icon: <Search className="h-6 w-6" />,
		},
		{
			id: 'changes',
			title: '6. Changes to This Privacy Policy',
			content:
				'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.',
			icon: <RefreshCw className="h-6 w-6" />,
		},
		{
			id: 'contact',
			title: '7. Contact Us',
			content:
				'If you have any questions about this Privacy Policy, please contact us at:',
			contactInfo: [
				{
					label: 'Email:',
					value: 'myagdichhantyal@gmail.com',
					link: 'mailto:myagdichhantyal@gmail.com',
				},
				{
					label: 'Address:',
					value: '900 University Ave, Monroe, LA 71209',
				},
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
						Privacy{' '}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#63d392] to-[#8ae9b3]">
							Policy
						</span>
					</h1>
					<p className="text-gray-300 max-w-2xl mx-auto">
						We&apos;re committed to the security and privacy of your data.
						Here&apos;s how we protect your information.
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
									{sections.map((section) => (
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
								{sections.map((section) => (
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
						<a href="/terms" className="text-[#63d392] hover:underline">
							Terms of Service
						</a>
						.
					</p>
				</div>
			</main>
		</div>
	);
}
