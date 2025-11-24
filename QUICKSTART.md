# AgriVoice - Quick Start Commands

Copy and paste these commands to get started immediately.

## For Everyone: Initial Setup

```bash
cd c:\Users\USER\Desktop\AgriVoice

# Initialize git (if not already done)
git init

# Create main branches
git checkout -b main
git checkout -b dev

# Create feature branches for each team
git checkout -b feat/backend-api      # For Kalanza
git checkout -b feat/frontend-ui      # For Oram
git checkout -b feat/copilot-integrations  # For Lewis
```

---

## For Kalanza: Backend Setup

```bash
# Navigate to backend
cd backend-ai

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Setup environment file
copy .env.example .env

# IMPORTANT: Edit .env with your Azure keys
# Then run:
python -m uvicorn app.main:app --reload

# API will be at: http://localhost:8000
# API docs at: http://localhost:8000/docs
```

---

## For Oram: Frontend Setup

```bash
# Navigate to frontend
cd frontend-pwa

# Install dependencies
npm install

# Setup environment file
copy .env.example .env
# Verify VITE_API_URL=http://localhost:8000

# Start development server
npm run dev

# App will be at: http://localhost:5173
```

---

## For Lewis: Dashboard Setup

```bash
# Navigate to dashboard
cd dashboard-admin

# Install dependencies
npm install

# Start development server
npm run dev

# Dashboard will be at: http://localhost:5174
```

---

## Testing Everything Together

### Terminal 1: Backend (Kalanza)
```bash
cd backend-ai
venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

### Terminal 2: Frontend (Oram)
```bash
cd frontend-pwa
npm run dev
```

### Terminal 3: Dashboard (Lewis)
```bash
cd dashboard-admin
npm run dev
```

Then open in browser:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Dashboard: http://localhost:5174

---

## Building for Production

### Backend
```bash
cd backend-ai

# Option 1: Docker
docker build -t agrivoice-backend:latest .
docker run -p 8000:8000 -e AZURE_VISION_KEY=your_key agrivoice-backend:latest

# Option 2: Direct deployment (Render, Railway, Azure)
# Push to main branch - auto-deploy will trigger
```

### Frontend
```bash
cd frontend-pwa

# Build
npm run build

# Output in: dist/

# Deploy to Vercel
npm install -g vercel
vercel

# Or deploy to Netlify via dashboard
```

### Dashboard
```bash
cd dashboard-admin

# Build
npm run build

# Deploy similar to frontend
```

---

## Common Issues & Quick Fixes

### Backend: "ModuleNotFoundError"
```bash
cd backend-ai
venv\Scripts\activate
pip install -r requirements.txt
```

### Backend: "CORS Error"
Edit `backend-ai\.env`:
```
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

### Frontend: "Cannot find module"
```bash
cd frontend-pwa
rm -rf node_modules
npm install
```

### Port already in use?
```bash
# Backend on 8001
python -m uvicorn app.main:app --port 8001 --reload

# Frontend on 5174
npm run dev -- --port 5174
```

---

## Useful Development Commands

### Kalanza (Backend)
```bash
# Format code
pip install black
black app/

# Lint code
pip install pylint
pylint app/

# Run tests
pytest

# Check types
mypy app/
```

### Oram (Frontend)
```bash
# Format code
npm run format

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Lewis (Dashboard)
```bash
# Same as frontend
npm run build
npm run preview
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feat/your-feature

# Make changes
# ... edit files ...

# Stage changes
git add .

# Commit
git commit -m "feat: description of changes"

# Push
git push origin feat/your-feature

# Create Pull Request on GitHub
# Get reviewed
# Merge to dev

# Once tested, merge dev to main
git checkout main
git merge dev
git push origin main
```

---

## Documentation Links

- 📖 Main Guide: `README.md`
- 🔧 Backend: `backend-ai/README.md`
- 🎨 Frontend: `frontend-pwa/README.md`
- 📊 Dashboard: `dashboard-admin/README.md`
- 🤖 Copilot: `copilot-config/README.md`
- ✅ Setup Status: `SETUP_COMPLETE.md`

---

## Environment Variables Needed

### Backend (backend-ai/.env)
```
AZURE_VISION_ENDPOINT=https://region.api.cognitive.microsoft.com/
AZURE_VISION_KEY=your_key
AZURE_OPENAI_ENDPOINT=https://deployment.openai.azure.com/
AZURE_OPENAI_KEY=your_key
AZURE_OPENAI_MODEL=gpt-4
AZURE_SPEECH_KEY=your_key
AZURE_SPEECH_REGION=region
FABRIC_WORKSPACE_ID=workspace_id
FABRIC_LAKEHOUSE_ID=lakehouse_id
ENVIRONMENT=development
DEBUG=True
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

### Frontend (frontend-pwa/.env)
```
VITE_API_URL=http://localhost:8000
```

---

## Deployment Checklist

- [ ] All tests passing locally
- [ ] Code reviewed and merged to main
- [ ] Environment variables configured
- [ ] Docker image built and tested
- [ ] API endpoints tested with Postman
- [ ] Frontend builds without errors
- [ ] PWA manifest verified
- [ ] Azure quotas sufficient
- [ ] Monitoring set up
- [ ] Documentation updated

---

## Support

1. Check the relevant README.md
2. Review the SETUP_COMPLETE.md summary
3. Check the troubleshooting sections
4. Ask team members in appropriate Slack channel

**Good luck! 🚀**
