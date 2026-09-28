import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AgendaProvider } from './context/AgendaContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CalendarView } from './components/CalendarView';
import { CommunicationPortal } from './components/CommunicationPortal';
import { GradesView } from './components/GradesView';
import { NoticesView } from './components/NoticesView';
import { ClassManagementView } from './components/ClassManagementView';
import { LoginView } from './components/LoginView';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('calendar');

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="content-area">
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'chat' && <CommunicationPortal />}
          {activeTab === 'grades' && <GradesView />}
          {activeTab === 'notices' && <NoticesView />}
          {activeTab === 'classes' && <ClassManagementView />}
        </div>
      </main>

      <footer style={{ background: 'white', borderTop: '1px solid var(--border-color)', padding: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
        <p>© 2026 EduAgenda - Plataforma Digital de Integração Escolar. Sistema operando para 520+ Alunos.
          Criado Por Michaeel Oliveira
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AgendaProvider>
        <AppContent />
      </AgendaProvider>
    </AuthProvider>
  );
}

