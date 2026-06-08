/**
 * Listens for 'protiker:api-error' events dispatched
 * by the Axios interceptor on 5xx errors.
 * Shows a dismissible Bengali error toast.
 */

import React, { useState, useEffect } from 'react'

const GlobalErrorToast = () => {
  const [message, setMessage] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      setMessage(e.detail.message)
      setVisible(true)
      setTimeout(() => setVisible(false), 4000)
    }
    window.addEventListener('protiker:api-error', handler)
    return () =>
      window.removeEventListener('protiker:api-error', handler)
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position     : 'fixed',
      top          : '24px',
      right        : '24px',
      zIndex       : 9999,
      background   : '#FCEBEB',
      border       : '1px solid rgba(226,75,74,0.25)',
      borderRadius : '12px',
      padding      : '14px 20px',
      display      : 'flex',
      alignItems   : 'center',
      gap          : '12px',
      boxShadow    : '0 8px 24px rgba(0,0,0,0.12)',
      maxWidth     : '360px',
      animation    : 'toastIn 300ms ease-out'
    }}>
      <span style={{ fontSize: '18px' }}>⚠️</span>
      <p style={{
        fontFamily : "'Hind Siliguri', sans-serif",
        fontSize   : '14px',
        color      : '#A32D2D',
        margin     : 0,
        flex       : 1,
        lineHeight : 1.55
      }}>
        {message}
      </p>
      <button
        onClick={() => setVisible(false)}
        style={{
          background : 'none',
          border     : 'none',
          cursor     : 'pointer',
          color      : '#A32D2D',
          fontSize   : '18px',
          lineHeight : 1,
          padding    : 0
        }}
        aria-label="বন্ধ করুন"
      >
        ×
      </button>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

export default GlobalErrorToast
