import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://michaeel00_db_user:<db_password>@ac-z2kzdsw-shard-00-00.l00plm1.mongodb.net:27017,ac-z2kzdsw-shard-00-01.l00plm1.mongodb.net:27017,ac-z2kzdsw-shard-00-02.l00plm1.mongodb.net:27017/eduagenda?ssl=true&replicaSet=atlas-9c24lu-shard-0&authSource=admin&appName=Cluster0';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  if (MONGODB_URI.includes('<db_password>')) return null;

  try {
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    const db = client.db('eduagenda');
    cachedClient = client;
    cachedDb = db;
    return db;
  } catch (err) {
    console.error("❌ Erro ao conectar com o MongoDB Atlas:", err.message);
    return null;
  }
}

// Initial Seeds
const INITIAL_USERS = [
  {
    id: "db_usr_001",
    email: process.env.VITE_USER_PAI_EMAIL || "michaeel00@gmail.com",
    password: process.env.VITE_USER_PAI_PASSWORD || "Agenda@2026",
    role: "PAI",
    name: process.env.VITE_USER_PAI_NAME || "Michaeel Oliveira",
    status: "active",
    schoolId: "HORIZONTES_2026"
  },
  {
    id: "db_usr_002",
    email: process.env.VITE_USER_PROFESSOR_EMAIL || "mariana.costa@horizontesdosaber.edu.br",
    password: process.env.VITE_USER_PROFESSOR_PASSWORD || "Agenda@2026",
    role: "PROFESSOR",
    name: process.env.VITE_USER_PROFESSOR_NAME || "Prof.ª Mariana Costa",
    status: "active",
    schoolId: "HORIZONTES_2026"
  },
  {
    id: "db_usr_003",
    email: process.env.VITE_USER_DIRECAO_EMAIL || "direcao@horizontesdosaber.edu.br",
    password: process.env.VITE_USER_DIRECAO_PASSWORD || "Agenda@2026",
    role: "DIRECAO",
    name: process.env.VITE_USER_DIRECAO_NAME || "Dra. Beatriz Santos",
    status: "active",
    schoolId: "HORIZONTES_2026"
  }
];

const INITIAL_NOTICES = [
  {
    id: "not_001",
    title: "Reunião de Pais e Mestres - 3º Bimestre",
    category: "Reunião",
    scope: "Global",
    author: "Direção Pedagógica",
    date: "2026-09-07",
    eventDate: "16 de Setembro de 2026 às 19h00",
    important: true,
    content: "Convidamos todos os pais e responsáveis para a nossa Reunião de Pais referente ao acompanhamento do 3º Bimestre. A reunião ocorrerá de forma presencial no auditório principal da escola.",
    confirmedParents: ["db_usr_001"]
  },
  {
    id: "not_002",
    title: "Feira Científica e Tecnológica 2026",
    category: "Evento Escolar",
    scope: "Ensino Fundamental",
    author: "Coordenação de Ciências",
    date: "2026-09-04",
    eventDate: "25 de Setembro de 2026",
    important: false,
    content: "Os alunos do 5º ao 9º ano apresentarão seus projetos científicos. Convocamos a presença dos pais para prestigiar os experimentos e maquetes produzidas.",
    confirmedParents: []
  }
];

const INITIAL_DAILY_POSTS = [
  {
    id: "post_1",
    date: "2026-09-09",
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
  }
];

const DEFAULT_SUBJECTS = [
  { name: "Língua Portuguesa", grade: 8.5, attendance: 98, status: "Aprovado" },
  { name: "Matemática", grade: 9.0, attendance: 100, status: "Aprovado" },
  { name: "História", grade: 8.0, attendance: 96, status: "Aprovado" },
  { name: "Geografia", grade: 8.8, attendance: 98, status: "Aprovado" },
  { name: "Ciências", grade: 9.5, attendance: 100, status: "Aprovado" },
  { name: "Inglês", grade: 9.0, attendance: 95, status: "Aprovado" },
  { name: "Educação Física", grade: 10.0, attendance: 100, status: "Aprovado" },
  { name: "Artes", grade: 9.2, attendance: 98, status: "Aprovado" }
];

const INITIAL_GRADES = {
  "alu_001": {
    studentName: "Lucas Oliveira Silva",
    classId: "5A",
    bimesters: [
      { bimester: "1º Bimestre", subjects: DEFAULT_SUBJECTS, teacherComments: "Lucas teve um excelente desempenho no 1º bimestre." },
      { bimester: "2º Bimestre", subjects: DEFAULT_SUBJECTS, teacherComments: "Continua com ótimo padrão de estudo." },
      { bimester: "3º Bimestre (Em Andamento)", subjects: DEFAULT_SUBJECTS, teacherComments: "Participação ativa nas feiras." }
    ]
  }
};

