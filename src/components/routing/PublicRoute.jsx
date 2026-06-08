/**
 * Wraps routes that should NOT be accessible
 * when already authenticated (login, signup).
 * If authenticated: redirects to /chat.
 */

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  /* Wait for auth check before deciding */
  if (isLoading) return null

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />
  }

  return children
}

export default PublicRoute
