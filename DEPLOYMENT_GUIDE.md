# AgriVoice Deployment Guide

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Development](#docker-development)
3. [Production Deployment](#production-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Azure Services Setup](#azure-services-setup)
7. [Monitoring & Logs](#monitoring--logs)

---

## Local Development

### Prerequisites
- **Python:** 3.9 or higher
- **Node.js:** 18 or higher (LTS recommended)
- **Git:** Latest version
- **Virtual Environment:** venv or conda

### Step 1: Clone Repository

```bash
git clone https://github.com/Ongachiethiny/Agrivoice.git
cd Agrivoice
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend-ai

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
VITE_JWT_SECRET=dev-secret-key-change-in-production
VITE_JWT_ALGORITHM=HS256
VITE_ACCESS_TOKEN_EXPIRY=1440
VITE_REFRESH_TOKEN_EXPIRY=10080

# Azure Services (get these from Azure Portal)
AZURE_VISION_ENDPOINT=https://<region>.api.cognitive.microsoft.com/
AZURE_VISION_KEY=your-vision-key-here
AZURE_SPEECH_KEY=your-speech-key-here
AZURE_SPEECH_REGION=<region>
AZURE_OPENAI_KEY=your-openai-key-here

DATA_DIR=./data
EOF

# Run backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

Backend will be available at `http://localhost:5000`

### Step 3: Frontend Setup

```bash
# Open new terminal, navigate to frontend directory
cd agrivoice-app

# Install dependencies
npm install

# Create .env file
cat > .env.local << EOF
VITE_API_URL=http://localhost:5000
EOF

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Step 4: Verify Installation

1. Navigate to `http://localhost:5173` in browser
2. You should see the AgriVoice home page
3. Test registration/login flow
4. Upload a test image and run diagnosis

---

## Docker Development

### Prerequisites
- **Docker:** 20.10 or higher
- **Docker Compose:** 2.0 or higher

### Quick Start

```bash
# Navigate to project root
cd Agrivoice

# Create .env files
cat > backend-ai/.env << EOF
VITE_JWT_SECRET=dev-secret
VITE_JWT_ALGORITHM=HS256
VITE_ACCESS_TOKEN_EXPIRY=1440
VITE_REFRESH_TOKEN_EXPIRY=10080
AZURE_VISION_ENDPOINT=https://<region>.api.cognitive.microsoft.com/
AZURE_VISION_KEY=your-key
AZURE_SPEECH_KEY=your-key
AZURE_SPEECH_REGION=<region>
AZURE_OPENAI_KEY=your-key
DATA_DIR=/app/data
EOF

cat > agrivoice-app/.env.local << EOF
VITE_API_URL=http://backend:5000
EOF

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Services:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- Backend Docs: `http://localhost:5000/docs`
- PostgreSQL: `localhost:5432`

### Docker Compose Services

```yaml
# Frontend - React/Vite
frontend:
  - Port: 3000
  - Volume: ./agrivoice-app:/app

# Backend - FastAPI
backend:
  - Port: 5000
  - Volume: ./backend-ai:/app

# Database - PostgreSQL (optional)
postgres:
  - Port: 5432
  - Volume: postgres_data
```

---

## Production Deployment

### Option 1: Heroku Deployment (Backend)

#### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed

#### Deployment Steps

```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create agrivoice-backend

# Set environment variables
heroku config:set \
  VITE_JWT_SECRET=your-production-secret \
  VITE_JWT_ALGORITHM=HS256 \
  VITE_ACCESS_TOKEN_EXPIRY=1440 \
  VITE_REFRESH_TOKEN_EXPIRY=10080 \
  AZURE_VISION_ENDPOINT=https://<region>.api.cognitive.microsoft.com/ \
  AZURE_VISION_KEY=your-vision-key \
  AZURE_SPEECH_KEY=your-speech-key \
  AZURE_SPEECH_REGION=<region> \
  AZURE_OPENAI_KEY=your-openai-key \
  DATA_DIR=./data \
  PORT=5000

# Create Procfile in backend-ai directory
cat > backend-ai/Procfile << EOF
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
EOF

# Add buildpack
heroku buildpacks:add heroku/python

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Scale dynos (if needed)
heroku ps:scale web=1
```

**Production URL:** `https://agrivoice-backend.herokuapp.com`

### Option 2: Vercel Deployment (Frontend)

#### Prerequisites
- Vercel account (free tier available)
- Vercel CLI installed

#### Deployment Steps

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd agrivoice-app

# Deploy to Vercel
vercel --prod

# Configure environment variables in Vercel dashboard:
# - VITE_API_URL=https://agrivoice-backend.herokuapp.com
```

**Production URL:** `https://agrivoice.vercel.app`

### Option 3: AWS Deployment (Backend)

#### Using Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init -p python-3.11 agrivoice --region us-east-1

# Create environment
eb create agrivoice-prod

# Set environment variables
eb setenv \
  VITE_JWT_SECRET=your-secret \
  AZURE_VISION_KEY=your-key \
  AZURE_SPEECH_KEY=your-key \
  AZURE_OPENAI_KEY=your-key

# Deploy
eb deploy

# View application
eb open
```

### Option 4: Google Cloud Run Deployment

```bash
# Authenticate with Google Cloud
gcloud auth login

# Set project
gcloud config set project <project-id>

# Build and deploy container
gcloud run deploy agrivoice-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars VITE_JWT_SECRET=your-secret,AZURE_VISION_KEY=your-key

# View URL
gcloud run services describe agrivoice-backend --platform managed --region us-central1
```

---

## Environment Configuration

### Required Environment Variables

**Backend (.env):**
```
# JWT Configuration
VITE_JWT_SECRET=your-secret-key-minimum-32-chars
VITE_JWT_ALGORITHM=HS256
VITE_ACCESS_TOKEN_EXPIRY=1440        # minutes
VITE_REFRESH_TOKEN_EXPIRY=10080      # minutes (7 days)

# Azure Services
AZURE_VISION_ENDPOINT=https://eastus.api.cognitive.microsoft.com/
AZURE_VISION_KEY=your-vision-key
AZURE_SPEECH_KEY=your-speech-key
AZURE_SPEECH_REGION=eastus
AZURE_OPENAI_KEY=your-openai-key

# Application
DATA_DIR=./data
PORT=5000
DEBUG=False
```

**Frontend (.env.local or .env.production):**
```
VITE_API_URL=http://localhost:5000        # Dev
VITE_API_URL=https://api.agrivoice.com    # Prod
```

### Security Best Practices

1. **Never commit .env files:**
   ```bash
   echo ".env" >> .gitignore
   echo ".env.local" >> .gitignore
   ```

2. **Use strong secrets:**
   ```bash
   # Generate strong secret
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

3. **Rotate secrets regularly:**
   - Change JWT secret monthly
   - Rotate Azure keys quarterly
   - Use different secrets per environment

4. **Use secure storage:**
   - Heroku: Config Vars
   - AWS: Systems Manager Parameter Store
   - Google Cloud: Secret Manager
   - Azure: Key Vault

---

## Database Setup

### File-Based Storage (Development)

Default setup uses JSON files stored in `data/` directory:

```
data/
├── users.json          # User accounts
├── history/
│  ├── user-id-1.jsonl
│  └── user-id-2.jsonl
└── images/
   ├── user-id-1/
   │  ├── diagnosis-id-1.jpg
   │  └── diagnosis-id-2.jpg
   └── user-id-2/
```

**Backup file-based data:**
```bash
# Create backup
zip -r data-backup-$(date +%Y%m%d).zip data/

# Restore from backup
unzip data-backup-20240115.zip
```

### PostgreSQL Setup (Production)

#### Local PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql

# Start service
brew services start postgresql

# Create database
createdb agrivoice

# Create .env
echo "DATABASE_URL=postgresql://localhost/agrivoice" >> backend-ai/.env
```

#### Docker PostgreSQL

```bash
# Run PostgreSQL container
docker run -d \
  --name agrivoice-postgres \
  -e POSTGRES_DB=agrivoice \
  -e POSTGRES_PASSWORD=secure-password \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

# Connect
psql postgresql://postgres:secure-password@localhost/agrivoice
```

#### AWS RDS

```bash
# Create RDS instance via AWS console or CLI
aws rds create-db-instance \
  --db-instance-identifier agrivoice-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password secure-password \
  --allocated-storage 20

# Set connection string
heroku config:set DATABASE_URL=postgresql://admin:password@endpoint:5432/agrivoice
```

---

## Azure Services Setup

### 1. Create Azure Cognitive Services Account

**Via Azure Portal:**
1. Navigate to Azure Portal (portal.azure.com)
2. Create new resource group: `agrivoice-resources`
3. Create Cognitive Services resources:
   - Computer Vision (for crop image analysis)
   - Speech Services (for audio synthesis)
   - OpenAI Service (for GPT-4 access)

**Via Azure CLI:**
```bash
# Login
az login

# Create resource group
az group create \
  --name agrivoice-resources \
  --location eastus

# Create Computer Vision
az cognitiveservices account create \
  --kind ComputerVision \
  --name agrivoice-vision \
  --resource-group agrivoice-resources \
  --location eastus \
  --sku S1

# Create Speech Services
az cognitiveservices account create \
  --kind Speech \
  --name agrivoice-speech \
  --resource-group agrivoice-resources \
  --location eastus \
  --sku S0

# Create OpenAI
az cognitiveservices account create \
  --kind OpenAI \
  --name agrivoice-openai \
  --resource-group agrivoice-resources \
  --location eastus \
  --sku S0
```

### 2. Get API Keys

```bash
# Vision API Key
az cognitiveservices account keys list \
  --name agrivoice-vision \
  --resource-group agrivoice-resources

# Speech API Key
az cognitiveservices account keys list \
  --name agrivoice-speech \
  --resource-group agrivoice-resources

# OpenAI API Key
az cognitiveservices account keys list \
  --name agrivoice-openai \
  --resource-group agrivoice-resources
```

### 3. Configure in Application

```bash
# Add to .env
AZURE_VISION_ENDPOINT=https://eastus.api.cognitive.microsoft.com/
AZURE_VISION_KEY=your-key-from-above
AZURE_SPEECH_KEY=your-key-from-above
AZURE_SPEECH_REGION=eastus
AZURE_OPENAI_KEY=your-key-from-above
```

---

## Monitoring & Logs

### Backend Logs

**Local Development:**
```bash
# View logs in real-time
tail -f backend-ai.log

# View specific log level
grep ERROR backend-ai.log
```

**Heroku:**
```bash
# View live logs
heroku logs --tail

# View error logs
heroku logs --tail --ps web
```

**Docker:**
```bash
# View container logs
docker-compose logs backend

# Follow logs
docker-compose logs -f backend

# View specific lines
docker-compose logs backend --tail 100
```

### Application Monitoring

**Add logging to FastAPI:**

```python
import logging

logger = logging.getLogger(__name__)

# In route handler
logger.info(f"User {user_id} diagnosed crop")
logger.error(f"Azure Vision API error: {e}")
```

### Performance Monitoring

**Setup with services:**
- **Heroku:** Built-in Heroku Metrics
- **AWS:** CloudWatch
- **Google Cloud:** Cloud Monitoring
- **Azure:** Application Insights

### Error Tracking

**Sentry Integration:**

```bash
# Install
pip install sentry-sdk

# Configure in app/main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="https://<project>@<org>.ingest.sentry.io/<id>",
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0
)
```

### Database Backups

**Automated Backups:**

```bash
# PostgreSQL backup script
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump agrivoice > $BACKUP_DIR/backup_$TIMESTAMP.sql

# Schedule with cron (every day at 2 AM)
0 2 * * * /path/to/backup-script.sh
```

---

## Troubleshooting Deployment

### Common Issues

**Port already in use:**
```bash
# Find process using port
lsof -i :5000
# Kill process
kill -9 <PID>
```

**Module not found:**
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

**CORS errors:**
- Verify backend URL in frontend .env
- Check CORS configuration in FastAPI

**Database connection failed:**
- Verify DATABASE_URL environment variable
- Check database server is running
- Verify network access/firewall rules

### Rollback Procedure

**Heroku:**
```bash
# View release history
heroku releases

# Rollback to previous release
heroku rollback v<number>
```

**Vercel:**
```bash
# View deployments
vercel ls

# Rollback to previous deployment
vercel rollback
```

---

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Azure Cognitive Services Docs](https://learn.microsoft.com/azure/cognitive-services/)
- [Docker Documentation](https://docs.docker.com/)
- [Heroku Deployment Guide](https://devcenter.heroku.com/)

---

**Last Updated:** January 2024  
**Maintainer:** AgriVoice Team
