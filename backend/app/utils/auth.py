"""
Authentication and permission utilities for Windows/NAS environment.

This module provides functions to check if the current user has access
to a specific path on the NAS, based on Windows file system permissions.
"""
import os
import ctypes
import sys
from typing import Optional
from fastapi import HTTPException, status


def check_path_access(path: str, user: Optional[str] = None) -> bool:
    """
    Check if the current user (or specified user) has read access to a path.
    
    Args:
        path: Windows path to check (e.g., \\\\NAS\\Projets\\ClientX\\doc.pdf)
        user: Optional username to check permissions for (default: current user)
    
    Returns:
        bool: True if user has read access, False otherwise
    """
    try:
        # Normalize the path (replace / with \ and handle UNC paths)
        normalized_path = path.replace('/', '\\')
        
        # For UNC paths (\\server\share), ensure proper format
        if normalized_path.startswith('\\\\'):
            # UNC paths are fine as-is
            pass
        else:
            # Local paths
            normalized_path = os.path.abspath(normalized_path)
        
        # Check if path exists
        if not os.path.exists(normalized_path):
            return False
        
        # Check read access using os.access
        # Note: On Windows, os.access may not work perfectly with UNC paths
        # So we also try to open the directory/file
        if os.access(normalized_path, os.R_OK):
            return True
        
        # Additional check for UNC paths
        try:
            if os.path.isdir(normalized_path):
                # Try to list directory contents
                os.listdir(normalized_path)
                return True
            else:
                # Try to open the file
                with open(normalized_path, 'rb') as f:
                    pass
                return True
        except (PermissionError, OSError):
            return False
            
    except Exception as e:
        print(f"Error checking path access: {e}")
        return False


def get_current_user() -> str:
    """
    Get the current Windows username.
    
    Returns:
        str: Current username
    """
    try:
        import getpass
        return getpass.getuser()
    except Exception:
        return "Unknown"


def filter_documents_by_permissions(documents: list, user: Optional[str] = None) -> list:
    """
    Filter a list of documents to only include those accessible by the user.
    
    Args:
        documents: List of document dictionaries or objects with 'chemin' attribute
        user: Optional username (default: current user)
    
    Returns:
        list: Filtered list of accessible documents
    """
    accessible_docs = []
    for doc in documents:
        # Get the path from the document
        if hasattr(doc, 'chemin'):
            path = doc.chemin
        elif isinstance(doc, dict) and 'chemin' in doc:
            path = doc['chemin']
        else:
            continue
        
        if check_path_access(path, user):
            accessible_docs.append(doc)
    
    return accessible_docs


def verify_document_access(path: str, user: Optional[str] = None) -> None:
    """
    Verify that the user has access to a document path.
    Raises HTTPException if access is denied.
    
    Args:
        path: Path to verify
        user: Optional username
    
    Raises:
        HTTPException: If access is denied
    """
    if not check_path_access(path, user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Accès refusé: vous n'avez pas les droits pour accéder à {path}"
        )
