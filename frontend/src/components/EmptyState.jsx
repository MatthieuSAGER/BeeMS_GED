import React from 'react';
import { FolderIcon, MagnifyingGlassIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';

function EmptyState({ type = 'search', message, action }) {
  const icons = {
    search: MagnifyingGlassIcon,
    documents: FolderIcon,
    create: DocumentPlusIcon,
  };

  const Icon = icons[type] || FolderIcon;
  
  const defaultMessages = {
    search: {
      title: 'Aucun résultat trouvé',
      description: 'Aucun document ne correspond à vos critères de recherche. Essayez de modifier vos filtres.',
    },
    documents: {
      title: 'Aucun document',
      description: 'Il n\'y a pas encore de documents référencés dans la base de données.',
    },
    create: {
      title: 'Créer un nouveau document',
      description: 'Commencez par ajouter votre premier document pour organiser votre base documentaire.',
    },
  };

  const { title, description } = message || defaultMessages[type];

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
