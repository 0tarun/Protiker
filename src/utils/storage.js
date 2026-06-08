/**
 * Centralized localStorage manager for Protiker.
 * All storage keys in one place. Never use
 * localStorage directly anywhere else.
 */

const KEYS = {
  JWT           : 'protiker_jwt',
  USER          : 'protiker_user',
  SESSION_TOKEN : 'protiker_session_token',
  INTENDED_PATH : 'protiker_intended_path',
  DOC_SESSION   : 'protiker_doc_session',
  LANGUAGE      : 'protiker_language'
}

/**
 * Get or create the anonymous session token.
 * Always returns a valid UUID string.
 * Never returns null.
 */
export const getSessionToken = () => {
  let token = localStorage.getItem(KEYS.SESSION_TOKEN)
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem(KEYS.SESSION_TOKEN, token)
  }
  return token
}

/**
 * Save JWT and user object after successful auth.
 */
export const saveAuth = (jwt, user) => {
  localStorage.setItem(KEYS.JWT, jwt)
  localStorage.setItem(KEYS.USER, JSON.stringify(user))
}

/**
 * Get stored JWT. Returns null if not found.
 */
export const getJwt = () =>
  localStorage.getItem(KEYS.JWT)

/**
 * Get stored user object. Returns null if not found.
 */
export const getStoredUser = () => {
  const raw = localStorage.getItem(KEYS.USER)
  try { return raw ? JSON.parse(raw) : null }
  catch { return null }
}

/**
 * Clear only auth data. Keep session_token so
 * anonymous chat history is preserved.
 */
export const clearAuth = () => {
  localStorage.removeItem(KEYS.JWT)
  localStorage.removeItem(KEYS.USER)
}

/**
 * Save the path the user was trying to reach
 * before being redirected to login.
 */
export const saveIntendedPath = (path) =>
  localStorage.setItem(KEYS.INTENDED_PATH, path)

/**
 * Get and immediately clear the intended path.
 * Returns '/chat' as default fallback.
 */
export const consumeIntendedPath = () => {
  const path = localStorage.getItem(KEYS.INTENDED_PATH)
  localStorage.removeItem(KEYS.INTENDED_PATH)
  return path || '/chat'
}

/**
 * Save preferred language.
 */
export const saveLanguage = (lang) =>
  localStorage.setItem(KEYS.LANGUAGE, lang)

export const getLanguage = () =>
  localStorage.getItem(KEYS.LANGUAGE) || 'bn'

export default {
  getSessionToken,
  saveAuth,
  getJwt,
  getStoredUser,
  clearAuth,
  saveIntendedPath,
  consumeIntendedPath,
  saveLanguage,
  getLanguage
}
