import api from './api';

const documentService = {
  /**
   * Fetch all document categories
   * @returns {Promise<Object>} Response object
   */
  getCategories: async () => {
    const response = await api.get('/documents/categories');
    return response;
  },

  /**
   * Fetch templates optionally filtered by category
   * @param {string} [category] - Optional category name
   * @returns {Promise<Object>} Response object
   */
  getTemplates: async (category = '') => {
    const url = category && category !== 'সব ধরন'
      ? `/documents/templates?category=${encodeURIComponent(category)}`
      : '/documents/templates';
    const response = await api.get(url);
    return response;
  },

  /**
   * Fetch full template details including fields and guide
   * @param {string} slug - Template slug
   * @returns {Promise<Object>} Response object
   */
  getTemplateDetails: async (slug) => {
    const response = await api.get(`/documents/templates/${slug}`);
    return response;
  },

  /**
   * Fetch user's documents
   * @param {string} [status] - Optional status filter (all, draft, generated, downloaded, submitted)
   * @returns {Promise<Object>} Response object
   */
  getUserDocuments: async (status = 'all') => {
    const url = status && status !== 'all'
      ? `/documents?status=${encodeURIComponent(status)}`
      : '/documents';
    const response = await api.get(url);
    return response;
  },

  /**
   * Fetch a single document's details
   * @param {number} id - Document ID
   * @returns {Promise<Object>} Response object
   */
  getDocumentDetails: async (id) => {
    const response = await api.get(`/documents/${id}`);
    return response;
  },

  /**
   * Create a new document (draft or final)
   * @param {Object} payload 
   * @param {string} payload.templateSlug
   * @param {Object} payload.fieldValues
   * @param {number} [payload.chatSessionId]
   * @param {boolean} [payload.saveAsDraft]
   * @param {string} [payload.generationMethod]
   * @param {string} [payload.language]
   * @returns {Promise<Object>} The created document response
   */
  createDocument: async (payload) => {
    const response = await api.post('/documents', payload);
    return response;
  },

  /**
   * Update an existing document
   * @param {number} id - Document ID
   * @param {Object} payload - Same as createDocument payload
   * @returns {Promise<Object>} The updated document response
   */
  updateDocument: async (id, payload) => {
    const response = await api.put(`/documents/${id}`, payload);
    return response;
  },

  /**
   * Update a document's status
   * @param {number} id - Document ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated document response
   */
  updateStatus: async (id, status) => {
    const response = await api.patch(`/documents/${id}/status?status=${encodeURIComponent(status)}`);
    return response;
  },

  /**
   * Download the document as a PDF blob
   * @param {number} id - Document ID
   * @returns {Promise<Blob>} PDF Blob
   */
  downloadDocument: async (id) => {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob'
    });
    return response;
  },

  /**
   * Delete a document
   * @param {number} id - Document ID
   * @returns {Promise<Object>} Response object
   */
  deleteDocument: async (id) => {
    const response = await api.delete(`/documents/${id}`);
    return response;
  }
};

export default documentService;
