// src/pages/Aluno/AlunoDashboard.jsx
import React from 'react';

function InstrutorDashboard() { // Note que a função é declarada
  return (
    <div>
      <h1 style={{ color: '#0056b3' }}>Dashboard</h1>
      <p>Bem-vindo à sua área, Instrutor! Aqui você pode gerencia suas turmas.</p>
      {/* Você pode adicionar mais conteúdo aqui */}
    </div>
  );
}

export default InstrutorDashboard; // ESSA LINHA É CRÍTICA! Ela exporta o componente como 'default'