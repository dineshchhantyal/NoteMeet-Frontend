import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Help Center | NoteMeet',
  description: 'Find answers to common questions and learn how to get the most out of NoteMeet.',
}

const helpCategories = [
  {
    title: "Getting Started",
    items: ["Creating an account", "Setting up your first meeting", "Inviting participants"]
  },
  {
    title: "Using NoteMeet",
    items: ["Recording meetings", "Generating transcripts", "Accessing meeting summaries"]
  },
  {
    title: "Account Management",
    items: ["Updating your profile", "Managing subscriptions", "Security settings"]
  },
  {
    title: "Troubleshooting",
    items: ["Connection issues", "Audio/video problems", "Syncing across devices"]
  }
]

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Help Center</h1>
      
      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <Input type="search" placeholder="Search for help..." className="pl-10" />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {helpCategories.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link href="#" className="text-blue-600 hover:underline">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="mb-4">Can&apos;t find what you&apos;re looking for?</p>
        <Button asChild>
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}

