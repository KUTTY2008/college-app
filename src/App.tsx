import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { StudentDashboard } from '@/pages/StudentDashboard';
import { StaffDashboard } from '@/pages/StaffDashboard';
import { Profile } from '@/pages/Profile';

const PrivateRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles?: string[]; 
}> = ({ children, allowedRoles }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!currentUser.emailVerified) {
    // Ideally show a verification needed page, but for now redirect to login or show alert
    // The Login page handles the verification check, so redirecting there works
    // but better UX is to allow them to resend. For simplicity:
    return <Navigate to="/login" />; 
  }

  if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) {
    // Redirect to their appropriate dashboard if they try to access unauthorized route
    return <Navigate to={userProfile.role === 'staff' ? '/staff-dashboard' : '/student-dashboard'} />;
  }

  return <Layout>{children}</Layout>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/student-dashboard" 
            element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/staff-dashboard" 
            element={
              <PrivateRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
