"""
Database configuration for SQLite on NAS
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Chemin vers la base de données sur le NAS (à configurer)
# Exemple: \\NAS\BeeMS_GED\database\beems_ged.db
# Utiliser des raw strings pour éviter les problèmes avec les backslashes
DEFAULT_DB_PATH = r"database\beems_ged.db"
DATABASE_PATH = os.environ.get("DATABASE_PATH", DEFAULT_DB_PATH)

# Convertir les backslashes pour SQLite (Windows)
# SQLite accepte les chemins Windows avec des backslashes doubles
# Utiliser chr(92) pour représenter le backslash dans les f-strings
backslashes = chr(92)
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DATABASE_PATH.replace(backslashes, '/')}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False  # Mettre à True pour le débogage
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency to get DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
    print(f"Database initialized at: {DATABASE_PATH}")
