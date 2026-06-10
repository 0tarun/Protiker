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
import HelpFinderPage from './pages/HelpFinderPage';
import CenterDetailPage from './pages/CenterDetailPage';
import CaseLogPage from './pages/CaseLogPage';
import CaseDetailPage from './pages/CaseDetailPage';
import { CaseLogProvider } from './context/CaseLogContext';
import LibraryHomePage from './pages/LibraryHomePage';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import LibrarySubmitPage from './pages/LibrarySubmitPage';
import LibraryModerationPage from './pages/LibraryModerationPage';
import NewCasePage from './pages/NewCasePage';

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
          <CaseLogProvider>
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
            path="/documents/edit/:id"
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

          {/* Feature 3 — Legal Help Finder */}
          <Route
            path="/help-finder"
            element={
              <ProtectedRoute>
                <HelpFinderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help-finder/:centerId"
            element={
              <ProtectedRoute>
                <CenterDetailPage />
              </ProtectedRoute>
            }
          />
          {/* Feature 4 — Case Log */}
          <Route
            path="/case-log"
            element={
              <ProtectedRoute>
                <CaseLogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/case-log/new"
            element={
              <ProtectedRoute>
                <NewCasePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/case-log/:caseId"
            element={
              <ProtectedRoute>
                <CaseDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Feature 5 — Rights Library */}
          <Route path="/library" element={<LibraryHomePage />} />
          <Route
            path="/library/submit"
            element={
              <ProtectedRoute>
                <LibrarySubmitPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library/moderation"
            element={
              <ProtectedRoute>
                <LibraryModerationPage />
              </ProtectedRoute>
            }
          />
          <Route path="/library/:categorySlug" element={<CategoryPage />} />
          <Route path="/library/:categorySlug/:articleSlug" element={<ArticlePage />} />

          {/* ── 404 FALLBACK ── */}
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
          </CaseLogProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
