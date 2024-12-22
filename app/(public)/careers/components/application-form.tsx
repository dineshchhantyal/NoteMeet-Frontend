'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    // Here you would typically send the form data to your server
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    alert('Application submitted successfully!')
  }

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-semibold mb-8">Apply Now</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
        </div>
        
        <div>
          <Label htmlFor="position">Position</Label>
          <Select name="position" required>
            <SelectTrigger>
              <SelectValue placeholder="Select a position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="senior-full-stack-developer">Senior Full Stack Developer</SelectItem>
              <SelectItem value="ai-research-scientist">AI Research Scientist</SelectItem>
              <SelectItem value="product-marketing-manager">Product Marketing Manager</SelectItem>
              <SelectItem value="ux-ui-designer">UX/UI Designer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="resume">Resume</Label>
          <Input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" required />
        </div>
        
        <div>
          <Label htmlFor="cover-letter">Cover Letter</Label>
          <Textarea id="cover-letter" name="cover-letter" rows={5} />
        </div>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </section>
  )
}

