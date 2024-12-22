import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const jobs = [
  {
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "AI Research Scientist",
    department: "Research & Development",
    location: "San Francisco, CA",
    type: "Full-time",
  },
  {
    title: "Product Marketing Manager",
    department: "Marketing",
    location: "New York, NY",
    type: "Full-time",
  },
  {
    title: "UX/UI Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
  },
]

export function JobListings() {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-semibold mb-8">Open Positions</h2>
      <div className="grid gap-6">
        {jobs.map((job, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{job.department}</Badge>
                <Badge variant="outline">{job.location}</Badge>
                <Badge>{job.type}</Badge>
              </div>
              <Button>Apply Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

