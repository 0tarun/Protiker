import { useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import PublicRoute from './components/routing/PublicRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import GlobalErrorToast from './components/common/GlobalErrorToast';
import LeftPanel from './components/layout/LeftPanel';
import RightPanel from './components/layout/RightPanel';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import NewDocumentPage from './pages/NewDocumentPage';
import DocumentFormPage from './pages/DocumentFormPage';
import DocumentDetailPage from './pages/DocumentDetailPage';

function ChatApp() {
  const inputRef = useRef(null);

  const handleChipClick = useCallback((text) => {
    inputRef.current?.typeAndSend(text);
  }, []);

  return (
    <ChatProvider>
      <div className="app-layout">
        <LeftPanel onChipClick={handleChipClick} />
        <RightPanel inputRef={inputRef} />
      </div>
    </ChatProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/*
          AuthProvider must be INSIDE BrowserRouter
          because it uses useNavigate internally.
        */}
        <AuthProvider>
          <GlobalErrorToast />
          <Routes>
          {/* ── ROOT → CHAT ── */}
          <Route path="/" element={<Navigate to="/chat" replace />} />

          {/* ── PUBLIC: accessible by anyone ── */}
          <Route path="/chat/*" element={<ChatApp />} />

          {/* ── AUTH: only for non-authenticated ── */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          {/* ── PROTECTED: require JWT ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Feature 2 — Smart Document Automator */}
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <DocumentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/new"
            element={
              <ProtectedRoute>
                <NewDocumentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/create/:templateSlug"
            element={
              <ProtectedRoute>
                <DocumentFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/:id"
            element={
              <ProtectedRoute>
                <DocumentDetailPage />
              </ProtectedRoute>
            }
          />

          {/* ── 404 FALLBACK ── */}
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
