# 🌾 AgriVoice

**AI-powered crop diagnosis for African farmers**

A web application empowering farmers with instant crop disease diagnosis using artificial intelligence. Get personalized recommendations in your local language with audio support.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.9+
- Azure account (Vision, GPT-4, Speech, Translator services)

### Frontend (React Web App)
```bash
cd agrivoice-app
npm install --legacy-peer-deps
npm run dev
```
Opens http://localhost:5173

### Backend (FastAPI)
```bash
cd backend-ai
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
API at http://localhost:8000/docs

---

## ✨ Features

### 🌾 Crop Diagnosis
- 📸 Upload crop photos for AI analysis
- 🔍 Detect diseases using Azure Computer Vision
- 💡 Get treatment recommendations from GPT-4
- 🌍 Support for 6 languages (English, Swahili, Arabic, French, Spanish, Portuguese)
- 🔊 Audio responses in your language

### 📊 Analytics Dashboard
- Real-time disease statistics
- Community impact metrics
- Geographic disease hotspots
- Severity tracking
- Auto-refresh every 30 seconds

---

## 📁 Structure

```
AgriVoice/
├── agrivoice-app/        # React frontend + dashboard
│   ├── src/pages/        # Home, Diagnose, Dashboard
│   └── src/services/     # API client
└── backend-ai/           # Python FastAPI backend
    └── app/services/     # Azure integrations
```

---

## 🔗 Environment Variables

**agrivoice-app/.env**
```
VITE_API_URL=http://localhost:8000
```

**backend-ai/.env**
```
AZURE_VISION_KEY=your_key
AZURE_VISION_ENDPOINT=your_endpoint
AZURE_OPENAI_KEY=your_key
AZURE_OPENAI_ENDPOINT=your_endpoint
AZURE_SPEECH_KEY=your_key
AZURE_SPEECH_REGION=your_region
AZURE_TRANSLATOR_KEY=your_key
AZURE_TRANSLATOR_REGION=your_region
```

---

## 📋 API Endpoints

### Diagnosis
```bash
POST /api/diagnose
- file: crop image
- query: what's wrong with the crop
- language: en, sw, ar, fr, es, pt
```

### Analytics
```bash
GET /api/analytics/summary
GET /api/analytics/diseases
GET /api/analytics/impact
```

---

## 📄 Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Overview and features |
| Diagnose | `/diagnose` | Upload image, get diagnosis |
| Analytics | `/dashboard` | Real-time crop health metrics |

---

## 🚀 Deploy to Production

### Web App (Vercel)
```bash
cd agrivoice-app
npm run build
vercel --prod
```

### Backend (Heroku)
```bash
cd backend-ai
heroku create your-app-name
git push heroku main
```

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Python, FastAPI
- **AI**: Azure Computer Vision, GPT-4, Speech, Translator
- **Deployment**: Vercel, Heroku

---

## 📱 Pages Overview

### Diagnose (`/diagnose`)
- Image upload with preview
- Question input field
- Language selector
- Diagnosis results with audio
- Action items checklist

### Analytics (`/dashboard`)
- Metric cards (diagnoses, farmers, crops)
- Top diseases ranking
- Disease hotspots map
- Detailed disease table
- Real-time auto-refresh

---

## 🌍 Impact

AgriVoice helps African farmers:
- ✅ Diagnose crop diseases instantly
- ✅ Reduce crop loss through early detection
- ✅ Access information in local language
- ✅ Track community disease outbreaks
- ✅ Improve farming outcomes with AI

---

## 📝 License

EcoRevolution Hackathon 2025

---

## 🤝 Team

- **Kalanza** - Backend AI
- **Lewis** - Frontend Development
- **Oram** - Dashboard & Integration

**Let's empower farmers with technology!** 🌱
