import React, { useState, useEffect } from 'react';
import { useSearchDocuments, useDeleteDocument } from '../hooks';
import { useToast } from '../components';
import {
  SearchFilters,
  DocumentTable,
  Pagination,
  EmptyState,
  ConfirmDialog,
  LoadingSpinner
} from '../components';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

function SearchPage() {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [filters, setFilters] = useState({
    reference: '',
    indice: '',
    nom: '',
    auteur: '',
    type: '',
    format: '',
    client: '',
    projet: '',
    date_creation_from: '',
    date_creation_to: '',
    date_modification_from: '',
    date_modification_to: '',
    sort_by: 'date_creation',
    sort_order: 'desc',
    page: 1,
    page_size: 20,
  });

  const { data, isLoading, refetch } = useSearchDocuments(filters);
  const deleteMutation = useDeleteDocument();

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    document: null,
  });

  // Edit modal state
  const [editDocument, setEditDocument] = useState(null);

  // Search when filters change
  useEffect(() => {
    // Small delay to avoid rapid refetches
    const timer = setTimeout(() => {
      refetch();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, refetch]);

  const handleSearch = () => {
    refetch();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleEdit = (document) => {
    navigate(`/documents/${document.id}/edit`);
  };

  const handleDeleteClick = (document) => {
    setConfirmDialog({
      isOpen: true,
      document,
    });
  };

  const handleDeleteConfirm = async () => {
    const document = confirmDialog.document;
    if (!document) return;

    try {
      await deleteMutation.mutateAsync(document.id);
      toast.success(`Document "${document.nom}" supprimé avec succès`);
      setConfirmDialog({ isOpen: false, document: null });
      refetch();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Une erreur est survenue lors de la suppression');
    }
  };

  const handleSort = (field) => {
    let newSortOrder = 'asc';
    if (filters.sort_by === field) {
      newSortOrder = filters.sort_order === 'asc' ? 'desc' : 'asc';
    }
    setFilters((prev) => ({ ...prev, sort_by: field, sort_order: newSortOrder }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Recherche avancée</h1>
          <p className="text-secondary-500 mt-1">
            Effectuez une recherche parmi tous les documents accessibles
          </p>
        </div>
        <button
          onClick={() => navigate('/create')}
          className="btn btn-primary"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Nouveau document
        </button>
      </div>

      {/* Filters */}
      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      {/* Results */}
      {isLoading && !data ? (
        <div className="card flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {data?.documents?.length > 0 ? (
            <>
              {/* Results count */}
              <div className="flex items-center gap-2 text-secondary-600">
                <MagnifyingGlassIcon className="w-5 h-5" />
                <span>
                  {data.total} document{data.total > 1 ? 's' : ''} trouvé{data.total > 1 ? 's' : ''}
                </span>
              </div>

              {/* Table */}
              <DocumentTable
                documents={data.documents}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                isLoading={isLoading}
              />

              {/* Pagination */}
              <Pagination
                currentPage={data.page}
                totalPages={data.total_pages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            </>
          ) : (
            <EmptyState
              type="search"
              action={
                <button
                  onClick={() => navigate('/create')}
                  className="btn btn-primary"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Ajouter un document
                </button>
              }
            />
          )}
        </>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, document: null })}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le document"
        message={`Êtes-vous sûr de vouloir supprimer le document "${confirmDialog.document?.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default SearchPage;
