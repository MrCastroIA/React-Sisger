// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Importe o hook useAuth

const PrivateRoute = ({ allowedProfiles, children }) => {
  const { isAuthenticated, user, loading } = useAuth(); // Obtenha o estado de autenticação do contexto

  // Se ainda estiver carregando (verificando token inicial), você pode renderizar um spinner ou null
  if (loading) {
    return <div>Carregando autenticação...</div>; // Ou um componente de carregamento
  }

  if (!isAuthenticated) {
    // Não autenticado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Obtenha o perfil do usuário logado
  const currentProfile = user?.profile; // Use optional chaining para evitar erro se user for null/undefined

  if (allowedProfiles && !allowedProfiles.includes(currentProfile)) {
    // Autenticado, mas não tem permissão para esta rota, redireciona para uma página de acesso negado
    // ou para o dashboard padrão do usuário logado (se preferir)
    // Para o seu caso, vou redirecionar para a rota raiz do perfil do usuário, se ele estiver logado.
    // Isso evita que um Aluno logado tente acessar uma rota de Sargento e caia em /acesso-negado.
    switch (currentProfile) {
        case 'Sargento': return <Navigate to="/sargento" replace />;
        case 'Aluno': return <Navigate to="/aluno" replace />;
        case 'Instrutor': return <Navigate to="/instrutor" replace />;
        case 'SENS': return <Navigate to="/sens" replace />;
        default: return <Navigate to="/acesso-negado" replace />; // Fallback
    }
  }

  // Se autenticado e autorizado, renderiza o conteúdo da rota
  return children ? children : <Outlet />;
};

export default PrivateRoute;