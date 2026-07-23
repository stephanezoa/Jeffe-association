import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredToken } from '../../lib/auth';

interface RequireAuthProps {
  children: React.ReactNode;
}

/** Renvoie vers la page de connexion tant qu'aucun jeton n'est stocké. */
export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const location = useLocation();

  if (!getStoredToken()) {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
