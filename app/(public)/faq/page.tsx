import { Metadata } from 'next'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'FAQ | NoteMeet',
  description: 'Find answers to frequently asked questions about NoteMeet.',
}

const faqs = [
  {
    question: "What is NoteMeet?",
    answer: "NoteMeet is an AI-powered meeting management platform that helps teams streamline their meetings by providing automatic transcription, summarization, and action item extraction."
  },
  {
    question: "How does NoteMeet work?",
    answer: "NoteMeet uses advanced AI algorithms to transcribe your meetings in real-time, generate concise summaries, and identify key action items. It integrates with popular video conferencing platforms and can be accessed through our web application or mobile app."
  },
  {
    question: "Is my meeting data secure?",
    answer: "Yes, we take data security very seriously. All meeting data is encrypted in transit and at rest. We use industry-standard security measures and comply with GDPR and other relevant data protection regulations."
  },
  {
    question: "Can I integrate NoteMeet with my existing tools?",
    answer: "NoteMeet offers integrations with popular calendar apps, project management tools, and communication platforms. Check our integrations page for a full list of supported tools."
  },
  {
    question: "What languages does NoteMeet support?",
    answer: "Currently, NoteMeet supports transcription and summarization in English, Spanish, French, German, and Mandarin Chinese. We're continuously working on adding support for more languages."
  },
  {
    question: "How accurate are the transcriptions and summaries?",
    answer: "Our AI models achieve over 95% accuracy in transcription for clear audio. Summaries are generated based on these transcripts and key moment detection, providing a concise overview of the meeting's main points and action items."
  },
  {
    question: "Can I edit the transcripts or summaries?",
    answer: "Yes, you can edit both transcripts and summaries after they've been generated. This allows you to correct any errors or add additional context if needed."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a 14-day free trial for new users. This gives you full access to all features so you can experience the benefits of NoteMeet for yourself."
  },
  {
    question: "How do I get started with NoteMeet?",
    answer: "Getting started is easy! Simply sign up for an account on our website, download our app or browser extension, and you're ready to go. We also offer onboarding sessions for teams to help you get the most out of NoteMeet."
  }
]

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

