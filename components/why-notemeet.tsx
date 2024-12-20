import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Users, Workflow } from 'lucide-react'

const benefits = [
  {
    icon: Clock,
    title: "Save Time",
    description: "Reduce post-meeting admin tasks by 50%."
  },
  {
    icon: Users,
    title: "Improve Collaboration",
    description: "Share actionable insights instantly."
  },
  {
    icon: Workflow,
    title: "Streamline Workflow",
    description: "Integrated with the tools you already love."
  }
]

export function WhyNoteMeet() {
  return (
    <section className="py-20 bg-[#F5F7FA]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Why NoteMeet?</h2>
        <p className="text-xl text-center mb-12 max-w-2xl mx-auto">
          Say goodbye to unproductive meetings. NoteMeet empowers teams to focus on what matters by automating the repetitive.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <benefit.icon className="mr-2 h-6 w-6 text-primary" />
                  {benefit.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

