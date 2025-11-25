"use client"

import { useEffect } from "react"
import { useLanguage } from "@/context/language-context"
import LandingPage from "@/components/landing/landing-page"

export default function Home() {
  const { language } = useLanguage()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const user = localStorage.getItem("user")

    if (isAuthenticated && user) {
      const userData = JSON.parse(user)
      window.location.href = userData.role === "admin" ? "/admin-dashboard" : "/farmer-dashboard"
    }
  }, [])

  return <LandingPage />
}
