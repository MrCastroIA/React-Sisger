import React from 'react';
import { Link } from 'react-router-dom';

function SensDashboard() { // Note que a função é declarada
  return (
    <div>
      <h1 style={{ color: '#0056b3' }}>Dashboard Seção de Ensino</h1>
      <p>Bem-vindo à sua área!</p>
      {/* Você pode adicionar mais conteúdo aqui */}

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginTop: '30px' }}>
        {/* Card para Punições */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3>Organizar quadro de aula</h3>
          <p>Adicionar e remover aulas.</p>
          <Link to="/aluno/punicoes" style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Organizar
          </Link>
        </div>

        {/* Card para Faltas */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3>Adicionar folga/feriado</h3>
          <p>Folga, feriados, recesso</p>
          <Link to="/aluno/faltas" style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Adicionar/Remover
          </Link>
        </div>

        {/* Card para Elogios */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3>Gerenciar instrutores</h3>
          <p>Adicionar e remover instrutores.</p>
          <Link to="/aluno/elogios" style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Gerenciar
          </Link>
        </div>

        {/* Card para Quadro de Aulas 
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3>Quadro de Aulas</h3>
          <p>Acesse seu horário e informações sobre as aulas.</p>
          <Link to="/aluno/horarios" style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#ffc107', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Ver Horários
          </Link>*/}
        </div>
      </div>

  );
}

export default SensDashboard; // ESSA LINHA É CRÍTICA! Ela exporta o componente como 'default'