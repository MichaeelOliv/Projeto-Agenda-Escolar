import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckSquare,
  Package,
  MessageCircle,
  Download,
  Image as ImageIcon,
  User,
  Calendar as CalendarIcon
} from 'lucide-react';

export const DailyAgendaModal = ({ dateStr, post, onClose }) => {
  const [completedHomework, setCompletedHomework] = useState(false);

  if (!post) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
          <div className="modal-header">
            <h3>Detalhes da Agenda - {dateStr}</h3>
            <button className="btn btn-secondary" onClick={onClose} style={{ padding: '0.4rem' }}>
              <X size={18} />
            </button>
          </div>
          <div className="modal-body" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>Sem lançamentos para este dia nesta turma.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="event-pill atividade">
                <CalendarIcon size={12} /> {dateStr}
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                Turma {post.classId}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{post.title}</h3>
          </div>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Teacher Info Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '50%' }}>
              <User size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{post.teacherName}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Disciplina(s): {post.subject}</div>
            </div>
          </div>

          {/* Atividades Realizadas */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
              <BookOpen size={18} /> Atividades Realizadas em Sala
            </h4>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem' }}>
              {post.activitiesDone.map((act, idx) => (
                <li key={idx}>{act}</li>
              ))}
            </ul>
          </div>

          {/* Lição de Casa */}
          {post.homework && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#92400e' }}>
                  <CheckSquare size={18} /> Tarefa de Casa
                </h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#92400e', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={completedHomework}
                    onChange={(e) => setCompletedHomework(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
                  />
                  Marcar como Concluída
                </label>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#78350f', lineHeight: 1.4 }}>
                {post.homework}
              </p>
            </div>
          )}

          {/* Material para Trazer */}
          {post.requiredMaterials && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', marginBottom: '0.35rem' }}>
                <Package size={18} /> Material para a Próxima Aula
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#047857' }}>
                {post.requiredMaterials}
              </p>
            </div>
          )}

          {/* Recado do Professor */}
          {post.teacherNotice && (
            <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', padding: '1rem', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
                <MessageCircle size={18} /> Recado do Professor
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#3730a3', fontStyle: 'italic' }}>
                "{post.teacherNotice}"
              </p>
            </div>
          )}

          {/* Fotos da Aula */}
          {post.photos && post.photos.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <ImageIcon size={18} /> Fotos e Atividades Registradas
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {post.photos.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Atividade ${i + 1}`}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-color)' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Anexos */}
          {post.attachments && post.attachments.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Arquivos para Download
              </h4>
              {post.attachments.map((att, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{att.name} ({att.size})</span>
                  <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}>
                    <Download size={14} /> Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
