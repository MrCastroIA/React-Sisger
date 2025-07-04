import React, { useState } from 'react'; // Garanta que useState está sendo importado

// 1. IMPORTE OS COMPONENTES DOS GRÁFICOS
import GraficoPizza from '../../components/GraficoPizza'; 
import MapaBrasil from '../../components/MapaBrasil';     

// 2. IMPORTE O CSS PARA O ESTILO DAS ABAS
import './RelatorioPage.css'; 

// Este é o seu componente de página de relatório já existente
function RelatorioPage() {
  
  // 3. ADICIONE O ESTADO PARA CONTROLAR A ABA ATIVA
  const [abaAtiva, setAbaAtiva] = useState('pizza');

  return (
    // Você pode ter um div ou um fragmento principal aqui. Mantenha-o.
    <div>
      {/* Mantenha o título ou outros elementos que você já tem na página */}
      <h2>Página de Relatórios</h2>
      <p>Selecione uma das abas abaixo para visualizar o relatório desejado.</p>

      {/* 4. ADICIONE O CONTAINER DO DASHBOARD AQUI DENTRO
        Este é o mesmo código que estava no DashboardPage.js
      */}
      <div className="dashboard-container">
        <div className="tab-nav">
          <div 
            className={`tab-button ${abaAtiva === 'pizza' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('pizza')}
          >
            Relatório de NPCCAL
          </div>
          <div 
            className={`tab-button ${abaAtiva === 'mapa' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('mapa')}
          >
            Mapa de Alunos por estado
          </div>
        </div>

        <div className="chart-content">
          {/* A lógica de renderização condicional permanece a mesma */}
          {abaAtiva === 'pizza' && <GraficoPizza />}
          {abaAtiva === 'mapa' && <MapaBrasil />}
        </div>
      </div>

      {/* Você pode ter outros elementos na sua página aqui embaixo */}

    </div>
  );
}

export default RelatorioPage;