import React, { useEffect, useRef, useState } from 'react';

// Importações do jQuery e DataTables
import $ from 'jquery';
import 'datatables.net';
import api from '../api/api';

// Estilo customizado para o container (opcional, mas recomendado)
const containerStyle = {
    maxWidth: '5000px',
    margin: 'auto',
    backgroundColor: 'white',
    padding: '50px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginTop: '20px'
};

const ListaAlunos = () => {
    // Usamos um 'ref' para dar ao React uma referência direta ao elemento da tabela no DOM
    const tableRef = useRef();
    
    // Estado para controlar o carregamento e possíveis erros
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect é o local perfeito para código que interage com o mundo fora do React
    useEffect(() => {
        // Função assíncrona para buscar os dados com AXIOS
        const fetchData = async () => {
            try {
                // 2. Fazendo a requisição com axios
                const response = await api.get('/alunoscompleta'); // Ajuste a URL conforme necessário
                
                // 3. O array de dados está em 'response.data'
                // O backend pode enviar {alunos: []} ou diretamente []. O código abaixo lida com ambos.
                const alunosData = Array.isArray(response.data.alunos) ? response.data.alunos : response.data;

                // Verificação para garantir que temos um array
                if (!Array.isArray(alunosData)) {
                    throw new Error("Os dados recebidos não são um array.");
                }

                // Inicializa o DataTables
                $(tableRef.current).DataTable({
                    // 4. Passamos o array de dados correto
                    data: alunosData,
                    columns: [
                        { title: 'Numerica', data: 'num_individual' },
                        { title: 'Nome', data: 'nome_completo' },
                        { title: 'ID Funcional', data: 'id_func' }
                    ],
                    language: {
                        url: '//cdn.datatables.net/plug-ins/2.0.8/i18n/pt-BR.json'
                    },
                    responsive: true,
                    destroy: true
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // A função de limpeza continua a mesma e é muito importante
        return () => {
            const table = $(tableRef.current).DataTable();
            if (table) {
                table.destroy();
            }
        };
    }, []);

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    // O JSX que renderizamos é muito simples. Apenas a estrutura da tabela.
    // O DataTables irá preencher o <tbody> por conta própria.
    return (
        <div style={containerStyle}>
            <h1>Alunos Cadastrados</h1>
            <p>Aqui você pode pesquisar, ordenar e visualizar os alunos.</p>
            <table ref={tableRef} className="mdl-data-table" style={{ width: '100%' }}>
                {/* O DataTables irá gerar o thead e tbody a partir da configuração 'columns' e 'data' */}
            </table>
        </div>
    );
};

export default ListaAlunos;