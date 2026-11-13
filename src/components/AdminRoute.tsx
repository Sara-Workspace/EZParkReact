import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: ReactNode;
}

function AdminRoute({ children }: AdminRouteProps) {
  const token = localStorage.getItem('token');
  const isAdmin = JSON.parse(localStorage.getItem('isAdmin') || 'false') as boolean;
  const role = localStorage.getItem('role');

  if (!token || (!isAdmin && role !== 'Admin')) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default AdminRoute;