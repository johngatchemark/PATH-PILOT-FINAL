import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Analyzing from './pages/Analyzing';
import CareerResults from './pages/CareerResults';
import Settings from './pages/Settings';
import SavedPaths from './pages/SavedPaths';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Protected Routes */}

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analyzing" 
        element={
          <ProtectedRoute>
            <Analyzing />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/career-paths" 
        element={
          <ProtectedRoute>
            <CareerResults />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/saved-paths" 
        element={
          <ProtectedRoute>
            <SavedPaths />
          </ProtectedRoute>
        } 
      />

      {/* Fallback */}
      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

