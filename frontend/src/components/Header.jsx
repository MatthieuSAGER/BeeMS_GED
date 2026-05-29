import React from 'react';

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-secondary-900">BeeMS GED</h1>
                <p className="text-xs text-secondary-500">Gestion Électronique de Documents</p>
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center">
            <div className="text-right mr-4">
              <p className="text-sm font-medium text-secondary-900">Utilisateur</p>
              <p className="text-xs text-secondary-500">Connecté</p>
            </div>
            <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center">
              <span className="text-secondary-600 font-medium">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
