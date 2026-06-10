import api from './api';

const libraryService = {
  /**
   * Fetch all active legal categories
   */
  getCategories: async () => {
    return api.get('/library/categories');
  },

  /**
   * Fetch a single category by slug
   */
  getCategoryBySlug: async (slug) => {
    return api.get(`/library/categories/${slug}`);
  },

  /**
   * Fetch articles of a category (only APPROVED ones)
   */
  getArticlesByCategory: async (categorySlug) => {
    return api.get(`/library/categories/${categorySlug}/articles`);
  },

  /**
   * Fetch details of a single article (increments view count)
   */
  getArticleDetail: async (categorySlug, articleSlug) => {
    return api.get(`/library/articles/${categorySlug}/${articleSlug}`);
  },

  /**
   * Fetch top most-read articles
   */
  getMostReadArticles: async (limit = 3) => {
    return api.get(`/library/articles/most-read?limit=${limit}`);
  },

  /**
   * Fetch recent articles
   */
  getRecentArticles: async (limit = 5) => {
    return api.get(`/library/articles/recent?limit=${limit}`);
  },

  /**
   * Search library articles and categories
   */
  search: async (query) => {
    return api.get(`/library/search?query=${encodeURIComponent(query)}`);
  },

  /**
   * Submit a helpful / not-helpful vote for an article
   */
  voteArticle: async (id, helpful) => {
    return api.post(`/library/articles/${id}/vote`, { helpful });
  },

  /**
   * Submit a new article for moderation (Draft)
   */
  submitArticle: async (payload) => {
    return api.post('/library/articles/submit', payload);
  },

  /**
   * Fetch submissions created by the logged in user
   */
  getMySubmissions: async () => {
    return api.get('/library/articles/my-submissions');
  },

  /**
   * Fetch articles pending review (requires RESEARCHER role)
   */
  getPendingArticles: async () => {
    return api.get('/library/articles/pending');
  },

  /**
   * Approve or reject an article submission (requires RESEARCHER role)
   */
  reviewArticle: async (id, approve, rejectionReason = '') => {
    return api.post(`/library/articles/${id}/review`, { approve, rejectionReason });
  }
};

export default libraryService;
