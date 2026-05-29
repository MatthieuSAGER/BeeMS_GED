"""
Pydantic schemas for Document model
"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


class DocumentBase(BaseModel):
    """Base schema for Document"""
    reference: str = Field(..., max_length=100, description="Référence unique du document")
    indice: Optional[str] = Field(None, max_length=20, description="Indice du document")
    nom: str = Field(..., max_length=255, description="Nom du document")
    date_creation: Optional[datetime] = Field(None, description="Date de création")
    auteur: str = Field(..., max_length=100, description="Auteur initial")
    date_modification: Optional[datetime] = Field(None, description="Date de modification")
    auteur_modification: Optional[str] = Field(None, max_length=100, description="Auteur de la modification")
    type: Optional[str] = Field(None, max_length=100, description="Type de document")
    format: Optional[str] = Field(None, max_length=50, description="Format du fichier")
    client: Optional[str] = Field(None, max_length=100, description="Client associé")
    projet: Optional[str] = Field(None, max_length=100, description="Projet associé")
    chemin: str = Field(..., max_length=500, description="Chemin complet sur le NAS")


class DocumentCreate(DocumentBase):
    """Schema for creating a new Document"""
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "reference": "DOC-2024-001",
            "indice": "A",
            "nom": "Contrat Client X",
            "auteur": "Jean Dupont",
            "type": "Contrat",
            "format": "PDF",
            "client": "Client X",
            "projet": "Projet Alpha",
            "chemin": "\\\\NAS\\Projets\\ClientX\\Contrat.pdf"
        }
    })


class DocumentUpdate(BaseModel):
    """Schema for updating a Document (all fields optional)"""
    reference: Optional[str] = Field(None, max_length=100)
    indice: Optional[str] = Field(None, max_length=20)
    nom: Optional[str] = Field(None, max_length=255)
    date_creation: Optional[datetime] = None
    auteur: Optional[str] = Field(None, max_length=100)
    date_modification: Optional[datetime] = None
    auteur_modification: Optional[str] = Field(None, max_length=100)
    type: Optional[str] = Field(None, max_length=100)
    format: Optional[str] = Field(None, max_length=50)
    client: Optional[str] = Field(None, max_length=100)
    projet: Optional[str] = Field(None, max_length=100)
    chemin: Optional[str] = Field(None, max_length=500)


class DocumentResponse(DocumentBase):
    """Schema for Document response (includes id)"""
    id: int
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "reference": "DOC-2024-001",
                "indice": "A",
                "nom": "Contrat Client X",
                "date_creation": "2024-01-01T10:00:00",
                "auteur": "Jean Dupont",
                "date_modification": "2024-01-15T14:30:00",
                "auteur_modification": "Marie Martin",
                "type": "Contrat",
                "format": "PDF",
                "client": "Client X",
                "projet": "Projet Alpha",
                "chemin": "\\\\NAS\\Projets\\ClientX\\Contrat.pdf"
            }
        }
    )


class DocumentSearch(BaseModel):
    """Schema for search parameters"""
    reference: Optional[str] = Field(None, description="Filtre sur la référence (supporte * pour wildcard)")
    indice: Optional[str] = Field(None, description="Filtre sur l'indice")
    nom: Optional[str] = Field(None, description="Filtre sur le nom (supporte * pour wildcard)")
    auteur: Optional[str] = Field(None, description="Filtre sur l'auteur")
    type: Optional[str] = Field(None, description="Filtre sur le type")
    format: Optional[str] = Field(None, description="Filtre sur le format")
    client: Optional[str] = Field(None, description="Filtre sur le client")
    projet: Optional[str] = Field(None, description="Filtre sur le projet")
    date_creation_from: Optional[datetime] = Field(None, description="Date de création minimum")
    date_creation_to: Optional[datetime] = Field(None, description="Date de création maximum")
    date_modification_from: Optional[datetime] = Field(None, description="Date de modification minimum")
    date_modification_to: Optional[datetime] = Field(None, description="Date de modification maximum")
    
    # Options de tri et pagination
    sort_by: Optional[str] = Field("date_creation", description="Champ pour le tri")
    sort_order: Optional[str] = Field("desc", description="Ordre de tri (asc/desc)")
    page: Optional[int] = Field(1, ge=1, description="Numéro de page")
    page_size: Optional[int] = Field(20, ge=1, le=100, description="Taille de la page")


class DocumentSearchResult(BaseModel):
    """Schema for search results with pagination"""
    documents: list[DocumentResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
