import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://michaeel00_db_user:<db_password>@ac-z2kzdsw-shard-00-00.l00plm1.mongodb.net:27017,ac-z2kzdsw-shard-00-01.l00plm1.mongodb.net:27017,ac-z2kzdsw-shard-00-02.l00plm1.mongodb.net:27017/eduagenda?ssl=true&replicaSet=atlas-9c24lu-shard-0&authSource=admin&appName=Cluster0';

let dbClient = null;
let db = null;

// Initial Mock Data Seeds for MongoDB Atlas
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
    id: "nt_001",
    title: "Reunião de Pais e Mestres - 3º Bimestre",
    category: "Reunião",
    scope: "Global",
    author: "Direção Pedagógica",
    date: "12/09/2026",
    eventDate: "25/09/2026 às 19:00",
    important: true,
    content: "Convidamos todos os pais e responsáveis para a reunião presencial no auditório principal da escola.",
    confirmedParents: ["db_usr_001"]
  },
  {
    id: "nt_002",
    title: "Campanha Escolar de Vacinação e Saúde",
    category: "Saúde Escolar",
    scope: "Global",
    author: "Coordenação de Enfermagem",
    date: "08/09/2026",
    eventDate: "18/09/2026",
    important: false,
    content: "Posto de saúde móvel estará na escola para atualização das carteiras de vacinação dos alunos do Fundamental 1.",
    confirmedParents: []
  }
];

async function connectToMongoDB() {
  if (MONGODB_URI.includes('<db_password>')) {
    console.warn('\n⚠️ [MongoDB Atlas] ATENÇÃO: Substitua a tag <db_password> pela senha real do usuário no arquivo .env!\n');
    return false;
  }

  try {
    console.log('🔄 Conectando ao MongoDB Atlas...');
    dbClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    await dbClient.connect();
    db = dbClient.db('eduagenda');
    console.log('✅ [MongoDB Atlas] Conexão estabelecida com sucesso com a nuvem!');

    // Seed database if needed
    const usersCol = db.collection('users');
    const userCount = await usersCol.countDocuments();
    if (userCount === 0) {
      await usersCol.insertMany(INITIAL_USERS);
      console.log('🌱 Base de Usuários inicial semeada no MongoDB Atlas!');
    }

    const noticesCol = db.collection('notices');
    const noticeCount = await noticesCol.countDocuments();
    if (noticeCount === 0) {
      await noticesCol.insertMany(INITIAL_NOTICES);
      console.log('🌱 Mural de Avisos inicial semeado no MongoDB Atlas!');
    }

    return true;
  } catch (error) {
    console.error('❌ [MongoDB Atlas] Erro ao conectar:', error.message);
    return false;
  }
}

// REST API Endpoints

// 1. Health check & status
app.get('/api/health', async (req, res) => {
  const isDbConnected = !!db;
  res.json({
    status: isDbConnected ? 'ONLINE' : 'OFFLINE_OR_PENDING_PASSWORD',
    database: 'MongoDB Atlas',
    cluster: 'Cluster0 (ac-z2kzdsw)',
    connected: isDbConnected,
    uriConfigured: !MONGODB_URI.includes('<db_password>'),
    timestamp: new Date().toISOString()
  });
});

// 2. Auth - Verify login credentials
app.post('/api/auth/login', async (req, res) => {
  const { email, password, targetRole } = req.body;
  const cleanEmail = email?.trim().toLowerCase();
  const cleanPassword = password?.trim();

  if (!cleanEmail || !cleanPassword) {
    return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    let user = null;
    if (db) {
      user = await db.collection('users').findOne({ email: cleanEmail });
    }

    // Fallback search if DB is connecting or pending password
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

// 3. Notices - GET & POST
app.get('/api/notices', async (req, res) => {
  try {
    if (db) {
      const notices = await db.collection('notices').find({}).toArray();
      return res.json(notices);
    }
    return res.json(INITIAL_NOTICES);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notices', async (req, res) => {
  try {
    const notice = {
      ...req.body,
      id: `nt_${Date.now()}`,
      confirmedParents: []
    };
    if (db) {
      await db.collection('notices').insertOne(notice);
    }
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notices/:id/confirm', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    if (db) {
      await db.collection('notices').updateOne(
        { id },
        { $addToSet: { confirmedParents: userId } }
      );
    }
    res.json({ success: true, id, userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server & Connect MongoDB Atlas
app.listen(PORT, async () => {
  console.log(`\n🚀 [EduAgenda Server] API rodando na porta ${PORT}`);
  console.log(`📍 Endpoint local: http://localhost:${PORT}/api/health`);
  await connectToMongoDB();
});
