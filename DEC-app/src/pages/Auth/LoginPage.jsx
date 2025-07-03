import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';

// Importe suas imagens
import Logo1 from '../../assets/de.png';
import Logo2 from '../../assets/bmrs.png';
import Logo3 from '../../assets/esfespoa.png';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      login(token, user);

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
          navigate('/');
      }
    } catch (err) {
      setError('Usuário ou senha inválidos. Tente novamente.');
      console.error('Erro de login:', err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      backgroundColor: '#f0f2f5',
      overflowX: 'hidden'
    }}>
      {/* Barra Superior o */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: '10px 0',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <img src={Logo1} alt="DE" style={{ height: '50px', maxWidth: '30%', objectFit: 'contain' }} />
        <img src={Logo2} alt="BMRS" style={{ height: '50px', maxWidth: '30%', objectFit: 'contain' }} />
        <img src={Logo3} alt="ESFESPOA" style={{ height: '50px', maxWidth: '30%', objectFit: 'contain' }} />
      </div>

      {/* Container de Login */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            margin: '0 0 25px 0',
            color: '#333',
            fontSize: '24px'
          }}>Login no Sistema Npccal</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#555'
              }}>Usuário:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '25px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#555'
              }}>Senha:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

            <button
              type="submit"
              style={{
                width: '20%',
                padding: '05px',
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#40a9ff'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#1890ff'}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;