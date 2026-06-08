/**
 * Global authentication state for Protiker.
 *
 * Provides:
 *   user           — current user object or null
 *   isAuthenticated— boolean
 *   isLoading      — true during initial session restore
 *   login()        — authenticate and store JWT
 *   signup()       — register and store JWT
 *   logout()       — clear auth and go to /chat
 *
 * On mount: tries to restore session from localStorage.
 * If JWT exists but /me returns 401: clears silently.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback
} from 'react'
import { useNavigate } from 'react-router-dom'
import storage from '../utils/storage'
import * as authService from '../services/authService'

/* ── STATE ── */
const initialState = {
  user          : null,
  isAuthenticated: false,
  isLoading     : true   /* true until first /me check done */
}

/* ── REDUCER ── */
const authReducer = (state, action) => {
  switch (action.type) {

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user           : action.payload,
        isAuthenticated: true,
        isLoading      : false
      }

    case 'AUTH_FAILURE':
    case 'LOGOUT':
      return {
        ...state,
        user           : null,
        isAuthenticated: false,
        isLoading      : false
      }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    default:
      return state
  }
}

/* ── CONTEXT ── */
const AuthContext = createContext(null)

/* ── PROVIDER ── */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    authReducer,
    initialState
  )
  const navigate = useNavigate()

  /* ── RESTORE SESSION ON APP LOAD ── */
  useEffect(() => {
    const restoreSession = async () => {
      const jwt = storage.getJwt()

      if (!jwt) {
        /* No JWT — anonymous mode */
        dispatch({ type: 'AUTH_FAILURE' })
        return
      }

      try {
        /* JWT exists — verify it with backend */
        const response = await authService.getCurrentUser()
        const user = response?.data || response

        dispatch({ type: 'AUTH_SUCCESS', payload: user })
      } catch (error) {
        /* JWT invalid or expired — clear silently */
        storage.clearAuth()
        dispatch({ type: 'AUTH_FAILURE' })
      }
    }

    restoreSession()
  }, [])

  /* ── LOGIN ── */
  const login = useCallback(async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const response = await authService.login(
        email, password
      )
      const { sessionToken, ...user } = response?.data || response

      storage.saveAuth(sessionToken, user)
      dispatch({ type: 'AUTH_SUCCESS', payload: user })

      /* Go to intended path or /chat */
      const destination = storage.consumeIntendedPath()
      navigate(destination, { replace: true })

      return { success: true }

    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      const message = error?.response?.data?.message
        || 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।'
      return { success: false, message }
    }
  }, [navigate])

  /* ── SIGNUP ── */
  const signup = useCallback(async (payload) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const response = await authService.signup(payload)
      const { sessionToken, ...user } = response?.data || response

      storage.saveAuth(sessionToken, user)
      dispatch({ type: 'AUTH_SUCCESS', payload: user })

      /* Signup always goes to /chat */
      navigate('/chat', { replace: true })

      return { success: true }

    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      const message = error?.response?.data?.message
        || 'অ্যাকাউন্ট তৈরি করা সম্ভব হয়নি।'
      return { success: false, message }
    }
  }, [navigate])

  /* ── LOGOUT ── */
  const logout = useCallback(() => {
    storage.clearAuth()
    dispatch({ type: 'LOGOUT' })
    navigate('/chat', { replace: true })
  }, [navigate])

  /* ── ANONYMOUS CONTINUE ── */
  const continueAnonymously = useCallback(() => {
    /* Ensure session token exists */
    storage.getSessionToken()
    navigate('/chat', { replace: true })
  }, [navigate])

  const value = {
    user            : state.user,
    isAuthenticated : state.isAuthenticated,
    isLoading       : state.isLoading,
    login,
    signup,
    logout,
    continueAnonymously
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/* ── HOOK ── */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    )
  }
  return context
}

export default AuthContext
