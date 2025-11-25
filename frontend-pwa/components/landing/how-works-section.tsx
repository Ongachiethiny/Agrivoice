"use client"

import { ImageIcon, Mic, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface HowWorksSectionProps {
  translations: any
  language: string
}

export function HowWorksSection({ translations, language }: HowWorksSectionProps) {
  const t = translations[language] || translations.en

  const steps = [
    { icon: ImageIcon, text: t.howWorks.step1 },
    { icon: Mic, text: t.howWorks.step2 },
    { icon: CheckCircle, text: t.howWorks.step3 },
  ]

  return (
    <section id="how" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t.howWorks.title}</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="flex flex-col items-center gap-4 flex-1">
                <Card className="w-full">
                  <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-accent" />
                    </div>
                    <p className="font-semibold text-foreground">{step.text}</p>
                  </CardContent>
                </Card>
                {idx < steps.length - 1 && <div className="hidden md:block text-2xl text-muted-foreground">→</div>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
