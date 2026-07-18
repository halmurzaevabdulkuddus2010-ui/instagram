// App.jsx - Main Application shell, router setup, and state providers
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

function ProtectedLayout({ children }) {
  const { currentUser } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Adjust padding depending on if we are in Direct chat page (which fits fully in viewport)
  const isDirectChat = location.pathname.startsWith('/direct');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-theme-lightBg dark:bg-theme-darkBg text-theme-lightText dark:text-theme-darkText transition-colors duration-200">
      
      {/* Navigation Bars */}
      <Navigation onCreateClick={() => setIsCreateOpen(true)} />

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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <MainRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
