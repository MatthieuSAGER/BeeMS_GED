"""
Main entry point for the BeeMS GED backend server.

This script starts the FastAPI application with Uvicorn.
"""
import uvicorn
import os

if __name__ == "__main__":
    # Set default database path if not set
    db_path = os.environ.get("DATABASE_PATH", "database\\beems_ged.db")
    os.environ["DATABASE_PATH"] = db_path
    
    # Start the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
