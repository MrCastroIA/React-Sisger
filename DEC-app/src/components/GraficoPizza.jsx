import React, { useEffect, useRef } from 'react';

// O componente agora é focado apenas em renderizar o gráfico
function GraficoPizza() {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // A lógica de carregamento dos scripts e criação do gráfico permanece a mesma...
    const baseScript = document.createElement('script');
    baseScript.src = 'https://cdn.anychart.com/releases/8.13.0/js/anychart-base.min.js';
    baseScript.onload = () => {
      const pieScript = document.createElement('script');
      pieScript.src = 'https://cdn.anychart.com/releases/8.13.0/js/anychart-pie.min.js';
      pieScript.onload = () => {
        if (window.anychart && chartContainerRef.current) {
          anychart.onDocumentReady(function () {
            if (chartInstanceRef.current) return; // Previne recriação
            const chart = anychart.pie([
              { x: "Cabelo", value: 25 }, { x: "Barba", value: 45 },
              { x: "Fardamento", value: 15 }, { x: "Pezinho", value: 15 }
            ]);
            chart.title("Relatório de NPCCAL");
            chart.background().fill("#FFFFFF");
            chart.container(chartContainerRef.current);
            chart.draw();
            chartInstanceRef.current = chart;
          });
        }
      };
      document.body.appendChild(pieScript);
    };
    document.body.appendChild(baseScript);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
      document.querySelectorAll('script[src*="anychart"]').forEach(e => e.remove());
    };
  }, []);

  // O retorno agora é apenas o container do gráfico
  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}></div>
  );
}

export default GraficoPizza;