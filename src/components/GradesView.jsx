import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAgenda } from '../context/AgendaContext';
import { Award, FileText, CheckCircle2, Edit3, Save, X, CalendarPlus, Plus } from 'lucide-react';

export const GradesView = () => {
  const { role, selectedStudent } = useAuth();
  const { grades, updateStudentGradeAndAttendance, addBimester } = useAgenda();

  const [activeBimesterIndex, setActiveBimesterIndex] = useState(2); // 3º Bimestre
  const [editingSubject, setEditingSubject] = useState(null);
  const [newGradeValue, setNewGradeValue] = useState('');
  const [newAttendanceValue, setNewAttendanceValue] = useState('');

  const [showBimesterModal, setShowBimesterModal] = useState(false);
  const [newBimesterTitle, setNewBimesterTitle] = useState('');

  const isStaff = role === 'PROFESSOR' || role === 'DIRECAO';

  const targetStudentId = selectedStudent?.id || 'alu_001';
  const studentGradeRecord = grades[targetStudentId] || grades['alu_001'];
  const currentBimesterData = studentGradeRecord?.bimesters[activeBimesterIndex];

  // Calculate Average for active bimester
  const subjects = currentBimesterData?.subjects || [];
  const averageGrade = subjects.length > 0
    ? (subjects.reduce((acc, curr) => acc + curr.grade, 0) / subjects.length).toFixed(1)
    : 0;

  const handleEditGradeClick = (subjectName, currentGrade, currentAttendance) => {
    setEditingSubject(subjectName);
    setNewGradeValue(currentGrade.toString());
    setNewAttendanceValue(currentAttendance.toString());
  };

  const handleSaveGradeAndAttendance = (subjectName) => {
    if (newGradeValue === '' || isNaN(newGradeValue)) return;
    updateStudentGradeAndAttendance(
      targetStudentId,
      activeBimesterIndex,
      subjectName,
      newGradeValue,
      newAttendanceValue || '100'
    );
    setEditingSubject(null);
  };

  const handleCreateBimester = (e) => {
    e.preventDefault();
    if (!newBimesterTitle.trim()) return;

    addBimester(newBimesterTitle.trim());
    setNewBimesterTitle('');
    setShowBimesterModal(false);
    if (studentGradeRecord?.bimesters) {
      setActiveBimesterIndex(studentGradeRecord.bimesters.length);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '12px' }}>
            <Award size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Boletim Escolar & Rendimento</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Acompanhamento de notas por disciplina e índice de frequência.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isStaff && (
            <button
              className="btn btn-primary"
              onClick={() => setShowBimesterModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              <CalendarPlus size={16} /> + Adicionar Novo Bimestre
            </button>
          )}

          <div style={{ background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Média Geral do Bimestre</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
              {averageGrade} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 10.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bimester Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
        {studentGradeRecord?.bimesters.map((bim, idx) => (
          <button
            key={idx}
            className={`btn ${activeBimesterIndex === idx ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveBimesterIndex(idx)}
            style={{ borderRadius: '9999px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            {bim.bimester}
          </button>
        ))}
      </div>

      {/* Grades Table Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
            Notas - {currentBimesterData?.bimester || 'Bimestre Atual'}
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Aluno: <strong>{studentGradeRecord?.studentName}</strong>
          </span>
        </div>

        <div className="table-responsive">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Disciplina</th>
                <th>Nota Obtida</th>
                <th>Frequência (%)</th>
                <th>Situação / Desempenho</th>
                {isStaff && <th>Ação</th>}
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, i) => {
                const isHigh = sub.grade >= 9.0;
                const isMed = sub.grade >= 7.0 && sub.grade < 9.0;
                const badgeClass = isHigh ? 'high' : isMed ? 'medium' : 'low';

                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{sub.name}</td>
                    <td>
                      {editingSubject === sub.name ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Nota:</span>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            className="form-input"
                            value={newGradeValue}
                            onChange={(e) => setNewGradeValue(e.target.value)}
                            style={{ width: '70px', padding: '0.2rem 0.4rem' }}
                          />
                        </div>
                      ) : (
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: isHigh ? '#065f46' : isMed ? '#92400e' : '#991b1b' }}>
                          {sub.grade.toFixed(1)}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingSubject === sub.name ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Freq(%):</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="form-input"
                            value={newAttendanceValue}
                            onChange={(e) => setNewAttendanceValue(e.target.value)}
                            style={{ width: '70px', padding: '0.2rem 0.4rem' }}
                          />
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{sub.attendance}%</span>
                          <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '4px', maxWidth: '80px', overflow: 'hidden' }}>
                            <div style={{ width: `${sub.attendance}%`, height: '100%', background: 'var(--accent)' }} />
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`grade-badge ${badgeClass}`}>
                        {sub.status}
                      </span>
                    </td>
                    {isStaff && (
                      <td>
                        {editingSubject === sub.name ? (
                          <div style={{ display: 'flex', gap: '0.3rem' }}>
                            <button
                              className="btn btn-success"
                              style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                              onClick={() => handleSaveGradeAndAttendance(sub.name)}
                            >
                              <Save size={12} /> OK
                            </button>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                              onClick={() => setEditingSubject(null)}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                            onClick={() => handleEditGradeClick(sub.name, sub.grade, sub.attendance)}
                          >
                            <Edit3 size={14} /> Editar Nota/Freq.
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Parecer Pedagógico */}
        {currentBimesterData?.teacherComments && (
          <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1.15rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
              <FileText size={16} /> Parecer Pedagógico do Professor
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.4 }}>
              "{currentBimesterData.teacherComments}"
            </p>
          </div>
        )}
      </div>

      {/* Modal: Adicionar Novo Bimestre */}
      {showBimesterModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarPlus size={20} color="var(--primary)" /> Adicionar Novo Bimestre ao Boletim
              </h3>
              <button onClick={() => setShowBimesterModal(false)} className="btn btn-secondary" style={{ padding: '0.35rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBimester} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group-field">
                <label>Título / Perfil do Bimestre *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: 4º Bimestre ou Exame de Recuperação Final"
                  value={newBimesterTitle}
                  onChange={(e) => setNewBimesterTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBimesterModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Save size={16} /> Criar Bimestre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

