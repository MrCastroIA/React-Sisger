// src/pages/Sargento/CadastrarAlunosPage.jsx
import React, { useState } from 'react';
import api from '../../api/api'; // Sua instância do Axios

function CadastrarAlunosPage() {
  // Estados para cadastro manual
  const [nomeManual, setNomeManual] = useState('');
  const [usernameManual, setUsernameManual] = useState('');
  const [passwordManual, setPasswordManual] = useState('');
  const [idFuncManual, setIdFuncManual] = useState('');
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState('');
  const [manualSuccess, setManualSuccess] = useState('');

  // Estados para upload de Excel
  const [excelFile, setExcelFile] = useState(null);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelError, setExcelError] = useState('');
  const [excelSuccess, setExcelSuccess] = useState('');

  // Lidar com o envio do formulário de cadastro manual
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setManualLoading(true);
    setManualError('');
    setManualSuccess('');

    try {
      // Perfil padrão 'Aluno' para novos cadastros
      const profile = 'Aluno'; 
      const response = await api.post('/alunos/manual', {
        name: nomeManual,
        username: usernameManual,
        password: passwordManual,
        idFunc: idFuncManual,
        profile: profile
      });
      setManualSuccess(response.data.message || 'Aluno cadastrado com sucesso!');
      // Limpa o formulário
      setNomeManual('');
      setUsernameManual('');
      setPasswordManual('');
      setIdFuncManual('');
    } catch (err) {
      console.error('Erro ao cadastrar aluno manualmente:', err);
      // Erro 409 (Conflict) pode vir se username ou idFunc já existem
      setManualError(err.response?.data?.message || 'Erro ao cadastrar aluno. Verifique os dados e se username/ID Funcional já existem.');
    } finally {
      setManualLoading(false);
    }
  };

  // Lidar com a seleção do arquivo Excel
  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  // Lidar com o upload do arquivo Excel
  const handleExcelUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      setExcelError('Por favor, selecione um arquivo Excel.');
      return;
    }

    setExcelLoading(true);
    setExcelError('');
    setExcelSuccess('');

    const formData = new FormData();
    formData.append('file', excelFile);

    try {
      const response = await api.post('/alunos/excel-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setExcelSuccess(response.data.message || 'Alunos da planilha cadastrados com sucesso!');
      setExcelFile(null); // Limpa o arquivo selecionado
    } catch (err) {
      console.error('Erro ao fazer upload da planilha:', err);
      setExcelError(err.response?.data?.message || 'Erro ao processar a planilha. Verifique o formato do arquivo e se há dados válidos.');
    } finally {
      setExcelLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Cadastro de Alunos</h1>
      <p style={styles.description}>
        Utilize esta página para adicionar novos alunos ao sistema, seja manualmente ou através do upload de uma planilha Excel.
      </p>

      <div style={styles.contentWrapper}>
        {/* Bloco de Cadastro Manual */}
        <div style={styles.formSection}>
          <h2 style={styles.subHeader}>Cadastro Manual</h2>
          <form onSubmit={handleManualSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nome Completo:</label>
              <input type="text" value={nomeManual} onChange={(e) => setNomeManual(e.target.value)} style={styles.formControl} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Username:</label>
              <input type="text" value={usernameManual} onChange={(e) => setUsernameManual(e.target.value)} style={styles.formControl} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Senha:</label>
              <input type="password" value={passwordManual} onChange={(e) => setPasswordManual(e.target.value)} style={styles.formControl} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>ID Funcional:</label>
              <input type="text" value={idFuncManual} onChange={(e) => setIdFuncManual(e.target.value)} style={styles.formControl} required />
            </div>
            {manualError && <p style={styles.errorMessage}>{manualError}</p>}
            {manualSuccess && <p style={styles.successMessage}>{manualSuccess}</p>}
            <button type="submit" disabled={manualLoading} style={styles.submitButton}>
              {manualLoading ? 'Cadastrando...' : 'Salvar'}
            </button>
          </form>
        </div>

        {/* Bloco de Upload de Excel */}
        <div style={styles.formSection}>
          <h2 style={styles.subHeader}>Upload de Planilha Excel</h2>
          <p style={styles.excelTip}>
            A planilha deve conter os seguintes cabeçalhos na primeira linha (A1, B1, C1, D1 respectivamente):
            "Nome Completo", "Username", "Senha", "ID Funcional".
          </p>
          <form onSubmit={handleExcelUpload}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Selecionar Arquivo Excel (.xlsx):</label>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} style={styles.fileInput} required />
              {excelFile && <p style={styles.fileName}>Arquivo selecionado: {excelFile.name}</p>}
            </div>
            {excelError && <p style={styles.errorMessage}>{excelError}</p>}
            {excelSuccess && <p style={styles.successMessage}>{excelSuccess}</p>}
            <button type="submit" disabled={excelLoading} style={styles.submitButton}>
              {excelLoading ? 'Enviando...' : 'Fazer Upload da Planilha'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastrarAlunosPage;

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f0f2f5',
    minHeight: 'calc(100vh - 80px)', // Ajuste com base na altura do seu header/footer
  },
  header: {
    fontSize: '2.5em',
    marginBottom: '25px',
    color: '#333',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
    textAlign: 'center',
  },
  description: {
    fontSize: '1.1em',
    color: '#555',
    marginBottom: '30px',
    textAlign: 'center',
  },
  contentWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '40px',
    justifyContent: 'center',
  },
  formSection: {
    flex: '1 1 45%', // Duas colunas em telas maiores
    minWidth: '350px',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  subHeader: {
    fontSize: '1.8em',
    color: '#007bff',
    marginBottom: '20px',
    textAlign: 'center',
  },
  excelTip: {
    fontSize: '0.9em',
    color: '#777',
    marginBottom: '20px',
    backgroundColor: '#e9f7ef',
    borderLeft: '4px solid #28a745',
    padding: '10px',
    borderRadius: '5px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  },
  formControl: {
    width: 'calc(100% - 22px)', // Ajusta para padding
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1em',
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1em',
    backgroundColor: '#fdfdfd',
  },
  fileName: {
    marginTop: '10px',
    fontSize: '0.9em',
    color: '#666',
  },
  submitButton: {
    display: 'block',
    margin: 'auto',
    maxWidht: '300px',
    textAlign: 'center',
    //width: '40%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '09px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  errorMessage: {
    color: '#dc3545',
    backgroundColor: '#ffe6e6',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  successMessage: {
    color: '#28a745',
    backgroundColor: '#e9f7ef',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    textAlign: 'center',
  },
};