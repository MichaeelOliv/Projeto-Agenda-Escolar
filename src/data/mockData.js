// Mock Database para Escola de 500+ Alunos (Colégio Horizontes do Saber)

export const SCHOOL_INFO = {
  name: "Colégio Horizontes do Saber",
  totalStudents: 524,
  totalClasses: 18,
  totalTeachers: 28,
  academicYear: "2026",
  address: "Av. das Academias, 1500 - Jardim Primavera",
  phone: "(11) 3890-4500",
  email: "contato@horizontesdosaber.edu.br"
};

export const MOCK_USERS = {
  PAI: {
    id: "user_pai_1",
    name: "Michaeel Oliveira",
    role: "PAI",
    email: "michaeel00@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    students: [
      {
        id: "alu_001",
        name: "Lucas Oliveira Silva",
        ra: "20260512",
        classId: "5A",
        className: "5º Ano A - Ensino Fundamental I",
        avatar: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80",
        teacherName: "Prof.ª Mariana Costa",
        birthDate: "14/08/2015"
      },
      {
        id: "alu_002",
        name: "Beatriz Oliveira Silva",
        ra: "20260844",
        classId: "1B",
        className: "1º Ano B - Ensino Fundamental I",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        teacherName: "Prof.ª Juliana Meireles",
        birthDate: "03/02/2019"
      }
    ]
  },
  PROFESSOR: {
    id: "user_prof_1",
    name: "Prof.ª Mariana Costa",
    role: "PROFESSOR",
    email: "mariana.costa@horizontesdosaber.edu.br",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    specialty: "Regente do 5º Ano A & Português/História",
    classesAssigned: ["5A", "5B", "6A"]
  },
  DIRECAO: {
    id: "user_dir_1",
    name: "Dra. Beatriz Santos",
    role: "DIRECAO",
    email: "direcao@horizontesdosaber.edu.br",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    title: "Diretora Pedagógica & Coordenação Geral"
  }
};

export const CLASSES_LIST = [
  { id: "1A", name: "1º Ano A (EF I)", shift: "Manhã", studentsCount: 28, teacher: "Prof.ª Camila Ramos" },
  { id: "1B", name: "1º Ano B (EF I)", shift: "Tarde", studentsCount: 26, teacher: "Prof.ª Juliana Meireles" },
  { id: "5A", name: "5º Ano A (EF I)", shift: "Manhã", studentsCount: 30, teacher: "Prof.ª Mariana Costa" },
  { id: "5B", name: "5º Ano B (EF I)", shift: "Tarde", studentsCount: 29, teacher: "Prof. Fernando Souza" },
  { id: "9A", name: "9º Ano A (EF II)", shift: "Manhã", studentsCount: 32, teacher: "Prof. Carlos Eduardo" },
  { id: "3EM", name: "3º Ano A (Ensino Médio)", shift: "Manhã", studentsCount: 35, teacher: "Prof.ª Patricia Alencar" }
];

export const MOCK_STUDENTS_ROSTER = {
  "5A": [
    { id: "alu_001", name: "Lucas Oliveira Silva", ra: "20260512", status: "Presente", parent: "Roberto Silva", parentPhone: "(11) 98844-1234" },
    { id: "alu_003", name: "Gabriel Santos Lima", ra: "20260513", status: "Presente", parent: "Marcos Lima", parentPhone: "(11) 97711-5544" },
    { id: "alu_004", name: "Isabella Fernandes", ra: "20260514", status: "Presente", parent: "Carla Fernandes", parentPhone: "(11) 96622-3311" },
    { id: "alu_005", name: "Mateus Ribeiro", ra: "20260515", status: "Ausente", parent: "Renata Ribeiro", parentPhone: "(11) 95533-8899" },
    { id: "alu_006", name: "Sophia Martins", ra: "20260516", status: "Presente", parent: "Daniel Martins", parentPhone: "(11) 94444-2233" }
  ]
};

