// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api'; // Sua instância do Axios

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Armazena os dados do usuário logado
  const [token, setToken] = useState(localStorage.getItem('authToken')); // Pega o token do localStorage
  const [loading, setLoading] = useState(true); // Para indicar que a autenticação está sendo verificada

  // Efeito para verificar o token e carregar o usuário ao iniciar a aplicação
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Chame um endpoint no backend para validar o token e obter os dados do usuário
          const response = await api.get('/auth/me'); // Exemplo: seu backend deve ter essa rota
          setUser(response.data.user);
        } catch (error) {
          console.error('Erro ao validar token ou carregar usuário:', error);
          localStorage.removeItem('authToken'); // Token inválido, remove
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false); // Concluiu a verificação inicial
    };
    loadUser();
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization']; // Remove o header de auth
  };

  // O valor que será disponibilizado para os componentes filhos
  const authContextValue = {
    user,
    token,
    isAuthenticated: !!token && !!user, // Verifica se há token e user para considerar autenticado
    loading, // Útil para mostrar um spinner enquanto verifica a autenticação inicial
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};