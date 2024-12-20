import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Thompson",
    role: "Team Lead",
    company: "TechCorp",
    image: "/testimonial-1.jpg",
    quote: "NoteMeet completely transformed how our team handles meetings. The summaries and action items are lifesavers!"
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "InnovateCo",
    image: "/testimonial-2.jpg",
    quote: "The time we've saved with NoteMeet has allowed us to focus on what really matters - building great products."
  },
  {
    name: "Emily Rodriguez",
    role: "HR Director",
    company: "GlobalHR",
    image: "/testimonial-3.jpg",
    quote: "NoteMeet has streamlined our hiring process. The transcripts and summaries have been invaluable for our team."
  }
]

export function CustomerTestimonials() {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-12">What Our Customers Say</h2>
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <Card className="bg-gray-50">
                  <CardContent className="flex flex-col md:flex-row items-center text-center md:text-left p-6">
                    <div className="md:w-1/3 mb-6 md:mb-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={120}
                        height={120}
                        className="rounded-full mx-auto"
                      />
                    </div>
                    <div className="md:w-2/3 md:pl-6">
                      <Quote className="h-8 w-8 text-primary mb-4" />
                      <p className="text-lg mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}
