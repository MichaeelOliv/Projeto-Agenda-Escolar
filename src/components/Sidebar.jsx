import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAgenda } from '../context/AgendaContext';
import {
  Calendar,
  MessageSquare,
  Award,
  BellRing,
  Users,
  Building2
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { role } = useAuth();
  const { notices, messages } = useAgenda();

  const unreadMessagesCount = messages.filter((m) =>
    role === 'PAI' ? m.unreadForParent : m.unreadForTeacher
  ).length;

  const isStaff = role === 'PROFESSOR' || role === 'DIRECAO';

  return (
    <aside className="sidebar">
      <div className="sidebar-content-wrap">
        <div className="sidebar-title">
          Menu Principal
        </div>
        <ul className={`nav-menu ${isStaff ? 'has-staff' : ''}`}>
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
              title="Agenda & Diário"
            >
              <div className="nav-icon-wrap">
                <Calendar size={20} />
              </div>
              <span className="nav-label">Agenda</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
              title="Comunicação"
            >
              <div className="nav-icon-wrap">
                <MessageSquare size={20} />
                {unreadMessagesCount > 0 && (
                  <span className="badge-count-dot">{unreadMessagesCount}</span>
                )}
              </div>
              <span className="nav-label">Chat</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'grades' ? 'active' : ''}`}
              onClick={() => setActiveTab('grades')}
              title="Boletim & Notas"
            >
              <div className="nav-icon-wrap">
                <Award size={20} />
              </div>
              <span className="nav-label">Boletim</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-item-btn ${activeTab === 'notices' ? 'active' : ''}`}
              onClick={() => setActiveTab('notices')}
              title="Avisos Globais"
            >
              <div className="nav-icon-wrap">
                <BellRing size={20} />
                {notices.length > 0 && (
                  <span className="badge-notice-dot">{notices.length}</span>
                )}
              </div>
              <span className="nav-label">Avisos</span>
            </button>
          </li>
          {isStaff && (
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'classes' ? 'active' : ''}`}
                onClick={() => setActiveTab('classes')}
                title="Gestão de Turmas"
              >
                <div className="nav-icon-wrap">
                  <Users size={20} />
                </div>
                <span className="nav-label">Turmas</span>
              </button>
            </li>
          )}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Building2 size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>520+ Alunos Ativos</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
            Escola conectada em tempo real.
          </p>
        </div>
      </div>
    </aside>
  );
};
