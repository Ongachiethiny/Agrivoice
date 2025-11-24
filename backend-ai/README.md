# AgriVoice Backend API

FastAPI backend for AgriVoice - AI-powered crop diagnosis platform.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Azure subscription with:
  - Computer Vision API
  - OpenAI API (GPT-4)
  - Speech Services

### Setup

```bash
# Create virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your Azure keys

# Run server
python -m uvicorn app.main:app --reload

# Server runs at http://localhost:8000
# API docs at http://localhost:8000/docs
```

## 📚 API Endpoints

### GET /
Health check endpoint

```bash
curl http://localhost:8000/
```

### POST /api/v1/analyze-image
Analyze a crop image and extract tags/features

```bash
curl -X POST -F "file=@crop.jpg" \
  http://localhost:8000/api/v1/analyze-image
```

### POST /api/v1/diagnose
Diagnose crop condition based on image tags and question

```bash
curl -X POST http://localhost:8000/api/v1/diagnose \
  -H "Content-Type: application/json" \
  -d '{
    "image_tags": ["leaf", "brown spots"],
    "user_question": "Why are my leaves brown?",
    "crop_type": "maize",
    "region": "East Africa",
    "farmer_id": "farmer_123"
  }'
```

### POST /api/v1/speech-to-text
Convert speech to text

```bash
curl -X POST -F "file=@audio.wav" \
  http://localhost:8000/api/v1/speech-to-text
```

### POST /api/v1/text-to-speech
Convert text to speech

```bash
curl -X POST "http://localhost:8000/api/v1/text-to-speech?text=Your%20crop%20has%20rust" \
  -H "Content-Type: application/json"
```

## 🏗️ Project Structure

```
backend-ai/
├── app/
│   ├── main.py              # FastAPI app initialization
│   ├── services/            # Azure integration services
│   │   ├── vision.py        # Azure Computer Vision
│   │   ├── gpt4.py          # Azure OpenAI/GPT-4
│   │   ├── speech.py        # Azure Speech Services
│   │   └── fabric.py        # Microsoft Fabric logging
│   └── routers/             # API route handlers
│       ├── image_analysis.py
│       ├── diagnosis.py
│       └── speech.py
├── requirements.txt
├── Dockerfile
├── .env.example
└── README.md
```

## 🔧 Key Technologies

- **FastAPI**: Modern async Python web framework
- **Uvicorn**: ASGI server
- **Azure SDK**: Computer Vision, OpenAI, Speech, Identity
- **Pydantic**: Data validation
- **python-dotenv**: Environment variable management

## 📝 Environment Variables

```bash
# Azure Vision
AZURE_VISION_ENDPOINT=https://region.api.cognitive.microsoft.com/
AZURE_VISION_KEY=your_key_here

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://deployment.openai.azure.com/
AZURE_OPENAI_KEY=your_key_here
AZURE_OPENAI_MODEL=gpt-4

# Azure Speech
AZURE_SPEECH_KEY=your_key_here
AZURE_SPEECH_REGION=your_region

# Microsoft Fabric
FABRIC_WORKSPACE_ID=your_workspace_id
FABRIC_LAKEHOUSE_ID=your_lakehouse_id

# App Config
ENVIRONMENT=development
DEBUG=True
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

## 🐳 Docker

### Build Image
```bash
docker build -t agrivoice-backend:latest .
```

### Run Container
```bash
docker run -p 8000:8000 \
  -e AZURE_VISION_KEY=your_key \
  -e AZURE_OPENAI_KEY=your_key \
  -e AZURE_SPEECH_KEY=your_key \
  agrivoice-backend:latest
```

## 🚀 Deployment

### Render.com
```bash
# Push to main branch and deploy automatically
git push origin main
```

### Azure App Service
```bash
az webapp up --name agrivoice-api --resource-group mygroup
```

### Railway.app
```bash
railway up
```

## 🧪 Testing

```bash
# Run tests
pytest tests/

# With coverage
pytest --cov=app tests/

# Run specific test
pytest tests/test_vision.py
```

## 📊 Performance Tips

1. **Image Optimization**: Compress images before sending to Azure Vision
2. **Caching**: Cache GPT-4 responses for common diagnoses
3. **Async**: All endpoints are async for better performance
4. **Fabric Batching**: Batch log entries for efficiency

## 🔐 Security

- Environment variables are never committed
- CORS is configured for specific origins
- Input validation using Pydantic
- Rate limiting recommended for production

## 📞 Support

For issues or questions:
1. Check `.env` setup
2. Verify Azure credentials
3. Check Azure service quota
4. Review API documentation at `/docs`

---

**Backend Lead**: Kalanza
**Status**: Phase 1 Complete ✅
