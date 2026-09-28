import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAgenda } from '../context/AgendaContext';
import { CLASSES_LIST } from '../data/mockData';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  BookOpen,
  CheckCircle2,
  FileText,
  Clock,
  Image as ImageIcon
} from 'lucide-react';
import { DailyAgendaModal } from './DailyAgendaModal';
import { ActivityFormModal } from './ActivityFormModal';

export const CalendarView = () => {
  const { role, selectedStudent } = useAuth();
  const { dailyPosts } = useAgenda();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 9)); // Set to Sept 2026
  const [selectedDateStr, setSelectedDateStr] = useState('2026-09-09');
  const [selectedClassFilter, setSelectedClassFilter] = useState(
    role === 'PAI' ? selectedStudent?.classId || '5A' : '5A'
  );

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Synchronize class for Parent role
  const activeClassId = role === 'PAI' ? (selectedStudent?.classId || '5A') : selectedClassFilter;

  // Calendar calculations for September 2026
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper to format date string YYYY-MM-DD
  const formatDateString = (dayNum) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Get posts for a specific day and class
  const getPostForDay = (dayStr) => {
    return dailyPosts.find(
      (p) => p.date === dayStr && (p.classId === activeClassId || p.classId === 'GLOBAL')
    );
  };

  const selectedDayPost = getPostForDay(selectedDateStr);

  const handleDayClick = (dayNum) => {
    const dStr = formatDateString(dayNum);
    setSelectedDateStr(dStr);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="calendar-container">
      {/* Top Bar / Controls */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '12px' }}>
            <CalendarIcon size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Agenda & Diário de Classe</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {role === 'PAI'
                ? `Acompanhamento diário de ${selectedStudent?.name || 'seu filho'}`
                : 'Lançamento e consulta de atividades escolares por turma'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {role !== 'PAI' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Turma:</span>
              <select
                className="form-select"
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                style={{ minWidth: '160px' }}
              >
                {CLASSES_LIST.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(role === 'PROFESSOR' || role === 'DIRECAO') && (
            <button className="btn btn-primary" onClick={() => setIsFormModalOpen(true)}>
              <PlusCircle size={18} />
              <span>Lançar Atividade do Dia</span>
            </button>
          )}
        </div>
      </div>

      {/* Calendar Header Month Navigation */}
      <div className="glass-card">
        <div className="calendar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              {monthNames[month]} {year}
            </h3>
            <span style={{ fontSize: '0.8rem', background: '#e0e7ff', color: '#3730a3', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 700 }}>
              Turma {activeClassId}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={handlePrevMonth} style={{ padding: '0.4rem 0.8rem' }}>
              <ChevronLeft size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentDate(new Date(2026, 8, 9))} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              Hoje
            </button>
            <button className="btn btn-secondary" onClick={handleNextMonth} style={{ padding: '0.4rem 0.8rem' }}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}

          {paddingDays.map((_, index) => (
            <div key={`pad-${index}`} className="calendar-day-cell" style={{ opacity: 0.3, background: '#f1f5f9', cursor: 'default' }} />
          ))}

          {daysArray.map((dayNum) => {
            const dateStr = formatDateString(dayNum);
            const post = getPostForDay(dateStr);
            const isToday = dateStr === '2026-09-09';
            const isSelected = dateStr === selectedDateStr;

            return (
              <div
                key={dayNum}
                className={`calendar-day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDayClick(dayNum)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="calendar-day-number">{dayNum}</span>
                  {isToday && (
                    <span style={{ fontSize: '0.65rem', background: 'var(--primary)', color: 'white', padding: '0.05rem 0.35rem', borderRadius: '4px', fontWeight: 800 }}>
                      Hoje
                    </span>
                  )}
                </div>

                {post && (
                  <div style={{ marginTop: '0.25rem' }}>
                    <div className="event-pill atividade" title={post.title}>
                      📘 {post.subject}
                    </div>
                    {post.homework && (
                      <div className="event-pill dever" title="Dever de casa">
                        📝 Lição de Casa
                      </div>
                    )}
                    {post.photos && post.photos.length > 0 && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <ImageIcon size={10} /> {post.photos.length} foto(s)
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Quick Card Summary */}
      {selectedDayPost ? (
        <div className="glass-card" style={{ borderLeft: '5px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Resumo da Aula • {selectedDateStr}
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.2rem 0 0.5rem 0' }}>
                {selectedDayPost.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Disciplinas: <strong>{selectedDayPost.subject}</strong> | Professor: <strong>{selectedDayPost.teacherName}</strong>
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setIsDetailModalOpen(true)}
            >
              Ver Detalhes Completos
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
                <BookOpen size={16} /> O que fizemos hoje:
              </h4>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {selectedDayPost.activitiesDone.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>

            {selectedDayPost.homework && (
              <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '12px', border: '1px solid #fde68a' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#92400e', marginBottom: '0.5rem' }}>
                  <FileText size={16} /> Tarefa de Casa:
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#78350f', lineHeight: 1.4 }}>
                  {selectedDayPost.homework}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
          <Clock size={36} color="var(--text-muted)" style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Nenhuma atividade postada para o dia selecionado ({selectedDateStr}).
          </h4>
          {(role === 'PROFESSOR' || role === 'DIRECAO') && (
            <button
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
              onClick={() => setIsFormModalOpen(true)}
            >
              <PlusCircle size={16} /> Cadastrar Atividades para este Dia
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {isDetailModalOpen && (
        <DailyAgendaModal
          dateStr={selectedDateStr}
          post={selectedDayPost}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}

      {isFormModalOpen && (
        <ActivityFormModal
          defaultDate={selectedDateStr}
          defaultClassId={activeClassId}
          onClose={() => setIsFormModalOpen(false)}
        />
      )}
    </div>
  );
};
