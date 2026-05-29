import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './Toast';
import { useCreateDocument, useUpdateDocument, useDocument } from '../hooks';
import { FolderIcon, DocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

function DocumentForm({ documentId, onSuccess, onCancel }) {
  const navigate = useNavigate();
  const toast = useToast();
  
  const { data: document, isLoading: isLoadingDocument } = useDocument(documentId);
  const createMutation = useCreateDocument();
  const updateMutation = useUpdateDocument();

  const [formData, setFormData] = useState({
    reference: '',
    indice: '',
    nom: '',
    auteur: '',
    type: '',
    format: '',
    client: '',
    projet: '',
    chemin: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load document data if editing
  useEffect(() => {
    if (document && documentId) {
      setFormData({
        reference: document.reference || '',
        indice: document.indice || '',
        nom: document.nom || '',
        auteur: document.auteur || '',
        type: document.type || '',
        format: document.format || '',
        client: document.client || '',
        projet: document.projet || '',
        chemin: document.chemin || '',
      });
    }
  }, [document, documentId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.reference || !formData.nom || !formData.auteur || !formData.chemin) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (documentId) {
        // Update existing document
        await updateMutation.mutateAsync({
          id: documentId,
          data: formData,
        });
        toast.success('Document mis à jour avec succès');
      } else {
        // Create new document
        await createMutation.mutateAsync(formData);
        toast.success('Document créé avec succès');
      }
      
      onSuccess && onSuccess();
      onCancel && onCancel();
    } catch (error) {
      console.error('Error saving document:', error);
      const message = error.response?.data?.detail || 
                     error.message || 
                     'Une erreur est survenue lors de la sauvegarde';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingDocument || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Référence */}
        <div>
          <label className="form-label">
            Référence *
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: DOC-2024-001"
            value={formData.reference}
            onChange={(e) => handleChange('reference', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Indice */}
        <div>
          <label className="form-label">Indice</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: A, B, 1"
            value={formData.indice}
            onChange={(e) => handleChange('indice', e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Nom */}
        <div className="md:col-span-2">
          <label className="form-label">
            Nom *
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: Contrat Client X"
            value={formData.nom}
            onChange={(e) => handleChange('nom', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Auteur */}
        <div>
          <label className="form-label">
            Auteur *
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: Jean Dupont"
            value={formData.auteur}
            onChange={(e) => handleChange('auteur', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {/* Type */}
        <div>
          <label className="form-label">Type</label>
          <select
            className="form-select"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            disabled={isLoading}
          >
            <option value="">Sélectionnez un type</option>
            <option value="Contrat">Contrat</option>
            <option value="Document technique">Document technique</option>
            <option value="Devis">Devis</option>
            <option value="Facture">Facture</option>
            <option value="Compte rendu">Compte rendu</option>
            <option value="Présentation">Présentation</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="form-label">Format</label>
          <select
            className="form-select"
            value={formData.format}
            onChange={(e) => handleChange('format', e.target.value)}
            disabled={isLoading}
          >
            <option value="">Sélectionnez un format</option>
            <option value="PDF">PDF</option>
            <option value="Word">Word</option>
            <option value="Excel">Excel</option>
            <option value="PowerPoint">PowerPoint</option>
            <option value="Dossier">Dossier</option>
            <option value="Texte">Texte</option>
            <option value="Image">Image</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        {/* Client */}
        <div>
          <label className="form-label">Client</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: Client X"
            value={formData.client}
            onChange={(e) => handleChange('client', e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Projet */}
        <div>
          <label className="form-label">Projet</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: Projet Alpha"
            value={formData.projet}
            onChange={(e) => handleChange('projet', e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Chemin */}
        <div className="md:col-span-2">
          <label className="form-label">
            Chemin sur le NAS *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              className="form-input flex-1"
              placeholder="Ex: \\NAS\Projets\ClientX\Contrat.pdf"
              value={formData.chemin}
              onChange={(e) => handleChange('chemin', e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="btn btn-secondary whitespace-nowrap"
              disabled={isLoading}
            >
              <FolderIcon className="w-4 h-4 mr-1" />
              Parcourir
            </button>
          </div>
          <p className="text-xs text-secondary-500 mt-1">
            Chemin complet vers le fichier ou dossier sur le NAS
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isLoading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sauvegarde en cours...
            </>
          ) : (
            <>
              <CheckIcon className="w-4 h-4 mr-1" />
              {documentId ? 'Mettre à jour' : 'Créer'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default DocumentForm;