// Data base do diário escolar (atividades por data e por turma)
export const INITIAL_DAILY_POSTS = [
  {
    id: "post_1",
    date: "2026-09-09", // Hoje
    classId: "5A",
    teacherName: "Prof.ª Mariana Costa",
    subject: "Língua Portuguesa & Geografia",
    title: "Estudo sobre Regiões Brasileiras e Leitura de Contos",
    activitiesDone: [
      "Leitura compartilhada do conto 'O Mistério da Floresta' (Livro Didático pág. 45 a 50).",
      "Atividade em grupo: Mapa mental sobre a Região Sudeste (vegetação, clima e economia).",
      "Correção dos exercícios de concordância verbal passados ontem."
    ],
    homework: "Exercícios 1 a 6 da página 52 da apostila de Português. Entrega: 11/09.",
    requiredMaterials: "Trazer atlas geográfico e lápis de cor para a próxima aula de Geografia.",
    teacherNotice: "Turma muito participativa no trabalho em grupo! Parabéns aos alunos pela dedicação.",
    attachments: [
      { name: "Mapa_Regiao_Sudeste_Exemplo.pdf", size: "1.2 MB", type: "pdf" }
    ],
    photos: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    id: "post_2",
    date: "2026-09-08",
    classId: "5A",
    teacherName: "Prof. Carlos Eduardo",
    subject: "Matemática",
    title: "Fractions e Resolução de Problemas Práticos",
    activitiesDone: [
      "Introdução às frações equivalentes com uso de material dourado e réguas fraciconadas.",
      "Resolução de problemas do cotidiano envolvendo divisão de pizzas e chocolates."
    ],
    homework: "Página 88 do livro de Matemática, números 1 ao 8.",
    requiredMaterials: "Régua de 30cm para aula de Geometria amanhã.",
    teacherNotice: "Lembrar que o trabalho de fração valendo ponto deve ser entregue nesta sexta-feira.",
    attachments: [],
    photos: []
  },
  {
    id: "post_3",
    date: "2026-09-05",
    classId: "5A",
    teacherName: "Prof.ª Mariana Costa",
    subject: "História",
    title: "A Formação dos Municípios e Patrimônio Cultural",
    activitiesDone: [
      "Exibição de documentário sobre cidades históricas brasileiras.",
      "Debate sobre o que é patrimônio material e imaterial."
    ],
    homework: "Pesquisar um patrimônio histórico da nossa cidade e trazer foto/desenho.",
    requiredMaterials: "",
    teacherNotice: "Excelente debate promovido pela turma!",
    attachments: [],
    photos: []
  }
];

export const INITIAL_NOTICES = [
  {
    id: "not_1",
    title: "Reunião Geral de Pais e Mestres - 3º Bimestre",
    category: "Reunião",
    scope: "Global",
    author: "Direção Pedagógica",
    date: "2026-09-07",
    eventDate: "16 de Setembro de 2026 às 19h00",
    content: "Convidamos todos os pais e responsáveis para a nossa Reunião de Pais referente ao acompanhamento do 3º Bimestre. A reunião ocorrerá de forma presencial no auditório principal da escola.",
    important: true,
    confirmedParents: ["user_pai_1"]
  },
  {
    id: "not_2",
    title: "Feira Científica e Tecnológica 2026",
    category: "Evento Escolar",
    scope: "Ensino Fundamental",
    author: "Coordenação de Ciências",
    date: "2026-09-04",
    eventDate: "25 de Setembro de 2026",
    content: "Os alunos do 5º ao 9º ano apresentarão seus projetos científicos. Convocamos a presença dos pais para prestigiar os experimentos e maquetes produzidas.",
    important: false,
    confirmedParents: ["user_pai_1"]
  },
  {
    id: "not_3",
    title: "Campanha de Vacinação e Atualização de Carteirinha",
    category: "Saúde Escolar",
    scope: "Global",
    author: "Enfermaria Escolar",
    date: "2026-09-01",
    eventDate: "Até 20 de Setembro",
    content: "Favor enviar via agenda ou entregar na secretaria a cópia atualizada da carteira de vacinação do aluno.",
    important: true,
    confirmedParents: []
  }
];

