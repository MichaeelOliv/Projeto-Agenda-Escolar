import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SCHOOL_INFO, MOCK_USERS } from '../data/mockData';
import {
  GraduationCap,
  Users,
  BookOpen,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
  School,
  KeyRound,
  Shield,
  Clock,
  Heart
} from 'lucide-react';

export const LoginView = () => {
  const { login } = useAuth();

  const [activeRoleTab, setActiveRoleTab] = useState('PAI'); // PAI, PROFESSOR, DIRECAO
  const [email, setEmail] = useState(import.meta.env.VITE_USER_PAI_EMAIL || 'michaeel00@gmail.com');
  const [password, setPassword] = useState(import.meta.env.VITE_USER_PAI_PASSWORD || 'Agenda@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Updates prefilled email when user selects a profile tab
  const handleSelectRoleTab = (role) => {
    setActiveRoleTab(role);
    setErrorMessage('');
    if (role === 'PAI') {
      setEmail(import.meta.env.VITE_USER_PAI_EMAIL || 'michaeel00@gmail.com');
      setPassword(import.meta.env.VITE_USER_PAI_PASSWORD || 'Agenda@2026');
    } else if (role === 'PROFESSOR') {
      setEmail(import.meta.env.VITE_USER_PROFESSOR_EMAIL || 'mariana.costa@horizontesdosaber.edu.br');
      setPassword(import.meta.env.VITE_USER_PROFESSOR_PASSWORD || 'Agenda@2026');
    } else if (role === 'DIRECAO') {
      setEmail(import.meta.env.VITE_USER_DIRECAO_EMAIL || 'direcao@horizontesdosaber.edu.br');
      setPassword(import.meta.env.VITE_USER_DIRECAO_PASSWORD || 'Agenda@2026');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Por favor, informe seu e-mail de acesso.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Por favor, digite sua senha.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await login(email, password, activeRoleTab);
      setIsLoading(false);

      if (!res.success) {
        setErrorMessage(res.message || 'Credenciais inválidas! Não foi possível acessar as telas.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Erro de conexão ao validar credenciais no banco de dados online.');
    }
  };

  const handleQuickDemoLogin = async (role) => {
    setActiveRoleTab(role);
    setIsLoading(true);
    setErrorMessage('');

    let targetEmail = import.meta.env.VITE_USER_PAI_EMAIL || 'michaeel00@gmail.com';
    let targetPass = import.meta.env.VITE_USER_PAI_PASSWORD || 'Agenda@2026';
    if (role === 'PROFESSOR') {
      targetEmail = import.meta.env.VITE_USER_PROFESSOR_EMAIL || 'mariana.costa@horizontesdosaber.edu.br';
      targetPass = import.meta.env.VITE_USER_PROFESSOR_PASSWORD || 'Agenda@2026';
    } else if (role === 'DIRECAO') {
      targetEmail = import.meta.env.VITE_USER_DIRECAO_EMAIL || 'direcao@horizontesdosaber.edu.br';
      targetPass = import.meta.env.VITE_USER_DIRECAO_PASSWORD || 'Agenda@2026';
    }

    setEmail(targetEmail);
    setPassword(targetPass);

    try {
      const res = await login(targetEmail, targetPass, role);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message || 'Falha na autenticação online.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Erro de conexão ao acessar o banco de dados online.');
    }
  };

  return (
    <div className="login-page-container">
      {/* Dynamic Background Pattern */}
      <div className="login-bg-overlay"></div>

      <div className="login-wrapper">
        {/* Left Section: Login Form & Role Selector */}
        <div className="login-card-main">
          {/* Header Brand */}
          <div className="login-header">
            <div className="login-logo-wrap">
              <div className="login-brand-icon">
                <GraduationCap size={28} color="#ffffff" />
              </div>
              <div>
                <h1 className="login-brand-title">EduAgenda</h1>
                <p className="login-school-name">{SCHOOL_INFO.name}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
              <div className="login-badge-year">
                Ano Letivo {SCHOOL_INFO.academicYear}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', border: '1px solid #86efac', padding: '0.15rem 0.6rem', borderRadius: '9999px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
                REST Cloud API Online
              </div>
            </div>
          </div>

          <div className="login-welcome-text">
            <h2>Portal de Acesso Escolar</h2>
            <p>Selecione o seu perfil de usuário para acessar o sistema.</p>
          </div>

          {/* User Role Selection Tabs */}
          <div className="role-cards-grid">
            {/* Tab 1: PAI */}
            <div
              className={`role-card-item ${activeRoleTab === 'PAI' ? 'selected' : ''}`}
              onClick={() => handleSelectRoleTab('PAI')}
            >
              <div className="role-card-header">
                <div className="role-icon-box pai">
                  <Users size={20} />
                </div>
                <div className="role-title-group">
                  <span className="role-card-title">Pais & Responsáveis</span>
                  <span className="role-card-sub">Família & Alunos</span>
                </div>
                {activeRoleTab === 'PAI' && <CheckCircle2 size={18} className="role-check-icon" />}
              </div>
              <p className="role-card-desc">
                Acompanhe agenda diária, boletim, avisos e converse com os professores.
              </p>
              <div className="role-card-tag">
                2 Alunos Matriculados
              </div>
            </div>

            {/* Tab 2: PROFESSOR */}
            <div
              className={`role-card-item ${activeRoleTab === 'PROFESSOR' ? 'selected' : ''}`}
              onClick={() => handleSelectRoleTab('PROFESSOR')}
            >
              <div className="role-card-header">
                <div className="role-icon-box prof">
                  <BookOpen size={20} />
                </div>
                <div className="role-title-group">
                  <span className="role-card-title">Corpo Docente</span>
                  <span className="role-card-sub">Professores</span>
                </div>
                {activeRoleTab === 'PROFESSOR' && <CheckCircle2 size={18} className="role-check-icon" />}
              </div>
              <p className="role-card-desc">
                Registre tarefas, fotos das aulas, frequência, avisos e fale com responsáveis.
              </p>
              <div className="role-card-tag">
                Regente 5º Ano A
              </div>
            </div>

            {/* Tab 3: DIRECAO */}
            <div
              className={`role-card-item ${activeRoleTab === 'DIRECAO' ? 'selected' : ''}`}
              onClick={() => handleSelectRoleTab('DIRECAO')}
            >
              <div className="role-card-header">
                <div className="role-icon-box dir">
                  <ShieldCheck size={20} />
                </div>
                <div className="role-title-group">
                  <span className="role-card-title">Direção & Coordenação</span>
                  <span className="role-card-sub">Gestão Escolar</span>
                </div>
                {activeRoleTab === 'DIRECAO' && <CheckCircle2 size={18} className="role-check-icon" />}
              </div>
              <p className="role-card-desc">
                Gestão institucional completa, publicação de comunicados e suporte.
              </p>
              <div className="role-card-tag">
                Coordenação Geral
              </div>
            </div>
          </div>

          {/* Quick Demo Login Highlight Bar */}
          <div className="quick-demo-box">
            <div className="quick-demo-info">
              <Sparkles size={18} className="sparkle-icon" />
              <div>
                <strong>Acesso Rápido de Demonstração:</strong> Clique para entrar instantaneamente como{' '}
                {activeRoleTab === 'PAI' && 'Pai/Mãe (Michaeel Oliveira)'}
                {activeRoleTab === 'PROFESSOR' && 'Professora (Mariana Costa)'}
                {activeRoleTab === 'DIRECAO' && 'Diretora (Dra. Beatriz Santos)'}.
              </div>
            </div>
            <button
              type="button"
              className="quick-demo-btn"
              onClick={() => handleQuickDemoLogin(activeRoleTab)}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner-sm"></span>
              ) : (
                <>
                  Entrar como {activeRoleTab === 'PAI' ? 'Pai' : activeRoleTab === 'PROFESSOR' ? 'Professora' : 'Diretora'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-divider">
              <span>ou entre com e-mail e senha</span>
            </div>

            {errorMessage && (
              <div className="login-error-alert">
                {errorMessage}
              </div>
            )}

            <div className="input-group-field">
              <label htmlFor="login-email">E-mail de Acesso</label>
              <div className="input-with-icon">
                <Mail size={18} className="field-icon" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail cadastrado"
                  required
                />
              </div>
            </div>

            <div className="input-group-field">
              <label htmlFor="login-password">Senha de Segurança</label>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options-row">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Lembrar-me neste dispositivo</span>
              </label>
              <a href="#recuperar" onClick={(e) => e.preventDefault()} className="forgot-pass-link">
                Esqueceu a senha?
              </a>
            </div>

            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  Entrar no EduAgenda
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-footer-credits">
            <p>© 2026 EduAgenda • Sistema de Integração {SCHOOL_INFO.name}</p>
          </div>
        </div>

        {/* Right Section: Institutional Hero Banner (Desktop) */}
        <div className="login-hero-banner">
          <div className="hero-content">
            <div className="hero-pill-badge">
              <School size={16} /> Colégio Horizontes do Saber
            </div>

            <h2 className="hero-main-title">
              Educação e Família Conectadas em Tempo Real.
            </h2>
            <p className="hero-subtitle">
              Uma plataforma intuitiva desenvolvida para facilitar a rotina escolar, centralizar a comunicação e acompanhar a jornada de aprendizagem dos alunos.
            </p>

            {/* Feature Cards Grid */}
            <div className="hero-features-list">
              <div className="hero-feature-item">
                <div className="hero-feature-icon">
                  <Clock size={20} />
                </div>
                <div>
                  <h4>Diário de Classe Digital</h4>
                  <p>Acompanhe diariamente conteúdos, lições de casa e avisos da turma.</p>
                </div>
              </div>

              <div className="hero-feature-item">
                <div className="hero-feature-icon">
                  <Heart size={20} />
                </div>
                <div>
                  <h4>Comunicação Direta & Segura</h4>
                  <p>Canal direto de chat com professores e coordenação pedagógica.</p>
                </div>
              </div>

              <div className="hero-feature-item">
                <div className="hero-feature-icon">
                  <Shield size={20} />
                </div>
                <div>
                  <h4>Conformidade LGPD & Segurança</h4>
                  <p>Privacidade e proteção garantida para dados de mais de 520 alunos.</p>
                </div>
              </div>
            </div>

            {/* School Metrics Footer */}
            <div className="hero-stats-banner">
              <div className="stat-box">
                <span className="stat-number">524</span>
                <span className="stat-label">Alunos Ativos</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-box">
                <span className="stat-number">18</span>
                <span className="stat-label">Turmas</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-box">
                <span className="stat-number">28</span>
                <span className="stat-label">Professores</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
