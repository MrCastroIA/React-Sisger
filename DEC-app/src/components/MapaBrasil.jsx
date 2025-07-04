import React, { useEffect, useRef } from 'react';

// Componente focado apenas no mapa
function MapaBrasil() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // A lógica de carregamento dos scripts do mapa permanece a mesma...
    const baseScript = document.createElement('script');
    baseScript.src = 'https://cdn.anychart.com/releases/8.13.0/js/anychart-base.min.js';
    baseScript.onload = () => {
      const mapScript = document.createElement('script');
      mapScript.src = 'https://cdn.anychart.com/releases/8.13.0/js/anychart-map.min.js';
      mapScript.onload = () => {
        const geoDataScript = document.createElement('script');
        geoDataScript.src = 'https://cdn.anychart.com/geodata/latest/countries/brazil/brazil.js';
        geoDataScript.onload = () => {
          if (window.anychart && mapContainerRef.current) {
            anychart.onDocumentReady(function () {
                if (mapInstanceRef.current) return;
                const map = anychart.map();
                map.geoData('anychart.maps.brazil');
                map.title('Mapa de Alunos por Estado');
                var dataSet = anychart.data.set([
                  { id: 'BR.SP', value: 2500, nome: 'São Paulo' }, { id: 'BR.RJ', value: 1850, nome: 'Rio de Janeiro' },
                  { id: 'BR.MG', value: 1700, nome: 'Minas Gerais' }, { id: 'BR.BA', value: 950, nome: 'Bahia' },
                  { id: 'BR.RS', value: 1100, nome: 'Rio Grande do Sul' }, { id: 'BR.PE', value: 800, nome: 'Pernambuco' },
                  { id: 'BR.CE', value: 750, nome: 'Ceará' }, { id: 'BR.MA', value: 1, nome: 'Maranhão' }, 
                ]);
                var series = map.choropleth(dataSet);
                series.tooltip().titleFormat('Estado: {%nome}').format('Qtd de Alunos: {%value}');
                series.colorScale(anychart.scales.linearColor('#deebf7', '#3182bd'));
                series.hovered().fill('#addd8e');
                map.container(mapContainerRef.current);
                map.draw();
                mapInstanceRef.current = map;
            });
          }
        };
        document.body.appendChild(geoDataScript);
      };
      document.body.appendChild(mapScript);
    };
    document.body.appendChild(baseScript);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
        mapInstanceRef.current = null;
      }
      document.querySelectorAll('script[src*="anychart"], script[src*="brazil.js"]').forEach(e => e.remove());
    };
  }, []);

  // Retorna apenas o container do mapa
  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }}></div>
  );
}

export default MapaBrasil;