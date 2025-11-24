"""
AgriVoice FastAPI Backend
Main entry point for the AI-powered crop diagnosis API
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import diagnosis, copilot, enhanced

# Initialize FastAPI app
app = FastAPI(
    title="AgriVoice API",
    description="AI-powered crop diagnosis and organic solution recommendations for African farmers",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS - allow all origins for hackathon
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Welcome endpoint"""
    return {
        "service": "AgriVoice Backend",
        "version": "1.0.0",
        "message": "Multilingual Crop Doctor for African Farmers",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AgriVoice",
        "version": "1.0.0"
    }


@app.get("/config")
async def check_config():
    """Check if Azure services are configured"""
    return {
        "vision": bool(settings.AZURE_VISION_KEY and settings.AZURE_VISION_ENDPOINT),
        "openai": bool(settings.AZURE_OPENAI_KEY and settings.AZURE_OPENAI_ENDPOINT),
        "speech": bool(settings.AZURE_SPEECH_KEY and settings.AZURE_SPEECH_REGION),
        "translator": bool(settings.AZURE_TRANSLATOR_KEY and settings.AZURE_TRANSLATOR_REGION)
    }


# Include routers
app.include_router(diagnosis.router)
app.include_router(copilot.router)
app.include_router(enhanced.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
