"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Leaf, Sparkles, ArrowRight, ImageIcon } from "lucide-react"

interface Message {
  id: string
  type: "user" | "agent"
  content: string
  timestamp: Date
  imageUrl?: string
}

export default function FarmerChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "agent",
      content:
        "Habari! I'm AgriVoice, your AI crop health assistant. Upload a photo of your crop or describe the problem, and I'll help diagnose the issue with local treatment solutions.",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content:
          "I detected brown spots with a fungal pattern on your maize leaf - this is likely Maize Rust (Puccinia polysora).\n\n✓ Organic Treatment:\n• Spray neem oil every 3-4 days\n• Mix ash + chili pepper paste for affected areas\n• Improve air circulation between plants\n\n✓ Expected Recovery: 10-14 days\n\nThis diagnosis has been translated to Swahili and is ready to share with other farmers.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentMessage])
      setIsLoading(false)
    }, 1500)
  }

  const suggestedQuestions = [
    { icon: "🌾", text: "What disease is my crop?" },
    { icon: "🧴", text: "Show organic treatments" },
    { icon: "📍", text: "Local resource solutions" },
    { icon: "📅", text: "Recovery timeline" },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gradient-to-b from-background via-background to-primary/5">
      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
            >
              <div className={`flex max-w-lg gap-3 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    message.type === "user"
                      ? "bg-gradient-to-br from-accent to-accent/70 text-accent-foreground font-bold"
                      : "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground"
                  }`}
                >
                  {message.type === "user" ? (
                    <span className="text-sm font-bold">F</span>
                  ) : (
                    <Leaf className="h-4 w-4" />
                  )}
                </div>

                <div
                  className={`px-4 py-3 rounded-2xl transition-all ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md rounded-tr-sm"
                      : "bg-card text-foreground border border-border/50 shadow-sm rounded-tl-sm hover:border-border/100 transition-colors"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-pretty">{message.content}</p>
                  <span
                    className={`text-xs opacity-60 mt-2 block ${message.type === "user" ? "text-primary-foreground/70" : ""}`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center shadow-sm">
                  <Leaf className="h-4 w-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-card border border-border/50 rounded-tl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Suggested Questions */}
      {messages.length === 1 && !isLoading && (
        <div className="px-4 md:px-8 py-6 border-t border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Try asking</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(q.text)}
                  className="text-left px-4 py-3 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-sm font-medium group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{q.icon}</span>
                    <span className="text-foreground/80 group-hover:text-foreground transition-colors">{q.text}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border/40 bg-card/80 backdrop-blur-xl p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl flex-shrink-0 hover:bg-primary/10 hover:border-primary/50 transition-all bg-transparent"
              title="Upload crop image"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>

            <Input
              placeholder="Ask about crop disease, treatment, or prevention..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="rounded-xl border-border/50 focus-visible:border-primary/50 transition-colors"
            />

            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="rounded-xl flex-shrink-0 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all"
            >
              <Send className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Powered by Azure Vision, GPT-4 & Translation
          </p>
        </div>
      </div>
    </div>
  )
}
