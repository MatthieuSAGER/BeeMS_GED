import React, { useState, useEffect } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useFilterOptions } from '../hooks';

function SearchFilters({ filters, onFilterChange, onSearch, isLoading }) {
  const { data: options, isLoading: isLoadingOptions } = useFilterOptions();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  const handleClear = () => {
    onFilterChange({
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
      page: 1,
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v && v !== '' && v !== null && v !== undefined
  );

  return (
    <div className="card mb-6">
      <div className="card-header">
        <div className="flex justify-between items-center">
          <h2 className="card-title">Filtres de recherche</h2>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="btn btn-secondary btn-sm"
              >
                <XMarkIcon className="w-4 h-4 mr-1" />
                Effacer
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-secondary btn-sm"
            >
              <FunnelIcon className="w-4 h-4 mr-1" />
              {isExpanded ? 'Masquer' : 'Afficher les filtres'}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Reference */}
          <div>
            <label className="form-label">Référence</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: DOC-2024-*"
              value={filters.reference || ''}
              onChange={(e) => handleChange('reference', e.target.value)}
            />
            <p className="text-xs text-secondary-500 mt-1">
              Utilisez * pour les recherches partielles
            </p>
          </div>

          {/* Indice */}
          <div>
            <label className="form-label">Indice</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: A, B, 1"
              value={filters.indice || ''}
              onChange={(e) => handleChange('indice', e.target.value)}
            />
          </div>

          {/* Nom */}
          <div>
            <label className="form-label">Nom</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Contrat*"
              value={filters.nom || ''}
              onChange={(e) => handleChange('nom', e.target.value)}
            />
          </div>

          {/* Auteur */}
          <div>
            <label className="form-label">Auteur</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Dupont"
              value={filters.auteur || ''}
              onChange={(e) => handleChange('auteur', e.target.value)}
            />
          </div>

          {/* Type */}
          <div>
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={filters.type || ''}
              onChange={(e) => handleChange('type', e.target.value)}
            >
              <option value="">Tous les types</option>
              {options?.types?.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="form-label">Format</label>
            <select
              className="form-select"
              value={filters.format || ''}
              onChange={(e) => handleChange('format', e.target.value)}
            >
              <option value="">Tous les formats</option>
              {options?.formats?.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>

          {/* Client */}
          <div>
            <label className="form-label">Client</label>
            <select
              className="form-select"
              value={filters.client || ''}
              onChange={(e) => handleChange('client', e.target.value)}
            >
              <option value="">Tous les clients</option>
              {options?.clients?.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>

          {/* Projet */}
          <div>
            <label className="form-label">Projet</label>
            <select
              className="form-select"
              value={filters.projet || ''}
              onChange={(e) => handleChange('projet', e.target.value)}
            >
              <option value="">Tous les projets</option>
              {options?.projets?.map((projet) => (
                <option key={projet} value={projet}>
                  {projet}
                </option>
              ))}
            </select>
          </div>

          {/* Date de création */}
          <div>
            <label className="form-label">Date de création (de)</label>
            <input
              type="date"
              className="form-input"
              value={filters.date_creation_from || ''}
              onChange={(e) => handleChange('date_creation_from', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Date de création (à)</label>
            <input
              type="date"
              className="form-input"
              value={filters.date_creation_to || ''}
              onChange={(e) => handleChange('date_creation_to', e.target.value)}
            />
          </div>

          {/* Date de modification */}
          <div>
            <label className="form-label">Date de modification (de)</label>
            <input
              type="date"
              className="form-input"
              value={filters.date_modification_from || ''}
              onChange={(e) => handleChange('date_modification_from', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Date de modification (à)</label>
            <input
              type="date"
              className="form-input"
              value={filters.date_modification_to || ''}
              onChange={(e) => handleChange('date_modification_to', e.target.value)}
            />
          </div>

          {/* Search button */}
          <div className="md:col-span-3 flex items-end">
            <button
              onClick={onSearch}
              className="btn btn-primary w-full lg:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Recherche en cours...
                </>
              ) : (
                'Rechercher'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchFilters;
