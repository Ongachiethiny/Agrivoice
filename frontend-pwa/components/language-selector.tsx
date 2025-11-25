"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/context/language-context"

const languages = [
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" },
  { code: "luo", label: "Luo" },
  { code: "ki", label: "Kikuyu" },
  { code: "kalenjin", label: "Kalenjin" },
  { code: "kamba", label: "Kamba" },
  { code: "maasai", label: "Maasai" },
  { code: "somali", label: "Somali" },
  { code: "meru", label: "Meru" },
  { code: "taita", label: "Taita" },
  { code: "pokot", label: "Pokot" },
  { code: "kuria", label: "Kuria" },
  { code: "turkana", label: "Turkana" },
]

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const currentLabel = languages.find((lang) => lang.code === language)?.label || "English"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Globe className="h-4 w-4" />
          {currentLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-primary/10" : ""}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
