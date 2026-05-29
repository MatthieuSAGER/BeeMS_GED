import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  DocumentPlusIcon,
  FolderIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: HomeIcon },
  { name: 'Rechercher', href: '/search', icon: MagnifyingGlassIcon },
  { name: 'Nouveau document', href: '/create', icon: DocumentPlusIcon },
  { name: 'Tous les documents', href: '/documents', icon: FolderIcon },
  { name: 'Statistiques', href: '/stats', icon: ChartBarIcon },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                             (location.pathname.startsWith(item.href) && item.href !== '/');
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  }`
                }
              >
                <item.icon 
                  className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600' : 'text-secondary-400'}`} 
                />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
