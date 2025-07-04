import React, { useEffect, useRef } from 'react';

function RelatoriosPage() {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // 1. Crie o script BASE primeiro
    const baseScript = document.createElement('script');
    baseScript.src = 'https://cdn.anychart.com/releases/8.13.0/js/anychart-base.min.js';
    baseScript.async = true;

    // 2. QUANDO O SCRIPT BASE CARREGAR, carregue o script de PIZZA
    baseScript.onload = () => {
  

      const pieScript = document.createElement('script');
      pieScript.src = 'https://cdn.anychart.com/releases/8.13.0/js/anychart-pie.min.js';
      pieScript.async = true;

      // 3. QUANDO O SCRIPT DE PIZZA CARREGAR, crie o gráfico
      pieScript.onload = () => {
        
        if (window.anychart && chartContainerRef.current && !chartInstanceRef.current) {
            // Garante que o código só rode se o container existir
            anychart.onDocumentReady(function () {
                const data = [
                  { x: "Barba", value: 25 },
                  { x: "Cabelo", value: 45 },
                  { x: "Fardamento", value: 15 },
                  { x: "Númerica", value: 15 }
                ];  
    
                const chart = anychart.pie(data);
                chart.title("Relatorio NPCCAL");
                chart.container(chartContainerRef.current);

                chart.draw();
    
                chartInstanceRef.current = chart;
            });
        }
      };
      
      document.body.appendChild(pieScript);
    };

    // Adiciona o script BASE ao corpo do documento para iniciar o processo
    document.body.appendChild(baseScript);

    // Função de limpeza para remover os dois scripts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
      // Remove os scripts pelo seletor de atributo para garantir
      document.querySelectorAll('script[src*="anychart"]').forEach(e => e.remove());
    };
  }, []);

  return (
    <div>
      <h2>Relatório Page</h2>
      <p>Abaixo está um exemplo de gráfico de pizza carregado de uma biblioteca externa.</p>
      <div 
        ref={chartContainerRef} 
        id="chart-container" 
        style={{ width: '100%', height: '500px', marginTop: '20px' }}
      ></div>
    </div>
  );
}

export default RelatoriosPage;