// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, allowedProfiles, currentProfile, children }) => {
  if (!isAuthenticated) {
    // Não autenticado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  if (allowedProfiles && !allowedProfiles.includes(currentProfile)) {
    // Autenticado, mas não tem permissão para esta rota, redireciona para uma página de acesso negado ou dashboard padrão
    return <Navigate to="/acesso-negado" replace />; // Crie esta página
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;