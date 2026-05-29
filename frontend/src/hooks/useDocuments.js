import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentApi } from '../services/api';

// Key for document queries
export const DOCUMENTS_KEY = 'documents';

/**
 * Hook to search and fetch documents with filters
 */
export function useSearchDocuments(params) {
  return useQuery({
    queryKey: [DOCUMENTS_KEY, 'search', params],
    queryFn: () => documentApi.search(params).then((res) => res.data),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a single document by ID
 */
export function useDocument(id) {
  return useQuery({
    queryKey: [DOCUMENTS_KEY, id],
    queryFn: () => documentApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

/**
 * Hook to create a new document
 */
export function useCreateDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => documentApi.create(data).then((res) => res.data),
    onSuccess: () => {
      // Invalidate documents cache to refetch
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY] });
    },
    onError: (error) => {
      console.error('Error creating document:', error);
    },
  });
}

/**
 * Hook to update a document
 */
export function useUpdateDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => documentApi.update(id, data).then((res) => res.data),
    onSuccess: (data) => {
      // Invalidate documents cache
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY] });
      // Update the specific document cache
      queryClient.setQueryData([DOCUMENTS_KEY, data.id], data);
    },
    onError: (error) => {
      console.error('Error updating document:', error);
    },
  });
}

/**
 * Hook to delete a document
 */
export function useDeleteDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => documentApi.delete(id),
    onSuccess: () => {
      // Invalidate documents cache
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY] });
    },
    onError: (error) => {
      console.error('Error deleting document:', error);
    },
  });
}

/**
 * Hook to get filter options (types, formats, clients, projets)
 */
export function useFilterOptions() {
  return useQuery({
    queryKey: [DOCUMENTS_KEY, 'filter-options'],
    queryFn: async () => {
      const [types, formats, clients, projets] = await Promise.all([
        documentApi.getTypes(),
        documentApi.getFormats(),
        documentApi.getClients(),
        documentApi.getProjets(),
      ]);
      
      return {
        types: types.data || [],
        formats: formats.data || [],
        clients: clients.data || [],
        projets: projets.data || [],
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to prefetch documents
 */
export function usePrefetchDocuments() {
  const queryClient = useQueryClient();
  
  return {
    prefetch: (params) => {
      queryClient.prefetchQuery({
        queryKey: [DOCUMENTS_KEY, 'search', params],
        queryFn: () => documentApi.search(params).then((res) => res.data),
      });
    },
  };
}
