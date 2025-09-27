import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import EventPage from './pages/EventPage';
import EditEventPage from './pages/EditEventPage';
import AddEventPage from './pages/AddEventPage';
import GalleryPage from './pages/GalleryPage';
import StoriesPage from './pages/StoriesPage';
import AddStoryPage from './pages/AddStoryPage';
import StoryPage from './pages/StoryPage';
import NotFoundPage from './pages/NotFoundPage';
import TestPage from './pages/TestPage';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/layout/Layout';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            
            <Route path="timeline" element={
              <ProtectedRoute>
                <TimelinePage />
              </ProtectedRoute>
            } />
            
            <Route path="event/new" element={
              <ProtectedRoute>
                <AddEventPage />
              </ProtectedRoute>
            } />
            
            <Route path="event/:id" element={
              <ProtectedRoute>
                <EventPage />
              </ProtectedRoute>
            } />

            <Route path="event/:id/edit" element={
              <ProtectedRoute>
                <EditEventPage />
              </ProtectedRoute>
            } />
            
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            <Route path="gallery" element={
              <ProtectedRoute>
                <GalleryPage />
              </ProtectedRoute>
            } />

            <Route path="stories" element={
              <ProtectedRoute>
                <StoriesPage />
              </ProtectedRoute>
            } />

            <Route path="stories/new" element={
              <ProtectedRoute>
                <AddStoryPage />
              </ProtectedRoute>
            } />

            <Route path="stories/:id" element={
              <ProtectedRoute>
                <StoryPage />
              </ProtectedRoute>
            } />
            
            <Route path="admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="test" element={<TestPage />} />
            
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;