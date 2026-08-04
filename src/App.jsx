import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import CreatePostModal from './components/CreatePostModal';

// Views
import AuthPage from './pages/AuthPage';
import FeedPage from './pages/FeedPage';
import SearchPage from './pages/SearchPage';
import ReelsPage from './pages/ReelsPage';
import DirectPage from './pages/DirectPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import NotificationPage from './pages/NotificationPage';
import AkakTishMain from './pages/AkakTishMain';

function ProtectedLayout({ children }) {
  const { currentUser } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createPostType, setCreatePostType] = useState('photo');
  const location = useLocation();

  useEffect(() => {
    const handleOpenModal = (e) => {
      setCreatePostType(e.detail?.type || 'photo');
      setIsCreateOpen(true);
    };

    window.addEventListener('open_create_modal', handleOpenModal);
    return () => window.removeEventListener('open_create_modal', handleOpenModal);
  }, []);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Adjust padding depending on if we are in Direct chat page (which fits fully in viewport)
  const isDirectChat = location.pathname.startsWith('/direct');

  const handleOpenGeneralCreate = () => {
    setCreatePostType('photo');
    setIsCreateOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-theme-lightBg dark:bg-theme-darkBg text-theme-lightText dark:text-theme-darkText transition-colors duration-200">
      
      {/* Navigation Bars */}
      <Navigation onCreateClick={handleOpenGeneralCreate} />

      {/* Main Content Area */}
      <main className={`flex-1 pt-14 md:pt-0 pb-16 md:pb-0 md:pl-64 ${
        isDirectChat ? 'h-[calc(100vh-3.5rem)] md:h-screen overflow-hidden' : ''
      }`}>
        <div className={isDirectChat ? 'w-full h-full' : 'py-2'}>
          {children}
        </div>
      </main>

      {/* Shared Create Dialog Modal */}
      {isCreateOpen && (
        <CreatePostModal 
          isOpen={isCreateOpen} 
          initialPostType={createPostType}
          onClose={() => setIsCreateOpen(false)} 
        />
      )}
    </div>
  );
}

function MainRoutes() {
  const { currentUser } = useAuth();
  
  return (
    <Routes>
      {/* Auth Route */}
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to="/" replace /> : <AuthPage />} 
      />

      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedLayout>
            <FeedPage />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/search" 
        element={
          <ProtectedLayout>
            <SearchPage />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/reels" 
        element={
          <ProtectedLayout>
            <ReelsPage />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/direct" 
        element={
          <ProtectedLayout>
            <DirectPage />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/profile/:id" 
        element={
          <ProtectedLayout>
            <ProfilePage />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedLayout>
            <SettingsPage />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedLayout>
            <AdminPage />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <ProtectedLayout>
            <NotificationPage />
          </ProtectedLayout>
        } 
      />

      <Route 
        path="/akaktish/*" 
        element={<AkakTishMain />} 
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white text-center">
          <div className="max-w-md bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h2 className="text-xl font-bold mb-2">Произошла ошибка интерфейса</h2>
            <p className="text-xs text-slate-400 mb-6">
              {this.state.error?.toString() || 'Ошибка загрузки компонента'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.hash = '#/';
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Перезагрузить приложение
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <MainRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

