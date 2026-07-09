import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './views/Login';
import Register from './views/Register';
import PatientDashboard from './views/PatientDashboard';
import DoctorDashboard from './views/DoctorDashboard';
import AdminDashboard from './views/AdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Loading MEDCURE...</h3>
      </div>
    );
  }

  if (!token || !user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role.toUpperCase())) {
    if (user.role.toUpperCase() === 'PATIENT') return <Navigate to="/patient" replace />;
    if (user.role.toUpperCase() === 'DOCTOR')  return <Navigate to="/doctor"  replace />;
    if (user.role.toUpperCase() === 'ADMIN')   return <Navigate to="/admin"   replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

const HomeRedirect = () => {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role.toUpperCase() === 'PATIENT') return <Navigate to="/patient" replace />;
  if (user.role.toUpperCase() === 'DOCTOR')  return <Navigate to="/doctor"  replace />;
  if (user.role.toUpperCase() === 'ADMIN')   return <Navigate to="/admin"   replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/patient" element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />

          <Route path="/doctor" element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/"  element={<HomeRedirect />} />
          <Route path="*"  element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
