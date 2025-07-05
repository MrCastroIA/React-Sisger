// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Componentes da aplicação
import LoginPage from './pages/Auth/LoginPage'; // Já está na pasta Auth
import DashboardLayout from './layouts/DashboardLayout'; // Layout com sidebar e header

// Páginas específicas de cada perfil (Dashboards iniciais)
// Lembre-se de criar essas pastas e arquivos em src/pages/Perfil/
import SargentoDashboard from './pages/Sargento/SargentoDashboard';
import AlunoDashboard from './pages/Aluno/AlunoDashboard';
import InstrutorDashboard from './pages/Instrutor/InstrutorDashboard';
import SensDashboard from './pages/SENS/SensDashboard';

// Subpáginas de cada perfil
// Sargento
import LancarNpccalPage from './pages/Sargento/LancarNpccalPage';
import JustificacaoPage from './pages/Sargento/JustificacaoPage';
import ElogiosSargentoPage from './pages/Sargento/ElogiosSargentoPage';
import AtestadosPage from './pages/Sargento/AtestadosPage';
import RelatoriosPage from './pages/Sargento/RelatoriosPage';
import CadastrarAlunosPage from './pages/Sargento/CadastrarAlunosPage'; 
import ListaAlunosPage from './pages/Sargento/ListaAlunoPage';

// Aluno
import NpccalAlunoPage from './pages/Aluno/NpccalAlunoPage';
import FaltasPage from './pages/Aluno/FaltasPage';
import ElogiosAlunoPage from './pages/Aluno/ElogiosAlunoPage';
import QuadroAulasAlunoPage from './pages/Aluno/QuadroAulasAlunoPage';

// Instrutor
import ChamadaPage from './pages/Instrutor/ChamadaPage';
import HorariosInstrutorPage from './pages/Instrutor/HorariosInstrutorPage';

// SENS
import QuadroAulasSensPage from './pages/SENS/QuadroAulasSensPage'; // Nome mais específico para evitar conflito
import FolgasFeriadosPage from './pages/SENS/FolgasFeriadosPage';
import GerenciarInstrutoresPage from './pages/SENS/GerenciarInstrutoresPage';


// Componentes de Autenticação/Autorização
import PrivateRoute from './components/PrivateRoute';
import { AuthContextProvider, useAuth } from './contexts/AuthContext'; // Importe o Context Provider e o hook

function App() {
  return (
    <Router>
      {/* AuthContextProvider deve envolver todas as rotas que precisam de autenticação */}
      <AuthContextProvider>
        <Routes>
          {/* Rota de Login (não protegida) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Grupo de rotas protegidas para o Sargento.
            O PrivateRoute garante que só Sargentos autenticados acessem.
            O DashboardLayout fornece a estrutura de navegação e header.
            As rotas aninhadas (`<Route index element={} />` e as outras)
            serão renderizadas dentro do <Outlet /> do DashboardLayout.
          */}
          <Route element={<PrivateRoute allowedProfiles={['Sargento']}> <DashboardLayout /> </PrivateRoute>}>
            <Route path="/sargento" element={<SargentoDashboard />} /> {/* Rota padrão do sargento */}
            <Route path="/sargento/lancarnpccal" element={<LancarNpccalPage />} />
            <Route path="/sargento/justificacao" element={<JustificacaoPage />} />
            <Route path="/sargento/elogios" element={<ElogiosSargentoPage />} />
            <Route path="/sargento/atestados" element={<AtestadosPage />} />
            <Route path="/sargento/relatorios" element={<RelatoriosPage />} />
            <Route path="/sargento/cadastrar-alunos" element={<CadastrarAlunosPage />} />
            <Route path='/sargento/lista-alunos' element={<ListaAlunosPage />} />
          </Route>

          {/* Grupo de rotas protegidas para o Aluno */}
          <Route element={<PrivateRoute allowedProfiles={['Aluno']}> <DashboardLayout /> </PrivateRoute>}>
            <Route path="/aluno" element={<AlunoDashboard />} /> {/* Rota padrão do aluno */}
            <Route path="/aluno/punicoes" element={<NpccalAlunoPage />} />
            <Route path="/aluno/faltas" element={<FaltasPage />} />
            <Route path="/aluno/elogios" element={<ElogiosAlunoPage />} />
            <Route path="/aluno/horarios" element={<QuadroAulasAlunoPage />} />
          </Route>

          {/* Grupo de rotas protegidas para o Instrutor */}
          <Route element={<PrivateRoute allowedProfiles={['Instrutor']}> <DashboardLayout /> </PrivateRoute>}>
            <Route path="/instrutor" element={<InstrutorDashboard />} /> {/* Rota padrão do instrutor */}
            <Route path="/instrutor/horarios" element={<HorariosInstrutorPage />} />
            <Route path="/instrutor/chamada" element={<ChamadaPage />} />
          </Route>

          {/* Grupo de rotas protegidas para a SENS */}
          <Route element={<PrivateRoute allowedProfiles={['SENS']}> <DashboardLayout /> </PrivateRoute>}>
            <Route path="/sens" element={<SensDashboard />} /> {/* Rota padrão da SENS */}
            <Route path="/sens/quadroaulas" element={<QuadroAulasSensPage />} />
            <Route path="/sens/folgasferiados" element={<FolgasFeriadosPage />} />
            <Route path="/sens/gerenciarinstrutores" element={<GerenciarInstrutoresPage />} />
          </Route>

          {/* Rota Padrão ou Redirecionamento (ex: para /login se não houver rota correspondente) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthContextProvider>
    </Router>
  );
}

export default App;