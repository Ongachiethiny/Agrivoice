"use client"

import { Facebook, Twitter, MessageCircle, Youtube } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface FooterProps {
  translations: any
  language: string
}

export function Footer({ translations, language }: FooterProps) {
  const t = translations[language] || translations.en

  return (
    <footer className="bg-foreground text-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4">AgriVoice</h4>
            <p className="text-sm text-background/80">AI-powered crop diagnostics for African farmers</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.links}</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li>
                <a href="#home" className="hover:text-background transition">
                  {t.nav.home}
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-background transition">
                  {t.nav.features}
                </a>
              </li>
              <li>
                <a href="#how" className="hover:text-background transition">
                  {t.nav.how}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li>
                <a href="#" className="hover:text-background transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t.footer.social}</h4>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-background/80 transition" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-background/80 transition" />
              <MessageCircle className="h-5 w-5 cursor-pointer hover:text-background/80 transition" />
              <Youtube className="h-5 w-5 cursor-pointer hover:text-background/80 transition" />
            </div>
          </div>
        </div>

        <Separator className="bg-background/20 mb-6" />

        <div className="text-center text-sm text-background/70">{t.footer.copyright}</div>
      </div>
    </footer>
  )
}
