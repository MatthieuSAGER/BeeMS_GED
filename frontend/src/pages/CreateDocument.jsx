import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentForm, useToast } from '../components';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function CreateDocument() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSuccess = () => {
    navigate('/documents');
  };

  const handleCancel = () => {
    navigate('/documents');
  };

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
          <h1 className="text-2xl font-bold text-secondary-900">Nouveau document</h1>
          <p className="text-secondary-500 mt-1">
            Ajoutez un nouveau document à la base de données
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <DocumentForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default CreateDocument;
