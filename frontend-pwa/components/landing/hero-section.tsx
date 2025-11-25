"use client"

import { Button } from "@/components/ui/button"
import { Camera, Mic } from "lucide-react"

interface HeroSectionProps {
  translations: any
  language: string
}

export function HeroSection({ translations, language }: HeroSectionProps) {
  const t = translations[language] || translations.en

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 pt-32 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center py-20 gap-8">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">{t.hero.title}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-lg px-8 py-6">
            <Camera className="h-5 w-5" />
            {t.hero.cta1}
          </Button>
          <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 bg-transparent">
            <Mic className="h-5 w-5" />
            {t.hero.cta2}
          </Button>
        </div>

        <div className="pt-12 w-full">
          <div className="bg-gradient-to-b from-primary/10 to-transparent rounded-3xl aspect-video flex items-center justify-center">
            <div className="text-muted-foreground">Crop Diagnosis Hero Image</div>
          </div>
        </div>
      </div>
    </section>
  )
}
