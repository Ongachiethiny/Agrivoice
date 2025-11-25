"use client"

import { Camera, Mic, Globe, Leaf } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FeaturesSectionProps {
  translations: any
  language: string
}

export function FeaturesSection({ translations, language }: FeaturesSectionProps) {
  const t = translations[language] || translations.en

  const features = [
    {
      icon: Camera,
      title: t.features.imageTitle,
      description: t.features.imageDesc,
    },
    {
      icon: Mic,
      title: t.features.voiceTitle,
      description: t.features.voiceDesc,
    },
    {
      icon: Globe,
      title: t.features.langTitle,
      description: t.features.langDesc,
    },
    {
      icon: Leaf,
      title: t.features.organicTitle,
      description: t.features.organicDesc,
    },
  ]

  return (
    <section id="features" className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t.features.title}</h2>
          <p className="text-lg text-muted-foreground">Powerful tools for modern farming</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card key={idx} className="border border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="mb-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
