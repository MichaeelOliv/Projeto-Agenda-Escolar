import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_DAILY_POSTS,
  INITIAL_NOTICES,
  INITIAL_MESSAGES,
  INITIAL_GRADES,
  MOCK_STUDENTS_ROSTER
} from '../data/mockData';

const AgendaContext = createContext();

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

  // Adicionar diário de classe / atividades do dia
  const addDailyPost = (newPost) => {
    const postWithId = {
      ...newPost,
      id: `post_${Date.now()}`
    };
    setDailyPosts((prev) => [postWithId, ...prev]);
    return postWithId;
  };

  // Adicionar aviso da direção/professor
  const addNotice = (newNotice) => {
    const noticeWithId = {
      ...newNotice,
      id: `not_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      confirmedParents: []
    };
    setNotices((prev) => [noticeWithId, ...prev]);
  };

  // Marcar aviso como ciente pelo pai
  const confirmNoticeRead = (noticeId, parentId) => {
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
  };

  // Enviar mensagem em uma conversa existente
  const sendMessage = (threadId, text, senderRole, authorName) => {
    setMessages((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
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
  };

  // Criar nova conversa entre pai e escola
  const createNewMessageThread = (threadData) => {
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
  };

  // Atualizar Nota e Frequência (%) de uma disciplina
  const updateStudentGradeAndAttendance = (
    studentId,
    bimesterIndex,
    subjectName,
    newGrade,
    newAttendance
  ) => {
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

      return {
        ...prev,
        [studentId]: {
          ...studentGradeRecord,
          bimesters: updatedBimesters
        }
      };
    });
  };

  // Cadastrar Novo Aluno na Turma
  const addStudent = (classId, studentData) => {
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

    // Inicializa o boletim do novo aluno
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

    return newStudent;
  };

  // Adicionar Novo Bimestre para todos os alunos
  const addBimester = (bimesterName) => {
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

