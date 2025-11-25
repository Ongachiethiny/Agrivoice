"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Zap, CheckSquare, LogOut } from "lucide-react"
import Image from "next/image"

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/copilot", label: "Copilot Integration", icon: Zap },
    { href: "/deployment", label: "Deployment Checklist", icon: CheckSquare },
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-border flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative w-10 h-10">
            <Image src="/logo.png" alt="AgriVoice" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-tight">AgriVoice</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive ? "bg-primary text-primary-foreground shadow-md" : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors font-medium text-sm"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
