// src/pages/Aluno/AlunoDashboard.jsx
import React from 'react';

function AtestadosPage() { // Note que a função é declarada
  return (
    <div>
      <h1 style={{ color: '#0056b3' }}>Dashboard do Aluno</h1>
      <p>Bem-vindo à sua área, Aluno! Aqui você pode acompanhar suas punições, faltas e elogios.</p>
      {/* Você pode adicionar mais conteúdo aqui */}
    </div>
  );
}

export default AtestadosPage; // ESSA LINHA É CRÍTICA! Ela exporta o componente como 'default'