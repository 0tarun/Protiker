/**
 * Wraps routes that require authentication.
 * If not authenticated: saves intended path,
 * redirects to /login.
 * While loading: shows full-screen spinner.
 */

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import storage from '../../utils/storage'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <ProtikerLoadingScreen />
  }

  if (!isAuthenticated) {
    /* Save where they were trying to go */
    storage.saveIntendedPath(location.pathname)
    return <Navigate to="/login" replace />
  }

  return children
}

/**
 * Full-screen loading spinner shown while
 * AuthContext checks the stored JWT on mount.
 */
const ProtikerLoadingScreen = () => (
  <div style={{
    display        : 'flex',
    flexDirection  : 'column',
    alignItems     : 'center',
    justifyContent : 'center',
    height         : '100vh',
    background     : '#F4F6F8',
    gap            : '20px'
  }}>
    <div style={{
      width          : '56px',
      height         : '56px',
      background     : '#E1F5EE',
      borderRadius   : '16px',
      display        : 'flex',
      alignItems     : 'center',
      justifyContent : 'center',
      fontSize       : '22px',
      fontFamily     : "'Hind Siliguri', sans-serif",
      fontWeight     : 600,
      color          : '#0F6E56'
    }}>
      প্রতি
    </div>

    <div style={{
      width          : '32px',
      height         : '32px',
      border         : '3px solid #E1F5EE',
      borderTopColor : '#1D9E75',
      borderRadius   : '50%',
      animation      : 'protikerSpin 0.7s linear infinite'
    }}/>

    <style>{`
      @keyframes protikerSpin {
        to { transform: rotate(360deg); }
      }
    `}</style>

    <p style={{
      fontFamily : "'Hind Siliguri', sans-serif",
      fontSize   : '14px',
      color      : '#888780',
      margin     : 0
    }}>
      লোড হচ্ছে...
    </p>
  </div>
)

export default ProtectedRoute
