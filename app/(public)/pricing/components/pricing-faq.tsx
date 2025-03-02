'use client';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const faqItems = [
	{
		question: 'What happens when I reach my meeting limit?',
		answer:
			"When you reach your plan's meeting limit, you can upgrade to a higher tier, purchase additional meetings as an add-on, or wait until the next billing cycle when your limit resets.",
	},
	{
		question: 'Can I switch between monthly and annual billing?',
		answer:
			"Yes, you can switch between monthly and annual billing at any time. If you switch from monthly to annual, you'll get the discounted rate immediately. If you switch from annual to monthly, the change will take effect at the end of your current billing cycle.",
	},
	{
		question: 'Is there a limit to the number of team members I can add?',
		answer:
			'The Starter plan includes up to 3 team members, Professional includes up to 10, and Enterprise has unlimited team members. You can add additional team members to any plan for an additional per-user fee.',
	},
	{
		question:
			'Do you offer discounts for non-profits or educational institutions?',
		answer:
			'Yes, we offer special pricing for eligible non-profit organizations, educational institutions, and startups. Please contact our sales team for more information.',
	},
	{
		question: 'What payment methods do you accept?',
		answer:
			'We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. For Enterprise plans, we also offer invoicing options.',
	},
	{
		question: 'Can I cancel my subscription at any time?',
		answer:
			"Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to your plan until the end of your current billing cycle.",
	},
];

export function PricingFAQ() {
	return (
		<div>
			<div className="text-center mb-12">
				<div className="inline-block py-1 px-3 rounded-full bg-[#63d392]/20 text-[#63d392] text-sm font-medium mb-4">
					Questions
				</div>
				<h2 className="text-3xl font-semibold mb-4">
					Frequently Asked <span className="text-[#63d392]">Questions</span>
				</h2>
				<p className="text-gray-300 max-w-2xl mx-auto">
					Have more questions about our pricing or features? Here are some
					common questions our customers ask.
				</p>
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="max-w-3xl mx-auto bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#156469]/50 p-6"
			>
				<Accordion type="single" collapsible className="w-full">
					{faqItems.map((item, idx) => (
						<AccordionItem
							key={idx}
							value={`item-${idx}`}
							className="border-b border-[#63d392]/20 last:border-b-0"
						>
							<AccordionTrigger className="text-white hover:text-[#63d392] transition-colors py-4 text-left">
								{item.question}
							</AccordionTrigger>
							<AccordionContent className="text-gray-300 pb-4">
								{item.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>

				<div className="mt-8 text-center">
					<p className="text-gray-300 mb-4">
						Still have questions? We're here to help.
					</p>
					<a
						href="/contact"
						className="inline-flex items-center text-[#63d392] hover:underline"
					>
						Contact our sales team
						<ArrowRight className="ml-1 h-4 w-4" />
					</a>
				</div>
			</motion.div>
		</div>
	);
}
