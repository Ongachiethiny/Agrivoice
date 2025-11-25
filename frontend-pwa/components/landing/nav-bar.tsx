"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface NavBarProps {
  language: string;
  translations: any;
}

export function NavBar({ language, translations }: NavBarProps) {
  const t = translations[language] || translations.en;

  return (
    <nav className="fixed w-full top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/agrivoice.png"
            alt="AgriVoice"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="text-xl font-bold text-foreground">AgriVoice</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#home"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            {t.nav.home}
          </a>
          <a
            href="#how"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            {t.nav.how}
          </a>
          <a
            href="#features"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            {t.nav.features}
          </a>
          <a
            href="#contact"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            {t.nav.contact}
          </a>
        </div>

        <Link href="/auth">
          <Button className="bg-primary hover:bg-primary/90">Sign In</Button>
        </Link>
      </div>
    </nav>
  );
}
