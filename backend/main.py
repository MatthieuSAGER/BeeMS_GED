"""
Main entry point for the BeeMS GED backend server.

This script starts the FastAPI application with Uvicorn.
"""
import uvicorn
import os

if __name__ == "__main__":
    # Set default database path if not set
    # Utiliser chr(92) pour éviter les problèmes avec les backslashes dans les f-strings
    bs = chr(92)
    default_db_path = os.path.join("database", "beems_ged.db").replace("/", bs)
    db_path = os.environ.get("DATABASE_PATH", default_db_path)
    os.environ["DATABASE_PATH"] = db_path
    
    # Start the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
