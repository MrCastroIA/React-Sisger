// src/pages/Aluno/AlunoDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Para links internos
import { useAuth } from '../../contexts/AuthContext'; // Se precisar exibir o nome do aluno

function AlunoDashboard() {
  const { user } = useAuth(); // Para acessar os dados do usuário logado

  return (
    <div>
      <h1 style={{ color: '#0056b3' }}>Bem-vindo(a) ao Dashboard! { ''}</h1>
      <p>Esta é a sua área principal. Aqui você pode verificar seu desempenho e informações importantes.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginTop: '30px' }}>
        {/* Card para Punições */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3>Minhas Punições</h3>
          <p>Visualize suas Npccal e o status de seus recursos.</p>
          <Link to="/aluno/punicoes" style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Ver Punições
          </Link>
        </div>

        {/* Card para Faltas */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3>Acompanhar Faltas</h3>
          <p>Veja seu histórico de faltas e presenças em aulas.</p>
          <Link to="/aluno/faltas" style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Ver Faltas
          </Link>
        </div>

        {/* Card para Elogios */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3>Meus Elogios</h3>
          <p>Confira os elogios que você recebeu.</p>
          <Link to="/aluno/elogios" style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Ver Elogios
          </Link>
        </div>

        {/* Card para Quadro de Aulas */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3>Quadro de Aulas</h3>
          <p>Acesse seu horário e informações sobre as aulas.</p>
          <Link to="/aluno/horarios" style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#ffc107', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Ver Horários
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AlunoDashboard;