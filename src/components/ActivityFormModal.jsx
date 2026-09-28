import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAgenda } from '../context/AgendaContext';
import { CLASSES_LIST } from '../data/mockData';
import { X, Send, BookOpen, CheckSquare, Package, MessageCircle } from 'lucide-react';

export const ActivityFormModal = ({ defaultDate, defaultClassId, onClose }) => {
  const { currentUser } = useAuth();
  const { addDailyPost } = useAgenda();

  const [date, setDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [classId, setClassId] = useState(defaultClassId || '5A');
  const [subject, setSubject] = useState('Língua Portuguesa & Geografia');
  const [title, setTitle] = useState('');
  const [activitiesDoneText, setActivitiesDoneText] = useState('');
  const [homework, setHomework] = useState('');
  const [requiredMaterials, setRequiredMaterials] = useState('');
  const [teacherNotice, setTeacherNotice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !activitiesDoneText.trim()) {
      alert('Por favor preencha o título e as atividades realizadas.');
      return;
    }

    const activitiesList = activitiesDoneText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    addDailyPost({
      date,
      classId,
      teacherName: currentUser.name || 'Prof.ª Mariana Costa',
      subject,
      title,
      activitiesDone: activitiesList,
      homework,
      requiredMaterials,
      teacherNotice,
      attachments: [],
      photos: [
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
      ]
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              📘 Lançar Diário de Classe / Atividade do Dia
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              A publicação ficará disponível instantaneamente para os pais no calendário.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Data da Atividade</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Turma</label>
              <select
                className="form-select"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
              >
                {CLASSES_LIST.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Disciplina(s)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Português / Matemática"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Título da Aula do Dia</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Estudo de Frações e Leitura"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">O que foi realizado em sala (Uma por linha)</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="1. Leitura do livro didático pág. 45&#10;2. Exercícios em dupla no caderno"
              value={activitiesDoneText}
              onChange={(e) => setActivitiesDoneText(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Dever de Casa (Opcional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Páginas 50 e 51 do livro de Português"
              value={homework}
              onChange={(e) => setHomework(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Material Necessário para a Próxima Aula (Opcional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Trazer régua de 30cm e compasso"
              value={requiredMaterials}
              onChange={(e) => setRequiredMaterials(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Recado do Professor aos Pais (Opcional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Lembrar do trabalho de artes na próxima sexta-feira."
              value={teacherNotice}
              onChange={(e) => setTeacherNotice(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Publicar Diário de Classe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
