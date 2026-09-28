import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAgenda } from '../context/AgendaContext';
import {
  MessageSquare,
  Send,
  PlusCircle,
  Clock,
  CheckCircle,
  User,
  AlertCircle,
  X
} from 'lucide-react';

export const CommunicationPortal = () => {
  const { role, currentUser, selectedStudent } = useAuth();
  const { messages, sendMessage, createNewMessageThread } = useAgenda();

  const [activeThreadId, setActiveThreadId] = useState(
    messages.length > 0 ? messages[0].id : null
  );
  const [replyText, setReplyText] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Thread Form State
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Falta / Saúde');
  const [newRecipientRole, setNewRecipientRole] = useState('PROFESSOR');
  const [initialMsgText, setInitialMsgText] = useState('');

  // Filter messages for current user/context
  const userThreads = messages.filter((m) => {
    if (role === 'PAI') {
      return m.studentId === selectedStudent?.id;
    }
    return true; // Teachers/Direção see all threads
  });

  const activeThread = userThreads.find((m) => m.id === activeThreadId) || userThreads[0];

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    sendMessage(activeThread.id, replyText, role, currentUser.name);
    setReplyText('');
  };

  const handleCreateThread = (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !initialMsgText.trim()) return;

    const threadData = {
      studentId: selectedStudent?.id || 'alu_001',
      studentName: selectedStudent?.name || 'Lucas Oliveira Silva',
      classId: selectedStudent?.classId || '5A',
      parentName: currentUser.name,
      recipientRole: newRecipientRole,
      recipientName: newRecipientRole === 'PROFESSOR' ? 'Prof.ª Mariana Costa' : 'Direção Pedagógica',
      subject: newSubject,
      category: newCategory,
      messages: [
        {
          id: `m_${Date.now()}`,
          sender: role,
          authorName: currentUser.name,
          time: new Date().toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          text: initialMsgText,
          attachment: null
        }
      ]
    };

    createNewMessageThread(threadData);
    setIsNewModalOpen(false);
    setNewSubject('');
    setInitialMsgText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '12px' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Canal de Comunicação Direta</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Comunicação oficial entre Pais, Professores e Coordenação.
            </p>
          </div>
        </div>

        {role === 'PAI' && (
          <button className="btn btn-primary" onClick={() => setIsNewModalOpen(true)}>
            <PlusCircle size={18} />
            <span>Nova Mensagem para a Escola</span>
          </button>
        )}
      </div>

      {/* Main Chat Layout */}
      <div className="chat-layout">
        {/* Threads List */}
        <div className="chat-threads-list">
          <div style={{ padding: '0.85rem 1rem', background: '#f8fafc', borderBottom: '1px solid var(--border-color)', fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Conversas ({userThreads.length})
          </div>

          {userThreads.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Nenhuma conversa registrada.
            </div>
          ) : (
            userThreads.map((thread) => {
              const isActive = activeThread?.id === thread.id;
              const lastMessage = thread.messages[thread.messages.length - 1];

              return (
                <div
                  key={thread.id}
                  className={`thread-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveThreadId(thread.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#e0e7ff', color: '#3730a3', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      {thread.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {thread.lastUpdate}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {thread.subject}
                  </h4>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lastMessage ? `${lastMessage.authorName}: ${lastMessage.text}` : ''}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {role === 'PAI' ? thread.recipientName : `Aluno: ${thread.studentName}`}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: thread.status === 'Respondido' ? 'var(--accent)' : 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      {thread.status === 'Respondido' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {thread.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Chat Messages Panel */}
        {activeThread ? (
          <div className="chat-main">
            {/* Chat Thread Header */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{activeThread.subject}</h3>
                  <span style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#92400e', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                    {activeThread.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                  Aluno: <strong>{activeThread.studentName} ({activeThread.classId})</strong> | Responsável: <strong>{activeThread.parentName}</strong>
                </p>
              </div>

              <div style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '9999px', background: activeThread.status === 'Respondido' ? '#d1fae5' : '#fef3c7', color: activeThread.status === 'Respondido' ? '#065f46' : '#92400e' }}>
                Status: {activeThread.status}
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="chat-messages-area">
              {activeThread.messages.map((msg) => {
                const isMine = (role === 'PAI' && msg.sender === 'PAI') || (role !== 'PAI' && msg.sender !== 'PAI');

                return (
                  <div
                    key={msg.id}
                    className={`chat-bubble ${isMine ? 'mine' : 'other'}`}
                  >
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, opacity: 0.85, marginBottom: '0.2rem' }}>
                      {msg.authorName} • {msg.time}
                    </div>
                    <p style={{ margin: 0 }}>{msg.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Message Reply Form */}
            <form onSubmit={handleSendReply} style={{ padding: '0.85rem 1.25rem', background: 'white', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Escreva sua resposta..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary">
                <Send size={16} /> Enviar
              </button>
            </form>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Selecione uma conversa ao lado para visualizar as mensagens.
          </div>
        )}
      </div>

      {/* New Message Thread Modal */}
      {isNewModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Nova Mensagem para a Escola</h3>
              <button className="btn btn-secondary" onClick={() => setIsNewModalOpen(false)} style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Destinatário</label>
                <select
                  className="form-select"
                  value={newRecipientRole}
                  onChange={(e) => setNewRecipientRole(e.target.value)}
                >
                  <option value="PROFESSOR">Professora Mariana Costa (Regente)</option>
                  <option value="DIRECAO">Direção / Coordenação Pedagógica</option>
                  <option value="SECRETARIA">Secretaria Escolar</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Categoria do Assunto</label>
                <select
                  className="form-select"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="Falta / Saúde">Justificativa de Falta / Saúde</option>
                  <option value="Dúvida Pedagógica">Dúvida Pedagógica / Tarefas</option>
                  <option value="Autorização">Autorização de Evento / Passeio</option>
                  <option value="Secretaria">Solicitação de Documentos / Secretaria</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Assunto</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Atraso devido a consulta médica"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Mensagem</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Descreva detalhadamente sua mensagem..."
                  value={initialMsgText}
                  onChange={(e) => setInitialMsgText(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send size={16} /> Enviar Mensagem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
