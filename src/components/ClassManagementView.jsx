import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAgenda } from '../context/AgendaContext';
import { CLASSES_LIST, SCHOOL_INFO } from '../data/mockData';
import { Users, Search, Phone, CheckCircle, XCircle, Building2, UserCheck, MessageCircle, UserPlus, X, Save } from 'lucide-react';

export const ClassManagementView = () => {
  const { role } = useAuth();
  const { studentsRoster, addStudent } = useAgenda();

  const [selectedClass, setSelectedClass] = useState('5A');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [studentName, setStudentName] = useState('');
  const [studentRa, setStudentRa] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  const isStaff = role === 'PROFESSOR' || role === 'DIRECAO';

  const studentsList = studentsRoster[selectedClass] || [];

  const filteredStudents = studentsList.filter(
    (st) =>
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.ra.includes(searchQuery) ||
      (st.parent && st.parent.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveNewStudent = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !parentName.trim()) return;

    addStudent(selectedClass, {
      name: studentName.trim(),
      ra: studentRa.trim() || undefined,
      parent: parentName.trim(),
      parentPhone: parentPhone.trim() || '(11) 99999-0000',
      status: 'Presente'
    });

    setStudentName('');
    setStudentRa('');
    setParentName('');
    setParentPhone('');
    setShowModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#e0e7ff', color: 'var(--primary)', padding: '0.85rem', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total de Alunos</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{SCHOOL_INFO.totalStudents + (studentsList.length > 5 ? studentsList.length - 5 : 0)}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#d1fae5', color: '#065f46', padding: '0.85rem', borderRadius: '12px' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Turmas Ativas</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{SCHOOL_INFO.totalClasses} Turmas</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#fef3c7', color: '#92400e', padding: '0.85rem', borderRadius: '12px' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Presença Hoje</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>96.8%</div>
          </div>
        </div>
      </div>

      {/* Class Selector & Roster */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Gestão de Turmas e Lista de Alunos</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Consulte a frequência, dados de contato dos pais e cadastre novos estudantes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              className="form-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ minWidth: '180px' }}
            >
              {CLASSES_LIST.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({studentsRoster[c.id]?.length || c.studentsCount} Alunos)
                </option>
              ))}
            </select>

            <div style={{ position: 'relative', width: '200px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Buscar aluno ou RA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.2rem' }}
              />
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {isStaff && (
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
              >
                <UserPlus size={16} /> Cadastrar Aluno
              </button>
            )}
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="table-responsive">
          <table className="grades-table">
            <thead>
              <tr>
                <th>RA</th>
                <th>Nome do Aluno</th>
                <th>Status Hoje</th>
                <th>Responsável</th>
                <th>Telefone</th>
                <th>Contato Rápido</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => (
                  <tr key={st.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-muted)' }}>{st.ra}</td>
                    <td style={{ fontWeight: 700 }}>{st.name}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          background: st.status === 'Presente' ? '#d1fae5' : '#fee2e2',
                          color: st.status === 'Presente' ? '#065f46' : '#991b1b',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        {st.status === 'Presente' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {st.status}
                      </span>
                    </td>
                    <td>{st.parent}</td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <a href={`tel:${st.parentPhone}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Phone size={14} /> {st.parentPhone}
                      </a>
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}>
                        <MessageCircle size={14} /> Mandar Recado
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Nenhum aluno encontrado para esta busca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Cadastrar Novo Aluno */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={20} color="var(--primary)" /> Cadastrar Novo Aluno na Turma {selectedClass}
              </h3>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ padding: '0.35rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewStudent} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group-field">
                <label>Nome Completo do Aluno *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Pedro Henrique Alcantara"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group-field">
                <label>Registro Acadêmico (RA)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: 20260999 (deixe vazio para gerar automaticamente)"
                  value={studentRa}
                  onChange={(e) => setStudentRa(e.target.value)}
                />
              </div>

              <div className="input-group-field">
                <label>Nome do Pai / Mãe ou Responsável *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Carlos Eduardo Alcantara"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group-field">
                <label>Telefone do Responsável</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: (11) 98877-6655"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Save size={16} /> Salvar Matrícula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