const INITIAL_STUDENTS_ROSTER = {
  "5A": [
    { id: "alu_001", name: "Lucas Oliveira Silva", ra: "20260512", status: "Presente", parent: "Roberto Silva", parentPhone: "(11) 98844-1234" },
    { id: "alu_003", name: "Gabriel Santos Lima", ra: "20260513", status: "Presente", parent: "Marcos Lima", parentPhone: "(11) 97711-5544" },
    { id: "alu_004", name: "Isabella Fernandes", ra: "20260514", status: "Presente", parent: "Carla Fernandes", parentPhone: "(11) 96622-3311" }
  ]
};

const INITIAL_MESSAGES = [
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
        text: "Bom dia, Professora Mariana! Informo que o Lucas precisará faltar no período da manhã do dia 12/09.",
        attachment: null
      }
    ]
  }
];

async function seedDatabaseIfEmpty(db) {
  if (!db) return;
  try {
    if (await db.collection('users').countDocuments() === 0) {
      await db.collection('users').insertMany(INITIAL_USERS);
    }
    if (await db.collection('notices').countDocuments() === 0) {
      await db.collection('notices').insertMany(INITIAL_NOTICES);
    }
    if (await db.collection('daily_posts').countDocuments() === 0) {
      await db.collection('daily_posts').insertMany(INITIAL_DAILY_POSTS);
    }
    if (await db.collection('messages').countDocuments() === 0) {
      await db.collection('messages').insertMany(INITIAL_MESSAGES);
    }
    if (await db.collection('grades').countDocuments() === 0) {
      await db.collection('grades').insertOne({ _id: "school_grades", data: INITIAL_GRADES });
    }
    if (await db.collection('students_roster').countDocuments() === 0) {
      await db.collection('students_roster').insertOne({ _id: "school_roster", data: INITIAL_STUDENTS_ROSTER });
    }
  } catch (e) {}
}

// REST API Endpoints

app.get(['/api/health', '/health'], async (req, res) => {
  const db = await connectToDatabase();
  const isDbConnected = !!db;
  res.json({
    status: isDbConnected ? 'ONLINE' : 'OFFLINE_OR_PENDING_PASSWORD',
    database: 'MongoDB Atlas',
    cluster: 'Cluster0 (Vercel Serverless)',
    connected: isDbConnected,
    uriConfigured: !MONGODB_URI.includes('<db_password>'),
    timestamp: new Date().toISOString()
  });
});

app.get(['/api/sync', '/sync'], async (req, res) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      await seedDatabaseIfEmpty(db);
      const dailyPosts = await db.collection('daily_posts').find({}).toArray();
      const notices = await db.collection('notices').find({}).toArray();
      const messages = await db.collection('messages').find({}).toArray();
      
      const gradesDoc = await db.collection('grades').findOne({ _id: "school_grades" });
      const rosterDoc = await db.collection('students_roster').findOne({ _id: "school_roster" });

      return res.json({
        dailyPosts: dailyPosts.length > 0 ? dailyPosts : INITIAL_DAILY_POSTS,
        notices: notices.length > 0 ? notices : INITIAL_NOTICES,
        messages: messages.length > 0 ? messages : INITIAL_MESSAGES,
        grades: gradesDoc?.data || INITIAL_GRADES,
        studentsRoster: rosterDoc?.data || INITIAL_STUDENTS_ROSTER
      });
    }
    return res.json({
      dailyPosts: INITIAL_DAILY_POSTS,
      notices: INITIAL_NOTICES,
      messages: INITIAL_MESSAGES,
      grades: INITIAL_GRADES,
      studentsRoster: INITIAL_STUDENTS_ROSTER
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/auth/login', '/auth/login'], async (req, res) => {
  const { email, password, targetRole } = req.body;
  const cleanEmail = email?.trim().toLowerCase();
  const cleanPassword = password?.trim();

  if (!cleanEmail || !cleanPassword) {
    return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const db = await connectToDatabase();
    let user = null;
    if (db) {
      user = await db.collection('users').findOne({ email: cleanEmail });
    }

    if (!user) {
      user = INITIAL_USERS.find(u => u.email.toLowerCase() === cleanEmail);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Acesso Negado (HTTP 404): Usuário não encontrado no MongoDB Atlas.'
      });
    }

    if (user.password !== cleanPassword) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Acesso Negado (HTTP 401): Senha incorreta para o e-mail informado.'
      });
    }

    return res.json({
      success: true,
      statusCode: 200,
      role: targetRole || user.role,
      user: {
        id: user.id || user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      message: 'Autenticado com sucesso via MongoDB Atlas Cloud!'
    });
  } catch (error) {
    res.status(500).json({ success: false, statusCode: 500, message: 'Erro interno ao consultar MongoDB Atlas.' });
  }
});

