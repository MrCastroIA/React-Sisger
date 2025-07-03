import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    // Redireciona se não houver usuário logado (deve ser tratado pelo PrivateRoute também)
    return <p>Carregando ou redirecionando...</p>;
  }

  const getDashboardLinks = (profile) => {
    switch (profile) {
      case 'Sargento':
        return (
          <>
            <li><Link to="/sargento/lancarnpccal">Lançar Npccal</Link></li>
            <li><Link to="/sargento/justificacao">Justificação</Link></li>
            <li><Link to="/sargento/elogios">Fazer Elogios</Link></li>
            <li><Link to="/sargento/atestados">Investigação de Atestados</Link></li>
            <li><Link to="/sargento/relatorios">Relatórios</Link></li>
            <li><Link to="/sargento/cadastrar-alunos">Cadastrar Alunos</Link></li>
          </>
        );
      case 'Aluno':
        return (
          <>
            <li><Link to="/aluno/punicoes">Minhas Punições</Link></li>
            <li><Link to="/aluno/faltas">Acompanhar Faltas</Link></li>
            <li><Link to="/aluno/elogios">Meus Elogios</Link></li>
            <li><Link to="/aluno/horarios">Quadro de Aulas</Link></li>
          </>
        );
      case 'Instrutor':
        return (
          <>
            <li><Link to="/instrutor/horarios">Consultar Horários</Link></li>
            <li><Link to="/instrutor/chamada">Realizar Chamada</Link></li>
          </>
        );
      case 'SENS':
        return (
          <>
            <li><Link to="/sens/quadroaulas">Organizar Quadro de Aulas</Link></li>
            <li><Link to="/sens/folgasferiados">Adicionar Folga/Feriado</Link></li>
            <li><Link to="/sens/gerenciarinstrutores">Gerenciar Instrutores</Link></li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#f0f2f5', padding: '20px', borderRight: '1px solid #ddd' }}>
        <h3>Bem-vindo, {user.nome}!</h3>
        <p>Perfil: {user.profile}</p>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {getDashboardLinks(user.profile)}
            <li style={{ marginTop: '20px' }}>
              <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <Outlet /> {/* Aqui as sub-rotas serão renderizadas */}
      </main>
    </div>
  );
}

export default DashboardLayout;