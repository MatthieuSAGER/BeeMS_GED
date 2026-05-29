import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentIcon, 
  FolderIcon, 
  MagnifyingGlassIcon,
  UsersIcon,
  ChartBarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useSearchDocuments } from '../hooks';
import LoadingSpinner from '../components/LoadingSpinner';

const stats = [
  {
    name: 'Total documents',
    value: '128',
    icon: DocumentIcon,
    color: 'bg-primary-500',
    href: '/documents',
  },
  {
    name: 'Dossiers',
    value: '24',
    icon: FolderIcon,
    color: 'bg-yellow-500',
    href: '/documents?format=Dossier',
  },
  {
    name: 'Recherches récentes',
    value: '42',
    icon: MagnifyingGlassIcon,
    color: 'bg-green-500',
    href: '/search',
  },
  {
    name: 'Utilisateurs',
    value: '8',
    icon: UsersIcon,
    color: 'bg-purple-500',
    href: '#',
  },
];

const quickActions = [
  {
    name: 'Nouveau document',
    description: 'Ajouter un nouveau document à la base',
    icon: PlusIcon,
    color: 'bg-primary-500',
    href: '/create',
  },
  {
    name: 'Recherche avancée',
    description: 'Effectuer une recherche avec des filtres',
    icon: MagnifyingGlassIcon,
    color: 'bg-green-500',
    href: '/search',
  },
  {
    name: 'Statistiques',
    description: 'Voir les statistiques d\'utilisation',
    icon: ChartBarIcon,
    color: 'bg-purple-500',
    href: '/stats',
  },
];

function Dashboard() {
  const { data, isLoading } = useSearchDocuments({
    page_size: 5,
    sort_by: 'date_creation',
    sort_order: 'desc',
  });

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Tableau de bord</h1>
        <p className="text-secondary-500 mt-1">
          Bienvenue sur BeeMS GED - Gestion Électronique de Documents
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="card group hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                <p className="text-sm text-secondary-500">{stat.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="card group hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary-900 group-hover:text-primary-600 transition-colors">
                    {action.name}
                  </h3>
                  <p className="text-sm text-secondary-500 mt-1">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Derniers documents ajoutés</h2>
          <Link to="/documents" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Voir tous
          </Link>
        </div>
        
        {isLoading ? (
          <div className="card flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-3">
            {data?.documents?.map((doc) => (
              <Link
                key={doc.id}
                to={`/documents/${doc.id}`}
                className="card flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DocumentIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-secondary-900 truncate">{doc.nom}</h3>
                  <p className="text-sm text-secondary-500">{doc.reference}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary-900">{doc.client || doc.projet}</p>
                  <p className="text-xs text-secondary-500">
                    {new Date(doc.date_creation).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </Link>
            ))}
            
            {!data?.documents?.length && (
              <div className="card text-center py-8">
                <p className="text-secondary-500">Aucun document récent</p>
                <Link to="/create" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                  Ajouter un document
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
