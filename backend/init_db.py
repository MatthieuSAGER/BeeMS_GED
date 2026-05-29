"""
Script to initialize the database with sample data for testing
"""
import os
import sys
from datetime import datetime, timedelta

# Add the app directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base
from app.models.document import Document
from sqlalchemy.orm import sessionmaker

# Sample data
SAMPLE_DOCUMENTS = [
    {
        "reference": "DOC-2024-001",
        "indice": "A",
        "nom": "Contrat Client Alpha",
        "auteur": "Jean Dupont",
        "type": "Contrat",
        "format": "PDF",
        "client": "Client Alpha",
        "projet": "Projet Alpha",
        "chemin": "\\\\NAS\\Projets\\ClientAlpha\\Contrat.pdf",
    },
    {
        "reference": "DOC-2024-002",
        "indice": "B",
        "nom": "Devis Client Beta",
        "auteur": "Marie Martin",
        "type": "Devis",
        "format": "Word",
        "client": "Client Beta",
        "projet": "Projet Beta",
        "chemin": "\\\\NAS\\Projets\\ClientBeta\\Devis.docx",
    },
    {
        "reference": "TECH-2024-001",
        "indice": "1",
        "nom": "Document Technique - Module X",
        "auteur": "Pierre Durand",
        "type": "Document technique",
        "format": "PDF",
        "client": "Client Gamma",
        "projet": "Projet Gamma",
        "chemin": "\\\\NAS\\Technique\\ModuleX.pdf",
    },
    {
        "reference": "DOC-2024-003",
        "indice": "A",
        "nom": "Compte Rendu Réunion",
        "auteur": "Jean Dupont",
        "type": "Compte rendu",
        "format": "Word",
        "client": "Client Alpha",
        "projet": "Projet Alpha",
        "chemin": "\\\\NAS\\Réunions\\CR_20240115.docx",
    },
    {
        "reference": "FACT-2024-001",
        "indice": "",
        "nom": "Facture Janvier 2024",
        "auteur": "Comptabilité",
        "type": "Facture",
        "format": "PDF",
        "client": "Client Alpha",
        "projet": "Projet Alpha",
        "chemin": "\\\\NAS\\Comptabilité\\Factures\\FACT_2024_01.pdf",
    },
    {
        "reference": "PRESENT-2024-001",
        "indice": "V1",
        "nom": "Présentation Projet Delta",
        "auteur": "Marie Martin",
        "type": "Présentation",
        "format": "PowerPoint",
        "client": "Client Delta",
        "projet": "Projet Delta",
        "chemin": "\\\\NAS\\Présentations\\ProjetDelta.pptx",
    },
    {
        "reference": "DOSSIER-2024-001",
        "indice": "",
        "nom": "Dossier Projet Echo",
        "auteur": "Pierre Durand",
        "type": "Dossier",
        "format": "Dossier",
        "client": "Client Echo",
        "projet": "Projet Echo",
        "chemin": "\\\\NAS\\Projets\\ClientEcho\\Dossier",
    },
    {
        "reference": "DOC-2024-004",
        "indice": "C",
        "nom": "Spécifications Techniques",
        "auteur": "Jean Dupont",
        "type": "Document technique",
        "format": "Excel",
        "client": "Client Alpha",
        "projet": "Projet Alpha",
        "chemin": "\\\\NAS\\Technique\\Specs.xlsx",
    },
    {
        "reference": "DOC-2024-005",
        "indice": "",
        "nom": "Procédure de Test",
        "auteur": "Marie Martin",
        "type": "Document technique",
        "format": "Word",
        "client": "Client Beta",
        "projet": "Projet Beta",
        "chemin": "\\\\NAS\\Tests\\Procédure.docx",
    },
    {
        "reference": "DOC-2024-006",
        "indice": "1.0",
        "nom": "Manuel Utilisateur",
        "auteur": "Pierre Durand",
        "type": "Documentation",
        "format": "PDF",
        "client": "",
        "projet": "Projet Interne",
        "chemin": "\\\\NAS\\Documentation\\Manuel.pdf",
    },
]


def init_database():
    """Initialize the database with tables and sample data"""
    print("Initializing database...")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created")
    
    # Create a session
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Check if database is empty
        count = session.query(Document).count()
        
        if count == 0:
            print("Database is empty, adding sample data...")
            
            # Add sample documents
            for doc_data in SAMPLE_DOCUMENTS:
                # Calculate dates
                now = datetime.now()
                days_ago = timedelta(days=len(SAMPLE_DOCUMENTS) - SAMPLE_DOCUMENTS.index(doc_data))
                date_creation = now - days_ago
                
                document = Document(
                    reference=doc_data["reference"],
                    indice=doc_data["indice"],
                    nom=doc_data["nom"],
                    date_creation=date_creation,
                    auteur=doc_data["auteur"],
                    date_modification=date_creation,
                    auteur_modification=doc_data["auteur"],
                    type=doc_data["type"],
                    format=doc_data["format"],
                    client=doc_data["client"],
                    projet=doc_data["projet"],
                    chemin=doc_data["chemin"],
                )
                session.add(document)
            
            session.commit()
            print(f"✓ Added {len(SAMPLE_DOCUMENTS)} sample documents")
        else:
            print(f"Database already contains {count} documents, skipping sample data")
        
        # Print summary
        documents = session.query(Document).all()
        print(f"\nDatabase Summary:")
        print(f"  Total documents: {len(documents)}")
        
        if documents:
            types = session.query(Document.type).distinct().count()
            formats = session.query(Document.format).distinct().count()
            clients = session.query(Document.client).distinct().count()
            projets = session.query(Document.projet).distinct().count()
            
            print(f"  Unique types: {types}")
            print(f"  Unique formats: {formats}")
            print(f"  Unique clients: {clients}")
            print(f"  Unique projets: {projets}")
        
        print("\n✓ Database initialization complete!")
        
    except Exception as e:
        session.rollback()
        print(f"✗ Error initializing database: {e}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    # Set database path from environment or use default
    db_path = os.environ.get("DATABASE_PATH", "database\\beems_ged.db")
    print(f"Using database: {db_path}")
    
    init_database()
