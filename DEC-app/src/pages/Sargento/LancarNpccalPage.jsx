// src/pages/Sargento/LancarNpccalPage.jsx
import React, { useState } from 'react';
import api from '../../api/api'; // Importe sua instância do Axios

function LancarNpccalPage() {
  const [alunoId, setAlunoId] = useState('');
  const [motivo, setMotivo] = useState('');
  const [penalidade, setPenalidade] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMessage('');
    setLoading(true);

    try {
      // Aqui você enviaria os dados para o seu backend
      const response = await api.post('/npccal/lancar', {
        alunoId,
        motivo,
        penalidade,
      });
      setFeedbackMessage('Npccal lançada com sucesso!');
      setAlunoId('');
      setMotivo('');
      setPenalidade('');
      console.log('Resposta da API:', response.data);
    } catch (error) {
      setFeedbackMessage('Erro ao lançar Npccal. Tente novamente.');
      console.error('Erro ao lançar Npccal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ color: '#0056b3' }}>Lançar Nova Npccal</h1>
      <p>Preencha os detalhes para registrar uma nova Npccal para um aluno.</p>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="alunoId" style={{ display: 'block', marginBottom: '5px' }}>ID do Aluno:</label>
          <input
            type="text"
            id="alunoId"
            value={alunoId}
            onChange={(e) => setAlunoId(e.target.value)}
            required
            style={{ width: 'calc(100% - 16px)', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="motivo" style={{ display: 'block', marginBottom: '5px' }}>Motivo da Punição:</label>
          <textarea
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
            rows="4"
            style={{ width: 'calc(100% - 16px)', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          ></textarea>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="penalidade" style={{ display: 'block', marginBottom: '5px' }}>Penalidade Aplicada:</label>
          <input
            type="text"
            id="penalidade"
            value={penalidade}
            onChange={(e) => setPenalidade(e.target.value)}
            required
            style={{ width: 'calc(100% - 16px)', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        {feedbackMessage && <p style={{ color: feedbackMessage.includes('sucesso') ? 'green' : 'red', marginBottom: '15px' }}>{feedbackMessage}</p>}
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Enviando...' : 'Lançar Npccal'}
        </button>
      </form>
    </div>
  );
}

export default LancarNpccalPage;