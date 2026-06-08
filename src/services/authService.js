/**
 * All authentication API calls.
 * Returns response.data directly (api.js unwraps).
 */

import api from './api'
import storage from '../utils/storage'

/**
 * Login with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<AuthResponse>}
 */
export const login = async (email, password) => {
  const data = await api.post('/auth/login', {
    email,
    password
  })
  return data
}

/**
 * Register a new account.
 * Sends the existing session_token so the backend
 * can link any anonymous chat history to this user.
 * @param {SignupPayload} payload
 * @returns {Promise<AuthResponse>}
 */
export const signup = async (payload) => {
  const data = await api.post('/auth/register', {
    ...payload,
    sessionToken: storage.getSessionToken()
  })
  return data
}

/**
 * Fetch the currently logged-in user.
 * Used on app load to restore session.
 * Throws 401 if JWT is expired or invalid.
 * @returns {Promise<User>}
 */
export const getCurrentUser = async () => {
  const data = await api.get('/auth/me')
  return data
}
