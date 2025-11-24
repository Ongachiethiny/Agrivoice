"""
AgriVoice FastAPI Backend
Main entry point for the AI-powered crop diagnosis API
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="AgriVoice API",
    description="AI-powered crop diagnosis and organic solution recommendations",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Import routers (will be created next)
# from app.routers import diagnosis, image_analysis, speech


class HealthResponse(BaseModel):
    status: str
    message: str


@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "AgriVoice API is running"
    }


@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "API service is operational"
    }


@app.get("/api/v1/status")
async def api_status():
    """Check API status and Azure service connectivity"""
    return {
        "api_version": "1.0.0",
        "services": {
            "vision": "configured" if os.getenv("AZURE_VISION_KEY") else "not configured",
            "gpt4": "configured" if os.getenv("AZURE_OPENAI_KEY") else "not configured",
            "speech": "configured" if os.getenv("AZURE_SPEECH_KEY") else "not configured",
            "fabric": "configured" if os.getenv("FABRIC_WORKSPACE_ID") else "not configured"
        }
    }


# Include routers
# app.include_router(diagnosis.router)
# app.include_router(image_analysis.router)
# app.include_router(speech.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=os.getenv("DEBUG", False)
    )
