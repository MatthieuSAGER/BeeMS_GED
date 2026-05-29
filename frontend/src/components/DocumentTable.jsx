import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon, FolderIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function DocumentTable({ documents, onEdit, onDelete, isLoading }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getFormatIcon = (format) => {
    if (!format) return DocumentIcon;
    const folderFormats = ['dossier', 'folder', 'répertoire'];
    if (folderFormats.includes(format.toLowerCase())) {
      return FolderIcon;
    }
    return DocumentIcon;
  };

  if (isLoading) {
    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th colSpan="12" className="text-center py-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-3"></div>
                  <span>Chargement...</span>
                </div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th className="w-12">Type</th>
            <th>Référence</th>
            <th>Indice</th>
            <th>Nom</th>
            <th>Type</th>
            <th>Format</th>
            <th>Client</th>
            <th>Projet</th>
            <th>Auteur</th>
            <th>Création</th>
            <th>Modification</th>
            <th className="w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => {
            const Icon = getFormatIcon(doc.format);
            
            return (
              <tr key={doc.id} className="group">
                <td>
                  <Icon className="w-5 h-5 text-secondary-400 mx-auto" />
                </td>
                <td className="font-medium text-primary-600">
                  {doc.reference}
                </td>
                <td>
                  <span className="badge badge-secondary">{doc.indice || '-'}</span>
                </td>
                <td className="max-w-xs truncate" title={doc.nom}>
                  {doc.nom}
                </td>
                <td>
                  <span className="badge badge-primary">{doc.type || '-'}</span>
                </td>
                <td>{doc.format || '-'}</td>
                <td>{doc.client || '-'}</td>
                <td>{doc.projet || '-'}</td>
                <td>{doc.auteur}</td>
                <td className="text-sm text-secondary-500 whitespace-nowrap">
                  {formatDate(doc.date_creation)}
                </td>
                <td className="text-sm text-secondary-500 whitespace-nowrap">
                  {formatDate(doc.date_modification)}
                </td>
                <td className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit && onEdit(doc)}
                    className="p-1.5 rounded-md text-secondary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    title="Modifier"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(doc)}
                    className="p-1.5 rounded-md text-secondary-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentTable;
