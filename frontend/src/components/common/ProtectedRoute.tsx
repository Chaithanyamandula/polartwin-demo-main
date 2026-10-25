import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface Props {
  children: React.ReactNode;
  minRole?: 'admin' | 'operator' | 'viewer';
}

const ROLE_LEVELS = {
  admin: 3,
  operator: 2,
  viewer: 1
};

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};
