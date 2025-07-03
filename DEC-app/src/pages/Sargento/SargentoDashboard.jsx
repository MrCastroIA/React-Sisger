// src/pages/Sargento/SargentoDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function SargentoDashboard() {
  const { user } = useAuth(); // Para acessar os dados do usuário logado

  return (
    <div>
      <h1 style={{ color: '#0056b3' }}>Bem-vindo(a) ao Dashboard! {''}</h1>
      <p>Esta é a sua área principal. Aqui você pode gerenciar Npccal, justificar ocorrências, fazer elogios e acessar relatórios.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <h3>Lançar Npccal</h3>
          <p>Registre novas notas disciplinares para os alunos.</p>
          <Link to="/sargento/lancarnpccal" style={{ display: 'inline-block', marginTop: '10px', padding: '8px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Ir para</Link>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <h3>Visualizar Relatórios</h3>
          <p>Acesse relatórios e gráficos sobre o comportamento dos alunos.</p>
          <Link to="/sargento/relatorios" style={{ display: 'inline-block', marginTop: '10px', padding: '8px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Ir para</Link>
        </div>
        {/* Adicione mais cards para outras funcionalidades */}
      </div>
    </div>
  );
}

export default SargentoDashboard; // 