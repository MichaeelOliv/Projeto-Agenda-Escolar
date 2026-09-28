import React from 'react';
import { useAuth } from '../context/AuthContext';
import { SCHOOL_INFO } from '../data/mockData';
import { GraduationCap, LogOut, Users, BookOpen, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const { role, currentUser, selectedStudent, setSelectedStudentId, switchRole, logout } = useAuth();

  const getRoleBadge = () => {
    switch (role) {
      case 'PAI':
        return { label: 'Pais / Resp.', icon: <Users size={14} />, class: 'badge-role-pai' };
      case 'PROFESSOR':
        return { label: 'Professor', icon: <BookOpen size={14} />, class: 'badge-role-prof' };
      case 'DIRECAO':
        return { label: 'Direção', icon: <ShieldCheck size={14} />, class: 'badge-role-dir' };
      default:
        return { label: role, icon: null, class: '' };
    }
  };

  const currentBadge = getRoleBadge();

  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="brand-logo">
          <div className="brand-icon">
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ lineHeight: 1.1 }}>EduAgenda</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {SCHOOL_INFO.name}
            </div>
          </div>
        </div>

        {/* Demo Role Switcher */}
        <div className="role-switcher-banner">
          <span style={{ fontSize: '0.78rem', opacity: 0.8 }}>Modo de Acesso:</span>
          <button
            className={`role-btn ${role === 'PAI' ? 'active' : ''}`}
            onClick={() => switchRole('PAI')}
            title="Alternar para visão de Pais"
          >
            Pais / Resp.
          </button>
          <button
            className={`role-btn ${role === 'PROFESSOR' ? 'active' : ''}`}
            onClick={() => switchRole('PROFESSOR')}
            title="Alternar para visão de Professor"
          >
            Professor
          </button>
          <button
            className={`role-btn ${role === 'DIRECAO' ? 'active' : ''}`}
            onClick={() => switchRole('DIRECAO')}
            title="Alternar para visão de Direção"
          >
            Direção
          </button>
        </div>

        {/* User Info & Student Selector */}
        <div className="user-profile-widget">
          {role === 'PAI' && currentUser.students?.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Filho:</span>
              <select
                value={selectedStudent?.id || ''}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                {currentUser.students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.className.split(' - ')[0]})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="avatar-img"
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>
                  {role === 'PAI' && selectedStudent ? selectedStudent.name : currentUser.name}
                </span>
                <span className={`navbar-role-pill ${currentBadge.class}`}>
                  {currentBadge.icon}
                  {currentBadge.label}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {role === 'PAI' ? `Aluno: ${selectedStudent?.className}` : currentUser.title || currentUser.specialty}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="logout-nav-btn"
              title="Encerrar Sessão / Sair"
            >
              <LogOut size={16} />
              <span className="logout-text">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

