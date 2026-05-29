import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentForm, useToast, LoadingSpinner } from '../components';
import { useDocument } from '../hooks';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function EditDocument() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: document, isLoading } = useDocument(id);

  const handleSuccess = () => {
    navigate('/documents');
  };

  const handleCancel = () => {
    navigate('/documents');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/documents')}
            className="p-2 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Modifier le document</h1>
            <p className="text-secondary-500 mt-1">Chargement...</p>
          </div>
        </div>
        <div className="card flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/documents')}
            className="p-2 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Modifier le document</h1>
          </div>
        </div>
        <div className="card text-center py-8">
          <p className="text-secondary-500">Document non trouvé</p>
          <button
            onClick={() => navigate('/documents')}
            className="btn btn-secondary mt-4"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/documents')}
          className="p-2 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Modifier le document</h1>
          <p className="text-secondary-500 mt-1">
            Modifiez les informations du document "{document.nom}"
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <DocumentForm
          documentId={id}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default EditDocument;
