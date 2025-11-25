# 🌾 AgriVoice

**AI-powered crop diagnosis platform for African farmers**

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)

A web application that helps farmers diagnose crop diseases using AI and get instant recommendations in their local language.

---

## 🎯 What It Does

✅ **Upload crop photos** → Get instant AI disease diagnosis  
✅ **View analytics** → Track disease outbreaks in real-time  
✅ **Get advice** → Receive treatment recommendations from GPT-4  
✅ **Hear it** → Listen to guidance in 6 languages  
✅ **Share data** → Help community with epidemic tracking  

---

## 🚀 Quick Start

### Run Locally

**Frontend:**
```bash
cd agrivoice-app
npm install
npm run dev
```
→ Open http://localhost:5173

**Backend:**
```bash
cd backend-ai
pip install -r requirements.txt
python -m app.main
```
→ API at http://localhost:8000

---

## 📁 Project Structure

```
AgriVoice/
├── agrivoice-app/          # React web app
│   ├── src/pages/          # Home, Diagnose, Dashboard
│   ├── src/services/       # API client
│   └── package.json
├── backend-ai/             # Python FastAPI
│   ├── app/routers/        # API endpoints
│   ├── app/services/       # Azure integrations
│   └── requirements.txt
└── README.md
```

---

## 🌟 Features

| Feature | Details |
|---------|---------|
| 🌾 **Diagnosis** | Upload image → Get disease detection & treatment plan |
| 📊 **Analytics** | Real-time disease statistics & community impact |
| 🌐 **Languages** | English, Swahili, Arabic, French, Spanish, Portuguese |
| 🔊 **Audio** | Hear recommendations in your language |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |

---

## 🔌 API Endpoints

```
POST   /api/diagnose              → Upload image & get diagnosis
GET    /api/analytics/summary     → Overall stats
GET    /api/analytics/diseases    → Disease data
GET    /api/analytics/impact      → Community metrics
GET    /health                    → Health check
```

---

## 📦 Tech Stack

**Frontend:** React, Vite, Tailwind CSS  
**Backend:** Python, FastAPI, Uvicorn  
**AI:** Azure Vision, GPT-4, Speech, Translator  
**Deployment:** Vercel (frontend), Heroku (backend)

---

## 🌍 Deployment

### Frontend → Vercel
```bash
cd agrivoice-app
npm run build
# Deploy dist/ folder to Vercel
```

### Backend → Heroku
```bash
cd backend-ai
heroku create your-app
git push heroku main
```

**Live:**
- Backend: https://agrivoice-backend-aefdd2d38be7.herokuapp.com
- Frontend: [Your Vercel URL]

---

## ⚙️ Environment Variables

**agrivoice-app/.env:**
```
VITE_API_URL=https://agrivoice-backend-aefdd2d38be7.herokuapp.com
```

**backend-ai/.env:**
```
AZURE_VISION_KEY=xxx
AZURE_OPENAI_KEY=xxx
AZURE_SPEECH_KEY=xxx
AZURE_TRANSLATOR_KEY=xxx
```

---

## 🧪 Test It

**Diagnosis:**
```bash
curl -X POST http://localhost:8000/api/diagnose \
  -F "file=@crop.jpg" \
  -F "query=What's wrong?" \
  -F "language=en"
```

**Analytics:**
```bash
curl http://localhost:8000/api/analytics/summary
```

---

## 👥 Team

| Name | Role |
|------|------|
| Kalanza | Backend AI |
| Lewis | Frontend |
| Oram | Integration |

---

## 📝 License

MIT License - See LICENSE file

---

**Version:** 1.0.0 | **Status:** ✅ Production Ready | **Updated:** Nov 25, 2025

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
