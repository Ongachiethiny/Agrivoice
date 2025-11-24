# 🚀 AgriVoice Heroku Deployment - Quick Start

## Files Created
✅ `Procfile` - Heroku process configuration  
✅ `runtime.txt` - Python 3.11.6 specification  
✅ `requirements.txt` - Python dependencies (root)  
✅ `HEROKU_DEPLOYMENT.md` - Full deployment guide  

## Deploy in 5 Steps

### 1️⃣ Install Heroku CLI
https://devcenter.heroku.com/articles/heroku-cli

### 2️⃣ Login
```bash
heroku login
```

### 3️⃣ Create App
```bash
heroku create agrivoice-backend
```

### 4️⃣ Add Environment Variables
```bash
heroku config:set \
  AZURE_OPENAI_ENDPOINT="your-value" \
  AZURE_OPENAI_KEY="your-key" \
  AZURE_VISION_KEY="your-key" \
  AZURE_SPEECH_KEY="your-key" \
  AZURE_TRANSLATOR_KEY="your-key"
```

### 5️⃣ Deploy
```bash
git push heroku master
```

## Your Live API
Once deployed: `https://agrivoice-backend.herokuapp.com`

- 📚 Docs: `/docs`
- 💊 Health: `/health`
- ⚙️ Config: `/config`

## Monitor
```bash
heroku logs --tail
```

---

**See HEROKU_DEPLOYMENT.md for complete guide**
