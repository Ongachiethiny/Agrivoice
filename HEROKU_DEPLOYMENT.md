# Heroku Deployment Guide - AgriVoice Backend

## Prerequisites
1. **Heroku Account** - Sign up at https://www.heroku.com
2. **Heroku CLI** - Install from https://devcenter.heroku.com/articles/heroku-cli
3. **Git** - Already configured in your project

## Quick Deployment Steps

### 1. Login to Heroku
```bash
heroku login
```
This opens a browser window to authenticate. Complete the login.

### 2. Create a Heroku App
```bash
heroku create agrivoice-backend
```
Replace `agrivoice-backend` with your desired app name (must be globally unique).

Alternatively, if you already have an app:
```bash
heroku git:remote -a agrivoice-backend
```

### 3. Set Environment Variables
Set all Azure credentials as Heroku Config Vars:

```bash
heroku config:set AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
heroku config:set AZURE_OPENAI_KEY=your-key
heroku config:set AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

heroku config:set AZURE_VISION_ENDPOINT=https://your-vision-resource.cognitiveservices.azure.com/vision/v3.2/
heroku config:set AZURE_VISION_KEY=your-key

heroku config:set AZURE_SPEECH_ENDPOINT=https://eastus.api.cognitive.microsoft.com/
heroku config:set AZURE_SPEECH_KEY=your-key
heroku config:set AZURE_SPEECH_REGION=eastus

heroku config:set AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com/
heroku config:set AZURE_TRANSLATOR_KEY=your-key
heroku config:set AZURE_TRANSLATOR_REGION=eastus

heroku config:set DEBUG=False
heroku config:set CORS_ORIGINS=*
```

Or use one command for multiple vars:
```bash
heroku config:set \
  AZURE_OPENAI_ENDPOINT="your-value" \
  AZURE_OPENAI_KEY="your-value" \
  AZURE_VISION_KEY="your-value" \
  AZURE_SPEECH_KEY="your-value" \
  AZURE_TRANSLATOR_KEY="your-value"
```

### 4. Verify Config Vars
```bash
heroku config
```

### 5. Deploy to Heroku
```bash
git push heroku master
```

Or if you want to push a different branch:
```bash
git push heroku feat/backend-api:master
```

### 6. Monitor the Deployment
```bash
heroku logs --tail
```

### 7. Test Your Deployment
Once deployed, your app is available at:
```
https://agrivoice-backend.herokuapp.com
```

Test endpoints:
- Health: `https://agrivoice-backend.herokuapp.com/health`
- Docs: `https://agrivoice-backend.herokuapp.com/docs`
- Config: `https://agrivoice-backend.herokuapp.com/config`

## Deployment Files Included

### Procfile
Tells Heroku how to run your app:
```
web: cd backend-ai && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### runtime.txt
Specifies Python version:
```
python-3.11.6
```

### requirements.txt
All Python dependencies copied to root for Heroku build.

## Useful Heroku Commands

```bash
# View app logs
heroku logs --tail

# Restart the app
heroku restart

# Run one-off command
heroku run python -c "from app.config import settings; print('App configured')"

# Scale dynos
heroku ps:scale web=1

# View running processes
heroku ps

# Check config variables
heroku config

# Set a single variable
heroku config:set KEY=value

# Unset a variable
heroku config:unset KEY

# View app info
heroku info

# Open app in browser
heroku open
```

## Troubleshooting

### App crashes on startup
1. Check logs: `heroku logs --tail`
2. Verify all environment variables are set: `heroku config`
3. Check if Python version is compatible

### Build error: "requirements.txt not found"
- Ensure `requirements.txt` is in the root directory
- Rebuild: `heroku rebuild` (if available) or re-push

### Module import errors
- Ensure `.env` is not being tracked in git
- Verify config.py loads correctly locally first

### Azure API calls failing
- Verify all Azure credentials are correct in Heroku config
- Check Azure service quotas/limits
- Monitor Azure Portal for any service issues

## Post-Deployment

### 1. Set up Custom Domain (Optional)
```bash
heroku domains:add agrivoice.com
```

### 2. Enable SSL/TLS (Automatic)
Heroku provides free SSL certificates automatically.

### 3. Monitor Performance
- Use Heroku Dashboard: https://dashboard.heroku.com/apps
- Set up application metrics and alerts
- Monitor logs regularly

### 4. Scale Up (If Needed)
```bash
heroku ps:scale web=2
```

## CI/CD Pipeline (Optional)

### Connect to GitHub for Automatic Deploys
1. Go to your app's Settings in Heroku Dashboard
2. Under "Deployment method", select "GitHub"
3. Connect your GitHub account and repository
4. Enable "Automatic deploys" from `master` branch

## Cost Considerations

- **Free Dyno**: 550 hours/month (sleeps after 30 min of inactivity)
- **Eco**: $5/month (1000 hours/month)
- **Standard**: $7/month per dyno (always on)
- **Premium**: $25/month per dyno

For production, use at least Standard tier to keep the app always running.

## Next Steps

1. Push code: `git push heroku master`
2. Monitor: `heroku logs --tail`
3. Test: Open `https://agrivoice-backend.herokuapp.com/docs`
4. Share: Your API is live and accessible globally!

---

**Your AgriVoice backend will be live on Heroku within minutes!** 🚀
