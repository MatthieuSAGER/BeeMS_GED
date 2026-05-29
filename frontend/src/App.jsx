import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components';
import { ToastContainer, useToast } from './components';
import {
  Dashboard,
  SearchPage,
  DocumentList,
  CreateDocument,
  EditDocument,
  StatsPage
} from './pages';

function App() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="documents" element={<DocumentList />} />
          <Route path="documents/create" element={<CreateDocument />} />
          <Route path="documents/:id/edit" element={<EditDocument />} />
          <Route path="create" element={<CreateDocument />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

export default App;
