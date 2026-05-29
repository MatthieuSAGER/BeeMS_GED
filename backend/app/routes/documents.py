"""
API routes for Document management
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, asc
from datetime import datetime
from typing import Optional, List
import os

from ..database import get_db
from ..models.document import Document as DocumentModel
from ..schemas.document import (
    DocumentCreate,
    DocumentUpdate,
    DocumentResponse,
    DocumentSearch,
    DocumentSearchResult
)
from ..utils.auth import (
    check_path_access,
    get_current_user,
    filter_documents_by_permissions,
    verify_document_access
)

router = APIRouter(prefix="/api/documents", tags=["Documents"])


def _apply_wildcard_search(field, value: str):
    """
    Apply wildcard search to a SQLAlchemy field.
    Supports * at the beginning, end, or both.
    """
    if not value:
        return None
    
    if '*' in value:
        # Replace * with % for SQL LIKE
        pattern = value.replace('*', '%')
        return field.ilike(pattern)
    else:
        return field.ilike(f"%{value}%")


def _build_search_query(db: Session, search: DocumentSearch):
    """
    Build SQLAlchemy query based on search parameters.
    """
    query = db.query(DocumentModel)
    
    # Apply filters
    filters = []
    
    if search.reference:
        filters.append(_apply_wildcard_search(DocumentModel.reference, search.reference))
    
    if search.indice:
        filters.append(DocumentModel.indice.ilike(f"%{search.indice}%"))
    
    if search.nom:
        filters.append(_apply_wildcard_search(DocumentModel.nom, search.nom))
    
    if search.auteur:
        filters.append(DocumentModel.auteur.ilike(f"%{search.auteur}%"))
    
    if search.type:
        filters.append(DocumentModel.type.ilike(f"%{search.type}%"))
    
    if search.format:
        filters.append(DocumentModel.format.ilike(f"%{search.format}%"))
    
    if search.client:
        filters.append(DocumentModel.client.ilike(f"%{search.client}%"))
    
    if search.projet:
        filters.append(DocumentModel.projet.ilike(f"%{search.projet}%"))
    
    if search.date_creation_from:
        filters.append(DocumentModel.date_creation >= search.date_creation_from)
    
    if search.date_creation_to:
        filters.append(DocumentModel.date_creation <= search.date_creation_to)
    
    if search.date_modification_from:
        filters.append(DocumentModel.date_modification >= search.date_modification_from)
    
    if search.date_modification_to:
        filters.append(DocumentModel.date_modification <= search.date_modification_to)
    
    if filters:
        query = query.filter(and_(*filters))
    
    return query


def _apply_sorting(query, sort_by: str, sort_order: str):
    """
    Apply sorting to the query.
    """
    if not sort_by:
        return query
    
    # Map field names to SQLAlchemy columns
    sort_fields = {
        "id": DocumentModel.id,
        "reference": DocumentModel.reference,
        "indice": DocumentModel.indice,
        "nom": DocumentModel.nom,
        "date_creation": DocumentModel.date_creation,
        "auteur": DocumentModel.auteur,
        "date_modification": DocumentModel.date_modification,
        "auteur_modification": DocumentModel.auteur_modification,
        "type": DocumentModel.type,
        "format": DocumentModel.format,
        "client": DocumentModel.client,
        "projet": DocumentModel.projet,
        "chemin": DocumentModel.chemin
    }
    
    if sort_by in sort_fields:
        if sort_order == "desc":
            query = query.order_by(desc(sort_fields[sort_by]))
        else:
            query = query.order_by(asc(sort_fields[sort_by]))
    
    return query


@router.get("/", response_model=DocumentSearchResult)
async def search_documents(
    search: DocumentSearch = Depends(),
    db: Session = Depends(get_db)
):
    """
    Search documents with advanced filtering, sorting, and pagination.
    
    Returns only documents that the current user has access to.
    """
    # Build base query
    query = _build_search_query(db, search)
    
    # Apply sorting
    query = _apply_sorting(query, search.sort_by, search.sort_order)
    
    # Get total count (before pagination)
    total = query.count()
    
    # Apply pagination
    offset = (search.page - 1) * search.page_size
    query = query.offset(offset).limit(search.page_size)
    
    # Execute query
    documents = query.all()
    
    # Filter by permissions (check each document's path)
    accessible_documents = []
    for doc in documents:
        if check_path_access(doc.chemin):
            accessible_documents.append(doc)
    
    # Recalculate total based on accessible documents
    # For this, we need to get all matching documents and filter
    # This is less efficient but ensures accurate pagination
    all_query = _build_search_query(db, search)
    all_documents = all_query.all()
    all_accessible = [doc for doc in all_documents if check_path_access(doc.chemin)]
    
    # Apply sorting to accessible documents
    sort_field = search.sort_by or "date_creation"
    reverse = search.sort_order == "desc"
    
    # Simple Python sorting
    if sort_field in ["id", "date_creation", "date_modification"]:
        all_accessible.sort(
            key=lambda x: getattr(x, sort_field, None) or datetime.min,
            reverse=reverse
        )
    else:
        all_accessible.sort(
            key=lambda x: getattr(x, sort_field, "").lower() if getattr(x, sort_field) else "",
            reverse=reverse
        )
    
    # Apply pagination to filtered results
    start_idx = (search.page - 1) * search.page_size
    end_idx = start_idx + search.page_size
    paginated_docs = all_accessible[start_idx:end_idx]
    
    total_accessible = len(all_accessible)
    total_pages = (total_accessible + search.page_size - 1) // search.page_size
    
    return DocumentSearchResult(
        documents=paginated_docs,
        total=total_accessible,
        page=search.page,
        page_size=search.page_size,
        total_pages=total_pages
    )


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a single document by ID.
    
    Returns 403 if user doesn't have access to the document's path.
    """
    document = db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document non trouvé"
        )
    
    # Verify user has access to this document's path
    verify_document_access(document.chemin)
    
    return document


