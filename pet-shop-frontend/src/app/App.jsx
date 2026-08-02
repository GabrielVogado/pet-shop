import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { useAuth } from '../shared/hooks/useAuth';
import { AuthPage } from '../pages/auth/AuthPage';
import { TutorDashboardPage } from '../pages/tutor/TutorDashboardPage';
import { OwnerDashboardPage } from '../pages/owner/OwnerDashboardPage';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center text-ink/60">Carregando...</div>;
  return token ? children : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  const { token, isOwner } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={
        token ? <Navigate to={isOwner ? "/owner" : "/tutor"} replace /> : <AuthPage />
      } />
      <Route path="/tutor/*" element={
        <ProtectedRoute><TutorDashboardPage /></ProtectedRoute>
      } />
      <Route path="/owner/*" element={
        <ProtectedRoute><OwnerDashboardPage /></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