app.get(['/api/posts', '/posts'], async (req, res) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const posts = await db.collection('daily_posts').find({}).toArray();
      return res.json(posts);
    }
    return res.json(INITIAL_DAILY_POSTS);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/posts', '/posts'], async (req, res) => {
  try {
    const post = {
      ...req.body,
      id: req.body.id || `post_${Date.now()}`
    };
    const db = await connectToDatabase();
    if (db) {
      await db.collection('daily_posts').insertOne(post);
    }
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get(['/api/notices', '/notices'], async (req, res) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const notices = await db.collection('notices').find({}).toArray();
      return res.json(notices);
    }
    return res.json(INITIAL_NOTICES);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/notices', '/notices'], async (req, res) => {
  try {
    const notice = {
      ...req.body,
      id: req.body.id || `not_${Date.now()}`,
      date: req.body.date || new Date().toISOString().split('T')[0],
      confirmedParents: req.body.confirmedParents || []
    };
    const db = await connectToDatabase();
    if (db) {
      await db.collection('notices').insertOne(notice);
    }
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put(['/api/notices/:id/confirm', '/notices/:id/confirm'], async (req, res) => {
  const { id } = req.params;
  const { parentId } = req.body;
  try {
    const db = await connectToDatabase();
    if (db) {
      await db.collection('notices').updateOne(
        { id },
        { $addToSet: { confirmedParents: parentId } }
      );
    }
    res.json({ success: true, id, parentId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get(['/api/grades', '/grades'], async (req, res) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const gradesDoc = await db.collection('grades').findOne({ _id: "school_grades" });
      if (gradesDoc) return res.json(gradesDoc.data);
    }
    return res.json(INITIAL_GRADES);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put(['/api/grades', '/grades'], async (req, res) => {
  try {
    const newGradesData = req.body;
    const db = await connectToDatabase();
    if (db) {
      await db.collection('grades').updateOne(
        { _id: "school_grades" },
        { $set: { data: newGradesData } },
        { upsert: true }
      );
    }
    res.json({ success: true, data: newGradesData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/grades/bimester', '/grades/bimester'], async (req, res) => {
  const { bimesterName } = req.body;
  try {
    const db = await connectToDatabase();
    if (db) {
      const gradesDoc = await db.collection('grades').findOne({ _id: "school_grades" });
      const currentData = gradesDoc?.data || INITIAL_GRADES;
      const updated = { ...currentData };

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

      await db.collection('grades').updateOne(
        { _id: "school_grades" },
        { $set: { data: updated } },
        { upsert: true }
      );
      return res.json({ success: true, data: updated });
    }
    res.json({ success: true, bimesterName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get(['/api/students', '/students'], async (req, res) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const rosterDoc = await db.collection('students_roster').findOne({ _id: "school_roster" });
      if (rosterDoc) return res.json(rosterDoc.data);
    }
    return res.json(INITIAL_STUDENTS_ROSTER);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/students', '/students'], async (req, res) => {
  const { classId, student } = req.body;
  try {
    const db = await connectToDatabase();
    if (db) {
      const rosterDoc = await db.collection('students_roster').findOne({ _id: "school_roster" });
      const currentRoster = rosterDoc?.data || INITIAL_STUDENTS_ROSTER;
      const currentClassList = currentRoster[classId] || [];

      const updatedRoster = {
        ...currentRoster,
        [classId]: [...currentClassList, student]
      };

      await db.collection('students_roster').updateOne(
        { _id: "school_roster" },
        { $set: { data: updatedRoster } },
        { upsert: true }
      );

      const gradesDoc = await db.collection('grades').findOne({ _id: "school_grades" });
      const currentGrades = gradesDoc?.data || INITIAL_GRADES;

      const updatedGrades = {
        ...currentGrades,
        [student.id]: {
          studentName: student.name,
          classId,
          bimesters: [
            { bimester: "1º Bimestre", subjects: DEFAULT_SUBJECTS, teacherComments: "Aluno matriculado." },
            { bimester: "2º Bimestre", subjects: DEFAULT_SUBJECTS, teacherComments: "Desempenho regular." },
            { bimester: "3º Bimestre (Em Andamento)", subjects: DEFAULT_SUBJECTS, teacherComments: "Matrícula recente." }
          ]
        }
      };

      await db.collection('grades').updateOne(
        { _id: "school_grades" },
        { $set: { data: updatedGrades } },
        { upsert: true }
      );

      return res.json({ success: true, roster: updatedRoster, grades: updatedGrades });
    }
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get(['/api/messages', '/messages'], async (req, res) => {
  try {
    const db = await connectToDatabase();
    if (db) {
      const msgs = await db.collection('messages').find({}).toArray();
      return res.json(msgs);
    }
    return res.json(INITIAL_MESSAGES);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/messages', '/messages'], async (req, res) => {
  const { threadId, message, newThread } = req.body;
  try {
    const db = await connectToDatabase();
    if (db) {
      if (newThread) {
        await db.collection('messages').insertOne(newThread);
      } else if (threadId && message) {
        await db.collection('messages').updateOne(
          { id: threadId },
          {
            $push: { messages: message },
            $set: {
              status: message.sender === 'PAI' ? 'Aguardando' : 'Respondido',
              lastUpdate: new Date().toISOString().split('T')[0],
              unreadForParent: message.sender !== 'PAI',
              unreadForTeacher: message.sender === 'PAI'
            }
          }
        );
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default async function handler(req, res) {
  const db = await connectToDatabase();
  if (db) {
    await seedDatabaseIfEmpty(db);
  }
  return app(req, res);
}
