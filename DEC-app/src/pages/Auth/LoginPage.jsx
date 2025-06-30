import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importe sua instância do Axios configurada para a API
import api from '../../api/api'; // Você criará este arquivo depois
import { useAuth } from '../../contexts/AuthContext'; // Você criará este Context

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Função de login do seu AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores

    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data; // Assumindo que a API retorna token e dados do usuário

      login(token, user); // Armazena o token e o usuário no AuthContext/localStorage

      // Redireciona com base no perfil do usuário
      switch (user.profile) {
        case 'Sargento':
          navigate('/sargento');
          break;
        case 'Aluno':
          navigate('/aluno');
          break;
        case 'Instrutor':
          navigate('/instrutor');
          break;
        case 'SENS':
          navigate('/sens');
          break;
        default:
          navigate('/'); // Redireciona para uma página padrão ou de erro
      }
    } catch (err) {
      setError('Usuário ou senha inválidos. Tente novamente.');
      console.error('Erro de login:', err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login no Sistema Npccal</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default LoginPage;