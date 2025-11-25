"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface TestimonialsSectionProps {
  translations: any
  language: string
}

export function TestimonialsSection({ translations, language }: TestimonialsSectionProps) {
  const t = translations[language] || translations.en

  const testimonials = [
    {
      name: "John Kipchoge",
      location: "Kisumu",
      text: "AgriVoice helped me identify maize rust early. I saved my entire harvest!",
      rating: 5,
    },
    {
      name: "Mary Wanjiru",
      location: "Nairobi",
      text: "The multilingual support is amazing. I can understand everything in my language.",
      rating: 5,
    },
    {
      name: "Hassan Ahmed",
      location: "Mombasa",
      text: "Best agricultural tool I've used. Quick, accurate, and affordable.",
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t.testimonials.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="border border-border">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground mb-4">{testimonial.text}</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
