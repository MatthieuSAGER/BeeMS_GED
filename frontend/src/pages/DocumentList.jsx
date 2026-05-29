import React, { useState } from 'react';
import { useSearchDocuments, useDeleteDocument } from '../hooks';
import { useToast } from '../components';
import {
  DocumentTable,
  Pagination,
  EmptyState,
  ConfirmDialog,
  LoadingSpinner
} from '../components';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

function DocumentList() {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [filters, setFilters] = useState({
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Tous les documents</h1>
          <p className="text-secondary-500 mt-1">
            Liste complète des documents référencés
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/search')}
            className="btn btn-secondary"
          >
            <MagnifyingGlassIcon className="w-4 h-4 mr-1" />
            Rechercher
          </button>
          <button
            onClick={() => navigate('/create')}
            className="btn btn-primary"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Nouveau
          </button>
        </div>
      </div>

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
                  {data.total} document{data.total > 1 ? 's' : ''} au total
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
              type="documents"
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

export default DocumentList;
