"use client";

import { useState, useEffect } from "react";
import {
  Leaf,
  LogOut,
  Menu,
  X,
  Upload,
  History,
  Bell,
  Mic,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { LanguageSelector } from "@/components/language-selector";
import FarmerChat from "@/components/farmer-chat";

export default function FarmerDashboard() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isChatView, setIsChatView] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const dashboardTranslations: Record<string, Record<string, string>> = {
    en: {
      welcomeBack: "Welcome Back",
      getInstant: "Chat live with AgriVoice Copilot",
      uploadLeaf: "Upload a leaf photo for diagnosis",
      uploadNow: "Upload Now",
      voiceAssistance: "Voice Assistance",
      askQuestions: "Ask questions in your language",
      startVoice: "Start Voice Chat",
      diagnosisHistory: "Diagnosis History",
      viewPast: "View past diagnoses and treatments",
      viewHistory: "View History",
      recent: "Recent Diagnoses",
      maisLeafSpot: "Maize Leaf Spot",
      daysAgo: "2 days ago",
      highConfidence: "High confidence",
      treated: "Treated",
      active: "Online",
      chatTab: "Copilot Chat",
      workspaceTab: "Workspace",
      chatTagline: "Send messages, voice notes, and photos to Copilot",
      workspaceTagline: "Upload leaves, check history, manage requests",
      logout: "Logout",
    },
    sw: {
      welcomeBack: "Karibu Tena",
      getInstant: "Sungumza na Copilot wa AgriVoice",
      uploadLeaf: "Pakia picha ya jani kwa utambuzi",
      uploadNow: "Pakia Sasa",
      voiceAssistance: "Msaada wa Sauti",
      askQuestions: "Uliza maswali katika lugha yako",
      startVoice: "Anza Mazungumzo ya Sauti",
      diagnosisHistory: "Historia ya Utambuzi",
      viewPast: "Tazama utambuzi wa zamani na matibabu",
      viewHistory: "Tazama Historia",
      recent: "Utambuzi Mpya",
      maisLeafSpot: "Lick la Mahindi",
      daysAgo: "Siku 2 zilizopita",
      highConfidence: "Ujinga wa juu",
      treated: "Kutibiwa",
      active: "Mtandaoni",
      chatTab: "Mazungumzo",
      workspaceTab: "Kazi",
      chatTagline: "Tuma ujumbe, sauti, au picha kwa Copilot",
      workspaceTagline: "Pakia picha, angalia historia, dhibiti maombi",
      logout: "Toka",
    },
    luo: {
      welcomeBack: "Karieth Mbangu",
      getInstant: "Paro gi Copilot mar AgriVoice",
      uploadLeaf: "Chiemo chit mar jot",
      uploadNow: "Chiemo Sasa",
      voiceAssistance: "Seche Mara Oruok",
      askQuestions: "Penje seche ko arloshon",
      startVoice: "Chak Seche",
      diagnosisHistory: "Historia mar Ranyisi",
      viewPast: "Tazama ranyisi mar chungu",
      viewHistory: "Tazama Historia",
      recent: "Ranyisi Mpya",
      maisLeafSpot: "Lick mar Mahindi",
      daysAgo: "Siku 2",
      highConfidence: "Ujinga wa juu",
      treated: "Kutibiwa",
      active: "Piny",
      chatTab: "Chako",
      workspaceTab: "Tich",
      chatTagline: "Mii wach, dwonde, kata picha ne Copilot",
      workspaceTagline: "Chiemo chit, neno kok, ketho yore",
      logout: "Toka",
    },
  };

  const currentTranslation =
    dashboardTranslations[language] || dashboardTranslations.en;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">
                <span className="text-gray-800">Agri</span>
                <span className="text-primary">Voice</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
              <button className="relative p-2 text-gray-600 hover:text-primary">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {user?.name || "Farmer"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentTranslation.active}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition"
                  title={currentTranslation.logout}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {isOpen && (
            <div className="md:hidden mt-4 space-y-3 border-t border-gray-200 pt-4">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-red-600 font-semibold p-2 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-5 h-5" /> {currentTranslation.logout}
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
              {currentTranslation.welcomeBack}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              {user?.name || "Farmer"}, {currentTranslation.getInstant}
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsChatView(true)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isChatView
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              {currentTranslation.chatTab}
            </button>
            <button
              onClick={() => setIsChatView(false)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                !isChatView
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              <History className="h-4 w-4" />
              {currentTranslation.workspaceTab}
            </button>
          </div>
        </div>

        {isChatView ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {currentTranslation.chatTab}
                </p>
                <p className="text-sm text-slate-500">
                  {currentTranslation.chatTagline}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <Mic className="h-4 w-4 text-emerald-500" />
                Azure Voice Ready
              </div>
            </div>
            <FarmerChat />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
              <Upload className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Photo
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {currentTranslation.uploadLeaf}
              </p>
              <button className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition">
                {currentTranslation.uploadNow}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
              <Mic className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentTranslation.voiceAssistance}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {currentTranslation.askQuestions}
              </p>
              <button className="w-full bg-accent text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
                {currentTranslation.startVoice}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
              <History className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentTranslation.diagnosisHistory}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {currentTranslation.viewPast}
              </p>
              <button className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition">
                {currentTranslation.viewHistory}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
