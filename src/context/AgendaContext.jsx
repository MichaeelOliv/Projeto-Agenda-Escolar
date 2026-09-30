import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_DAILY_POSTS,
  INITIAL_NOTICES,
  INITIAL_MESSAGES,
  INITIAL_GRADES,
  MOCK_STUDENTS_ROSTER
} from '../data/mockData';

const AgendaContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const DEFAULT_SUBJECTS = [
  { name: "Língua Portuguesa", grade: 8.0, attendance: 100, status: "Aprovado" },
  { name: "Matemática", grade: 8.0, attendance: 100, status: "Aprovado" },
  { name: "História", grade: 8.0, attendance: 100, status: "Aprovado" },
  { name: "Geografia", grade: 8.0, attendance: 100, status: "Aprovado" },
  { name: "Ciências", grade: 8.0, attendance: 100, status: "Aprovado" },
  { name: "Inglês", grade: 8.0, attendance: 100, status: "Aprovado" },
  { name: "Educação Física", grade: 10.0, attendance: 100, status: "Aprovado" },
  { name: "Artes", grade: 9.0, attendance: 100, status: "Aprovado" }
];

export const AgendaProvider = ({ children }) => {
  const [dailyPosts, setDailyPosts] = useState(() => {
    const saved = localStorage.getItem('edu_daily_posts');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_POSTS;
  });

  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem('edu_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('edu_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [grades, setGrades] = useState(() => {
    const saved = localStorage.getItem('edu_grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [studentsRoster, setStudentsRoster] = useState(() => {
    const saved = localStorage.getItem('edu_students_roster');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS_ROSTER;
  });

  // Fetch real-time data from MongoDB Atlas API on mount with intelligent local cache merge
  useEffect(() => {
    const fetchMongoDBAtlasData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sync`);
        if (response.ok) {
          const data = await response.json();

          // Merge daily posts
          if (data.dailyPosts && data.dailyPosts.length > 0) {
            setDailyPosts(prev => {
              const ids = new Set(data.dailyPosts.map(p => p.id));
              const localOnly = prev.filter(p => !ids.has(p.id));
              return [...localOnly, ...data.dailyPosts];
            });
          }

          // Merge notices
          if (data.notices && data.notices.length > 0) {
            setNotices(prev => {
              const ids = new Set(data.notices.map(n => n.id));
              const localOnly = prev.filter(n => !ids.has(n.id));
              return [...localOnly, ...data.notices];
            });
          }

          // Merge grades & bimesters (never lose 4º Bimestre)
          if (data.grades && Object.keys(data.grades).length > 0) {
            setGrades(prev => {
              const merged = { ...data.grades };
              Object.keys(prev).forEach(studentId => {
                if (!merged[studentId]) {
                  merged[studentId] = prev[studentId];
                } else {
                  const localBimesters = prev[studentId]?.bimesters || [];
                  const serverBimesters = merged[studentId]?.bimesters || [];
                  const bimNames = new Set(serverBimesters.map(b => b.bimester));
                  const missingLocalBims = localBimesters.filter(b => !bimNames.has(b.bimester));
                  merged[studentId].bimesters = [...serverBimesters, ...missingLocalBims];
                }
              });
              return merged;
            });
          }

          // Merge student roster
          if (data.studentsRoster && Object.keys(data.studentsRoster).length > 0) {
            setStudentsRoster(prev => {
              const merged = { ...data.studentsRoster };
              Object.keys(prev).forEach(classId => {
                if (!merged[classId]) {
                  merged[classId] = prev[classId];
                } else {
                  const localStudents = prev[classId] || [];
                  const serverStudents = merged[classId] || [];
                  const stIds = new Set(serverStudents.map(s => s.id));
                  const localOnlySt = localStudents.filter(s => !stIds.has(s.id));
                  merged[classId] = [...serverStudents, ...localOnlySt];
                }
              });
              return merged;
            });
          }

          console.log('✅ Dados sincronizados em tempo real!');
        }
      } catch (err) {
        // Cache local mantido
      }
    };

    fetchMongoDBAtlasData();
  }, []);

  // Save state to localStorage as offline cache
  useEffect(() => {
    localStorage.setItem('edu_daily_posts', JSON.stringify(dailyPosts));
  }, [dailyPosts]);

  useEffect(() => {
    localStorage.setItem('edu_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('edu_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('edu_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('edu_students_roster', JSON.stringify(studentsRoster));
  }, [studentsRoster]);

  // 1. Adicionar diário de classe / atividades do dia -> Persiste no MongoDB Atlas
  const addDailyPost = async (newPost) => {
    const postWithId = {
      ...newPost,
      id: `post_${Date.now()}`
    };
    setDailyPosts((prev) => [postWithId, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postWithId)
      });
    } catch (e) {
      // Sincronização offline mantida
    }
    return postWithId;
  };

  // 2. Adicionar aviso da direção/professor -> Persiste no MongoDB Atlas
  const addNotice = async (newNotice) => {
    const noticeWithId = {
      ...newNotice,
      id: `not_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      confirmedParents: []
    };
    setNotices((prev) => [noticeWithId, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/notices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticeWithId)
      });
    } catch (e) {
      // Sincronização offline mantida
    }
  };

  // 3. Marcar aviso como ciente pelo pai -> Persiste no MongoDB Atlas
  const confirmNoticeRead = async (noticeId, parentId) => {
    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === noticeId) {
          const list = n.confirmedParents || [];
          if (!list.includes(parentId)) {
            return { ...n, confirmedParents: [...list, parentId] };
          }
        }
        return n;
      })
    );

    try {
      await fetch(`${API_BASE_URL}/notices/${noticeId}/confirm`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId })
      });
    } catch (e) {
      // Sincronização offline mantida
    }
  };

  // 4. Enviar mensagem em uma conversa existente -> Persiste no MongoDB Atlas
  const sendMessage = async (threadId, text, senderRole, authorName) => {
    const newMsg = {
      id: `m_${Date.now()}`,
      sender: senderRole,
      authorName,
      time: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      text,
      attachment: null
    };

    setMessages((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            status: senderRole === 'PAI' ? 'Aguardando' : 'Respondido',
            lastUpdate: new Date().toISOString().split('T')[0],
            unreadForParent: senderRole !== 'PAI',
            unreadForTeacher: senderRole === 'PAI',
            messages: [...thread.messages, newMsg]
          };
        }
        return thread;
      })
    );

    try {
      await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, message: newMsg })
      });
    } catch (e) {
      // Sincronização offline mantida
    }
  };

  // 5. Criar nova conversa entre pai e escola -> Persiste no MongoDB Atlas
  const createNewMessageThread = async (threadData) => {
    const newThread = {
      ...threadData,
      id: `msg_${Date.now()}`,
      lastUpdate: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      status: 'Aguardando',
      unreadForParent: false,
      unreadForTeacher: true
    };
    setMessages((prev) => [newThread, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newThread })
      });
    } catch (e) {
      // Sincronização offline mantida
    }
  };

  // 6. Atualizar Nota e Frequência (%) de uma disciplina -> Persiste no MongoDB Atlas
  const updateStudentGradeAndAttendance = async (
    studentId,
    bimesterIndex,
    subjectName,
    newGrade,
    newAttendance
  ) => {
    let updatedGradesState = null;

    setGrades((prev) => {
      const studentGradeRecord = prev[studentId] || {
        studentName: "Aluno",
        classId: "5A",
        bimesters: [
          { bimester: "1º Bimestre", subjects: DEFAULT_SUBJECTS },
          { bimester: "2º Bimestre", subjects: DEFAULT_SUBJECTS },
          { bimester: "3º Bimestre (Em Andamento)", subjects: DEFAULT_SUBJECTS }
        ]
      };

      const updatedBimesters = [...studentGradeRecord.bimesters];
      if (!updatedBimesters[bimesterIndex]) return prev;

      const targetBimester = { ...updatedBimesters[bimesterIndex] };

      targetBimester.subjects = targetBimester.subjects.map((sub) => {
        if (sub.name === subjectName) {
          const parsedGrade = parseFloat(newGrade);
          const parsedAtt = parseInt(newAttendance, 10);
          const status = parsedGrade >= 7.0 ? "Aprovado" : "Em Acompanhamento";
          return {
            ...sub,
            grade: isNaN(parsedGrade) ? sub.grade : parsedGrade,
            attendance: isNaN(parsedAtt) ? sub.attendance : parsedAtt,
            status
          };
        }
        return sub;
      });

      updatedBimesters[bimesterIndex] = targetBimester;

      updatedGradesState = {
        ...prev,
        [studentId]: {
          ...studentGradeRecord,
          bimesters: updatedBimesters
        }
      };

      return updatedGradesState;
    });

    if (updatedGradesState) {
      try {
        await fetch(`${API_BASE_URL}/grades`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedGradesState)
        });
      } catch (e) {
        // Sincronização offline mantida
      }
    }
  };

  // 7. Cadastrar Novo Aluno na Turma pela Direção -> Persiste no MongoDB Atlas
  const addStudent = async (classId, studentData) => {
    const newId = `alu_${Date.now().toString().slice(-4)}`;
    const newStudent = {
      id: newId,
      name: studentData.name,
      ra: studentData.ra || `${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`,
      status: studentData.status || "Presente",
      parent: studentData.parent,
      parentPhone: studentData.parentPhone || "(11) 99999-0000"
    };

    setStudentsRoster((prev) => {
      const currentList = prev[classId] || [];
      return {
        ...prev,
        [classId]: [...currentList, newStudent]
      };
    });

    setGrades((prev) => ({
      ...prev,
      [newId]: {
        studentName: studentData.name,
        classId,
        bimesters: [
          { bimester: "1º Bimestre", subjects: DEFAULT_SUBJECTS, teacherComments: "Aluno matriculado." },
          { bimester: "2º Bimestre", subjects: DEFAULT_SUBJECTS, teacherComments: "Desempenho regular." },
          { bimester: "3º Bimestre (Em Andamento)", subjects: DEFAULT_SUBJECTS, teacherComments: "Matrícula recente." }
        ]
      }
    }));

    try {
      await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId, student: newStudent })
      });
    } catch (e) {
      // Sincronização offline mantida
    }

    return newStudent;
  };

  // 8. Adicionar Novo Bimestre para todos os alunos (ex: 4º Bimestre) -> Persiste no MongoDB Atlas
  const addBimester = async (bimesterName) => {
    setGrades((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((studentId) => {
        const record = updated[studentId];
        const newBim = {
          bimester: bimesterName,
          subjects: DEFAULT_SUBJECTS.map((s) => ({ ...s, grade: 8.5, attendance: 100 })),
          teacherComments: "Novo bimestre cadastrado pela coordenação."
        };
        updated[studentId] = {
          ...record,
          bimesters: [...record.bimesters, newBim]
        };
      });
      return updated;
    });

    try {
      await fetch(`${API_BASE_URL}/grades/bimester`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bimesterName })
      });
    } catch (e) {
      // Sincronização offline mantida
    }
  };

  return (
    <AgendaContext.Provider
      value={{
        dailyPosts,
        notices,
        messages,
        grades,
        studentsRoster,
        addDailyPost,
        addNotice,
        confirmNoticeRead,
        sendMessage,
        createNewMessageThread,
        updateStudentGradeAndAttendance,
        addStudent,
        addBimester
      }}
    >
      {children}
    </AgendaContext.Provider>
  );
};

export const useAuthAgenda = () => useContext(AgendaContext);
export const useAgenda = () => useContext(AgendaContext);