export const INITIAL_MESSAGES = [
  {
    id: "msg_1",
    studentId: "alu_001",
    studentName: "Lucas Oliveira Silva",
    classId: "5A",
    parentName: "Roberto Silva",
    recipientRole: "PROFESSOR",
    recipientName: "Prof.ª Mariana Costa",
    subject: "Justificativa de Ausência - Consulta Médica",
    category: "Falta / Saúde",
    lastUpdate: "2026-09-09 14:30",
    status: "Respondido",
    unreadForParent: false,
    unreadForTeacher: false,
    messages: [
      {
        id: "m1",
        sender: "PAI",
        authorName: "Roberto Silva",
        time: "09/09/2026 09:15",
        text: "Bom dia, Professora Mariana! Informo que o Lucas precisará faltar no período da manhã do dia 12/09 para realização de exames de rotina. Apresentaremos o atestado assim que retornarmos.",
        attachment: null
      },
      {
        id: "m2",
        sender: "PROFESSOR",
        authorName: "Prof.ª Mariana Costa",
        time: "09/09/2026 14:30",
        text: "Bom dia, Sr. Roberto! Agradeço pelo aviso prévio. A falta será abonada com o atestado e separarei os conteúdos e deveres de casa para que ele recupere tranquilamente.",
        attachment: null
      }
    ]
  },
  {
    id: "msg_2",
    studentId: "alu_001",
    studentName: "Lucas Oliveira Silva",
    classId: "5A",
    parentName: "Roberto Silva",
    recipientRole: "DIRECAO",
    recipientName: "Secretaria Escolar",
    subject: "Solicitação de Segunda Via de Carteirinha",
    category: "Secretaria",
    lastUpdate: "2026-09-08 10:11",
    status: "Aguardando",
    unreadForParent: false,
    unreadForTeacher: true,
    messages: [
      {
        id: "m201",
        sender: "PAI",
        authorName: "Roberto Silva",
        time: "08/09/2026 10:11",
        text: "Olá! Gostaria de saber qual o procedimento para solicitar a 2ª via da carteirinha de estudante do Lucas.",
        attachment: null
      }
    ]
  }
];

export const INITIAL_GRADES = {
  "alu_001": {
    studentName: "Lucas Oliveira Silva",
    classId: "5A",
    bimesters: [
      {
        bimester: "1º Bimestre",
        subjects: [
          { name: "Língua Portuguesa", grade: 8.5, attendance: 98, status: "Aprovado" },
          { name: "Matemática", grade: 9.0, attendance: 100, status: "Aprovado" },
          { name: "História", grade: 8.0, attendance: 96, status: "Aprovado" },
          { name: "Geografia", grade: 8.8, attendance: 98, status: "Aprovado" },
          { name: "Ciências", grade: 9.5, attendance: 100, status: "Aprovado" },
          { name: "Inglês", grade: 9.0, attendance: 95, status: "Aprovado" },
          { name: "Educação Física", grade: 10.0, attendance: 100, status: "Aprovado" },
          { name: "Artes", grade: 9.2, attendance: 98, status: "Aprovado" }
        ],
        teacherComments: "Lucas teve um excelente desempenho no 1º bimestre. Demonstra liderança e facilidade no raciocínio lógico."
      },
      {
        bimester: "2º Bimestre",
        subjects: [
          { name: "Língua Portuguesa", grade: 9.0, attendance: 96, status: "Aprovado" },
          { name: "Matemática", grade: 8.8, attendance: 98, status: "Aprovado" },
          { name: "História", grade: 8.5, attendance: 95, status: "Aprovado" },
          { name: "Geografia", grade: 9.2, attendance: 98, status: "Aprovado" },
          { name: "Ciências", grade: 9.0, attendance: 96, status: "Aprovado" },
          { name: "Inglês", grade: 8.5, attendance: 95, status: "Aprovado" },
          { name: "Educação Física", grade: 10.0, attendance: 100, status: "Aprovado" },
          { name: "Artes", grade: 9.5, attendance: 100, status: "Aprovado" }
        ],
        teacherComments: "Continua com ótimo padrão de estudo e organização nos cadernos."
      },
      {
        bimester: "3º Bimestre (Em Andamento)",
        subjects: [
          { name: "Língua Portuguesa", grade: 9.2, attendance: 100, status: "Em Acompanhamento" },
          { name: "Matemática", grade: 9.5, attendance: 98, status: "Em Acompanhamento" },
          { name: "História", grade: 8.8, attendance: 96, status: "Em Acompanhamento" },
          { name: "Geografia", grade: 9.0, attendance: 100, status: "Em Acompanhamento" },
          { name: "Ciências", grade: 9.8, attendance: 100, status: "Em Acompanhamento" },
          { name: "Inglês", grade: 9.0, attendance: 95, status: "Em Acompanhamento" },
          { name: "Educação Física", grade: 10.0, attendance: 100, status: "Em Acompanhamento" },
          { name: "Artes", grade: 9.5, attendance: 98, status: "Em Acompanhamento" }
        ],
        teacherComments: "Participação ativa nas feiras de ciências e projetos em grupo."
      }
    ]
  }
};
