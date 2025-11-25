"use client"

import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"
import { LanguageSelector } from "@/components/language-selector"
import { NavBar } from "./nav-bar"
import { HeroSection } from "./hero-section"
import { FeaturesSection } from "./features-section"
import { HowWorksSection } from "./how-works-section"
import { TestimonialsSection } from "./testimonials-section"
import { Footer } from "./footer"

export default function LandingPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Fixed: LanguageSelector now uses context internally */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      <NavBar translations={translations} language={language} />
      <HeroSection translations={translations} language={language} />
      <FeaturesSection translations={translations} language={language} />
      <HowWorksSection translations={translations} language={language} />
      <TestimonialsSection translations={translations} language={language} />
      <Footer translations={translations} language={language} />
    </div>
  )
}
