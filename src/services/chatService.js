/**
 * All chat API calls for Feature 1.
 */

import api from './api'

/**
 * Create a new chat session.
 * Works for both anonymous and authenticated users.
 * The session_token is attached automatically by
 * the Axios interceptor.
 * @returns {Promise<{sessionId: string}>}
 */
export const createSession = async () => {
  // Backend doesn't have a create session endpoint, generate a random Long ID
  const newSessionId = Math.floor(Math.random() * 1000000000);
  return { sessionId: newSessionId };
}

/**
 * Send a user message and get Proti's response.
 * @param {string} sessionId
 * @param {string} content
 * @param {"text"|"voice"|"quick_chip"} inputMode
 * @param {"bn"|"en"|"mixed"} language
 * @returns {Promise<ChatMessageResponse>}
 */
export const sendMessage = async (
  sessionId,
  content,
  inputMode = 'text',
  language = 'bn'
) => {
  // Backend requires @RequestParam String question, Long sessionId, Long userId
  const user = JSON.parse(localStorage.getItem('protiker_user') || 'null');
  const userId = user?.id || 0;

  const data = await api.post('/chat/ask', null, {
    params: {
      question: content,
      sessionId,
      userId
    }
  });

  // Backend returns plain string, so data is a string
  return { content: typeof data === 'string' ? data : JSON.stringify(data) };
}

/**
 * Save the current session as a Case Log.
 * Requires authentication (JWT attached by interceptor).
 * @param {string} sessionId
 * @returns {Promise<{saved: boolean}>}
 */
export const saveSession = async (sessionId) => {
  const data = await api.post(
    `/chat/session/${sessionId}/save`
  )
  return data
}

/**
 * Download the PDF summary of a session.
 * Returns a Blob for download.
 * @param {string} sessionId
 * @returns {Promise<Blob>}
 */
export const downloadPdf = async (sessionId) => {
  const response = await api.get(
    `/chat/session/${sessionId}/pdf`,
    { responseType: 'blob' }
  )
  return response
}
