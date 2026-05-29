import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          console.error('Non autorisé');
          break;
        case 403:
          console.error('Accès refusé');
          break;
        case 404:
          console.error('Ressource non trouvée');
          break;
        case 422:
          console.error('Erreur de validation');
          break;
        case 500:
          console.error('Erreur serveur');
          break;
        default:
          console.error('Erreur inconnue');
      }
    } else if (error.request) {
      console.error('Pas de réponse du serveur');
    } else {
      console.error('Erreur de requête', error.message);
    }
    return Promise.reject(error);
  }
);

// Document API endpoints
const documentApi = {
  // Search documents with filters
  search: (params = {}) => {
    return api.get('/documents/', { params });
  },

  // Get single document by ID
  getById: (id) => {
    return api.get(`/documents/${id}`);
  },

  // Create new document
  create: (data) => {
    return api.post('/documents/', data);
  },

  // Update document
  update: (id, data) => {
    return api.put(`/documents/${id}`, data);
  },

  // Delete document
  delete: (id) => {
    return api.delete(`/documents/${id}`);
  },

  // Get unique types
  getTypes: () => {
    return api.get('/documents/types');
  },

  // Get unique formats
  getFormats: () => {
    return api.get('/documents/formats');
  },

  // Get unique clients
  getClients: () => {
    return api.get('/documents/clients');
  },

  // Get unique projets
  getProjets: () => {
    return api.get('/documents/projets');
  },
};

// Health check
const healthCheck = () => {
  return api.get('/health');
};

export { api, documentApi, healthCheck };
