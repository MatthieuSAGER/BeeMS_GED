"""
Document model for SQLite database
"""
from sqlalchemy import Column, String, DateTime, Integer
from sqlalchemy.sql import func
from ..database import Base


class Document(Base):
    """
    Modèle représentant un document dans la base de données.
    
    Champs:
    - reference: Référence unique du document (ex: "DOC-2024-001")
    - indice: Indice du document (ex: "A", "B", "1")
    - nom: Nom du document
    - date_creation: Date de création du document
    - auteur: Auteur initial du document
    - date_modification: Date de la dernière modification
    - auteur_modification: Auteur de la dernière modification
    - type: Type de document (contrat, document technique, etc.)
    - format: Format du fichier (word, excel, dossier, etc.)
    - client: Client associé au document
    - projet: Projet associé au document
    - chemin: Chemin complet vers le fichier/dossier sur le NAS (ex: \\NAS\Projets\ClientX\doc.pdf)
    """
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    reference = Column(String(100), index=True, nullable=False)
    indice = Column(String(20), index=True)
    nom = Column(String(255), nullable=False)
    date_creation = Column(DateTime(timezone=True), default=func.now())
    auteur = Column(String(100), nullable=False)
    date_modification = Column(DateTime(timezone=True), onupdate=func.now())
    auteur_modification = Column(String(100))
    type = Column(String(100), index=True)
    format = Column(String(50), index=True)
    client = Column(String(100), index=True)
    projet = Column(String(100), index=True)
    chemin = Column(String(500), nullable=False, index=True)
    
    def __repr__(self):
        return f"<Document(reference='{self.reference}', nom='{self.nom}')>"
