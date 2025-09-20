import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import EnhancedLessonView from './pages/EnhancedLessonView';
import ModulesView from './pages/ModulesView';
import EcoChallengeView from './pages/EcoChallengeView';
import QuizView from './pages/QuizView';
import ChallengeView from './pages/ChallengeView';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'student' | 'teacher' }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to={user.role === 'student' ? '/dashboard' : '/teacher'} />;
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute role="student">
              <ModulesView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/lesson/:moduleId/:lessonId" 
          element={
            <ProtectedRoute role="student">
              <EnhancedLessonView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quiz/:moduleId/:lessonId" 
          element={
            <ProtectedRoute role="student">
              <QuizView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/eco-challenge/:lessonId" 
          element={
            <ProtectedRoute role="student">
              <EcoChallengeView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/challenge/:challengeId" 
          element={
            <ProtectedRoute>
              <ChallengeView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leaderboard" 
          element={
            <ProtectedRoute role="student">
              <Leaderboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <AppRoutes />
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;