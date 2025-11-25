"use client"

import { useState } from "react"
import { Leaf, LogOut, Settings, Menu, X, User, BookOpen, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavigationProps {
  onLogout?: () => void
}

export default function Navigation({ onLogout }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    console.log("[v0] Logout initiated")
    if (onLogout) onLogout()
    // In production, this would clear auth tokens and redirect to login
  }

  return (
    <>
      <nav className="border-b border-border/40 bg-card sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AgriVoice
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Crop Health Assistant</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  <span>Configuration</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <BookOpen className="h-4 w-4" />
                  <span>Documentation</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <HelpCircle className="h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Avatar */}
            <button className="h-10 w-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center hover:bg-primary/30 transition-colors">
              F
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/40 bg-card/95 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuration
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Documentation
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Support
              </button>
              <div className="border-t border-border/40 my-2"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors text-sm flex items-center gap-2 text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
