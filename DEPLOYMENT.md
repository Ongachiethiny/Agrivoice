# 🚀 AgriVoice Deployment Guide

**Status:** All production builds ready for deployment  
**Build Date:** November 25, 2025  
**Backend:** Already deployed to Heroku  
**Frontend & Dashboard:** Ready for Vercel/Netlify

---

## 📦 What's Built

### ✅ Backend (LIVE)
- **URL:** https://agrivoice-backend-aefdd2d38be7.herokuapp.com
- **Status:** Production (v6)
- **Features:** All 4 Azure services integrated, analytics system, auto-logging

### ✅ Frontend PWA (BUILT)
- **Location:** `frontend-pwa/dist/`
- **Size:** 193KB JS (61KB gzip)
- **Features:** Image upload, question input, language selection, results display, audio playback
- **Pages:** Home, Diagnose, Results, Profile

### ✅ Analytics Dashboard (BUILT)
- **Location:** `dashboard-admin/dist/`
- **Size:** 152KB JS (48KB gzip)  
- **Features:** Real-time analytics, disease charts, community impact metrics, auto-refresh (30s)
- **Component:** Single Dashboard component with full data integration

---

## 🔧 Deploy Frontend to Vercel

### Option 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend-pwa

# Deploy
vercel --prod
# Follow prompts:
# - Link to existing project? No (first deployment)
# - Which scope? Your account
# - Project name: agrivoice-pwa
# - Framework: Vite
# - Root directory: ./
# - Build command: npm run build
# - Output directory: dist
# - Environment: Add VITE_API_URL=https://agrivoice-backend-aefdd2d38be7.herokuapp.com
```

### Option 2: Using Vercel Web Dashboard

1. Go to https://vercel.com/new
2. Import GitHub repository
3. Select `frontend-pwa` root directory
4. Configure:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variable:**
     ```
     VITE_API_URL=https://agrivoice-backend-aefdd2d38be7.herokuapp.com
     ```
5. Click "Deploy"

### Option 3: Using Netlify

1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Select GitHub & authorize
4. Choose repository
5. Configure:
   - **Base directory:** `frontend-pwa`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Environment variables:**
     ```
     VITE_API_URL=https://agrivoice-backend-aefdd2d38be7.herokuapp.com
     ```
6. Click "Deploy site"

---

## 🎨 Deploy Dashboard to Vercel

### Option 1: Vercel CLI

```bash
cd dashboard-admin
vercel --prod
# Configure same way as frontend, but:
# - Project name: agrivoice-dashboard
# - Environment: VITE_API_URL=https://agrivoice-backend-aefdd2d38be7.herokuapp.com
```

### Option 2: Vercel Web Dashboard

1. Go to https://vercel.com/new
2. Import GitHub repository
3. Select `dashboard-admin` root directory
4. Configure:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variable:**
     ```
     VITE_API_URL=https://agrivoice-backend-aefdd2d38be7.herokuapp.com
     ```
5. Click "Deploy"

### Option 3: Netlify

1. Similar to frontend deployment
2. Use `dashboard-admin` as base directory
3. Same build/publish settings

---

## ✅ Post-Deployment Testing

### 1. Test Frontend

```bash
# Frontend URL (after deployment)
curl https://agrivoice-pwa.vercel.app/

# Check it loads
# Expected: HTML page with "AgriVoice - Crop Health Diagnosis"

# Test API integration
# Open browser console and visit the site
# Try uploading an image and submitting diagnosis
```

### 2. Test Dashboard

```bash
# Dashboard URL (after deployment)
curl https://agrivoice-dashboard.vercel.app/

# Check it loads
# Expected: HTML page with "AgriVoice Impact Dashboard"

# Open in browser
# Verify analytics data loads from backend
# Check that data refreshes every 30 seconds
```

### 3. Test API Connectivity

```bash
# Test backend is accessible
curl https://agrivoice-backend-aefdd2d38be7.herokuapp.com/api/analytics/summary
# Expected: JSON with analytics data

# Test diagnosis endpoint
curl -X POST https://agrivoice-backend-aefdd2d38be7.herokuapp.com/api/diagnose \
  -F "file=@crop_image.jpg" \
  -F "query=What is wrong with my crop?" \
  -F "language=en"
# Expected: JSON with diagnosis
```

---

## 🔗 Deployment URLs (Template)

After deployment, update these URLs:

```
Frontend: https://agrivoice-pwa.vercel.app
Dashboard: https://agrivoice-dashboard.vercel.app
Backend: https://agrivoice-backend-aefdd2d38be7.herokuapp.com
```

---

## 🆘 Troubleshooting

### Frontend Won't Build

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Dashboard Won't Deploy

```bash
# Ensure all files exist:
# - dashboard-admin/index.html ✓
# - dashboard-admin/vite.config.js ✓
# - dashboard-admin/src/main.jsx ✓
# - dashboard-admin/src/Dashboard.jsx ✓
# - dashboard-admin/src/index.css ✓

# Rebuild
cd dashboard-admin
npm run build
```

### API Connection Fails

```bash
# Check environment variable is set
echo $VITE_API_URL  # Should output: https://agrivoice-backend-aefdd2d38be7.herokuapp.com

# Check backend is accessible
curl https://agrivoice-backend-aefdd2d38be7.herokuapp.com/api/analytics/summary
```

### CORS Issues

The backend is configured with CORS headers. If you see CORS errors:
1. Check browser console (F12 > Console tab)
2. Verify frontend and backend URLs are correct
3. Ensure backend is running: https://agrivoice-backend-aefdd2d38be7.herokuapp.com

---

## 📋 Pre-Deployment Checklist

- [x] Frontend builds without errors: `npm run build`
- [x] Dashboard builds without errors: `npm run build`
- [x] Environment variables configured correctly
- [x] Backend API is accessible
- [x] Git repository is up to date
- [x] All files committed: `git status`

---

## 🎯 Next Steps

1. Deploy frontend to Vercel/Netlify
2. Deploy dashboard to Vercel/Netlify
3. Test both in production
4. Update URLs in this document
5. Submit to hackathon platform
6. Record demo video (optional but recommended)

---

**Deployment Ready:** Yes ✅  
**Build Status:** Success ✅  
**Ready for Submission:** Yes ✅  

Last Updated: November 25, 2025, 09:00 UTC
