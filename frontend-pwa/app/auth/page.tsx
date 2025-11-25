"use client"

import type React from "react"

import { useState } from "react"
import { Leaf, Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { LanguageSelector } from "@/components/language-selector"

export default function AuthPage() {
  const { language, setLanguage } = useLanguage()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("farmer")
  const [isLoading, setIsLoading] = useState(false)

  const authTranslations: Record<string, Record<string, string>> = {
    en: {
      createAccount: "Create Account",
      welcomeBack: "Welcome Back",
      joinAgriVoice: "Join AgriVoice to diagnose crops",
      signInAccount: "Sign in to your account",
      fullName: "Full Name",
      namePlaceholder: "John Kipchoge",
      emailAddress: "Email Address",
      emailPlaceholder: "farmer@agrivoice.com",
      password: "Password",
      iAm: "I am a:",
      farmer: "Farmer",
      adminDevops: "Admin/DevOps",
      createAccountBtn: "Create Account",
      signingIn: "Signing in...",
      creatingAccount: "Creating account...",
      signInBtn: "Sign In",
      haveAccount: "Already have an account?",
      noAccount: "Don't have an account?",
      signInLink: "Sign In",
      signUpLink: "Sign Up",
      secureAuth: "Secure authentication powered by AgriVoice",
    },
    sw: {
      createAccount: "Tengeneza Akaunti",
      welcomeBack: "Karibu Tena",
      joinAgriVoice: "Jiunge na AgriVoice ili kubaini mimea",
      signInAccount: "Ingia akaunti yako",
      fullName: "Jina Kamili",
      namePlaceholder: "John Kipchoge",
      emailAddress: "Barua Pepe",
      emailPlaceholder: "farmer@agrivoice.com",
      password: "Nenosiri",
      iAm: "Mimi ni:",
      farmer: "Mkulima",
      adminDevops: "Admin/DevOps",
      createAccountBtn: "Tengeneza Akaunti",
      signingIn: "Ingia...",
      creatingAccount: "Tengeneza akaunti...",
      signInBtn: "Ingia",
      haveAccount: "Je, una akaunti?",
      noAccount: "Huna akaunti?",
      signInLink: "Ingia",
      signUpLink: "Jisajili",
      secureAuth: "Uthibitisho salama unaotumia AgriVoice",
    },
    luo: {
      createAccount: "Gima Akaunti",
      welcomeBack: "Karieth Mbangu",
      joinAgriVoice: "Kir ne AgriVoice muol muto",
      signInAccount: "Ingia akaunti",
      fullName: "Nying Moholo",
      namePlaceholder: "John Kipchoge",
      emailAddress: "Email",
      emailPlaceholder: "farmer@agrivoice.com",
      password: "Seche Puonj",
      iAm: "An:",
      farmer: "Jonyamarwa",
      adminDevops: "Admin/DevOps",
      createAccountBtn: "Gima Akaunti",
      signingIn: "Ingia...",
      creatingAccount: "Gima akaunti...",
      signInBtn: "Ingia",
      haveAccount: "Ni kiyie akaunti?",
      noAccount: "Ok ni akaunti?",
      signInLink: "Ingia",
      signUpLink: "Gima",
      secureAuth: "Seche puonj ma ok maricho",
    },
  }

  const currentTranslation = authTranslations[language] || authTranslations.en

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      if (isSignUp) {
        localStorage.setItem("user", JSON.stringify({ email, name, role, id: Date.now() }))
        localStorage.setItem("isAuthenticated", "true")
      } else {
        localStorage.setItem("user", JSON.stringify({ email, name: email.split("@")[0], role, id: Date.now() }))
        localStorage.setItem("isAuthenticated", "true")
      }
      setIsLoading(false)
      window.location.href = role === "admin" ? "/admin-dashboard" : "/farmer-dashboard"
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
      </div>

      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">
              <span className="text-gray-800">Agri</span>
              <span className="text-primary">Voice</span>
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-green-100">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            {isSignUp ? currentTranslation.createAccount : currentTranslation.welcomeBack}
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {isSignUp ? currentTranslation.joinAgriVoice : currentTranslation.signInAccount}
          </p>

          <form onSubmit={handleAuth} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{currentTranslation.fullName}</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={currentTranslation.namePlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{currentTranslation.emailAddress}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={currentTranslation.emailPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{currentTranslation.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{currentTranslation.iAm}</label>
                <div className="flex gap-3">
                  {[
                    { value: "farmer", label: currentTranslation.farmer },
                    { value: "admin", label: currentTranslation.adminDevops },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRole(opt.value)}
                      className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                        role === opt.value ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-70 mt-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isSignUp ? currentTranslation.creatingAccount : currentTranslation.signingIn}
                </div>
              ) : isSignUp ? (
                currentTranslation.createAccountBtn
              ) : (
                currentTranslation.signInBtn
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            {isSignUp ? currentTranslation.haveAccount : currentTranslation.noAccount}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-semibold hover:underline">
              {isSignUp ? currentTranslation.signInLink : currentTranslation.signUpLink}
            </button>
          </p>
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">{currentTranslation.secureAuth}</p>
      </div>
    </div>
  )
}
