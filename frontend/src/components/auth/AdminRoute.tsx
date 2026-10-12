import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';

function AdminContent({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminContent>{children}</AdminContent>
    </ProtectedRoute>
  );
}
