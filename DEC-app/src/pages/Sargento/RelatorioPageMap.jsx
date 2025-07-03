import React, { useEffect, useRef } from 'react';

function MapaBrasilPage() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // 1. Carrega o script BASE
    const baseScript = document.createElement('script');
    baseScript.src = 'https://cdn.anychart.com/releases/8.13.0/js/anychart-base.min.js';
    baseScript.async = true;

    // 2. QUANDO O BASE CARREGAR, carrega o módulo de MAPA
    baseScript.onload = () => {
      

      const mapScript = document.createElement('script');
      mapScript.src = 'https://cdn.anychart.com/releases/8.13.0/js/anychart-map.min.js';
      mapScript.async = true;

      // 3. QUANDO O MÓDULO DE MAPA CARREGAR, carrega os DADOS GEOGRÁFICOS do Brasil
      mapScript.onload = () => {
        

        const geoDataScript = document.createElement('script');
        geoDataScript.src = 'https://cdn.anychart.com/geodata/latest/countries/brazil/brazil.js';
        geoDataScript.async = true;

        // 4. QUANDO TUDO ESTIVER CARREGADO, desenha o mapa
        geoDataScript.onload = () => {
          console.log("Geodata do Brasil carregado.");

          if (window.anychart && mapContainerRef.current && !mapInstanceRef.current) {
            anychart.onDocumentReady(function () {
              // Cria a instância do mapa
              const map = anychart.map();

              // Define os dados geográficos a serem usados (o que carregamos no brazil.js)
              map.geoData('anychart.maps.brazil');

              // Título do mapa
              map.title('');
              
              // Dados de exemplo para colorir os estados
              // O 'id' corresponde ao código do estado (ex: 'BR.SP' para São Paulo)
              var dataSet = anychart.data.set([
                { 'id': 'BR.SP', 'value': 2 , nome: 'São Paulo'},
                { 'id': 'BR.RJ', 'value': 1 , nome: 'Rio de Janeiro'},
                { 'id': 'BR.MG', 'value': 3 , nome: 'Minas Gerais'},
                { 'id': 'BR.BA', 'value': 2 , nome: 'Bahia'},
                { 'id': 'BR.RS', 'value': 190 , nome: 'Rio Grande do Sul'},
                { 'id': 'BR.MA', 'value': 1 , nome: 'Maranhão'},
              ]);


              // Cria uma série de dados para o mapa, ligando os dados ao mapa
              var series = map.choropleth(dataSet);
              
               series.tooltip()
                  .titleFormat('Estado: {%nome}') // Outra forma de formatar o título
                  .format('Qtd de Alunos: {%value}');

              // Configura a escala de cores
              series.colorScale(anychart.scales.linearColor('#deebf7', '#3182bd'));
              series.hovered().fill('#addd8e'); // Cor ao passar o mouse
              

              // Define o container e desenha o mapa
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

    // Função de limpeza
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
        mapInstanceRef.current = null;
      }
      document.querySelectorAll('script[src*="anychart"], script[src*="brazil.js"]').forEach(e => e.remove());
    };
  }, []);

  return (
    <div>
      <h2>Mapa quantidade de aluno por estado</h2>
      <p>Este mapa é renderizado dinamicamente, carregando a quantidade de aluno espalhados pelo Brasil.</p>
      <div 
        ref={mapContainerRef} 
        id="map-container" 
        style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
      ></div>
    </div>
  );
}

export default MapaBrasilPage;