@router.post("/", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_document(
    document: DocumentCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new document.
    
    Verifies that the user has access to the specified path.
    """
    # Verify user has access to the path
    verify_document_access(document.chemin)
    
    # Check if reference already exists
    existing = db.query(DocumentModel).filter(
        DocumentModel.reference == document.reference
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Un document avec la référence '{document.reference}' existe déjà"
        )
    
    # Create the document
    db_document = DocumentModel(
        reference=document.reference,
        indice=document.indice,
        nom=document.nom,
        date_creation=document.date_creation or datetime.now(),
        auteur=document.auteur,
        date_modification=datetime.now(),
        auteur_modification=document.auteur,
        type=document.type,
        format=document.format,
        client=document.client,
        projet=document.projet,
        chemin=document.chemin
    )
    
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return db_document


@router.put("/{document_id}", response_model=DocumentResponse)
async def update_document(
    document_id: int,
    document_update: DocumentUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing document.
    
    Verifies that the user has access to both the old and new paths (if changed).
    """
    # Get existing document
    db_document = db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
    
    if not db_document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document non trouvé"
        )
    
    # Verify user has access to the current path
    verify_document_access(db_document.chemin)
    
    # If path is being changed, verify access to new path
    if document_update.chemin and document_update.chemin != db_document.chemin:
        verify_document_access(document_update.chemin)
    
    # Update fields
    update_data = document_update.model_dump(exclude_unset=True)
    
    # Set modification timestamp and author
    update_data["date_modification"] = datetime.now()
    update_data["auteur_modification"] = get_current_user()
    
    for field, value in update_data.items():
        setattr(db_document, field, value)
    
    db.commit()
    db.refresh(db_document)
    
    return db_document


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a document.
    
    Verifies that the user has access to the document's path.
    """
    db_document = db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
    
    if not db_document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document non trouvé"
        )
    
    # Verify user has access to this document's path
    verify_document_access(db_document.chemin)
    
    db.delete(db_document)
    db.commit()
    
    return None


@router.get("/types", response_model=List[str])
async def get_document_types(db: Session = Depends(get_db)):
    """
    Get list of unique document types.
    """
    types = db.query(DocumentModel.type).distinct().all()
    return [t.type for t in types if t.type]


@router.get("/formats", response_model=List[str])
async def get_document_formats(db: Session = Depends(get_db)):
    """
    Get list of unique document formats.
    """
    formats = db.query(DocumentModel.format).distinct().all()
    return [f.format for f in formats if f.format]


@router.get("/clients", response_model=List[str])
async def get_clients(db: Session = Depends(get_db)):
    """
    Get list of unique clients.
    """
    clients = db.query(DocumentModel.client).distinct().all()
    return [c.client for c in clients if c.client]


@router.get("/projets", response_model=List[str])
async def get_projets(db: Session = Depends(get_db)):
    """
    Get list of unique projets.
    """
    projets = db.query(DocumentModel.projet).distinct().all()
    return [p.projet for p in projets if p.projet]
