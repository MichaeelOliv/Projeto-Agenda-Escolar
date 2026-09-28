import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAgenda } from '../context/AgendaContext';
import { BellRing, CheckCircle, Calendar, PlusCircle, AlertCircle, X, Send, Eye } from 'lucide-react';

export const NoticesView = () => {
  const { role, currentUser } = useAuth();
  const { notices, confirmNoticeRead, addNotice } = useAgenda();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Reunião');
  const [scope, setScope] = useState('Global');
  const [eventDate, setEventDate] = useState('');
  const [content, setContent] = useState('');
  const [important, setImportant] = useState(false);

  const handleConfirmRead = (noticeId) => {
    confirmNoticeRead(noticeId, currentUser.id);
  };

  const handleCreateNotice = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addNotice({
      title,
      category,
      scope,
      author: currentUser.name || 'Direção Pedagógica',
      eventDate: eventDate || 'A definir',
      content,
      important
    });

    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '12px' }}>
            <BellRing size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Mural de Recados & Avisos Oficiais</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Comunicados oficiais da Direção, Coordenação e Eventos da Escola.
            </p>
          </div>
        </div>

        {(role === 'DIRECAO' || role === 'PROFESSOR') && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={18} />
            <span>Novo Comunicado Oficial</span>
          </button>
        )}
      </div>

      {/* Notices List Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notices.map((notice) => {
          const isConfirmedByMe = notice.confirmedParents?.includes(currentUser.id);
          const confirmedCount = notice.confirmedParents?.length || 0;

          return (
            <div
              key={notice.id}
              className="glass-card"
              style={{
                borderLeft: notice.important ? '5px solid var(--danger)' : '5px solid var(--primary)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, background: notice.important ? '#fee2e2' : '#e0e7ff', color: notice.important ? '#991b1b' : '#3730a3', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {notice.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Alcance: {notice.scope} • Postado por: <strong>{notice.author}</strong> ({notice.date})
                  </span>
                </div>

                {notice.eventDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                    <Calendar size={14} /> Data do Evento: {notice.eventDate}
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {notice.title}
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {notice.content}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Eye size={16} /> <strong>{confirmedCount + 482}</strong> de 520 pais visualizaram este aviso
                </div>

                {role === 'PAI' && (
                  isConfirmedByMe ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontWeight: 800, fontSize: '0.85rem' }}>
                      <CheckCircle size={18} /> Você marcou como ciente
                    </span>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleConfirmRead(notice.id)}
                      style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                    >
                      <CheckCircle size={16} /> Marcar como Ciente
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Novo Comunicado */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>📢 Publicar Novo Comunicado Oficial</h3>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)} style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Título do Comunicado</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Reunião de Pais do 3º Bimestre"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Categoria</label>
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Reunião">Reunião de Pais</option>
                    <option value="Evento Escolar">Evento Escolar</option>
                    <option value="Saúde Escolar">Saúde & Vacinação</option>
                    <option value="Aviso Geral">Aviso Geral</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Alcance</label>
                  <select className="form-select" value={scope} onChange={(e) => setScope(e.target.value)}>
                    <option value="Global">Toda a Escola (500+ alunos)</option>
                    <option value="Ensino Fundamental">Ensino Fundamental</option>
                    <option value="Ensino Médio">Ensino Médio</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Data do Evento (Opcional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: 25 de Setembro às 19h"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Conteúdo do Comunicado</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Escreva o aviso completo..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={important}
                  onChange={(e) => setImportant(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                Marcar como URGENTE / Importante (Destaque em Vermelho)
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send size={16} /> Publicar Comunicado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
