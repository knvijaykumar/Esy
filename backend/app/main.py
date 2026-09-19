"""
Esy FARM - FastAPI Application Entrypoint
==========================================
Main application server exposing core backend APIs, health check,
and the dedicated ML module router (/api/ml).
"""

import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure project root and backend are in sys.path
BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BACKEND_DIR.parent
for p in (str(PROJECT_ROOT), str(BACKEND_DIR)):
    if p not in sys.path:
        sys.path.insert(0, p)

from backend.app.config import PRICE_MODEL, DEMAND_MODEL, ML_API_HOST, ML_API_PORT
from backend.app.api.ml import router as ml_router
from backend.app.api.chat import router as chat_router
from backend.app.api.farmer_updates import router as updates_router

app = FastAPI(
    title="Esy FARM API",
    description="FastAPI Backend for SIH26032 Esy FARM - MSP Procurement & Slot Allocation Portal",
    version="1.0.0",
)

# Cross-Origin Resource Sharing (CORS) Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(ml_router)
app.include_router(chat_router)
app.include_router(updates_router)



@app.get("/health", tags=["System"])
async def health_check():
    """
    Health check endpoint confirming API status, service name, and active ML configuration.
    Never exposes secrets or HF_TOKEN.
    """
    return {
        "status": "healthy",
        "service": "Esy FARM API",
        "version": "1.0.0",
        "ml_models": {
            "price_model": PRICE_MODEL,
            "demand_model": DEMAND_MODEL,
        },
    }


@app.get("/", tags=["System"])
async def root():
    return {
        "message": "Welcome to Esy FARM Backend API",
        "docs_url": "/docs",
        "health_check": "/health",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.app.main:app",
        host=ML_API_HOST,
        port=ML_API_PORT,
        reload=False,
    )
