import React from 'react';
import { useSearchDocuments } from '../hooks';
import { ChartBarIcon, DocumentIcon, FolderIcon, UsersIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

function StatsPage() {
  const { data, isLoading } = useSearchDocuments({
    page_size: 1000, // Get all documents for stats
  });

  // Calculate stats
  const stats = {
    totalDocuments: data?.total || 0,
    types: data?.documents?.reduce((acc, doc) => {
      if (doc.type) {
        acc[doc.type] = (acc[doc.type] || 0) + 1;
      }
      return acc;
    }, {}),
    formats: data?.documents?.reduce((acc, doc) => {
      if (doc.format) {
        acc[doc.format] = (acc[doc.format] || 0) + 1;
      }
      return acc;
    }, {}),
    clients: data?.documents?.reduce((acc, doc) => {
      if (doc.client) {
        acc[doc.client] = (acc[doc.client] || 0) + 1;
      }
      return acc;
    }, {}),
    projets: data?.documents?.reduce((acc, doc) => {
      if (doc.projet) {
        acc[doc.projet] = (acc[doc.projet] || 0) + 1;
      }
      return acc;
    }, {}),
  };

  // Sort by count
  const sortByCount = (obj) => {
    return Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Statistiques</h1>
          <p className="text-secondary-500 mt-1">Chargement des données...</p>
        </div>
        <div className="card flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Statistiques</h1>
        <p className="text-secondary-500 mt-1">
          Analyse des documents référencés
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <DocumentIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{stats.totalDocuments}</p>
              <p className="text-sm text-secondary-500">Documents totaux</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{Object.keys(stats.types || {}).length}</p>
              <p className="text-sm text-secondary-500">Types différents</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FolderIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{Object.keys(stats.formats || {}).length}</p>
              <p className="text-sm text-secondary-500">Formats différents</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{Object.keys(stats.clients || {}).length}</p>
              <p className="text-sm text-secondary-500">Clients différents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Types */}
        <div className="card">
          <h2 className="card-title mb-4">Répartition par type</h2>
          {stats.types && Object.keys(stats.types).length > 0 ? (
            <div className="space-y-3">
              {sortByCount(stats.types).map(([type, count]) => (
                <div key={type} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-secondary-900">{type}</p>
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${(count / stats.totalDocuments) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right">
                    <p className="text-sm font-medium text-secondary-900">{count}</p>
                    <p className="text-xs text-secondary-500">
                      {Math.round((count / stats.totalDocuments) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary-500 text-center py-4">Aucun type trouvé</p>
          )}
        </div>

        {/* Formats */}
        <div className="card">
          <h2 className="card-title mb-4">Répartition par format</h2>
          {stats.formats && Object.keys(stats.formats).length > 0 ? (
            <div className="space-y-3">
              {sortByCount(stats.formats).map(([format, count]) => (
                <div key={format} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-secondary-900">{format}</p>
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(count / stats.totalDocuments) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right">
                    <p className="text-sm font-medium text-secondary-900">{count}</p>
                    <p className="text-xs text-secondary-500">
                      {Math.round((count / stats.totalDocuments) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary-500 text-center py-4">Aucun format trouvé</p>
          )}
        </div>
      </div>

      {/* Clients and Projets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clients */}
        <div className="card">
          <h2 className="card-title mb-4">Top 10 clients</h2>
          {stats.clients && Object.keys(stats.clients).length > 0 ? (
            <div className="space-y-3">
              {sortByCount(stats.clients).map(([client, count]) => (
                <div key={client} className="flex items-center justify-between">
                  <p className="font-medium text-secondary-900">{client}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${(count / stats.totalDocuments) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium text-secondary-900 w-12 text-right">{count}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary-500 text-center py-4">Aucun client trouvé</p>
          )}
        </div>

        {/* Projets */}
        <div className="card">
          <h2 className="card-title mb-4">Top 10 projets</h2>
          {stats.projets && Object.keys(stats.projets).length > 0 ? (
            <div className="space-y-3">
              {sortByCount(stats.projets).map(([projet, count]) => (
                <div key={projet} className="flex items-center justify-between">
                  <p className="font-medium text-secondary-900">{projet}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${(count / stats.totalDocuments) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium text-secondary-900 w-12 text-right">{count}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary-500 text-center py-4">Aucun projet trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
