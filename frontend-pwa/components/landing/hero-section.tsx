"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Camera,
  Mic,
  Sparkles,
  ShieldCheck,
  Languages,
  ArrowUpRight,
} from "lucide-react";

interface HeroSectionProps {
  translations: any;
  language: string;
}

const heroStats = [
  { label: "Languages", value: "14+" },
  { label: "Diagnoses", value: "42k+" },
  { label: "Accuracy", value: "92%" },
];

const samplePrompts = [
  "What disease is my maize?",
  "Share organic remedies",
  "Explain recovery timeline",
];

const chatPreview = [
  {
    role: "user",
    content: "Leafs have brown spots spreading fast. What could it be?",
  },
  {
    role: "assistant",
    content:
      "Likely Maize Rust (Puccinia polysora). Clean infected leaves, spray neem + ash mix, improve spacing. Want this plan in Swahili?",
  },
  {
    role: "user",
    content: "Yes, and estimate recovery time.",
  },
  {
    role: "assistant",
    content:
      "Translation ready. With organic treatment, expect visible recovery in 10–14 days.",
  },
];

export function HeroSection({ translations, language }: HeroSectionProps) {
  const t = translations[language] || translations.en;

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_55%)] pt-28 pb-20 px-4"
    >
      <div className="absolute inset-0 blur-3xl opacity-60 pointer-events-none bg-linear-to-br from-emerald-200/30 via-white to-sky-200/40" />

      <div className="relative max-w-6xl mx-auto grid gap-16 lg:grid-cols-[minmax(0,1.05fr)_420px] items-center">
        <div className="space-y-10 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Built with Azure Vision + GPT-4
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
              {t.hero.title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
              {t.hero.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="gap-2 text-base px-8 py-6 shadow-lg shadow-emerald-500/20"
            >
              <Camera className="h-5 w-5" />
              {t.hero.cta1}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base px-8 py-6 bg-white/60 backdrop-blur"
            >
              <Mic className="h-5 w-5" />
              {t.hero.cta2}
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-emerald-100 bg-white/70 px-5 py-4 text-center shadow-sm"
              >
                <p className="text-3xl font-semibold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.3em]">
              Popular Prompts
            </p>
            <div className="flex flex-wrap gap-3">
              {samplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  className="rounded-full border border-slate-200/80 bg-white hover:border-emerald-300 hover:text-emerald-700 px-4 py-2 text-sm text-slate-600 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Card className="relative border border-slate-100/80 bg-white/90 shadow-2xl shadow-emerald-200/60 backdrop-blur-xl">
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-linear-to-br from-emerald-500 to-emerald-700 text-white font-semibold flex items-center justify-center">
                AI
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  AgriVoice Copilot
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online • Multi-language
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="gap-1 text-emerald-700 bg-emerald-50 border-emerald-100"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </Badge>
          </div>

          <div className="px-6 py-6 space-y-4">
            {chatPreview.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl border px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    message.role === "user"
                      ? "bg-slate-900 text-white border-transparent rounded-br-md"
                      : "bg-slate-50 border-slate-100 rounded-bl-md"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 pt-2 pb-6 space-y-4 border-t border-slate-100 bg-linear-to-b from-white to-slate-50">
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant="secondary"
                className="gap-1 bg-slate-900 text-slate-50"
              >
                <Languages className="h-3.5 w-3.5" />
                14 languages
              </Badge>
              <Badge
                variant="secondary"
                className="gap-1 bg-emerald-50 text-emerald-800 border-emerald-100"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Offline friendly tips
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              Works with photos, voice, and text. Built for farmers,
              agronomists, and government extension teams.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
