"""
Main FastAPI application for BeeMS GED
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import uvicorn
import os

from .database import init_db, Base, engine
from .routes import documents_router

# Create FastAPI app
app = FastAPI(
    title="BeeMS GED API",
    description="API de gestion documentaire pour BeeMS. Gère les références des documents stockés sur le NAS.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Configure CORS (Cross-Origin Resource Sharing)
# Allow requests from any origin (for development)
# In production, restrict to specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(documents_router)


# Exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "detail": exc.errors(),
            "body": exc.body
        }
    )


@app.get("/api/")
async def root():
    """Root endpoint"""
    return {
        "message": "Bienvenue sur l'API BeeMS GED",
        "version": "1.0.0",
        "docs": "/api/docs"
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# Initialize database on startup
@app.on_event("startup")
def startup_event():
    """Initialize database on startup"""
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    print("Database tables created/verified")


# For running with uvicorn directly
if __name__ == "__main__":
    # Get port from environment or use default
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    
    print(f"Starting BeeMS GED API on {host}:{port}")
    print(f"Database path: {os.environ.get('DATABASE_PATH', 'database\\beems_ged.db')}")
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
