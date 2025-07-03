// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api'; // Sua instância do Axios

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Esta rota /auth/me DEVE retornar { user: { id, username, profile, nome } }
          const response = await api.get('/auth/me'); 
          setUser(response.data.user);
        } catch (error) {
          console.error('Erro ao validar token ou carregar usuário (provavelmente token inválido/expirado):', error);
          localStorage.removeItem('authToken'); // Token inválido, remove
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false); // ESSENCIAL: Conclui a verificação inicial, permitindo a renderização
    };
    loadUser();
  }, [token]); // Dependência em [token] é importante para revalidar se o token mudar

  const login = (newToken, userData) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setUser(userData);
    setLoading(false); // Também define loading como false após o login
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    setLoading(false);
  };

  const authContextValue = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};