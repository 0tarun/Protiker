/**
 * Axios instance for all Protiker API calls.
 * Automatically attaches JWT and session token.
 * Handles 401 silently and 500 with toast.
 */

import axios from 'axios'
import storage from '../utils/storage'

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || import.meta.env?.VITE_APP_API_URL
            || 'http://localhost:8080/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

/* ── REQUEST INTERCEPTOR ── */
api.interceptors.request.use(
  (config) => {
    const jwt = storage.getJwt()
    if (jwt) {
      config.headers['Authorization'] = `Bearer ${jwt}`
    }
    config.headers['X-Session-Token'] =
      storage.getSessionToken()
    return config
  },
  (error) => Promise.reject(error)
)

/* ── RESPONSE INTERCEPTOR ── */
api.interceptors.response.use(
  (response) => response.data,

  (error) => {
    const status = error?.response?.status

    if (status === 401) {
      storage.clearAuth()
      /* Do NOT redirect here — let AuthContext handle it.
         Just reject so the caller can react. */
    }

    if (status >= 500) {
      /* Dispatch a custom event for a global toast.
         The App-level error boundary listens for this. */
      window.dispatchEvent(new CustomEvent('protiker:api-error', {
        detail: {
          message: 'সার্ভারে সমস্যা হয়েছে। পরে চেষ্টা করুন।'
        }
      }))
    }

    return Promise.reject(error)
  }
)

export default api
