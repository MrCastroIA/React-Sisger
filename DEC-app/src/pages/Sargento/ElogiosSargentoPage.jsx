// src/pages/Sargento/ElogiosSargentoPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api'; // Sua instância do Axios
import { useAuth } from '../../contexts/AuthContext'; // Para obter o nome do sargento logado

function ElogiosSargentoPage() {
  const { user } = useAuth(); // Sargento logado
  const [alunos, setAlunos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAluno, setSelectedAluno] = useState(null); // Aluno clicado para ver elogios
  const [elogiosAluno, setElogiosAluno] = useState([]); // Elogios do aluno selecionado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para o formulário de adicionar elogio
  const [showAddElogioModal, setShowAddElogioModal] = useState(false);
  const [tipoElogio, setTipoElogio] = useState('');
  const [elogioPersonalizado, setElogioPersonalizado] = useState('');
  const [addElogioLoading, setAddElogioLoading] = useState(false);
  const [addElogioError, setAddElogioError] = useState('');
  const [addElogioSuccess, setAddElogioSuccess] = useState('');

  // Rol taxativo de elogios
  const ELOGIOS_TAXATIVOS = [
    'Dedicação e Esforço Exemplares',
    'Excelente Conduta Disciplinar',
    'Iniciativa e Proatividade',
    'Liderança e Trabalho em Equipe',
    'Superação de Desafios',
    'Colaboração e Altruísmo',
    'Comprometimento com o Aprendizado',
    'Pontualidade e Assiduidade'
  ];

  // Função para buscar todos os alunos
  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/alunos'); // Seu backend precisa de uma rota /api/alunos
        // Assumindo que a API retorna um array de objetos { id: '...', nome: '...', idFunc: '...' }
        setAlunos(response.data.alunos || []);
      } catch (err) {
        console.error('Erro ao buscar alunos:', err);
        setError('Não foi possível carregar a lista de alunos.');
        setAlunos([]); // Garante que a lista está vazia em caso de erro
      } finally {
        setLoading(false);
      }
    };
    fetchAlunos();
  }, []);

  // Função para buscar elogios de um aluno específico
  const fetchElogiosAluno = async (alunoId) => {
    try {
      setLoading(true); // Pode usar um loading específico para elogios do aluno se preferir
      setError('');
      // Seu backend precisa de uma rota /api/elogios/:alunoId
      const response = await api.get(`/elogios/${alunoId}`);
      // Assumindo que a API retorna um array de objetos elogio { id, descricao, data, sargentoNome }
      setElogiosAluno(response.data.elogios || []);
    } catch (err) {
      console.error(`Erro ao buscar elogios do aluno ${alunoId}:`, err);
      setError('Não foi possível carregar os elogios deste aluno.');
      setElogiosAluno([]);
    } finally {
      setLoading(false);
    }
  };

  // Lidar com clique no aluno da lista
  const handleAlunoClick = (aluno) => {
    setSelectedAluno(aluno);
    fetchElogiosAluno(aluno.id); // Busca os elogios do aluno clicado
  };

  // Filtrar alunos com base no termo de pesquisa
  const filteredAlunos = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.idFunc.toLowerCase().includes(searchTerm.toLowerCase()) // Assumindo idFunc como string
  );

  // Lidar com o envio do formulário de adicionar elogio
  const handleAddElogioSubmit = async (e) => {
    e.preventDefault();
    setAddElogioLoading(true);
    setAddElogioError('');
    setAddElogioSuccess('');

    // Escolhe a descrição do elogio
    const descricao = tipoElogio === 'Outros' ? elogioPersonalizado : tipoElogio;

    if (!descricao) {
      setAddElogioError('Por favor, selecione um tipo de elogio ou preencha a descrição.');
      setAddElogioLoading(false);
      return;
    }

    try {
      // Endpoint para adicionar elogio. Assumindo que o backend espera:
      // { alunoId, descricao, sargentoId, sargentoNome (opcional, pode ser inferido no backend) }
      await api.post('/elogios', {
        alunoId: selectedAluno.id,
        descricao: descricao,
        sargentoId: user.id, // ID do sargento logado
        sargentoNome: user.nome // Nome do sargento logado
      });
      setAddElogioSuccess('Elogio adicionado com sucesso!');
      setTipoElogio('');
      setElogioPersonalizado('');
      setShowAddElogioModal(false); // Fecha o modal após sucesso
      fetchElogiosAluno(selectedAluno.id); // Recarrega os elogios para o aluno selecionado
    } catch (err) {
      console.error('Erro ao adicionar elogio:', err);
      setAddElogioError('Não foi possível adicionar o elogio. Tente novamente.');
    } finally {
      setAddElogioLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Gerenciar Elogios</h1>
      {error && <p style={styles.errorMessage}>{error}</p>}

      <div style={styles.contentWrapper}>
        {/* Coluna da Esquerda: Lista de Alunos */}
        <div style={styles.alunosListContainer}>
          <h2 style={styles.subHeader}>Alunos</h2>
          <input
            type="text"
            placeholder="Pesquisar aluno por nome ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          {loading ? (
            <p>Carregando alunos...</p>
          ) : (
            <ul style={styles.alunosList}>
              {filteredAlunos.length === 0 ? (
                <p>Nenhum aluno encontrado.</p>
              ) : (
                filteredAlunos.map(aluno => (
                  <li
                    key={aluno.id}
                    onClick={() => handleAlunoClick(aluno)}
                    style={{
                      ...styles.alunoListItem,
                      ...(selectedAluno && selectedAluno.id === aluno.id && styles.alunoListItemSelected)
                    }}
                  >
                    <span>{aluno.nome}</span>
                    <span style={styles.alunoIdFunc}></span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* Coluna da Direita: Detalhes e Adicionar Elogio */}
        <div style={styles.elogiosDetailContainer}>
          {selectedAluno ? (
            <>
              <h2 style={styles.subHeader}>Elogios de {selectedAluno.nome}</h2>
              <button
                onClick={() => setShowAddElogioModal(true)}
                style={styles.addElogioButton}
              >
                Adicionar Elogio
              </button>

              {elogiosAluno.length === 0 ? (
                <p>Nenhum elogio encontrado para este aluno.</p>
              ) : (
                <ul style={styles.elogiosList}>
                  {elogiosAluno.map(elogio => (
                    <li key={elogio.id} style={styles.elogioListItem}>
                      <p><strong>Elogio:</strong> {elogio.descricao}</p>
                      <p style={styles.elogioMeta}>Registrado por: {elogio.sargentoNome || 'Sargento Desconhecido'} em {new Date(elogio.data).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p style={{ textAlign: 'center', marginTop: '50px', color: '#555' }}>
              Selecione um aluno na lista à esquerda para ver/adicionar elogios.
            </p>
          )}
        </div>
      </div>

      {/* Modal para Adicionar Elogio */}
      {showAddElogioModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalHeader}>Adicionar Elogio para {selectedAluno?.nome}</h2>
            <form onSubmit={handleAddElogioSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Tipo de Elogio:</label>
                <select
                  value={tipoElogio}
                  onChange={(e) => {
                    setTipoElogio(e.target.value);
                    if (e.target.value !== 'Outros') setElogioPersonalizado('');
                  }}
                  style={styles.formControl}
                  required
                >
                  <option value="">Selecione...</option>
                  {ELOGIOS_TAXATIVOS.map(elogio => (
                    <option key={elogio} value={elogio}>{elogio}</option>
                  ))}
                  <option value="Outros">Outros (Elogio personalizado)</option>
                </select>
              </div>

              {tipoElogio === 'Outros' && (
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Elogio Personalizado:</label>
                  <textarea
                    value={elogioPersonalizado}
                    onChange={(e) => setElogioPersonalizado(e.target.value)}
                    rows="3"
                    style={styles.formControl}
                    placeholder="Descreva o elogio..."
                    required
                  ></textarea>
                </div>
              )}

              {addElogioError && <p style={styles.addElogioErrorMessage}>{addElogioError}</p>}
              {addElogioSuccess && <p style={styles.addElogioSuccessMessage}>{addElogioSuccess}</p>}

              <div style={styles.modalActions}>
                <button type="submit" disabled={addElogioLoading} style={styles.modalSaveButton}>
                  {addElogioLoading ? 'Salvando...' : 'Salvar Elogio'}
                </button>
                <button type="button" onClick={() => setShowAddElogioModal(false)} style={styles.modalCancelButton}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ElogiosSargentoPage;

// Estilos básicos para a página (pode ser movido para um arquivo CSS separado)
const styles = {
  container: {
    padding: '25px',
    backgroundColor: '#f8f9fa',
    minHeight: 'calc(100vh - 80px)', // Ajuste com base na altura do seu header/footer
  },
  header: {
    fontSize: '2.2em',
    marginBottom: '20px',
    color: '#343a40',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
  },
  subHeader: {
    fontSize: '1.6em',
    color: '#007bff',
    marginBottom: '15px',
  },
  errorMessage: {
    color: 'red',
    backgroundColor: '#ffe6e6',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  contentWrapper: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap', // Permite quebrar linha em telas menores
  },
  alunosListContainer: {
    flex: '1 1 350px', // Cresce e encolhe, mínimo de 350px
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  searchInput: {
    width: 'calc(100% - 20px)',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1em',
  },
  alunosList: {
    listStyle: 'none',
    padding: 0,
    maxHeight: '600px', // Altura fixa com scroll
    overflowY: 'auto',
  },
  alunoListItem: {
    padding: '12px 15px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
    backgroundColor: 'transparent',
  },
  alunoListItemSelected: {
    backgroundColor: '#e0f7fa',
    fontWeight: 'bold',
    borderLeft: '4px solid #007bff',
  },
  alunoListItem: { // Reaplicando para garantir que o hover funciona
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  alunoIdFunc: {
    fontSize: '0.85em',
    color: '#6c757d',
  },
  elogiosDetailContainer: {
    flex: '2 1 600px', // Ocupa mais espaço, mínimo de 600px
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  addElogioButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em',
    marginBottom: '20px',
    transition: 'background-color 0.2s',
  },
  elogiosList: {
    listStyle: 'none',
    padding: 0,
  },
  elogioListItem: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  elogioMeta: {
    fontSize: '0.85em',
    color: '#888',
    marginTop: '5px',
  },

  // Estilos do Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '500px',
    position: 'relative',
  },
  modalHeader: {
    fontSize: '1.8em',
    color: '#343a40',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  formGroup: {
    marginBottom: '15px',
    textAlign: 'left',
  },
  formLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
  },
  formControl: {
    width: 'calc(100% - 22px)', // Ajuste para padding
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    fontSize: '1em',
  },
  modalActions: {
    marginTop: '25px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  modalSaveButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em',
    transition: 'background-color 0.2s',
  },
  modalCancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em',
    transition: 'background-color 0.2s',
  },
  addElogioErrorMessage: {
    color: 'red',
    marginTop: '10px',
  },
  addElogioSuccessMessage: {
    color: 'green',
    marginTop: '10px',
  }
};