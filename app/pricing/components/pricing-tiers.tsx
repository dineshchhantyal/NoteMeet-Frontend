import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'For small teams or individuals testing the platform',
    features: [
      '5 meetings per month (up to 60 minutes each)',
      'Basic video recording and transcript generation',
      'Limited cloud storage (2 GB)',
      'Access to summary and action item generation for 3 meetings',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: '$25',
    description: 'For small businesses and teams needing consistent meeting management tools',
    features: [
      '50 meetings per month (up to 2 hours each)',
      'Unlimited transcript generation and summaries',
      'Cloud storage up to 50 GB',
      'Calendar integration for automated scheduling and reminders',
      'Priority email support',
    ],
  },
  {
    name: 'Business',
    price: '$75',
    description: 'For growing organizations requiring advanced analytics and integrations',
    features: [
      'Unlimited meetings (up to 4 hours each)',
      'Advanced transcription with sentiment analysis and multi-language support',
      '500 GB cloud storage',
      'Detailed analytics dashboards',
      'API access for custom workflows',
      '24/7 premium support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations needing tailored solutions and extensive scalability',
    features: [
      'Unlimited meetings with extended durations',
      'Dedicated cloud storage (customizable, up to multiple TBs)',
      'Custom branding for dashboards and emails',
      'Dedicated account manager and SLA-backed support',
      'Advanced integrations with existing tools',
      'Compliance with enterprise-grade security and data policies',
    ],
  },
]

export function PricingTiers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {tiers.map((tier) => (
        <Card key={tier.name} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">{tier.name}</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold">{tier.price}</span>
              {tier.price !== 'Custom' && <span className="text-sm">/month per user</span>}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted mb-4">{tier.description}</p>
            <ul className="space-y-2">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant={tier.name === 'Enterprise' ? 'outline' : 'default'}>
              {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

